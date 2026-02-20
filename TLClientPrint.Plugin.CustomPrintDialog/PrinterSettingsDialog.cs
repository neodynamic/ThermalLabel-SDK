using Neodynamic.SDK.Printing;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Windows.Forms;

namespace TLClientPrint.Plugin.CustomPrintDialog
{
    public partial class PrinterSettingsDialog : Form
    {
        private static string MAJOR_VERSION = "15.0";
        private static string FILE_INI = "TLClientPrint.ini";

        PrinterSettings _printerSettings = new PrinterSettings();

        List<UsbDevice> _usbDevices = new List<UsbDevice>();

        public PrinterSettingsDialog()
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

            //Load Serial Comm settings...
            this.cboSerialPorts.DataSource = System.IO.Ports.SerialPort.GetPortNames();
            this.cboParity.DataSource = Enum.GetNames(typeof(System.IO.Ports.Parity));
            this.cboStopBits.DataSource = Enum.GetNames(typeof(System.IO.Ports.StopBits));
            this.cboFlowControl.DataSource = Enum.GetNames(typeof(System.IO.Ports.Handshake));


            //Load last saved settings from INI file
            FILE_INI = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + "\\Neodynamic\\TLClientPrint\\" + MAJOR_VERSION + "\\" + FILE_INI;

            try
            {
                this.nudDpi.Value = decimal.Parse(ReadINISetting(FILE_INI, "Settings", "PS.Dpi"));
            }
            catch
            {
            }

            try
            {
                this.cboProgLang.Text = ReadINISetting(FILE_INI, "Settings", "PS.ProgrammingLanguage");
            }
            catch
            {
            }

            try
            {
                string printerName = ReadINISetting(FILE_INI, "Settings", "PS.PrinterName");
                if (printerName != null && printerName.StartsWith("PrintAsGraphics"))
                {
                    this.chkPrintAsImage.Checked = true;
                    printerName = printerName.Replace("PrintAsGraphics", "");
                }

                if (printerName.ToUpperInvariant().Contains("VID_") && printerName.ToUpperInvariant().Contains("PID_"))
                {
                    if (_usbDevices.Count > 0)
                    {
                        int i = _usbDevices.FindIndex(d => d.DevicePath == printerName);
                        if (i >= 0)
                        {
                            this.cboUsbDevices.SelectedIndex = i;
                            this.txtUsbDevicePath.Text = printerName;
                        }
                    }
                }
                else
                    this.cboPrinters.Text = printerName;


            }
            catch
            {
            }

            try
            {
                this.txtParallelPort.Text = ReadINISetting(FILE_INI, "Settings", "PS.ParallelPortName");
            }
            catch
            {
            }

            try
            {
                this.txtIPAddress.Text = ReadINISetting(FILE_INI, "Settings", "PS.NetworkIPAddress");
            }
            catch
            {
            }

            try
            {
                this.txtIPPort.Text = ReadINISetting(FILE_INI, "Settings", "PS.NetworkPort");
            }
            catch
            {
            }

            try
            {
                this.cboSerialPorts.Text = ReadINISetting(FILE_INI, "Settings", "PS.SerialPortName");
            }
            catch
            {
            }

            try
            {
                this.txtDataBits.Text = ReadINISetting(FILE_INI, "Settings", "PS.SerialPortDataBits");
            }
            catch
            {
            }

            try
            {
                this.cboStopBits.Text = ReadINISetting(FILE_INI, "Settings", "PS.SerialPortStopBits");
            }
            catch
            {
            }

            try
            {
                this.txtBaudRate.Text = ReadINISetting(FILE_INI, "Settings", "PS.SerialPortBaudRate");
            }
            catch
            {
            }

            try
            {
                this.cboFlowControl.Text = ReadINISetting(FILE_INI, "Settings", "PS.SerialPortFlowControl");
            }
            catch
            {
            }

            try
            {
                this.cboParity.Text = ReadINISetting(FILE_INI, "Settings", "PS.SerialPortParity");
            }
            catch
            {
            }

            try
            {
                CommunicationType ct = (CommunicationType)Enum.Parse(typeof(CommunicationType), ReadINISetting(FILE_INI, "Settings", "PS.CommType"));

                if (ct == CommunicationType.PrinterDriver)
                    this.tabControl1.SelectedIndex = 0;
                else if (ct == CommunicationType.USB)
                    this.tabControl1.SelectedIndex = 1;
                else if (ct == CommunicationType.Parallel)
                    this.tabControl1.SelectedIndex = 2;
                else if (ct == CommunicationType.Serial)
                    this.tabControl1.SelectedIndex = 3;
                else if (ct == CommunicationType.Network)
                    this.tabControl1.SelectedIndex = 4;

            }
            catch
            {
            }


            try
            {
                this.nudCopies.Value = decimal.Parse(ReadINISetting(FILE_INI, "Settings", "Copies"));
            }
            catch
            {
            }

            try
            {
                this.cboPrintOrientation.Text = ReadINISetting(FILE_INI, "Settings", "PrintOrientation");
            }
            catch
            {
            }

            try
            {
                this.nudReplicates.Value = decimal.Parse(ReadINISetting(FILE_INI, "Settings", "Replicates"));
            }
            catch
            {
            }

            try
            {
                this.chkCommandsOptimizationEnabled.Checked = bool.Parse(ReadINISetting(FILE_INI, "Settings", "CommandsOptimizationEnabled"));
            }
            catch
            {
            }

            try
            {
                this.chkDuplex.Checked = bool.Parse(ReadINISetting(FILE_INI, "Settings", "Duplex"));
            }
            catch
            {
            }
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
                    string printAsGraphics = "";
                    if (this.cboProgLang.SelectedIndex == 0 ||
                        this.chkPrintAsImage.Checked)
                        printAsGraphics = "PrintAsGraphics";

                    _printerSettings.PrinterName = printAsGraphics + this.cboPrinters.SelectedItem.ToString();
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

                _printerSettings.Dpi = (double)this.nudDpi.Value;

                if (this.cboProgLang.SelectedIndex > 0)
                    _printerSettings.ProgrammingLanguage = (ProgrammingLanguage)Enum.Parse(typeof(ProgrammingLanguage), this.cboProgLang.SelectedItem.ToString());


                //Save settings in INI file
                WriteINISetting(FILE_INI, "Settings", "PS.Dpi", _printerSettings.Dpi.ToString());
                WriteINISetting(FILE_INI, "Settings", "PS.PrinterName", _printerSettings.PrinterName);
                WriteINISetting(FILE_INI, "Settings", "PS.ProgrammingLanguage", this.cboProgLang.SelectedIndex > 0 ? _printerSettings.ProgrammingLanguage.ToString() : "");
                WriteINISetting(FILE_INI, "Settings", "PS.CommType", _printerSettings.Communication.CommunicationType.ToString());
                WriteINISetting(FILE_INI, "Settings", "PS.NetworkIPAddress", _printerSettings.Communication.NetworkIPAddress.ToString());
                WriteINISetting(FILE_INI, "Settings", "PS.NetworkPort", _printerSettings.Communication.NetworkPort.ToString());
                WriteINISetting(FILE_INI, "Settings", "PS.ParallelPortName", _printerSettings.Communication.ParallelPortName);
                WriteINISetting(FILE_INI, "Settings", "PS.SerialPortBaudRate", _printerSettings.Communication.SerialPortBaudRate.ToString());
                WriteINISetting(FILE_INI, "Settings", "PS.SerialPortDataBits", _printerSettings.Communication.SerialPortDataBits.ToString());
                WriteINISetting(FILE_INI, "Settings", "PS.SerialPortFlowControl", _printerSettings.Communication.SerialPortFlowControl.ToString());
                WriteINISetting(FILE_INI, "Settings", "PS.SerialPortName", _printerSettings.Communication.SerialPortName);
                WriteINISetting(FILE_INI, "Settings", "PS.SerialPortParity", _printerSettings.Communication.SerialPortParity.ToString());
                WriteINISetting(FILE_INI, "Settings", "PS.SerialPortStopBits", _printerSettings.Communication.SerialPortStopBits.ToString());

                WriteINISetting(FILE_INI, "Settings", "Copies", ((int)this.nudCopies.Value).ToString());
                WriteINISetting(FILE_INI, "Settings", "PrintOrientation", cboPrintOrientation.SelectedItem.ToString());

                WriteINISetting(FILE_INI, "Settings", "Replicates", ((int)this.nudReplicates.Value).ToString());
                WriteINISetting(FILE_INI, "Settings", "CommandsOptimizationEnabled", this.chkCommandsOptimizationEnabled.Checked.ToString());

                WriteINISetting(FILE_INI, "Settings", "Duplex", this.chkDuplex.Checked.ToString());
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                this.DialogResult = DialogResult.Abort;
            }


        }

        private void PrinterSettingsDialog_FormClosing(object sender, FormClosingEventArgs e)
        {
            if (this.DialogResult == DialogResult.Abort)
                e.Cancel = true;
        }


        [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
        internal static extern uint GetPrivateProfileString(
            string lpAppName, string lpKeyName, string lpDefault, StringBuilder lpReturnedString,
            uint nSize, string lpFileName);

        static string ReadINISetting(string iniFilePath, string section, string key)
        {
            if (System.IO.File.Exists(FILE_INI))
            {

                var retVal = new StringBuilder(255);

                GetPrivateProfileString(section, key, "", retVal, 255, iniFilePath);

                return retVal.ToString();
            }
            else
            {
                return "";
            }
        }

        [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
        internal static extern bool WritePrivateProfileString(
            string lpAppName, string lpKeyName, string lpString, string lpFileName);

        static void WriteINISetting(string iniFilePath, string section, string key, string value)
        {
            if (System.IO.File.Exists(FILE_INI))
            {
                WritePrivateProfileString(section, key, value, iniFilePath);
            }
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
    }
}
