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
}
