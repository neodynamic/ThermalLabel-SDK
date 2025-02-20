namespace TLWindowsEditorWinFormsDemo
{
    partial class MainForm
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(MainForm));
            this.toolStripContainer1 = new System.Windows.Forms.ToolStripContainer();
            this.statusStrip1 = new System.Windows.Forms.StatusStrip();
            this.lblSelectionInfo = new System.Windows.Forms.ToolStripStatusLabel();
            this.splitContainer1 = new System.Windows.Forms.SplitContainer();
            this.tabMain = new System.Windows.Forms.TabControl();
            this.tabGallery = new System.Windows.Forms.TabPage();
            this.tabDesign = new System.Windows.Forms.TabPage();
            this.tabPreview = new System.Windows.Forms.TabPage();
            this.webBrowser1 = new System.Windows.Forms.WebBrowser();
            this.toolStrip2 = new System.Windows.Forms.ToolStrip();
            this.toolStripLabel1 = new System.Windows.Forms.ToolStripLabel();
            this.cmdPreviewResolution = new System.Windows.Forms.ToolStripComboBox();
            this.toolStripSeparator4 = new System.Windows.Forms.ToolStripSeparator();
            this.toolStripLabel2 = new System.Windows.Forms.ToolStripLabel();
            this.txtPreviewCopies = new System.Windows.Forms.ToolStripTextBox();
            this.imageList1 = new System.Windows.Forms.ImageList(this.components);
            this.tabControl1 = new System.Windows.Forms.TabControl();
            this.tabProperties = new System.Windows.Forms.TabPage();
            this.pnlBarcodeSymbology = new System.Windows.Forms.Panel();
            this.cmdSetBarcodeSampleCode = new System.Windows.Forms.Button();
            this.cboBarcodeSymbologies = new System.Windows.Forms.ComboBox();
            this.label4 = new System.Windows.Forms.Label();
            this.propertyGrid1 = new System.Windows.Forms.PropertyGrid();
            this.tabDataSource = new System.Windows.Forms.TabPage();
            this.txtDataSourceContent = new System.Windows.Forms.TextBox();
            this.label3 = new System.Windows.Forms.Label();
            this.cmdUseEmbeddedSample = new System.Windows.Forms.Button();
            this.cmdRemoveDataSource = new System.Windows.Forms.Button();
            this.lstDataFields = new System.Windows.Forms.ListBox();
            this.label2 = new System.Windows.Forms.Label();
            this.cmdDataSourceFile = new System.Windows.Forms.Button();
            this.txtDataSourceFile = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.tabExpressions = new System.Windows.Forms.TabPage();
            this.label6 = new System.Windows.Forms.Label();
            this.txtLabelExpressions = new System.Windows.Forms.TextBox();
            this.cmdEditExpressions = new System.Windows.Forms.Button();
            this.label5 = new System.Windows.Forms.Label();
            this.menuStrip1 = new System.Windows.Forms.MenuStrip();
            this.fileToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.menuNew = new System.Windows.Forms.ToolStripMenuItem();
            this.menuOpen = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripMenuItem1 = new System.Windows.Forms.ToolStripSeparator();
            this.menuClose = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripSeparator6 = new System.Windows.Forms.ToolStripSeparator();
            this.menuSave = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripMenuItem2 = new System.Windows.Forms.ToolStripSeparator();
            this.menuLabelSetup = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripMenuItem3 = new System.Windows.Forms.ToolStripSeparator();
            this.menuPrint = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripMenuItem4 = new System.Windows.Forms.ToolStripSeparator();
            this.menuExportToPdf = new System.Windows.Forms.ToolStripMenuItem();
            this.menuExportToJPG = new System.Windows.Forms.ToolStripMenuItem();
            this.menuExportToPNG = new System.Windows.Forms.ToolStripMenuItem();
            this.menuExportToSVG = new System.Windows.Forms.ToolStripMenuItem();
            this.menuExportToHtml = new System.Windows.Forms.ToolStripMenuItem();
            this.editToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.menuUndo = new System.Windows.Forms.ToolStripMenuItem();
            this.menuRedo = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripMenuItem5 = new System.Windows.Forms.ToolStripSeparator();
            this.menuCut = new System.Windows.Forms.ToolStripMenuItem();
            this.menuCopy = new System.Windows.Forms.ToolStripMenuItem();
            this.menuPaste = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripMenuItem6 = new System.Windows.Forms.ToolStripSeparator();
            this.menuSelectAll = new System.Windows.Forms.ToolStripMenuItem();
            this.menuDeleteAll = new System.Windows.Forms.ToolStripMenuItem();
            this.arrangeToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.menuBringForward = new System.Windows.Forms.ToolStripMenuItem();
            this.menuSendBackward = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripMenuItem7 = new System.Windows.Forms.ToolStripSeparator();
            this.menuBringToFront = new System.Windows.Forms.ToolStripMenuItem();
            this.menuSendToBack = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripMenuItem12 = new System.Windows.Forms.ToolStripSeparator();
            this.menuLockUnlock = new System.Windows.Forms.ToolStripMenuItem();
            this.menuUnlockSelectedItems = new System.Windows.Forms.ToolStripMenuItem();
            this.viewToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.menuViewOptions = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripMenuItem18 = new System.Windows.Forms.ToolStripSeparator();
            this.menuViewRotate = new System.Windows.Forms.ToolStripMenuItem();
            this.menuViewRotateNone = new System.Windows.Forms.ToolStripMenuItem();
            this.menuViewRotate90 = new System.Windows.Forms.ToolStripMenuItem();
            this.menuViewRotate180 = new System.Windows.Forms.ToolStripMenuItem();
            this.menuViewRotate270 = new System.Windows.Forms.ToolStripMenuItem();
            this.toolsToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.menuUploadTTFToPrinterStorageToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.menuManageFontsInPrinterStorageToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.helpToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.menuAbout = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStrip1 = new System.Windows.Forms.ToolStrip();
            this.tsbNew = new System.Windows.Forms.ToolStripButton();
            this.tsbOpen = new System.Windows.Forms.ToolStripButton();
            this.tsbSave = new System.Windows.Forms.ToolStripButton();
            this.tsbPrint = new System.Windows.Forms.ToolStripButton();
            this.toolStripSeparator = new System.Windows.Forms.ToolStripSeparator();
            this.tsbCut = new System.Windows.Forms.ToolStripButton();
            this.tsbCopy = new System.Windows.Forms.ToolStripButton();
            this.tsbPaste = new System.Windows.Forms.ToolStripButton();
            this.toolStripSeparator1 = new System.Windows.Forms.ToolStripSeparator();
            this.tsbUndo = new System.Windows.Forms.ToolStripButton();
            this.tsbRedo = new System.Windows.Forms.ToolStripButton();
            this.toolStripSeparator2 = new System.Windows.Forms.ToolStripSeparator();
            this.tsbPointer = new System.Windows.Forms.ToolStripButton();
            this.txbRect = new System.Windows.Forms.ToolStripButton();
            this.tsbEllipse = new System.Windows.Forms.ToolStripButton();
            this.tsbLine = new System.Windows.Forms.ToolStripButton();
            this.tsbResidentText = new System.Windows.Forms.ToolStripButton();
            this.tsbText = new System.Windows.Forms.ToolStripButton();
            this.toolStripSplitButton1 = new System.Windows.Forms.ToolStripSplitButton();
            this.numeric5digitsToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.phoneNumberToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.uSShortDateToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.uSShortDateAndTimeToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.uSTimeToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.uSZipCodeToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.tsbArcText = new System.Windows.Forms.ToolStripButton();
            this.tsbOutlineText = new System.Windows.Forms.ToolStripButton();
            this.tsbPicture = new System.Windows.Forms.ToolStripButton();
            this.tsbRepeater = new System.Windows.Forms.ToolStripButton();
            this.tsddbSymbols = new System.Windows.Forms.ToolStripDropDownButton();
            this.tssbLinearBarcodes = new System.Windows.Forms.ToolStripSplitButton();
            this.tssb2DBarcodes = new System.Windows.Forms.ToolStripSplitButton();
            this.tsbRFID = new System.Windows.Forms.ToolStripButton();
            this.tsbInsertTable = new System.Windows.Forms.ToolStripDropDownButton();
            this.toolStripSeparator3 = new System.Windows.Forms.ToolStripSeparator();
            this.tsbGroup = new System.Windows.Forms.ToolStripButton();
            this.tsbUngroup = new System.Windows.Forms.ToolStripButton();
            this.tsbBringToFront = new System.Windows.Forms.ToolStripButton();
            this.tsbSendToBack = new System.Windows.Forms.ToolStripButton();
            this.tsbBringForward = new System.Windows.Forms.ToolStripButton();
            this.tsbSendBackward = new System.Windows.Forms.ToolStripButton();
            this.toolStripSplitButton2 = new System.Windows.Forms.ToolStripSplitButton();
            this.leftToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.centerHorizontallyToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.rightToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripMenuItem13 = new System.Windows.Forms.ToolStripSeparator();
            this.topToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.centerVerticallyToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.bottomToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripMenuItem14 = new System.Windows.Forms.ToolStripSeparator();
            this.distributeHorizontallyToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.distributeVerticallyToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.tsbSameWidth = new System.Windows.Forms.ToolStripButton();
            this.tsbSameHeight = new System.Windows.Forms.ToolStripButton();
            this.toolStripSeparator7 = new System.Windows.Forms.ToolStripSeparator();
            this.tsbExpressions = new System.Windows.Forms.ToolStripButton();
            this.toolStripSeparator8 = new System.Windows.Forms.ToolStripSeparator();
            this.tsbZoomIn = new System.Windows.Forms.ToolStripButton();
            this.tsbZoomOut = new System.Windows.Forms.ToolStripButton();
            this.tsbZoom100 = new System.Windows.Forms.ToolStripButton();
            this.tsbZoomToLabel = new System.Windows.Forms.ToolStripButton();
            this.toolStripSeparator5 = new System.Windows.Forms.ToolStripSeparator();
            this.tsbHelp = new System.Windows.Forms.ToolStripButton();
            this.contextMenuStrip1 = new System.Windows.Forms.ContextMenuStrip(this.components);
            this.cmCut = new System.Windows.Forms.ToolStripMenuItem();
            this.cmCopy = new System.Windows.Forms.ToolStripMenuItem();
            this.cmPaste = new System.Windows.Forms.ToolStripMenuItem();
            this.cmSep1 = new System.Windows.Forms.ToolStripSeparator();
            this.cmFont = new System.Windows.Forms.ToolStripMenuItem();
            this.cmSetPicture = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripMenuItem8 = new System.Windows.Forms.ToolStripSeparator();
            this.arrangeToolStripMenuItem1 = new System.Windows.Forms.ToolStripMenuItem();
            this.cmBringForward = new System.Windows.Forms.ToolStripMenuItem();
            this.cmSendBackward = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripMenuItem9 = new System.Windows.Forms.ToolStripSeparator();
            this.cmBringToFront = new System.Windows.Forms.ToolStripMenuItem();
            this.cmSendToBack = new System.Windows.Forms.ToolStripMenuItem();
            this.cmLayoutAlign = new System.Windows.Forms.ToolStripMenuItem();
            this.leftToolStripMenuItem1 = new System.Windows.Forms.ToolStripMenuItem();
            this.centerHorizontalToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.rightToolStripMenuItem1 = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripMenuItem16 = new System.Windows.Forms.ToolStripSeparator();
            this.topToolStripMenuItem1 = new System.Windows.Forms.ToolStripMenuItem();
            this.centerVerticalToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.bottomToolStripMenuItem1 = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripMenuItem17 = new System.Windows.Forms.ToolStripSeparator();
            this.distributeHorizontalToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.distributeVerticalToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripMenuItem10 = new System.Windows.Forms.ToolStripSeparator();
            this.cmGroup = new System.Windows.Forms.ToolStripMenuItem();
            this.cmUngroup = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripMenuItem15 = new System.Windows.Forms.ToolStripSeparator();
            this.cmLock = new System.Windows.Forms.ToolStripMenuItem();
            this.cmUnlock = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripMenuItem11 = new System.Windows.Forms.ToolStripSeparator();
            this.cmSelectAll = new System.Windows.Forms.ToolStripMenuItem();
            this.cmExpressionSeparator = new System.Windows.Forms.ToolStripSeparator();
            this.cmExpression = new System.Windows.Forms.ToolStripMenuItem();
            this.tsbLiteral = new System.Windows.Forms.ToolStripButton();
            this.toolStripContainer1.BottomToolStripPanel.SuspendLayout();
            this.toolStripContainer1.ContentPanel.SuspendLayout();
            this.toolStripContainer1.TopToolStripPanel.SuspendLayout();
            this.toolStripContainer1.SuspendLayout();
            this.statusStrip1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.splitContainer1)).BeginInit();
            this.splitContainer1.Panel1.SuspendLayout();
            this.splitContainer1.Panel2.SuspendLayout();
            this.splitContainer1.SuspendLayout();
            this.tabMain.SuspendLayout();
            this.tabPreview.SuspendLayout();
            this.toolStrip2.SuspendLayout();
            this.tabControl1.SuspendLayout();
            this.tabProperties.SuspendLayout();
            this.pnlBarcodeSymbology.SuspendLayout();
            this.tabDataSource.SuspendLayout();
            this.tabExpressions.SuspendLayout();
            this.menuStrip1.SuspendLayout();
            this.toolStrip1.SuspendLayout();
            this.contextMenuStrip1.SuspendLayout();
            this.SuspendLayout();
            // 
            // toolStripContainer1
            // 
            // 
            // toolStripContainer1.BottomToolStripPanel
            // 
            this.toolStripContainer1.BottomToolStripPanel.Controls.Add(this.statusStrip1);
            // 
            // toolStripContainer1.ContentPanel
            // 
            this.toolStripContainer1.ContentPanel.Controls.Add(this.splitContainer1);
            this.toolStripContainer1.ContentPanel.Padding = new System.Windows.Forms.Padding(5);
            this.toolStripContainer1.ContentPanel.Size = new System.Drawing.Size(1122, 499);
            this.toolStripContainer1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.toolStripContainer1.Location = new System.Drawing.Point(0, 0);
            this.toolStripContainer1.Name = "toolStripContainer1";
            this.toolStripContainer1.Size = new System.Drawing.Size(1122, 570);
            this.toolStripContainer1.TabIndex = 0;
            this.toolStripContainer1.Text = "toolStripContainer1";
            // 
            // toolStripContainer1.TopToolStripPanel
            // 
            this.toolStripContainer1.TopToolStripPanel.Controls.Add(this.menuStrip1);
            this.toolStripContainer1.TopToolStripPanel.Controls.Add(this.toolStrip1);
            // 
            // statusStrip1
            // 
            this.statusStrip1.Dock = System.Windows.Forms.DockStyle.None;
            this.statusStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.lblSelectionInfo});
            this.statusStrip1.Location = new System.Drawing.Point(0, 0);
            this.statusStrip1.Name = "statusStrip1";
            this.statusStrip1.Size = new System.Drawing.Size(1122, 22);
            this.statusStrip1.TabIndex = 0;
            this.statusStrip1.Text = "statusStrip1";
            // 
            // lblSelectionInfo
            // 
            this.lblSelectionInfo.Name = "lblSelectionInfo";
            this.lblSelectionInfo.Size = new System.Drawing.Size(39, 17);
            this.lblSelectionInfo.Text = "Status";
            // 
            // splitContainer1
            // 
            this.splitContainer1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.splitContainer1.Location = new System.Drawing.Point(5, 5);
            this.splitContainer1.Name = "splitContainer1";
            // 
            // splitContainer1.Panel1
            // 
            this.splitContainer1.Panel1.Controls.Add(this.tabMain);
            this.splitContainer1.Panel1.Padding = new System.Windows.Forms.Padding(5);
            // 
            // splitContainer1.Panel2
            // 
            this.splitContainer1.Panel2.Controls.Add(this.tabControl1);
            this.splitContainer1.Panel2.Padding = new System.Windows.Forms.Padding(5);
            this.splitContainer1.Size = new System.Drawing.Size(1112, 489);
            this.splitContainer1.SplitterDistance = 748;
            this.splitContainer1.TabIndex = 0;
            // 
            // tabMain
            // 
            this.tabMain.Controls.Add(this.tabGallery);
            this.tabMain.Controls.Add(this.tabDesign);
            this.tabMain.Controls.Add(this.tabPreview);
            this.tabMain.Dock = System.Windows.Forms.DockStyle.Fill;
            this.tabMain.Font = new System.Drawing.Font("Segoe UI", 9F);
            this.tabMain.ImageList = this.imageList1;
            this.tabMain.Location = new System.Drawing.Point(5, 5);
            this.tabMain.Name = "tabMain";
            this.tabMain.SelectedIndex = 0;
            this.tabMain.Size = new System.Drawing.Size(738, 479);
            this.tabMain.TabIndex = 1;
            this.tabMain.SelectedIndexChanged += new System.EventHandler(this.tabControl2_SelectedIndexChanged);
            // 
            // tabGallery
            // 
            this.tabGallery.ImageIndex = 4;
            this.tabGallery.Location = new System.Drawing.Point(4, 24);
            this.tabGallery.Name = "tabGallery";
            this.tabGallery.Padding = new System.Windows.Forms.Padding(3);
            this.tabGallery.Size = new System.Drawing.Size(730, 451);
            this.tabGallery.TabIndex = 2;
            this.tabGallery.Text = "Gallery";
            this.tabGallery.UseVisualStyleBackColor = true;
            // 
            // tabDesign
            // 
            this.tabDesign.ImageIndex = 1;
            this.tabDesign.Location = new System.Drawing.Point(4, 24);
            this.tabDesign.Name = "tabDesign";
            this.tabDesign.Padding = new System.Windows.Forms.Padding(3);
            this.tabDesign.Size = new System.Drawing.Size(730, 451);
            this.tabDesign.TabIndex = 0;
            this.tabDesign.Text = "Design";
            this.tabDesign.UseVisualStyleBackColor = true;
            // 
            // tabPreview
            // 
            this.tabPreview.Controls.Add(this.webBrowser1);
            this.tabPreview.Controls.Add(this.toolStrip2);
            this.tabPreview.ImageIndex = 2;
            this.tabPreview.Location = new System.Drawing.Point(4, 24);
            this.tabPreview.Name = "tabPreview";
            this.tabPreview.Padding = new System.Windows.Forms.Padding(3);
            this.tabPreview.Size = new System.Drawing.Size(730, 451);
            this.tabPreview.TabIndex = 1;
            this.tabPreview.Text = "Preview";
            this.tabPreview.UseVisualStyleBackColor = true;
            // 
            // webBrowser1
            // 
            this.webBrowser1.AllowNavigation = false;
            this.webBrowser1.AllowWebBrowserDrop = false;
            this.webBrowser1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.webBrowser1.IsWebBrowserContextMenuEnabled = false;
            this.webBrowser1.Location = new System.Drawing.Point(3, 28);
            this.webBrowser1.MinimumSize = new System.Drawing.Size(20, 20);
            this.webBrowser1.Name = "webBrowser1";
            this.webBrowser1.Size = new System.Drawing.Size(724, 420);
            this.webBrowser1.TabIndex = 1;
            // 
            // toolStrip2
            // 
            this.toolStrip2.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.toolStripLabel1,
            this.cmdPreviewResolution,
            this.toolStripSeparator4,
            this.toolStripLabel2,
            this.txtPreviewCopies});
            this.toolStrip2.Location = new System.Drawing.Point(3, 3);
            this.toolStrip2.Name = "toolStrip2";
            this.toolStrip2.Size = new System.Drawing.Size(724, 25);
            this.toolStrip2.TabIndex = 0;
            this.toolStrip2.Text = "toolStrip2";
            // 
            // toolStripLabel1
            // 
            this.toolStripLabel1.Name = "toolStripLabel1";
            this.toolStripLabel1.Size = new System.Drawing.Size(92, 22);
            this.toolStripLabel1.Text = "Resolution (DPI)";
            // 
            // cmdPreviewResolution
            // 
            this.cmdPreviewResolution.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cmdPreviewResolution.Items.AddRange(new object[] {
            "Screen",
            "203",
            "300",
            "600"});
            this.cmdPreviewResolution.Name = "cmdPreviewResolution";
            this.cmdPreviewResolution.Size = new System.Drawing.Size(121, 25);
            this.cmdPreviewResolution.SelectedIndexChanged += new System.EventHandler(this.cmdPreviewResolution_SelectedIndexChanged);
            // 
            // toolStripSeparator4
            // 
            this.toolStripSeparator4.Name = "toolStripSeparator4";
            this.toolStripSeparator4.Size = new System.Drawing.Size(6, 25);
            // 
            // toolStripLabel2
            // 
            this.toolStripLabel2.Name = "toolStripLabel2";
            this.toolStripLabel2.Size = new System.Drawing.Size(212, 22);
            this.toolStripLabel2.Text = "Copies (for Data Masking or Counters):";
            // 
            // txtPreviewCopies
            // 
            this.txtPreviewCopies.Name = "txtPreviewCopies";
            this.txtPreviewCopies.Size = new System.Drawing.Size(100, 25);
            this.txtPreviewCopies.Text = "1";
            this.txtPreviewCopies.TextBoxTextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.txtPreviewCopies.TextChanged += new System.EventHandler(this.txtPreviewCopies_TextChanged);
            // 
            // imageList1
            // 
            this.imageList1.ImageStream = ((System.Windows.Forms.ImageListStreamer)(resources.GetObject("imageList1.ImageStream")));
            this.imageList1.TransparentColor = System.Drawing.Color.Transparent;
            this.imageList1.Images.SetKeyName(0, "db.png");
            this.imageList1.Images.SetKeyName(1, "design.png");
            this.imageList1.Images.SetKeyName(2, "preview.png");
            this.imageList1.Images.SetKeyName(3, "properties.png");
            this.imageList1.Images.SetKeyName(4, "gallery.png");
            this.imageList1.Images.SetKeyName(5, "fx.png");
            // 
            // tabControl1
            // 
            this.tabControl1.Controls.Add(this.tabProperties);
            this.tabControl1.Controls.Add(this.tabDataSource);
            this.tabControl1.Controls.Add(this.tabExpressions);
            this.tabControl1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.tabControl1.Font = new System.Drawing.Font("Segoe UI", 9F);
            this.tabControl1.ImageList = this.imageList1;
            this.tabControl1.Location = new System.Drawing.Point(5, 5);
            this.tabControl1.Name = "tabControl1";
            this.tabControl1.SelectedIndex = 0;
            this.tabControl1.Size = new System.Drawing.Size(350, 479);
            this.tabControl1.TabIndex = 1;
            // 
            // tabProperties
            // 
            this.tabProperties.Controls.Add(this.pnlBarcodeSymbology);
            this.tabProperties.Controls.Add(this.propertyGrid1);
            this.tabProperties.ImageIndex = 3;
            this.tabProperties.Location = new System.Drawing.Point(4, 24);
            this.tabProperties.Name = "tabProperties";
            this.tabProperties.Padding = new System.Windows.Forms.Padding(3);
            this.tabProperties.Size = new System.Drawing.Size(342, 451);
            this.tabProperties.TabIndex = 0;
            this.tabProperties.Text = "Properties";
            this.tabProperties.UseVisualStyleBackColor = true;
            // 
            // pnlBarcodeSymbology
            // 
            this.pnlBarcodeSymbology.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.pnlBarcodeSymbology.Controls.Add(this.cmdSetBarcodeSampleCode);
            this.pnlBarcodeSymbology.Controls.Add(this.cboBarcodeSymbologies);
            this.pnlBarcodeSymbology.Controls.Add(this.label4);
            this.pnlBarcodeSymbology.Location = new System.Drawing.Point(3, 8);
            this.pnlBarcodeSymbology.Name = "pnlBarcodeSymbology";
            this.pnlBarcodeSymbology.Size = new System.Drawing.Size(335, 88);
            this.pnlBarcodeSymbology.TabIndex = 1;
            this.pnlBarcodeSymbology.Visible = false;
            // 
            // cmdSetBarcodeSampleCode
            // 
            this.cmdSetBarcodeSampleCode.Anchor = System.Windows.Forms.AnchorStyles.Top;
            this.cmdSetBarcodeSampleCode.Location = new System.Drawing.Point(97, 53);
            this.cmdSetBarcodeSampleCode.Name = "cmdSetBarcodeSampleCode";
            this.cmdSetBarcodeSampleCode.Size = new System.Drawing.Size(128, 28);
            this.cmdSetBarcodeSampleCode.TabIndex = 2;
            this.cmdSetBarcodeSampleCode.Text = "Set Sample Code...";
            this.cmdSetBarcodeSampleCode.UseVisualStyleBackColor = true;
            this.cmdSetBarcodeSampleCode.Click += new System.EventHandler(this.cmdSetBarcodeSampleCode_Click);
            // 
            // cboBarcodeSymbologies
            // 
            this.cboBarcodeSymbologies.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.cboBarcodeSymbologies.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboBarcodeSymbologies.FormattingEnabled = true;
            this.cboBarcodeSymbologies.Location = new System.Drawing.Point(0, 22);
            this.cboBarcodeSymbologies.Name = "cboBarcodeSymbologies";
            this.cboBarcodeSymbologies.Size = new System.Drawing.Size(332, 23);
            this.cboBarcodeSymbologies.TabIndex = 1;
            this.cboBarcodeSymbologies.SelectedIndexChanged += new System.EventHandler(this.cboBarcodeSymbologies_SelectedIndexChanged);
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Font = new System.Drawing.Font("Segoe UI", 9F, System.Drawing.FontStyle.Bold);
            this.label4.Location = new System.Drawing.Point(-3, 4);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(157, 15);
            this.label4.TabIndex = 0;
            this.label4.Text = "Barcode Type / Symbology:";
            // 
            // propertyGrid1
            // 
            this.propertyGrid1.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.propertyGrid1.Location = new System.Drawing.Point(3, 6);
            this.propertyGrid1.Name = "propertyGrid1";
            this.propertyGrid1.Size = new System.Drawing.Size(336, 442);
            this.propertyGrid1.TabIndex = 0;
            // 
            // tabDataSource
            // 
            this.tabDataSource.Controls.Add(this.txtDataSourceContent);
            this.tabDataSource.Controls.Add(this.label3);
            this.tabDataSource.Controls.Add(this.cmdUseEmbeddedSample);
            this.tabDataSource.Controls.Add(this.cmdRemoveDataSource);
            this.tabDataSource.Controls.Add(this.lstDataFields);
            this.tabDataSource.Controls.Add(this.label2);
            this.tabDataSource.Controls.Add(this.cmdDataSourceFile);
            this.tabDataSource.Controls.Add(this.txtDataSourceFile);
            this.tabDataSource.Controls.Add(this.label1);
            this.tabDataSource.ImageIndex = 0;
            this.tabDataSource.Location = new System.Drawing.Point(4, 24);
            this.tabDataSource.Name = "tabDataSource";
            this.tabDataSource.Padding = new System.Windows.Forms.Padding(3);
            this.tabDataSource.Size = new System.Drawing.Size(342, 451);
            this.tabDataSource.TabIndex = 1;
            this.tabDataSource.Text = "Data Source";
            this.tabDataSource.UseVisualStyleBackColor = true;
            // 
            // txtDataSourceContent
            // 
            this.txtDataSourceContent.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.txtDataSourceContent.Font = new System.Drawing.Font("Consolas", 9.75F);
            this.txtDataSourceContent.Location = new System.Drawing.Point(10, 254);
            this.txtDataSourceContent.Multiline = true;
            this.txtDataSourceContent.Name = "txtDataSourceContent";
            this.txtDataSourceContent.ReadOnly = true;
            this.txtDataSourceContent.Size = new System.Drawing.Size(321, 183);
            this.txtDataSourceContent.TabIndex = 8;
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold);
            this.label3.Location = new System.Drawing.Point(7, 238);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(126, 13);
            this.label3.TabIndex = 7;
            this.label3.Text = "Data Source Content";
            // 
            // cmdUseEmbeddedSample
            // 
            this.cmdUseEmbeddedSample.Location = new System.Drawing.Point(101, 51);
            this.cmdUseEmbeddedSample.Name = "cmdUseEmbeddedSample";
            this.cmdUseEmbeddedSample.Size = new System.Drawing.Size(170, 28);
            this.cmdUseEmbeddedSample.TabIndex = 6;
            this.cmdUseEmbeddedSample.Text = "Use Embedded Sample";
            this.cmdUseEmbeddedSample.UseVisualStyleBackColor = true;
            this.cmdUseEmbeddedSample.Click += new System.EventHandler(this.cmdUseEmbeddedSample_Click);
            // 
            // cmdRemoveDataSource
            // 
            this.cmdRemoveDataSource.Location = new System.Drawing.Point(10, 51);
            this.cmdRemoveDataSource.Name = "cmdRemoveDataSource";
            this.cmdRemoveDataSource.Size = new System.Drawing.Size(75, 28);
            this.cmdRemoveDataSource.TabIndex = 5;
            this.cmdRemoveDataSource.Text = "Remove";
            this.cmdRemoveDataSource.UseVisualStyleBackColor = true;
            this.cmdRemoveDataSource.Click += new System.EventHandler(this.cmdRemoveDataSource_Click);
            // 
            // lstDataFields
            // 
            this.lstDataFields.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.lstDataFields.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F);
            this.lstDataFields.FormattingEnabled = true;
            this.lstDataFields.ItemHeight = 20;
            this.lstDataFields.Location = new System.Drawing.Point(10, 103);
            this.lstDataFields.Name = "lstDataFields";
            this.lstDataFields.Size = new System.Drawing.Size(321, 104);
            this.lstDataFields.TabIndex = 4;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold);
            this.label2.Location = new System.Drawing.Point(7, 88);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(71, 13);
            this.label2.TabIndex = 3;
            this.label2.Text = "Data Fields";
            // 
            // cmdDataSourceFile
            // 
            this.cmdDataSourceFile.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.cmdDataSourceFile.Location = new System.Drawing.Point(292, 24);
            this.cmdDataSourceFile.Name = "cmdDataSourceFile";
            this.cmdDataSourceFile.Size = new System.Drawing.Size(39, 23);
            this.cmdDataSourceFile.TabIndex = 2;
            this.cmdDataSourceFile.Text = "•••";
            this.cmdDataSourceFile.UseVisualStyleBackColor = true;
            this.cmdDataSourceFile.Click += new System.EventHandler(this.cmdDataSourceFile_Click);
            // 
            // txtDataSourceFile
            // 
            this.txtDataSourceFile.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.txtDataSourceFile.Location = new System.Drawing.Point(10, 24);
            this.txtDataSourceFile.Name = "txtDataSourceFile";
            this.txtDataSourceFile.ReadOnly = true;
            this.txtDataSourceFile.Size = new System.Drawing.Size(276, 23);
            this.txtDataSourceFile.TabIndex = 1;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F);
            this.label1.Location = new System.Drawing.Point(7, 7);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(57, 13);
            this.label1.TabIndex = 0;
            this.label1.Text = "File (XML):";
            // 
            // tabExpressions
            // 
            this.tabExpressions.Controls.Add(this.label6);
            this.tabExpressions.Controls.Add(this.txtLabelExpressions);
            this.tabExpressions.Controls.Add(this.cmdEditExpressions);
            this.tabExpressions.Controls.Add(this.label5);
            this.tabExpressions.ImageIndex = 5;
            this.tabExpressions.Location = new System.Drawing.Point(4, 24);
            this.tabExpressions.Name = "tabExpressions";
            this.tabExpressions.Padding = new System.Windows.Forms.Padding(3);
            this.tabExpressions.Size = new System.Drawing.Size(342, 451);
            this.tabExpressions.TabIndex = 2;
            this.tabExpressions.Text = "Expressions";
            this.tabExpressions.UseVisualStyleBackColor = true;
            // 
            // label6
            // 
            this.label6.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.label6.Font = new System.Drawing.Font("Segoe UI", 9F, System.Drawing.FontStyle.Bold);
            this.label6.Location = new System.Drawing.Point(7, 118);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(329, 22);
            this.label6.TabIndex = 8;
            this.label6.Text = "One Expression code per line is mandatory!";
            // 
            // txtLabelExpressions
            // 
            this.txtLabelExpressions.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.txtLabelExpressions.Font = new System.Drawing.Font("Courier New", 9F);
            this.txtLabelExpressions.Location = new System.Drawing.Point(12, 143);
            this.txtLabelExpressions.Multiline = true;
            this.txtLabelExpressions.Name = "txtLabelExpressions";
            this.txtLabelExpressions.ReadOnly = true;
            this.txtLabelExpressions.ScrollBars = System.Windows.Forms.ScrollBars.Both;
            this.txtLabelExpressions.Size = new System.Drawing.Size(313, 302);
            this.txtLabelExpressions.TabIndex = 7;
            // 
            // cmdEditExpressions
            // 
            this.cmdEditExpressions.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.cmdEditExpressions.Location = new System.Drawing.Point(10, 76);
            this.cmdEditExpressions.Name = "cmdEditExpressions";
            this.cmdEditExpressions.Size = new System.Drawing.Size(316, 28);
            this.cmdEditExpressions.TabIndex = 6;
            this.cmdEditExpressions.Text = "Edit";
            this.cmdEditExpressions.UseVisualStyleBackColor = true;
            this.cmdEditExpressions.Click += new System.EventHandler(this.cmdEditExpressions_Click);
            // 
            // label5
            // 
            this.label5.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.label5.Location = new System.Drawing.Point(7, 7);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(329, 66);
            this.label5.TabIndex = 0;
            this.label5.Text = "These Expressions are applied on the whole label content and allows you to change" +
    " Item Attributes/Properties based on the result of each expression code.";
            // 
            // menuStrip1
            // 
            this.menuStrip1.Dock = System.Windows.Forms.DockStyle.None;
            this.menuStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.fileToolStripMenuItem,
            this.editToolStripMenuItem,
            this.arrangeToolStripMenuItem,
            this.viewToolStripMenuItem,
            this.toolsToolStripMenuItem,
            this.helpToolStripMenuItem});
            this.menuStrip1.Location = new System.Drawing.Point(0, 0);
            this.menuStrip1.Name = "menuStrip1";
            this.menuStrip1.Size = new System.Drawing.Size(1122, 24);
            this.menuStrip1.TabIndex = 0;
            this.menuStrip1.Text = "menuStrip1";
            // 
            // fileToolStripMenuItem
            // 
            this.fileToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.menuNew,
            this.menuOpen,
            this.toolStripMenuItem1,
            this.menuClose,
            this.toolStripSeparator6,
            this.menuSave,
            this.toolStripMenuItem2,
            this.menuLabelSetup,
            this.toolStripMenuItem3,
            this.menuPrint,
            this.toolStripMenuItem4,
            this.menuExportToPdf,
            this.menuExportToJPG,
            this.menuExportToPNG,
            this.menuExportToSVG,
            this.menuExportToHtml});
            this.fileToolStripMenuItem.Name = "fileToolStripMenuItem";
            this.fileToolStripMenuItem.Size = new System.Drawing.Size(37, 20);
            this.fileToolStripMenuItem.Text = "&File";
            // 
            // menuNew
            // 
            this.menuNew.Name = "menuNew";
            this.menuNew.Size = new System.Drawing.Size(157, 22);
            this.menuNew.Text = "New";
            this.menuNew.Click += new System.EventHandler(this.menuNew_Click);
            // 
            // menuOpen
            // 
            this.menuOpen.Name = "menuOpen";
            this.menuOpen.Size = new System.Drawing.Size(157, 22);
            this.menuOpen.Text = "Open";
            this.menuOpen.Click += new System.EventHandler(this.menuOpen_Click);
            // 
            // toolStripMenuItem1
            // 
            this.toolStripMenuItem1.Name = "toolStripMenuItem1";
            this.toolStripMenuItem1.Size = new System.Drawing.Size(154, 6);
            // 
            // menuClose
            // 
            this.menuClose.Name = "menuClose";
            this.menuClose.Size = new System.Drawing.Size(157, 22);
            this.menuClose.Text = "Close";
            this.menuClose.Click += new System.EventHandler(this.menuClose_Click);
            // 
            // toolStripSeparator6
            // 
            this.toolStripSeparator6.Name = "toolStripSeparator6";
            this.toolStripSeparator6.Size = new System.Drawing.Size(154, 6);
            // 
            // menuSave
            // 
            this.menuSave.Name = "menuSave";
            this.menuSave.Size = new System.Drawing.Size(157, 22);
            this.menuSave.Text = "Save";
            this.menuSave.Click += new System.EventHandler(this.menuSave_Click);
            // 
            // toolStripMenuItem2
            // 
            this.toolStripMenuItem2.Name = "toolStripMenuItem2";
            this.toolStripMenuItem2.Size = new System.Drawing.Size(154, 6);
            // 
            // menuLabelSetup
            // 
            this.menuLabelSetup.Name = "menuLabelSetup";
            this.menuLabelSetup.Size = new System.Drawing.Size(157, 22);
            this.menuLabelSetup.Text = "Label Setup";
            this.menuLabelSetup.Click += new System.EventHandler(this.menuLabelSetup_Click);
            // 
            // toolStripMenuItem3
            // 
            this.toolStripMenuItem3.Name = "toolStripMenuItem3";
            this.toolStripMenuItem3.Size = new System.Drawing.Size(154, 6);
            // 
            // menuPrint
            // 
            this.menuPrint.Name = "menuPrint";
            this.menuPrint.Size = new System.Drawing.Size(157, 22);
            this.menuPrint.Text = "Print...";
            this.menuPrint.Click += new System.EventHandler(this.menuPrint_Click);
            // 
            // toolStripMenuItem4
            // 
            this.toolStripMenuItem4.Name = "toolStripMenuItem4";
            this.toolStripMenuItem4.Size = new System.Drawing.Size(154, 6);
            // 
            // menuExportToPdf
            // 
            this.menuExportToPdf.Name = "menuExportToPdf";
            this.menuExportToPdf.Size = new System.Drawing.Size(157, 22);
            this.menuExportToPdf.Text = "Export to PDF";
            this.menuExportToPdf.Click += new System.EventHandler(this.menuExportToPdf_Click);
            // 
            // menuExportToJPG
            // 
            this.menuExportToJPG.Name = "menuExportToJPG";
            this.menuExportToJPG.Size = new System.Drawing.Size(157, 22);
            this.menuExportToJPG.Text = "Export to JPG";
            this.menuExportToJPG.Click += new System.EventHandler(this.menuExportToJPG_Click);
            // 
            // menuExportToPNG
            // 
            this.menuExportToPNG.Name = "menuExportToPNG";
            this.menuExportToPNG.Size = new System.Drawing.Size(157, 22);
            this.menuExportToPNG.Text = "Export to PNG";
            this.menuExportToPNG.Click += new System.EventHandler(this.menuExportToPNG_Click);
            // 
            // menuExportToSVG
            // 
            this.menuExportToSVG.Name = "menuExportToSVG";
            this.menuExportToSVG.Size = new System.Drawing.Size(157, 22);
            this.menuExportToSVG.Text = "Export to SVG";
            this.menuExportToSVG.Click += new System.EventHandler(this.menuExportToSVG_Click);
            // 
            // menuExportToHtml
            // 
            this.menuExportToHtml.Name = "menuExportToHtml";
            this.menuExportToHtml.Size = new System.Drawing.Size(157, 22);
            this.menuExportToHtml.Text = "Export to HTML";
            this.menuExportToHtml.Click += new System.EventHandler(this.menuExportToHtml_Click);
            // 
            // editToolStripMenuItem
            // 
            this.editToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.menuUndo,
            this.menuRedo,
            this.toolStripMenuItem5,
            this.menuCut,
            this.menuCopy,
            this.menuPaste,
            this.toolStripMenuItem6,
            this.menuSelectAll,
            this.menuDeleteAll});
            this.editToolStripMenuItem.Name = "editToolStripMenuItem";
            this.editToolStripMenuItem.Size = new System.Drawing.Size(39, 20);
            this.editToolStripMenuItem.Text = "&Edit";
            // 
            // menuUndo
            // 
            this.menuUndo.Name = "menuUndo";
            this.menuUndo.Size = new System.Drawing.Size(124, 22);
            this.menuUndo.Text = "Undo";
            this.menuUndo.Click += new System.EventHandler(this.menuUndo_Click);
            // 
            // menuRedo
            // 
            this.menuRedo.Name = "menuRedo";
            this.menuRedo.Size = new System.Drawing.Size(124, 22);
            this.menuRedo.Text = "Redo";
            this.menuRedo.Click += new System.EventHandler(this.menuRedo_Click);
            // 
            // toolStripMenuItem5
            // 
            this.toolStripMenuItem5.Name = "toolStripMenuItem5";
            this.toolStripMenuItem5.Size = new System.Drawing.Size(121, 6);
            // 
            // menuCut
            // 
            this.menuCut.Name = "menuCut";
            this.menuCut.Size = new System.Drawing.Size(124, 22);
            this.menuCut.Text = "Cut";
            this.menuCut.Click += new System.EventHandler(this.menuCut_Click);
            // 
            // menuCopy
            // 
            this.menuCopy.Name = "menuCopy";
            this.menuCopy.Size = new System.Drawing.Size(124, 22);
            this.menuCopy.Text = "Copy";
            this.menuCopy.Click += new System.EventHandler(this.menuCopy_Click);
            // 
            // menuPaste
            // 
            this.menuPaste.Name = "menuPaste";
            this.menuPaste.Size = new System.Drawing.Size(124, 22);
            this.menuPaste.Text = "Paste";
            this.menuPaste.Click += new System.EventHandler(this.menuPaste_Click);
            // 
            // toolStripMenuItem6
            // 
            this.toolStripMenuItem6.Name = "toolStripMenuItem6";
            this.toolStripMenuItem6.Size = new System.Drawing.Size(121, 6);
            // 
            // menuSelectAll
            // 
            this.menuSelectAll.Name = "menuSelectAll";
            this.menuSelectAll.Size = new System.Drawing.Size(124, 22);
            this.menuSelectAll.Text = "Select All";
            this.menuSelectAll.Click += new System.EventHandler(this.menuSelectAll_Click);
            // 
            // menuDeleteAll
            // 
            this.menuDeleteAll.Name = "menuDeleteAll";
            this.menuDeleteAll.Size = new System.Drawing.Size(124, 22);
            this.menuDeleteAll.Text = "Delete All";
            this.menuDeleteAll.Click += new System.EventHandler(this.menuDeleteAll_Click);
            // 
            // arrangeToolStripMenuItem
            // 
            this.arrangeToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.menuBringForward,
            this.menuSendBackward,
            this.toolStripMenuItem7,
            this.menuBringToFront,
            this.menuSendToBack,
            this.toolStripMenuItem12,
            this.menuLockUnlock,
            this.menuUnlockSelectedItems});
            this.arrangeToolStripMenuItem.Name = "arrangeToolStripMenuItem";
            this.arrangeToolStripMenuItem.Size = new System.Drawing.Size(61, 20);
            this.arrangeToolStripMenuItem.Text = "&Arrange";
            // 
            // menuBringForward
            // 
            this.menuBringForward.Name = "menuBringForward";
            this.menuBringForward.Size = new System.Drawing.Size(190, 22);
            this.menuBringForward.Text = "Bring Forward";
            this.menuBringForward.Click += new System.EventHandler(this.menuBringForward_Click);
            // 
            // menuSendBackward
            // 
            this.menuSendBackward.Name = "menuSendBackward";
            this.menuSendBackward.Size = new System.Drawing.Size(190, 22);
            this.menuSendBackward.Text = "Send Backward";
            this.menuSendBackward.Click += new System.EventHandler(this.menuSendBackward_Click);
            // 
            // toolStripMenuItem7
            // 
            this.toolStripMenuItem7.Name = "toolStripMenuItem7";
            this.toolStripMenuItem7.Size = new System.Drawing.Size(187, 6);
            // 
            // menuBringToFront
            // 
            this.menuBringToFront.Name = "menuBringToFront";
            this.menuBringToFront.Size = new System.Drawing.Size(190, 22);
            this.menuBringToFront.Text = "Bring to Front";
            this.menuBringToFront.Click += new System.EventHandler(this.menuBringToFront_Click);
            // 
            // menuSendToBack
            // 
            this.menuSendToBack.Name = "menuSendToBack";
            this.menuSendToBack.Size = new System.Drawing.Size(190, 22);
            this.menuSendToBack.Text = "Send to Back";
            this.menuSendToBack.Click += new System.EventHandler(this.menuSendToBack_Click);
            // 
            // toolStripMenuItem12
            // 
            this.toolStripMenuItem12.Name = "toolStripMenuItem12";
            this.toolStripMenuItem12.Size = new System.Drawing.Size(187, 6);
            // 
            // menuLockUnlock
            // 
            this.menuLockUnlock.Name = "menuLockUnlock";
            this.menuLockUnlock.Size = new System.Drawing.Size(190, 22);
            this.menuLockUnlock.Text = "Lock Selected Items";
            this.menuLockUnlock.Click += new System.EventHandler(this.menuLockUnlock_Click);
            // 
            // menuUnlockSelectedItems
            // 
            this.menuUnlockSelectedItems.Name = "menuUnlockSelectedItems";
            this.menuUnlockSelectedItems.Size = new System.Drawing.Size(190, 22);
            this.menuUnlockSelectedItems.Text = "Unlock Selected Items";
            this.menuUnlockSelectedItems.Click += new System.EventHandler(this.menuUnlockSelectedItems_Click);
            // 
            // viewToolStripMenuItem
            // 
            this.viewToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.menuViewOptions,
            this.toolStripMenuItem18,
            this.menuViewRotate});
            this.viewToolStripMenuItem.Name = "viewToolStripMenuItem";
            this.viewToolStripMenuItem.Size = new System.Drawing.Size(44, 20);
            this.viewToolStripMenuItem.Text = "&View";
            // 
            // menuViewOptions
            // 
            this.menuViewOptions.Name = "menuViewOptions";
            this.menuViewOptions.Size = new System.Drawing.Size(125, 22);
            this.menuViewOptions.Text = "Options...";
            this.menuViewOptions.Click += new System.EventHandler(this.menuViewOptions_Click);
            // 
            // toolStripMenuItem18
            // 
            this.toolStripMenuItem18.Name = "toolStripMenuItem18";
            this.toolStripMenuItem18.Size = new System.Drawing.Size(122, 6);
            // 
            // menuViewRotate
            // 
            this.menuViewRotate.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.menuViewRotateNone,
            this.menuViewRotate90,
            this.menuViewRotate180,
            this.menuViewRotate270});
            this.menuViewRotate.Name = "menuViewRotate";
            this.menuViewRotate.Size = new System.Drawing.Size(125, 22);
            this.menuViewRotate.Text = "Rotate";
            // 
            // menuViewRotateNone
            // 
            this.menuViewRotateNone.Name = "menuViewRotateNone";
            this.menuViewRotateNone.Size = new System.Drawing.Size(103, 22);
            this.menuViewRotateNone.Text = "None";
            this.menuViewRotateNone.Click += new System.EventHandler(this.menuViewRotateNone_Click);
            // 
            // menuViewRotate90
            // 
            this.menuViewRotate90.Name = "menuViewRotate90";
            this.menuViewRotate90.Size = new System.Drawing.Size(103, 22);
            this.menuViewRotate90.Text = "90";
            this.menuViewRotate90.Click += new System.EventHandler(this.menuViewRotate90_Click);
            // 
            // menuViewRotate180
            // 
            this.menuViewRotate180.Name = "menuViewRotate180";
            this.menuViewRotate180.Size = new System.Drawing.Size(103, 22);
            this.menuViewRotate180.Text = "180";
            this.menuViewRotate180.Click += new System.EventHandler(this.menuViewRotate180_Click);
            // 
            // menuViewRotate270
            // 
            this.menuViewRotate270.Name = "menuViewRotate270";
            this.menuViewRotate270.Size = new System.Drawing.Size(103, 22);
            this.menuViewRotate270.Text = "270";
            this.menuViewRotate270.Click += new System.EventHandler(this.menuViewRotate270_Click);
            // 
            // toolsToolStripMenuItem
            // 
            this.toolsToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.menuUploadTTFToPrinterStorageToolStripMenuItem,
            this.menuManageFontsInPrinterStorageToolStripMenuItem});
            this.toolsToolStripMenuItem.Name = "toolsToolStripMenuItem";
            this.toolsToolStripMenuItem.Size = new System.Drawing.Size(47, 20);
            this.toolsToolStripMenuItem.Text = "&Tools";
            // 
            // menuUploadTTFToPrinterStorageToolStripMenuItem
            // 
            this.menuUploadTTFToPrinterStorageToolStripMenuItem.Name = "menuUploadTTFToPrinterStorageToolStripMenuItem";
            this.menuUploadTTFToPrinterStorageToolStripMenuItem.Size = new System.Drawing.Size(243, 22);
            this.menuUploadTTFToPrinterStorageToolStripMenuItem.Text = "Upload TTF to Printer Storage";
            this.menuUploadTTFToPrinterStorageToolStripMenuItem.Click += new System.EventHandler(this.menuUploadTTFToPrinterStorageToolStripMenuItem_Click);
            // 
            // menuManageFontsInPrinterStorageToolStripMenuItem
            // 
            this.menuManageFontsInPrinterStorageToolStripMenuItem.Name = "menuManageFontsInPrinterStorageToolStripMenuItem";
            this.menuManageFontsInPrinterStorageToolStripMenuItem.Size = new System.Drawing.Size(243, 22);
            this.menuManageFontsInPrinterStorageToolStripMenuItem.Text = "Manage Fonts in Printer Storage";
            this.menuManageFontsInPrinterStorageToolStripMenuItem.Click += new System.EventHandler(this.menuManageFontsInPrinterStorageToolStripMenuItem_Click);
            // 
            // helpToolStripMenuItem
            // 
            this.helpToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.menuAbout});
            this.helpToolStripMenuItem.Name = "helpToolStripMenuItem";
            this.helpToolStripMenuItem.Size = new System.Drawing.Size(44, 20);
            this.helpToolStripMenuItem.Text = "&Help";
            // 
            // menuAbout
            // 
            this.menuAbout.Name = "menuAbout";
            this.menuAbout.Size = new System.Drawing.Size(116, 22);
            this.menuAbout.Text = "About...";
            this.menuAbout.Click += new System.EventHandler(this.menuAbout_Click);
            // 
            // toolStrip1
            // 
            this.toolStrip1.Dock = System.Windows.Forms.DockStyle.None;
            this.toolStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.tsbNew,
            this.tsbOpen,
            this.tsbSave,
            this.tsbPrint,
            this.toolStripSeparator,
            this.tsbCut,
            this.tsbCopy,
            this.tsbPaste,
            this.toolStripSeparator1,
            this.tsbUndo,
            this.tsbRedo,
            this.toolStripSeparator2,
            this.tsbPointer,
            this.txbRect,
            this.tsbEllipse,
            this.tsbLine,
            this.tsbResidentText,
            this.tsbText,
            this.toolStripSplitButton1,
            this.tsbArcText,
            this.tsbOutlineText,
            this.tsbPicture,
            this.tsbRepeater,
            this.tsddbSymbols,
            this.tssbLinearBarcodes,
            this.tssb2DBarcodes,
            this.tsbRFID,
            this.tsbInsertTable,
            this.tsbLiteral,
            this.toolStripSeparator3,
            this.tsbGroup,
            this.tsbUngroup,
            this.tsbBringToFront,
            this.tsbSendToBack,
            this.tsbBringForward,
            this.tsbSendBackward,
            this.toolStripSplitButton2,
            this.tsbSameWidth,
            this.tsbSameHeight,
            this.toolStripSeparator7,
            this.tsbExpressions,
            this.toolStripSeparator8,
            this.tsbZoomIn,
            this.tsbZoomOut,
            this.tsbZoom100,
            this.tsbZoomToLabel,
            this.toolStripSeparator5,
            this.tsbHelp});
            this.toolStrip1.Location = new System.Drawing.Point(3, 24);
            this.toolStrip1.Name = "toolStrip1";
            this.toolStrip1.Size = new System.Drawing.Size(1119, 25);
            this.toolStrip1.TabIndex = 1;
            // 
            // tsbNew
            // 
            this.tsbNew.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbNew.Image = ((System.Drawing.Image)(resources.GetObject("tsbNew.Image")));
            this.tsbNew.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbNew.Name = "tsbNew";
            this.tsbNew.Size = new System.Drawing.Size(23, 22);
            this.tsbNew.Text = "&New";
            this.tsbNew.Click += new System.EventHandler(this.menuNew_Click);
            // 
            // tsbOpen
            // 
            this.tsbOpen.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbOpen.Image = ((System.Drawing.Image)(resources.GetObject("tsbOpen.Image")));
            this.tsbOpen.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbOpen.Name = "tsbOpen";
            this.tsbOpen.Size = new System.Drawing.Size(23, 22);
            this.tsbOpen.Text = "&Open";
            this.tsbOpen.Click += new System.EventHandler(this.menuOpen_Click);
            // 
            // tsbSave
            // 
            this.tsbSave.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbSave.Image = ((System.Drawing.Image)(resources.GetObject("tsbSave.Image")));
            this.tsbSave.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbSave.Name = "tsbSave";
            this.tsbSave.Size = new System.Drawing.Size(23, 22);
            this.tsbSave.Text = "&Save";
            this.tsbSave.Click += new System.EventHandler(this.menuSave_Click);
            // 
            // tsbPrint
            // 
            this.tsbPrint.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbPrint.Image = ((System.Drawing.Image)(resources.GetObject("tsbPrint.Image")));
            this.tsbPrint.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbPrint.Name = "tsbPrint";
            this.tsbPrint.Size = new System.Drawing.Size(23, 22);
            this.tsbPrint.Text = "&Print";
            this.tsbPrint.Click += new System.EventHandler(this.menuPrint_Click);
            // 
            // toolStripSeparator
            // 
            this.toolStripSeparator.Name = "toolStripSeparator";
            this.toolStripSeparator.Size = new System.Drawing.Size(6, 25);
            // 
            // tsbCut
            // 
            this.tsbCut.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbCut.Image = ((System.Drawing.Image)(resources.GetObject("tsbCut.Image")));
            this.tsbCut.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbCut.Name = "tsbCut";
            this.tsbCut.Size = new System.Drawing.Size(23, 22);
            this.tsbCut.Text = "C&ut";
            this.tsbCut.Click += new System.EventHandler(this.menuCut_Click);
            // 
            // tsbCopy
            // 
            this.tsbCopy.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbCopy.Image = ((System.Drawing.Image)(resources.GetObject("tsbCopy.Image")));
            this.tsbCopy.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbCopy.Name = "tsbCopy";
            this.tsbCopy.Size = new System.Drawing.Size(23, 22);
            this.tsbCopy.Text = "&Copy";
            this.tsbCopy.Click += new System.EventHandler(this.menuCopy_Click);
            // 
            // tsbPaste
            // 
            this.tsbPaste.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbPaste.Image = ((System.Drawing.Image)(resources.GetObject("tsbPaste.Image")));
            this.tsbPaste.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbPaste.Name = "tsbPaste";
            this.tsbPaste.Size = new System.Drawing.Size(23, 22);
            this.tsbPaste.Text = "&Paste";
            this.tsbPaste.Click += new System.EventHandler(this.menuPaste_Click);
            // 
            // toolStripSeparator1
            // 
            this.toolStripSeparator1.Name = "toolStripSeparator1";
            this.toolStripSeparator1.Size = new System.Drawing.Size(6, 25);
            // 
            // tsbUndo
            // 
            this.tsbUndo.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbUndo.Image = ((System.Drawing.Image)(resources.GetObject("tsbUndo.Image")));
            this.tsbUndo.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbUndo.Name = "tsbUndo";
            this.tsbUndo.Size = new System.Drawing.Size(23, 22);
            this.tsbUndo.Text = "Undo";
            this.tsbUndo.Click += new System.EventHandler(this.menuUndo_Click);
            // 
            // tsbRedo
            // 
            this.tsbRedo.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbRedo.Image = ((System.Drawing.Image)(resources.GetObject("tsbRedo.Image")));
            this.tsbRedo.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbRedo.Name = "tsbRedo";
            this.tsbRedo.Size = new System.Drawing.Size(23, 22);
            this.tsbRedo.Text = "Redo";
            this.tsbRedo.Click += new System.EventHandler(this.menuRedo_Click);
            // 
            // toolStripSeparator2
            // 
            this.toolStripSeparator2.Name = "toolStripSeparator2";
            this.toolStripSeparator2.Size = new System.Drawing.Size(6, 25);
            // 
            // tsbPointer
            // 
            this.tsbPointer.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbPointer.Image = ((System.Drawing.Image)(resources.GetObject("tsbPointer.Image")));
            this.tsbPointer.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbPointer.Name = "tsbPointer";
            this.tsbPointer.Size = new System.Drawing.Size(23, 22);
            this.tsbPointer.Text = "Pointer";
            this.tsbPointer.Click += new System.EventHandler(this.tsbPointer_Click);
            // 
            // txbRect
            // 
            this.txbRect.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.txbRect.Image = ((System.Drawing.Image)(resources.GetObject("txbRect.Image")));
            this.txbRect.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.txbRect.Name = "txbRect";
            this.txbRect.Size = new System.Drawing.Size(23, 22);
            this.txbRect.Text = "Rectangle";
            this.txbRect.Click += new System.EventHandler(this.txbRect_Click);
            // 
            // tsbEllipse
            // 
            this.tsbEllipse.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbEllipse.Image = ((System.Drawing.Image)(resources.GetObject("tsbEllipse.Image")));
            this.tsbEllipse.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbEllipse.Name = "tsbEllipse";
            this.tsbEllipse.Size = new System.Drawing.Size(23, 22);
            this.tsbEllipse.Text = "Ellipse";
            this.tsbEllipse.Click += new System.EventHandler(this.tsbEllipse_Click);
            // 
            // tsbLine
            // 
            this.tsbLine.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbLine.Image = ((System.Drawing.Image)(resources.GetObject("tsbLine.Image")));
            this.tsbLine.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbLine.Name = "tsbLine";
            this.tsbLine.Size = new System.Drawing.Size(23, 22);
            this.tsbLine.Text = "Line";
            this.tsbLine.Click += new System.EventHandler(this.tsbLine_Click);
            // 
            // tsbResidentText
            // 
            this.tsbResidentText.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbResidentText.Image = ((System.Drawing.Image)(resources.GetObject("tsbResidentText.Image")));
            this.tsbResidentText.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbResidentText.Name = "tsbResidentText";
            this.tsbResidentText.Size = new System.Drawing.Size(23, 22);
            this.tsbResidentText.Text = "Resident Font Text";
            this.tsbResidentText.Click += new System.EventHandler(this.tsbResidentText_Click);
            // 
            // tsbText
            // 
            this.tsbText.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbText.Image = ((System.Drawing.Image)(resources.GetObject("tsbText.Image")));
            this.tsbText.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbText.Name = "tsbText";
            this.tsbText.Size = new System.Drawing.Size(23, 22);
            this.tsbText.Text = "Text";
            this.tsbText.Click += new System.EventHandler(this.tsbText_Click);
            // 
            // toolStripSplitButton1
            // 
            this.toolStripSplitButton1.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.toolStripSplitButton1.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.numeric5digitsToolStripMenuItem,
            this.phoneNumberToolStripMenuItem,
            this.uSShortDateToolStripMenuItem,
            this.uSShortDateAndTimeToolStripMenuItem,
            this.uSTimeToolStripMenuItem,
            this.uSZipCodeToolStripMenuItem});
            this.toolStripSplitButton1.Image = ((System.Drawing.Image)(resources.GetObject("toolStripSplitButton1.Image")));
            this.toolStripSplitButton1.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.toolStripSplitButton1.Name = "toolStripSplitButton1";
            this.toolStripSplitButton1.Size = new System.Drawing.Size(32, 22);
            this.toolStripSplitButton1.Text = "Masked Text";
            // 
            // numeric5digitsToolStripMenuItem
            // 
            this.numeric5digitsToolStripMenuItem.Name = "numeric5digitsToolStripMenuItem";
            this.numeric5digitsToolStripMenuItem.Size = new System.Drawing.Size(199, 22);
            this.numeric5digitsToolStripMenuItem.Text = "Numeric (5-digits)";
            this.numeric5digitsToolStripMenuItem.ToolTipText = "00000";
            this.numeric5digitsToolStripMenuItem.Click += new System.EventHandler(this.tsbMaskedText_Click);
            // 
            // phoneNumberToolStripMenuItem
            // 
            this.phoneNumberToolStripMenuItem.Name = "phoneNumberToolStripMenuItem";
            this.phoneNumberToolStripMenuItem.Size = new System.Drawing.Size(199, 22);
            this.phoneNumberToolStripMenuItem.Text = "Phone Number";
            this.phoneNumberToolStripMenuItem.ToolTipText = "(999) 000-0000";
            this.phoneNumberToolStripMenuItem.Click += new System.EventHandler(this.tsbMaskedText_Click);
            // 
            // uSShortDateToolStripMenuItem
            // 
            this.uSShortDateToolStripMenuItem.Name = "uSShortDateToolStripMenuItem";
            this.uSShortDateToolStripMenuItem.Size = new System.Drawing.Size(199, 22);
            this.uSShortDateToolStripMenuItem.Text = "US Short Date";
            this.uSShortDateToolStripMenuItem.ToolTipText = "00/00/0000";
            this.uSShortDateToolStripMenuItem.Click += new System.EventHandler(this.tsbMaskedText_Click);
            // 
            // uSShortDateAndTimeToolStripMenuItem
            // 
            this.uSShortDateAndTimeToolStripMenuItem.Name = "uSShortDateAndTimeToolStripMenuItem";
            this.uSShortDateAndTimeToolStripMenuItem.Size = new System.Drawing.Size(199, 22);
            this.uSShortDateAndTimeToolStripMenuItem.Text = "US Short Date and Time";
            this.uSShortDateAndTimeToolStripMenuItem.ToolTipText = "00/00/0000 90:00";
            this.uSShortDateAndTimeToolStripMenuItem.Click += new System.EventHandler(this.tsbMaskedText_Click);
            // 
            // uSTimeToolStripMenuItem
            // 
            this.uSTimeToolStripMenuItem.Name = "uSTimeToolStripMenuItem";
            this.uSTimeToolStripMenuItem.Size = new System.Drawing.Size(199, 22);
            this.uSTimeToolStripMenuItem.Text = "US Time";
            this.uSTimeToolStripMenuItem.ToolTipText = "90:00";
            this.uSTimeToolStripMenuItem.Click += new System.EventHandler(this.tsbMaskedText_Click);
            // 
            // uSZipCodeToolStripMenuItem
            // 
            this.uSZipCodeToolStripMenuItem.Name = "uSZipCodeToolStripMenuItem";
            this.uSZipCodeToolStripMenuItem.Size = new System.Drawing.Size(199, 22);
            this.uSZipCodeToolStripMenuItem.Text = "US Zip Code";
            this.uSZipCodeToolStripMenuItem.ToolTipText = "00000-9999";
            this.uSZipCodeToolStripMenuItem.Click += new System.EventHandler(this.tsbMaskedText_Click);
            // 
            // tsbArcText
            // 
            this.tsbArcText.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbArcText.Image = ((System.Drawing.Image)(resources.GetObject("tsbArcText.Image")));
            this.tsbArcText.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbArcText.Name = "tsbArcText";
            this.tsbArcText.Size = new System.Drawing.Size(23, 22);
            this.tsbArcText.Text = "Arc Text";
            this.tsbArcText.Click += new System.EventHandler(this.tsbArcText_Click);
            // 
            // tsbOutlineText
            // 
            this.tsbOutlineText.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbOutlineText.Image = ((System.Drawing.Image)(resources.GetObject("tsbOutlineText.Image")));
            this.tsbOutlineText.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbOutlineText.Name = "tsbOutlineText";
            this.tsbOutlineText.Size = new System.Drawing.Size(23, 22);
            this.tsbOutlineText.Text = "Outline Text";
            this.tsbOutlineText.Click += new System.EventHandler(this.tsbOutlineText_Click);
            // 
            // tsbPicture
            // 
            this.tsbPicture.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbPicture.Image = ((System.Drawing.Image)(resources.GetObject("tsbPicture.Image")));
            this.tsbPicture.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbPicture.Name = "tsbPicture";
            this.tsbPicture.Size = new System.Drawing.Size(23, 22);
            this.tsbPicture.Text = "Picture";
            this.tsbPicture.Click += new System.EventHandler(this.tsbPicture_Click);
            // 
            // tsbRepeater
            // 
            this.tsbRepeater.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbRepeater.Image = ((System.Drawing.Image)(resources.GetObject("tsbRepeater.Image")));
            this.tsbRepeater.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbRepeater.Name = "tsbRepeater";
            this.tsbRepeater.Size = new System.Drawing.Size(23, 22);
            this.tsbRepeater.Text = "Repeater";
            this.tsbRepeater.Click += new System.EventHandler(this.tsbRepeater_Click);
            // 
            // tsddbSymbols
            // 
            this.tsddbSymbols.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsddbSymbols.Image = ((System.Drawing.Image)(resources.GetObject("tsddbSymbols.Image")));
            this.tsddbSymbols.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsddbSymbols.Name = "tsddbSymbols";
            this.tsddbSymbols.Size = new System.Drawing.Size(29, 22);
            this.tsddbSymbols.Text = "Symbols";
            // 
            // tssbLinearBarcodes
            // 
            this.tssbLinearBarcodes.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tssbLinearBarcodes.Image = ((System.Drawing.Image)(resources.GetObject("tssbLinearBarcodes.Image")));
            this.tssbLinearBarcodes.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tssbLinearBarcodes.Name = "tssbLinearBarcodes";
            this.tssbLinearBarcodes.Size = new System.Drawing.Size(32, 22);
            this.tssbLinearBarcodes.Text = "1D/Linear Barcode";
            this.tssbLinearBarcodes.ButtonClick += new System.EventHandler(this.tsbBarcode_Click);
            // 
            // tssb2DBarcodes
            // 
            this.tssb2DBarcodes.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tssb2DBarcodes.Image = ((System.Drawing.Image)(resources.GetObject("tssb2DBarcodes.Image")));
            this.tssb2DBarcodes.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tssb2DBarcodes.Name = "tssb2DBarcodes";
            this.tssb2DBarcodes.Size = new System.Drawing.Size(32, 22);
            this.tssb2DBarcodes.Text = "2D Barcode";
            this.tssb2DBarcodes.ButtonClick += new System.EventHandler(this.tsbBarcode_Click);
            // 
            // tsbRFID
            // 
            this.tsbRFID.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbRFID.Image = ((System.Drawing.Image)(resources.GetObject("tsbRFID.Image")));
            this.tsbRFID.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbRFID.Name = "tsbRFID";
            this.tsbRFID.Size = new System.Drawing.Size(23, 22);
            this.tsbRFID.Text = "RFID Tag";
            this.tsbRFID.Click += new System.EventHandler(this.tsbRFID_Click);
            // 
            // tsbInsertTable
            // 
            this.tsbInsertTable.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbInsertTable.Image = ((System.Drawing.Image)(resources.GetObject("tsbInsertTable.Image")));
            this.tsbInsertTable.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbInsertTable.Name = "tsbInsertTable";
            this.tsbInsertTable.Size = new System.Drawing.Size(29, 22);
            this.tsbInsertTable.Text = "Insert table...";
            // 
            // toolStripSeparator3
            // 
            this.toolStripSeparator3.Name = "toolStripSeparator3";
            this.toolStripSeparator3.Size = new System.Drawing.Size(6, 25);
            // 
            // tsbGroup
            // 
            this.tsbGroup.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbGroup.Image = ((System.Drawing.Image)(resources.GetObject("tsbGroup.Image")));
            this.tsbGroup.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbGroup.Name = "tsbGroup";
            this.tsbGroup.Size = new System.Drawing.Size(23, 22);
            this.tsbGroup.Text = "Group";
            this.tsbGroup.Click += new System.EventHandler(this.tsbGroup_Click);
            // 
            // tsbUngroup
            // 
            this.tsbUngroup.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbUngroup.Image = ((System.Drawing.Image)(resources.GetObject("tsbUngroup.Image")));
            this.tsbUngroup.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbUngroup.Name = "tsbUngroup";
            this.tsbUngroup.Size = new System.Drawing.Size(23, 22);
            this.tsbUngroup.Text = "Ungroup";
            this.tsbUngroup.Click += new System.EventHandler(this.tsbUngroup_Click);
            // 
            // tsbBringToFront
            // 
            this.tsbBringToFront.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbBringToFront.Image = ((System.Drawing.Image)(resources.GetObject("tsbBringToFront.Image")));
            this.tsbBringToFront.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbBringToFront.Name = "tsbBringToFront";
            this.tsbBringToFront.Size = new System.Drawing.Size(23, 22);
            this.tsbBringToFront.Text = "Bring to Front";
            this.tsbBringToFront.Click += new System.EventHandler(this.menuBringToFront_Click);
            // 
            // tsbSendToBack
            // 
            this.tsbSendToBack.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbSendToBack.Image = ((System.Drawing.Image)(resources.GetObject("tsbSendToBack.Image")));
            this.tsbSendToBack.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbSendToBack.Name = "tsbSendToBack";
            this.tsbSendToBack.Size = new System.Drawing.Size(23, 22);
            this.tsbSendToBack.Text = "Send to Back";
            this.tsbSendToBack.Click += new System.EventHandler(this.menuSendToBack_Click);
            // 
            // tsbBringForward
            // 
            this.tsbBringForward.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbBringForward.Image = ((System.Drawing.Image)(resources.GetObject("tsbBringForward.Image")));
            this.tsbBringForward.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbBringForward.Name = "tsbBringForward";
            this.tsbBringForward.Size = new System.Drawing.Size(23, 22);
            this.tsbBringForward.Text = "Bring Forward";
            this.tsbBringForward.Click += new System.EventHandler(this.menuBringForward_Click);
            // 
            // tsbSendBackward
            // 
            this.tsbSendBackward.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbSendBackward.Image = ((System.Drawing.Image)(resources.GetObject("tsbSendBackward.Image")));
            this.tsbSendBackward.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbSendBackward.Name = "tsbSendBackward";
            this.tsbSendBackward.Size = new System.Drawing.Size(23, 22);
            this.tsbSendBackward.Text = "Send Backward";
            this.tsbSendBackward.Click += new System.EventHandler(this.menuSendBackward_Click);
            // 
            // toolStripSplitButton2
            // 
            this.toolStripSplitButton2.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Text;
            this.toolStripSplitButton2.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.leftToolStripMenuItem,
            this.centerHorizontallyToolStripMenuItem,
            this.rightToolStripMenuItem,
            this.toolStripMenuItem13,
            this.topToolStripMenuItem,
            this.centerVerticallyToolStripMenuItem,
            this.bottomToolStripMenuItem,
            this.toolStripMenuItem14,
            this.distributeHorizontallyToolStripMenuItem,
            this.distributeVerticallyToolStripMenuItem});
            this.toolStripSplitButton2.Image = ((System.Drawing.Image)(resources.GetObject("toolStripSplitButton2.Image")));
            this.toolStripSplitButton2.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.toolStripSplitButton2.Name = "toolStripSplitButton2";
            this.toolStripSplitButton2.Size = new System.Drawing.Size(90, 22);
            this.toolStripSplitButton2.Text = "Layout Align";
            // 
            // leftToolStripMenuItem
            // 
            this.leftToolStripMenuItem.Image = ((System.Drawing.Image)(resources.GetObject("leftToolStripMenuItem.Image")));
            this.leftToolStripMenuItem.Name = "leftToolStripMenuItem";
            this.leftToolStripMenuItem.Size = new System.Drawing.Size(183, 22);
            this.leftToolStripMenuItem.Text = "Left";
            this.leftToolStripMenuItem.Click += new System.EventHandler(this.layoutAlign_Click);
            // 
            // centerHorizontallyToolStripMenuItem
            // 
            this.centerHorizontallyToolStripMenuItem.Image = ((System.Drawing.Image)(resources.GetObject("centerHorizontallyToolStripMenuItem.Image")));
            this.centerHorizontallyToolStripMenuItem.Name = "centerHorizontallyToolStripMenuItem";
            this.centerHorizontallyToolStripMenuItem.Size = new System.Drawing.Size(183, 22);
            this.centerHorizontallyToolStripMenuItem.Text = "Center Horizontal";
            this.centerHorizontallyToolStripMenuItem.Click += new System.EventHandler(this.layoutAlign_Click);
            // 
            // rightToolStripMenuItem
            // 
            this.rightToolStripMenuItem.Image = ((System.Drawing.Image)(resources.GetObject("rightToolStripMenuItem.Image")));
            this.rightToolStripMenuItem.Name = "rightToolStripMenuItem";
            this.rightToolStripMenuItem.Size = new System.Drawing.Size(183, 22);
            this.rightToolStripMenuItem.Text = "Right";
            this.rightToolStripMenuItem.Click += new System.EventHandler(this.layoutAlign_Click);
            // 
            // toolStripMenuItem13
            // 
            this.toolStripMenuItem13.Name = "toolStripMenuItem13";
            this.toolStripMenuItem13.Size = new System.Drawing.Size(180, 6);
            // 
            // topToolStripMenuItem
            // 
            this.topToolStripMenuItem.Image = ((System.Drawing.Image)(resources.GetObject("topToolStripMenuItem.Image")));
            this.topToolStripMenuItem.Name = "topToolStripMenuItem";
            this.topToolStripMenuItem.Size = new System.Drawing.Size(183, 22);
            this.topToolStripMenuItem.Text = "Top";
            this.topToolStripMenuItem.Click += new System.EventHandler(this.layoutAlign_Click);
            // 
            // centerVerticallyToolStripMenuItem
            // 
            this.centerVerticallyToolStripMenuItem.Image = ((System.Drawing.Image)(resources.GetObject("centerVerticallyToolStripMenuItem.Image")));
            this.centerVerticallyToolStripMenuItem.Name = "centerVerticallyToolStripMenuItem";
            this.centerVerticallyToolStripMenuItem.Size = new System.Drawing.Size(183, 22);
            this.centerVerticallyToolStripMenuItem.Text = "Center Vertical";
            this.centerVerticallyToolStripMenuItem.Click += new System.EventHandler(this.layoutAlign_Click);
            // 
            // bottomToolStripMenuItem
            // 
            this.bottomToolStripMenuItem.Image = ((System.Drawing.Image)(resources.GetObject("bottomToolStripMenuItem.Image")));
            this.bottomToolStripMenuItem.Name = "bottomToolStripMenuItem";
            this.bottomToolStripMenuItem.Size = new System.Drawing.Size(183, 22);
            this.bottomToolStripMenuItem.Text = "Bottom";
            this.bottomToolStripMenuItem.Click += new System.EventHandler(this.layoutAlign_Click);
            // 
            // toolStripMenuItem14
            // 
            this.toolStripMenuItem14.Name = "toolStripMenuItem14";
            this.toolStripMenuItem14.Size = new System.Drawing.Size(180, 6);
            // 
            // distributeHorizontallyToolStripMenuItem
            // 
            this.distributeHorizontallyToolStripMenuItem.Image = ((System.Drawing.Image)(resources.GetObject("distributeHorizontallyToolStripMenuItem.Image")));
            this.distributeHorizontallyToolStripMenuItem.Name = "distributeHorizontallyToolStripMenuItem";
            this.distributeHorizontallyToolStripMenuItem.Size = new System.Drawing.Size(183, 22);
            this.distributeHorizontallyToolStripMenuItem.Text = "Distribute Horizontal";
            this.distributeHorizontallyToolStripMenuItem.Click += new System.EventHandler(this.layoutAlign_Click);
            // 
            // distributeVerticallyToolStripMenuItem
            // 
            this.distributeVerticallyToolStripMenuItem.Image = ((System.Drawing.Image)(resources.GetObject("distributeVerticallyToolStripMenuItem.Image")));
            this.distributeVerticallyToolStripMenuItem.Name = "distributeVerticallyToolStripMenuItem";
            this.distributeVerticallyToolStripMenuItem.Size = new System.Drawing.Size(183, 22);
            this.distributeVerticallyToolStripMenuItem.Text = "Distribute Vertical";
            this.distributeVerticallyToolStripMenuItem.Click += new System.EventHandler(this.layoutAlign_Click);
            // 
            // tsbSameWidth
            // 
            this.tsbSameWidth.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbSameWidth.Image = ((System.Drawing.Image)(resources.GetObject("tsbSameWidth.Image")));
            this.tsbSameWidth.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbSameWidth.Name = "tsbSameWidth";
            this.tsbSameWidth.Size = new System.Drawing.Size(23, 22);
            this.tsbSameWidth.Text = "Same Width";
            this.tsbSameWidth.Click += new System.EventHandler(this.tsbSameWidth_Click);
            // 
            // tsbSameHeight
            // 
            this.tsbSameHeight.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbSameHeight.Image = ((System.Drawing.Image)(resources.GetObject("tsbSameHeight.Image")));
            this.tsbSameHeight.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbSameHeight.Name = "tsbSameHeight";
            this.tsbSameHeight.Size = new System.Drawing.Size(23, 22);
            this.tsbSameHeight.Text = "Same Height";
            this.tsbSameHeight.Click += new System.EventHandler(this.tsbSameHeight_Click);
            // 
            // toolStripSeparator7
            // 
            this.toolStripSeparator7.Name = "toolStripSeparator7";
            this.toolStripSeparator7.Size = new System.Drawing.Size(6, 25);
            // 
            // tsbExpressions
            // 
            this.tsbExpressions.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbExpressions.Image = ((System.Drawing.Image)(resources.GetObject("tsbExpressions.Image")));
            this.tsbExpressions.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbExpressions.Name = "tsbExpressions";
            this.tsbExpressions.Size = new System.Drawing.Size(23, 22);
            this.tsbExpressions.Text = "Expressions";
            this.tsbExpressions.Click += new System.EventHandler(this.cmdEditExpressions_Click);
            // 
            // toolStripSeparator8
            // 
            this.toolStripSeparator8.Name = "toolStripSeparator8";
            this.toolStripSeparator8.Size = new System.Drawing.Size(6, 25);
            // 
            // tsbZoomIn
            // 
            this.tsbZoomIn.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbZoomIn.Image = ((System.Drawing.Image)(resources.GetObject("tsbZoomIn.Image")));
            this.tsbZoomIn.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbZoomIn.Name = "tsbZoomIn";
            this.tsbZoomIn.Size = new System.Drawing.Size(23, 22);
            this.tsbZoomIn.Text = "Zoom In";
            this.tsbZoomIn.Click += new System.EventHandler(this.tsbZoomIn_Click);
            // 
            // tsbZoomOut
            // 
            this.tsbZoomOut.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbZoomOut.Image = ((System.Drawing.Image)(resources.GetObject("tsbZoomOut.Image")));
            this.tsbZoomOut.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbZoomOut.Name = "tsbZoomOut";
            this.tsbZoomOut.Size = new System.Drawing.Size(23, 22);
            this.tsbZoomOut.Text = "Zoom Out";
            this.tsbZoomOut.Click += new System.EventHandler(this.tsbZoomOut_Click);
            // 
            // tsbZoom100
            // 
            this.tsbZoom100.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbZoom100.Image = ((System.Drawing.Image)(resources.GetObject("tsbZoom100.Image")));
            this.tsbZoom100.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbZoom100.Name = "tsbZoom100";
            this.tsbZoom100.Size = new System.Drawing.Size(23, 22);
            this.tsbZoom100.Text = "Restore Zoom to 100%";
            this.tsbZoom100.Click += new System.EventHandler(this.tsbZoom100_Click);
            // 
            // tsbZoomToLabel
            // 
            this.tsbZoomToLabel.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbZoomToLabel.Image = ((System.Drawing.Image)(resources.GetObject("tsbZoomToLabel.Image")));
            this.tsbZoomToLabel.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbZoomToLabel.Name = "tsbZoomToLabel";
            this.tsbZoomToLabel.Size = new System.Drawing.Size(23, 22);
            this.tsbZoomToLabel.Text = "Zoom to label";
            this.tsbZoomToLabel.Click += new System.EventHandler(this.tsbZoomToLabel_Click);
            // 
            // toolStripSeparator5
            // 
            this.toolStripSeparator5.Name = "toolStripSeparator5";
            this.toolStripSeparator5.Size = new System.Drawing.Size(6, 25);
            // 
            // tsbHelp
            // 
            this.tsbHelp.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbHelp.Image = ((System.Drawing.Image)(resources.GetObject("tsbHelp.Image")));
            this.tsbHelp.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbHelp.Name = "tsbHelp";
            this.tsbHelp.Size = new System.Drawing.Size(23, 22);
            this.tsbHelp.Text = "He&lp";
            this.tsbHelp.Click += new System.EventHandler(this.menuAbout_Click);
            // 
            // contextMenuStrip1
            // 
            this.contextMenuStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.cmCut,
            this.cmCopy,
            this.cmPaste,
            this.cmSep1,
            this.cmFont,
            this.cmSetPicture,
            this.toolStripMenuItem8,
            this.arrangeToolStripMenuItem1,
            this.cmLayoutAlign,
            this.toolStripMenuItem10,
            this.cmGroup,
            this.cmUngroup,
            this.toolStripMenuItem15,
            this.cmLock,
            this.cmUnlock,
            this.toolStripMenuItem11,
            this.cmSelectAll,
            this.cmExpressionSeparator,
            this.cmExpression});
            this.contextMenuStrip1.Name = "contextMenuStrip1";
            this.contextMenuStrip1.Size = new System.Drawing.Size(142, 326);
            // 
            // cmCut
            // 
            this.cmCut.Name = "cmCut";
            this.cmCut.Size = new System.Drawing.Size(141, 22);
            this.cmCut.Text = "Cut";
            this.cmCut.Click += new System.EventHandler(this.menuCut_Click);
            // 
            // cmCopy
            // 
            this.cmCopy.Name = "cmCopy";
            this.cmCopy.Size = new System.Drawing.Size(141, 22);
            this.cmCopy.Text = "Copy";
            this.cmCopy.Click += new System.EventHandler(this.menuCopy_Click);
            // 
            // cmPaste
            // 
            this.cmPaste.Name = "cmPaste";
            this.cmPaste.Size = new System.Drawing.Size(141, 22);
            this.cmPaste.Text = "Paste";
            this.cmPaste.Click += new System.EventHandler(this.menuPaste_Click);
            // 
            // cmSep1
            // 
            this.cmSep1.Name = "cmSep1";
            this.cmSep1.Size = new System.Drawing.Size(138, 6);
            // 
            // cmFont
            // 
            this.cmFont.Name = "cmFont";
            this.cmFont.Size = new System.Drawing.Size(141, 22);
            this.cmFont.Text = "Font...";
            this.cmFont.Click += new System.EventHandler(this.cmFont_Click);
            // 
            // cmSetPicture
            // 
            this.cmSetPicture.Name = "cmSetPicture";
            this.cmSetPicture.Size = new System.Drawing.Size(141, 22);
            this.cmSetPicture.Text = "Set picture...";
            this.cmSetPicture.Click += new System.EventHandler(this.cmSetPicture_Click);
            // 
            // toolStripMenuItem8
            // 
            this.toolStripMenuItem8.Name = "toolStripMenuItem8";
            this.toolStripMenuItem8.Size = new System.Drawing.Size(138, 6);
            // 
            // arrangeToolStripMenuItem1
            // 
            this.arrangeToolStripMenuItem1.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.cmBringForward,
            this.cmSendBackward,
            this.toolStripMenuItem9,
            this.cmBringToFront,
            this.cmSendToBack});
            this.arrangeToolStripMenuItem1.Name = "arrangeToolStripMenuItem1";
            this.arrangeToolStripMenuItem1.Size = new System.Drawing.Size(141, 22);
            this.arrangeToolStripMenuItem1.Text = "Arrange";
            // 
            // cmBringForward
            // 
            this.cmBringForward.Name = "cmBringForward";
            this.cmBringForward.Size = new System.Drawing.Size(154, 22);
            this.cmBringForward.Text = "Bring Forward";
            this.cmBringForward.Click += new System.EventHandler(this.menuBringForward_Click);
            // 
            // cmSendBackward
            // 
            this.cmSendBackward.Name = "cmSendBackward";
            this.cmSendBackward.Size = new System.Drawing.Size(154, 22);
            this.cmSendBackward.Text = "Send Backward";
            this.cmSendBackward.Click += new System.EventHandler(this.menuSendBackward_Click);
            // 
            // toolStripMenuItem9
            // 
            this.toolStripMenuItem9.Name = "toolStripMenuItem9";
            this.toolStripMenuItem9.Size = new System.Drawing.Size(151, 6);
            // 
            // cmBringToFront
            // 
            this.cmBringToFront.Name = "cmBringToFront";
            this.cmBringToFront.Size = new System.Drawing.Size(154, 22);
            this.cmBringToFront.Text = "Bring to Front";
            this.cmBringToFront.Click += new System.EventHandler(this.menuBringToFront_Click);
            // 
            // cmSendToBack
            // 
            this.cmSendToBack.Name = "cmSendToBack";
            this.cmSendToBack.Size = new System.Drawing.Size(154, 22);
            this.cmSendToBack.Text = "Send to Back";
            this.cmSendToBack.Click += new System.EventHandler(this.menuSendToBack_Click);
            // 
            // cmLayoutAlign
            // 
            this.cmLayoutAlign.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.leftToolStripMenuItem1,
            this.centerHorizontalToolStripMenuItem,
            this.rightToolStripMenuItem1,
            this.toolStripMenuItem16,
            this.topToolStripMenuItem1,
            this.centerVerticalToolStripMenuItem,
            this.bottomToolStripMenuItem1,
            this.toolStripMenuItem17,
            this.distributeHorizontalToolStripMenuItem,
            this.distributeVerticalToolStripMenuItem});
            this.cmLayoutAlign.Name = "cmLayoutAlign";
            this.cmLayoutAlign.Size = new System.Drawing.Size(141, 22);
            this.cmLayoutAlign.Text = "Layout Align";
            // 
            // leftToolStripMenuItem1
            // 
            this.leftToolStripMenuItem1.Image = ((System.Drawing.Image)(resources.GetObject("leftToolStripMenuItem1.Image")));
            this.leftToolStripMenuItem1.Name = "leftToolStripMenuItem1";
            this.leftToolStripMenuItem1.Size = new System.Drawing.Size(183, 22);
            this.leftToolStripMenuItem1.Text = "Left";
            this.leftToolStripMenuItem1.Click += new System.EventHandler(this.layoutAlign_Click);
            // 
            // centerHorizontalToolStripMenuItem
            // 
            this.centerHorizontalToolStripMenuItem.Image = ((System.Drawing.Image)(resources.GetObject("centerHorizontalToolStripMenuItem.Image")));
            this.centerHorizontalToolStripMenuItem.Name = "centerHorizontalToolStripMenuItem";
            this.centerHorizontalToolStripMenuItem.Size = new System.Drawing.Size(183, 22);
            this.centerHorizontalToolStripMenuItem.Text = "Center Horizontal";
            this.centerHorizontalToolStripMenuItem.Click += new System.EventHandler(this.layoutAlign_Click);
            // 
            // rightToolStripMenuItem1
            // 
            this.rightToolStripMenuItem1.Image = ((System.Drawing.Image)(resources.GetObject("rightToolStripMenuItem1.Image")));
            this.rightToolStripMenuItem1.Name = "rightToolStripMenuItem1";
            this.rightToolStripMenuItem1.Size = new System.Drawing.Size(183, 22);
            this.rightToolStripMenuItem1.Text = "Right";
            this.rightToolStripMenuItem1.Click += new System.EventHandler(this.layoutAlign_Click);
            // 
            // toolStripMenuItem16
            // 
            this.toolStripMenuItem16.Name = "toolStripMenuItem16";
            this.toolStripMenuItem16.Size = new System.Drawing.Size(180, 6);
            // 
            // topToolStripMenuItem1
            // 
            this.topToolStripMenuItem1.Image = ((System.Drawing.Image)(resources.GetObject("topToolStripMenuItem1.Image")));
            this.topToolStripMenuItem1.Name = "topToolStripMenuItem1";
            this.topToolStripMenuItem1.Size = new System.Drawing.Size(183, 22);
            this.topToolStripMenuItem1.Text = "Top";
            this.topToolStripMenuItem1.Click += new System.EventHandler(this.layoutAlign_Click);
            // 
            // centerVerticalToolStripMenuItem
            // 
            this.centerVerticalToolStripMenuItem.Image = ((System.Drawing.Image)(resources.GetObject("centerVerticalToolStripMenuItem.Image")));
            this.centerVerticalToolStripMenuItem.Name = "centerVerticalToolStripMenuItem";
            this.centerVerticalToolStripMenuItem.Size = new System.Drawing.Size(183, 22);
            this.centerVerticalToolStripMenuItem.Text = "Center Vertical";
            this.centerVerticalToolStripMenuItem.Click += new System.EventHandler(this.layoutAlign_Click);
            // 
            // bottomToolStripMenuItem1
            // 
            this.bottomToolStripMenuItem1.Image = ((System.Drawing.Image)(resources.GetObject("bottomToolStripMenuItem1.Image")));
            this.bottomToolStripMenuItem1.Name = "bottomToolStripMenuItem1";
            this.bottomToolStripMenuItem1.Size = new System.Drawing.Size(183, 22);
            this.bottomToolStripMenuItem1.Text = "Bottom";
            this.bottomToolStripMenuItem1.Click += new System.EventHandler(this.layoutAlign_Click);
            // 
            // toolStripMenuItem17
            // 
            this.toolStripMenuItem17.Name = "toolStripMenuItem17";
            this.toolStripMenuItem17.Size = new System.Drawing.Size(180, 6);
            // 
            // distributeHorizontalToolStripMenuItem
            // 
            this.distributeHorizontalToolStripMenuItem.Image = ((System.Drawing.Image)(resources.GetObject("distributeHorizontalToolStripMenuItem.Image")));
            this.distributeHorizontalToolStripMenuItem.Name = "distributeHorizontalToolStripMenuItem";
            this.distributeHorizontalToolStripMenuItem.Size = new System.Drawing.Size(183, 22);
            this.distributeHorizontalToolStripMenuItem.Text = "Distribute Horizontal";
            this.distributeHorizontalToolStripMenuItem.Click += new System.EventHandler(this.layoutAlign_Click);
            // 
            // distributeVerticalToolStripMenuItem
            // 
            this.distributeVerticalToolStripMenuItem.Image = ((System.Drawing.Image)(resources.GetObject("distributeVerticalToolStripMenuItem.Image")));
            this.distributeVerticalToolStripMenuItem.Name = "distributeVerticalToolStripMenuItem";
            this.distributeVerticalToolStripMenuItem.Size = new System.Drawing.Size(183, 22);
            this.distributeVerticalToolStripMenuItem.Text = "Distribute Vertical";
            this.distributeVerticalToolStripMenuItem.Click += new System.EventHandler(this.layoutAlign_Click);
            // 
            // toolStripMenuItem10
            // 
            this.toolStripMenuItem10.Name = "toolStripMenuItem10";
            this.toolStripMenuItem10.Size = new System.Drawing.Size(138, 6);
            // 
            // cmGroup
            // 
            this.cmGroup.Name = "cmGroup";
            this.cmGroup.Size = new System.Drawing.Size(141, 22);
            this.cmGroup.Text = "Group...";
            this.cmGroup.Click += new System.EventHandler(this.tsbGroup_Click);
            // 
            // cmUngroup
            // 
            this.cmUngroup.Name = "cmUngroup";
            this.cmUngroup.Size = new System.Drawing.Size(141, 22);
            this.cmUngroup.Text = "Ungroup...";
            this.cmUngroup.Click += new System.EventHandler(this.tsbUngroup_Click);
            // 
            // toolStripMenuItem15
            // 
            this.toolStripMenuItem15.Name = "toolStripMenuItem15";
            this.toolStripMenuItem15.Size = new System.Drawing.Size(138, 6);
            // 
            // cmLock
            // 
            this.cmLock.Image = ((System.Drawing.Image)(resources.GetObject("cmLock.Image")));
            this.cmLock.Name = "cmLock";
            this.cmLock.Size = new System.Drawing.Size(141, 22);
            this.cmLock.Text = "Lock";
            this.cmLock.Click += new System.EventHandler(this.cmLockUnlock_Click);
            // 
            // cmUnlock
            // 
            this.cmUnlock.Name = "cmUnlock";
            this.cmUnlock.Size = new System.Drawing.Size(141, 22);
            this.cmUnlock.Text = "Unlock";
            this.cmUnlock.Click += new System.EventHandler(this.cmUnlock_Click);
            // 
            // toolStripMenuItem11
            // 
            this.toolStripMenuItem11.Name = "toolStripMenuItem11";
            this.toolStripMenuItem11.Size = new System.Drawing.Size(138, 6);
            // 
            // cmSelectAll
            // 
            this.cmSelectAll.Name = "cmSelectAll";
            this.cmSelectAll.Size = new System.Drawing.Size(141, 22);
            this.cmSelectAll.Text = "Select All";
            this.cmSelectAll.Click += new System.EventHandler(this.menuSelectAll_Click);
            // 
            // cmExpressionSeparator
            // 
            this.cmExpressionSeparator.Name = "cmExpressionSeparator";
            this.cmExpressionSeparator.Size = new System.Drawing.Size(138, 6);
            // 
            // cmExpression
            // 
            this.cmExpression.Image = ((System.Drawing.Image)(resources.GetObject("cmExpression.Image")));
            this.cmExpression.Name = "cmExpression";
            this.cmExpression.Size = new System.Drawing.Size(141, 22);
            this.cmExpression.Text = "Expression...";
            this.cmExpression.Click += new System.EventHandler(this.cmExpression_Click);
            // 
            // tsbLiteral
            // 
            this.tsbLiteral.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbLiteral.Image = ((System.Drawing.Image)(resources.GetObject("tsbLiteral.Image")));
            this.tsbLiteral.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbLiteral.Name = "tsbLiteral";
            this.tsbLiteral.Size = new System.Drawing.Size(23, 22);
            this.tsbLiteral.Text = "Literal";
            this.tsbLiteral.Click += new System.EventHandler(this.tsbLiteral_Click);
            // 
            // MainForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1122, 570);
            this.Controls.Add(this.toolStripContainer1);
            this.MainMenuStrip = this.menuStrip1;
            this.Name = "MainForm";
            this.Text = "Neodynamic ThermalLabel Editor v14 for Windows (C#)";
            this.WindowState = System.Windows.Forms.FormWindowState.Maximized;
            this.Load += new System.EventHandler(this.Form1_Load);
            this.toolStripContainer1.BottomToolStripPanel.ResumeLayout(false);
            this.toolStripContainer1.BottomToolStripPanel.PerformLayout();
            this.toolStripContainer1.ContentPanel.ResumeLayout(false);
            this.toolStripContainer1.TopToolStripPanel.ResumeLayout(false);
            this.toolStripContainer1.TopToolStripPanel.PerformLayout();
            this.toolStripContainer1.ResumeLayout(false);
            this.toolStripContainer1.PerformLayout();
            this.statusStrip1.ResumeLayout(false);
            this.statusStrip1.PerformLayout();
            this.splitContainer1.Panel1.ResumeLayout(false);
            this.splitContainer1.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.splitContainer1)).EndInit();
            this.splitContainer1.ResumeLayout(false);
            this.tabMain.ResumeLayout(false);
            this.tabPreview.ResumeLayout(false);
            this.tabPreview.PerformLayout();
            this.toolStrip2.ResumeLayout(false);
            this.toolStrip2.PerformLayout();
            this.tabControl1.ResumeLayout(false);
            this.tabProperties.ResumeLayout(false);
            this.pnlBarcodeSymbology.ResumeLayout(false);
            this.pnlBarcodeSymbology.PerformLayout();
            this.tabDataSource.ResumeLayout(false);
            this.tabDataSource.PerformLayout();
            this.tabExpressions.ResumeLayout(false);
            this.tabExpressions.PerformLayout();
            this.menuStrip1.ResumeLayout(false);
            this.menuStrip1.PerformLayout();
            this.toolStrip1.ResumeLayout(false);
            this.toolStrip1.PerformLayout();
            this.contextMenuStrip1.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.ToolStripContainer toolStripContainer1;
        private System.Windows.Forms.StatusStrip statusStrip1;
        private System.Windows.Forms.SplitContainer splitContainer1;
        private System.Windows.Forms.MenuStrip menuStrip1;
        private System.Windows.Forms.ToolStripMenuItem fileToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem editToolStripMenuItem;
        private System.Windows.Forms.ToolStrip toolStrip1;
        private System.Windows.Forms.ToolStripButton tsbNew;
        private System.Windows.Forms.ToolStripButton tsbOpen;
        private System.Windows.Forms.ToolStripButton tsbSave;
        private System.Windows.Forms.ToolStripButton tsbPrint;
        private System.Windows.Forms.ToolStripSeparator toolStripSeparator;
        private System.Windows.Forms.ToolStripButton tsbCut;
        private System.Windows.Forms.ToolStripButton tsbCopy;
        private System.Windows.Forms.ToolStripButton tsbPaste;
        private System.Windows.Forms.ToolStripSeparator toolStripSeparator1;
        private System.Windows.Forms.ToolStripButton tsbHelp;
        private System.Windows.Forms.PropertyGrid propertyGrid1;
        private System.Windows.Forms.ToolStripStatusLabel lblSelectionInfo;
        private System.Windows.Forms.ToolStripButton tsbUndo;
        private System.Windows.Forms.ToolStripButton tsbRedo;
        private System.Windows.Forms.ToolStripButton tsbPointer;
        private System.Windows.Forms.ToolStripButton txbRect;
        private System.Windows.Forms.ToolStripButton tsbEllipse;
        private System.Windows.Forms.ToolStripButton tsbLine;
        private System.Windows.Forms.ToolStripButton tsbText;
        private System.Windows.Forms.ToolStripSeparator toolStripSeparator2;
        private System.Windows.Forms.ToolStripButton tsbPicture;
        private System.Windows.Forms.ToolStripButton tsbBringToFront;
        private System.Windows.Forms.ToolStripSeparator toolStripSeparator3;
        private System.Windows.Forms.ToolStripButton tsbSendToBack;
        private System.Windows.Forms.ToolStripButton tsbBringForward;
        private System.Windows.Forms.ToolStripButton tsbSendBackward;
        private System.Windows.Forms.ToolStripButton tsbZoomIn;
        private System.Windows.Forms.ToolStripButton tsbZoomOut;
        private System.Windows.Forms.ToolStripButton tsbZoom100;
        private System.Windows.Forms.ToolStripSeparator toolStripSeparator5;
        private System.Windows.Forms.ToolStripMenuItem menuNew;
        private System.Windows.Forms.ToolStripMenuItem menuOpen;
        private System.Windows.Forms.ToolStripMenuItem menuSave;
        private System.Windows.Forms.ToolStripSeparator toolStripMenuItem1;
        private System.Windows.Forms.ToolStripMenuItem menuLabelSetup;
        private System.Windows.Forms.ToolStripSeparator toolStripMenuItem2;
        private System.Windows.Forms.ToolStripSeparator toolStripMenuItem3;
        private System.Windows.Forms.ToolStripMenuItem menuPrint;
        private System.Windows.Forms.ToolStripSeparator toolStripMenuItem4;
        private System.Windows.Forms.ToolStripMenuItem menuExportToPdf;
        private System.Windows.Forms.ToolStripMenuItem menuUndo;
        private System.Windows.Forms.ToolStripMenuItem menuRedo;
        private System.Windows.Forms.ToolStripSeparator toolStripMenuItem5;
        private System.Windows.Forms.ToolStripMenuItem menuCut;
        private System.Windows.Forms.ToolStripMenuItem menuCopy;
        private System.Windows.Forms.ToolStripMenuItem menuPaste;
        private System.Windows.Forms.ToolStripSeparator toolStripMenuItem6;
        private System.Windows.Forms.ToolStripMenuItem menuSelectAll;
        private System.Windows.Forms.ToolStripMenuItem menuDeleteAll;
        private System.Windows.Forms.ToolStripMenuItem helpToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem menuAbout;
        private System.Windows.Forms.ToolStripMenuItem arrangeToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem menuBringForward;
        private System.Windows.Forms.ToolStripMenuItem menuSendBackward;
        private System.Windows.Forms.ToolStripSeparator toolStripMenuItem7;
        private System.Windows.Forms.ToolStripMenuItem menuBringToFront;
        private System.Windows.Forms.ToolStripMenuItem menuSendToBack;
        private System.Windows.Forms.ContextMenuStrip contextMenuStrip1;
        private System.Windows.Forms.ToolStripMenuItem cmCut;
        private System.Windows.Forms.ToolStripMenuItem cmCopy;
        private System.Windows.Forms.ToolStripMenuItem cmPaste;
        private System.Windows.Forms.ToolStripSeparator toolStripMenuItem8;
        private System.Windows.Forms.ToolStripMenuItem arrangeToolStripMenuItem1;
        private System.Windows.Forms.ToolStripMenuItem cmBringForward;
        private System.Windows.Forms.ToolStripMenuItem cmSendBackward;
        private System.Windows.Forms.ToolStripSeparator toolStripMenuItem9;
        private System.Windows.Forms.ToolStripMenuItem cmBringToFront;
        private System.Windows.Forms.ToolStripMenuItem cmSendToBack;
        private System.Windows.Forms.ToolStripSeparator toolStripMenuItem10;
        private System.Windows.Forms.ToolStripMenuItem cmSelectAll;
        private System.Windows.Forms.ToolStripSeparator cmSep1;
        private System.Windows.Forms.ToolStripMenuItem cmSetPicture;
        private System.Windows.Forms.ToolStripMenuItem cmFont;
        private System.Windows.Forms.ToolStripMenuItem menuClose;
        private System.Windows.Forms.ToolStripSeparator toolStripSeparator6;
        private System.Windows.Forms.ToolStripButton tsbRFID;
        private System.Windows.Forms.ToolStripMenuItem cmLock;
        private System.Windows.Forms.ToolStripSeparator toolStripMenuItem11;
        private System.Windows.Forms.ToolStripMenuItem viewToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem menuViewOptions;
        private System.Windows.Forms.ToolStripSeparator toolStripMenuItem12;
        private System.Windows.Forms.ToolStripMenuItem menuLockUnlock;
        private System.Windows.Forms.ToolStripSeparator toolStripSeparator7;
        private System.Windows.Forms.ToolStripMenuItem toolsToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem menuUploadTTFToPrinterStorageToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem menuManageFontsInPrinterStorageToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem menuUnlockSelectedItems;
        private System.Windows.Forms.ToolStripMenuItem cmUnlock;
        private System.Windows.Forms.ToolStripMenuItem menuExportToJPG;
        private System.Windows.Forms.ToolStripMenuItem menuExportToPNG;
        private System.Windows.Forms.ToolStripMenuItem menuExportToSVG;
        private System.Windows.Forms.ToolStripSeparator cmExpressionSeparator;
        private System.Windows.Forms.ToolStripMenuItem cmExpression;
        private System.Windows.Forms.TabControl tabControl1;
        private System.Windows.Forms.TabPage tabProperties;
        private System.Windows.Forms.TabPage tabDataSource;
        private System.Windows.Forms.Button cmdUseEmbeddedSample;
        private System.Windows.Forms.Button cmdRemoveDataSource;
        private System.Windows.Forms.ListBox lstDataFields;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Button cmdDataSourceFile;
        private System.Windows.Forms.TextBox txtDataSourceFile;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TabControl tabMain;
        private System.Windows.Forms.TabPage tabDesign;
        private System.Windows.Forms.TabPage tabPreview;
        private System.Windows.Forms.ToolStrip toolStrip2;
        private System.Windows.Forms.ToolStripLabel toolStripLabel1;
        private System.Windows.Forms.ToolStripComboBox cmdPreviewResolution;
        private System.Windows.Forms.ToolStripSeparator toolStripSeparator4;
        private System.Windows.Forms.ToolStripLabel toolStripLabel2;
        private System.Windows.Forms.ToolStripTextBox txtPreviewCopies;
        private System.Windows.Forms.ImageList imageList1;
        private System.Windows.Forms.ToolStripSplitButton toolStripSplitButton1;
        private System.Windows.Forms.ToolStripMenuItem numeric5digitsToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem phoneNumberToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem uSShortDateToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem uSShortDateAndTimeToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem uSTimeToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem uSZipCodeToolStripMenuItem;
        private System.Windows.Forms.TextBox txtDataSourceContent;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.TabPage tabGallery;
        private System.Windows.Forms.Panel pnlBarcodeSymbology;
        private System.Windows.Forms.ComboBox cboBarcodeSymbologies;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.ToolStripMenuItem menuExportToHtml;
        private System.Windows.Forms.TabPage tabExpressions;
        private System.Windows.Forms.TextBox txtLabelExpressions;
        private System.Windows.Forms.Button cmdEditExpressions;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.WebBrowser webBrowser1;
        private System.Windows.Forms.Button cmdSetBarcodeSampleCode;
        private System.Windows.Forms.ToolStripButton tsbExpressions;
        private System.Windows.Forms.ToolStripSplitButton toolStripSplitButton2;
        private System.Windows.Forms.ToolStripMenuItem leftToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem centerHorizontallyToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem rightToolStripMenuItem;
        private System.Windows.Forms.ToolStripSeparator toolStripMenuItem13;
        private System.Windows.Forms.ToolStripMenuItem topToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem centerVerticallyToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem bottomToolStripMenuItem;
        private System.Windows.Forms.ToolStripSeparator toolStripMenuItem14;
        private System.Windows.Forms.ToolStripMenuItem distributeHorizontallyToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem distributeVerticallyToolStripMenuItem;
        private System.Windows.Forms.ToolStripSeparator toolStripSeparator8;
        private System.Windows.Forms.ToolStripMenuItem cmLayoutAlign;
        private System.Windows.Forms.ToolStripMenuItem leftToolStripMenuItem1;
        private System.Windows.Forms.ToolStripMenuItem centerHorizontalToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem rightToolStripMenuItem1;
        private System.Windows.Forms.ToolStripSeparator toolStripMenuItem16;
        private System.Windows.Forms.ToolStripMenuItem topToolStripMenuItem1;
        private System.Windows.Forms.ToolStripMenuItem centerVerticalToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem bottomToolStripMenuItem1;
        private System.Windows.Forms.ToolStripSeparator toolStripMenuItem17;
        private System.Windows.Forms.ToolStripMenuItem distributeHorizontalToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem distributeVerticalToolStripMenuItem;
        private System.Windows.Forms.ToolStripButton tsbArcText;
        private System.Windows.Forms.ToolStripButton tsbOutlineText;
        private System.Windows.Forms.ToolStripSplitButton tssbLinearBarcodes;
        private System.Windows.Forms.ToolStripSplitButton tssb2DBarcodes;
        private System.Windows.Forms.ToolStripButton tsbResidentText;
        private System.Windows.Forms.ToolStripDropDownButton tsddbSymbols;
        private System.Windows.Forms.ToolStripButton tsbGroup;
        private System.Windows.Forms.ToolStripButton tsbUngroup;
        private System.Windows.Forms.ToolStripMenuItem cmGroup;
        private System.Windows.Forms.ToolStripMenuItem cmUngroup;
        private System.Windows.Forms.ToolStripSeparator toolStripMenuItem15;
        private System.Windows.Forms.ToolStripSeparator toolStripMenuItem18;
        private System.Windows.Forms.ToolStripMenuItem menuViewRotate;
        private System.Windows.Forms.ToolStripMenuItem menuViewRotateNone;
        private System.Windows.Forms.ToolStripMenuItem menuViewRotate90;
        private System.Windows.Forms.ToolStripMenuItem menuViewRotate180;
        private System.Windows.Forms.ToolStripMenuItem menuViewRotate270;
        private System.Windows.Forms.ToolStripButton tsbSameWidth;
        private System.Windows.Forms.ToolStripButton tsbSameHeight;
        private System.Windows.Forms.ToolStripButton tsbZoomToLabel;
        private System.Windows.Forms.ToolStripDropDownButton tsbInsertTable;
        private System.Windows.Forms.ToolStripButton tsbRepeater;
        private System.Windows.Forms.ToolStripButton tsbLiteral;
    }
}

