using System;
using System.Collections.Generic;
using System.Globalization;
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
using System.Printing;

namespace TLWindowsEditorWPFDemo
{
    /// <summary>
    /// Interaction logic for PrintJobDialog.xaml
    /// </summary>
    public partial class PrintJobDialog : Window
    {

        PrinterSettings _printerSettings = new PrinterSettings();
        int _copies = 1;
        int _replicates = 0;
        PrintOrientation _printOrientation = PrintOrientation.Portrait;

        List<UsbDevice> _usbDevices = new List<UsbDevice>();
        List<HidDevice> _hidDevices = new List<HidDevice>();

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
            LocalPrintServer printServer = new LocalPrintServer();
            PrintQueueCollection printQueuesOnLocalServer = printServer.GetPrintQueues(new[] { EnumeratedPrintQueueTypes.Local });
            List<string> installedPrinters = new List<string>();
            foreach (PrintQueue printer in printQueuesOnLocalServer)
            {
                installedPrinters.Add(printer.Name);
            }

            this.cboPrinters.DataContext = installedPrinters;

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
                    this.cboUsbDevices.IsEnabled = false;
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
                    this.cboHidDevices.IsEnabled = false;
                }
            }
            catch { }

            //Load Serial Comm settings...
            this.cboSerialPorts.DataContext = System.IO.Ports.SerialPort.GetPortNames();
            this.cboParity.DataContext = Enum.GetNames(typeof(SerialPortParity));
            this.cboStopBits.DataContext = Enum.GetNames(typeof(SerialPortStopBits));
            this.cboFlowControl.DataContext = Enum.GetNames(typeof(SerialPortHandshake));

        }

        public PrinterSettings PrinterSettings
        {
            get { return _printerSettings; }
        }

        public int Copies
        {
            get { return _copies; }
        }

        public int Replicates
        {
            get { return _replicates; }
        }

        public PrintOrientation PrintOrientation
        {
            get { return _printOrientation; }
        }

        public bool Duplex
        {
            get { return this.chkDuplex.IsChecked.Value; }
        }

        public bool CommandsOptimizationEnabled
        {
            get { return this.chkCommandsOptimizationEnabled.IsChecked.Value; }
        }

        public bool PrintAsGraphic
        {
            get { return this.chkPrintAsGraphic.IsChecked.Value; }
        }

        public double MarginLeft
        {
            get
            {
                try
                {
                    return double.Parse(this.txtMarginLeft.Text);
                }
                catch
                {
                    return -1;
                }
            }
        }

        public double MarginTop
        {
            get
            {
                try
                {
                    return double.Parse(this.txtMarginTop.Text);
                }
                catch
                {
                    return -1;
                }
            }
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            this.DialogResult = true;

            try
            {
                //Update printer comm object...
                if (this.tabPrintComm.SelectedIndex == 0)
                {
                    //Printer Driver
                    _printerSettings.Communication.CommunicationType = CommunicationType.PrinterDriver;
                    _printerSettings.PrinterName = cboPrinters.SelectedItem != null ? cboPrinters.SelectedItem.ToString() : cboPrinters.Text;
                }
                else if (this.tabPrintComm.SelectedIndex == 1)
                {
                    //USB
                    _printerSettings.Communication.CommunicationType = CommunicationType.USB;
                    _printerSettings.PrinterName = this.txtUsbDevicePath.Text;
                }
                else if (this.tabPrintComm.SelectedIndex == 2)
                {
                    //Parallel
                    _printerSettings.Communication.CommunicationType = CommunicationType.Parallel;
                    _printerSettings.Communication.ParallelPortName = this.txtParallelPort.Text;
                }
                else if (this.tabPrintComm.SelectedIndex == 3)
                {
                    //Serial
                    _printerSettings.Communication.CommunicationType = CommunicationType.Serial;
                    _printerSettings.Communication.SerialPortName = cboSerialPorts.SelectedItem.ToString();
                    _printerSettings.Communication.SerialPortBaudRate = int.Parse(this.txtBaudRate.Text);
                    _printerSettings.Communication.SerialPortDataBits = int.Parse(this.txtDataBits.Text);
                    _printerSettings.Communication.SerialPortFlowControl = (SerialPortHandshake)Enum.Parse(typeof(SerialPortHandshake), cboFlowControl.SelectedItem.ToString());
                    _printerSettings.Communication.SerialPortParity = (SerialPortParity)Enum.Parse(typeof(SerialPortParity), cboParity.SelectedItem.ToString());
                    _printerSettings.Communication.SerialPortStopBits = (SerialPortStopBits)Enum.Parse(typeof(SerialPortStopBits), cboStopBits.SelectedItem.ToString());
                }
                else if (this.tabPrintComm.SelectedIndex == 4)
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
                else if (this.tabPrintComm.SelectedIndex == 5)
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

                _printerSettings.Dpi = double.Parse(this.txtDpi.Text);
                if (string.IsNullOrWhiteSpace(((ComboBoxItem)cboProgLang.SelectedItem).Content.ToString()))
                    this.chkPrintAsGraphic.IsChecked = true;
                else
                    _printerSettings.ProgrammingLanguage = (ProgrammingLanguage)Enum.Parse(typeof(ProgrammingLanguage), ((ComboBoxItem)cboProgLang.SelectedItem).Content.ToString());


                _copies = int.Parse(this.txtCopies.Text);
                _replicates = int.Parse(this.txtReplicates.Text);
                _printOrientation = (PrintOrientation)Enum.Parse(typeof(PrintOrientation), ((ComboBoxItem)cboPrintOrientation.SelectedItem).Content.ToString());


            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                this.DialogResult = false;
            }

        }

        private void chkPrintAsGraphic_Checked(object sender, RoutedEventArgs e)
        {
            this.gbMargins.IsEnabled = this.chkPrintAsGraphic.IsChecked.Value;
        }

        private void chkCenterH_CheckedChanged(object sender, RoutedEventArgs e)
        {
            bool isChecked = this.chkCenterH.IsChecked.Value;

            if (isChecked) this.txtMarginLeft.Text = "-1";

            this.txtMarginLeft.IsEnabled = !isChecked;
        }

        private void chkCenterV_CheckedChanged(object sender, RoutedEventArgs e)
        {
            bool isChecked = this.chkCenterV.IsChecked.Value;

            if (isChecked) this.txtMarginTop.Text = "-1";

            this.txtMarginTop.IsEnabled = !isChecked;
        }

        private void cboHidDevices_SelectionChanged(object sender, SelectionChangedEventArgs e)
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