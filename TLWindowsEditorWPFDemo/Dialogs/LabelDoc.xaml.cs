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
using Microsoft.Win32;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data;

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
                        
            this.picRollSingleLabels.Source = Base64ToImage(ImageResources.SINGLE_LABEL);
            this.picRollMulticolumnLabels.Source = Base64ToImage(ImageResources.MULTICOLUMN_LABELS);
            this.picSheetLabels.Source = Base64ToImage(ImageResources.SHEET_LABELS);
            this.picPages.Source = Base64ToImage(ImageResources.MULTI_PAGES_LABEL);

            this.UpdateLabelOptions();

        }

        private void UpdateLabelOptions()
        {
            this.gbHLayout.Visibility = this.gbSheet.Visibility = this.gbPrintOptions.Visibility = this.gbPages.Visibility = Visibility.Collapsed;

            this.gbVLayout.Visibility = this.gbMargin.Visibility = Visibility.Visible;

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
                this.gbMargin.Visibility = Visibility.Collapsed;
                this.gbSheet.Visibility = Visibility.Visible;
                this.gbHLayout.Visibility = Visibility.Visible;
            }
            else if (this.tabPages.IsSelected)
            {
                this.gbPages.Visibility = Visibility.Visible;
                this.gbVLayout.Visibility = Visibility.Collapsed;
            }

            this.btnClearBackImage.Visibility = string.IsNullOrWhiteSpace(_designBackgroundImage) ? Visibility.Hidden : Visibility.Visible;
            this.btnSetBackImage.Visibility = (this.tabPages.IsSelected ? Visibility.Hidden : Visibility.Visible);

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
                var doc = new LabelDocument() { CutAfterPrinting = this.chkCutAfterPrinting.IsChecked.Value, GapLength = double.Parse(this.txtGapLength.Text), Height = double.Parse(this.txtHeight.Text), IsContinuous = this.chkIsContinuous.IsChecked.Value, MarkLength = double.Parse(this.txtMarkLength.Text), PrintMirror = this.chkPrintMirror.IsChecked.Value, PrintSpeed = this.txtPrintSpeed.Text, Width = double.Parse(this.txtWidth.Text), UnitType = (UnitType)Enum.Parse(typeof(UnitType), cboUnit.SelectedItem.ToString()), DesignBackgroundImage = _designBackgroundImage };
                doc.Margin = new FrameThickness() { 
                    Left = double.Parse(this.txtMarginLeft.Text), 
                    Top = double.Parse(this.txtMarginTop.Text),
                    Right = double.Parse(this.txtMarginRight.Text),
                    Bottom = double.Parse(this.txtMarginBottom.Text)
                };


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
                else if (this.tabPages.IsSelected)
                {
                    doc.Pages = GetPages();
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

                this.txtMarginLeft.Text = value.Margin.Left.ToString();
                this.txtMarginTop.Text = value.Margin.Top.ToString();
                this.txtMarginRight.Text = value.Margin.Right.ToString();
                this.txtMarginBottom.Text = value.Margin.Bottom.ToString();

                _designBackgroundImage = value.DesignBackgroundImage;


                if (value.SheetLabelsCount > 0 || value.SheetLabelsHeight > 0 || value.SheetLabelsWidth > 0)
                {
                    this.tabSheetLabels.IsSelected = true;
                }
                else if (value.LabelsPerRow > 1)
                {
                    this.tabRollMulticolLabels.IsSelected = true;
                }
                else if (value.Pages.Count > 0)
                {
                    SetPages(value.Pages);
                    this.tabPages.IsSelected = true;
                    _designBackgroundImage = "";
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

                this.txtMarginLeft.Text = UnitUtils.Convert(_currentLabelUnit, double.Parse(txtMarginLeft.Text), newUnit, 2).ToString();
                this.txtMarginTop.Text = UnitUtils.Convert(_currentLabelUnit, double.Parse(txtMarginTop.Text), newUnit, 2).ToString();
                this.txtMarginRight.Text = UnitUtils.Convert(_currentLabelUnit, double.Parse(txtMarginRight.Text), newUnit, 2).ToString();
                this.txtMarginBottom.Text = UnitUtils.Convert(_currentLabelUnit, double.Parse(txtMarginBottom.Text), newUnit, 2).ToString();


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
            else
            {
                _init = false;
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

        private string _designBackgroundImage = "";

        private void btnSetBackImage_Click(object sender, RoutedEventArgs e)
        {
            //show open file dialog
            var dlg = new OpenFileDialog();
            dlg.Filter = "Image File (*.png)|*.png";
            if (dlg.ShowDialog() == true )
            {
                //set design back image
                _designBackgroundImage = Convert.ToBase64String(System.IO.File.ReadAllBytes(dlg.FileName));
            }

            this.btnClearBackImage.Visibility = string.IsNullOrWhiteSpace(_designBackgroundImage) ? Visibility.Hidden : Visibility.Visible;
        }

        private void btnClearBackImage_Click(object sender, RoutedEventArgs e)
        {
            _designBackgroundImage = "";
            this.btnClearBackImage.Visibility = Visibility.Hidden;
        }

        private void SetPages(Collection<ThermalLabelPage> pages)
        {
            dgPages.ItemsSource = pages;
        }

        private Collection<ThermalLabelPage> GetPages()
        {
            var rows = GetDataGridRows();

            var pages = new Collection<ThermalLabelPage>();

            if (rows != null)
            {
                foreach (DataGridRow r in rows)
                {
                    if (r != null)
                    {
                        pages.Add((ThermalLabelPage)r.Item);
                    }
                }
            }
            return pages;
        }

        public List<DataGridRow> GetDataGridRows()
        {
            var rows = new List<DataGridRow>();
            var itemsSource = dgPages.ItemsSource as IEnumerable<ThermalLabelPage>;
            if (itemsSource == null) 
                return null;
            
            foreach (var item in itemsSource)
            {
                var row = dgPages.ItemContainerGenerator.ContainerFromItem(item) as DataGridRow;
                if (row != null) rows.Add(row);
            }
            return rows;
        }
    }
}
