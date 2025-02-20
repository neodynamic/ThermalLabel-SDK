using Neodynamic.SDK.Printing;
using Neodynamic.Windows.ThermalLabelEditor;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
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
            this.picPages.Image = Image.FromStream(new System.IO.MemoryStream(Convert.FromBase64String(ImageResources.MULTI_PAGES_LABEL)));

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
                this.nudMarginTop.Value = (decimal)UnitUtils.Convert(_currentLabelUnit, (double)nudMarginTop.Value, newUnit, 2);
                this.nudMarginLeft.Value = (decimal)UnitUtils.Convert(_currentLabelUnit, (double)nudMarginLeft.Value, newUnit, 2);
                this.nudMarginRight.Value = (decimal)UnitUtils.Convert(_currentLabelUnit, (double)nudMarginRight.Value, newUnit, 2);
                this.nudMarginBottom.Value = (decimal)UnitUtils.Convert(_currentLabelUnit, (double)nudMarginBottom.Value, newUnit, 2);

                var pages = GetPages();
                for (int i = 0; i < pages.Count; i++)
                {
                    pages[i].X = UnitUtils.Convert(_currentLabelUnit, pages[i].X, newUnit, 2);
                    pages[i].Y = UnitUtils.Convert(_currentLabelUnit, pages[i].Y, newUnit, 2);
                    pages[i].Width = UnitUtils.Convert(_currentLabelUnit, pages[i].Width, newUnit, 2);
                    pages[i].Height = UnitUtils.Convert(_currentLabelUnit, pages[i].Height, newUnit, 2);
                }
                SetPages(pages);

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
                var doc = new LabelDocument() { CutAfterPrinting = this.chkCutAfterPrinting.Checked, GapLength = (double)this.nudGapLength.Value, Height = (double)this.nudHeight.Value, IsContinuous = this.chkIsContinuous.Checked,  MarkLength = (double)this.nudMarkLength.Value, PrintMirror = this.chkPrintMirror.Checked, PrintSpeed = this.txtPrintSpeed.Text,  Width = (double)this.nudWidth.Value, UnitType = (UnitType)Enum.Parse(typeof(UnitType), cboUnit.SelectedItem.ToString()), DesignBackgroundImage = _designBackgroundImage };
                doc.Margin = new FrameThickness() { 
                    Left = (double)this.nudMarginLeft.Value, 
                    Top = (double)this.nudMarginTop.Value,
                    Right = (double)this.nudMarginRight.Value,
                    Bottom = (double)this.nudMarginBottom.Value
                };

                if (this.tabPages.SelectedTab == this.tabRollMulticolLabels)
                {
                    doc.LabelsHorizontalGapLength = (double)this.nudHorizGapLength.Value;
                    doc.LabelsPerRow = (int)this.nudLabelsPerRow.Value;
                }
                else if (this.tabPages.SelectedTab == this.tabSheetLabels)
                {
                    doc.LabelsHorizontalGapLength = (double)this.nudHorizGapLength.Value;
                    doc.LabelsPerRow = (int)this.nudLabelsPerRow.Value;
                    doc.SheetLabelsCount = (int)this.nudSheetLabelsCount.Value;
                    doc.SheetLabelsHeight = (double)this.nudSheetHeight.Value;
                    doc.SheetLabelsWidth = (double)this.nudSheetWidth.Value;
                    doc.SheetLabelsMargin = new FrameThickness() { Left = (double)this.nudSheetLabelsMarginLeft.Value, Top = (double)this.nudSheetLabelsMarginTop.Value };
                }
                else if (this.tabPages.SelectedTab == this.tabMultiPages)
                {
                    doc.Pages = GetPages();
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

                this.nudMarginLeft.Value = (decimal)value.Margin.Left;
                this.nudMarginTop.Value = (decimal)value.Margin.Top;
                this.nudMarginRight.Value = (decimal)value.Margin.Right;
                this.nudMarginBottom.Value = (decimal)value.Margin.Bottom;

                _designBackgroundImage = value.DesignBackgroundImage;

                if (value.SheetLabelsCount > 0 || value.SheetLabelsHeight>0 || value.SheetLabelsWidth > 0)
                {
                    this.tabPages.SelectedTab = this.tabSheetLabels;
                }
                else if (value.LabelsPerRow > 1)
                {
                    this.tabPages.SelectedTab = this.tabRollMulticolLabels;
                }
                else if (value.Pages.Count > 0)
                {
                    SetPages(value.Pages);
                    this.tabPages.SelectedTab = this.tabMultiPages;
                    _designBackgroundImage = "";
                }
                else
                {
                    this.tabPages.SelectedTab = this.tabRollSingleLabel;
                }

                

                this.UpdateLabelOptions();
            }
        }


        private void UpdateLabelOptions()
        {
            this.gbHLayout.Visible = this.gbSheet.Visible = this.gbPrintOptions.Visible = this.gbPages.Visible = false;

            this.gbVLayout.Visible = this.gbMargin.Visible = true;


            if(this.tabPages.SelectedTab == this.tabRollSingleLabel)
            {
                this.gbPrintOptions.Visible = true;
            } else if (this.tabPages.SelectedTab == this.tabRollMulticolLabels)
            {
                this.gbPrintOptions.Visible = true;
                this.gbHLayout.Visible = true;
            } else if (this.tabPages.SelectedTab == this.tabSheetLabels)
            {
                this.gbMargin.Visible = false;
                this.gbSheet.Visible = true;
                this.gbHLayout.Visible = true;
            }
            else if (this.tabPages.SelectedTab == this.tabSheetLabels)
            {
                this.gbSheet.Visible = true;
                this.gbHLayout.Visible = true;
            }
            else if (this.tabPages.SelectedTab == this.tabMultiPages)
            {
                this.gbPages.Visible = true;
                this.gbVLayout.Visible = false;
            }

            this.btnClearBackImage.Visible = !string.IsNullOrWhiteSpace(_designBackgroundImage);

            this.btnSetBackImage.Visible = (this.tabPages.SelectedTab != this.tabMultiPages);
        }

        private void tabControl1_SelectedIndexChanged(object sender, EventArgs e)
        {
            UpdateLabelOptions();
        }

        private string _designBackgroundImage = "";
        private void button3_Click(object sender, EventArgs e)
        {
            //show open file dialog
            var dlg = new OpenFileDialog();
            dlg.Filter = "Image File (*.png)|*.png";
            if (dlg.ShowDialog() == DialogResult.OK)
            {
                //set design back image
                _designBackgroundImage = Convert.ToBase64String(System.IO.File.ReadAllBytes(dlg.FileName));
            }

            this.btnClearBackImage.Visible = !string.IsNullOrWhiteSpace(_designBackgroundImage);
        }

        private void btnClearBackImage_Click(object sender, EventArgs e)
        {
            _designBackgroundImage = "";
            this.btnClearBackImage.Visible = false;
        }


        private void SetPages(Collection<ThermalLabelPage> pages)
        {
            dgvPages.Rows.Clear();

            foreach (var p in pages)
            {
                dgvPages.Rows.Add(new string[] { p.X.ToString(), p.Y.ToString(), p.Width.ToString(), p.Height.ToString() });
            }
        }

        private Collection<ThermalLabelPage> GetPages()
        {
            var pages = new Collection<ThermalLabelPage>();

            foreach (DataGridViewRow p in dgvPages.Rows)
            {
                var page = new ThermalLabelPage() { X = p.Cells["X"].Value != null ? double.Parse(p.Cells["X"].Value.ToString()) : 0, Y = p.Cells["Y"].Value != null ? double.Parse(p.Cells["Y"].Value.ToString()) : 0, Width = p.Cells["Width"].Value != null ? double.Parse(p.Cells["Width"].Value.ToString()) : 0, Height = p.Cells["Height"].Value != null ? double.Parse(p.Cells["Height"].Value.ToString()) : 0 };
                
                if(!(page.Width <= 0 && page.Height <= 0))
                    pages.Add(page);                
            }

            return pages;
        }
    }
}
