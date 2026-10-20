using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Windows.Forms;

using Neodynamic.SDK.Printing;

namespace ThermalLabelSdkSamplesCS
{
    public partial class PrintJobDialog : Form
    {
        PrinterSettings _printerSettings = new PrinterSettings();

        List<UsbDevice> _usbDevices = new List<UsbDevice>();

        List<HidDevice> _hidDevices = new List<HidDevice>();

        public PrintJobDialog()
        {
            InitializeComponent();

            this.Init();
        }

        private void Init()
        {

            List<string> langs = new List<string>();
            langs.Add("");
            langs.AddRange(Enum.GetNames(typeof(ProgrammingLanguage)).OrderBy(pl => pl).ToList());

            this.cboProgLang.DataSource = langs.ToArray();
            this.cboProgLang.SelectedIndex = 0;

            //Load installed printers...
            try
            {
                this.cboPrinters.DataSource = PrintUtils.GetInstalledPrinters();
            }
            catch { }

            //Load USB devices
            try
            {
                _usbDevices = PrintUtils.GetUsbDevices();

                foreach (var usbDevice in _usbDevices)
                {
                    this.cboUsbDevices.Items.Add(usbDevice.Name);
                }

                if (_usbDevices.Count > 0)
                {
                    this.cboUsbDevices.SelectedIndex = 0;
                    this.txtUsbDevicePath.Text = _usbDevices[0].DevicePath;
                }
                else
                {
                    this.cboUsbDevices.Enabled = false;
                }
            }
            catch { }

            //Load HID devices
            try
            {
                _hidDevices = PrintUtils.GetHidDevices();

                if (_hidDevices != null)
                {
                    foreach (var hidDevice in _hidDevices)
                    {
                        this.cboHidDevices.Items.Add(hidDevice.ToString());
                    }
                }

                if (_hidDevices != null && _hidDevices.Count > 0)
                {
                    this.cboHidDevices.SelectedIndex = 0;
                }
                else
                {
                    this.cboHidDevices.Enabled = false;
                }
            }
            catch { }

            //Load Serial Comm settings...
            this.cboSerialPorts.DataSource = System.IO.Ports.SerialPort.GetPortNames();
            this.cboParity.DataSource = Enum.GetNames(typeof(System.IO.Ports.Parity));
            this.cboStopBits.DataSource = Enum.GetNames(typeof(System.IO.Ports.StopBits));
            this.cboFlowControl.DataSource = Enum.GetNames(typeof(System.IO.Ports.Handshake));

            // page orientations
            this.cboPrintOrientation.SelectedIndex = 0;
        }


        public PrinterSettings PrinterSettings
        {
            get { return _printerSettings; }
        }

        public int Copies
        {
            get
            {
                return (int)this.nudCopies.Value;
            }
        }

        public PrintOrientation PrintOrientation
        {
            get
            {
                return (PrintOrientation)Enum.Parse(typeof(PrintOrientation), this.cboPrintOrientation.SelectedItem.ToString());
            }
        }

        public int Replicates
        {
            get
            {
                return (int)this.nudReplicates.Value;
            }
        }

        public bool Duplex
        {
            get
            {
                return chkDuplex.Checked;
            }
            set
            {
                chkDuplex.Checked = value;
            }
        }

        public bool CommandsOptimizationEnabled
        {
            get
            {
                return chkCommandsOptimizationEnabled.Checked;
            }
        }

        public double MarginLeft
        {
            get { return (double)this.nudMarginLeft.Value; }
        }

        public double MarginTop
        {
            get { return (double)this.nudMarginTop.Value; }
        }

        public bool PrintAsGraphic
        {
            get { return this.chkPrintAsImage.Checked; }
            set { this.chkPrintAsImage.Checked = value; }
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
                    //Driver
                    _printerSettings.Communication.CommunicationType = CommunicationType.PrinterDriver;
                    _printerSettings.PrinterName = this.cboPrinters.SelectedItem.ToString();
                }
                else if (this.tabControl1.SelectedIndex == 1)
                {
                    //USB
                    _printerSettings.Communication.CommunicationType = CommunicationType.USB;
                    _printerSettings.PrinterName = this.txtUsbDevicePath.Text;
                }
                else if (this.tabControl1.SelectedIndex == 2)
                {
                    //Parallel
                    _printerSettings.Communication.CommunicationType = CommunicationType.Parallel;
                    _printerSettings.Communication.ParallelPortName = this.txtParallelPort.Text;
                }
                else if (this.tabControl1.SelectedIndex == 3)
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
                else if (this.tabControl1.SelectedIndex == 4)
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
                else if (this.tabControl1.SelectedIndex == 5)
                {
                    //HID
                    _printerSettings.Communication.CommunicationType = CommunicationType.HID;

                    _printerSettings.Communication.HidVendorId = int.Parse(this.txtHidVendorId.Text.Trim(), NumberStyles.HexNumber, CultureInfo.InvariantCulture);
                    _printerSettings.Communication.HidProductId = int.Parse(this.txtHidProductId.Text.Trim(), NumberStyles.HexNumber, CultureInfo.InvariantCulture);

                    _printerSettings.Communication.HidReportId = string.IsNullOrWhiteSpace(this.txtHidReportId.Text)
                        ? (byte)0
                        : byte.Parse(this.txtHidReportId.Text.Trim(), CultureInfo.InvariantCulture);

                    _printerSettings.Communication.HidUsagePage = string.IsNullOrWhiteSpace(this.txtHidUsagePage.Text)
                        ? -1
                        : int.Parse(this.txtHidUsagePage.Text.Trim(), NumberStyles.HexNumber, CultureInfo.InvariantCulture);

                    _printerSettings.Communication.HidUsageId = string.IsNullOrWhiteSpace(this.txtHidUsageId.Text)
                        ? -1
                        : int.Parse(this.txtHidUsageId.Text.Trim(), NumberStyles.HexNumber, CultureInfo.InvariantCulture);
                }

                _printerSettings.Dpi = (double)this.nudDpi.Value;

                if (this.cboProgLang.SelectedIndex > 0)
                    _printerSettings.ProgrammingLanguage = (ProgrammingLanguage)Enum.Parse(typeof(ProgrammingLanguage), this.cboProgLang.SelectedItem.ToString());



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



        private void chkPrintAsImage_CheckedChanged(object sender, EventArgs e)
        {
            this.gbMargins.Enabled = this.chkPrintAsImage.Checked;
        }

        private void chkCenterV_CheckedChanged(object sender, EventArgs e)
        {
            if (this.chkCenterV.Checked) this.nudMarginTop.Value = -1;

            this.nudMarginTop.Enabled = !this.chkCenterV.Checked;
        }

        private void chkCenterH_CheckedChanged(object sender, EventArgs e)
        {
            if (this.chkCenterH.Checked) this.nudMarginLeft.Value = -1;

            this.nudMarginLeft.Enabled = !this.chkCenterH.Checked;
        }

        private void cboHidDevices_SelectedIndexChanged(object sender, EventArgs e)
        {
            int idx = this.cboHidDevices.SelectedIndex;

            if (idx < 0 || _hidDevices == null || idx >= _hidDevices.Count)
                return;

            var dev = _hidDevices[idx];

            this.txtHidVendorId.Text = dev.VendorId.ToString("X4", CultureInfo.InvariantCulture);
            this.txtHidProductId.Text = dev.ProductId.ToString("X4", CultureInfo.InvariantCulture);

            // Only pre-fill Usage Page/Usage ID when the device actually exposes an Output Report
            // (i.e. it looks usable for printing); otherwise leave them blank so FindHidDevice() falls
            // back to matching by VID/PID alone at print time, same as leaving these fields empty by hand.
            if (dev.OutputReportLength > 0)
            {
                this.txtHidUsagePage.Text = dev.UsagePage.ToString("X4", CultureInfo.InvariantCulture);
                this.txtHidUsageId.Text = dev.UsageId.ToString("X4", CultureInfo.InvariantCulture);
            }
            else
            {
                this.txtHidUsagePage.Text = "";
                this.txtHidUsageId.Text = "";
            }
        }
    }
}