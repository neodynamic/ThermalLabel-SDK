using Neodynamic.SDK.Printing;
using Neodynamic.Windows.ThermalLabelEditor;
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
    public partial class LabelDoc : Form
    {
        bool _init = true;

        public LabelDoc()
        {
            InitializeComponent();

            cboUnit.DataSource = Enum.GetNames(typeof(Neodynamic.SDK.Printing.UnitType)).OrderBy(ut => ut).ToList();

            _init = false;

            this.picRollSingleLabels.Image = Image.FromStream(new System.IO.MemoryStream(Convert.FromBase64String(ImageResources.SINGLE_LABEL)));
            this.picRollMulticolumnLabels.Image = Image.FromStream(new System.IO.MemoryStream(Convert.FromBase64String(ImageResources.MULTICOLUMN_LABELS)));
            this.picSheetLabels.Image = Image.FromStream(new System.IO.MemoryStream(Convert.FromBase64String(ImageResources.SHEET_LABELS)));

            this.UpdateLabelOptions();
        }

        
        private void LabelDoc_Load(object sender, EventArgs e)
        {
            
        }

        UnitType _currentLabelUnit = UnitType.Inch;
        

        private void cboUnit_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (_init == false)
            {
                UnitType newUnit = (UnitType)Enum.Parse(typeof(UnitType), cboUnit.SelectedItem.ToString());
                this.nudWidth.Value = (decimal)UnitUtils.Convert(_currentLabelUnit, (double)nudWidth.Value, newUnit, 2);
                this.nudHeight.Value = (decimal)UnitUtils.Convert(_currentLabelUnit, (double)nudHeight.Value, newUnit, 2);
                this.nudGapLength.Value = (decimal)UnitUtils.Convert(_currentLabelUnit, (double)nudGapLength.Value, newUnit, 2);
                this.nudHorizGapLength.Value = (decimal)UnitUtils.Convert(_currentLabelUnit, (double)nudHorizGapLength.Value, newUnit, 2);
                this.nudMarkLength.Value = (decimal)UnitUtils.Convert(_currentLabelUnit, (double)nudMarkLength.Value, newUnit, 2);
                this.nudSheetHeight.Value = (decimal)UnitUtils.Convert(_currentLabelUnit, (double)nudSheetHeight.Value, newUnit, 2);
                this.nudSheetWidth.Value = (decimal)UnitUtils.Convert(_currentLabelUnit, (double)nudSheetWidth.Value, newUnit, 2);
                this.nudSheetLabelsMarginLeft.Value = (decimal)UnitUtils.Convert(_currentLabelUnit, (double)nudSheetLabelsMarginLeft.Value, newUnit, 2);
                this.nudSheetLabelsMarginTop.Value = (decimal)UnitUtils.Convert(_currentLabelUnit, (double)nudSheetLabelsMarginTop.Value, newUnit, 2);
                _currentLabelUnit = newUnit;
            }
        }

        private void chkIsContinuous_CheckedChanged(object sender, EventArgs e)
        {
            this.nudGapLength.Enabled = this.nudMarkLength.Enabled = !chkIsContinuous.Checked;
        }

        

        public LabelDocument LabelDocument
        {
            get
            {
                var doc = new LabelDocument() { CutAfterPrinting = this.chkCutAfterPrinting.Checked, GapLength = (double)this.nudGapLength.Value, Height = (double)this.nudHeight.Value, IsContinuous = this.chkIsContinuous.Checked,  MarkLength = (double)this.nudMarkLength.Value, PrintMirror = this.chkPrintMirror.Checked, PrintSpeed = this.txtPrintSpeed.Text,  Width = (double)this.nudWidth.Value, UnitType = (UnitType)Enum.Parse(typeof(UnitType), cboUnit.SelectedItem.ToString()) };

                if (this.tabLabelType.SelectedTab == this.tabRollMulticolLabels)
                {
                    doc.LabelsHorizontalGapLength = (double)this.nudHorizGapLength.Value;
                    doc.LabelsPerRow = (int)this.nudLabelsPerRow.Value;
                }
                else if (this.tabLabelType.SelectedTab == this.tabSheetLabels)
                {
                    doc.LabelsHorizontalGapLength = (double)this.nudHorizGapLength.Value;
                    doc.LabelsPerRow = (int)this.nudLabelsPerRow.Value;
                    doc.SheetLabelsCount = (int)this.nudSheetLabelsCount.Value;
                    doc.SheetLabelsHeight = (double)this.nudSheetHeight.Value;
                    doc.SheetLabelsWidth = (double)this.nudSheetWidth.Value;
                    doc.SheetLabelsMargin = new FrameThickness() { Left = (double)this.nudSheetLabelsMarginLeft.Value, Top = (double)this.nudSheetLabelsMarginTop.Value };
                }

                return doc;
                
            }
            set
            {
                _currentLabelUnit = value.UnitType;
                this.cboUnit.SelectedItem = value.UnitType.ToString();
                this.nudWidth.Value = (decimal)value.Width;
                this.nudHeight.Value = (decimal)value.Height;
                this.nudGapLength.Value = (decimal)value.GapLength;
                this.nudHorizGapLength.Value = (decimal)value.LabelsHorizontalGapLength;
                this.nudLabelsPerRow.Value = value.LabelsPerRow;
                this.nudMarkLength.Value = (decimal)value.MarkLength;
                this.nudSheetHeight.Value = (decimal)value.SheetLabelsHeight;
                this.nudSheetWidth.Value = (decimal)value.SheetLabelsWidth;
                this.nudSheetLabelsCount.Value = value.SheetLabelsCount;
                this.nudSheetLabelsMarginLeft.Value = (decimal)value.SheetLabelsMargin.Left;
                this.nudSheetLabelsMarginTop.Value = (decimal)value.SheetLabelsMargin.Top;
                this.chkCutAfterPrinting.Checked = value.CutAfterPrinting;
                this.chkIsContinuous.Checked = value.IsContinuous;
                this.chkPrintMirror.Checked = value.PrintMirror;
                this.txtPrintSpeed.Text = value.PrintSpeed;
                
                if(value.SheetLabelsCount > 0 || value.SheetLabelsHeight>0 || value.SheetLabelsWidth > 0)
                {
                    this.tabLabelType.SelectedTab = this.tabSheetLabels;
                }
                else if (value.LabelsPerRow > 1)
                {
                    this.tabLabelType.SelectedTab = this.tabRollMulticolLabels;
                }
                else
                {
                    this.tabLabelType.SelectedTab = this.tabRollSingleLabel;
                }

                this.UpdateLabelOptions();
            }
        }


        private void UpdateLabelOptions()
        {
            this.gbHLayout.Visible = this.gbSheet.Visible = this.gbPrintOptions.Visible = false;

            if(this.tabLabelType.SelectedTab == this.tabRollSingleLabel)
            {
                this.gbPrintOptions.Visible = true;
            } else if (this.tabLabelType.SelectedTab == this.tabRollMulticolLabels)
            {
                this.gbPrintOptions.Visible = true;
                this.gbHLayout.Visible = true;
            } else if (this.tabLabelType.SelectedTab == this.tabSheetLabels)
            {
                this.gbSheet.Visible = true;
                this.gbHLayout.Visible = true;
            }

        }

        private void tabControl1_SelectedIndexChanged(object sender, EventArgs e)
        {
            UpdateLabelOptions();
        }
    }
}
