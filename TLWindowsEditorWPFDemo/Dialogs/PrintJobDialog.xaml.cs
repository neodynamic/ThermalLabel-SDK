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
            LocalPrintServer printServer = new LocalPrintServer();
            PrintQueueCollection printQueuesOnLocalServer = printServer.GetPrintQueues(new[] { EnumeratedPrintQueueTypes.Local });
            List<string> installedPrinters = new List<string>();
            foreach (PrintQueue printer in printQueuesOnLocalServer)
            {
                installedPrinters.Add(printer.Name);
            }

            this.cboPrinters.DataContext = installedPrinters;

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

        public PrintOrientation PrintOrientation
        {
            get { return _printOrientation; }
        }

        public bool PrintAsGraphic
        {
            get { return this.chkPrintAsGraphic.IsChecked.Value; }
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            this.DialogResult = true;

            try
            {
                //Update printer comm object...
                if (this.tabPrintComm.SelectedIndex == 0)
                {
                    //USB
                    _printerSettings.Communication.CommunicationType = CommunicationType.USB;
                    _printerSettings.PrinterName = cboPrinters.SelectedItem.ToString();
                }
                else if (this.tabPrintComm.SelectedIndex == 1)
                {
                    //Parallel
                    _printerSettings.Communication.CommunicationType = CommunicationType.Parallel;
                    _printerSettings.Communication.ParallelPortName = this.txtParallelPort.Text;
                }
                else if (this.tabPrintComm.SelectedIndex == 2)
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
                else if (this.tabPrintComm.SelectedIndex == 3)
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

                _printerSettings.Dpi = double.Parse(this.txtDpi.Text);
                if (string.IsNullOrWhiteSpace(((ComboBoxItem)cboProgLang.SelectedItem).Content.ToString()))
                    this.chkPrintAsGraphic.IsChecked = true;
                else
                    _printerSettings.ProgrammingLanguage = (ProgrammingLanguage)Enum.Parse(typeof(ProgrammingLanguage), ((ComboBoxItem)cboProgLang.SelectedItem).Content.ToString());


                _copies = int.Parse(this.txtCopies.Text);
                _printOrientation = (PrintOrientation)Enum.Parse(typeof(PrintOrientation), ((ComboBoxItem)cboPrintOrientation.SelectedItem).Content.ToString());


            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                this.DialogResult = false;
            }

        }
    }
}
