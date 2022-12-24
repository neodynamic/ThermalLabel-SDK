using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.Drawing.Design;

using Neodynamic.Windows.ThermalLabelEditor;
using Neodynamic.SDK.Printing;
using System.ComponentModel.DataAnnotations;
using System.IO;

using Neodynamic.Windows.Forms.ThermalLabelEditor;
using System.Threading.Tasks;
using System.Threading;
using System.Windows.Forms.VisualStyles;
using System.Windows.Media;

namespace TLWindowsEditorWinFormsDemo
{
    public partial class MainForm : Form
    {
        



        private ThermalLabelEditor thermalLabelEditor1 = new ThermalLabelEditor();
        private Gallery gallery1 = new Gallery();
        //private LabelPreview labelPreview1 = new LabelPreview();

        private ToolStripSymbols tsSymbols = new ToolStripSymbols();
        private ToolStripTableSizeSelector tsTableSizer = new ToolStripTableSizeSelector();

        public MainForm()
        {
            // Windows Label Editor LICENSE
            ThermalLabelEditor.LicenseOwner = "LICENSE OWNER FOR WINDOWS EDITOR HERE";
            ThermalLabelEditor.LicenseKey = "LICENSE KEY FOR WINDOWS EDITOR HERE";
            // SDK LICENSE
            ThermalLabel.LicenseOwner = "LICENSE OWNER FOR SDK HERE";
            ThermalLabel.LicenseKey = "LICENSE KEY FOR SDK HERE";
            
            InitializeComponent();

            WebBrowserHelper.SetWebBrowserFeatures(ref this.webBrowser1);

            // setting label editor
            thermalLabelEditor1.Dock = DockStyle.Fill;
            thermalLabelEditor1.ContextMenuStrip = contextMenuStrip1;
            this.tabDesign.Controls.Add(thermalLabelEditor1);

            gallery1.Dock = DockStyle.Fill;
            this.tabGallery.Controls.Add(gallery1);

            //labelPreview1.Dock = DockStyle.Fill;
            //this.tabPreview.Controls.Add(labelPreview1);

            this.tsSymbols.SymbolChanged += TsSymbols_SymbolChanged;
            this.tsddbSymbols.DropDownItems.Add(tsSymbols);


            tsTableSizer.Opening += new CancelEventHandler(tsTableSizer_Opening);
            tsTableSizer.Selector.TableSizeSelected += new TableSizeSelectedEventHandler(tsTableSizer_TableSizeSelected);

            this.tsbInsertTable.DropDown = tsTableSizer;

        }


        void tsTableSizer_Opening(object sender, CancelEventArgs e)
        {
            ToolStripTableSizeSelector c = (ToolStripTableSizeSelector)this.tsbInsertTable.DropDown;
            c.Selector.SelectedSize = new Size(0, 0);
            c.Selector.VisibleRange = new Size(10, 8);
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            //PropertyGrid custom UI Editors
            var itemProvider = new AssociatedMetadataTypeTypeDescriptionProvider(typeof(Item), typeof(ItemMetadata));
            TypeDescriptor.AddProvider(itemProvider, typeof(Item));
            var textItemProvider = new AssociatedMetadataTypeTypeDescriptionProvider(typeof(TextItem),typeof(TextItemMetadata));
            TypeDescriptor.AddProvider(textItemProvider, typeof(TextItem));
            var barcodeItemProvider = new AssociatedMetadataTypeTypeDescriptionProvider(typeof(BarcodeItem), typeof(BarcodeItemMetadata));
            TypeDescriptor.AddProvider(barcodeItemProvider, typeof(BarcodeItem));
            var shapeItemProvider = new AssociatedMetadataTypeTypeDescriptionProvider(typeof(ShapeItem), typeof(ShapeItemMetadata));
            TypeDescriptor.AddProvider(shapeItemProvider, typeof(ShapeItem));
            var closedShapeItemProvider = new AssociatedMetadataTypeTypeDescriptionProvider(typeof(ClosedShapeItem), typeof(ClosedShapeItemMetadata));
            TypeDescriptor.AddProvider(closedShapeItemProvider, typeof(ClosedShapeItem));
            var imageItemProvider = new AssociatedMetadataTypeTypeDescriptionProvider(typeof(ImageItem), typeof(ImageItemMetadata));
            TypeDescriptor.AddProvider(imageItemProvider, typeof(ImageItem));
            var tableColShapeItemProvider = new AssociatedMetadataTypeTypeDescriptionProvider(typeof(TableColumn), typeof(ClosedShapeItemMetadata));
            TypeDescriptor.AddProvider(tableColShapeItemProvider, typeof(TableColumn));
            var tableRowShapeItemProvider = new AssociatedMetadataTypeTypeDescriptionProvider(typeof(TableRow), typeof(ClosedShapeItemMetadata));
            TypeDescriptor.AddProvider(tableRowShapeItemProvider, typeof(TableRow));

            //var fontProvider = new AssociatedMetadataTypeTypeDescriptionProvider(typeof(Neodynamic.SDK.Printing.Font), typeof(FontMetadata));
            //TypeDescriptor.AddProvider(fontProvider, typeof(Neodynamic.SDK.Printing.Font));


            //Enable the editor!!!
            thermalLabelEditor1.EnableEditor();

            // editor main events
            thermalLabelEditor1.MouseDoubleClick += thermalLabelEditor1_MouseDoubleClick;
            thermalLabelEditor1.CurrentSelectionBeforeDelete += thermalLabelEditor1_CurrentSelectionBeforeDelete;
            thermalLabelEditor1.CurrentSelectionTextChanged += thermalLabelEditor1_CurrentSelectionTextChanged;
            thermalLabelEditor1.NewItemCreated += thermalLabelEditor1_NewItemCreated;
            thermalLabelEditor1.SelectionAreaChanged += thermalLabelEditor1_SelectionAreaChanged;
            thermalLabelEditor1.ClipboardStateChanged += thermalLabelEditor1_ClipboardStateChanged;
            thermalLabelEditor1.UndoStateChanged += thermalLabelEditor1_UndoStateChanged;
            thermalLabelEditor1.SelectionChanged += thermalLabelEditor1_SelectionChanged;
            thermalLabelEditor1.SelectionItemPropertyChanged += thermalLabelEditor1_SelectionItemPropertyChanged;
            thermalLabelEditor1.Leave += thermalLabelEditor1_Leave;
            thermalLabelEditor1.ViewRotationChanged += ThermalLabelEditor1_ViewRotationChanged;

            //THIS IS A LIST OF PROPERTIES FOR CUSTOMIZING THE EDITOR UI
            //==========================================================

            //thermalLabelEditor1.RulerBackColor = System.Drawing.Color.Tomato;
            //thermalLabelEditor1.RulerLinesColor = System.Drawing.Color.Gold;
            //thermalLabelEditor1.RulerForeColor = System.Drawing.Color.White;
            //thermalLabelEditor1.RulerSelectionColor = System.Drawing.Color.Purple;

            //thermalLabelEditor1.LabelDocumentFrameBackColor = System.Drawing.Color.WhiteSmoke;
            //thermalLabelEditor1.LabelDocumentFrameBorderColor = System.Drawing.Color.Black;
            //thermalLabelEditor1.LabelDocumentFrameBorderThickness = 3;
            //thermalLabelEditor1.LabelDocumentFrameCornerRadius = 0;
            //thermalLabelEditor1.NoImageFileName = @"c:\noimage.jpg";


            //thermalLabelEditor1.AdornerHandlerBackColor = System.Drawing.Color.Yellow;
            //thermalLabelEditor1.AdornerHandlerHoverBackColor = System.Drawing.Color.DarkCyan;
            //thermalLabelEditor1.AdornerHandlerBorderColor = System.Drawing.Color.Gray;
            //thermalLabelEditor1.AdornerFrameBorderColor = System.Drawing.Color.Gray;

            //thermalLabelEditor1.AdornerSelectionBackColor = System.Drawing.Color.FromArgb(128, 255, 0, 128);
            //thermalLabelEditor1.AdornerSelectionBorderColor = System.Drawing.Color.FromArgb(128, 255, 0, 255);

            //thermalLabelEditor1.AngleSnap = 45;

            //thermalLabelEditor1.ImageProcessingDpi = 300;

            //thermalLabelEditor1.TextItemEditModeEnabled = false;


            //thermalLabelEditor1.SnapToGrid = true;
            //thermalLabelEditor1.GridSize = 0.1;
            //thermalLabelEditor1.ShowGrid = true;
            //thermalLabelEditor1.GridColor = System.Drawing.Color.FromArgb(128, 255, 0, 255);

            //thermalLabelEditor1.AdornerLegendsVisible = false;

            //thermalLabelEditor1.AdornerOutOfLabelVisible = false;
            //thermalLabelEditor1.AdornerOutOfLabelColor = System.Drawing.Color.FromArgb(255, 0, 0, 255);

            //thermalLabelEditor1.ItemToolTipBackColor = System.Drawing.Color.SteelBlue;
            //thermalLabelEditor1.ItemToolTipBorderColor = System.Drawing.Color.SteelBlue;
            //thermalLabelEditor1.ItemToolTipForeColor = System.Drawing.Color.White;

            this.gallery1.EditLabel += Gallery1_EditLabel;
            this.gallery1.DoRefresh();

            //load barcode symbologies
            this.cboBarcodeSymbologies.DataSource = Enum.GetNames(typeof(BarcodeSymbology)).OrderBy(x => x).ToArray();

            //load linear/1D and 2D barcodes separately
            foreach (var barcodeSymbName in Enum.GetNames(typeof(BarcodeSymbology)).OrderBy(x => x))
            {
                if (BarcodeItemUtils.IsLinearBarcode((BarcodeSymbology)Enum.Parse(typeof(BarcodeSymbology), barcodeSymbName)))
                {
                    this.tssbLinearBarcodes.DropDownItems.Add(barcodeSymbName).Click += tsbBarcode_Click;
                }
                else
                {
                    this.tssb2DBarcodes.DropDownItems.Add(barcodeSymbName).Click += tsbBarcode_Click;
                }
            }

            // load sample symbols
            //this.tsddbSymbols.DropDownItems.Add();

        }

        private void ThermalLabelEditor1_ViewRotationChanged(object sender, EventArgs e)
        {
            this.menuViewRotateNone.Checked = thermalLabelEditor1.ViewRotation == Rotate.None;
            this.menuViewRotate90.Checked = thermalLabelEditor1.ViewRotation == Rotate.Degree90;
            this.menuViewRotate180.Checked = thermalLabelEditor1.ViewRotation == Rotate.Degree180;
            this.menuViewRotate270.Checked = thermalLabelEditor1.ViewRotation == Rotate.Degree270;
        }

        private void thermalLabelEditor1_NewItemCreated(object sender, EventArgs e)
        {
            Console.WriteLine(DateTime.Now.Ticks);

        }

        private void thermalLabelEditor1_CurrentSelectionTextChanged(object sender, TextChangedEventArgs e)
        {
            //this.Text = e.Text;
        }

        private void thermalLabelEditor1_CurrentSelectionBeforeDelete(object sender, CancelEventArgs e)
        {
            e.Cancel = (MessageBox.Show("Do you really want to delete the selected items?", "Delete Current Selection", MessageBoxButtons.YesNo, MessageBoxIcon.Question) == DialogResult.No);
        }

        void thermalLabelEditor1_MouseDoubleClick(object sender, MouseEventArgs e)
        {
            //Sample of double click on an item
            Item curItem = thermalLabelEditor1.CurrentSelection;
            if (curItem != null && curItem is RectangleShapeItem)
            {
                //MessageBox.Show("Double Click on a Rect!");
            }

            
        }

        

        

        private void tsbPointer_Click(object sender, EventArgs e)
        {
            //Set the ActiveTool to Pointer
            thermalLabelEditor1.ActiveTool = EditorTool.Pointer;
            
        }

        void tsTableSizer_TableSizeSelected(object sender, TableSizeEventArgs e)
        {
            //MessageBox.Show(String.Format("Selected: {0}x{1}", e.SelectedSize.Width, e.SelectedSize.Height), Application.ProductName);
            //is there any label on the editor's surface...
            if (thermalLabelEditor1.LabelDocument != null)
            {
                //Set the ActiveTool to Table
                thermalLabelEditor1.ActiveTool = EditorTool.Table;

                //Create and set the ActiveToolItem i.e. a TableShapeItem
                TableShapeItem tableItem = new TableShapeItem();
                tableItem.ConvertToUnit(thermalLabelEditor1.LabelDocument.UnitType);
                for (int i = 0; i < e.SelectedSize.Width; i++)
                    tableItem.Columns.Add(new TableColumn());
                for (int i = 0; i < e.SelectedSize.Height; i++)
                    tableItem.Rows.Add(new TableRow());

                thermalLabelEditor1.ActiveToolItem = tableItem;
            }

        }

        private void txbRect_Click(object sender, EventArgs e)
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

        private void tsbEllipse_Click(object sender, EventArgs e)
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

        private void tsbLine_Click(object sender, EventArgs e)
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

        

        private void tsbPicture_Click(object sender, EventArgs e)
        {
            //is there any label on the editor's surface...
            if (thermalLabelEditor1.LabelDocument != null)
            {


                //HERE YOU COULD OPEN A FILE DIALOG TO THE USE FOR SELECTING SOME IMAGE FILE                
                //OR PICK ONE FROM A 'GALLERY', ETC.
                //imgItem.SourceFile = @"C:\Pictures\glass.gif";
                OpenFileDialog dlg = new OpenFileDialog();
                dlg.Filter = "Image File (*.bmp, *.gif, *.jpg, *.png)|*.bmp; *.gif; *.jpg; *.png";
                if (dlg.ShowDialog() == DialogResult.OK)
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

        private void tsbBarcode_Click(object sender, EventArgs e)
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
                if (sender is ToolStripSplitButton)
                {
                    bcItem.Symbology = ((ToolStripSplitButton)sender).Name == "tssbLinearBarcodes" ? BarcodeSymbology.Code128 : BarcodeSymbology.QRCode;
                }
                else
                {
                    bcItem.Symbology = (BarcodeSymbology)Enum.Parse(typeof(BarcodeSymbology), ((ToolStripMenuItem)sender).Text);
                }
                bcItem.Code = BarcodeItemUtils.GenerateSampleCode(bcItem.Symbology);
                bcItem.Font.Name = Neodynamic.SDK.Printing.Font.NativePrinterFontA;
                bcItem.Font.Size = 5;
                bcItem.BarcodeAlignment = BarcodeAlignment.MiddleCenter;

                bcItem.Sizing = BarcodeSizing.FitProportional; //New feature since v7.0

                bcItem.ConvertToUnit(thermalLabelEditor1.LabelDocument.UnitType);

                thermalLabelEditor1.ActiveToolItem = bcItem;
            }
        }

        private void tsbZoom100_Click(object sender, EventArgs e)
        {
            //Set up zoom to 100%
            thermalLabelEditor1.Zoom = 100;
        }

        private void tsbZoomIn_Click(object sender, EventArgs e)
        {
            //Zoom in...
            thermalLabelEditor1.Zoom += 10;
        }

        private void tsbZoomOut_Click(object sender, EventArgs e)
        {
            //Zoom out...
            thermalLabelEditor1.Zoom -= 10;
        }

        private void menuNew_Click(object sender, EventArgs e)
        {
            //Create a new 'document'
            LabelDoc labelSetup = new LabelDoc();
            labelSetup.LabelDocument = new LabelDocument() { UnitType = UnitType.Inch, Width = 4, Height = 3 };

            if (labelSetup.ShowDialog() == DialogResult.OK)
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
                tLabel.DesignBackgroundImage = doc.DesignBackgroundImage;
                foreach(var p in doc.Pages)
                {
                    tLabel.Pages.Add(p);
                }

                //load it on the editor surface
                thermalLabelEditor1.LoadThermalLabel(tLabel);

                this.tabMain.SelectedIndex = 1;

            }
        }

        private void menuOpen_Click(object sender, EventArgs e)
        {



            //open a thermal label template
            //NOTE: *.tl extension is just that! The content of such files should be a ThermalLabel XML Template
            //      *.tlj extension is just that! The content of such files should be a ThermalLabel JSON Template    
            OpenFileDialog dlg = new OpenFileDialog();
            dlg.Filter = "ThermalLabel Template (*.xml, *.tl, *.tlj)|*.xml;*.tl;*.tlj";
            if (dlg.ShowDialog() == DialogResult.OK)
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
                    MessageBox.Show(ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }

        private void menuSave_Click(object sender, EventArgs e)
        {
            //is there any label on the editor's surface...
            if (thermalLabelEditor1.LabelDocument != null)
            {
                //open save dialog...
                //NOTE: we have used *.tl file extension for ThermalLabel XML templates
                //and *.tlj file extension for ThermalLabel JSON templates
                //BUT you can change it to whatever you want
                SaveFileDialog dlg = new SaveFileDialog();
                dlg.DefaultExt = ".tl";
                dlg.Filter = "ThermalLabel XML Template (.tl)|*.tl|ThermalLabel XML Template with Embedded Fonts (.tl)|*.tl|ThermalLabel JSON Template (.tlj)|*.tlj|ThermalLabel JSON Template with Embedded Fonts (.tlj)|*.tlj";
                if (dlg.ShowDialog() == DialogResult.OK)
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
                        MessageBox.Show(ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    }
                }
            }
        }

        private void menuLabelSetup_Click(object sender, EventArgs e)
        {
            //is there any label on the editor's surface...
            if (thermalLabelEditor1.LabelDocument != null)
            {
                //Open dialog for label document setup
                LabelDoc labelSetup = new LabelDoc();
                labelSetup.LabelDocument = thermalLabelEditor1.LabelDocument;
                labelSetup.Owner = this;

                if (labelSetup.ShowDialog() == DialogResult.OK)
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

        private void menuPrint_Click(object sender, EventArgs e)
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
                    if (frmPrintJob.ShowDialog() == DialogResult.OK)
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
                    MessageBox.Show(ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
           
        }

        private void menuExportToPdf_Click(object sender, EventArgs e)
        {
            
             //Create the ThermalLabel obj from the editor
            ThermalLabel tLabel = this.thermalLabelEditor1.ViewRotation == Rotate.None ? this.thermalLabelEditor1.CreateThermalLabel() : this.thermalLabelEditor1.RotateLabel(this.thermalLabelEditor1.CreateThermalLabel(), this.thermalLabelEditor1.ViewRotation, Rotate.None);


            if (tLabel != null)
            {
                double dpi = 96;
                if (DpiInputBox(ref dpi) == DialogResult.OK)
                {
                    //open save dialog...
                    SaveFileDialog dlg = new SaveFileDialog();
                    dlg.DefaultExt = ".pdf";
                    dlg.Filter = "Adobe PDF (.pdf)|*.pdf";
                    if (dlg.ShowDialog() == DialogResult.OK)
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

                                pj.ExportToPdf(dlg.FileName, dpi, new PdfMetadata() { Author="Me", Title="Label" /*, UseVectorDrawing=true*/ });
                            }
                        }
                        catch (Exception ex)
                        {
                            MessageBox.Show(ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        }
                    }
                }
            }
        }

        
        private void menuUndo_Click(object sender, EventArgs e)
        {
            //Perform Undo
            thermalLabelEditor1.Undo();
        }

        private void menuRedo_Click(object sender, EventArgs e)
        {
            //Perform Redo
            thermalLabelEditor1.Redo();
        }

        private void menuCut_Click(object sender, EventArgs e)
        {
            //Perform Cut
            thermalLabelEditor1.Cut();
        }

        private void menuCopy_Click(object sender, EventArgs e)
        {
            //Perform Copy
            thermalLabelEditor1.Copy();
        }

        private void menuPaste_Click(object sender, EventArgs e)
        {
            //Perform Paste
            thermalLabelEditor1.Paste();
        }

        private void menuSelectAll_Click(object sender, EventArgs e)
        {
            //Perform Select All
            thermalLabelEditor1.SelectAll();
        }

        private void menuDeleteAll_Click(object sender, EventArgs e)
        {
            //Perform Delete All
            thermalLabelEditor1.DeleteAll(); 
        }

        private void menuBringForward_Click(object sender, EventArgs e)
        {
            //Perform BringForward
            thermalLabelEditor1.BringForward();
        }

        private void menuSendBackward_Click(object sender, EventArgs e)
        {
            //Perform Send Backward
            thermalLabelEditor1.SendBackward();
        }

        private void menuBringToFront_Click(object sender, EventArgs e)
        {
            //Perform BringToFront
            thermalLabelEditor1.BringToFront();
        }

        private void menuSendToBack_Click(object sender, EventArgs e)
        {
            //Perform SentToBack
            thermalLabelEditor1.SendToBack();
        }

        private void thermalLabelEditor1_SelectionAreaChanged(object sender, EventArgs e)
        {

            //Show in the 'status bar' the dimensions of the selected area
            //we're going to format it including the unit

            RectangleF selArea = thermalLabelEditor1.CurrentSelectionArea;

            if (selArea.Width > 0 && selArea.Height > 0)
            {
                string unitDescription;
                if (thermalLabelEditor1.LabelDocument.UnitType == UnitType.Inch)
                    unitDescription = "in";
                else if (thermalLabelEditor1.LabelDocument.UnitType == UnitType.DotsPerInch)
                    unitDescription = "dpi";
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

                lblSelectionInfo.Text = string.Format("X: {1:0." + decimals + "}{0}   Y: {2:0." + decimals + "}{0}   Width: {3:0." + decimals + "}{0}   Height: {4:0." + decimals + "}{0}", data);
            }
            else
            {
                lblSelectionInfo.Text = "";
            }


            
        }

        private void thermalLabelEditor1_ClipboardStateChanged(object sender, EventArgs e)
        {
            //Enable/disable options depending on the state of the internal Clipboard object
            menuCopy.Enabled = thermalLabelEditor1.CanCopy;
            menuCut.Enabled = thermalLabelEditor1.CanCut;
            menuPaste.Enabled = thermalLabelEditor1.CanPaste;

            tsbCopy.Enabled = menuCopy.Enabled;
            tsbCut.Enabled = menuCut.Enabled;
            tsbPaste.Enabled = menuPaste.Enabled;

            cmCopy.Enabled = menuCopy.Enabled;
            cmCut.Enabled = menuCut.Enabled;
            cmPaste.Enabled = menuPaste.Enabled;
        }

        private void thermalLabelEditor1_UndoStateChanged(object sender, EventArgs e)
        {
            
            //Enable/disable undo/redo options depending on the state of the editor
            menuUndo.Enabled = thermalLabelEditor1.CanUndo;
            menuRedo.Enabled = thermalLabelEditor1.CanRedo;

            tsbUndo.Enabled = menuUndo.Enabled;
            tsbRedo.Enabled = menuRedo.Enabled;
        }

        private void menuAbout_Click(object sender, EventArgs e)
        {
            try
            {
                System.Diagnostics.Process.Start("https://www.neodynamic.com/products/printing/thermal-label/editor");
            }
            catch
            {
                MessageBox.Show("Please visit https://www.neodynamic.com/products/printing/thermal-label/editor", "About", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
        }

        private void thermalLabelEditor1_SelectionChanged(object sender, EventArgs e)
        {
            SetCurrentSelectedItem();
        }

        private void thermalLabelEditor1_SelectionItemPropertyChanged(object sender, EventArgs e)
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

                    if(_currentSelectedItem is BarcodeItem)
                    {
                        this.cboBarcodeSymbologies.SelectedItem = ((BarcodeItem)_currentSelectedItem).Symbology.ToString();
                    }
                }

                propertyGrid1.SelectedObject = selItem;
            }

            
            //enable-disable context menu items based on the selected item
            cmSep1.Visible = cmExpressionSeparator.Visible = cmExpression.Visible = _currentSelectedItem is ImageItem ||
                             _currentSelectedItem is TextItem ||
                             _currentSelectedItem is BarcodeItem;

            cmFont.Visible = _currentSelectedItem is TextItem ||
                             _currentSelectedItem is BarcodeItem;

            cmSetPicture.Visible = _currentSelectedItem is ImageItem;

            cmLayoutAlign.Visible = (thermalLabelEditor1.CurrentSelection is MultipleSelectionItem && ((MultipleSelectionItem)thermalLabelEditor1.CurrentSelection).Items.Count > 1);


            //display barcode symbology selection?
            this.pnlBarcodeSymbology.Visible = _currentSelectedItem is BarcodeItem;
            var topPadding = 5;
            this.propertyGrid1.Location = new Point(this.propertyGrid1.Location.X, this.pnlBarcodeSymbology.Visible ? this.pnlBarcodeSymbology.Height + topPadding * 2 : topPadding);
            this.propertyGrid1.Size = new Size(this.propertyGrid1.Size.Width, this.pnlBarcodeSymbology.Visible ? this.tabProperties.Size.Height - (this.pnlBarcodeSymbology.Height + topPadding * 3) : this.tabProperties.Size.Height - topPadding * 2);
        }

       
        void _currentSelection_PropertyChanged(object sender, PropertyChangedEventArgs e)
        {
            //update-refresh the selected item on the editor
            thermalLabelEditor1.CurrentSelection.UpdateFrom(_currentSelectedItem);
            thermalLabelEditor1.UpdateSelectionItemsProperties();

            //update thermal label obj for Expression dialog
            if(e.PropertyName == "Name") Global.CurrentThermalLabel = thermalLabelEditor1.CreateThermalLabel();

        }

        private void cmSetPicture_Click(object sender, EventArgs e)
        {
            //show open file dialog
            OpenFileDialog dlg = new OpenFileDialog();
            dlg.Filter = "Image File (*.bmp, *.gif, *.jpg, *.png)|*.bmp; *.gif; *.jpg; *.png";
            if (dlg.ShowDialog() == DialogResult.OK)
            {
                //set image file to the selected ImageItem
                if (_currentSelectedItem is ImageItem)
                {
                    ((ImageItem)_currentSelectedItem).SourceFile = dlg.FileName;
                    propertyGrid1.Refresh();
                }
            }
            
        }

        private void cmFont_Click(object sender, EventArgs e)
        {
            //get current selected item's font
            Neodynamic.SDK.Printing.Font tlFont = null;
            if (_currentSelectedItem is TextItem)
            {
                tlFont = ((TextItem)_currentSelectedItem).Font;
            }
            else if (_currentSelectedItem is BarcodeItem)
            {
                tlFont =((BarcodeItem)_currentSelectedItem).Font;
            }

            if(tlFont != null)
            {
                if (tlFont.Name == "ZPL Font 0") {
                    tlFont.Bold = true;
                }

                //show font dialog
                FontDialog dlg = new FontDialog();
                //create a System.Drawing.Font obj based on the selected item's font
                dlg.Font = FontUtils.ConvertToGdiFont(tlFont);

                if (dlg.ShowDialog() == DialogResult.OK)
                {
                    //update font into to the selected item
                    if (_currentSelectedItem is TextItem)
                    {
                        ((TextItem)_currentSelectedItem).Font.UpdateFrom(FontUtils.ConvertToFont(dlg.Font));
                        propertyGrid1.Refresh();
                    }
                    else if (_currentSelectedItem is BarcodeItem)
                    {
                        ((BarcodeItem)_currentSelectedItem).Font.UpdateFrom(FontUtils.ConvertToFont(dlg.Font));
                        propertyGrid1.Refresh();
                    }
                }
            
            }
        }

        

        private void menuClose_Click(object sender, EventArgs e)
        {
            //Save label before closing?
            if (thermalLabelEditor1.CanUndo)
            {
                DialogResult dr = MessageBox.Show("Do you want to save the current label?", "ThermalLabel Editor", MessageBoxButtons.YesNoCancel, MessageBoxIcon.Exclamation);
                if (dr == DialogResult.Yes)
                {
                    //allow saving current label
                    menuSave_Click(sender, e);
                    //close label
                    thermalLabelEditor1.Close();
                }
                else if (dr == DialogResult.No)
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

        private void tsbRFID_Click(object sender, EventArgs e)
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

        private void cmLockUnlock_Click(object sender, EventArgs e)
        {
                thermalLabelEditor1.LockSelectedItems();
            
        }

        private void menuLockUnlock_Click(object sender, EventArgs e)
        {
            thermalLabelEditor1.LockSelectedItems();
                
        }

        //private void LockUnlockSelectedItems()
        //{
        //    if (thermalLabelEditor1.CurrentSelection != null)
        //    {
        //        if (thermalLabelEditor1.CurrentSelection is MultipleSelectionItem)
        //        {
        //            int l = ((MultipleSelectionItem)thermalLabelEditor1.CurrentSelection).Items.Count;

        //            for (int i = 0; i < l; i++)
        //            {
        //                ((MultipleSelectionItem)thermalLabelEditor1.CurrentSelection).Items[i].Locked = !((MultipleSelectionItem)thermalLabelEditor1.CurrentSelection).Items[i].Locked;

        //            }

        //            //update-refresh the selected item on the editor
        //            thermalLabelEditor1.UpdateSelectionItemsProperties();
        //        }
        //        else
        //        {
        //            _currentSelectedItem.Locked = !_currentSelectedItem.Locked;
        //            propertyGrid1.Refresh();
        //        }
        //    }
        //}

        private void menuViewOptions_Click(object sender, EventArgs e)
        {
            //is there any label on the editor's surface...
            if (thermalLabelEditor1.LabelDocument != null)
            {
                //Open dialog for View settings
                ViewOptions viewOpt = new ViewOptions();
                viewOpt.ShowGrid = thermalLabelEditor1.ShowGrid;
                viewOpt.GridSize = thermalLabelEditor1.GridSize;
                viewOpt.SnapToGrid = thermalLabelEditor1.SnapToGrid;
                viewOpt.AngleSnap = thermalLabelEditor1.AngleSnap;
                viewOpt.ArrowKeysShortStep = thermalLabelEditor1.ArrowKeysShortStep;
                viewOpt.ArrowKeysLargeStep = thermalLabelEditor1.ArrowKeysLargeStep;

                viewOpt.SetUnitLegends(thermalLabelEditor1.LabelDocument.UnitType);

                viewOpt.Owner = this;

                if (viewOpt.ShowDialog() == DialogResult.OK)
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

        
        private void menuUploadTTFToPrinterStorageToolStripMenuItem_Click(object sender, EventArgs e)
        {
            TTFtoPrinterStorage ttfToPrinter = new TTFtoPrinterStorage();
            ttfToPrinter.Owner = this;
            ttfToPrinter.ShowDialog();
        }

        private void menuManageFontsInPrinterStorageToolStripMenuItem_Click(object sender, EventArgs e)
        {
            PrinterFonts printerFonts = new PrinterFonts();
            printerFonts.Owner = this;
            printerFonts.ShowDialog();
        }


        private void menuUnlockSelectedItems_Click(object sender, EventArgs e)
        {
            thermalLabelEditor1.UnlockSelectedItems();
        }

        private void cmUnlock_Click(object sender, EventArgs e)
        {
            thermalLabelEditor1.UnlockSelectedItems();
        }

        private DialogResult DpiInputBox(ref double dpiValue)
        {
            Form form = new Form();
            Label label = new Label();
            NumericUpDown textBox = new NumericUpDown();
            Button buttonOk = new Button();
            Button buttonCancel = new Button();

            form.Text = "Output DPI Setting";
            label.Text = "Please specify a DPI output value:";
            textBox.Minimum = 96;
            textBox.Maximum = 1200;
            textBox.Increment = 10;
            textBox.Value = (decimal)dpiValue;

            buttonOk.Text = "OK";
            buttonCancel.Text = "Cancel";
            buttonOk.DialogResult = DialogResult.OK;
            buttonCancel.DialogResult = DialogResult.Cancel;

            label.SetBounds(9, 20, 372, 13);
            textBox.SetBounds(12, 36, 372, 20);
            buttonOk.SetBounds(228, 72, 75, 23);
            buttonCancel.SetBounds(309, 72, 75, 23);

            label.AutoSize = true;
            textBox.Anchor = textBox.Anchor | AnchorStyles.Right;
            buttonOk.Anchor = AnchorStyles.Bottom | AnchorStyles.Right;
            buttonCancel.Anchor = AnchorStyles.Bottom | AnchorStyles.Right;

            form.ClientSize = new Size(396, 107);
            form.Controls.AddRange(new Control[] { label, textBox, buttonOk, buttonCancel });
            form.ClientSize = new Size(Math.Max(300, label.Right + 10), form.ClientSize.Height);
            form.FormBorderStyle = FormBorderStyle.FixedDialog;
            form.StartPosition = FormStartPosition.CenterScreen;
            form.MinimizeBox = false;
            form.MaximizeBox = false;
            form.AcceptButton = buttonOk;
            form.CancelButton = buttonCancel;

            DialogResult dialogResult = form.ShowDialog();
            dpiValue = (double)textBox.Value;
            return dialogResult;
        }

        private void menuExportToJPG_Click(object sender, EventArgs e)
        {
            this.ExportToImage(ImageFormat.Jpeg);
        }

        private void menuExportToPNG_Click(object sender, EventArgs e)
        {
            this.ExportToImage(ImageFormat.Png);
        }

        private void menuExportToSVG_Click(object sender, EventArgs e)
        {
            MessageBox.Show("SVG output format is NOT available in TRIAL mode! Request a 30-days Product Key at https://neodynamic.com/support", "SVG INFO", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);

            this.ExportToImage(ImageFormat.Svg);
        }

        private void ExportToImage(ImageFormat imageFormat)
        {
            //Create the ThermalLabel obj from the editor
            ThermalLabel tLabel = this.thermalLabelEditor1.ViewRotation == Rotate.None ? this.thermalLabelEditor1.CreateThermalLabel() : this.thermalLabelEditor1.RotateLabel(this.thermalLabelEditor1.CreateThermalLabel(), this.thermalLabelEditor1.ViewRotation, Rotate.None);


            if (tLabel != null)
            {
                
                double dpi = 96;
                if (DpiInputBox(ref dpi) == DialogResult.OK)
                {
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

                    if (dlg.ShowDialog() == DialogResult.OK)
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
                            MessageBox.Show(ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        }
                    }
                }
            }
        }

        private void cmExpression_Click(object sender, EventArgs e)
        {
            //show Expression dialog
            Global.ExprEditor.Expression = _currentSelectedItem.Expression;
            if (thermalLabelEditor1.LabelDocument != null)
                Global.CurrentThermalLabel = thermalLabelEditor1.CreateThermalLabel();
            else
                Global.CurrentThermalLabel = null;

            if (Global.ExprEditor.ShowDialog() == DialogResult.OK)
            {
                _currentSelectedItem.Expression = Global.ExprEditor.Expression;

                propertyGrid1.Refresh();
            }
        }

        private void thermalLabelEditor1_Leave(object sender, EventArgs e)
        {
            if (thermalLabelEditor1.LabelDocument != null)
                Global.CurrentThermalLabel = thermalLabelEditor1.CreateThermalLabel();
            else
                Global.CurrentThermalLabel = null;
        }


        
        private void cmdDataSourceFile_Click(object sender, EventArgs e)
        {
            OpenFileDialog dlg = new OpenFileDialog();
            dlg.Filter = "XML Data Source (*.xml)|*.xml";
            if (dlg.ShowDialog() == DialogResult.OK)
            {   
                try
                {
                    var ds = new DataSet();
                    ds.ReadXml(dlg.FileName);
                    
                    this.lstDataFields.DataSource = Global.DataFields = ds.Tables[0].Columns.Cast<DataColumn>().Select(x => x.ColumnName).ToList<string>();

                    this.txtDataSourceFile.Text = dlg.FileName;

                    this.txtDataSourceContent.Text = (this.txtDataSourceFile.Text == "EmbeddedDataSourceSample" ? Global.DataSourceXmlSample : File.ReadAllText(this.txtDataSourceFile.Text));

                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }

        private void cmdRemoveDataSource_Click(object sender, EventArgs e)
        {
            this.txtDataSourceFile.Text = "";
            this.lstDataFields.DataSource = null;
            Global.DataFields = null;
            this.txtDataSourceContent.Text = "";

        }

        private void cmdUseEmbeddedSample_Click(object sender, EventArgs e)
        {
            var ds = new DataSet();
            ds.ReadXml(new System.IO.StringReader(Global.DataSourceXmlSample));

            this.lstDataFields.DataSource = Global.DataFields = ds.Tables[0].Columns.Cast<DataColumn>().Select(x => x.ColumnName).ToList<string>();

            this.txtDataSourceFile.Text = "EmbeddedDataSourceSample";

            this.txtDataSourceContent.Text = (this.txtDataSourceFile.Text == "EmbeddedDataSourceSample" ? Global.DataSourceXmlSample : File.ReadAllText(this.txtDataSourceFile.Text));

        }

        private void tabControl2_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (tabMain.SelectedIndex == 1) //Preview label
            {
                this.PreviewLabel();
            }
        }

        private void cmdPreviewResolution_SelectedIndexChanged(object sender, EventArgs e)
        {
            this.PreviewLabel();
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
                    foreach(var itm in tLabel.Items)
                    {
                        if(string.IsNullOrWhiteSpace(itm.DataField) == false)
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

                        tLabel.DataSource = @"c:\temp\foodsinfo.xml";//ds;
                    }
                    else if(labelRequiresDataSource)
                    {
                        throw new Exception("The label requires a Data Source which is missimg. Could not preview the label.");
                    }
                    
                    
                    //Create ThermalLabel images
                    using (PrintJob pj = new PrintJob())
                    {
                        pj.ThermalLabel = tLabel;

                        int copies = 1;
                        pj.Copies = (int.TryParse(this.txtPreviewCopies.Text, out copies) ? copies : 1);

                        //ImageSettings imgSett = new ImageSettings();
                        //imgSett.ImageFormat = ImageFormat.Png;
                        //imgSett.AntiAlias = true;

                        //pj.ExportToImage(myDir + "TL.png", imgSett, (cmdPreviewResolution.SelectedIndex <= 0 ? 96d : double.Parse(cmdPreviewResolution.SelectedItem.ToString())));

                        //this.labelPreview1.LoadImages(myDir);


                        pj.ExportToHtml(myDir + "labels_preview.html", (cmdPreviewResolution.SelectedIndex <= 0 ? 96d : double.Parse(cmdPreviewResolution.SelectedItem.ToString())), "Labels Preview");

                        WebBrowserHelper.LoadDynamicPage(myDir + "labels_preview.html?timestamp=" + DateTime.Now.Ticks.ToString(), CancellationToken.None);
                        webBrowser1.Refresh(WebBrowserRefreshOption.Completely);

                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                }
            }
        }

        private void tsbMaskedText_Click(object sender, EventArgs e)
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
                //set input mask!
                txtItem.InputMaskPattern = ((ToolStripMenuItem)sender).ToolTipText;
                txtItem.InputMaskPromptChar = '_';

                txtItem.ConvertToUnit(thermalLabelEditor1.LabelDocument.UnitType);

                thermalLabelEditor1.ActiveToolItem = txtItem;
            }
        }

        private void txtPreviewCopies_TextChanged(object sender, EventArgs e)
        {
            this.PreviewLabel();
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

        private void cboBarcodeSymbologies_SelectedIndexChanged(object sender, EventArgs e)
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

        private void menuExportToHtml_Click(object sender, EventArgs e)
        {
            //Create the ThermalLabel obj from the editor
            ThermalLabel tLabel = this.thermalLabelEditor1.ViewRotation == Rotate.None ? this.thermalLabelEditor1.CreateThermalLabel() : this.thermalLabelEditor1.RotateLabel(this.thermalLabelEditor1.CreateThermalLabel(), this.thermalLabelEditor1.ViewRotation, Rotate.None);


            if (tLabel != null)
            {

                double dpi = 96;
                if (DpiInputBox(ref dpi) == DialogResult.OK)
                {
                    //open save dialog...
                    SaveFileDialog dlg = new SaveFileDialog();
                    dlg.DefaultExt = ".html";
                    dlg.Filter = "HTML (.html)|*.html";

                    if (dlg.ShowDialog() == DialogResult.OK)
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
                            MessageBox.Show(ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        }
                    }
                }
            }
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

        private void cmdEditExpressions_Click(object sender, EventArgs e)
        {
            //show Expression dialog
            Global.ExprEditor.Expression = this.txtLabelExpressions.Text;
            if (thermalLabelEditor1.LabelDocument != null)
                Global.CurrentThermalLabel = thermalLabelEditor1.CreateThermalLabel();
            else
                Global.CurrentThermalLabel = null;

            if (Global.ExprEditor.ShowDialog() == DialogResult.OK)
            {
                this.txtLabelExpressions.Text = Global.ExprEditor.Expression;
            }
        }

        private void cmdSetBarcodeSampleCode_Click(object sender, EventArgs e)
        {
            if (_currentSelectedItem is BarcodeItem)
            {
                //Set sample code base don the selected Symbology
                ((BarcodeItem)_currentSelectedItem).Code = BarcodeItemUtils.GenerateSampleCode( (BarcodeSymbology)Enum.Parse(typeof(BarcodeSymbology), this.cboBarcodeSymbologies.SelectedItem.ToString()));
                //refresh property grid
                SetCurrentSelectedItem();
            }
        }

        private void layoutAlign_Click(object sender, EventArgs e)
        {
            thermalLabelEditor1.LayoutSelectedItems((LayoutAlignment)Enum.Parse(typeof(LayoutAlignment), ((ToolStripMenuItem)sender).Text.Replace(" ", "")));
        }

        private void tsbArcText_Click(object sender, EventArgs e)
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

        private void tsbOutlineText_Click(object sender, EventArgs e)
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

        private void tsbResidentText_Click(object sender, EventArgs e)
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

        private void tsbText_Click(object sender, EventArgs e)
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

        private void TsSymbols_SymbolChanged(object sender, EventArgs e)
        {
            //is there any label on the editor's surface...
            if (thermalLabelEditor1.LabelDocument != null)
            {
                //Set the ActiveTool to Text
                thermalLabelEditor1.ActiveTool = EditorTool.Text;

                //Create and set the ActiveToolItem i.e. a TextItem
                TextItem txtItem = new TextItem();
                txtItem.Font.CustomFontFile = Global.CustomSymbolFontBase64;
                txtItem.Font.Name = "";
                txtItem.Text = ((Button)sender).Text;
                txtItem.ReadOnly = true;
                txtItem.Sizing = TextSizing.FontSizeScaling;
                txtItem.TextAlignment = TextAlignment.Center;
                

                txtItem.ConvertToUnit(thermalLabelEditor1.LabelDocument.UnitType);

                thermalLabelEditor1.ActiveToolItem = txtItem;

                this.tsddbSymbols.HideDropDown();
            }

        }

        private void tsbGroup_Click(object sender, EventArgs e)
        {
            //Perform grouping
            thermalLabelEditor1.Group();
        }

        private void tsbUngroup_Click(object sender, EventArgs e)
        {
            //Perform ungrouping
            thermalLabelEditor1.Ungroup();
        }


        private void menuViewRotateNone_Click(object sender, EventArgs e)
        {
            thermalLabelEditor1.RotateView(Rotate.None);
        }

        private void menuViewRotate90_Click(object sender, EventArgs e)
        {
            thermalLabelEditor1.RotateView(Rotate.Degree90);
        }

        private void menuViewRotate180_Click(object sender, EventArgs e)
        {
            thermalLabelEditor1.RotateView(Rotate.Degree180);
        }

        private void menuViewRotate270_Click(object sender, EventArgs e)
        {
            thermalLabelEditor1.RotateView(Rotate.Degree270);
        }

        private void tsbSameWidth_Click(object sender, EventArgs e)
        {
            thermalLabelEditor1.SetSelectedItemsToSameSize(true, false);
        }

        private void tsbSameHeight_Click(object sender, EventArgs e)
        {
            thermalLabelEditor1.SetSelectedItemsToSameSize(false, true);
        }

        private void tsbZoomToLabel_Click(object sender, EventArgs e)
        {
            //Set up zoom to label -> 0%
            thermalLabelEditor1.Zoom = 0;
        }

        private void tsbRepeater_Click(object sender, EventArgs e)
        {
            //is there any label on the editor's surface...
            if (thermalLabelEditor1.LabelDocument != null)
            {
                //Set the ActiveTool to Repeater
                thermalLabelEditor1.ActiveTool = EditorTool.Repeater;

                //Create and set the ActiveToolItem i.e. a RepeaterItem
                var repeaterItem = new RepeaterItem();
                repeaterItem.ConvertToUnit(thermalLabelEditor1.LabelDocument.UnitType);

                thermalLabelEditor1.ActiveToolItem = repeaterItem;
            }
        }
    }
}
