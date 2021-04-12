﻿using System;
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
    /// Interaction logic for DpiDialog.xaml
    /// </summary>
    public partial class DpiDialog : Window
    {
        public DpiDialog()
        {
            InitializeComponent();
        }

        public double Dpi
        {
            get
            {
                return this.nudDpi.Value.Value;
            }
            set
            {
                this.nudDpi.Value = value;
            }
        }

        private void cmdOK_Click(object sender, RoutedEventArgs e)
        {
            this.DialogResult = true;
        }
    }
}
