using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
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

namespace ThermalLabelSdkSamplesWPFCS
{
    /// <summary>
    /// Interaction logic for ImageViewer.xaml
    /// </summary>
    public partial class ImageViewer : UserControl
    {
        ImageSource currentImage = null;
        int iCurrPage = 1, iPages = 1;
        
        public ImageViewer()
        {
            InitializeComponent();

            //RenderOptions.SetBitmapScalingMode(imgLabel, BitmapScalingMode.NearestNeighbor);

        }

        string[] imgFiles = null;
        public void LoadImages(string folder)
        {
            imgLabel.Source = null;

            if (Directory.Exists(folder))
            {
                imgFiles = Directory.GetFiles(folder, "*.png");

                iCurrPage = 1;
                this.RefreshImage();
            }
        }

        public void Clear() { if (imgLabel.Source != null) imgLabel.Source = null; }

        public void RefreshImage()
        {
            iPages = imgFiles.Length;
            lblNumOfLabels.Text = "Label " + iCurrPage.ToString() + " of " + iPages.ToString();

            BitmapImage bmi = new BitmapImage();
            bmi.BeginInit();
            bmi.CreateOptions = BitmapCreateOptions.IgnoreImageCache;
            bmi.CacheOption = BitmapCacheOption.OnLoad;
            bmi.UriSource = new Uri(imgFiles[iCurrPage - 1]);
            bmi.EndInit();

            currentImage = ConvertBitmapTo96DPI(bmi);
            imgLabel.Source = currentImage;
            imgLabel.Width = currentImage.Width;
            imgLabel.Height = currentImage.Height;
            
        }

        private void btnPrev_Click(object sender, RoutedEventArgs e)
        {
            if (iCurrPage > 1)
            {
                iCurrPage--;
                this.RefreshImage();
            }
        }

        private void btnNext_Click(object sender, RoutedEventArgs e)
        {
            if (iCurrPage < iPages)
            {
                iCurrPage++;
                this.RefreshImage();
            }
        }

        public BitmapSource ConvertBitmapTo96DPI(BitmapImage bitmapFrame)
        {
            double dpi = 96;
            int width = bitmapFrame.PixelWidth;
            int height = bitmapFrame.PixelHeight;
            
            int stride = width * (bitmapFrame.Format.BitsPerPixel / 4); 
            byte[] pixelData = new byte[stride * height];
            bitmapFrame.CopyPixels(pixelData, stride, 0);

            return BitmapSource.Create(width, height, dpi, dpi, bitmapFrame.Format, null, pixelData, stride);
        }

    }
}
