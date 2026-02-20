using System;
using System.Linq;
using Neodynamic.SDK.Printing;

namespace TLBidiSample
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Starting BIDI Comm...");

            // The target printer settings for BIDI comm
            var ps = new PrinterSettings();

            // Targeting driver installed printer
            /*
            ps.Communication.CommunicationType = CommunicationType.PrinterDriver;
            ps.PrinterName = "ZDesigner GK420t";
            */

            // Targeting IP Network Printer
            /*
            ps.Communication.CommunicationType = CommunicationType.Network;
            ps.Communication.NetworkIPAddress = System.Net.IPAddress.Parse("127.0.0.1");
            ps.Communication.NetworkPort = 9100;
            */

            // Targeting USB printer
            /*
            ps.Communication.CommunicationType = CommunicationType.USB;
            try
            {
                ps.PrinterName = PrintUtils.GetUsbDevices().First().DevicePath;
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"USB Device error: {ex.Message}");
                return;
            }
            */

            // The WindowsPrintJob obj
            using var wpj = new WindowsPrintJob(ps);

            // Handle errors
            wpj.Error += (sender, e) =>
            {
                Console.Error.WriteLine(e.Exception.Message);
            };

            // Handler received data from target device
            wpj.DataRead += (sender, e) =>
            {
                Console.WriteLine($"Received: {e.Data}");
            };

            // Open a BIDI comm
            wpj.OpenBidiComm();

            string input = "";
            Console.WriteLine("Enter printer commands, or type 'exit' to quit.");

            while (true)
            {
                Console.Write("> ");
                input = Console.ReadLine();

                if (input != null && (input.ToLower() == "quit" || input.ToLower() == "exit"))
                {
                    Console.WriteLine("Exit command received. Exiting application.");
                    break;
                }

                // Write (send) data to the target device
                wpj.Write(input);

            }

            // Close BIDI comm
            wpj.CloseBidiComm();

        }
    }
}
