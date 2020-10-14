using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

using Neodynamic.SDK.Printing;

namespace ThermalLabelSdkSamplesWPFCS
{
    /// <summary>
    /// Interaction logic for ImageFormatDialog.xaml
    /// </summary>
    public partial class ImageFormatDialog : Window
    {

        ImageFormat _imageFormat = ImageFormat.Png;

        public ImageFormat ImageFormat
        {
            get { return _imageFormat; }            
        }

        public ImageFormatDialog()
        {
            InitializeComponent();
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            this.DialogResult = true;

            if (rbSvg.IsChecked == true)
            {
                MessageBox.Show("SVG output format is NOT available in TRIAL mode! Request a 30-days Product Key at https://neodynamic.com/support", "SVG INFO", MessageBoxButton.OK, MessageBoxImage.Exclamation);

                _imageFormat = Neodynamic.SDK.Printing.ImageFormat.Svg;
            }
            else if (rbPng.IsChecked == true)
                _imageFormat = Neodynamic.SDK.Printing.ImageFormat.Png;
            else if (rbJpeg.IsChecked == true)
                _imageFormat = Neodynamic.SDK.Printing.ImageFormat.Jpeg;
            else if (rbPcx.IsChecked == true)
                _imageFormat = Neodynamic.SDK.Printing.ImageFormat.Pcx;
        }
    }
}
