namespace TLWindowsEditorWinFormsDemo
{
    partial class Gallery
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

        #region Component Designer generated code

        /// <summary> 
        /// Required method for Designer support - do not modify 
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Gallery));
            this.fpnlContainer = new System.Windows.Forms.FlowLayoutPanel();
            this.toolStrip1 = new System.Windows.Forms.ToolStrip();
            this.tbbRefresh = new System.Windows.Forms.ToolStripButton();
            this.pbGallery = new System.Windows.Forms.ToolStripProgressBar();
            this.toolStripLabel1 = new System.Windows.Forms.ToolStripLabel();
            this.lblGallerySource = new System.Windows.Forms.ToolStripLabel();
            this.toolStrip1.SuspendLayout();
            this.SuspendLayout();
            // 
            // fpnlContainer
            // 
            this.fpnlContainer.AutoScroll = true;
            this.fpnlContainer.BackColor = System.Drawing.Color.LightSteelBlue;
            this.fpnlContainer.Dock = System.Windows.Forms.DockStyle.Fill;
            this.fpnlContainer.Location = new System.Drawing.Point(0, 25);
            this.fpnlContainer.Name = "fpnlContainer";
            this.fpnlContainer.Size = new System.Drawing.Size(771, 401);
            this.fpnlContainer.TabIndex = 0;
            // 
            // toolStrip1
            // 
            this.toolStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.tbbRefresh,
            this.pbGallery,
            this.toolStripLabel1,
            this.lblGallerySource});
            this.toolStrip1.Location = new System.Drawing.Point(0, 0);
            this.toolStrip1.Name = "toolStrip1";
            this.toolStrip1.Size = new System.Drawing.Size(771, 25);
            this.toolStrip1.TabIndex = 1;
            this.toolStrip1.Text = "toolStrip1";
            // 
            // tbbRefresh
            // 
            this.tbbRefresh.Image = ((System.Drawing.Image)(resources.GetObject("tbbRefresh.Image")));
            this.tbbRefresh.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tbbRefresh.Name = "tbbRefresh";
            this.tbbRefresh.Size = new System.Drawing.Size(75, 22);
            this.tbbRefresh.Text = "Refresh...";
            this.tbbRefresh.Click += new System.EventHandler(this.tbbRefresh_Click);
            // 
            // pbGallery
            // 
            this.pbGallery.Name = "pbGallery";
            this.pbGallery.Size = new System.Drawing.Size(100, 22);
            // 
            // toolStripLabel1
            // 
            this.toolStripLabel1.Name = "toolStripLabel1";
            this.toolStripLabel1.Size = new System.Drawing.Size(46, 22);
            this.toolStripLabel1.Text = "Source:";
            // 
            // lblGallerySource
            // 
            this.lblGallerySource.Name = "lblGallerySource";
            this.lblGallerySource.Size = new System.Drawing.Size(0, 22);
            // 
            // Gallery
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.fpnlContainer);
            this.Controls.Add(this.toolStrip1);
            this.Name = "Gallery";
            this.Size = new System.Drawing.Size(771, 426);
            this.toolStrip1.ResumeLayout(false);
            this.toolStrip1.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.FlowLayoutPanel fpnlContainer;
        private System.Windows.Forms.ToolStrip toolStrip1;
        private System.Windows.Forms.ToolStripButton tbbRefresh;
        private System.Windows.Forms.ToolStripProgressBar pbGallery;
        private System.Windows.Forms.ToolStripLabel toolStripLabel1;
        private System.Windows.Forms.ToolStripLabel lblGallerySource;
    }
}
