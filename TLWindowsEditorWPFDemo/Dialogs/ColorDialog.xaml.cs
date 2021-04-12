using System;
using System.Collections.Generic;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace TLWindowsEditorWPFDemo
{
    /// <summary>
    /// Interaction logic for ColorDialog.xaml
    /// </summary>
    public partial class ColorDialog : Window
    {
        public ColorDialog()
        {
            InitializeComponent();
        }


        public string ColorHex
        {
            get
            {
                return this.colorCanvas1.HexadecimalString; 
            }
            set
            {
                this.colorCanvas1.HexadecimalString = value;
            }
        }

        private void cmdOK_Click(object sender, RoutedEventArgs e)
        {
            this.DialogResult = true;
        }
    }
}
