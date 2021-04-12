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
using System.IO;
using Microsoft.Win32;
using Neodynamic.SDK.Printing;

namespace TLWindowsEditorWPFDemo.Dialogs
{
    /// <summary>
    /// Interaction logic for TTFtoPrinterStorageDialog.xaml
    /// </summary>
    public partial class TTFtoPrinterStorageDialog : Window
    {
        public TTFtoPrinterStorageDialog()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, RoutedEventArgs e)
        {
            //show font dialog
            System.Windows.Forms.FontDialog dlg = new System.Windows.Forms.FontDialog();

            if (dlg.ShowDialog() == System.Windows.Forms.DialogResult.OK)
            {
                txtFontFilePath.Text = GetSystemFontFileName(dlg.Font);

                lblFontName.FontFamily = new FontFamily(dlg.Font.Name);
                lblFontName.Text = dlg.Font.Name;
            }
        }

        private string GetSystemFontFileName(System.Drawing.Font font)
        {
            //Get Windows Fonts folder
            DirectoryInfo dirWindowsFolder = Directory.GetParent(Environment.GetFolderPath(Environment.SpecialFolder.System));
            string strFontsFolder = System.IO.Path.Combine(dirWindowsFolder.FullName, "Fonts");


            string fontname = font.Name + " (TrueType)";
            RegistryKey fonts = Registry.LocalMachine.OpenSubKey(@"Software\Microsoft\Windows NT\CurrentVersion\Fonts", false);
            if (fonts == null)
            {
                fonts = Registry.LocalMachine.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Fonts", false);
                if (fonts == null)
                {
                    throw new Exception("Can't find font registry database.");
                }
            }
            foreach (string fntkey in fonts.GetValueNames())
            {
                if (fntkey == fontname)
                {
                    return strFontsFolder + "\\" + fonts.GetValue(fntkey).ToString();
                }
            }
            return "";
        }

        private void button2_Click(object sender, RoutedEventArgs e)
        {
            //show open file dialog
            System.Windows.Forms.OpenFileDialog dlg = new System.Windows.Forms.OpenFileDialog();
            dlg.Filter = "TTF Font (*.ttf)|*.ttf";
            if (dlg.ShowDialog() == System.Windows.Forms.DialogResult.OK)
            {
                txtFontFilePath.Text = dlg.FileName;
                lblFontName.Text = "";
            }
        }

        private void button3_Click(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrEmpty(txtFontFilePath.Text))
            {
                MessageBox.Show("The TTF Font File path was not specified.", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                return;

            }

            if (!System.Text.RegularExpressions.Regex.IsMatch(txtNameAtPrinterStorage.Text, "^([A-Y]{1}):([A-Za-z0-9]{1,8})$"))
            {
                MessageBox.Show("The printer font name must be 1 to 8 alphanumeric characters long prefixed by the drive location, for example B:ARIAL", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                return;

            }


            //Display dialog for printer settings...           
            PrintJobDialog frmPrintJob = new PrintJobDialog();
            frmPrintJob.Owner = this;
            if (frmPrintJob.ShowDialog() == true)
            {
                //Set printer settings to PrintUtils class
                PrintUtils.PrinterSettings = frmPrintJob.PrinterSettings;

                try
                {
                    //Upload TTF file to the printer
                    PrintUtils.UploadUnboundedTrueTypeFont(txtFontFilePath.Text, txtNameAtPrinterStorage.Text);

                    //Done... print list of installed printers to be sure?
                    if (MessageBox.Show("Done!... Do you want to print the list of installed fonts in the printer to be sure?", "Font Uploaded", MessageBoxButton.YesNo, MessageBoxImage.Question) == MessageBoxResult.Yes)
                    {
                        //print list of installed fonts
                        PrintUtils.PrintDirectory("*:*.FNT*");
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message, "ERROR", MessageBoxButton.OK, MessageBoxImage.Error);

                }
            }
        }

    }
}
