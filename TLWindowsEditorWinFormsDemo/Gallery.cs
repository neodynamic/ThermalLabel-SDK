using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Data;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO;
using System.Xml;
using Neodynamic.SDK.Printing;
using System.IO.Compression;

namespace TLWindowsEditorWinFormsDemo
{
    /// <summary>
    /// Online labels gallery.
    /// Nothing here blocks the UI thread:
    ///  - the network I/O is awaited (HttpClient),
    ///  - the thumbnails are rendered on thread-pool threads,
    ///  - the UI only receives the finished bitmaps.
    /// The gallery tiles show up immediately ("Loading...") and are completed as each template arrives.
    /// </summary>
    public partial class Gallery : UserControl
    {

        public class GalleryEntry
        {
            public string Name;
            public string Category;
            public string Filename;
            public string XmlContent;

            public GalleryEntry(string name, string category, string filename, string xmlContent)
            {
                this.Name = name; this.Category = category; this.Filename = filename; this.XmlContent = xmlContent;
            }
        }


        public int LabelIndex = 0;

        public List<GalleryEntry> Entries = new List<GalleryEntry>();

        const int ThumbnailSize = 200;
        const int MaxParallelDownloads = 4;

        static readonly HttpClient _http;

        string _urlGallery = "https://raw.githubusercontent.com/neodynamic/ThermalLabel-SDK/main/LabelsGallery/";

        CancellationTokenSource _cts;

        public event EventHandler EditLabel;

        static Gallery()
        {
            // raw.githubusercontent.com requires TLS 1.2 (not enabled by default on older .NET Framework versions)
            System.Net.ServicePointManager.SecurityProtocol |= System.Net.SecurityProtocolType.Tls12;

            _http = new HttpClient();
            _http.Timeout = TimeSpan.FromSeconds(30);
            _http.DefaultRequestHeaders.CacheControl = new System.Net.Http.Headers.CacheControlHeaderValue { NoCache = true, NoStore = true };
        }

        public Gallery()
        {
            InitializeComponent();

            lblGallerySource.Text = "https://github.com/neodynamic/ThermalLabel-SDK/blob/main/LabelsGallery/";
            lblGallerySource.IsLink = true;
            lblGallerySource.LinkBehavior = LinkBehavior.HoverUnderline;
            lblGallerySource.Click += LblGallerySource_Click;
        }

        private void LblGallerySource_Click(object sender, EventArgs e)
        {
            System.Diagnostics.Process.Start(lblGallerySource.Text);

        }

        // stop the work in progress if the control goes away
        protected override void OnHandleDestroyed(EventArgs e)
        {
            if (_cts != null)
                _cts.Cancel();
            base.OnHandleDestroyed(e);
        }

        /// <summary>
        /// Starts (or restarts) loading the gallery. Returns immediately.
        /// </summary>
        public void DoRefresh()
        {
            tbbRefresh_Click(this, EventArgs.Empty);
        }

        private void tbbRefresh_Click(object sender, EventArgs e)
        {
            // fire and forget: errors are handled inside
            var ignored = RefreshGalleryAsync();
        }

        /// <summary>
        /// Loads the gallery asynchronously. Await it if you need to know when every thumbnail has been processed.
        /// Calling it again cancels the load in progress.
        /// </summary>
        public async Task RefreshGalleryAsync()
        {
            // cancel any load in progress
            if (_cts != null)
                _cts.Cancel();
            _cts = new CancellationTokenSource();
            var ct = _cts.Token;

            this.Entries.Clear();
            ClearTiles();
            SetProgress(0);

            try
            {
                // 1) gallery index
                byte[] indexData = await DownloadAsync(_urlGallery + "index-v10.xml", ct);
                var entries = ParseIndex(indexData);

                if (ct.IsCancellationRequested || this.IsDisposed)
                    return;

                // 2) one tile per entry right away (keeps the original order), completed later
                var tiles = new List<GalleryTile>();
                fpnlContainer.SuspendLayout();
                try
                {
                    foreach (var entry in entries)
                    {
                        this.Entries.Add(entry);
                        var tile = CreateTile(entry.Name, this.Entries.Count);
                        tiles.Add(tile);
                        fpnlContainer.Controls.Add(tile.Container);
                    }
                }
                finally
                {
                    fpnlContainer.ResumeLayout(true);
                }

                // 3) templates + thumbnails, a few at a time
                int completed = 0;
                int total = entries.Count;

                using (var gate = new SemaphoreSlim(MaxParallelDownloads))
                {
                    var jobs = new List<Task>();
                    for (int i = 0; i < entries.Count; i++)
                    {
                        jobs.Add(LoadEntryAsync(entries[i], tiles[i], gate, ct));
                    }

                    // progress: update as each job finishes
                    var pending = new List<Task>(jobs);
                    while (pending.Count > 0)
                    {
                        var done = await Task.WhenAny(pending);
                        pending.Remove(done);
                        completed++;
                        if (!ct.IsCancellationRequested && !this.IsDisposed)
                            SetProgress(completed * 100 / total);
                    }
                }

                if (!this.IsDisposed)
                    SetProgress(0);
            }
            catch (OperationCanceledException)
            {
                // a newer load replaced this one
            }
            catch (Exception ex)
            {
                if (!ct.IsCancellationRequested && !this.IsDisposed)
                {
                    SetProgress(0);
                    ShowGalleryError(ex.Message);
                }
            }
        }

        // ---------------------------------------------------------------- network

        private static async Task<byte[]> DownloadAsync(string url, CancellationToken ct)
        {
            using (var response = await _http.GetAsync(url, HttpCompletionOption.ResponseContentRead, ct))
            {
                response.EnsureSuccessStatusCode();
                return await response.Content.ReadAsByteArrayAsync();
            }
        }

        private static List<GalleryEntry> ParseIndex(byte[] data)
        {
            var entries = new List<GalleryEntry>();

            using (var ms = new MemoryStream(data))
            using (var xmlr = XmlReader.Create(ms))
            {
                while (xmlr.Read())
                {
                    if (xmlr.IsStartElement())
                    {
                        var name = "";
                        if (xmlr.MoveToAttribute("name"))
                            name = xmlr.Value;

                        var category = "";
                        if (xmlr.MoveToAttribute("category"))
                            category = xmlr.Value;

                        var filename = "";
                        if (xmlr.MoveToAttribute("filename"))
                            filename = xmlr.Value;

                        if (string.IsNullOrWhiteSpace(name) == false)
                            entries.Add(new GalleryEntry(name, category, filename, ""));
                    }
                }
            }

            return entries;
        }

        // ---------------------------------------------------------------- one gallery entry

        private async Task LoadEntryAsync(GalleryEntry entry, GalleryTile tile, SemaphoreSlim gate, CancellationToken ct)
        {
            try
            {
                await gate.WaitAsync(ct);
            }
            catch (OperationCanceledException)
            {
                return;
            }

            try
            {
                // download (awaited: the UI thread is free)
                byte[] data = await DownloadAsync(_urlGallery + entry.Filename, ct);
                string xml = Encoding.UTF8.GetString(data);

                // render off the UI thread
                System.Drawing.Bitmap thumbnail = await Task.Run(() => RenderThumbnail(xml), ct);

                // back on the UI thread
                if (ct.IsCancellationRequested || this.IsDisposed)
                {
                    thumbnail.Dispose();
                    return;
                }

                entry.XmlContent = xml;
                tile.Picture.Image = thumbnail;
                tile.Picture.Controls.Clear();   // removes the "Loading..." text
                tile.EditButton.Enabled = true;
            }
            catch (OperationCanceledException)
            {
                // a newer load replaced this one
            }
            catch
            {
                // this entry failed: the rest of the gallery keeps loading
                if (!ct.IsCancellationRequested && !this.IsDisposed)
                    tile.StatusLabel.Text = "Not available";
            }
            finally
            {
                gate.Release();
            }
        }

        // Runs on a thread-pool thread. Returns a self-contained Bitmap (it doesn't depend on any stream).
        private static System.Drawing.Bitmap RenderThumbnail(string xml)
        {
            var tl = ThermalLabel.CreateFromXmlTemplate(xml);

            using (var ms = new MemoryStream())
            {
                using (var pj = new PrintJob())
                {
                    pj.ExportToImage(tl, ms, new ImageSettings() { AntiAlias = true, ImageFormat = ImageFormat.Png, ThumbnailSize = ThumbnailSize }, 96);
                }

                if (ms.Length >= 4 && ZipUtils.IsPkZipCompressedData(ZipUtils.GetInitBytes(ms, 4)))
                {
                    using (var zip = new ZipArchive(ms))
                    {
                        // same behavior as before: the last image of the package is used
                        var last = zip.Entries.Last();
                        using (var entryStream = last.Open())
                        using (var buffer = new MemoryStream())
                        {
                            entryStream.CopyTo(buffer);
                            return CopyToBitmap(buffer);
                        }
                    }
                }

                return CopyToBitmap(ms);
            }
        }

        // GDI+ images created with FromStream need the stream to stay open: copy the pixels into an independent Bitmap
        private static System.Drawing.Bitmap CopyToBitmap(MemoryStream ms)
        {
            ms.Seek(0, SeekOrigin.Begin);
            using (var img = System.Drawing.Image.FromStream(ms))
            {
                return new System.Drawing.Bitmap(img);
            }
        }

        // ---------------------------------------------------------------- UI

        private class GalleryTile
        {
            public UserControl Container;
            public PictureBox Picture;
            public Button EditButton;
            public Label StatusLabel;   // "Loading..." / "Not available"
        }

        private GalleryTile CreateTile(string name, int oneBasedIndex)
        {
            var pb = new System.Windows.Forms.PictureBox();
            pb.SizeMode = PictureBoxSizeMode.CenterImage;
            pb.BorderStyle = BorderStyle.FixedSingle;
            pb.BackColor = System.Drawing.Color.WhiteSmoke;
            pb.Width = pb.Height = ThumbnailSize + 20;

            var status = new Label();
            status.Dock = DockStyle.Fill;
            status.TextAlign = ContentAlignment.MiddleCenter;
            status.ForeColor = System.Drawing.Color.DimGray;
            status.BackColor = System.Drawing.Color.Transparent;
            status.Text = "Loading...";
            pb.Controls.Add(status);

            var lbl = new Label();
            lbl.TextAlign = ContentAlignment.MiddleCenter;
            lbl.AutoSize = false;
            lbl.Width = ThumbnailSize + 20;
            lbl.Height = 30;
            lbl.Text = name;
            lbl.ForeColor = System.Drawing.Color.White;

            // disabled until its template has been downloaded
            var btn = new Button();
            btn.Text = "Edit...";
            btn.Width = ThumbnailSize + 20;
            btn.Height = 30;
            btn.BackColor = System.Drawing.SystemColors.ButtonFace;
            btn.Tag = oneBasedIndex;
            btn.Enabled = false;
            btn.Click += Btn_Click;

            var uc = new UserControl();
            uc.Controls.Add(lbl);
            uc.Controls.Add(pb);
            uc.Controls.Add(btn);

            pb.Top = lbl.Height;
            btn.Top = pb.Top + pb.Height;
            uc.Height = btn.Top + btn.Height;
            uc.Width = pb.Width;

            return new GalleryTile() { Container = uc, Picture = pb, EditButton = btn, StatusLabel = status };
        }

        // removes the tiles releasing their bitmaps (Controls.Clear() alone doesn't dispose anything)
        private void ClearTiles()
        {
            var old = fpnlContainer.Controls.Cast<Control>().ToList();
            fpnlContainer.Controls.Clear();

            foreach (var c in old)
            {
                foreach (var pb in c.Controls.OfType<PictureBox>())
                {
                    if (pb.Image != null)
                    {
                        pb.Image.Dispose();
                        pb.Image = null;
                    }
                }
                c.Dispose();
            }
        }

        private void SetProgress(int percent)
        {
            this.pbGallery.Value = Math.Max(0, Math.Min(100, percent));
        }

        private void ShowGalleryError(string message)
        {
            ClearTiles();

            var lbl = new Label();
            lbl.AutoSize = true;
            lbl.ForeColor = System.Drawing.Color.White;
            lbl.Text = "Online Label Gallery is not available. " + message;
            fpnlContainer.Controls.Add(lbl);
        }

        private void Btn_Click(object sender, EventArgs e)
        {
            this.LabelIndex = (int)(((Button)sender).Tag) - 1;
            if (EditLabel != null)
                EditLabel(this, EventArgs.Empty);
        }
    }
}