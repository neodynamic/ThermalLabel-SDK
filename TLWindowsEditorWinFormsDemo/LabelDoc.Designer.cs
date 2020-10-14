namespace TLWindowsEditorWinFormsDemo
{
    partial class LabelDoc
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
            this.label1 = new System.Windows.Forms.Label();
            this.cboUnit = new System.Windows.Forms.ComboBox();
            this.label2 = new System.Windows.Forms.Label();
            this.nudWidth = new System.Windows.Forms.NumericUpDown();
            this.nudHeight = new System.Windows.Forms.NumericUpDown();
            this.label3 = new System.Windows.Forms.Label();
            this.button1 = new System.Windows.Forms.Button();
            this.button2 = new System.Windows.Forms.Button();
            this.gbLabel = new System.Windows.Forms.GroupBox();
            this.gbVLayout = new System.Windows.Forms.GroupBox();
            this.label5 = new System.Windows.Forms.Label();
            this.nudMarkLength = new System.Windows.Forms.NumericUpDown();
            this.label4 = new System.Windows.Forms.Label();
            this.nudGapLength = new System.Windows.Forms.NumericUpDown();
            this.chkIsContinuous = new System.Windows.Forms.CheckBox();
            this.gbPrintOptions = new System.Windows.Forms.GroupBox();
            this.chkCutAfterPrinting = new System.Windows.Forms.CheckBox();
            this.txtPrintSpeed = new System.Windows.Forms.TextBox();
            this.label6 = new System.Windows.Forms.Label();
            this.chkPrintMirror = new System.Windows.Forms.CheckBox();
            this.tabLabelType = new System.Windows.Forms.TabControl();
            this.tabRollSingleLabel = new System.Windows.Forms.TabPage();
            this.tabRollMulticolLabels = new System.Windows.Forms.TabPage();
            this.tabSheetLabels = new System.Windows.Forms.TabPage();
            this.picRollSingleLabels = new System.Windows.Forms.PictureBox();
            this.picRollMulticolumnLabels = new System.Windows.Forms.PictureBox();
            this.picSheetLabels = new System.Windows.Forms.PictureBox();
            this.flowLayoutPanel1 = new System.Windows.Forms.FlowLayoutPanel();
            this.gbGeneral = new System.Windows.Forms.GroupBox();
            this.gbHLayout = new System.Windows.Forms.GroupBox();
            this.label7 = new System.Windows.Forms.Label();
            this.nudHorizGapLength = new System.Windows.Forms.NumericUpDown();
            this.label8 = new System.Windows.Forms.Label();
            this.nudLabelsPerRow = new System.Windows.Forms.NumericUpDown();
            this.gbSheet = new System.Windows.Forms.GroupBox();
            this.label9 = new System.Windows.Forms.Label();
            this.nudSheetHeight = new System.Windows.Forms.NumericUpDown();
            this.nudSheetWidth = new System.Windows.Forms.NumericUpDown();
            this.label10 = new System.Windows.Forms.Label();
            this.label11 = new System.Windows.Forms.Label();
            this.nudSheetLabelsMarginTop = new System.Windows.Forms.NumericUpDown();
            this.nudSheetLabelsMarginLeft = new System.Windows.Forms.NumericUpDown();
            this.label12 = new System.Windows.Forms.Label();
            this.label13 = new System.Windows.Forms.Label();
            this.nudSheetLabelsCount = new System.Windows.Forms.NumericUpDown();
            ((System.ComponentModel.ISupportInitialize)(this.nudWidth)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudHeight)).BeginInit();
            this.gbLabel.SuspendLayout();
            this.gbVLayout.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.nudMarkLength)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudGapLength)).BeginInit();
            this.gbPrintOptions.SuspendLayout();
            this.tabLabelType.SuspendLayout();
            this.tabRollSingleLabel.SuspendLayout();
            this.tabRollMulticolLabels.SuspendLayout();
            this.tabSheetLabels.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.picRollSingleLabels)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.picRollMulticolumnLabels)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.picSheetLabels)).BeginInit();
            this.flowLayoutPanel1.SuspendLayout();
            this.gbGeneral.SuspendLayout();
            this.gbHLayout.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.nudHorizGapLength)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudLabelsPerRow)).BeginInit();
            this.gbSheet.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.nudSheetHeight)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudSheetWidth)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudSheetLabelsMarginTop)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudSheetLabelsMarginLeft)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudSheetLabelsCount)).BeginInit();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(15, 22);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(29, 13);
            this.label1.TabIndex = 0;
            this.label1.Text = "Unit:";
            // 
            // cboUnit
            // 
            this.cboUnit.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboUnit.FormattingEnabled = true;
            this.cboUnit.Location = new System.Drawing.Point(50, 19);
            this.cboUnit.Name = "cboUnit";
            this.cboUnit.Size = new System.Drawing.Size(276, 21);
            this.cboUnit.TabIndex = 1;
            this.cboUnit.SelectedIndexChanged += new System.EventHandler(this.cboUnit_SelectedIndexChanged);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(34, 24);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(38, 13);
            this.label2.TabIndex = 2;
            this.label2.Text = "Width:";
            // 
            // nudWidth
            // 
            this.nudWidth.DecimalPlaces = 4;
            this.nudWidth.Location = new System.Drawing.Point(78, 22);
            this.nudWidth.Maximum = new decimal(new int[] {
            10000,
            0,
            0,
            0});
            this.nudWidth.Name = "nudWidth";
            this.nudWidth.Size = new System.Drawing.Size(82, 20);
            this.nudWidth.TabIndex = 3;
            // 
            // nudHeight
            // 
            this.nudHeight.DecimalPlaces = 4;
            this.nudHeight.Location = new System.Drawing.Point(244, 22);
            this.nudHeight.Maximum = new decimal(new int[] {
            10000,
            0,
            0,
            0});
            this.nudHeight.Name = "nudHeight";
            this.nudHeight.Size = new System.Drawing.Size(82, 20);
            this.nudHeight.TabIndex = 5;
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(200, 24);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(41, 13);
            this.label3.TabIndex = 4;
            this.label3.Text = "Height:";
            // 
            // button1
            // 
            this.button1.DialogResult = System.Windows.Forms.DialogResult.OK;
            this.button1.Location = new System.Drawing.Point(575, 433);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(75, 23);
            this.button1.TabIndex = 3;
            this.button1.Text = "&OK";
            this.button1.UseVisualStyleBackColor = true;
            // 
            // button2
            // 
            this.button2.DialogResult = System.Windows.Forms.DialogResult.Cancel;
            this.button2.Location = new System.Drawing.Point(683, 433);
            this.button2.Name = "button2";
            this.button2.Size = new System.Drawing.Size(75, 23);
            this.button2.TabIndex = 4;
            this.button2.Text = "&Cancel";
            this.button2.UseVisualStyleBackColor = true;
            // 
            // gbLabel
            // 
            this.gbLabel.Controls.Add(this.label2);
            this.gbLabel.Controls.Add(this.nudHeight);
            this.gbLabel.Controls.Add(this.nudWidth);
            this.gbLabel.Controls.Add(this.label3);
            this.gbLabel.Location = new System.Drawing.Point(3, 3);
            this.gbLabel.Name = "gbLabel";
            this.gbLabel.Size = new System.Drawing.Size(337, 58);
            this.gbLabel.TabIndex = 0;
            this.gbLabel.TabStop = false;
            this.gbLabel.Text = "Label";
            // 
            // gbVLayout
            // 
            this.gbVLayout.Controls.Add(this.label5);
            this.gbVLayout.Controls.Add(this.nudMarkLength);
            this.gbVLayout.Controls.Add(this.label4);
            this.gbVLayout.Controls.Add(this.nudGapLength);
            this.gbVLayout.Controls.Add(this.chkIsContinuous);
            this.gbVLayout.Location = new System.Drawing.Point(3, 67);
            this.gbVLayout.Name = "gbVLayout";
            this.gbVLayout.Size = new System.Drawing.Size(337, 86);
            this.gbVLayout.TabIndex = 1;
            this.gbVLayout.TabStop = false;
            this.gbVLayout.Text = "Vertical Layout";
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(174, 53);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(70, 13);
            this.label5.TabIndex = 6;
            this.label5.Text = "Mark Length:";
            // 
            // nudMarkLength
            // 
            this.nudMarkLength.DecimalPlaces = 4;
            this.nudMarkLength.Location = new System.Drawing.Point(244, 51);
            this.nudMarkLength.Maximum = new decimal(new int[] {
            10000,
            0,
            0,
            0});
            this.nudMarkLength.Name = "nudMarkLength";
            this.nudMarkLength.Size = new System.Drawing.Size(82, 20);
            this.nudMarkLength.TabIndex = 7;
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(12, 53);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(66, 13);
            this.label4.TabIndex = 4;
            this.label4.Text = "Gap Length:";
            // 
            // nudGapLength
            // 
            this.nudGapLength.DecimalPlaces = 4;
            this.nudGapLength.Location = new System.Drawing.Point(78, 51);
            this.nudGapLength.Maximum = new decimal(new int[] {
            10000,
            0,
            0,
            0});
            this.nudGapLength.Name = "nudGapLength";
            this.nudGapLength.Size = new System.Drawing.Size(82, 20);
            this.nudGapLength.TabIndex = 5;
            // 
            // chkIsContinuous
            // 
            this.chkIsContinuous.AutoSize = true;
            this.chkIsContinuous.Location = new System.Drawing.Point(18, 21);
            this.chkIsContinuous.Name = "chkIsContinuous";
            this.chkIsContinuous.Size = new System.Drawing.Size(96, 17);
            this.chkIsContinuous.TabIndex = 0;
            this.chkIsContinuous.Text = "Is Continuous?";
            this.chkIsContinuous.UseVisualStyleBackColor = true;
            this.chkIsContinuous.CheckedChanged += new System.EventHandler(this.chkIsContinuous_CheckedChanged);
            // 
            // gbPrintOptions
            // 
            this.gbPrintOptions.Controls.Add(this.chkCutAfterPrinting);
            this.gbPrintOptions.Controls.Add(this.txtPrintSpeed);
            this.gbPrintOptions.Controls.Add(this.label6);
            this.gbPrintOptions.Controls.Add(this.chkPrintMirror);
            this.gbPrintOptions.Location = new System.Drawing.Point(3, 221);
            this.gbPrintOptions.Name = "gbPrintOptions";
            this.gbPrintOptions.Size = new System.Drawing.Size(337, 85);
            this.gbPrintOptions.TabIndex = 3;
            this.gbPrintOptions.TabStop = false;
            this.gbPrintOptions.Text = "Print Options";
            // 
            // chkCutAfterPrinting
            // 
            this.chkCutAfterPrinting.AutoSize = true;
            this.chkCutAfterPrinting.Location = new System.Drawing.Point(18, 54);
            this.chkCutAfterPrinting.Name = "chkCutAfterPrinting";
            this.chkCutAfterPrinting.Size = new System.Drawing.Size(105, 17);
            this.chkCutAfterPrinting.TabIndex = 10;
            this.chkCutAfterPrinting.Text = "Cut After Printing";
            this.chkCutAfterPrinting.UseVisualStyleBackColor = true;
            // 
            // txtPrintSpeed
            // 
            this.txtPrintSpeed.Location = new System.Drawing.Point(219, 19);
            this.txtPrintSpeed.Name = "txtPrintSpeed";
            this.txtPrintSpeed.Size = new System.Drawing.Size(107, 20);
            this.txtPrintSpeed.TabIndex = 9;
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(151, 22);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(65, 13);
            this.label6.TabIndex = 8;
            this.label6.Text = "Print Speed:";
            // 
            // chkPrintMirror
            // 
            this.chkPrintMirror.AutoSize = true;
            this.chkPrintMirror.Location = new System.Drawing.Point(18, 21);
            this.chkPrintMirror.Name = "chkPrintMirror";
            this.chkPrintMirror.Size = new System.Drawing.Size(91, 17);
            this.chkPrintMirror.TabIndex = 0;
            this.chkPrintMirror.Text = "Print As Mirror";
            this.chkPrintMirror.UseVisualStyleBackColor = true;
            // 
            // tabLabelType
            // 
            this.tabLabelType.Controls.Add(this.tabRollSingleLabel);
            this.tabLabelType.Controls.Add(this.tabRollMulticolLabels);
            this.tabLabelType.Controls.Add(this.tabSheetLabels);
            this.tabLabelType.Location = new System.Drawing.Point(12, 12);
            this.tabLabelType.Name = "tabLabelType";
            this.tabLabelType.SelectedIndex = 0;
            this.tabLabelType.Size = new System.Drawing.Size(400, 387);
            this.tabLabelType.TabIndex = 0;
            this.tabLabelType.SelectedIndexChanged += new System.EventHandler(this.tabControl1_SelectedIndexChanged);
            // 
            // tabRollSingleLabel
            // 
            this.tabRollSingleLabel.Controls.Add(this.picRollSingleLabels);
            this.tabRollSingleLabel.Location = new System.Drawing.Point(4, 22);
            this.tabRollSingleLabel.Name = "tabRollSingleLabel";
            this.tabRollSingleLabel.Padding = new System.Windows.Forms.Padding(3);
            this.tabRollSingleLabel.Size = new System.Drawing.Size(392, 361);
            this.tabRollSingleLabel.TabIndex = 0;
            this.tabRollSingleLabel.Text = "Roll - Single Labels";
            this.tabRollSingleLabel.UseVisualStyleBackColor = true;
            // 
            // tabRollMulticolLabels
            // 
            this.tabRollMulticolLabels.Controls.Add(this.picRollMulticolumnLabels);
            this.tabRollMulticolLabels.Location = new System.Drawing.Point(4, 22);
            this.tabRollMulticolLabels.Name = "tabRollMulticolLabels";
            this.tabRollMulticolLabels.Padding = new System.Windows.Forms.Padding(3);
            this.tabRollMulticolLabels.Size = new System.Drawing.Size(392, 361);
            this.tabRollMulticolLabels.TabIndex = 1;
            this.tabRollMulticolLabels.Text = "Roll - Multicolumn Labels";
            this.tabRollMulticolLabels.UseVisualStyleBackColor = true;
            // 
            // tabSheetLabels
            // 
            this.tabSheetLabels.Controls.Add(this.picSheetLabels);
            this.tabSheetLabels.Location = new System.Drawing.Point(4, 22);
            this.tabSheetLabels.Name = "tabSheetLabels";
            this.tabSheetLabels.Size = new System.Drawing.Size(392, 361);
            this.tabSheetLabels.TabIndex = 2;
            this.tabSheetLabels.Text = "Sheet Labels";
            this.tabSheetLabels.UseVisualStyleBackColor = true;
            // 
            // picRollSingleLabels
            // 
            this.picRollSingleLabels.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.picRollSingleLabels.Location = new System.Drawing.Point(6, 6);
            this.picRollSingleLabels.Name = "picRollSingleLabels";
            this.picRollSingleLabels.Size = new System.Drawing.Size(380, 349);
            this.picRollSingleLabels.SizeMode = System.Windows.Forms.PictureBoxSizeMode.CenterImage;
            this.picRollSingleLabels.TabIndex = 11;
            this.picRollSingleLabels.TabStop = false;
            // 
            // picRollMulticolumnLabels
            // 
            this.picRollMulticolumnLabels.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.picRollMulticolumnLabels.Location = new System.Drawing.Point(6, 6);
            this.picRollMulticolumnLabels.Name = "picRollMulticolumnLabels";
            this.picRollMulticolumnLabels.Size = new System.Drawing.Size(380, 349);
            this.picRollMulticolumnLabels.SizeMode = System.Windows.Forms.PictureBoxSizeMode.CenterImage;
            this.picRollMulticolumnLabels.TabIndex = 12;
            this.picRollMulticolumnLabels.TabStop = false;
            // 
            // picSheetLabels
            // 
            this.picSheetLabels.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.picSheetLabels.Location = new System.Drawing.Point(6, 6);
            this.picSheetLabels.Name = "picSheetLabels";
            this.picSheetLabels.Size = new System.Drawing.Size(380, 349);
            this.picSheetLabels.SizeMode = System.Windows.Forms.PictureBoxSizeMode.CenterImage;
            this.picSheetLabels.TabIndex = 13;
            this.picSheetLabels.TabStop = false;
            // 
            // flowLayoutPanel1
            // 
            this.flowLayoutPanel1.AutoScroll = true;
            this.flowLayoutPanel1.Controls.Add(this.gbLabel);
            this.flowLayoutPanel1.Controls.Add(this.gbVLayout);
            this.flowLayoutPanel1.Controls.Add(this.gbHLayout);
            this.flowLayoutPanel1.Controls.Add(this.gbPrintOptions);
            this.flowLayoutPanel1.Controls.Add(this.gbSheet);
            this.flowLayoutPanel1.FlowDirection = System.Windows.Forms.FlowDirection.TopDown;
            this.flowLayoutPanel1.Location = new System.Drawing.Point(429, 67);
            this.flowLayoutPanel1.Name = "flowLayoutPanel1";
            this.flowLayoutPanel1.Size = new System.Drawing.Size(364, 351);
            this.flowLayoutPanel1.TabIndex = 2;
            // 
            // gbGeneral
            // 
            this.gbGeneral.Controls.Add(this.cboUnit);
            this.gbGeneral.Controls.Add(this.label1);
            this.gbGeneral.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.gbGeneral.Location = new System.Drawing.Point(432, 12);
            this.gbGeneral.Name = "gbGeneral";
            this.gbGeneral.Size = new System.Drawing.Size(337, 49);
            this.gbGeneral.TabIndex = 1;
            this.gbGeneral.TabStop = false;
            this.gbGeneral.Text = "General";
            // 
            // gbHLayout
            // 
            this.gbHLayout.Controls.Add(this.label8);
            this.gbHLayout.Controls.Add(this.nudLabelsPerRow);
            this.gbHLayout.Controls.Add(this.label7);
            this.gbHLayout.Controls.Add(this.nudHorizGapLength);
            this.gbHLayout.Location = new System.Drawing.Point(3, 159);
            this.gbHLayout.Name = "gbHLayout";
            this.gbHLayout.Size = new System.Drawing.Size(337, 56);
            this.gbHLayout.TabIndex = 2;
            this.gbHLayout.TabStop = false;
            this.gbHLayout.Text = "Horizontal Layout";
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(12, 26);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(66, 13);
            this.label7.TabIndex = 6;
            this.label7.Text = "Gap Length:";
            // 
            // nudHorizGapLength
            // 
            this.nudHorizGapLength.DecimalPlaces = 4;
            this.nudHorizGapLength.Location = new System.Drawing.Point(78, 24);
            this.nudHorizGapLength.Maximum = new decimal(new int[] {
            10000,
            0,
            0,
            0});
            this.nudHorizGapLength.Name = "nudHorizGapLength";
            this.nudHorizGapLength.Size = new System.Drawing.Size(82, 20);
            this.nudHorizGapLength.TabIndex = 7;
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Location = new System.Drawing.Point(174, 26);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(85, 13);
            this.label8.TabIndex = 8;
            this.label8.Text = "Labels Per Row:";
            // 
            // nudLabelsPerRow
            // 
            this.nudLabelsPerRow.Location = new System.Drawing.Point(262, 24);
            this.nudLabelsPerRow.Maximum = new decimal(new int[] {
            10000,
            0,
            0,
            0});
            this.nudLabelsPerRow.Name = "nudLabelsPerRow";
            this.nudLabelsPerRow.Size = new System.Drawing.Size(64, 20);
            this.nudLabelsPerRow.TabIndex = 9;
            this.nudLabelsPerRow.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            // 
            // gbSheet
            // 
            this.gbSheet.Controls.Add(this.label13);
            this.gbSheet.Controls.Add(this.nudSheetLabelsCount);
            this.gbSheet.Controls.Add(this.label11);
            this.gbSheet.Controls.Add(this.nudSheetLabelsMarginTop);
            this.gbSheet.Controls.Add(this.nudSheetLabelsMarginLeft);
            this.gbSheet.Controls.Add(this.label12);
            this.gbSheet.Controls.Add(this.label9);
            this.gbSheet.Controls.Add(this.nudSheetHeight);
            this.gbSheet.Controls.Add(this.nudSheetWidth);
            this.gbSheet.Controls.Add(this.label10);
            this.gbSheet.Location = new System.Drawing.Point(346, 3);
            this.gbSheet.Name = "gbSheet";
            this.gbSheet.Size = new System.Drawing.Size(337, 116);
            this.gbSheet.TabIndex = 4;
            this.gbSheet.TabStop = false;
            this.gbSheet.Text = "Sheet";
            // 
            // label9
            // 
            this.label9.AutoSize = true;
            this.label9.Location = new System.Drawing.Point(38, 22);
            this.label9.Name = "label9";
            this.label9.Size = new System.Drawing.Size(38, 13);
            this.label9.TabIndex = 6;
            this.label9.Text = "Width:";
            // 
            // nudSheetHeight
            // 
            this.nudSheetHeight.DecimalPlaces = 4;
            this.nudSheetHeight.Location = new System.Drawing.Point(244, 20);
            this.nudSheetHeight.Maximum = new decimal(new int[] {
            10000,
            0,
            0,
            0});
            this.nudSheetHeight.Name = "nudSheetHeight";
            this.nudSheetHeight.Size = new System.Drawing.Size(82, 20);
            this.nudSheetHeight.TabIndex = 9;
            // 
            // nudSheetWidth
            // 
            this.nudSheetWidth.DecimalPlaces = 4;
            this.nudSheetWidth.Location = new System.Drawing.Point(78, 20);
            this.nudSheetWidth.Maximum = new decimal(new int[] {
            10000,
            0,
            0,
            0});
            this.nudSheetWidth.Name = "nudSheetWidth";
            this.nudSheetWidth.Size = new System.Drawing.Size(82, 20);
            this.nudSheetWidth.TabIndex = 7;
            // 
            // label10
            // 
            this.label10.AutoSize = true;
            this.label10.Location = new System.Drawing.Point(201, 22);
            this.label10.Name = "label10";
            this.label10.Size = new System.Drawing.Size(41, 13);
            this.label10.TabIndex = 8;
            this.label10.Text = "Height:";
            // 
            // label11
            // 
            this.label11.AutoSize = true;
            this.label11.Location = new System.Drawing.Point(13, 54);
            this.label11.Name = "label11";
            this.label11.Size = new System.Drawing.Size(63, 13);
            this.label11.TabIndex = 10;
            this.label11.Text = "Margin Left:";
            // 
            // nudSheetLabelsMarginTop
            // 
            this.nudSheetLabelsMarginTop.DecimalPlaces = 4;
            this.nudSheetLabelsMarginTop.Location = new System.Drawing.Point(244, 52);
            this.nudSheetLabelsMarginTop.Maximum = new decimal(new int[] {
            10000,
            0,
            0,
            0});
            this.nudSheetLabelsMarginTop.Name = "nudSheetLabelsMarginTop";
            this.nudSheetLabelsMarginTop.Size = new System.Drawing.Size(82, 20);
            this.nudSheetLabelsMarginTop.TabIndex = 13;
            // 
            // nudSheetLabelsMarginLeft
            // 
            this.nudSheetLabelsMarginLeft.DecimalPlaces = 4;
            this.nudSheetLabelsMarginLeft.Location = new System.Drawing.Point(78, 52);
            this.nudSheetLabelsMarginLeft.Maximum = new decimal(new int[] {
            10000,
            0,
            0,
            0});
            this.nudSheetLabelsMarginLeft.Name = "nudSheetLabelsMarginLeft";
            this.nudSheetLabelsMarginLeft.Size = new System.Drawing.Size(82, 20);
            this.nudSheetLabelsMarginLeft.TabIndex = 11;
            // 
            // label12
            // 
            this.label12.AutoSize = true;
            this.label12.Location = new System.Drawing.Point(178, 54);
            this.label12.Name = "label12";
            this.label12.Size = new System.Drawing.Size(64, 13);
            this.label12.TabIndex = 12;
            this.label12.Text = "Margin Top:";
            // 
            // label13
            // 
            this.label13.AutoSize = true;
            this.label13.Location = new System.Drawing.Point(8, 87);
            this.label13.Name = "label13";
            this.label13.Size = new System.Drawing.Size(91, 13);
            this.label13.TabIndex = 14;
            this.label13.Text = "Labels Per Sheet:";
            // 
            // nudSheetLabelsCount
            // 
            this.nudSheetLabelsCount.Location = new System.Drawing.Point(105, 85);
            this.nudSheetLabelsCount.Maximum = new decimal(new int[] {
            10000,
            0,
            0,
            0});
            this.nudSheetLabelsCount.Name = "nudSheetLabelsCount";
            this.nudSheetLabelsCount.Size = new System.Drawing.Size(55, 20);
            this.nudSheetLabelsCount.TabIndex = 15;
            this.nudSheetLabelsCount.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            // 
            // LabelDoc
            // 
            this.AcceptButton = this.button1;
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.CancelButton = this.button2;
            this.ClientSize = new System.Drawing.Size(787, 473);
            this.Controls.Add(this.gbGeneral);
            this.Controls.Add(this.flowLayoutPanel1);
            this.Controls.Add(this.tabLabelType);
            this.Controls.Add(this.button2);
            this.Controls.Add(this.button1);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "LabelDoc";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterParent;
            this.Text = "Label Document";
            this.Load += new System.EventHandler(this.LabelDoc_Load);
            ((System.ComponentModel.ISupportInitialize)(this.nudWidth)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudHeight)).EndInit();
            this.gbLabel.ResumeLayout(false);
            this.gbLabel.PerformLayout();
            this.gbVLayout.ResumeLayout(false);
            this.gbVLayout.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.nudMarkLength)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudGapLength)).EndInit();
            this.gbPrintOptions.ResumeLayout(false);
            this.gbPrintOptions.PerformLayout();
            this.tabLabelType.ResumeLayout(false);
            this.tabRollSingleLabel.ResumeLayout(false);
            this.tabRollMulticolLabels.ResumeLayout(false);
            this.tabSheetLabels.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.picRollSingleLabels)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.picRollMulticolumnLabels)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.picSheetLabels)).EndInit();
            this.flowLayoutPanel1.ResumeLayout(false);
            this.gbGeneral.ResumeLayout(false);
            this.gbGeneral.PerformLayout();
            this.gbHLayout.ResumeLayout(false);
            this.gbHLayout.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.nudHorizGapLength)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudLabelsPerRow)).EndInit();
            this.gbSheet.ResumeLayout(false);
            this.gbSheet.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.nudSheetHeight)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudSheetWidth)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudSheetLabelsMarginTop)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudSheetLabelsMarginLeft)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudSheetLabelsCount)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.ComboBox cboUnit;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.NumericUpDown nudWidth;
        private System.Windows.Forms.NumericUpDown nudHeight;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.Button button2;
        private System.Windows.Forms.GroupBox gbLabel;
        private System.Windows.Forms.GroupBox gbVLayout;
        private System.Windows.Forms.CheckBox chkIsContinuous;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.NumericUpDown nudGapLength;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.NumericUpDown nudMarkLength;
        private System.Windows.Forms.GroupBox gbPrintOptions;
        private System.Windows.Forms.CheckBox chkPrintMirror;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.TextBox txtPrintSpeed;
        private System.Windows.Forms.CheckBox chkCutAfterPrinting;
        private System.Windows.Forms.TabControl tabLabelType;
        private System.Windows.Forms.TabPage tabRollSingleLabel;
        private System.Windows.Forms.PictureBox picRollSingleLabels;
        private System.Windows.Forms.TabPage tabRollMulticolLabels;
        private System.Windows.Forms.TabPage tabSheetLabels;
        private System.Windows.Forms.PictureBox picRollMulticolumnLabels;
        private System.Windows.Forms.PictureBox picSheetLabels;
        private System.Windows.Forms.FlowLayoutPanel flowLayoutPanel1;
        private System.Windows.Forms.GroupBox gbGeneral;
        private System.Windows.Forms.GroupBox gbHLayout;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.NumericUpDown nudLabelsPerRow;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.NumericUpDown nudHorizGapLength;
        private System.Windows.Forms.GroupBox gbSheet;
        private System.Windows.Forms.Label label13;
        private System.Windows.Forms.NumericUpDown nudSheetLabelsCount;
        private System.Windows.Forms.Label label11;
        private System.Windows.Forms.NumericUpDown nudSheetLabelsMarginTop;
        private System.Windows.Forms.NumericUpDown nudSheetLabelsMarginLeft;
        private System.Windows.Forms.Label label12;
        private System.Windows.Forms.Label label9;
        private System.Windows.Forms.NumericUpDown nudSheetHeight;
        private System.Windows.Forms.NumericUpDown nudSheetWidth;
        private System.Windows.Forms.Label label10;
    }
}