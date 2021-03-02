using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Neodynamic.SDK.Printing;
using TLClientPrintPlugin;

namespace TLClientPrint.Plugin.CustomPrintDialog
{
    public class PrintDialogPlugin : IPluginPrinterSettings
    {

        PrinterSettingsDialog psd = new PrinterSettingsDialog();

        public int Copies { get; set; }
        public PrintOrientation PrintOrientation { get; set; }


        #region IPluginPrinterSettings Members

        public Neodynamic.SDK.Printing.PrinterSettings CreatePrinterSettings()
        {
            if (psd.ShowDialog() == System.Windows.Forms.DialogResult.OK)
            {
                this.Copies = psd.Copies;
                this.PrintOrientation = psd.PrintOrientation;

                return psd.PrinterSettings;
            }
            else
                return null;
        }

        #endregion
    }
}
