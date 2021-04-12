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

namespace TLWindowsEditorWPFDemo.Dialogs
{
    /// <summary>
    /// Interaction logic for PrinterFontsDialog.xaml
    /// </summary>
    public partial class PrinterFontsDialog : Window
    {
        public PrinterFontsDialog()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, RoutedEventArgs e)
        {
            //Display dialog for printer settings...           
            PrintJobDialog frmPrintJob = new PrintJobDialog();
            frmPrintJob.Owner = this;
            if (frmPrintJob.ShowDialog() == true)
            {
                //Set printer settings to PrintUtils class
                PrintUtils.PrinterSettings = frmPrintJob.PrinterSettings;

                try
                {
                    //print list of installed fonts
                    PrintUtils.PrintDirectory("*:*.FNT*");
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message, "ERROR", MessageBoxButton.OK, MessageBoxImage.Error);

                }
            }
        }

        private void button2_Click(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrEmpty(txtFontName.Text))
            {
                MessageBox.Show("Please specify a Printer Font Name.", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                return;
            }
            else if (!System.Text.RegularExpressions.Regex.IsMatch(txtFontName.Text, "^([A-Y]{1}):([A-Za-z0-9]{1,8})$"))
            {
                MessageBox.Show("The Printer Font Name must be 1 to 8 alphanumeric characters long prefixed by the drive location, for example B:ARIAL", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                return;
            }

            if (MessageBox.Show("Do you really want to delete the font " + txtFontName.Text + " from the printer storage?", "Delete Font", MessageBoxButton.YesNo, MessageBoxImage.Question) == MessageBoxResult.Yes)
            {
                //Display dialog for printer settings...           
                PrintJobDialog frmPrintJob = new PrintJobDialog();
                frmPrintJob.Owner = this;
                if (frmPrintJob.ShowDialog() == true)
                {
                    //Set printer settings to PrintUtils class
                    PrintUtils.PrinterSettings = frmPrintJob.PrinterSettings;

                    try
                    {
                        string fontName = txtFontName.Text;
                        if (fontName.ToUpper().EndsWith(".FNT") == false)
                        {
                            fontName += ".FNT";
                        }

                        //delete font from printer storage
                        PrintUtils.DeleteObject(txtFontName.Text);

                        //Done... print list of installed printers to be sure?
                        if (MessageBox.Show("Done!... Do you want to print the list of installed fonts in the printer to be sure?", "Printer Fonts", MessageBoxButton.YesNo, MessageBoxImage.Question) == MessageBoxResult.Yes)
                        {
                            //print list of installed fonts
                            PrintUtils.PrintDirectory("*:*.FNT*");
                        }
                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show(ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);

                    }
                }
            }
        }
    }
}
