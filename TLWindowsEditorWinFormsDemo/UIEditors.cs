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

        [Editor(typeof(MultilineStringEditor), typeof(UITypeEditor))]
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
}
