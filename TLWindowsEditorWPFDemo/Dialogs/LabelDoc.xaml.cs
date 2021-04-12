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
using System.IO;
using Neodynamic.Windows.ThermalLabelEditor;
using Neodynamic.SDK.Printing;

namespace TLWindowsEditorWPFDemo
{
    /// <summary>
    /// Interaction logic for LabelDoc.xaml
    /// </summary>
    public partial class LabelDoc : Window
    {

        bool _init = true;

        public LabelDoc()
        {
            InitializeComponent();

            cboUnit.DataContext = Enum.GetNames(typeof(Neodynamic.SDK.Printing.UnitType)).OrderBy(ut => ut).ToList();

            _init = false;

            this.picRollSingleLabels.Source = Base64ToImage(ImageResources.SINGLE_LABEL);
            this.picRollMulticolumnLabels.Source = Base64ToImage(ImageResources.MULTICOLUMN_LABELS);
            this.picSheetLabels.Source = Base64ToImage(ImageResources.SHEET_LABELS);

            this.UpdateLabelOptions();
        }

        private void UpdateLabelOptions()
        {
            this.gbHLayout.Visibility = this.gbSheet.Visibility = this.gbPrintOptions.Visibility = Visibility.Collapsed;

            if (this.tabRollSingleLabel.IsSelected)
            {
                this.gbPrintOptions.Visibility = Visibility.Visible;
            }
            else if (this.tabRollMulticolLabels.IsSelected)
            {
                this.gbPrintOptions.Visibility = Visibility.Visible;
                this.gbHLayout.Visibility = Visibility.Visible;
            }
            else if (this.tabSheetLabels.IsSelected)
            {
                this.gbSheet.Visibility = Visibility.Visible;
                this.gbHLayout.Visibility = Visibility.Visible;
            }

        }

        public BitmapImage Base64ToImage(string imgBase64)
        {
            BitmapImage img = new BitmapImage();
            using (MemoryStream stream = new MemoryStream(Convert.FromBase64String(imgBase64)))
            {
                img.BeginInit();
                img.StreamSource = stream;
                img.CacheOption = BitmapCacheOption.OnLoad;
                img.EndInit();
                img.Freeze();
            }
            return img;
        }

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {

        }

        UnitType _currentLabelUnit = UnitType.Inch;

        public LabelDocument LabelDocument
        {
            get
            {
                var doc = new LabelDocument() { CutAfterPrinting = this.chkCutAfterPrinting.IsChecked.Value, GapLength = double.Parse(this.txtGapLength.Text), Height = double.Parse(this.txtHeight.Text), IsContinuous = this.chkIsContinuous.IsChecked.Value, MarkLength = double.Parse(this.txtMarkLength.Text), PrintMirror = this.chkPrintMirror.IsChecked.Value, PrintSpeed = this.txtPrintSpeed.Text, Width = double.Parse(this.txtWidth.Text), UnitType = (UnitType)Enum.Parse(typeof(UnitType), cboUnit.SelectedItem.ToString()) };

                if (this.tabRollMulticolLabels.IsSelected)
                {
                    doc.LabelsHorizontalGapLength = double.Parse(this.txtHorizGapLength.Text);
                    doc.LabelsPerRow = int.Parse(this.txtLabelsPerRow.Text);
                }
                else if (this.tabSheetLabels.IsSelected)
                {
                    doc.LabelsHorizontalGapLength = double.Parse(this.txtHorizGapLength.Text);
                    doc.LabelsPerRow = int.Parse(this.txtLabelsPerRow.Text);
                    doc.SheetLabelsCount = int.Parse(this.txtSheetLabelsCount.Text);
                    doc.SheetLabelsHeight = double.Parse(this.txtSheetHeight.Text);
                    doc.SheetLabelsWidth = double.Parse(this.txtSheetWidth.Text);
                    doc.SheetLabelsMargin = new FrameThickness() { Left = double.Parse(this.txtSheetLabelsMarginLeft.Text), Top = double.Parse(this.txtSheetLabelsMarginTop.Text) };
                }

                return doc;

            }
            set
            {
                _currentLabelUnit = value.UnitType;
                this.cboUnit.SelectedItem = value.UnitType.ToString();
                this.txtWidth.Text = value.Width.ToString();
                this.txtHeight.Text = value.Height.ToString();
                this.txtGapLength.Text = value.GapLength.ToString();
                this.txtHorizGapLength.Text = value.LabelsHorizontalGapLength.ToString();
                this.txtLabelsPerRow.Text = value.LabelsPerRow.ToString();
                this.txtMarkLength.Text = value.MarkLength.ToString();
                this.txtSheetHeight.Text = value.SheetLabelsHeight.ToString();
                this.txtSheetWidth.Text = value.SheetLabelsWidth.ToString();
                this.txtSheetLabelsCount.Text = value.SheetLabelsCount.ToString();
                this.txtSheetLabelsMarginLeft.Text = value.SheetLabelsMargin.Left.ToString();
                this.txtSheetLabelsMarginTop.Text = value.SheetLabelsMargin.Top.ToString();
                this.chkCutAfterPrinting.IsChecked = value.CutAfterPrinting;
                this.chkIsContinuous.IsChecked = value.IsContinuous;
                this.chkPrintMirror.IsChecked = value.PrintMirror;
                this.txtPrintSpeed.Text = value.PrintSpeed;

                if (value.SheetLabelsCount > 0 || value.SheetLabelsHeight > 0 || value.SheetLabelsWidth > 0)
                {
                    this.tabSheetLabels.IsSelected = true;
                }
                else if (value.LabelsPerRow > 1)
                {
                    this.tabRollMulticolLabels.IsSelected = true;
                }
                else
                {
                    this.tabRollSingleLabel.IsSelected = true;
                }

                this.UpdateLabelOptions();
            }
        }



        
        private void button1_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = true;
        }

        private void cboUnit_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (_init == false)
            {
                UnitType newUnit = (UnitType)Enum.Parse(typeof(UnitType), cboUnit.SelectedItem.ToString());
                this.txtWidth.Text = UnitUtils.Convert(_currentLabelUnit, double.Parse(txtWidth.Text), newUnit, 2).ToString();
                this.txtHeight.Text = UnitUtils.Convert(_currentLabelUnit, double.Parse(txtHeight.Text), newUnit, 2).ToString();
                this.txtGapLength.Text = UnitUtils.Convert(_currentLabelUnit, double.Parse(txtGapLength.Text), newUnit, 2).ToString();
                this.txtHorizGapLength.Text = UnitUtils.Convert(_currentLabelUnit, double.Parse(txtHorizGapLength.Text), newUnit, 2).ToString();
                this.txtMarkLength.Text = UnitUtils.Convert(_currentLabelUnit, double.Parse(txtMarkLength.Text), newUnit, 2).ToString();
                this.txtSheetHeight.Text = UnitUtils.Convert(_currentLabelUnit, double.Parse(txtSheetHeight.Text), newUnit, 2).ToString();
                this.txtSheetWidth.Text = UnitUtils.Convert(_currentLabelUnit, double.Parse(txtSheetWidth.Text), newUnit, 2).ToString();
                this.txtSheetLabelsMarginLeft.Text = UnitUtils.Convert(_currentLabelUnit, double.Parse(txtSheetLabelsMarginLeft.Text), newUnit, 2).ToString();
                this.txtSheetLabelsMarginTop.Text = UnitUtils.Convert(_currentLabelUnit, double.Parse(txtSheetLabelsMarginTop.Text), newUnit, 2).ToString();
                _currentLabelUnit = newUnit;
            }

        }

        private void chkIsContinuous_Checked(object sender, RoutedEventArgs e)
        {
            txtGapLength.IsEnabled = txtMarkLength.IsEnabled = false;
        }

        private void chkIsContinuous_Unchecked(object sender, RoutedEventArgs e)
        {
            txtGapLength.IsEnabled = txtMarkLength.IsEnabled = true;
        }

        private void TabControl_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            this.UpdateLabelOptions();
        }
    }
}
