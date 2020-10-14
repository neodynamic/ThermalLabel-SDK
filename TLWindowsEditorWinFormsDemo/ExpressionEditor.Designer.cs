namespace TLWindowsEditorWinFormsDemo
{
    partial class ExpressionEditor
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
            this.txtExpression = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.lstExprCategories = new System.Windows.Forms.ListBox();
            this.lstExprName = new System.Windows.Forms.ListBox();
            this.label3 = new System.Windows.Forms.Label();
            this.label4 = new System.Windows.Forms.Label();
            this.txtExprDescription = new System.Windows.Forms.TextBox();
            this.button3 = new System.Windows.Forms.Button();
            this.button1 = new System.Windows.Forms.Button();
            this.txtExprExample = new System.Windows.Forms.TextBox();
            this.label5 = new System.Windows.Forms.Label();
            this.txtExprSyntax = new System.Windows.Forms.TextBox();
            this.label6 = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(13, 13);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(61, 13);
            this.label1.TabIndex = 0;
            this.label1.Text = "Expression:";
            // 
            // txtExpression
            // 
            this.txtExpression.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.txtExpression.Font = new System.Drawing.Font("Courier New", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtExpression.Location = new System.Drawing.Point(16, 30);
            this.txtExpression.Multiline = true;
            this.txtExpression.Name = "txtExpression";
            this.txtExpression.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.txtExpression.Size = new System.Drawing.Size(757, 83);
            this.txtExpression.TabIndex = 1;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(16, 130);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(52, 13);
            this.label2.TabIndex = 2;
            this.label2.Text = "Category:";
            // 
            // lstExprCategories
            // 
            this.lstExprCategories.FormattingEnabled = true;
            this.lstExprCategories.Location = new System.Drawing.Point(16, 146);
            this.lstExprCategories.Name = "lstExprCategories";
            this.lstExprCategories.Size = new System.Drawing.Size(170, 290);
            this.lstExprCategories.TabIndex = 3;
            this.lstExprCategories.SelectedIndexChanged += new System.EventHandler(this.lstExprCategories_SelectedIndexChanged);
            // 
            // lstExprName
            // 
            this.lstExprName.FormattingEnabled = true;
            this.lstExprName.Location = new System.Drawing.Point(216, 146);
            this.lstExprName.Name = "lstExprName";
            this.lstExprName.Size = new System.Drawing.Size(170, 290);
            this.lstExprName.TabIndex = 5;
            this.lstExprName.SelectedIndexChanged += new System.EventHandler(this.lstExprName_SelectedIndexChanged);
            this.lstExprName.DoubleClick += new System.EventHandler(this.lstExprName_DoubleClick);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(216, 130);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(38, 13);
            this.label3.TabIndex = 4;
            this.label3.Text = "Name:";
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(414, 130);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(63, 13);
            this.label4.TabIndex = 6;
            this.label4.Text = "Description:";
            // 
            // txtExprDescription
            // 
            this.txtExprDescription.Location = new System.Drawing.Point(417, 146);
            this.txtExprDescription.Multiline = true;
            this.txtExprDescription.Name = "txtExprDescription";
            this.txtExprDescription.ReadOnly = true;
            this.txtExprDescription.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.txtExprDescription.Size = new System.Drawing.Size(356, 95);
            this.txtExprDescription.TabIndex = 7;
            // 
            // button3
            // 
            this.button3.DialogResult = System.Windows.Forms.DialogResult.Cancel;
            this.button3.Location = new System.Drawing.Point(698, 458);
            this.button3.Name = "button3";
            this.button3.Size = new System.Drawing.Size(75, 23);
            this.button3.TabIndex = 13;
            this.button3.Text = "&Cancel";
            this.button3.UseVisualStyleBackColor = true;
            // 
            // button1
            // 
            this.button1.DialogResult = System.Windows.Forms.DialogResult.OK;
            this.button1.Location = new System.Drawing.Point(591, 458);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(76, 23);
            this.button1.TabIndex = 12;
            this.button1.Text = "OK";
            this.button1.UseVisualStyleBackColor = true;
            // 
            // txtExprExample
            // 
            this.txtExprExample.Location = new System.Drawing.Point(417, 366);
            this.txtExprExample.Multiline = true;
            this.txtExprExample.Name = "txtExprExample";
            this.txtExprExample.ReadOnly = true;
            this.txtExprExample.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.txtExprExample.Size = new System.Drawing.Size(356, 70);
            this.txtExprExample.TabIndex = 11;
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(414, 350);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(50, 13);
            this.label5.TabIndex = 10;
            this.label5.Text = "Example:";
            // 
            // txtExprSyntax
            // 
            this.txtExprSyntax.Location = new System.Drawing.Point(417, 272);
            this.txtExprSyntax.Multiline = true;
            this.txtExprSyntax.Name = "txtExprSyntax";
            this.txtExprSyntax.ReadOnly = true;
            this.txtExprSyntax.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.txtExprSyntax.Size = new System.Drawing.Size(356, 70);
            this.txtExprSyntax.TabIndex = 9;
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(414, 256);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(42, 13);
            this.label6.TabIndex = 8;
            this.label6.Text = "Syntax:";
            // 
            // ExpressionEditor
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.CancelButton = this.button3;
            this.ClientSize = new System.Drawing.Size(789, 496);
            this.Controls.Add(this.txtExprSyntax);
            this.Controls.Add(this.label6);
            this.Controls.Add(this.txtExprExample);
            this.Controls.Add(this.label5);
            this.Controls.Add(this.button1);
            this.Controls.Add(this.button3);
            this.Controls.Add(this.txtExprDescription);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.lstExprName);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.lstExprCategories);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.txtExpression);
            this.Controls.Add(this.label1);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "ExpressionEditor";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Expression Editor";
            this.Load += new System.EventHandler(this.ExpressionEditor_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TextBox txtExpression;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.ListBox lstExprCategories;
        private System.Windows.Forms.ListBox lstExprName;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.TextBox txtExprDescription;
        private System.Windows.Forms.Button button3;
        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.TextBox txtExprExample;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.TextBox txtExprSyntax;
        private System.Windows.Forms.Label label6;
    }
}