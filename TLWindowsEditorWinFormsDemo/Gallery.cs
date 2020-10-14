using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO;
using System.Xml;
using Neodynamic.SDK.Printing;
using System.IO.Compression;

namespace TLWindowsEditorWinFormsDemo
{
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
        System.Net.WebClient wc = null;
        System.Net.WebClient wcThumbnail = null;

        public List<GalleryEntry> Entries = new List<GalleryEntry>();

        int _index = 1;

        string _urlGallery = "https://raw.githubusercontent.com/neodynamic/ThermalLabel-SDK/main/LabelsGallery/";

        public event EventHandler EditLabel;

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

        public void DoRefresh()
        {
            tbbRefresh_Click(this, EventArgs.Empty);
        }

        private void tbbRefresh_Click(object sender, EventArgs e)
        {
            this.Entries.Clear();
            fpnlContainer.Controls.Clear();
            _index = 1;

            try
            {
                if (wc == null)
                {
                    wc = new System.Net.WebClient();
                    wc.CachePolicy = new System.Net.Cache.RequestCachePolicy(System.Net.Cache.RequestCacheLevel.NoCacheNoStore);
                    wc.DownloadDataCompleted += Wc_DownloadDataCompleted;
                }

                wc.DownloadDataTaskAsync(new Uri($"{_urlGallery}index-v10.xml"));
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void Wc_DownloadDataCompleted(object sender, System.Net.DownloadDataCompletedEventArgs e)
        {
            try
            {
                using (var ms = new MemoryStream(e.Result))
                {
                    var xmlr = XmlReader.Create(ms);
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
                                this.Entries.Add(new GalleryEntry(name, category, filename, ""));
                        }
                    }
                }

                this.pbGallery.Step = (int)(100d / (double)this.Entries.Count);

                foreach (var entry in this.Entries)
                {
                    var downloadTemplateUrl = $"{_urlGallery}{entry.Filename}";

                    if (wcThumbnail == null)
                    {
                        wcThumbnail = new System.Net.WebClient();
                        wcThumbnail.CachePolicy = new System.Net.Cache.RequestCachePolicy(System.Net.Cache.RequestCacheLevel.NoCacheNoStore);
                        wcThumbnail.DownloadDataCompleted += WcThumbnail_DownloadDataCompleted;
                    }

                    while (wcThumbnail.IsBusy)
                    {
                        //downloading
                    }
                    wcThumbnail.DownloadDataTaskAsync(new Uri(downloadTemplateUrl));
                }
            }
            catch
            {
                //MessageBox.Show("Online Label Gallery is not available.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }

            if (wcThumbnail != null)
                wcThumbnail.Dispose();
            if (wc != null)
                wc.Dispose();
            
            
        }

        private void WcThumbnail_DownloadDataCompleted(object sender, System.Net.DownloadDataCompletedEventArgs e)
        {
            int thumbnailSize = 200;

            this.Entries[_index - 1].XmlContent = Encoding.UTF8.GetString(e.Result);
            var tl = ThermalLabel.CreateFromXmlTemplate(this.Entries[_index - 1].XmlContent);
            var ms = new MemoryStream();
            using (var pj = new PrintJob())
            {
                pj.ExportToImage(tl, ms, new ImageSettings() { AntiAlias = true, ImageFormat = ImageFormat.Png, ThumbnailSize = thumbnailSize }, 96);
            }

            System.Drawing.Image imgLabel = null;

            if (ZipUtils.IsPkZipCompressedData(ZipUtils.GetInitBytes(ms, 4)))
            {
                using (var zip = new ZipArchive(ms))
                {
                    foreach (var entry in zip.Entries)
                    {
                        imgLabel = System.Drawing.Image.FromStream(entry.Open());
                    }
                }
            }
            else
            {
                imgLabel = System.Drawing.Image.FromStream(ms);
            }

            var pb = new System.Windows.Forms.PictureBox();
            pb.SizeMode = PictureBoxSizeMode.CenterImage;
            pb.BorderStyle = BorderStyle.FixedSingle;
            pb.BackColor = System.Drawing.Color.WhiteSmoke;
            pb.Width = pb.Height = thumbnailSize + 20;
            
            pb.Image = imgLabel;


            var lbl = new Label();
            lbl.TextAlign = ContentAlignment.MiddleCenter;
            lbl.AutoSize = false;
            lbl.Width = thumbnailSize + 20;
            lbl.Height = 30;
            lbl.Text = this.Entries[_index - 1].Name;
            lbl.ForeColor = System.Drawing.Color.White;

            var btn = new Button();
            btn.Text = "Edit...";
            btn.Width = thumbnailSize + 20;
            btn.Height = 30;
            btn.BackColor = System.Drawing.SystemColors.ButtonFace;
            btn.Tag = _index;
            btn.Click += Btn_Click;
            
            var uc = new UserControl();
            uc.Controls.Add(lbl);
            uc.Controls.Add(pb);
            uc.Controls.Add(btn);

            pb.Top = lbl.Height;
            btn.Top = pb.Top + pb.Height;
            uc.Height = btn.Top + btn.Height;
            uc.Width = pb.Width;


            fpnlContainer.Controls.Add(uc);
            
            this.pbGallery.Value = _index * this.pbGallery.Step;
            if(_index == this.Entries.Count) this.pbGallery.Value = 0;
            _index++;
        }

        private void Btn_Click(object sender, EventArgs e)
        {
            this.LabelIndex = (int)(((Button)sender).Tag) - 1;
            if (EditLabel != null)
                EditLabel(this, EventArgs.Empty);
        }
    }
}
