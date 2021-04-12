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

namespace TLWindowsEditorWPFDemo.Dialogs
{
    /// <summary>
    /// Interaction logic for ViewOptionsDialog.xaml
    /// </summary>
    public partial class ViewOptionsDialog : Window
    {
        public ViewOptionsDialog()
        {
            InitializeComponent();
        }


        public double GridSize
        {
            get { return double.Parse(txtGridSize.Text); }
            set { txtGridSize.Text = value.ToString(); }
        }

        public bool ShowGrid
        {
            get { return chkShowGrid.IsChecked.Value; }
            set { chkShowGrid.IsChecked = value; }
        }

        public bool SnapToGrid
        {
            get { return chkSnapToGrid.IsChecked.Value; }
            set { chkSnapToGrid.IsChecked = value; }
        }

        public int AngleSnap
        {
            get { return int.Parse(txtAngleSnap.Text); }
            set { txtAngleSnap.Text = value.ToString(); }
        }

        public double ArrowKeysShortStep
        {
            get { return double.Parse(txtArrowKeysShortStep.Text); }
            set { txtArrowKeysShortStep.Text = value.ToString(); }
        }

        public double ArrowKeysLargeStep
        {
            get { return double.Parse(txtArrowKeysLargeStep.Text); }
            set { txtArrowKeysLargeStep.Text = value.ToString(); }
        }

        public void SetUnitLegends(Neodynamic.SDK.Printing.UnitType unit)
        {
            lblUnit1.Content = lblUnit2.Content = lblUnit3.Content = unit.ToString();
        }

        private void button1_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = true;
        }

    }
}
