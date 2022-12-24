using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
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
using Xceed.Wpf.Toolkit.PropertyGrid;
using Neodynamic.SDK.Printing;
using Neodynamic.Windows.WPF.ThermalLabelEditor;
using Microsoft.Win32;
using System.Data;
using System.IO;
using Neodynamic.Windows.ThermalLabelEditor;
using System.Windows.Controls.Ribbon;

namespace TLWindowsEditorWPFDemo
{
    /// <summary>
    /// Interaction logic for MainForm.xaml
    /// </summary>
    public partial class MainForm : Window
    {
        public MainForm()
        {
            // Windows Label Editor LICENSE
            ThermalLabelEditor.LicenseOwner = "LICENSE OWNER FOR WINDOWS EDITOR HERE";
            ThermalLabelEditor.LicenseKey = "LICENSE KEY FOR WINDOWS EDITOR HERE";
            // SDK LICENSE
            ThermalLabel.LicenseOwner = "LICENSE OWNER FOR SDK HERE";
            ThermalLabel.LicenseKey = "LICENSE KEY FOR SDK HERE";
            

            InitializeComponent();
        }

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            
            //PropertyGrid custom UI Editors
            var itemProvider = new AssociatedMetadataTypeTypeDescriptionProvider(typeof(Item), typeof(ItemMetadata));
            TypeDescriptor.AddProvider(itemProvider, typeof(Item));
            var textItemProvider = new AssociatedMetadataTypeTypeDescriptionProvider(typeof(TextItem), typeof(TextItemMetadata));
            TypeDescriptor.AddProvider(textItemProvider, typeof(TextItem));
            var barcodeItemProvider = new AssociatedMetadataTypeTypeDescriptionProvider(typeof(BarcodeItem), typeof(BarcodeItemMetadata));
            TypeDescriptor.AddProvider(barcodeItemProvider, typeof(BarcodeItem));
            var shapeItemProvider = new AssociatedMetadataTypeTypeDescriptionProvider(typeof(ShapeItem), typeof(ShapeItemMetadata));
            TypeDescriptor.AddProvider(shapeItemProvider, typeof(ShapeItem));
            var closedShapeItemProvider = new AssociatedMetadataTypeTypeDescriptionProvider(typeof(ClosedShapeItem), typeof(ClosedShapeItemMetadata));
            TypeDescriptor.AddProvider(closedShapeItemProvider, typeof(ClosedShapeItem));
            var imageItemProvider = new AssociatedMetadataTypeTypeDescriptionProvider(typeof(ImageItem), typeof(ImageItemMetadata));
            TypeDescriptor.AddProvider(imageItemProvider, typeof(ImageItem));



            //THIS IS A LIST OF PROPERTIES FOR CUSTOMIZING THE EDITOR UI


            //thermalLabelEditor1.RulerBackground = Brushes.Tomato;
            //thermalLabelEditor1.RulerLinesColor = Colors.Gold;
            //thermalLabelEditor1.RulerForeColor = Colors.White;
            //thermalLabelEditor1.RulerSelectionColor = Colors.Purple;

            //LinearGradientBrush lgb = new LinearGradientBrush(Colors.LightGray, Colors.White, 45);
            //thermalLabelEditor1.LabelDocumentFrameBackground = lgb;
            //thermalLabelEditor1.LabelDocumentFrameBorderColor = Colors.Black;
            //thermalLabelEditor1.LabelDocumentFrameBorderThickness = 3;
            //thermalLabelEditor1.LabelDocumentFrameCornerRadius = 0;

            //thermalLabelEditor1.NoImageFileName = @"c:\noimage.jpg";


            //thermalLabelEditor1.AdornerHandlerBackColor = Colors.Yellow;
            //thermalLabelEditor1.AdornerHandlerHoverBackColor = Colors.DarkCyan;
            //thermalLabelEditor1.AdornerHandlerBorderColor = Colors.Gray;
            //thermalLabelEditor1.AdornerFrameBorderColor = Colors.Gray;

            //thermalLabelEditor1.AdornerSelectionBackColor = System.Windows.Media.Color.FromArgb(128, 255, 0, 128);
            //thermalLabelEditor1.AdornerSelectionBorderColor = System.Windows.Media.Color.FromArgb(128, 255, 0, 255);

            //thermalLabelEditor1.AngleSnap = 45;

            //thermalLabelEditor1.ImageProcessingDpi = 300;

            //thermalLabelEditor1.TextItemEditModeEnabled = false;

            //thermalLabelEditor1.SnapToGrid = true;
            //thermalLabelEditor1.GridSize = 0.1;
            //thermalLabelEditor1.ShowGrid = true;

            //thermalLabelEditor1.AdornerLegendsVisible = false;

            //thermalLabelEditor1.AdornerOutOfLabelVisible = false;
            //thermalLabelEditor1.AdornerOutOfLabelColor = Colors.Red;

            //thermalLabelEditor1.ItemToolTipBackColor = Colors.SteelBlue;
            //thermalLabelEditor1.ItemToolTipBorderColor = Colors.SteelBlue;
            //thermalLabelEditor1.ItemToolTipForeColor = Colors.White;


            this.gallery1.EditLabel += Gallery1_EditLabel;

            //load barcode symbologies
            this.cboBarcodeSymbologies.ItemsSource = Enum.GetNames(typeof(BarcodeSymbology)).OrderBy(x => x).ToArray();

        }

        private void Gallery1_EditLabel(object sender, EventArgs e)
        {
            //Create a ThermalLabel obj from a Template
            ThermalLabel tl = ThermalLabel.CreateFromXmlTemplate(this.gallery1.Entries[this.gallery1.LabelIndex].XmlContent);
            //load it on the editor surface
            thermalLabelEditor1.LoadThermalLabel(tl);
            //load label expressions
            SetLabelExpressions(tl.Expressions.ToList<string>());

            this.tabMain.SelectedIndex = 1;
        }

        private void SetLabelExpressions(List<string> expressions)
        {
            StringBuilder exprBuffer = new StringBuilder();
            for (int i = 0; i < expressions.Count; i++)
            {
                exprBuffer.Append(expressions[i]);
                if (i < expressions.Count - 1)
                    exprBuffer.Append(Environment.NewLine);
            }

            this.txtLabelExpressions.Text = exprBuffer.ToString();

        }

        private void SetLabelExpressions(ref ThermalLabel tLabel)
        {
            tLabel.Expressions.Clear();
            if (string.IsNullOrWhiteSpace(this.txtLabelExpressions.Text) == false)
            {
                var expressions = this.txtLabelExpressions.Text.Split(new string[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries);
                for (int i = 0; i < expressions.Length; i++)
                    tLabel.Expressions.Add(expressions[i]);
            }
        }

        private void thermalLabelEditor1_SelectionChanged(object sender, EventArgs e)
        {
            SetCurrentSelectedItem();
        }

        //the current selected Item on the editor
        Item _currentSelectedItem = null;

        private void SetCurrentSelectedItem()
        {
            //clean up resources if needed!
            if (_currentSelectedItem != null)
            {
                _currentSelectedItem.PropertyChanged -= _currentSelection_PropertyChanged;
                _currentSelectedItem = null;
            }

            //get selected Item obj
            if (thermalLabelEditor1.CurrentSelection != null)
                _currentSelectedItem = thermalLabelEditor1.CurrentSelection.Clone();

            if (_currentSelectedItem != null)
            {
                _currentSelectedItem.PropertyChanged += new PropertyChangedEventHandler(_currentSelection_PropertyChanged);
            }



            //display Item's property on the property grid control
            //----------------------------------------------------
            //NOTE: there may be more than one item selected on the editor.
            //we are not handling this kind of selection in this demo 
            //for simplicity but you can extend it to support such object
            
            if (_currentSelectedItem is MultipleSelectionItem)
                propertyGrid1.SelectedObject = null;
            else
            {
                CustomItemWrapper selItem = null;

                if (_currentSelectedItem != null)
                {
                    selItem = new CustomItemWrapper(_currentSelectedItem);

                    if (_currentSelectedItem is BarcodeItem)
                    {
                        this.cboBarcodeSymbologies.SelectedItem = ((BarcodeItem)_currentSelectedItem).Symbology.ToString();
                    }
                }

                propertyGrid1.SelectedObject = selItem;
            }
            

            
            
            //display barcode symbology selection?
            this.pnlBarcodeSymbology.Visibility = _currentSelectedItem is BarcodeItem ? Visibility.Visible : Visibility.Collapsed;
            this.propsGridRow1.Height = new GridLength(_currentSelectedItem is BarcodeItem ? 100d : 0d);
        }


        void _currentSelection_PropertyChanged(object sender, PropertyChangedEventArgs e)
        {
            //update-refresh the selected item on the editor
            thermalLabelEditor1.CurrentSelection.UpdateFrom(_currentSelectedItem);
            thermalLabelEditor1.UpdateSelectionItemsProperties();

            //update thermal label obj for Expression dialog
            if (e.PropertyName == "Name") Global.CurrentThermalLabel = thermalLabelEditor1.CreateThermalLabel();

        }

        private void thermalLabelEditor1_SelectionAreaChanged(object sender, EventArgs e)
        {

            //Show in the 'status bar' the dimensions of the selected area
            //we're going to format it including the unit

            Rect selArea = thermalLabelEditor1.CurrentSelectionArea;

            if (selArea.Width > 0 && selArea.Height > 0)
            {
                string unitDescription;
                if (thermalLabelEditor1.LabelDocument.UnitType == UnitType.Inch)
                    unitDescription = "in";
                else if (thermalLabelEditor1.LabelDocument.UnitType == UnitType.DotsPerInch)
                    unitDescription = "dots";
                else if (thermalLabelEditor1.LabelDocument.UnitType == UnitType.Pica)
                    unitDescription = "pc";
                else if (thermalLabelEditor1.LabelDocument.UnitType == UnitType.Point)
                    unitDescription = "pt";
                else
                    unitDescription = thermalLabelEditor1.LabelDocument.UnitType.ToString().ToLower();


                object[] data = new object[]{unitDescription,
                                         selArea.X,
                                         selArea.Y,
                                         selArea.Width,
                                         selArea.Height};

                string decimals = "0".PadRight(thermalLabelEditor1.LabelDocument.NumOfFractionalDigits, '0');

                txtSelectionInfo.Text = string.Format("X: {1:0." + decimals + "}{0}   Y: {2:0." + decimals + "}{0}   Width: {3:0." + decimals + "}{0}   Height: {4:0." + decimals + "}{0}", data);
            }
            else
            {
                txtSelectionInfo.Text = "";
            }
        }

        private void editorContextMenu_Opened(object sender, RoutedEventArgs e)
        {
            //Disable/Enable context menu items based on the selected items on the editor's surface
            Item selItem = thermalLabelEditor1.CurrentSelection;

            //Font option is available for TextItem and BarcodeItem only
            if (selItem is TextItem ||
                selItem is BarcodeItem ||
                selItem is ImageItem ||
                selItem is RFIDTagItem)
            {
                cmExpression.Visibility = System.Windows.Visibility.Visible;
            }
            else
            {
                cmExpression.Visibility = System.Windows.Visibility.Collapsed;
            }
            cmSepExpr.Visibility = cmExpression.Visibility;

            cmArrange.IsEnabled = (selItem != null);

            cmLock.Visibility = (selItem == null || selItem is MultipleSelectionItem) ? System.Windows.Visibility.Collapsed : System.Windows.Visibility.Visible;

            if (cmLock.Visibility == System.Windows.Visibility.Visible)
            {
                cmLock.Header = selItem.Locked ? "Unlock" : "Lock";
            }

        }


        
        private void thermalLabelEditor1_CurrentSelectionBeforeDelete(object sender, System.ComponentModel.CancelEventArgs e)
        {
            e.Cancel = (MessageBox.Show("Do you really want to delete the selected items?", "Delete Current Selection", MessageBoxButton.YesNo, MessageBoxImage.Question) == MessageBoxResult.No);
        }

        private void CmExpression_Click(object sender, RoutedEventArgs e)
        {
            //get current selection
            Item selItem = thermalLabelEditor1.CurrentSelection;

            //show Expression dialog
            ExpressionDialog exprDialog = new ExpressionDialog();
            exprDialog.Owner = this;

            exprDialog.Expression = selItem.Expression;

            if (thermalLabelEditor1.LabelDocument != null)
                exprDialog.CurrentThermalLabel = thermalLabelEditor1.CreateThermalLabel();
            else
                exprDialog.CurrentThermalLabel = null;

            if (exprDialog.ShowDialog() == true)
            {
                //get new Expression
                selItem.Expression = exprDialog.Expression;

                //update editor's surface
                thermalLabelEditor1.UpdateSelectionItemsProperties();
            }

        }

        private void cmdSetBarcodeSampleCode_Click(object sender, RoutedEventArgs e)
        {
            if (_currentSelectedItem is BarcodeItem)
            {
                //Set sample code base don the selected Symbology
                ((BarcodeItem)_currentSelectedItem).Code = BarcodeItemUtils.GenerateSampleCode((BarcodeSymbology)Enum.Parse(typeof(BarcodeSymbology), this.cboBarcodeSymbologies.SelectedItem.ToString()));
                //refresh property grid
                SetCurrentSelectedItem();
            }
        }

        private void thermalLabelEditor1_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            //Sample of double click on an item
            Item curItem = thermalLabelEditor1.CurrentSelection;
            if (curItem != null && curItem is RectangleShapeItem)
            {
                //MessageBox.Show("Double Click on a Rect!");
            }
        }

        private void thermalLabelEditor1_CurrentSelectionTextChanged(object sender, Neodynamic.Windows.ThermalLabelEditor.TextChangedEventArgs e)
        {
            Console.WriteLine(e.Text); 
        }

        private void thermalLabelEditor1_NewItemCreated(object sender, EventArgs e)
        {
            Console.WriteLine("New item created at " + DateTime.Now);
        }

        private void thermalLabelEditor1_ClipboardStateChanged(object sender, EventArgs e)
        {
            //Enable/disable options depending on the state of the internal Clipboard object
            menuCopy.IsEnabled = thermalLabelEditor1.CanCopy;
            menuCut.IsEnabled = thermalLabelEditor1.CanCut;
            menuPaste.IsEnabled = thermalLabelEditor1.CanPaste;

            cmCopy.IsEnabled = menuCopy.IsEnabled;
            cmCut.IsEnabled = menuCut.IsEnabled;
            cmPaste.IsEnabled = menuPaste.IsEnabled;
        }

        private void thermalLabelEditor1_UndoStateChanged(object sender, EventArgs e)
        {
            //Enable/disable undo/redo options depending on the state of the editor
            menuUndo.IsEnabled = thermalLabelEditor1.CanUndo;
            menuRedo.IsEnabled = thermalLabelEditor1.CanRedo;
        }

        private void thermalLabelEditor1_SelectionItemPropertyChanged(object sender, EventArgs e)
        {
            SetCurrentSelectedItem();
        }

        private void thermalLabelEditor1_LostFocus(object sender, RoutedEventArgs e)
        {
            if (thermalLabelEditor1.LabelDocument != null)
                Global.CurrentThermalLabel = thermalLabelEditor1.CreateThermalLabel();
            else
                Global.CurrentThermalLabel = null;
        }

        private void cboBarcodeSymbologies_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            //Update property grid if barcode symbology changed
            if (_currentSelectedItem is BarcodeItem &&
                this.cboBarcodeSymbologies.SelectedItem.ToString() != ((BarcodeItem)_currentSelectedItem).Symbology.ToString())
            {
                //Set the new selected Symbology
                ((BarcodeItem)_currentSelectedItem).Symbology = (BarcodeSymbology)Enum.Parse(typeof(BarcodeSymbology), this.cboBarcodeSymbologies.SelectedItem.ToString());
                //refresh property grid
                SetCurrentSelectedItem();
            }
        }

        private void cmdDataSourceFile_Click(object sender, RoutedEventArgs e)
        {
            var dlg = new OpenFileDialog();
            dlg.Filter = "XML Data Source (*.xml)|*.xml";
            if (dlg.ShowDialog() == true)
            {
                try
                {
                    var ds = new DataSet();
                    ds.ReadXml(dlg.FileName);

                    this.lstDataFields.ItemsSource = Global.DataFields = ds.Tables[0].Columns.Cast<DataColumn>().Select(x => x.ColumnName).ToList<string>();

                    this.txtDataSourceFile.Text = dlg.FileName;

                    this.txtDataSourceContent.Text = (this.txtDataSourceFile.Text == "EmbeddedDataSourceSample" ? Global.DataSourceXmlSample : File.ReadAllText(this.txtDataSourceFile.Text));

                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
        }

        private void cmdRemoveDataSource_Click(object sender, RoutedEventArgs e)
        {
            this.txtDataSourceFile.Text = "";
            this.lstDataFields.ItemsSource = null;
            Global.DataFields = null;
            this.txtDataSourceContent.Text = "";
        }

        private void cmdUseEmbeddedSample_Click(object sender, RoutedEventArgs e)
        {
            var ds = new DataSet();
            ds.ReadXml(new System.IO.StringReader(Global.DataSourceXmlSample));

            this.lstDataFields.ItemsSource = Global.DataFields = ds.Tables[0].Columns.Cast<DataColumn>().Select(x => x.ColumnName).ToList<string>();

            this.txtDataSourceFile.Text = "EmbeddedDataSourceSample";

            this.txtDataSourceContent.Text = (this.txtDataSourceFile.Text == "EmbeddedDataSourceSample" ? Global.DataSourceXmlSample : File.ReadAllText(this.txtDataSourceFile.Text));
        }

        private void cmdEditExpressions_Click(object sender, RoutedEventArgs e)
        {
            //show Expression dialog
            Global.ExprEditor.Expression = this.txtLabelExpressions.Text;
            if (thermalLabelEditor1.LabelDocument != null)
                Global.CurrentThermalLabel = thermalLabelEditor1.CreateThermalLabel();
            else
                Global.CurrentThermalLabel = null;

            Global.ExprEditor.ShowDialog();

            if (Global.ExprEditor.UpdateExpression)
            {
                this.txtLabelExpressions.Text = Global.ExprEditor.Expression;
            }
        }

        private void menuUndo_Click(object sender, RoutedEventArgs e)
        {
            thermalLabelEditor1.Undo();
        }

        private void menuRedo_Click(object sender, RoutedEventArgs e)
        {
            thermalLabelEditor1.Redo();
        }

        private void menuPaste_Click(object sender, RoutedEventArgs e)
        {
            thermalLabelEditor1.Paste();
        }

        private void menuCut_Click(object sender, RoutedEventArgs e)
        {
            thermalLabelEditor1.Cut();
        }

        private void menuCopy_Click(object sender, RoutedEventArgs e)
        {
            thermalLabelEditor1.Copy();
        }

        private void menuDelete_Click(object sender, RoutedEventArgs e)
        {
            thermalLabelEditor1.DeleteSelectedItems();
        }

        private void menuLabelSetup_Click(object sender, RoutedEventArgs e)
        {
            //is there any label on the editor's surface...
            if (thermalLabelEditor1.LabelDocument != null)
            {
                //Open dialog for label document setup
                LabelDoc labelSetup = new LabelDoc();
                labelSetup.LabelDocument = thermalLabelEditor1.LabelDocument;
                labelSetup.Owner = this;

                if (labelSetup.ShowDialog() == true)
                {
                    LabelDocument doc = labelSetup.LabelDocument;

                    //Invoke UpdateLabelDocument method for updating the label document inside the editor
                    thermalLabelEditor1.UpdateLabelDocument(doc);

                    //refresh property grid with the selected item
                    SetCurrentSelectedItem();
                }

                this.tabMain.SelectedIndex = 1;
            }
        }

        private void cmdZoomIn_Click(object sender, RoutedEventArgs e)
        {
            //Zoom in...
            thermalLabelEditor1.Zoom += 10;
        }

        private void cmdZoomOut_Click(object sender, RoutedEventArgs e)
        {
            //Zoom out...
            thermalLabelEditor1.Zoom -= 10;
        }

        private void cmdZoom100_Click(object sender, RoutedEventArgs e)
        {
            //Set up zoom to 100%
            thermalLabelEditor1.Zoom = 100;
        }

        private void menuBringForward_Click(object sender, RoutedEventArgs e)
        {
            thermalLabelEditor1.BringForward();
        }

        private void menuSendBackward_Click(object sender, RoutedEventArgs e)
        {
            thermalLabelEditor1.SendBackward();
        }

        private void menuBringToFront_Click(object sender, RoutedEventArgs e)
        {
            thermalLabelEditor1.BringToFront();
        }

        private void menuSendToBack_Click(object sender, RoutedEventArgs e)
        {
            thermalLabelEditor1.SendToBack();
        }

        private void menuLA_Click(object sender, RoutedEventArgs e)
        {
            thermalLabelEditor1.LayoutSelectedItems((LayoutAlignment)Enum.Parse(typeof(LayoutAlignment), ((RibbonButton)sender).Name.Substring(4)));
        }

        private void menuGroup_Click(object sender, RoutedEventArgs e)
        {
            thermalLabelEditor1.Group();
        }

        private void menuUngroup_Click(object sender, RoutedEventArgs e)
        {
            thermalLabelEditor1.Ungroup();
        }

        private void menuPointer_Click(object sender, RoutedEventArgs e)
        {
            //Set the ActiveTool to Pointer
            thermalLabelEditor1.ActiveTool = EditorTool.Pointer;
        }

        private void menuRect_Click(object sender, RoutedEventArgs e)
        {
            //is there any label on the editor's surface...
            if (thermalLabelEditor1.LabelDocument != null)
            {
                //Set the ActiveTool to Rectangle
                thermalLabelEditor1.ActiveTool = EditorTool.Rectangle;

                //Create and set the ActiveToolItem i.e. a RectangleShapeItem
                RectangleShapeItem rectItem = new RectangleShapeItem();
                rectItem.ConvertToUnit(thermalLabelEditor1.LabelDocument.UnitType);

                thermalLabelEditor1.ActiveToolItem = rectItem;
            }
        }

        private void menuEllipse_Click(object sender, RoutedEventArgs e)
        {
            //is there any label on the editor's surface...
            if (thermalLabelEditor1.LabelDocument != null)
            {
                //Set the ActiveTool to Ellipse
                thermalLabelEditor1.ActiveTool = EditorTool.Ellipse;

                //Create and set the ActiveToolItem i.e. a EllipseShapeItem
                EllipseShapeItem ellItem = new EllipseShapeItem();
                ellItem.ConvertToUnit(thermalLabelEditor1.LabelDocument.UnitType);

                thermalLabelEditor1.ActiveToolItem = ellItem;
            }
        }

        private void menuLine_Click(object sender, RoutedEventArgs e)
        {
            //is there any label on the editor's surface...
            if (thermalLabelEditor1.LabelDocument != null)
            {
                //Set the ActiveTool to Line
                thermalLabelEditor1.ActiveTool = EditorTool.Line;

                //Create and set the ActiveToolItem i.e. a LineShapeItem
                LineShapeItem lineItem = new LineShapeItem();
                lineItem.ConvertToUnit(thermalLabelEditor1.LabelDocument.UnitType);

                thermalLabelEditor1.ActiveToolItem = lineItem;
            }
        }

        private void menuResidentFont_Click(object sender, RoutedEventArgs e)
        {
            //is there any label on the editor's surface...
            if (thermalLabelEditor1.LabelDocument != null)
            {
                //Set the ActiveTool to Text
                thermalLabelEditor1.ActiveTool = EditorTool.Text;

                //Create and set the ActiveToolItem i.e. a TextItem
                TextItem txtItem = new TextItem();
                txtItem.Font.Name = Neodynamic.SDK.Printing.Font.NativePrinterFontA;
                txtItem.Font.Size = 10;
                txtItem.Text = "Type here";

                txtItem.ConvertToUnit(thermalLabelEditor1.LabelDocument.UnitType);

                thermalLabelEditor1.ActiveToolItem = txtItem;
            }
        }

        private void menuText_Click(object sender, RoutedEventArgs e)
        {
            //is there any label on the editor's surface...
            if (thermalLabelEditor1.LabelDocument != null)
            {
                //Set the ActiveTool to Text
                thermalLabelEditor1.ActiveTool = EditorTool.Text;

                //Create and set the ActiveToolItem i.e. a TextItem
                TextItem txtItem = new TextItem();
                txtItem.Font.Name = "ZPL Font 0";
                txtItem.Font.Size = 10;
                txtItem.Text = "Type here";

                txtItem.ConvertToUnit(thermalLabelEditor1.LabelDocument.UnitType);

                thermalLabelEditor1.ActiveToolItem = txtItem;
            }
        }
    

        private void menuArcText_Click(object sender, RoutedEventArgs e)
        {
        //is there any label on the editor's surface...
            if (thermalLabelEditor1.LabelDocument != null)
            {
                //Set the ActiveTool to Text
                thermalLabelEditor1.ActiveTool = EditorTool.Text;

                //Create and set the ActiveToolItem i.e. a TextItem
                TextItem txtItem = new TextItem();
                txtItem.Font.Name = "Arial";
                txtItem.Font.Size = 16;
                txtItem.Text = "ARC TEXT";
                txtItem.Sizing = TextSizing.Arc;

                txtItem.ConvertToUnit(thermalLabelEditor1.LabelDocument.UnitType);

                thermalLabelEditor1.ActiveToolItem = txtItem;
            }
        }

        private void menuOutText_Click(object sender, RoutedEventArgs e)
        {
            //is there any label on the editor's surface...
            if (thermalLabelEditor1.LabelDocument != null)
            {
                //Set the ActiveTool to Text
                thermalLabelEditor1.ActiveTool = EditorTool.Text;

                //Create and set the ActiveToolItem i.e. a TextItem
                TextItem txtItem = new TextItem();
                txtItem.Font.Name = "Arial";
                //txtItem.Font.Size = 16;
                txtItem.Text = "OUTLINE";
                txtItem.Sizing = TextSizing.Stretch;
                txtItem.StrokeThickness = 0.03d;
                txtItem.StrokeColorHex = "#cc0000";
                txtItem.ForeColorHex = "#ffffff";

                txtItem.ConvertToUnit(thermalLabelEditor1.LabelDocument.UnitType);

                thermalLabelEditor1.ActiveToolItem = txtItem;
            }
        }

        private void menuImage_Click(object sender, RoutedEventArgs e)
        {
            //is there any label on the editor's surface...
            if (thermalLabelEditor1.LabelDocument != null)
            {


                //HERE YOU COULD OPEN A FILE DIALOG TO THE USE FOR SELECTING SOME IMAGE FILE                
                //OR PICK ONE FROM A 'GALLERY', ETC.
                //imgItem.SourceFile = @"C:\Pictures\glass.gif";
                var dlg = new OpenFileDialog();
                dlg.Filter = "Image File (*.bmp, *.gif, *.jpg, *.png)|*.bmp; *.gif; *.jpg; *.png";
                if (dlg.ShowDialog() == true)
                {

                    //Set the ActiveTool to Image
                    thermalLabelEditor1.ActiveTool = EditorTool.Image;

                    //Create and set the ActiveToolItem i.e. an ImageItem
                    ImageItem imgItem = new ImageItem();
                    imgItem.SourceFile = dlg.FileName;

                    thermalLabelEditor1.ActiveToolItem = imgItem;
                }
                else
                {
                    thermalLabelEditor1.ActiveTool = EditorTool.Pointer;
                }

            }
        }

        private void menuBarcode_Click(object sender, RoutedEventArgs e)
        {
            //is there any label on the editor's surface...
            if (thermalLabelEditor1.LabelDocument != null)
            {
                //Set the ActiveTool to Barcode
                thermalLabelEditor1.ActiveTool = EditorTool.Barcode;

                //Create and set the ActiveToolItem i.e. a BarcodeItem
                //HERE YOU COULD CHANGE THE DEFAULT BARCODE TO BE DISPLAYED
                //OR OPEN A BARCODE DIALOG FOR SETTINGS, ETC.
                BarcodeItem bcItem = new BarcodeItem();
                
                bcItem.Symbology = ((RibbonButton)sender).Name == "menuBarcode1D" ? BarcodeSymbology.Code128 : BarcodeSymbology.QRCode;
                
                bcItem.Code = BarcodeItemUtils.GenerateSampleCode(bcItem.Symbology);
                bcItem.Font.Name = Neodynamic.SDK.Printing.Font.NativePrinterFontA;
                bcItem.Font.Size = 5;
                bcItem.BarcodeAlignment = BarcodeAlignment.MiddleCenter;

                bcItem.Sizing = BarcodeSizing.FitProportional; //New feature since v7.0

                bcItem.ConvertToUnit(thermalLabelEditor1.LabelDocument.UnitType);

                thermalLabelEditor1.ActiveToolItem = bcItem;
            }
        }


        private void menuRFID_Click(object sender, RoutedEventArgs e)
        {
            //is there any label on the editor's surface...
            if (thermalLabelEditor1.LabelDocument != null)
            {
                //Set image, logo or icon you'd like to show for RFID tag!
                //thermalLabelEditor1.RFIDTagImageFileName = @"C:\Images\rfid.png";


                //Set the ActiveTool to RFID Tag
                thermalLabelEditor1.ActiveTool = EditorTool.RFIDTag;

                //Create and set the ActiveToolItem i.e. a RFIDTagItem
                RFIDTagItem rfidTagItem = new RFIDTagItem();
                rfidTagItem.ConvertToUnit(thermalLabelEditor1.LabelDocument.UnitType);

                thermalLabelEditor1.ActiveToolItem = rfidTagItem;
            }
        }

        private void menuNew_Click(object sender, RoutedEventArgs e)
        {
            //Create a new 'document'
            LabelDoc labelSetup = new LabelDoc();
            labelSetup.LabelDocument = new LabelDocument() { UnitType = UnitType.Inch, Width = 4, Height = 3 };

            if (labelSetup.ShowDialog() == true)
            {
                LabelDocument doc = labelSetup.LabelDocument;

                //Create a ThermalLabel object based on the dialog box info
                ThermalLabel tLabel = new ThermalLabel();
                tLabel.UnitType = doc.UnitType;
                tLabel.Width = doc.Width;
                tLabel.Height = doc.Height;
                tLabel.IsContinuous = doc.IsContinuous;
                tLabel.GapLength = doc.GapLength;
                tLabel.MarkLength = doc.MarkLength;
                tLabel.PrintMirror = doc.PrintMirror;
                tLabel.PrintSpeed = doc.PrintSpeed;
                tLabel.CutAfterPrinting = doc.CutAfterPrinting;
                tLabel.LabelsHorizontalGapLength = doc.LabelsHorizontalGapLength;
                tLabel.LabelsPerRow = doc.LabelsPerRow;
                tLabel.SheetLabelsCount = doc.SheetLabelsCount;
                tLabel.SheetLabelsHeight = doc.SheetLabelsHeight;
                tLabel.SheetLabelsWidth = doc.SheetLabelsWidth;
                tLabel.SheetLabelsMargin = doc.SheetLabelsMargin;

                foreach (var p in doc.Pages)
                {
                    tLabel.Pages.Add(p);
                }

                //load it on the editor surface
                thermalLabelEditor1.LoadThermalLabel(tLabel);

                this.tabMain.SelectedIndex = 1;

            }
        }

        private void menuOpen_Click(object sender, RoutedEventArgs e)
        {
            //open a thermal label template
            //NOTE: *.tl extension is just that! The content of such files should be a ThermalLabel XML Template
            //      *.tlj extension is just that! The content of such files should be a ThermalLabel JSON Template    
            var dlg = new OpenFileDialog();
            dlg.Filter = "ThermalLabel Template (*.xml, *.tl, *.tlj)|*.xml;*.tl;*.tlj";
            if (dlg.ShowDialog() == true)
            {
                try
                {
                    //Create a ThermalLabel obj from a Template
                    ThermalLabel tl = dlg.FileName.EndsWith(".tlj") ? ThermalLabel.CreateFromJsonTemplate(System.IO.File.ReadAllText(dlg.FileName)) : ThermalLabel.CreateFromXmlTemplate(System.IO.File.ReadAllText(dlg.FileName));


                    //load it on the editor surface
                    thermalLabelEditor1.LoadThermalLabel(tl);

                    //load label expressions
                    SetLabelExpressions(tl.Expressions.ToList<string>());

                    this.tabMain.SelectedIndex = 1;
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
        }

        private void menuClose_Click(object sender, RoutedEventArgs e)
        {
            //Save label before closing?
            if (thermalLabelEditor1.CanUndo)
            {
                var dr = MessageBox.Show("Do you want to save the current label?", "ThermalLabel Editor", MessageBoxButton.YesNoCancel, MessageBoxImage.Exclamation);
                if (dr == MessageBoxResult.Yes)
                {
                    //allow saving current label
                    menuSave_Click(sender, e);
                    //close label
                    thermalLabelEditor1.Close();
                }
                else if (dr == MessageBoxResult.No)
                {
                    //close label
                    thermalLabelEditor1.Close();
                }
                else
                {
                    //do nothing
                }
            }
            else
            {
                //close label
                thermalLabelEditor1.Close();
            }
        }

        private void menuSave_Click(object sender, RoutedEventArgs e)
        {

            //is there any label on the editor's surface...
            if (thermalLabelEditor1.LabelDocument != null)
            {
                //open save dialog...
                //NOTE: we have used *.tl file extension for ThermalLabel XML templates
                //and *.tlj file extension for ThermalLabel JSON templates
                //BUT you can change it to whatever you want
                var dlg = new SaveFileDialog();
                dlg.DefaultExt = ".tl";
                dlg.Filter = "ThermalLabel XML Template (.tl)|*.tl|ThermalLabel JSON Template (.tlj)|*.tlj";
                if (dlg.ShowDialog() == true)
                {
                    try
                    {
                        // get ThermalLabel obj from the editor canvas
                        ThermalLabel tLabel = this.thermalLabelEditor1.ViewRotation == Rotate.None ? this.thermalLabelEditor1.CreateThermalLabel() : this.thermalLabelEditor1.RotateLabel(this.thermalLabelEditor1.CreateThermalLabel(), this.thermalLabelEditor1.ViewRotation, Rotate.None);
                        // set Label expressions (if any)
                        SetLabelExpressions(ref tLabel);

                        //save ThermalLabel template
                        var embedFonts = (dlg.FilterIndex == 2 || dlg.FilterIndex == 4);
                        File.WriteAllText(dlg.FileName, dlg.FileName.EndsWith(".tl") ? tLabel.GetXmlTemplate(embedFonts) : tLabel.GetJsonTemplate(embedFonts));
                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show(ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                    }
                }
            }
        }

        private void menuPrint_Click(object sender, RoutedEventArgs e)
        {

            //Create the ThermalLabel obj from the editor
            ThermalLabel tLabel = this.thermalLabelEditor1.ViewRotation == Rotate.None ? this.thermalLabelEditor1.CreateThermalLabel() : this.thermalLabelEditor1.RotateLabel(this.thermalLabelEditor1.CreateThermalLabel(), this.thermalLabelEditor1.ViewRotation, Rotate.None);

            if (tLabel != null)
            {
                try
                {
                    // set Label expressions (if any)
                    SetLabelExpressions(ref tLabel);

                    //is there any data source?
                    if (string.IsNullOrWhiteSpace(this.txtDataSourceFile.Text) == false)
                    {
                        var ds = new DataSet();
                        if (this.txtDataSourceFile.Text == "EmbeddedDataSourceSample")
                            ds.ReadXml(new System.IO.StringReader(Global.DataSourceXmlSample));
                        else
                            ds.ReadXml(new FileStream(this.txtDataSourceFile.Text, FileMode.Open, FileAccess.Read));

                        tLabel.DataSource = ds;
                    }


                    //Display Print Job dialog...           
                    PrintJobDialog frmPrintJob = new PrintJobDialog();
                    frmPrintJob.Owner = this;
                    if (frmPrintJob.ShowDialog() == true)
                    {
                        //create a PrintJob object
                        using (WindowsPrintJob pj = new WindowsPrintJob(frmPrintJob.PrinterSettings))
                        {
                            pj.Copies = frmPrintJob.Copies; // set copies
                            pj.PrintOrientation = frmPrintJob.PrintOrientation; //set orientation
                            pj.ThermalLabel = tLabel; // set the ThermalLabel object

                            //pj.CommandsOptimizationEnabled = false;

                            if (frmPrintJob.PrintAsGraphic)
                                pj.PrintAsGraphic(); //print to any printer using Windows driver
                            else
                                pj.Print(); //print to thermal printer      
                        }
                    }

                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
        }

        private void menuExportToPDF_Click(object sender, RoutedEventArgs e)
        {
            //Create the ThermalLabel obj from the editor
            ThermalLabel tLabel = this.thermalLabelEditor1.ViewRotation == Rotate.None ? this.thermalLabelEditor1.CreateThermalLabel() : this.thermalLabelEditor1.RotateLabel(this.thermalLabelEditor1.CreateThermalLabel(), this.thermalLabelEditor1.ViewRotation, Rotate.None);

            if (tLabel != null)
            {
                double dpi = 96;

                var d = new DpiDialog();
                d.Dpi = dpi;
                if (d.ShowDialog() == true)
                {
                    dpi = d.Dpi;

                    //open save dialog...
                    SaveFileDialog dlg = new SaveFileDialog();
                    dlg.DefaultExt = ".pdf";
                    dlg.Filter = "Adobe PDF (.pdf)|*.pdf";
                    if (dlg.ShowDialog() == true)
                    {
                        try
                        {
                            // set Label expressions (if any)
                            SetLabelExpressions(ref tLabel);

                            //is there any data source?
                            if (string.IsNullOrWhiteSpace(this.txtDataSourceFile.Text) == false)
                            {
                                var ds = new DataSet();
                                if (this.txtDataSourceFile.Text == "EmbeddedDataSourceSample")
                                    ds.ReadXml(new System.IO.StringReader(Global.DataSourceXmlSample));
                                else
                                    ds.ReadXml(new FileStream(this.txtDataSourceFile.Text, FileMode.Open, FileAccess.Read));

                                tLabel.DataSource = ds;
                            }


                            //export ThermalLabel to PDF
                            using (PrintJob pj = new PrintJob())
                            {
                                pj.ThermalLabel = tLabel;

                                //pj.PrintOrientation = PrintOrientation.Landscape90;

                                pj.ExportToPdf(dlg.FileName, dpi, new PdfMetadata() { Author = "Me", Title = "Label" /*, UseVectorDrawing=true*/ });
                            }
                        }
                        catch (Exception ex)
                        {
                            MessageBox.Show(ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                        }
                    }
                }
            }
        }

        private void ExportToImage(ImageFormat imageFormat)
        {
            //Create the ThermalLabel obj from the editor
            ThermalLabel tLabel = this.thermalLabelEditor1.ViewRotation == Rotate.None ? this.thermalLabelEditor1.CreateThermalLabel() : this.thermalLabelEditor1.RotateLabel(this.thermalLabelEditor1.CreateThermalLabel(), this.thermalLabelEditor1.ViewRotation, Rotate.None);

            if (tLabel != null)
            {

                double dpi = 96;

                var d = new DpiDialog();
                d.Dpi = dpi;

                if (d.ShowDialog() == true)
                {
                    dpi = d.Dpi;
                    
                    ImageSettings imgSettings = new ImageSettings();
                    imgSettings.AntiAlias = true;

                    //open save dialog...
                    SaveFileDialog dlg = new SaveFileDialog();
                    if (imageFormat == ImageFormat.Jpeg)
                    {
                        dlg.DefaultExt = ".jpg";
                        dlg.Filter = "JPEG Image (.jpg)|*.jpg";

                        imgSettings.ImageFormat = ImageFormat.Jpeg;
                        imgSettings.JpegQualityLevel = 100;
                    }
                    else if (imageFormat == ImageFormat.Png)
                    {
                        dlg.DefaultExt = ".png";
                        dlg.Filter = "PNG Image (.png)|*.png";

                        imgSettings.ImageFormat = ImageFormat.Png;
                    }
                    else if (imageFormat == ImageFormat.Svg)
                    {
                        dlg.DefaultExt = ".svg";
                        dlg.Filter = "SVG Image (.svg)|*.svg";

                        imgSettings.ImageFormat = ImageFormat.Svg;
                    }

                    if (dlg.ShowDialog() == true)
                    {
                        try
                        {
                            // set Label expressions (if any)
                            SetLabelExpressions(ref tLabel);

                            //is there any data source?
                            if (string.IsNullOrWhiteSpace(this.txtDataSourceFile.Text) == false)
                            {
                                var ds = new DataSet();
                                if (this.txtDataSourceFile.Text == "EmbeddedDataSourceSample")
                                    ds.ReadXml(new System.IO.StringReader(Global.DataSourceXmlSample));
                                else
                                    ds.ReadXml(new FileStream(this.txtDataSourceFile.Text, FileMode.Open, FileAccess.Read));

                                tLabel.DataSource = ds;
                            }


                            //export ThermalLabel to Image
                            using (PrintJob pj = new PrintJob())
                            {
                                pj.ThermalLabel = tLabel;

                                pj.ExportToImage(dlg.FileName, imgSettings, dpi);

                                //imgSettings.AntiAlias = false;

                                //pj.ExportToImage(dlg.FileName + "-NoAA", imgSettings, dpi);

                            }
                        }
                        catch (Exception ex)
                        {
                            MessageBox.Show(ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                        }
                    }
                }
            }
        }


        private void menuExportToJPG_Click(object sender, RoutedEventArgs e)
        {
            this.ExportToImage(ImageFormat.Jpeg);
        }

        private void menuExportToPNG_Click(object sender, RoutedEventArgs e)
        {
            this.ExportToImage(ImageFormat.Png);
        }

        private void menuExportToSVG_Click(object sender, RoutedEventArgs e)
        {
            MessageBox.Show("SVG output format is NOT available in TRIAL mode! Request a 30-days Product Key at https://neodynamic.com/support", "SVG INFO", MessageBoxButton.OK, MessageBoxImage.Exclamation);

            this.ExportToImage(ImageFormat.Svg);
        }

        private void menuExportToHTML_Click(object sender, RoutedEventArgs e)
        {
            //Create the ThermalLabel obj from the editor
            ThermalLabel tLabel = this.thermalLabelEditor1.ViewRotation == Rotate.None ? this.thermalLabelEditor1.CreateThermalLabel() : this.thermalLabelEditor1.RotateLabel(this.thermalLabelEditor1.CreateThermalLabel(), this.thermalLabelEditor1.ViewRotation, Rotate.None);

            if (tLabel != null)
            {

                double dpi = 96;

                var d = new DpiDialog();
                d.Dpi = dpi;

                if (d.ShowDialog() == true)
                {
                    dpi = d.Dpi;

                    //open save dialog...
                    SaveFileDialog dlg = new SaveFileDialog();
                    dlg.DefaultExt = ".html";
                    dlg.Filter = "HTML (.html)|*.html";

                    if (dlg.ShowDialog() == true)
                    {
                        try
                        {
                            // set Label expressions (if any)
                            SetLabelExpressions(ref tLabel);

                            //is there any data source?
                            if (string.IsNullOrWhiteSpace(this.txtDataSourceFile.Text) == false)
                            {
                                var ds = new DataSet();
                                if (this.txtDataSourceFile.Text == "EmbeddedDataSourceSample")
                                    ds.ReadXml(new System.IO.StringReader(Global.DataSourceXmlSample));
                                else
                                    ds.ReadXml(new FileStream(this.txtDataSourceFile.Text, FileMode.Open, FileAccess.Read));

                                tLabel.DataSource = ds;
                            }


                            //export ThermalLabel to HTML
                            using (PrintJob pj = new PrintJob())
                            {
                                pj.ThermalLabel = tLabel;

                                pj.ExportToHtml(dlg.FileName, dpi, "Labels");
                            }
                        }
                        catch (Exception ex)
                        {
                            MessageBox.Show(ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                        }
                    }
                }
            }
        }

        private void cmLock_Click(object sender, RoutedEventArgs e)
        {
            if (((MenuItem)sender).Header.ToString() == "Lock")
            {
                thermalLabelEditor1.LockSelectedItems();
            }
            else
            {
                thermalLabelEditor1.UnlockSelectedItems();
            }
        }

        private void menuExit_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }

        private void cmdOptions_Click(object sender, RoutedEventArgs e)
        {
            //is there any label on the editor's surface...
            if (thermalLabelEditor1.LabelDocument != null)
            {
                //Open dialog for View settings
                Dialogs.ViewOptionsDialog viewOpt = new Dialogs.ViewOptionsDialog();
                viewOpt.ShowGrid = thermalLabelEditor1.ShowGrid;
                viewOpt.GridSize = thermalLabelEditor1.GridSize;
                viewOpt.SnapToGrid = thermalLabelEditor1.SnapToGrid;
                viewOpt.AngleSnap = thermalLabelEditor1.AngleSnap;
                viewOpt.ArrowKeysShortStep = thermalLabelEditor1.ArrowKeysShortStep;
                viewOpt.ArrowKeysLargeStep = thermalLabelEditor1.ArrowKeysLargeStep;

                viewOpt.SetUnitLegends(thermalLabelEditor1.LabelDocument.UnitType);

                viewOpt.Owner = this;

                if (viewOpt.ShowDialog() == true)
                {
                    thermalLabelEditor1.ShowGrid = viewOpt.ShowGrid;
                    thermalLabelEditor1.GridSize = viewOpt.GridSize;
                    thermalLabelEditor1.SnapToGrid = viewOpt.SnapToGrid;
                    thermalLabelEditor1.AngleSnap = viewOpt.AngleSnap;
                    thermalLabelEditor1.ArrowKeysShortStep = viewOpt.ArrowKeysShortStep;
                    thermalLabelEditor1.ArrowKeysLargeStep = viewOpt.ArrowKeysLargeStep;
                }
            }
        }

        private void cmdUloadFont_Click(object sender, RoutedEventArgs e)
        {
            Dialogs.TTFtoPrinterStorageDialog ttfToPrinter = new Dialogs.TTFtoPrinterStorageDialog();
            ttfToPrinter.Owner = this;
            ttfToPrinter.ShowDialog();
        }

        private void cmdManageFont_Click(object sender, RoutedEventArgs e)
        {
            Dialogs.PrinterFontsDialog printerFonts = new Dialogs.PrinterFontsDialog();
            printerFonts.Owner = this;
            printerFonts.ShowDialog();
        }

        private void PreviewLabel()
        {
            //temp folder for holding thermal label images
            //this.labelPreview1.Clear();
            string myDir = Directory.GetCurrentDirectory() + @"\temp\";
            if (Directory.Exists(myDir) == false) Directory.CreateDirectory(myDir);
            DirectoryInfo di = new DirectoryInfo(myDir);
            foreach (FileInfo file in di.GetFiles()) file.Delete();


            if (thermalLabelEditor1.LabelDocument != null)
            {
                try
                {
                    //create label from editor
                    var tLabel = this.thermalLabelEditor1.ViewRotation == Rotate.None ? this.thermalLabelEditor1.CreateThermalLabel() : this.thermalLabelEditor1.RotateLabel(this.thermalLabelEditor1.CreateThermalLabel(), this.thermalLabelEditor1.ViewRotation, Rotate.None);

                    // set Label expressions (if any)
                    SetLabelExpressions(ref tLabel);

                    bool labelRequiresDataSource = false;
                    foreach (var itm in tLabel.Items)
                    {
                        if (string.IsNullOrWhiteSpace(itm.DataField) == false)
                        {
                            labelRequiresDataSource = true;
                            break;
                        }
                    }

                    //is there any data source?
                    if (string.IsNullOrWhiteSpace(this.txtDataSourceFile.Text) == false)
                    {
                        var ds = new DataSet();
                        if (this.txtDataSourceFile.Text == "EmbeddedDataSourceSample")
                            ds.ReadXml(new System.IO.StringReader(Global.DataSourceXmlSample));
                        else
                            ds.ReadXml(new FileStream(this.txtDataSourceFile.Text, FileMode.Open, FileAccess.Read));

                        tLabel.DataSource = ds;
                    }
                    else if (labelRequiresDataSource)
                    {
                        throw new Exception("The label requires a Data Source which is missimg. Could not preview the label.");
                    }


                    //Create ThermalLabel images
                    using (PrintJob pj = new PrintJob())
                    {
                        pj.ThermalLabel = tLabel;

                        pj.Copies = (int)this.nudPreviewCopies.Value;

                        //ImageSettings imgSett = new ImageSettings();
                        //imgSett.ImageFormat = ImageFormat.Png;
                        //imgSett.AntiAlias = true;

                        //pj.ExportToImage(myDir + "TL.png", imgSett, (cmdPreviewResolution.SelectedIndex <= 0 ? 96d : double.Parse(cmdPreviewResolution.SelectedItem.ToString())));

                        //this.labelPreview1.LoadImages(myDir);

                        string tmpFileName = "labels_preview_" + DateTime.Now.Ticks.ToString() + ".html";

                        pj.ExportToHtml(myDir + tmpFileName, 96d, "Labels Preview");

                        webBrowser1.Navigate(myDir + tmpFileName);
                        
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Exclamation);
                }
            }
        }

        private void tabMain_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (tabMain.SelectedIndex == 2) this.PreviewLabel();
        }

        private void cmdRotViewNone_Click(object sender, RoutedEventArgs e)
        {
            this.thermalLabelEditor1.RotateView(Rotate.None);
        }

        private void cmdRotView90_Click(object sender, RoutedEventArgs e)
        {
            this.thermalLabelEditor1.RotateView(Rotate.Degree90);
        }

        private void cmdRotView180_Click(object sender, RoutedEventArgs e)
        {
            this.thermalLabelEditor1.RotateView(Rotate.Degree180);
        }

        private void cmdRotView270_Click(object sender, RoutedEventArgs e)
        {
            this.thermalLabelEditor1.RotateView(Rotate.Degree270);
        }

        private void thermalLabelEditor1_ViewRotationChanged(object sender, EventArgs e)
        {
            this.cmdRotViewNone.IsChecked = this.thermalLabelEditor1.ViewRotation == Rotate.None;
            this.cmdRotView90.IsChecked = this.thermalLabelEditor1.ViewRotation == Rotate.Degree90;
            this.cmdRotView180.IsChecked = this.thermalLabelEditor1.ViewRotation == Rotate.Degree180;
            this.cmdRotView270.IsChecked = this.thermalLabelEditor1.ViewRotation == Rotate.Degree270;
        }

        
        private void menuSameWidth_Click(object sender, RoutedEventArgs e)
        {
            this.thermalLabelEditor1.SetSelectedItemsToSameSize(true, false);
        }

        private void menuSameHeight_Click(object sender, RoutedEventArgs e)
        {
            this.thermalLabelEditor1.SetSelectedItemsToSameSize(false, true);
        }

        private void cmdZoomToLabel_Click(object sender, RoutedEventArgs e)
        {
            this.thermalLabelEditor1.Zoom = 0;
        }

        private void myTableSelector_SelectionChanged(object sender, EventArgs e)
        {
            InsertTable.IsChecked = false;

            //is there any label on the editor's surface...
            if (thermalLabelEditor1.LabelDocument != null)
            {
                //Set the ActiveTool to Table
                thermalLabelEditor1.ActiveTool = EditorTool.Table;

                //Create and set the ActiveToolItem i.e. a TableShapeItem
                var tableItem = new TableShapeItem();
                for (int i = 0; i < myTableSelector.SelectedColumns; i++)
                    tableItem.Columns.Add(new Neodynamic.SDK.Printing.TableColumn());
                for (int i = 0; i < myTableSelector.SelectedRows; i++)
                    tableItem.Rows.Add(new Neodynamic.SDK.Printing.TableRow());

                tableItem.ConvertToUnit(thermalLabelEditor1.LabelDocument.UnitType);

                thermalLabelEditor1.ActiveToolItem = tableItem;
            }
        }

        private void menuRepeater_Click(object sender, RoutedEventArgs e)
        {
            //is there any label on the editor's surface...
            if (thermalLabelEditor1.LabelDocument != null)
            {
                //Set the ActiveTool to Repeater
                thermalLabelEditor1.ActiveTool = EditorTool.Repeater;

                //Create and set the ActiveToolItem i.e. a RepeaterItem
                RepeaterItem repItem = new RepeaterItem();
                repItem.ConvertToUnit(thermalLabelEditor1.LabelDocument.UnitType);

                thermalLabelEditor1.ActiveToolItem = repItem;
            }
        }
    }
}
