using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using Microsoft.Win32;
using System.IO;
using Neodynamic.SDK.Printing;

namespace TLWindowsEditorWinFormsDemo
{
    public partial class TTFtoPrinterStorage : Form
    {
        public TTFtoPrinterStorage()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            //show font dialog
            FontDialog dlg = new FontDialog();
            
            if (dlg.ShowDialog() == DialogResult.OK)
            {
                txtFontFilePath.Text = GetSystemFontFileName(dlg.Font);

                lblFontName.Font = dlg.Font;
                lblFontName.Text = dlg.Font.Name;
            }
        }

        private  string GetSystemFontFileName(System.Drawing.Font font)
        {
            //Get Windows Fonts folder
            DirectoryInfo dirWindowsFolder = Directory.GetParent(Environment.GetFolderPath(Environment.SpecialFolder.System));
            string strFontsFolder = Path.Combine(dirWindowsFolder.FullName, "Fonts");


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

        private void button2_Click(object sender, EventArgs e)
        {
            //show open file dialog
            System.Windows.Forms.OpenFileDialog dlg = new System.Windows.Forms.OpenFileDialog();
            dlg.Filter = "TTF Font (*.ttf)|*.ttf";
            if (dlg.ShowDialog() == DialogResult.OK)
            {
                txtFontFilePath.Text = dlg.FileName;
                lblFontName.Text = "";
            }
        }

        private void button4_Click(object sender, EventArgs e)
        {

            if (string.IsNullOrEmpty(txtFontFilePath.Text))
            {
                MessageBox.Show("The TTF Font File path was not specified.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
                
            }
            
            if (!System.Text.RegularExpressions.Regex.IsMatch(txtNameAtPrinterStorage.Text, "^([A-Y]{1}):([A-Za-z0-9]{1,8})$"))
            {
                MessageBox.Show("The printer font name must be 1 to 8 alphanumeric characters long prefixed by the drive location, for example B:ARIAL", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
                
            }
            
            
            //Display dialog for printer settings...           
            PrintJobDialog frmPrintJob = new PrintJobDialog();
            frmPrintJob.Owner = this;
            if (frmPrintJob.ShowDialog() == DialogResult.OK)
            {
                //Set printer settings to PrintUtils class
                PrintUtils.PrinterSettings = frmPrintJob.PrinterSettings;
                
                try
                {
                    //Upload TTF file to the printer
                    PrintUtils.UploadUnboundedTrueTypeFont(txtFontFilePath.Text, txtNameAtPrinterStorage.Text);

                    //Done... print list of installed printers to be sure?
                    if (MessageBox.Show("Done!... Do you want to print the list of installed fonts in the printer to be sure?", "Font Uploaded", MessageBoxButtons.YesNo, MessageBoxIcon.Question) == System.Windows.Forms.DialogResult.Yes)
                    { 
                        //print list of installed fonts
                        PrintUtils.PrintDirectory("*:*.FNT*");
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message, "ERROR", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    
                }
            }

        }
    }
}
