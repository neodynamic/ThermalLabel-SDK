using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using Neodynamic.SDK.Printing;

namespace TLWindowsEditorWinFormsDemo
{
    public partial class PrinterFonts : Form
    {
        public PrinterFonts()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            //Display dialog for printer settings...           
            PrintJobDialog frmPrintJob = new PrintJobDialog();
            frmPrintJob.Owner = this;
            if (frmPrintJob.ShowDialog() == DialogResult.OK)
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
                    MessageBox.Show(ex.Message, "ERROR", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    
                }
            }
        }

        private void button2_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrEmpty(txtFontName.Text))
            {
                MessageBox.Show("Please specify a Printer Font Name.", "Error",  MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }
            else if (!System.Text.RegularExpressions.Regex.IsMatch(txtFontName.Text, "^([A-Y]{1}):([A-Za-z0-9]{1,8})$"))
            {
                MessageBox.Show("The Printer Font Name must be 1 to 8 alphanumeric characters long prefixed by the drive location, for example B:ARIAL", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            if (MessageBox.Show("Do you really want to delete the font " + txtFontName.Text + " from the printer storage?", "Delete Font", MessageBoxButtons.YesNo, MessageBoxIcon.Question) == System.Windows.Forms.DialogResult.Yes)
            {
                //Display dialog for printer settings...           
                PrintJobDialog frmPrintJob = new PrintJobDialog();
                frmPrintJob.Owner = this;
                if (frmPrintJob.ShowDialog() == DialogResult.OK)
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
                        if (MessageBox.Show("Done!... Do you want to print the list of installed fonts in the printer to be sure?", "Printer Fonts", MessageBoxButtons.YesNo, MessageBoxIcon.Question) == System.Windows.Forms.DialogResult.Yes)
                        {
                            //print list of installed fonts
                            PrintUtils.PrintDirectory("*:*.FNT*");
                        }
                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show(ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);

                    }
                }
            }

        }
    }
}
