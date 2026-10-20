using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Drawing.Design;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Reflection;
using Neodynamic.SDK.Printing;
using System.ComponentModel.Design;

namespace TLWindowsEditorWinFormsDemo
{
    //Based on https://stackoverflow.com/a/46102589

    public class ColorHexEditor : UITypeEditor
    {
        public override System.Drawing.Design.UITypeEditorEditStyle GetEditStyle(ITypeDescriptorContext context)
        {
            return System.Drawing.Design.UITypeEditorEditStyle.Modal;
        }

        public override object EditValue(ITypeDescriptorContext context, IServiceProvider provider, object value)
        {
            string colorHex = (string)value;

            ColorDialog cd = new ColorDialog();
            cd.Color = ColorTranslator.FromHtml(colorHex);
            if (cd.ShowDialog() == DialogResult.OK)
                colorHex = ColorTranslator.ToHtml(cd.Color);
            return colorHex;
        }
    }

    public class ImageFileEditor : UITypeEditor
    {
        public override System.Drawing.Design.UITypeEditorEditStyle GetEditStyle(ITypeDescriptorContext context)
        {
            return System.Drawing.Design.UITypeEditorEditStyle.Modal;
        }

        public override object EditValue(ITypeDescriptorContext context, IServiceProvider provider, object value)
        {
            string filePath = (string)value;

            OpenFileDialog ofd = new OpenFileDialog();
            ofd.FileName = filePath;
            ofd.Filter = "Image files (*.jpg, *.jpeg, *.png)|*.jpg;*.jpeg;*.png";
            if (ofd.ShowDialog() == DialogResult.OK)
                filePath = ofd.FileName;
            return filePath;
        }
    }

    public class ExpressionUIEditor : UITypeEditor
    {
        public override System.Drawing.Design.UITypeEditorEditStyle GetEditStyle(ITypeDescriptorContext context)
        {
            return System.Drawing.Design.UITypeEditorEditStyle.Modal;
        }

        public override object EditValue(ITypeDescriptorContext context, IServiceProvider provider, object value)
        {
            string expr = (string)value;

            Global.ExprEditor.Expression = expr;

            if (Global.ExprEditor.ShowDialog() == DialogResult.OK)
                expr = Global.ExprEditor.Expression;

            return expr;
        }
    }

    public class RtfUIEditor : UITypeEditor
    {
        
        public override System.Drawing.Design.UITypeEditorEditStyle GetEditStyle(ITypeDescriptorContext context)
        {
            return System.Drawing.Design.UITypeEditorEditStyle.Modal;
        }

        public override object EditValue(ITypeDescriptorContext context, IServiceProvider provider, object value)
        {

            using (MiniRtfEditor editorForm = new MiniRtfEditor())
            {
                // Pass the current RTF string into the editor
                editorForm.RtfContent = value as string;

                // Show the form as a modal dialog within Visual Studio
                if (editorForm.ShowDialog() == DialogResult.OK)
                {
                    // Return the modified RTF string back to the Property Grid
                    return editorForm.RtfContent;
                }
            }

            return value;
        }

    }

    public class DataFieldConverter : StringConverter
    {
        public override bool GetStandardValuesSupported(ITypeDescriptorContext context)
        {
            return true;
        }

        public override TypeConverter.StandardValuesCollection GetStandardValues(ITypeDescriptorContext context)
        {

            if (Global.DataFields != null && Global.DataFields.Count > 0)
                return new StandardValuesCollection(Global.DataFields);
            else
                return null;
            
        }

        public override bool GetStandardValuesExclusive(ITypeDescriptorContext context)
        {
            return false;
        }
        
    }

    
    public class TextItemMetadata
    {
        [Browsable(false)]
        public string InputMaskPattern { get; set; }
        [Browsable(false)]
        public char InputMaskPromptChar { get; set; }
        [Editor(typeof(ColorHexEditor), typeof(UITypeEditor))]
        [RefreshProperties(System.ComponentModel.RefreshProperties.All)]
        public string BackColorHex { get; set; }
        [Editor(typeof(ColorHexEditor), typeof(UITypeEditor))]
        [RefreshProperties(System.ComponentModel.RefreshProperties.All)]
        public string BorderColorHex { get; set; }
        [Editor(typeof(ColorHexEditor), typeof(UITypeEditor))]
        [RefreshProperties(System.ComponentModel.RefreshProperties.All)]
        public string ForeColorHex { get; set; }
        [Editor(typeof(ColorHexEditor), typeof(UITypeEditor))]
        [RefreshProperties(System.ComponentModel.RefreshProperties.All)]

        public string StrokeColorHex { get; set; }

        //[Editor(typeof(MultilineStringEditor), typeof(UITypeEditor))]
        [Editor(typeof(RtfUIEditor), typeof(System.Drawing.Design.UITypeEditor))]
        [RefreshProperties(System.ComponentModel.RefreshProperties.All)]

        public string Text { get; set; }

        //[TypeConverter(typeof(TextAlignmentConverter))]
        //public TextAlignment TextAlignment { get; set; }
    }

    public class BarcodeItemMetadata
    {
        [Editor(typeof(ColorHexEditor), typeof(UITypeEditor))]
        [RefreshProperties(System.ComponentModel.RefreshProperties.All)]
        public string BackColorHex { get; set; }
        [Editor(typeof(ColorHexEditor), typeof(UITypeEditor))]
        [RefreshProperties(System.ComponentModel.RefreshProperties.All)]
        public string BorderColorHex { get; set; }
        [Editor(typeof(ColorHexEditor), typeof(UITypeEditor))]
        [RefreshProperties(System.ComponentModel.RefreshProperties.All)]
        public string ForeColorHex { get; set; }
        [Editor(typeof(ColorHexEditor), typeof(UITypeEditor))]
        [RefreshProperties(System.ComponentModel.RefreshProperties.All)]
        public string TextForeColorHex { get; set; }
        [Editor(typeof(ColorHexEditor), typeof(UITypeEditor))]
        [RefreshProperties(System.ComponentModel.RefreshProperties.All)]
        public string BarColorHex { get; set; }

        [Browsable(false)]
        public BarcodeSymbology Symbology { get; set; }

        [Editor(typeof(MultilineStringEditor), typeof(UITypeEditor))]
        [RefreshProperties(System.ComponentModel.RefreshProperties.All)]

        public string Text { get; set; }

        [Editor(typeof(MultilineStringEditor), typeof(UITypeEditor))]
        [RefreshProperties(System.ComponentModel.RefreshProperties.All)]

        public string HumanReadableText { get; set; }
    }

    public class ShapeItemMetadata
    {
        [Editor(typeof(ColorHexEditor), typeof(UITypeEditor))]
        [RefreshProperties(System.ComponentModel.RefreshProperties.All)]
        public string StrokeColorHex { get; set; }
        
    }

    public class ClosedShapeItemMetadata
    {
        [Editor(typeof(ColorHexEditor), typeof(UITypeEditor))]
        [RefreshProperties(System.ComponentModel.RefreshProperties.All)]
        public string FillColorHex { get; set; }

    }

    public class ImageItemMetadata
    {
        [Editor(typeof(ImageFileEditor), typeof(UITypeEditor))]
        [RefreshProperties(System.ComponentModel.RefreshProperties.All)]
        public string SourceFile { get; set; }

        [Editor(typeof(MultilineStringEditor), typeof(UITypeEditor))]
        [RefreshProperties(System.ComponentModel.RefreshProperties.All)]

        public string SourceBase64 { get; set; }
    }

   

    public class ItemMetadata
    {
        [Browsable(false)]
        public bool Editable { get; set; }

        [Browsable(false)]
        public bool IsDesignTime { get; set; }

        [Editor(typeof(MultilineStringEditor), typeof(UITypeEditor))]
        [RefreshProperties(System.ComponentModel.RefreshProperties.All)]

        public string Comments { get; set; }

        [Editor(typeof(ExpressionUIEditor), typeof(UITypeEditor))]
        [RefreshProperties(System.ComponentModel.RefreshProperties.All)]
        public string Expression { get; set; }

        [TypeConverter(typeof(DataFieldConverter))]
        public string DataField { get; set; }

        [Browsable(false)]
        public bool GroupName { get; set; }
    }



    //public class FontMetadata
    //{
    //    [TypeConverter(typeof(FontNameConverter))]
    //    public string Name { get; set; }
    //}

    //public class FontNameConverter : StringConverter
    //{
    //    public override bool GetStandardValuesSupported(ITypeDescriptorContext context)
    //    {
    //        return true;
    //    }

    //    public override TypeConverter.StandardValuesCollection GetStandardValues(ITypeDescriptorContext context)
    //    {
    //        var myFonts = new List<string>();

    //        myFonts.Add("Arial");
    //        myFonts.Add("ZPL Font 0");

    //        return new StandardValuesCollection(myFonts);
    //    }

    //    public override bool GetStandardValuesExclusive(ITypeDescriptorContext context)
    //    {
    //        return false;
    //    }

    //}

    //public class TextAlignmentConverter : EnumConverter
    //{
    //    public TextAlignmentConverter() : base(typeof(Neodynamic.SDK.Printing.TextAlignment))
    //    {
    //    }
    //    public override StandardValuesCollection GetStandardValues(
    //        ITypeDescriptorContext context)
    //    {
    //        var vals = new List<Neodynamic.SDK.Printing.TextAlignment> { Neodynamic.SDK.Printing.TextAlignment.Left, Neodynamic.SDK.Printing.TextAlignment.Right, Neodynamic.SDK.Printing.TextAlignment.Center };

    //        return new StandardValuesCollection(vals);
    //    }
    //}

    //Based on https://stackoverflow.com/a/51618536
    public class CustomItemWrapper : CustomTypeDescriptor
    {
        public object WrappedObject { get; private set; }
        public List<string> BrowsableProperties { get; private set; }
        public CustomItemWrapper(object o)
            : base(TypeDescriptor.GetProvider(o).GetTypeDescriptor(o))
        {
            WrappedObject = o;

            var browsableProps = new List<string>();

            if (o is BarcodeItem) {

                string[] properties = BarcodeItemUtils.GetRelatedProperties(((BarcodeItem)o).Symbology);

                BrowsableProperties = new List<string>(properties);
            }
            else {

                var props = o.GetType().GetProperties();
                foreach (var p in props)
                {
                    browsableProps.Add(p.Name);
                }

                BrowsableProperties = browsableProps;

                
            }
        }
        public override PropertyDescriptorCollection GetProperties()
        {
            return this.GetProperties(new Attribute[] { });
        }
        public override PropertyDescriptorCollection GetProperties(Attribute[] attributes)
        {
            var properties = base.GetProperties(attributes).Cast<PropertyDescriptor>()
                                 .Where(p => BrowsableProperties.Contains(p.Name))
                                 .Select(p => TypeDescriptor.CreateProperty(
                                     WrappedObject.GetType(),
                                     p,
                                     p.Attributes.Cast<Attribute>().ToArray()))
                                 .ToArray();
            return new PropertyDescriptorCollection(properties);
        }
    }


    //Declare a class that inherits from ToolStripControlHost.
    public class ToolStripSymbols : ToolStripControlHost
    {
        
        public ToolStripSymbols() : base(new UCSymbols()) {

            UCSymbolsControl.CreateSymbolsFromFont(Convert.FromBase64String(Global.CustomSymbolFontBase64), "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");

            UCSymbolsControl.Size = new Size(500, 440);

            UCSymbolsControl.MinimumSize = UCSymbolsControl.Size;

        }



        public UCSymbols UCSymbolsControl
        {
            get
            {
                return Control as UCSymbols;
            }
        }

        

        // Subscribe and unsubscribe the control events you wish to expose.
        protected override void OnSubscribeControlEvents(Control c)
        {
            // Call the base so the base events are connected.
            base.OnSubscribeControlEvents(c);

            // Cast the control to a UCSymbols control.
            UCSymbols symbolsControl = (UCSymbols)c;

            // Add the event.
            symbolsControl.SymbolChanged += new EventHandler(OnSymbolChanged);
        }

        protected override void OnUnsubscribeControlEvents(Control c)
        {
            // Call the base method so the basic events are unsubscribed.
            base.OnUnsubscribeControlEvents(c);

            // Cast the control to a UCSymbols control.
            UCSymbols symbolsControl = (UCSymbols)c;

            // Remove the event.
            symbolsControl.SymbolChanged -= new EventHandler(OnSymbolChanged);
        }

        // Declare the SymbolChanged event.
        public event EventHandler SymbolChanged;

        // Raise the SymbolChanged event.
        private void OnSymbolChanged(object sender, EventArgs e)
        {
            if (SymbolChanged != null)
            {
                SymbolChanged(sender, e);
            }
        }
    }

    #region DropDown Table Sizer
    // Credits
    // https://www.codeproject.com/Articles/15892/Adding-a-Custom-Control-to-a-ToolStripDropDownButt


    public class TableSizeEventArgs : EventArgs
    {
        public TableSizeEventArgs(Size selectedSize)
        {
            this.selectedSize = selectedSize;
        }

        public Size SelectedSize
        {
            get { return this.selectedSize; }
        }

        private Size selectedSize;
    }

    public delegate void TableSizeSelectedEventHandler(object sender, TableSizeEventArgs e);

    class TableSizeControl : Control
    {
        public event TableSizeSelectedEventHandler TableSizeSelected;
        public event EventHandler SelectionCancelled;

        public TableSizeControl()
        {
            DoubleBuffered = true;

            SetStyle(ControlStyles.ResizeRedraw, true);
            UpdateLayout();
        }

        public int CellSpacing
        {
            get { return this.cellSpacing; }
            set
            {
                if (value <= 0 || value + 1 > CellSize)
                    throw new ArgumentOutOfRangeException();

                if (this.cellSpacing != value)
                {
                    this.cellSpacing = value;
                    UpdateLayout();
                }
            }
        }

        public int CellSize
        {
            get { return this.cellSize; }
            set
            {
                if (value <= 4)
                    throw new ArgumentOutOfRangeException();

                if (this.cellSize != value)
                {
                    this.cellSize = value;
                    UpdateLayout();
                }
            }
        }

        public Size MinimumRange
        {
            get { return this.minimumRange; }
            set
            {
                if ((value.Width < 0 || value.Height < 0) ||
                    (value.Width > 0 && value.Width >= this.maximumRange.Width) ||
                    (value.Height > 0 && value.Height >= this.maximumRange.Height))
                    throw new ArgumentOutOfRangeException();

                this.minimumRange = value;
                SelectedSize = ConstrainSizeToLimits(SelectedSize);
            }
        }

        public Size MaximumRange
        {
            get { return this.maximumRange; }
            set
            {
                if ((value.Width < 0 || value.Height < 0) ||
                    (value.Width > 0 && value.Width <= this.minimumRange.Width) ||
                    (value.Height > 0 && value.Height <= this.minimumRange.Height))
                    throw new ArgumentOutOfRangeException();

                this.maximumRange = value;
                SelectedSize = ConstrainSizeToLimits(SelectedSize);
                VisibleRange = ConstrainSizeToLimits(VisibleRange);
            }
        }

        public Size VisibleRange
        {
            get { return this.visibleRange; }
            set
            {
                Size size = ConstrainSizeToLimits(value);

                if (this.visibleRange != size)
                {
                    this.visibleRange = size;
                    UpdateLayout();
                }
            }
        }

        public Size SelectedSize
        {
            get { return this.checkedRange; }
            set
            {
                Size size = ConstrainSizeToLimits(value);

                if (this.checkedRange != size)
                {
                    this.checkedRange = size;

                    buttonText = (this.checkedRange.Width > 0 && this.checkedRange.Height > 0) ?
                        String.Format("{0} x {1} Table", this.checkedRange.Width, this.checkedRange.Height) :
                        "Cancel";

                    Invalidate();
                }

                size.Width = Math.Max(size.Width, VisibleRange.Width);
                size.Height = Math.Max(size.Height, VisibleRange.Height);
                VisibleRange = size;
            }
        }

        protected enum HitPart
        {
            Border,
            Pool,
            Button,
        }

        protected struct HitInfo
        {
            public HitPart part;
            public int col;
            public int row;
        }

        protected HitInfo QueryHit(Point pt)
        {
            HitInfo info = new HitInfo();

            Rectangle poolBounds = PoolBounds;

            if (poolBounds.Contains(pt))
            {
                info.part = HitPart.Pool;
                info.col = (pt.X - poolBounds.X) / CellSize;
                info.row = (pt.Y - poolBounds.Y) / CellSize;
            }
            else
            {
                info.part = (pt.Y > poolBounds.Bottom) ? HitPart.Button : HitPart.Border;
                info.col = -1;
                info.row = -1;
            }

            return info;
        }

        protected virtual void OnSelectionCancelled(EventArgs e)
        {
            if (SelectionCancelled != null)
                SelectionCancelled(this, e);
        }

        protected virtual void OnTableSizeSelected(TableSizeEventArgs e)
        {
            if (TableSizeSelected != null)
                TableSizeSelected(this, e);
        }

        protected override void OnVisibleChanged(EventArgs e)
        {
            base.OnVisibleChanged(e);

            if (Visible)
                this.selectUsingMouse = true;
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);

            Brush brush = new SolidBrush(this.selectedColor);

            using (Pen pen = new Pen(this.borderColor))
            {
                int extent = CellSize - CellSpacing - 1;

                Rectangle cellRect = new Rectangle(0, PoolBounds.Top, extent, extent);

                for (int row = 0; row < visibleRange.Height; ++row, cellRect.Y += CellSize)
                {
                    cellRect.X = PoolBounds.Left;

                    for (int col = 0; col < visibleRange.Width; ++col, cellRect.X += CellSize)
                    {
                        if (col < checkedRange.Width && row < checkedRange.Height)
                            e.Graphics.FillRectangle(brush, cellRect);

                        e.Graphics.DrawRectangle(pen, cellRect);
                    }
                }
            }

            brush.Dispose();

            using (Brush textBrush = new SolidBrush(this.textColor))
            {
                Rectangle bounds = ClientRectangle;
                bounds.Y = PoolBounds.Bottom + CellSpacing;
                bounds.Height = Font.Height;

                StringFormat format = new StringFormat();
                format.LineAlignment = StringAlignment.Center;
                format.Alignment = StringAlignment.Center;

                e.Graphics.DrawString(buttonText, Font, textBrush, bounds, format);
            }
        }

        protected override bool ProcessDialogKey(Keys keyData)
        {
            bool eatKey = true;

            Size newCheckedRange = SelectedSize;

            switch (keyData)
            {
                case Keys.Up:
                    {
                        this.selectUsingMouse = false;

                        if (newCheckedRange.Height > 0)
                            --newCheckedRange.Height;
                        break;
                    }

                case Keys.Down:
                    {
                        this.selectUsingMouse = false;

                        ++newCheckedRange.Height;
                        newCheckedRange.Width = Math.Max(1, newCheckedRange.Width);
                        break;
                    }

                case Keys.Left:
                    {
                        this.selectUsingMouse = false;

                        if (newCheckedRange.Width > 0)
                            --newCheckedRange.Width;
                        break;
                    }

                case Keys.Right:
                    {
                        this.selectUsingMouse = false;

                        ++newCheckedRange.Width;
                        newCheckedRange.Height = Math.Max(1, newCheckedRange.Height);
                        break;
                    }

                case Keys.Cancel:
                    {
                        OnSelectionCancelled(new EventArgs());
                        break;
                    }

                case Keys.Enter:
                    {
                        EndSelection();
                        break;
                    }

                default:
                    eatKey = false;
                    break;
            }

            SetSelection(newCheckedRange);

            return eatKey || base.ProcessDialogKey(keyData);
        }

        protected override void OnMouseDown(MouseEventArgs e)
        {
            base.OnMouseDown(e);

            HitInfo hit = QueryHit(e.Location);

            if (!this.selectUsingMouse || hit.part == HitPart.Button)
            {
                Capture = false;
                EndSelection();
            }
            else if (hit.part == HitPart.Pool)
            {
                if (this.selectUsingMouse)
                    ExpandPoolToPt(e.Location);

                Capture = true;
            }
        }

        protected override void OnMouseUp(MouseEventArgs e)
        {
            base.OnMouseUp(e);

            if (Capture)
            {
                Capture = false;
                EndSelection();
            }
        }

        protected override void OnMouseMove(MouseEventArgs e)
        {
            base.OnMouseMove(e);

            if (this.selectUsingMouse)
            {
                HitInfo hit = QueryHit(e.Location);

                if (Capture)
                    ExpandPoolToPt(e.Location);

                SelectedSize = (hit.part == HitPart.Pool) ?
                    new Size(hit.col + 1, hit.row + 1) :
                    new Size(0, 0);
            }
        }

        #region Implementation

        private Rectangle PoolBounds
        {
            get
            {
                int cx = CellSize * VisibleRange.Width;
                int cy = CellSize * VisibleRange.Height;

                return new Rectangle(CellSpacing * 2, CellSpacing, cx, cy);
            }
        }

        private Size LayoutSize
        {
            get { return PoolBounds.Size + new Size(CellSpacing * 3, CellSpacing * 2 + Font.Height); }
        }

        private void UpdateLayout()
        {
            this.Size = LayoutSize;
        }

        private void SetSelection(Size size)
        {
            if (SelectedSize != ConstrainSizeToLimits(size))
            {
                SelectedSize = size;

                ExpandPool(
                    new Size(
                        Math.Max(0, SelectedSize.Width - VisibleRange.Width),
                        Math.Max(0, SelectedSize.Height - VisibleRange.Height)));
            }
        }

        private void EndSelection()
        {
            if (SelectedSize.Width > 0 && SelectedSize.Height > 0)
                OnTableSizeSelected(new TableSizeEventArgs(SelectedSize));
            else
                OnSelectionCancelled(new EventArgs());
        }

        private Size ConstrainSizeToLimits(Size size)
        {
            if (MinimumRange.Width > 0)
                size.Width = Math.Max(MinimumRange.Width, size.Width);

            if (MaximumRange.Width > 0)
                size.Width = Math.Min(MaximumRange.Width, size.Width);

            if (MinimumRange.Height > 0)
                size.Height = Math.Max(MinimumRange.Height, size.Height);

            if (MaximumRange.Height > 0)
                size.Height = Math.Min(MaximumRange.Height, size.Height);

            return size;
        }

        private void ExpandPoolToPt(Point pt)
        {
            Rectangle bounds = PoolBounds;

            Size growSize = new Size(0, 0);

            if (pt.X > bounds.Right - CellSpacing)
                growSize.Width = (pt.X - bounds.Right) / CellSize + 1;

            if (pt.Y > bounds.Bottom - CellSpacing)
                growSize.Height = (pt.Y - bounds.Bottom) / CellSize + 1;

            ExpandPool(growSize);
        }

        private void ExpandPool(Size sizeIncrease)
        {
            Size newSize = VisibleRange;

            if (sizeIncrease.Width > 0)
                if (MaximumRange.Width <= 0 || VisibleRange.Width + sizeIncrease.Width <= MaximumRange.Width)
                    newSize.Width += sizeIncrease.Width;

            if (sizeIncrease.Height > 0)
                if (MaximumRange.Height <= 0 || VisibleRange.Height + sizeIncrease.Height <= MaximumRange.Height)
                    newSize.Height += sizeIncrease.Height;

            VisibleRange = newSize;
        }
        #endregion

        // Model state
        private Size minimumRange = new Size(0, 0);
        private Size maximumRange = new Size(10, 10);
        private Size visibleRange = new Size(5, 4);
        private Size checkedRange = new Size(0, 0);

        private string buttonText = "Cancel";

        // Presentation
        private int cellSize = 24;
        private int cellSpacing = 2;

        private System.Drawing.Color selectedColor = SystemColors.Highlight;
        private System.Drawing.Color borderColor = SystemColors.WindowText;
        private System.Drawing.Color textColor = SystemColors.WindowText;

        // Interaction state
        private bool selectUsingMouse = true;
    }

    class ToolStripTableSizeSelector : ToolStripDropDown
    {
        public ToolStripTableSizeSelector()
        {
            Items.Add(new ToolStripControlHost(control));

            control.TableSizeSelected += new TableSizeSelectedEventHandler(control_TableSizeSelected);
            control.SelectionCancelled += new EventHandler(control_SelectionCancelled);
        }

        public TableSizeControl Selector
        {
            get { return this.control; }
        }

        private void control_SelectionCancelled(object sender, EventArgs e)
        {
            this.Close(ToolStripDropDownCloseReason.CloseCalled);
        }

        private void control_TableSizeSelected(object sender, TableSizeEventArgs e)
        {
            this.Close(ToolStripDropDownCloseReason.CloseCalled);
        }

        protected override void OnOpening(System.ComponentModel.CancelEventArgs e)
        {
            base.OnOpening(e);

            ToolStripProfessionalRenderer renderer = Renderer as ToolStripProfessionalRenderer;

            if (renderer != null)
                control.BackColor = renderer.ColorTable.ToolStripDropDownBackground;

            //control.SelectedSize = new Size(0, 0);
            //control.VisibleRange = new Size(5, 4);
        }

        protected override void OnOpened(EventArgs e)
        {
            base.OnOpened(e);
            control.Focus();
        }

        private TableSizeControl control = new TableSizeControl();
    }
    #endregion


    #region RTF Editor
    
    public class MiniRtfEditor : Form
    {
        private ToolStrip toolStrip;
        private RichTextBox richTextBox;

        // Formatting Toolbar Items
        private ToolStripButton btnBold;
        private ToolStripButton btnItalic;
        private ToolStripButton btnUnderline;
        private ToolStripButton btnStrikeout;
        private ToolStripComboBox comboFontFamily;
        private ToolStripComboBox comboFontSize;
        private ToolStripButton btnAlignLeft;
        private ToolStripButton btnAlignCenter;
        private ToolStripButton btnAlignRight;
        private ToolStripButton btnForeColor;
        private ToolStripButton btnBackColor;
        private ColorDialog colorDialog1 = new ColorDialog();
        private ToolStripButton btnOk;
        private ToolStripButton btnCancel;

        public MiniRtfEditor()
        {
            InitializeComponentCustom();
            SetupEditorEvents();
            LoadSystemFonts();
        }

        private Image IconFromBase64(string b64)
        {
            using (var ms = new System.IO.MemoryStream(Convert.FromBase64String(b64)))
            {
                return Image.FromStream(ms);
            }
        }

        private void InitializeComponentCustom()
        {
            this.Text = "Rich Text Format Editor";
            this.Size = new Size(700, 400);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedDialog;

            toolStrip = new ToolStrip();
            richTextBox = new RichTextBox { Dock = DockStyle.Fill, AcceptsTab = true };

            btnOk = new ToolStripButton("OK", IconFromBase64("iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAk0lEQVR42mP8//8/AyWAcdQA4g1IjExM+PDjw/wDBw4wvH//npEkA2CaN2zYAOYC9Swg2oDERKDmD9g1YxhQWFj4H6iY4cGDB4n79+9fALS5AMjv37ADu2YMAwwNDR0EBAT2M3AAOT8YCkGaL1y4gFMzVi8ICgo6AKn9IJdAQSBQzQaSYoGRkRFsCCHNRMfCMDcAAMTif+GXMy0YAAAAAElFTkSuQmCC"), (s, e) => {
                this.DialogResult = DialogResult.OK;
                this.Close();
            });
            btnCancel = new ToolStripButton("Cancel", IconFromBase64("iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABRUlEQVR42q2SvVaDMBiGXzY24qaTYXQqHZmAO2DtyJXp5ih3QL2Cpptbs5WNZMuGbyhHoRbrUXMOPwfyPt+TLwn6vsdfRvD/gKoQeGzMYmJTSDw3+jKg4k8pFbSWFyE+HGILpXLsOj0H+Mq3shunWrRnkFNYwZgIbwrWIY4Ovf5qIMSBEwGHPSeXhGiGk6FyayLLMMeaYbXUg4T3HQGAoIlByXDNZUVW61l4eReqIue9oQF4WThWbofVDNo/28ZNUcLoF2rDEqId8tXxs/L3gDT2vagJWI2VPUDzrcyO1wzSWHDt2jfM6+9ZmV9rEeLeOMoAyRQyB0zDzvidWIMNe70LkgECQvwWn0y2c0B6IxB6bZMx6BsnGf44B4RIPp54Zd6ERoPJ3OAhEDwgKqLmNDyBJAx7kzLrls7BlTGaGFY3vwKcj3fRR97hWe/mFAAAAABJRU5ErkJggg=="), (s, e) => {
                this.DialogResult = DialogResult.Cancel;
                this.Close();
            });

            // Text formatting buttons
            btnBold = new ToolStripButton(IconFromBase64("iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAbUlEQVR42mP8//8/AyWAcXAZwMjJiMu0jww/GAqA9Aag+g/4DDAAUudh/P/f/zMCxRyAzP1AA0AgEah+AV4vILsCZABcDGLAQ6B6BZIMoMgFKOAHw0IgWYA3DKjuApLDAG4buS6gOB2QA4aBAQCn6YLhCocpwQAAAABJRU5ErkJggg==")) { ToolTipText = "Bold" };
            btnItalic = new ToolStripButton(IconFromBase64("iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAb0lEQVR42mP8//8/AyWAcXAbwMjIiCEJVM9IvAGcjAoMPxjugzkcDIr/v/9/QJoLOBkDgAasB2oOBGreQLYX0J1NlAFIticCbV9AugFE2I7TACTbC4G2TyDJALSQNwQacIFoA7DFO9mBSCwYBgYAAKIPXeHmuypvAAAAAElFTkSuQmCC")) { ToolTipText = "Italic" };
            btnUnderline = new ToolStripButton(IconFromBase64("iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAk0lEQVR42mP8//8/AyWAcXAZwMjIiGIaUI4RmxhOAwwtHQ0unDhwHsQ2sHBwPH98/wGgmANQbD+yGF4vwGxEtgmb2KgBeAwAhvoBYKjbKygoON6/f/+AoqKiw4MHD/YDY+AiMAYMCLuAk1FBgEOg4cOHD/EwMQEBgYUffnxo+P/9/wOCBpAK8KZEbABvSqTYBeQAAB1lj+FpOGf/AAAAAElFTkSuQmCC")) { ToolTipText = "Underline" };
            btnStrikeout = new ToolStripButton(IconFromBase64("iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABF0lEQVR42s2TsW3DMBBFj53LU+d09ASOunShJzAzgeUJkhE0gkfgCMkGKtORXdKJqezO586d8s+gAFcp5CAIgQ8SpO7x3wdlhmGgW4b5dUBd14zJqWKML1MAls70KkTcf0Q7yYGIBDnL+rg/mkkZVFW14xk3WNp+38uPAO+90xtpRszEXcqpkYO0ADzj/A1KUAAoa8HibnGPb1uFo9XGOOcSM2tYFrbb/Jk9gM0VgEcICh2KfNmT0YHFjboR2PIyvacVAH5soShcAdZYP0Gdgoyd25segjoQtcVzzh0G5gBH2s4GmVTFQYS2xcFmdMDWJuMekCFJxgHB+hKOvvIhZwAeATgVqx1C3JUQNa9LexfA//sX/hzwDddAmVL2+uYlAAAAAElFTkSuQmCC")) { ToolTipText = "Strikeout" };

            btnForeColor = new ToolStripButton(IconFromBase64("iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABPklEQVR42t2SIXaDQBCGNw6XOcLmBIEbwAkaJIpERiWcgFZWpZyAoiIDqpJERUJPAHW4Dg5H/6V5bd5rocR2zc7szP8x8z8mbduKvmN7iYnr/rC7M/t6JkMA7/HUlhULXZe2787jmwD4OuF6VzEz12no0k0Aa508i4ZV6ALQMbPDJh4PWEVKJbnho2jEHPEbAHIUwFpHS4i2GFs3nAgGcoq8KwFy/BuwinIIlunezVVuOAEjn2KlU/bim4MAiCWaC4z+2nmgdd7hjacXL2bFeVcOAWKIiatyi5RIAKAJpcxYARuRALD4FQAxoakUFcss9fkaPLMenjDFBmENAP0AWE4Ax4VqMolYpPvvppnlwVQOL+tgCq7VWsU55C+AYQeEgvzckwWK+RWgq+GP6nYhTb1SWWQKsKD+f3nE+QeAD0bFyWU8ARiOAAAAAElFTkSuQmCC")) { ToolTipText = "Text Color" };

            btnBackColor = new ToolStripButton(IconFromBase64("iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA3ElEQVR42u3RIQ7CMBTG8W8Ot+4EjBt0Dsfk3MYN4AZwAjQOJIrMgdpQ2OGQk3NUIh9ubrxBGCEbTfE0aZo0/f2fqFVVFXTrtPcmAG1HvsCtzKGU4E3IcyA7A5YuUGMq1TYMaqwY4rHzgnEGCOGOvwZMcHK8pJ0BU1y/bQUYR4wTE9wZOMQOMbZNcCtw2gx8PlIZKNsEtwN7L6UrQnfI04v3V33DTWA6dkTkY0aEhZTPyasdPR7ocBNYz63IdUXiS55aiCfu6eFHIF4OVHZWfSpf12a48xd+Xf8AcAeuT9VmpsQfwQAAAABJRU5ErkJggg==")) { ToolTipText = "Text Highlight Color" };

            // Dropdowns for font style
            comboFontFamily = new ToolStripComboBox { Width = 120 };
            comboFontSize = new ToolStripComboBox { Width = 50 };
            comboFontSize.Items.AddRange(new object[] { "8", "9", "10", "11", "12", "14", "16", "18", "20", "24", "28" });
            comboFontSize.SelectedIndex = 4; // Defaults to 12

            // Alignment adjustments
            btnAlignLeft = new ToolStripButton(IconFromBase64("iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAK0lEQVR42mP8//8/AyWAkSoGMDIykmUKUC8jfV0AsnE0DEbDgHZhMKAGAADel0fhTW41lAAAAABJRU5ErkJggg==")) { ToolTipText = "Left" };
            btnAlignCenter = new ToolStripButton(IconFromBase64("iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAL0lEQVR42mP8//8/AyWAkSoGMDIykmUKUC8jdVwA5xDpEpDNo2EwGgbUD4MBNQAAfpdH4e535+gAAAAASUVORK5CYII=")) { ToolTipText = "Center" };
            btnAlignRight = new ToolStripButton(IconFromBase64("iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAALUlEQVR42mP8//8/AyWAkSoGMDIykmUKUC8jdVyAIUiki6jngtEwGA2DATcAAB6XR+G184qKAAAAAElFTkSuQmCC")) { ToolTipText = "Right" };

            // Add everything to the toolbar
            toolStrip.Items.AddRange(new ToolStripItem[] {
            btnOk, btnCancel, new ToolStripSeparator(),
            comboFontFamily, comboFontSize, new ToolStripSeparator(),
            btnBold, btnItalic, btnUnderline, btnStrikeout, btnForeColor, btnBackColor, new ToolStripSeparator(),
            btnAlignLeft, btnAlignCenter, btnAlignRight
        });

            this.Controls.Add(richTextBox);
            this.Controls.Add(toolStrip); 
        }

        
        private void SetupEditorEvents()
        {
            btnBold.Click += (s, e) => ToggleSelectionStyle(FontStyle.Bold);
            btnItalic.Click += (s, e) => ToggleSelectionStyle(FontStyle.Italic);
            btnUnderline.Click += (s, e) => ToggleSelectionStyle(FontStyle.Underline);
            btnStrikeout.Click += (s, e) => ToggleSelectionStyle(FontStyle.Strikeout);

            comboFontFamily.SelectedIndexChanged += (s, e) => ApplySelectionFont();
            comboFontSize.SelectedIndexChanged += (s, e) => ApplySelectionFont();

            btnAlignLeft.Click += (s, e) => richTextBox.SelectionAlignment = HorizontalAlignment.Left;
            btnAlignCenter.Click += (s, e) => richTextBox.SelectionAlignment = HorizontalAlignment.Center;
            btnAlignRight.Click += (s, e) => richTextBox.SelectionAlignment = HorizontalAlignment.Right;

            btnForeColor.Click += (s, e) =>
            {
                colorDialog1.Color = richTextBox.SelectionColor;

                if (colorDialog1.ShowDialog() == DialogResult.OK)
                {
                    richTextBox.SelectionColor = colorDialog1.Color;
                }
            };

            btnBackColor.Click += (s, e) =>
            {
                colorDialog1.Color = richTextBox.SelectionBackColor; 

                if (colorDialog1.ShowDialog() == DialogResult.OK)
                {
                    richTextBox.SelectionBackColor = colorDialog1.Color;
                }
            };

            richTextBox.SelectionChanged += RichTextBox_SelectionChanged;
        }

        private void LoadSystemFonts()
        {
            foreach (FontFamily family in FontFamily.Families)
            {
                comboFontFamily.Items.Add(family.Name);
            }
            comboFontFamily.Text = richTextBox.Font.Name;
        }

        private void ToggleSelectionStyle(FontStyle style)
        {
            if (richTextBox.SelectionFont == null) return;

            FontStyle currentStyle = richTextBox.SelectionFont.Style;
            FontStyle newStyle = currentStyle.HasFlag(style) ? (currentStyle & ~style) : (currentStyle | style);

            richTextBox.SelectionFont = new System.Drawing.Font(richTextBox.SelectionFont, newStyle);
        }

        private void ApplySelectionFont()
        {
            if (richTextBox.SelectionFont == null || string.IsNullOrEmpty(comboFontFamily.Text)) return;

            float size = float.TryParse(comboFontSize.Text, out float parsedSize) ? parsedSize : richTextBox.SelectionFont.Size;
            string family = comboFontFamily.Text;

            richTextBox.SelectionFont = new System.Drawing.Font(family, size, richTextBox.SelectionFont.Style);
        }

        private void RichTextBox_SelectionChanged(object sender, EventArgs e)
        {
            if (richTextBox.SelectionFont != null)
            {
                btnBold.Checked = richTextBox.SelectionFont.Bold;
                btnItalic.Checked = richTextBox.SelectionFont.Italic;
                btnUnderline.Checked = richTextBox.SelectionFont.Underline;
                btnStrikeout.Checked = richTextBox.SelectionFont.Strikeout;
                comboFontFamily.Text = richTextBox.SelectionFont.Name;
                comboFontSize.Text = ((int)richTextBox.SelectionFont.Size).ToString();
            }            
        }

        public string RtfContent
        {
            get => richTextBox.Rtf;
            set {
                try
                {
                    richTextBox.Rtf = value ?? string.Empty;
                }
                catch
                {
                    if (string.IsNullOrWhiteSpace(value) == false)
                    MessageBox.Show("The text is not RTF format! If you edit it and click OK, it will be converted to raw RTF format!", "NOTE!", MessageBoxButtons.OK, MessageBoxIcon.Warning);

                    richTextBox.Text = value ?? string.Empty;
                }
            }
        }

    }

    #endregion
}
