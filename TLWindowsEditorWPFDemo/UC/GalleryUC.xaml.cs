using Neodynamic.SDK.Printing;
using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Xml;

namespace TLWindowsEditorWPFDemo
{
    /// <summary>
    /// Interaction logic for GalleryUC.xaml
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
        System.Net.WebClient wc = null;
        System.Net.WebClient wcThumbnail = null;

        public List<GalleryEntry> Entries = new List<GalleryEntry>();

        int _index = 1;

        string _urlGallery = "https://raw.githubusercontent.com/neodynamic/ThermalLabel-SDK/main/LabelsGallery/";

        public event EventHandler EditLabel;

        public GalleryUC()
        {
            InitializeComponent();

            
        }

        private void Gallery_Initialized(object sender, EventArgs e)
        {
            LoadGalleryEntries();
        }

        public void LoadGalleryEntries()
        {
            this.Entries.Clear();
            
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
                MessageBox.Show(ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
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

                //this.pbGallery.Value = (double)this.Entries.Count;

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

            BitmapImage imgLabel = new BitmapImage();

            if (ZipUtils.IsPkZipCompressedData(ZipUtils.GetInitBytes(ms, 4)))
            {
                var zip = new ZipArchive(ms);
                imgLabel.BeginInit();
                imgLabel.CacheOption = BitmapCacheOption.OnLoad;
                imgLabel.StreamSource = zip.Entries[0].Open();
                imgLabel.EndInit();
                    
            }
            else
            {
                imgLabel.BeginInit();
                imgLabel.CacheOption = BitmapCacheOption.OnLoad;
                imgLabel.StreamSource = ms;
                imgLabel.EndInit();
            }


            var labelName = new TextBlock() { Text = this.Entries[_index - 1].Name, Foreground=new SolidColorBrush(Colors.White), Margin = new Thickness(0, 0, 0, 10) };


            var labelBorder = new Border() { BorderThickness = new Thickness(1), BorderBrush = new SolidColorBrush(Colors.DarkGray), Background = new SolidColorBrush(Colors.WhiteSmoke), Margin = new Thickness(0, 0, 0, 10) };
            var labelThumbnail = new Image() { Source = imgLabel, Stretch = Stretch.None, Margin = new Thickness(10) };
            labelBorder.Child = labelThumbnail;

            var labelEdit = new Button() { Content = "Edit...", Tag=_index };
            labelEdit.Click += LabelEdit_Click;

            var labelPanel = new StackPanel() { Margin = new Thickness(10) };
            labelPanel.Children.Add(labelName);
            labelPanel.Children.Add(labelBorder);
            labelPanel.Children.Add(labelEdit);

            this.pnlEntries.Children.Add(labelPanel);

            //this.pbGallery.Value++;
            //if (_index == this.Entries.Count) this.pbGallery.Value = 0;
            _index++;
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
