namespace TLWindowsEditorWinFormsDemo
{
    partial class ViewOptions
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
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.lblUnit1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.chkSnapToGrid = new System.Windows.Forms.CheckBox();
            this.nudGridSize = new System.Windows.Forms.NumericUpDown();
            this.chkShowGrid = new System.Windows.Forms.CheckBox();
            this.button2 = new System.Windows.Forms.Button();
            this.button1 = new System.Windows.Forms.Button();
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.label1 = new System.Windows.Forms.Label();
            this.nudAngleSnap = new System.Windows.Forms.NumericUpDown();
            this.groupBox3 = new System.Windows.Forms.GroupBox();
            this.lblUnit3 = new System.Windows.Forms.Label();
            this.lblUnit2 = new System.Windows.Forms.Label();
            this.label4 = new System.Windows.Forms.Label();
            this.nudArrowKeysLargeStep = new System.Windows.Forms.NumericUpDown();
            this.label3 = new System.Windows.Forms.Label();
            this.nudArrowKeysShortStep = new System.Windows.Forms.NumericUpDown();
            this.label5 = new System.Windows.Forms.Label();
            this.cboGridType = new System.Windows.Forms.ComboBox();
            this.label6 = new System.Windows.Forms.Label();
            this.btnGridColor = new System.Windows.Forms.Button();
            this.groupBox1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.nudGridSize)).BeginInit();
            this.groupBox2.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.nudAngleSnap)).BeginInit();
            this.groupBox3.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.nudArrowKeysLargeStep)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudArrowKeysShortStep)).BeginInit();
            this.SuspendLayout();
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.btnGridColor);
            this.groupBox1.Controls.Add(this.label6);
            this.groupBox1.Controls.Add(this.cboGridType);
            this.groupBox1.Controls.Add(this.label5);
            this.groupBox1.Controls.Add(this.lblUnit1);
            this.groupBox1.Controls.Add(this.label2);
            this.groupBox1.Controls.Add(this.chkSnapToGrid);
            this.groupBox1.Controls.Add(this.nudGridSize);
            this.groupBox1.Controls.Add(this.chkShowGrid);
            this.groupBox1.Location = new System.Drawing.Point(12, 12);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(393, 103);
            this.groupBox1.TabIndex = 0;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "Grid";
            // 
            // lblUnit1
            // 
            this.lblUnit1.AutoSize = true;
            this.lblUnit1.Location = new System.Drawing.Point(220, 27);
            this.lblUnit1.Name = "lblUnit1";
            this.lblUnit1.Size = new System.Drawing.Size(26, 13);
            this.lblUnit1.TabIndex = 12;
            this.lblUnit1.Text = "Unit";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(105, 27);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(30, 13);
            this.label2.TabIndex = 10;
            this.label2.Text = "Size:";
            // 
            // chkSnapToGrid
            // 
            this.chkSnapToGrid.AutoSize = true;
            this.chkSnapToGrid.Location = new System.Drawing.Point(280, 26);
            this.chkSnapToGrid.Name = "chkSnapToGrid";
            this.chkSnapToGrid.Size = new System.Drawing.Size(89, 17);
            this.chkSnapToGrid.TabIndex = 1;
            this.chkSnapToGrid.Text = "Snap To Grid";
            this.chkSnapToGrid.UseVisualStyleBackColor = true;
            // 
            // nudGridSize
            // 
            this.nudGridSize.DecimalPlaces = 4;
            this.nudGridSize.Location = new System.Drawing.Point(137, 25);
            this.nudGridSize.Maximum = new decimal(new int[] {
            10000,
            0,
            0,
            0});
            this.nudGridSize.Name = "nudGridSize";
            this.nudGridSize.Size = new System.Drawing.Size(82, 20);
            this.nudGridSize.TabIndex = 11;
            // 
            // chkShowGrid
            // 
            this.chkShowGrid.AutoSize = true;
            this.chkShowGrid.Location = new System.Drawing.Point(17, 26);
            this.chkShowGrid.Name = "chkShowGrid";
            this.chkShowGrid.Size = new System.Drawing.Size(75, 17);
            this.chkShowGrid.TabIndex = 0;
            this.chkShowGrid.Text = "Show Grid";
            this.chkShowGrid.UseVisualStyleBackColor = true;
            // 
            // button2
            // 
            this.button2.DialogResult = System.Windows.Forms.DialogResult.Cancel;
            this.button2.Location = new System.Drawing.Point(332, 307);
            this.button2.Name = "button2";
            this.button2.Size = new System.Drawing.Size(75, 23);
            this.button2.TabIndex = 9;
            this.button2.Text = "&Cancel";
            this.button2.UseVisualStyleBackColor = true;
            // 
            // button1
            // 
            this.button1.DialogResult = System.Windows.Forms.DialogResult.OK;
            this.button1.Location = new System.Drawing.Point(224, 307);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(75, 23);
            this.button1.TabIndex = 8;
            this.button1.Text = "&OK";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.button1_Click);
            // 
            // groupBox2
            // 
            this.groupBox2.Controls.Add(this.label1);
            this.groupBox2.Controls.Add(this.nudAngleSnap);
            this.groupBox2.Location = new System.Drawing.Point(12, 133);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(393, 74);
            this.groupBox2.TabIndex = 10;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "Item Rotation";
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(17, 33);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(65, 13);
            this.label1.TabIndex = 12;
            this.label1.Text = "Angle Snap:";
            // 
            // nudAngleSnap
            // 
            this.nudAngleSnap.Increment = new decimal(new int[] {
            5,
            0,
            0,
            0});
            this.nudAngleSnap.Location = new System.Drawing.Point(86, 31);
            this.nudAngleSnap.Maximum = new decimal(new int[] {
            270,
            0,
            0,
            0});
            this.nudAngleSnap.Name = "nudAngleSnap";
            this.nudAngleSnap.Size = new System.Drawing.Size(82, 20);
            this.nudAngleSnap.TabIndex = 13;
            // 
            // groupBox3
            // 
            this.groupBox3.Controls.Add(this.lblUnit3);
            this.groupBox3.Controls.Add(this.lblUnit2);
            this.groupBox3.Controls.Add(this.label4);
            this.groupBox3.Controls.Add(this.nudArrowKeysLargeStep);
            this.groupBox3.Controls.Add(this.label3);
            this.groupBox3.Controls.Add(this.nudArrowKeysShortStep);
            this.groupBox3.Location = new System.Drawing.Point(12, 224);
            this.groupBox3.Name = "groupBox3";
            this.groupBox3.Size = new System.Drawing.Size(393, 65);
            this.groupBox3.TabIndex = 11;
            this.groupBox3.TabStop = false;
            this.groupBox3.Text = "Arrow Keys Steps";
            // 
            // lblUnit3
            // 
            this.lblUnit3.AutoSize = true;
            this.lblUnit3.Location = new System.Drawing.Point(345, 31);
            this.lblUnit3.Name = "lblUnit3";
            this.lblUnit3.Size = new System.Drawing.Size(26, 13);
            this.lblUnit3.TabIndex = 16;
            this.lblUnit3.Text = "Unit";
            // 
            // lblUnit2
            // 
            this.lblUnit2.AutoSize = true;
            this.lblUnit2.Location = new System.Drawing.Point(135, 31);
            this.lblUnit2.Name = "lblUnit2";
            this.lblUnit2.Size = new System.Drawing.Size(26, 13);
            this.lblUnit2.TabIndex = 13;
            this.lblUnit2.Text = "Unit";
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(175, 31);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(107, 13);
            this.label4.TabIndex = 14;
            this.label4.Text = "Large Step (Ctrl Key):";
            // 
            // nudArrowKeysLargeStep
            // 
            this.nudArrowKeysLargeStep.DecimalPlaces = 4;
            this.nudArrowKeysLargeStep.Location = new System.Drawing.Point(284, 29);
            this.nudArrowKeysLargeStep.Maximum = new decimal(new int[] {
            10000,
            0,
            0,
            0});
            this.nudArrowKeysLargeStep.Name = "nudArrowKeysLargeStep";
            this.nudArrowKeysLargeStep.Size = new System.Drawing.Size(61, 20);
            this.nudArrowKeysLargeStep.TabIndex = 15;
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(6, 31);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(60, 13);
            this.label3.TabIndex = 12;
            this.label3.Text = "Short Step:";
            // 
            // nudArrowKeysShortStep
            // 
            this.nudArrowKeysShortStep.DecimalPlaces = 4;
            this.nudArrowKeysShortStep.Location = new System.Drawing.Point(70, 29);
            this.nudArrowKeysShortStep.Maximum = new decimal(new int[] {
            10000,
            0,
            0,
            0});
            this.nudArrowKeysShortStep.Name = "nudArrowKeysShortStep";
            this.nudArrowKeysShortStep.Size = new System.Drawing.Size(65, 20);
            this.nudArrowKeysShortStep.TabIndex = 13;
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(17, 67);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(56, 13);
            this.label5.TabIndex = 13;
            this.label5.Text = "Grid Type:";
            // 
            // cboGridType
            // 
            this.cboGridType.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboGridType.FormattingEnabled = true;
            this.cboGridType.Location = new System.Drawing.Point(75, 64);
            this.cboGridType.Name = "cboGridType";
            this.cboGridType.Size = new System.Drawing.Size(100, 21);
            this.cboGridType.TabIndex = 14;
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(222, 67);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(56, 13);
            this.label6.TabIndex = 15;
            this.label6.Text = "Grid Color:";
            // 
            // btnGridColor
            // 
            this.btnGridColor.BackColor = System.Drawing.SystemColors.Control;
            this.btnGridColor.Location = new System.Drawing.Point(280, 62);
            this.btnGridColor.Name = "btnGridColor";
            this.btnGridColor.Size = new System.Drawing.Size(23, 23);
            this.btnGridColor.TabIndex = 16;
            this.btnGridColor.UseVisualStyleBackColor = false;
            this.btnGridColor.Click += new System.EventHandler(this.btnGridColor_Click);
            // 
            // ViewOptions
            // 
            this.AcceptButton = this.button1;
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.CancelButton = this.button2;
            this.ClientSize = new System.Drawing.Size(419, 343);
            this.Controls.Add(this.groupBox3);
            this.Controls.Add(this.groupBox2);
            this.Controls.Add(this.button2);
            this.Controls.Add(this.button1);
            this.Controls.Add(this.groupBox1);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "ViewOptions";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterParent;
            this.Text = "View Options";
            this.Load += new System.EventHandler(this.ViewOptions_Load);
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.nudGridSize)).EndInit();
            this.groupBox2.ResumeLayout(false);
            this.groupBox2.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.nudAngleSnap)).EndInit();
            this.groupBox3.ResumeLayout(false);
            this.groupBox3.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.nudArrowKeysLargeStep)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudArrowKeysShortStep)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.Button button2;
        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.CheckBox chkSnapToGrid;
        private System.Windows.Forms.CheckBox chkShowGrid;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.NumericUpDown nudGridSize;
        private System.Windows.Forms.GroupBox groupBox2;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.NumericUpDown nudAngleSnap;
        private System.Windows.Forms.GroupBox groupBox3;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.NumericUpDown nudArrowKeysShortStep;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.NumericUpDown nudArrowKeysLargeStep;
        private System.Windows.Forms.Label lblUnit1;
        private System.Windows.Forms.Label lblUnit3;
        private System.Windows.Forms.Label lblUnit2;
        private System.Windows.Forms.Button btnGridColor;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.ComboBox cboGridType;
        private System.Windows.Forms.Label label5;
    }
}