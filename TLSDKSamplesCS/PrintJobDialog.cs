using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;

using Neodynamic.SDK.Printing;

namespace ThermalLabelSdkSamplesCS
{
    public partial class PrintJobDialog : Form
    {

        PrinterSettings _printerSettings = new PrinterSettings();
        int _copies = 1;
        PrintOrientation _printOrientation = PrintOrientation.Portrait;

        
        
        public PrintJobDialog()
        {
            InitializeComponent();

            this.Init();
        }

        private void Init()
        {
            this.cboProgLang.SelectedIndex = 0;
            this.cboPrintOrientation.SelectedIndex = 0;

            //Load installed printers...
            string[] installedPrinters = new string[System.Drawing.Printing.PrinterSettings.InstalledPrinters.Count];
            System.Drawing.Printing.PrinterSettings.InstalledPrinters.CopyTo(installedPrinters, 0);
            this.cboPrinters.DataSource = installedPrinters;

            //Load Serial Comm settings...
            this.cboSerialPorts.DataSource = System.IO.Ports.SerialPort.GetPortNames();
            this.cboParity.DataSource = Enum.GetNames(typeof(System.IO.Ports.Parity));
            this.cboStopBits.DataSource = Enum.GetNames(typeof(System.IO.Ports.StopBits));
            this.cboFlowControl.DataSource = Enum.GetNames(typeof(System.IO.Ports.Handshake));

        }


        public PrinterSettings PrinterSettings
        {
            get { return _printerSettings; }
        }

        public int Copies
        {
            get { return _copies; }
        }

        public PrintOrientation PrintOrientation
        {
            get { return _printOrientation; }
        }

        public bool PrintAsGraphic
        {
            get { return this.chkPrintAsGraphic.Checked; }
        }

        private void btnCancel_Click(object sender, EventArgs e)
        {
            this.DialogResult = DialogResult.Cancel;   
        }

        private void btnOk_Click(object sender, EventArgs e)
        {
            if (this.cboProgLang.SelectedItem.ToString() == "" && this.tabControl1.SelectedIndex != 0)
            {
                this.errorProvider1.SetError(this.cboProgLang, "Please select the printer's programming language");
                return;
            }
            else if (this.cboProgLang.SelectedItem.ToString() == "" && this.tabControl1.SelectedIndex == 0)
            {
                this.chkPrintAsGraphic.Checked = true;
            }
            else
            {
                this.errorProvider1.SetError(this.cboProgLang, "");


            }

            this.DialogResult = DialogResult.OK;

            try
            {
                //Update printer comm object...
                if (this.tabControl1.SelectedIndex == 0)
                {
                    //USB
                    _printerSettings.Communication.CommunicationType = CommunicationType.USB;
                    _printerSettings.PrinterName = this.cboPrinters.SelectedItem.ToString();
                }
                else if (this.tabControl1.SelectedIndex == 1)
                {
                    //Parallel
                    _printerSettings.Communication.CommunicationType = CommunicationType.Parallel;
                    _printerSettings.Communication.ParallelPortName = this.txtParallelPort.Text;
                }
                else if (this.tabControl1.SelectedIndex == 2)
                {
                    //Serial
                    _printerSettings.Communication.CommunicationType = CommunicationType.Serial;
                    _printerSettings.Communication.SerialPortName = this.cboSerialPorts.SelectedItem.ToString();
                    _printerSettings.Communication.SerialPortBaudRate = int.Parse(this.txtBaudRate.Text);
                    _printerSettings.Communication.SerialPortDataBits = int.Parse(this.txtDataBits.Text);
                    _printerSettings.Communication.SerialPortFlowControl = (SerialPortHandshake)Enum.Parse(typeof(SerialPortHandshake), this.cboFlowControl.SelectedItem.ToString());
                    _printerSettings.Communication.SerialPortParity = (SerialPortParity)Enum.Parse(typeof(SerialPortParity), this.cboParity.SelectedItem.ToString());
                    _printerSettings.Communication.SerialPortStopBits = (SerialPortStopBits)Enum.Parse(typeof(SerialPortStopBits), this.cboStopBits.SelectedItem.ToString());
                }
                else if (this.tabControl1.SelectedIndex == 3)
                {
                    //Network
                    _printerSettings.Communication.CommunicationType = CommunicationType.Network;
                    System.Net.IPAddress ipAddress = System.Net.IPAddress.None;

                    try
                    {
                        ipAddress = System.Net.IPAddress.Parse(this.txtIPAddress.Text);
                    }
                    catch
                    { }

                    if (ipAddress != System.Net.IPAddress.None) //use IP
                        _printerSettings.Communication.NetworkIPAddress = ipAddress;
                    else //try Host Name
                        _printerSettings.PrinterName = this.txtIPAddress.Text;

                    _printerSettings.Communication.NetworkPort = int.Parse(this.txtIPPort.Text);

                }

                _printerSettings.Dpi = (double)this.nudDpi.Value;

                if (this.chkPrintAsGraphic.Checked == false)
                    _printerSettings.ProgrammingLanguage = (ProgrammingLanguage)Enum.Parse(typeof(ProgrammingLanguage), this.cboProgLang.SelectedItem.ToString());


                _copies = (int)this.nudCopies.Value;
                _printOrientation = (PrintOrientation)Enum.Parse(typeof(PrintOrientation), this.cboPrintOrientation.SelectedItem.ToString());


            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                this.DialogResult = DialogResult.Abort;
            }


        }

        private void PrintJobDialog_FormClosing(object sender, FormClosingEventArgs e)
        {
            if (this.DialogResult == DialogResult.Abort)
                e.Cancel = true;
        }




    }
}
