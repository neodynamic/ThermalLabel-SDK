using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace TLWindowsEditorWinFormsDemo
{
    public partial class ViewOptions : Form
    {
        public ViewOptions()
        {
            InitializeComponent();
        }

        public double GridSize
        {
            get { return (double)nudGridSize.Value; }
            set { nudGridSize.Value = (decimal)value; }
        }

        public bool ShowGrid
        {
            get { return chkShowGrid.Checked; }
            set { chkShowGrid.Checked = value; }
        }

        public bool SnapToGrid
        {
            get { return chkSnapToGrid.Checked; }
            set { chkSnapToGrid.Checked = value; }
        }

        public int AngleSnap
        {
            get { return (int)nudAngleSnap.Value; }
            set { nudAngleSnap.Value = (int)value; }
        }

        public double ArrowKeysShortStep
        {
            get { return (double)nudArrowKeysShortStep.Value; }
            set { nudArrowKeysShortStep.Value = (decimal)value; }
        }

        public double ArrowKeysLargeStep
        {
            get { return (double)nudArrowKeysLargeStep.Value; }
            set { nudArrowKeysLargeStep.Value = (decimal)value; }
        }

        public void SetUnitLegends(Neodynamic.SDK.Printing.UnitType unit)
        {
            lblUnit1.Text = lblUnit2.Text = lblUnit3.Text = unit.ToString();
        }

        private void button1_Click(object sender, EventArgs e)
        {

        }
    }
}
