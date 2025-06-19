namespace TLWindowsEditorWinFormsDemo
{
    partial class PrintJobDialog
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
            this.errorProvider1 = new System.Windows.Forms.ErrorProvider(this.components);
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.chkDuplex = new System.Windows.Forms.CheckBox();
            this.chkCommandsOptimizationEnabled = new System.Windows.Forms.CheckBox();
            this.nudReplicates = new System.Windows.Forms.NumericUpDown();
            this.label14 = new System.Windows.Forms.Label();
            this.cboPrintOrientation = new System.Windows.Forms.ComboBox();
            this.label13 = new System.Windows.Forms.Label();
            this.nudCopies = new System.Windows.Forms.NumericUpDown();
            this.label1 = new System.Windows.Forms.Label();
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.lblProgLang = new System.Windows.Forms.Label();
            this.cboProgLang = new System.Windows.Forms.ComboBox();
            this.nudDpi = new System.Windows.Forms.NumericUpDown();
            this.label11 = new System.Windows.Forms.Label();
            this.tabControl1 = new System.Windows.Forms.TabControl();
            this.tabPage1 = new System.Windows.Forms.TabPage();
            this.gbMargins = new System.Windows.Forms.GroupBox();
            this.chkCenterV = new System.Windows.Forms.CheckBox();
            this.chkCenterH = new System.Windows.Forms.CheckBox();
            this.nudMarginTop = new System.Windows.Forms.NumericUpDown();
            this.label15 = new System.Windows.Forms.Label();
            this.nudMarginLeft = new System.Windows.Forms.NumericUpDown();
            this.label16 = new System.Windows.Forms.Label();
            this.chkPrintAsImage = new System.Windows.Forms.CheckBox();
            this.cboPrinters = new System.Windows.Forms.ComboBox();
            this.label2 = new System.Windows.Forms.Label();
            this.tabPage5 = new System.Windows.Forms.TabPage();
            this.txtUsbDevicePath = new System.Windows.Forms.TextBox();
            this.label17 = new System.Windows.Forms.Label();
            this.cboUsbDevices = new System.Windows.Forms.ComboBox();
            this.label18 = new System.Windows.Forms.Label();
            this.tabPage2 = new System.Windows.Forms.TabPage();
            this.txtParallelPort = new System.Windows.Forms.TextBox();
            this.label3 = new System.Windows.Forms.Label();
            this.tabPage3 = new System.Windows.Forms.TabPage();
            this.cboFlowControl = new System.Windows.Forms.ComboBox();
            this.label10 = new System.Windows.Forms.Label();
            this.cboStopBits = new System.Windows.Forms.ComboBox();
            this.label9 = new System.Windows.Forms.Label();
            this.cboParity = new System.Windows.Forms.ComboBox();
            this.label8 = new System.Windows.Forms.Label();
            this.txtDataBits = new System.Windows.Forms.TextBox();
            this.label7 = new System.Windows.Forms.Label();
            this.txtBaudRate = new System.Windows.Forms.TextBox();
            this.label6 = new System.Windows.Forms.Label();
            this.cboSerialPorts = new System.Windows.Forms.ComboBox();
            this.label5 = new System.Windows.Forms.Label();
            this.tabPage4 = new System.Windows.Forms.TabPage();
            this.txtIPPort = new System.Windows.Forms.TextBox();
            this.label4 = new System.Windows.Forms.Label();
            this.txtIPAddress = new System.Windows.Forms.TextBox();
            this.label12 = new System.Windows.Forms.Label();
            this.btnCancel = new System.Windows.Forms.Button();
            this.btnOk = new System.Windows.Forms.Button();
            ((System.ComponentModel.ISupportInitialize)(this.errorProvider1)).BeginInit();
            this.groupBox2.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.nudReplicates)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudCopies)).BeginInit();
            this.groupBox1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.nudDpi)).BeginInit();
            this.tabControl1.SuspendLayout();
            this.tabPage1.SuspendLayout();
            this.gbMargins.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.nudMarginTop)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudMarginLeft)).BeginInit();
            this.tabPage5.SuspendLayout();
            this.tabPage2.SuspendLayout();
            this.tabPage3.SuspendLayout();
            this.tabPage4.SuspendLayout();
            this.SuspendLayout();
            // 
            // errorProvider1
            // 
            this.errorProvider1.ContainerControl = this;
            // 
            // groupBox2
            // 
            this.groupBox2.Controls.Add(this.chkDuplex);
            this.groupBox2.Controls.Add(this.chkCommandsOptimizationEnabled);
            this.groupBox2.Controls.Add(this.nudReplicates);
            this.groupBox2.Controls.Add(this.label14);
            this.groupBox2.Controls.Add(this.cboPrintOrientation);
            this.groupBox2.Controls.Add(this.label13);
            this.groupBox2.Controls.Add(this.nudCopies);
            this.groupBox2.Controls.Add(this.label1);
            this.groupBox2.Location = new System.Drawing.Point(12, 296);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(377, 122);
            this.groupBox2.TabIndex = 5;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "Options";
            // 
            // chkDuplex
            // 
            this.chkDuplex.AutoSize = true;
            this.chkDuplex.Location = new System.Drawing.Point(13, 94);
            this.chkDuplex.Name = "chkDuplex";
            this.chkDuplex.Size = new System.Drawing.Size(161, 17);
            this.chkDuplex.TabIndex = 7;
            this.chkDuplex.Text = "Enable double-sided printing";
            this.chkDuplex.UseVisualStyleBackColor = true;
            // 
            // chkCommandsOptimizationEnabled
            // 
            this.chkCommandsOptimizationEnabled.AutoSize = true;
            this.chkCommandsOptimizationEnabled.Checked = true;
            this.chkCommandsOptimizationEnabled.CheckState = System.Windows.Forms.CheckState.Checked;
            this.chkCommandsOptimizationEnabled.Location = new System.Drawing.Point(153, 60);
            this.chkCommandsOptimizationEnabled.Name = "chkCommandsOptimizationEnabled";
            this.chkCommandsOptimizationEnabled.Size = new System.Drawing.Size(175, 17);
            this.chkCommandsOptimizationEnabled.TabIndex = 6;
            this.chkCommandsOptimizationEnabled.Text = "Enable Commands Optimization";
            this.chkCommandsOptimizationEnabled.UseVisualStyleBackColor = true;
            // 
            // nudReplicates
            // 
            this.nudReplicates.Location = new System.Drawing.Point(72, 59);
            this.nudReplicates.Name = "nudReplicates";
            this.nudReplicates.Size = new System.Drawing.Size(47, 21);
            this.nudReplicates.TabIndex = 5;
            this.nudReplicates.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            // 
            // label14
            // 
            this.label14.AutoSize = true;
            this.label14.Location = new System.Drawing.Point(10, 61);
            this.label14.Name = "label14";
            this.label14.Size = new System.Drawing.Size(60, 13);
            this.label14.TabIndex = 4;
            this.label14.Text = "Replicates:";
            // 
            // cboPrintOrientation
            // 
            this.cboPrintOrientation.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboPrintOrientation.FormattingEnabled = true;
            this.cboPrintOrientation.Items.AddRange(new object[] {
            "Portrait",
            "Portrait180",
            "Landscape90",
            "Landscape270"});
            this.cboPrintOrientation.Location = new System.Drawing.Point(241, 24);
            this.cboPrintOrientation.Name = "cboPrintOrientation";
            this.cboPrintOrientation.Size = new System.Drawing.Size(113, 21);
            this.cboPrintOrientation.TabIndex = 3;
            // 
            // label13
            // 
            this.label13.AutoSize = true;
            this.label13.Location = new System.Drawing.Point(150, 26);
            this.label13.Name = "label13";
            this.label13.Size = new System.Drawing.Size(90, 13);
            this.label13.TabIndex = 2;
            this.label13.Text = "Print Orientation:";
            // 
            // nudCopies
            // 
            this.nudCopies.Location = new System.Drawing.Point(56, 24);
            this.nudCopies.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.nudCopies.Name = "nudCopies";
            this.nudCopies.Size = new System.Drawing.Size(47, 21);
            this.nudCopies.TabIndex = 1;
            this.nudCopies.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.nudCopies.Value = new decimal(new int[] {
            1,
            0,
            0,
            0});
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(10, 26);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(43, 13);
            this.label1.TabIndex = 0;
            this.label1.Text = "Copies:";
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.lblProgLang);
            this.groupBox1.Controls.Add(this.cboProgLang);
            this.groupBox1.Controls.Add(this.nudDpi);
            this.groupBox1.Controls.Add(this.label11);
            this.groupBox1.Controls.Add(this.tabControl1);
            this.groupBox1.Location = new System.Drawing.Point(12, 12);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(377, 277);
            this.groupBox1.TabIndex = 4;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "Printer Settings";
            // 
            // lblProgLang
            // 
            this.lblProgLang.AutoSize = true;
            this.lblProgLang.BackColor = System.Drawing.SystemColors.Control;
            this.lblProgLang.Location = new System.Drawing.Point(190, 31);
            this.lblProgLang.Name = "lblProgLang";
            this.lblProgLang.Size = new System.Drawing.Size(98, 13);
            this.lblProgLang.TabIndex = 2;
            this.lblProgLang.Text = "Printer Commands:";
            // 
            // cboProgLang
            // 
            this.cboProgLang.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboProgLang.DropDownWidth = 80;
            this.cboProgLang.FormattingEnabled = true;
            this.cboProgLang.Items.AddRange(new object[] {
            "",
            "ZPL",
            "EPL",
            "Fingerprint"});
            this.cboProgLang.Location = new System.Drawing.Point(294, 29);
            this.cboProgLang.Name = "cboProgLang";
            this.cboProgLang.Size = new System.Drawing.Size(71, 21);
            this.cboProgLang.TabIndex = 2;
            // 
            // nudDpi
            // 
            this.nudDpi.Increment = new decimal(new int[] {
            100,
            0,
            0,
            0});
            this.nudDpi.Location = new System.Drawing.Point(107, 29);
            this.nudDpi.Maximum = new decimal(new int[] {
            2400,
            0,
            0,
            0});
            this.nudDpi.Minimum = new decimal(new int[] {
            72,
            0,
            0,
            0});
            this.nudDpi.Name = "nudDpi";
            this.nudDpi.Size = new System.Drawing.Size(68, 21);
            this.nudDpi.TabIndex = 1;
            this.nudDpi.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.nudDpi.Value = new decimal(new int[] {
            203,
            0,
            0,
            0});
            // 
            // label11
            // 
            this.label11.AutoSize = true;
            this.label11.Location = new System.Drawing.Point(12, 31);
            this.label11.Name = "label11";
            this.label11.Size = new System.Drawing.Size(89, 13);
            this.label11.TabIndex = 0;
            this.label11.Text = "Resolution (DPI):";
            // 
            // tabControl1
            // 
            this.tabControl1.Controls.Add(this.tabPage1);
            this.tabControl1.Controls.Add(this.tabPage5);
            this.tabControl1.Controls.Add(this.tabPage2);
            this.tabControl1.Controls.Add(this.tabPage3);
            this.tabControl1.Controls.Add(this.tabPage4);
            this.tabControl1.Location = new System.Drawing.Point(12, 62);
            this.tabControl1.Name = "tabControl1";
            this.tabControl1.SelectedIndex = 0;
            this.tabControl1.Size = new System.Drawing.Size(359, 209);
            this.tabControl1.TabIndex = 3;
            // 
            // tabPage1
            // 
            this.tabPage1.Controls.Add(this.gbMargins);
            this.tabPage1.Controls.Add(this.chkPrintAsImage);
            this.tabPage1.Controls.Add(this.cboPrinters);
            this.tabPage1.Controls.Add(this.label2);
            this.tabPage1.Location = new System.Drawing.Point(4, 22);
            this.tabPage1.Name = "tabPage1";
            this.tabPage1.Padding = new System.Windows.Forms.Padding(3);
            this.tabPage1.Size = new System.Drawing.Size(351, 183);
            this.tabPage1.TabIndex = 0;
            this.tabPage1.Text = "Printer Driver";
            this.tabPage1.UseVisualStyleBackColor = true;
            // 
            // gbMargins
            // 
            this.gbMargins.Controls.Add(this.chkCenterV);
            this.gbMargins.Controls.Add(this.chkCenterH);
            this.gbMargins.Controls.Add(this.nudMarginTop);
            this.gbMargins.Controls.Add(this.label15);
            this.gbMargins.Controls.Add(this.nudMarginLeft);
            this.gbMargins.Controls.Add(this.label16);
            this.gbMargins.Enabled = false;
            this.gbMargins.Location = new System.Drawing.Point(28, 91);
            this.gbMargins.Name = "gbMargins";
            this.gbMargins.Size = new System.Drawing.Size(296, 77);
            this.gbMargins.TabIndex = 5;
            this.gbMargins.TabStop = false;
            this.gbMargins.Text = "Margins";
            // 
            // chkCenterV
            // 
            this.chkCenterV.AutoSize = true;
            this.chkCenterV.Location = new System.Drawing.Point(127, 53);
            this.chkCenterV.Name = "chkCenterV";
            this.chkCenterV.Size = new System.Drawing.Size(97, 17);
            this.chkCenterV.TabIndex = 5;
            this.chkCenterV.Text = "Center Vertical";
            this.chkCenterV.UseVisualStyleBackColor = true;
            this.chkCenterV.CheckedChanged += new System.EventHandler(this.chkCenterV_CheckedChanged);
            // 
            // chkCenterH
            // 
            this.chkCenterH.AutoSize = true;
            this.chkCenterH.Location = new System.Drawing.Point(12, 53);
            this.chkCenterH.Name = "chkCenterH";
            this.chkCenterH.Size = new System.Drawing.Size(110, 17);
            this.chkCenterH.TabIndex = 4;
            this.chkCenterH.Text = "Center Horizontal";
            this.chkCenterH.UseVisualStyleBackColor = true;
            this.chkCenterH.CheckedChanged += new System.EventHandler(this.chkCenterH_CheckedChanged);
            // 
            // nudMarginTop
            // 
            this.nudMarginTop.DecimalPlaces = 2;
            this.nudMarginTop.Location = new System.Drawing.Point(168, 19);
            this.nudMarginTop.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            -2147483648});
            this.nudMarginTop.Name = "nudMarginTop";
            this.nudMarginTop.Size = new System.Drawing.Size(56, 21);
            this.nudMarginTop.TabIndex = 3;
            // 
            // label15
            // 
            this.label15.AutoSize = true;
            this.label15.Location = new System.Drawing.Point(124, 23);
            this.label15.Name = "label15";
            this.label15.Size = new System.Drawing.Size(29, 13);
            this.label15.TabIndex = 2;
            this.label15.Text = "Top:";
            // 
            // nudMarginLeft
            // 
            this.nudMarginLeft.DecimalPlaces = 2;
            this.nudMarginLeft.Location = new System.Drawing.Point(47, 19);
            this.nudMarginLeft.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            -2147483648});
            this.nudMarginLeft.Name = "nudMarginLeft";
            this.nudMarginLeft.Size = new System.Drawing.Size(56, 21);
            this.nudMarginLeft.TabIndex = 1;
            // 
            // label16
            // 
            this.label16.AutoSize = true;
            this.label16.Location = new System.Drawing.Point(9, 23);
            this.label16.Name = "label16";
            this.label16.Size = new System.Drawing.Size(30, 13);
            this.label16.TabIndex = 0;
            this.label16.Text = "Left:";
            // 
            // chkPrintAsImage
            // 
            this.chkPrintAsImage.AutoSize = true;
            this.chkPrintAsImage.Location = new System.Drawing.Point(28, 67);
            this.chkPrintAsImage.Name = "chkPrintAsImage";
            this.chkPrintAsImage.Size = new System.Drawing.Size(93, 17);
            this.chkPrintAsImage.TabIndex = 2;
            this.chkPrintAsImage.Text = "Print as image";
            this.chkPrintAsImage.UseVisualStyleBackColor = true;
            this.chkPrintAsImage.CheckedChanged += new System.EventHandler(this.chkPrintAsImage_CheckedChanged);
            // 
            // cboPrinters
            // 
            this.cboPrinters.FormattingEnabled = true;
            this.cboPrinters.Location = new System.Drawing.Point(28, 32);
            this.cboPrinters.Name = "cboPrinters";
            this.cboPrinters.Size = new System.Drawing.Size(296, 21);
            this.cboPrinters.TabIndex = 1;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(25, 15);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(73, 13);
            this.label2.TabIndex = 0;
            this.label2.Text = "Printer Name:";
            // 
            // tabPage5
            // 
            this.tabPage5.Controls.Add(this.txtUsbDevicePath);
            this.tabPage5.Controls.Add(this.label17);
            this.tabPage5.Controls.Add(this.cboUsbDevices);
            this.tabPage5.Controls.Add(this.label18);
            this.tabPage5.Location = new System.Drawing.Point(4, 22);
            this.tabPage5.Name = "tabPage5";
            this.tabPage5.Size = new System.Drawing.Size(351, 183);
            this.tabPage5.TabIndex = 4;
            this.tabPage5.Text = "USB";
            this.tabPage5.UseVisualStyleBackColor = true;
            // 
            // txtUsbDevicePath
            // 
            this.txtUsbDevicePath.Location = new System.Drawing.Point(27, 83);
            this.txtUsbDevicePath.Name = "txtUsbDevicePath";
            this.txtUsbDevicePath.Size = new System.Drawing.Size(294, 21);
            this.txtUsbDevicePath.TabIndex = 11;
            // 
            // label17
            // 
            this.label17.AutoSize = true;
            this.label17.Location = new System.Drawing.Point(24, 66);
            this.label17.Name = "label17";
            this.label17.Size = new System.Drawing.Size(68, 13);
            this.label17.TabIndex = 10;
            this.label17.Text = "Device Path:";
            // 
            // cboUsbDevices
            // 
            this.cboUsbDevices.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboUsbDevices.FormattingEnabled = true;
            this.cboUsbDevices.Location = new System.Drawing.Point(27, 39);
            this.cboUsbDevices.Name = "cboUsbDevices";
            this.cboUsbDevices.Size = new System.Drawing.Size(294, 21);
            this.cboUsbDevices.TabIndex = 9;
            // 
            // label18
            // 
            this.label18.AutoSize = true;
            this.label18.Location = new System.Drawing.Point(24, 22);
            this.label18.Name = "label18";
            this.label18.Size = new System.Drawing.Size(73, 13);
            this.label18.TabIndex = 8;
            this.label18.Text = "Device Name:";
            // 
            // tabPage2
            // 
            this.tabPage2.Controls.Add(this.txtParallelPort);
            this.tabPage2.Controls.Add(this.label3);
            this.tabPage2.Location = new System.Drawing.Point(4, 22);
            this.tabPage2.Name = "tabPage2";
            this.tabPage2.Padding = new System.Windows.Forms.Padding(3);
            this.tabPage2.Size = new System.Drawing.Size(351, 183);
            this.tabPage2.TabIndex = 1;
            this.tabPage2.Text = "Parallel";
            this.tabPage2.UseVisualStyleBackColor = true;
            // 
            // txtParallelPort
            // 
            this.txtParallelPort.Location = new System.Drawing.Point(29, 36);
            this.txtParallelPort.Name = "txtParallelPort";
            this.txtParallelPort.Size = new System.Drawing.Size(292, 21);
            this.txtParallelPort.TabIndex = 1;
            this.txtParallelPort.Text = "LPT1";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(26, 19);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(98, 13);
            this.label3.TabIndex = 0;
            this.label3.Text = "Parallel Port Name:";
            // 
            // tabPage3
            // 
            this.tabPage3.Controls.Add(this.cboFlowControl);
            this.tabPage3.Controls.Add(this.label10);
            this.tabPage3.Controls.Add(this.cboStopBits);
            this.tabPage3.Controls.Add(this.label9);
            this.tabPage3.Controls.Add(this.cboParity);
            this.tabPage3.Controls.Add(this.label8);
            this.tabPage3.Controls.Add(this.txtDataBits);
            this.tabPage3.Controls.Add(this.label7);
            this.tabPage3.Controls.Add(this.txtBaudRate);
            this.tabPage3.Controls.Add(this.label6);
            this.tabPage3.Controls.Add(this.cboSerialPorts);
            this.tabPage3.Controls.Add(this.label5);
            this.tabPage3.Location = new System.Drawing.Point(4, 22);
            this.tabPage3.Name = "tabPage3";
            this.tabPage3.Size = new System.Drawing.Size(351, 183);
            this.tabPage3.TabIndex = 2;
            this.tabPage3.Text = "Serial";
            this.tabPage3.UseVisualStyleBackColor = true;
            // 
            // cboFlowControl
            // 
            this.cboFlowControl.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboFlowControl.FormattingEnabled = true;
            this.cboFlowControl.Location = new System.Drawing.Point(198, 117);
            this.cboFlowControl.Name = "cboFlowControl";
            this.cboFlowControl.Size = new System.Drawing.Size(100, 21);
            this.cboFlowControl.TabIndex = 13;
            // 
            // label10
            // 
            this.label10.AutoSize = true;
            this.label10.Location = new System.Drawing.Point(195, 100);
            this.label10.Name = "label10";
            this.label10.Size = new System.Drawing.Size(71, 13);
            this.label10.TabIndex = 12;
            this.label10.Text = "Flow Control:";
            // 
            // cboStopBits
            // 
            this.cboStopBits.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboStopBits.FormattingEnabled = true;
            this.cboStopBits.Location = new System.Drawing.Point(24, 117);
            this.cboStopBits.Name = "cboStopBits";
            this.cboStopBits.Size = new System.Drawing.Size(121, 21);
            this.cboStopBits.TabIndex = 11;
            // 
            // label9
            // 
            this.label9.AutoSize = true;
            this.label9.Location = new System.Drawing.Point(21, 100);
            this.label9.Name = "label9";
            this.label9.Size = new System.Drawing.Size(53, 13);
            this.label9.TabIndex = 10;
            this.label9.Text = "Stop Bits:";
            // 
            // cboParity
            // 
            this.cboParity.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboParity.FormattingEnabled = true;
            this.cboParity.Location = new System.Drawing.Point(198, 75);
            this.cboParity.Name = "cboParity";
            this.cboParity.Size = new System.Drawing.Size(100, 21);
            this.cboParity.TabIndex = 9;
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Location = new System.Drawing.Point(195, 58);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(39, 13);
            this.label8.TabIndex = 8;
            this.label8.Text = "Parity:";
            // 
            // txtDataBits
            // 
            this.txtDataBits.Location = new System.Drawing.Point(24, 75);
            this.txtDataBits.Name = "txtDataBits";
            this.txtDataBits.Size = new System.Drawing.Size(121, 21);
            this.txtDataBits.TabIndex = 7;
            this.txtDataBits.Text = "8";
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(21, 58);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(54, 13);
            this.label7.TabIndex = 6;
            this.label7.Text = "Data Bits:";
            // 
            // txtBaudRate
            // 
            this.txtBaudRate.Location = new System.Drawing.Point(198, 31);
            this.txtBaudRate.Name = "txtBaudRate";
            this.txtBaudRate.Size = new System.Drawing.Size(100, 21);
            this.txtBaudRate.TabIndex = 5;
            this.txtBaudRate.Text = "9600";
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(195, 14);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(61, 13);
            this.label6.TabIndex = 4;
            this.label6.Text = "Baud Rate:";
            // 
            // cboSerialPorts
            // 
            this.cboSerialPorts.FormattingEnabled = true;
            this.cboSerialPorts.Location = new System.Drawing.Point(24, 31);
            this.cboSerialPorts.Name = "cboSerialPorts";
            this.cboSerialPorts.Size = new System.Drawing.Size(121, 21);
            this.cboSerialPorts.TabIndex = 3;
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(21, 14);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(90, 13);
            this.label5.TabIndex = 2;
            this.label5.Text = "Serial Port Name:";
            // 
            // tabPage4
            // 
            this.tabPage4.Controls.Add(this.txtIPPort);
            this.tabPage4.Controls.Add(this.label4);
            this.tabPage4.Controls.Add(this.txtIPAddress);
            this.tabPage4.Controls.Add(this.label12);
            this.tabPage4.Location = new System.Drawing.Point(4, 22);
            this.tabPage4.Name = "tabPage4";
            this.tabPage4.Size = new System.Drawing.Size(351, 183);
            this.tabPage4.TabIndex = 3;
            this.tabPage4.Text = "Network";
            this.tabPage4.UseVisualStyleBackColor = true;
            // 
            // txtIPPort
            // 
            this.txtIPPort.Location = new System.Drawing.Point(29, 93);
            this.txtIPPort.Name = "txtIPPort";
            this.txtIPPort.Size = new System.Drawing.Size(63, 21);
            this.txtIPPort.TabIndex = 4;
            this.txtIPPort.Text = "0";
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(26, 77);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(66, 13);
            this.label4.TabIndex = 3;
            this.label4.Text = "Printer Port:";
            // 
            // txtIPAddress
            // 
            this.txtIPAddress.Location = new System.Drawing.Point(29, 41);
            this.txtIPAddress.Name = "txtIPAddress";
            this.txtIPAddress.Size = new System.Drawing.Size(291, 21);
            this.txtIPAddress.TabIndex = 2;
            this.txtIPAddress.Text = "127.0.0.1";
            // 
            // label12
            // 
            this.label12.AutoSize = true;
            this.label12.Location = new System.Drawing.Point(26, 25);
            this.label12.Name = "label12";
            this.label12.Size = new System.Drawing.Size(166, 13);
            this.label12.TabIndex = 0;
            this.label12.Text = "Printer IP Address or Host Name:";
            // 
            // btnCancel
            // 
            this.btnCancel.DialogResult = System.Windows.Forms.DialogResult.Cancel;
            this.btnCancel.Location = new System.Drawing.Point(314, 424);
            this.btnCancel.Name = "btnCancel";
            this.btnCancel.Size = new System.Drawing.Size(75, 23);
            this.btnCancel.TabIndex = 7;
            this.btnCancel.Text = "&Cancel";
            this.btnCancel.UseVisualStyleBackColor = true;
            this.btnCancel.Click += new System.EventHandler(this.btnCancel_Click);
            // 
            // btnOk
            // 
            this.btnOk.Location = new System.Drawing.Point(218, 424);
            this.btnOk.Name = "btnOk";
            this.btnOk.Size = new System.Drawing.Size(75, 23);
            this.btnOk.TabIndex = 6;
            this.btnOk.Text = "&Ok";
            this.btnOk.UseVisualStyleBackColor = true;
            this.btnOk.Click += new System.EventHandler(this.btnOk_Click);
            // 
            // PrintJobDialog
            // 
            this.AcceptButton = this.btnOk;
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.CancelButton = this.btnCancel;
            this.ClientSize = new System.Drawing.Size(401, 459);
            this.ControlBox = false;
            this.Controls.Add(this.groupBox2);
            this.Controls.Add(this.groupBox1);
            this.Controls.Add(this.btnCancel);
            this.Controls.Add(this.btnOk);
            this.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "PrintJobDialog";
            this.Text = "Print Label";
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.PrintJobDialog_FormClosing);
            ((System.ComponentModel.ISupportInitialize)(this.errorProvider1)).EndInit();
            this.groupBox2.ResumeLayout(false);
            this.groupBox2.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.nudReplicates)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudCopies)).EndInit();
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.nudDpi)).EndInit();
            this.tabControl1.ResumeLayout(false);
            this.tabPage1.ResumeLayout(false);
            this.tabPage1.PerformLayout();
            this.gbMargins.ResumeLayout(false);
            this.gbMargins.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.nudMarginTop)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudMarginLeft)).EndInit();
            this.tabPage5.ResumeLayout(false);
            this.tabPage5.PerformLayout();
            this.tabPage2.ResumeLayout(false);
            this.tabPage2.PerformLayout();
            this.tabPage3.ResumeLayout(false);
            this.tabPage3.PerformLayout();
            this.tabPage4.ResumeLayout(false);
            this.tabPage4.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion
        private System.Windows.Forms.ErrorProvider errorProvider1;
        private System.Windows.Forms.GroupBox groupBox2;
        private System.Windows.Forms.CheckBox chkDuplex;
        private System.Windows.Forms.CheckBox chkCommandsOptimizationEnabled;
        private System.Windows.Forms.NumericUpDown nudReplicates;
        private System.Windows.Forms.Label label14;
        private System.Windows.Forms.ComboBox cboPrintOrientation;
        private System.Windows.Forms.Label label13;
        private System.Windows.Forms.NumericUpDown nudCopies;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.Label lblProgLang;
        private System.Windows.Forms.ComboBox cboProgLang;
        private System.Windows.Forms.NumericUpDown nudDpi;
        private System.Windows.Forms.Label label11;
        private System.Windows.Forms.TabControl tabControl1;
        private System.Windows.Forms.TabPage tabPage1;
        private System.Windows.Forms.GroupBox gbMargins;
        private System.Windows.Forms.CheckBox chkCenterV;
        private System.Windows.Forms.CheckBox chkCenterH;
        private System.Windows.Forms.NumericUpDown nudMarginTop;
        private System.Windows.Forms.Label label15;
        private System.Windows.Forms.NumericUpDown nudMarginLeft;
        private System.Windows.Forms.Label label16;
        private System.Windows.Forms.CheckBox chkPrintAsImage;
        private System.Windows.Forms.ComboBox cboPrinters;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.TabPage tabPage5;
        private System.Windows.Forms.TextBox txtUsbDevicePath;
        private System.Windows.Forms.Label label17;
        private System.Windows.Forms.ComboBox cboUsbDevices;
        private System.Windows.Forms.Label label18;
        private System.Windows.Forms.TabPage tabPage2;
        private System.Windows.Forms.TextBox txtParallelPort;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.TabPage tabPage3;
        private System.Windows.Forms.ComboBox cboFlowControl;
        private System.Windows.Forms.Label label10;
        private System.Windows.Forms.ComboBox cboStopBits;
        private System.Windows.Forms.Label label9;
        private System.Windows.Forms.ComboBox cboParity;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.TextBox txtDataBits;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.TextBox txtBaudRate;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.ComboBox cboSerialPorts;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.TabPage tabPage4;
        private System.Windows.Forms.TextBox txtIPPort;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.TextBox txtIPAddress;
        private System.Windows.Forms.Label label12;
        private System.Windows.Forms.Button btnCancel;
        private System.Windows.Forms.Button btnOk;
    }
}