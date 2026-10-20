using Neodynamic.SDK.Printing;
using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Xml;

namespace TLWindowsEditorWPFDemo
{
    /// <summary>
    /// Interaction logic for GalleryUC.xaml
    /// 
    /// Nothing here blocks the UI thread:
    ///  - the network I/O is awaited (HttpClient),
    ///  - the thumbnails are rendered on thread-pool threads (the BitmapImage is frozen so it can cross threads),
    ///  - the UI only receives the finished result.
    /// The gallery tiles show up immediately ("Loading...") and are completed as each template arrives.
    /// </summary>
    public partial class GalleryUC : UserControl
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

        static GalleryUC()
        {
            // raw.githubusercontent.com requires TLS 1.2 (not enabled by default on older .NET Framework versions)
            System.Net.ServicePointManager.SecurityProtocol |= System.Net.SecurityProtocolType.Tls12;

            _http = new HttpClient();
            _http.Timeout = TimeSpan.FromSeconds(30);
            _http.DefaultRequestHeaders.CacheControl = new System.Net.Http.Headers.CacheControlHeaderValue { NoCache = true, NoStore = true };
        }

        public GalleryUC()
        {
            InitializeComponent();
        }

        private void Gallery_Initialized(object sender, EventArgs e)
        {
            LoadGalleryEntries();
        }

        /// <summary>
        /// Starts (or restarts) loading the gallery. Returns immediately.
        /// </summary>
        public void LoadGalleryEntries()
        {
            // fire and forget: errors are handled inside
            var ignored = LoadGalleryEntriesAsync();
        }

        /// <summary>
        /// Loads the gallery asynchronously. Await it if you need to know when every thumbnail has been processed.
        /// Calling it again cancels the load in progress.
        /// </summary>
        public async Task LoadGalleryEntriesAsync()
        {
            // cancel any load in progress
            if (_cts != null)
                _cts.Cancel();
            _cts = new CancellationTokenSource();
            var ct = _cts.Token;

            this.Entries.Clear();
            if (this.pnlEntries != null)
                this.pnlEntries.Children.Clear();

            try
            {
                // 1) gallery index
                byte[] indexData = await DownloadAsync(_urlGallery + "index-v10.xml", ct);
                var entries = ParseIndex(indexData);

                if (ct.IsCancellationRequested)
                    return;

                // 2) one tile per entry right away (keeps the original order), completed later
                var tiles = new List<GalleryTile>();
                foreach (var entry in entries)
                {
                    this.Entries.Add(entry);
                    var tile = CreateTile(entry.Name, this.Entries.Count);
                    tiles.Add(tile);
                    this.pnlEntries.Children.Add(tile.Panel);
                }

                // 3) templates + thumbnails, a few at a time
                using (var gate = new SemaphoreSlim(MaxParallelDownloads))
                {
                    var jobs = new List<Task>();
                    for (int i = 0; i < entries.Count; i++)
                        jobs.Add(LoadEntryAsync(entries[i], tiles[i], gate, ct));

                    await Task.WhenAll(jobs);
                }
            }
            catch (OperationCanceledException)
            {
                // a newer load replaced this one
            }
            catch (Exception ex)
            {
                if (!ct.IsCancellationRequested)
                    ShowGalleryError(ex.Message);
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
            await gate.WaitAsync(ct);
            try
            {
                // download (awaited: the UI thread is free)
                byte[] data = await DownloadAsync(_urlGallery + entry.Filename, ct);
                string xml = Encoding.UTF8.GetString(data);

                // render off the UI thread
                byte[] thumbnailBytes = await Task.Run(() => RenderThumbnail(xml), ct);

                ct.ThrowIfCancellationRequested();

                // back on the UI thread
                BitmapImage thumbnail = CreateBitmap(thumbnailBytes);
                entry.XmlContent = xml;
                tile.Border.Child = new Image() { Source = thumbnail, Stretch = Stretch.None, Margin = new Thickness(10) };
                tile.EditButton.IsEnabled = true;
            }
            catch (OperationCanceledException)
            {
                throw;
            }
            catch
            {
                // this entry failed: the rest of the gallery keeps loading
                tile.Border.Child = new TextBlock() { Text = "Not available", Foreground = Brushes.Firebrick, Margin = new Thickness(10), VerticalAlignment = VerticalAlignment.Center };
            }
            finally
            {
                gate.Release();
            }
        }

        // Runs on a thread-pool thread: only the expensive part (rendering). It returns the encoded image bytes;
        // the (cheap) BitmapImage decoding happens on the UI thread, so there is no cross-thread Freezable involved.
        private static byte[] RenderThumbnail(string xml)
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
                    using (var entryStream = zip.Entries[0].Open())
                    using (var buffer = new MemoryStream())
                    {
                        entryStream.CopyTo(buffer);
                        return buffer.ToArray();
                    }
                }

                return ms.ToArray();
            }
        }

        // UI thread
        private static BitmapImage CreateBitmap(byte[] imageBytes)
        {
            var img = new BitmapImage();
            using (var ms = new MemoryStream(imageBytes))
            {
                img.BeginInit();
                img.CacheOption = BitmapCacheOption.OnLoad; // fully decoded here, the stream can be closed afterwards
                img.StreamSource = ms;
                img.EndInit();
            }

            if (img.CanFreeze)
                img.Freeze();

            return img;
        }

        // ---------------------------------------------------------------- UI

        private class GalleryTile
        {
            public StackPanel Panel;
            public Border Border;
            public Button EditButton;
        }

        private GalleryTile CreateTile(string name, int oneBasedIndex)
        {
            var labelName = new TextBlock() { Text = name, Foreground = new SolidColorBrush(Colors.White), Margin = new Thickness(0, 0, 0, 10) };

            var labelBorder = new Border()
            {
                BorderThickness = new Thickness(1),
                BorderBrush = new SolidColorBrush(Colors.DarkGray),
                Background = new SolidColorBrush(Colors.WhiteSmoke),
                Margin = new Thickness(0, 0, 0, 10),
                MinWidth = ThumbnailSize + 20,
                MinHeight = 100
            };
            labelBorder.Child = new TextBlock() { Text = "Loading...", Foreground = Brushes.DimGray, Margin = new Thickness(10), VerticalAlignment = VerticalAlignment.Center, HorizontalAlignment = HorizontalAlignment.Center };

            // disabled until its template has been downloaded
            var labelEdit = new Button() { Content = "Edit...", Tag = oneBasedIndex, IsEnabled = false };
            labelEdit.Click += LabelEdit_Click;

            var labelPanel = new StackPanel() { Margin = new Thickness(10) };
            labelPanel.Children.Add(labelName);
            labelPanel.Children.Add(labelBorder);
            labelPanel.Children.Add(labelEdit);

            return new GalleryTile() { Panel = labelPanel, Border = labelBorder, EditButton = labelEdit };
        }

        private void ShowGalleryError(string message)
        {
            this.pnlEntries.Children.Clear();
            this.pnlEntries.Children.Add(new TextBlock()
            {
                Text = "Online Label Gallery is not available. " + message,
                Foreground = Brushes.White,
                Margin = new Thickness(10)
            });
        }

        private void LabelEdit_Click(object sender, RoutedEventArgs e)
        {
            this.LabelIndex = (int)(((Button)sender).Tag) - 1;
            if (EditLabel != null)
                EditLabel(this, EventArgs.Empty);
        }

        internal class ZipUtils
        {
            private const int ZIP_LEAD_BYTES = 0x04034b50;
            private const ushort GZIP_LEAD_BYTES = 0x8b1f;


            public static bool IsPkZipCompressedData(byte[] data)
            {
                // if the first 4 bytes of the array are the ZIP signature then it is compressed data
                return (BitConverter.ToInt32(data, 0) == ZIP_LEAD_BYTES);
            }

            public static bool IsGZipCompressedData(byte[] data)
            {
                // if the first 2 bytes of the array are theG ZIP signature then it is compressed data;
                return (BitConverter.ToUInt16(data, 0) == GZIP_LEAD_BYTES);
            }

            public static bool IsCompressedData(byte[] data)
            {
                return IsPkZipCompressedData(data) || IsGZipCompressedData(data);
            }

            public static byte[] GetInitBytes(Stream stream, int count)
            {
                stream.Seek(0, 0);

                try
                {
                    byte[] bytes = new byte[count];

                    stream.Read(bytes, 0, count);

                    return bytes;
                }
                finally
                {
                    stream.Seek(0, 0);  // set the stream back to the begining
                }
            }
        }

    }
}