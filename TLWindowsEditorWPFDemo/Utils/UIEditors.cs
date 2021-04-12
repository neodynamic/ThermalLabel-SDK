using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing.Design;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using System.Windows.Forms;
using System.Reflection;
using Neodynamic.SDK.Printing;
using System.ComponentModel.Design;

using Xceed.Wpf.Toolkit;
using Xceed.Wpf.Toolkit.PropertyGrid.Editors;
using System.Windows;
using Xceed.Wpf.Toolkit.PropertyGrid;
using System.Windows.Data;
using Xceed.Wpf.Toolkit.PropertyGrid.Attributes;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Input;

namespace TLWindowsEditorWPFDemo
{
    //Based on https://stackoverflow.com/a/46102589

    public class DataFieldItemsSource : IItemsSource
    {
        public Xceed.Wpf.Toolkit.PropertyGrid.Attributes.ItemCollection GetValues()
        {
            var items = new Xceed.Wpf.Toolkit.PropertyGrid.Attributes.ItemCollection();

            if (Global.DataFields != null && Global.DataFields.Count > 0)
            {
                items.Add(""); // empty data field
                foreach (var df in Global.DataFields)
                {
                    items.Add(df);
                }
            }

            return items;
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
        [Editor(typeof(ColorUIEditorUC), typeof(ColorUIEditorUC))]
        public string BackColorHex { get; set; }
        [Editor(typeof(ColorUIEditorUC), typeof(ColorUIEditorUC))]
        public string BorderColorHex { get; set; }
        [Editor(typeof(ColorUIEditorUC), typeof(ColorUIEditorUC))]
        public string ForeColorHex { get; set; }
        [Editor(typeof(ColorUIEditorUC), typeof(ColorUIEditorUC))]
        public string StrokeColorHex { get; set; }

    }

    public class BarcodeItemMetadata
    {
        [Editor(typeof(ColorUIEditorUC), typeof(ColorUIEditorUC))]
        
        public string BackColorHex { get; set; }
        [Editor(typeof(ColorUIEditorUC), typeof(ColorUIEditorUC))]
        
        public string BorderColorHex { get; set; }
        [Editor(typeof(ColorUIEditorUC), typeof(ColorUIEditorUC))]
        
        public string ForeColorHex { get; set; }
        [Editor(typeof(ColorUIEditorUC), typeof(ColorUIEditorUC))]
        
        public string TextForeColorHex { get; set; }
        [Editor(typeof(ColorUIEditorUC), typeof(ColorUIEditorUC))]
        
        public string BarColorHex { get; set; }

        [Browsable(false)]
        public BarcodeSymbology Symbology { get; set; }
    }

    public class ShapeItemMetadata
    {
        [Editor(typeof(ColorUIEditorUC), typeof(ColorUIEditorUC))]
        
        public string StrokeColorHex { get; set; }
        
    }

    public class ClosedShapeItemMetadata
    {
        [Editor(typeof(ColorUIEditorUC), typeof(ColorUIEditorUC))]
        
        public string FillColorHex { get; set; }

    }

    public class ImageItemMetadata
    {
        [Editor(typeof(ImageFileUIEditorUC), typeof(ImageFileUIEditorUC))]
        
        public string SourceFile { get; set; }

        [Browsable(false)]
        public byte[] SourceBinary { get; set; }
    }

   

    public class ItemMetadata
    {
        [Browsable(false)]
        public bool Editable { get; set; }

        [Browsable(false)]
        public bool IsDesignTime { get; set; }

        
        [Editor(typeof(ExpressionUIEditorUC), typeof(ExpressionUIEditorUC))]
        
        public string Expression { get; set; }

        [ItemsSource(typeof(DataFieldItemsSource))]
        public string DataField { get; set; }
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


    public class DpiInputBox
    {

        Window Box = new Window();//window for the inputbox
        FontFamily font = new FontFamily("Tahoma");//font for the whole inputbox
        int FontSize = 30;//fontsize for the input
        StackPanel sp1 = new StackPanel();// items container
        string title = "InputBox";//title as heading
        string boxcontent;//title
        string defaulttext = "Write here your name...";//default textbox content
        string errormessage = "Invalid answer";//error messagebox content
        string errortitle = "Error";//error messagebox heading title
        string okbuttontext = "OK";//Ok button content
        Brush BoxBackgroundColor = Brushes.GreenYellow;// Window Background
        Brush InputBackgroundColor = Brushes.Ivory;// Textbox Background
        bool clicked = false;
        TextBox input = new TextBox();
        Button ok = new Button();
        bool inputreset = false;

        public DpiInputBox(string content)
        {
            try
            {
                boxcontent = content;
            }
            catch { boxcontent = "Error!"; }
            windowdef();
        }

        public DpiInputBox(string content, string Htitle, string DefaultText)
        {
            try
            {
                boxcontent = content;
            }
            catch { boxcontent = "Error!"; }
            try
            {
                title = Htitle;
            }
            catch
            {
                title = "Error!";
            }
            try
            {
                defaulttext = DefaultText;
            }
            catch
            {
                DefaultText = "Error!";
            }
            windowdef();
        }

        public DpiInputBox(string content, string Htitle, string Font, int Fontsize)
        {
            try
            {
                boxcontent = content;
            }
            catch { boxcontent = "Error!"; }
            try
            {
                font = new FontFamily(Font);
            }
            catch { font = new FontFamily("Tahoma"); }
            try
            {
                title = Htitle;
            }
            catch
            {
                title = "Error!";
            }
            if (Fontsize >= 1)
                FontSize = Fontsize;
            windowdef();
        }

        private void windowdef()// window building - check only for window size
        {
            Box.Height = 500;// Box Height
            Box.Width = 300;// Box Width
            Box.Background = BoxBackgroundColor;
            Box.Title = title;
            Box.Content = sp1;
            Box.Closing += Box_Closing;
            TextBlock content = new TextBlock();
            content.TextWrapping = TextWrapping.Wrap;
            content.Background = null;
            content.HorizontalAlignment = HorizontalAlignment.Center;
            content.Text = boxcontent;
            content.FontFamily = font;
            content.FontSize = FontSize;
            sp1.Children.Add(content);

            input.Background = InputBackgroundColor;
            input.FontFamily = font;
            input.FontSize = FontSize;
            input.HorizontalAlignment = HorizontalAlignment.Center;
            input.Text = defaulttext;
            input.MinWidth = 200;
            input.MouseEnter += input_MouseDown;
            sp1.Children.Add(input);
            ok.Width = 70;
            ok.Height = 30;
            ok.Click += ok_Click;
            ok.Content = okbuttontext;
            ok.HorizontalAlignment = HorizontalAlignment.Center;
            sp1.Children.Add(ok);

        }

        void Box_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            if (!clicked)
                e.Cancel = true;
        }

        private void input_MouseDown(object sender, MouseEventArgs e)
        {
            if ((sender as TextBox).Text == defaulttext && inputreset == false)
            {
                (sender as TextBox).Text = null;
                inputreset = true;
            }
        }

        void ok_Click(object sender, RoutedEventArgs e)
        {
            clicked = true;
            if (input.Text == defaulttext || input.Text == "")
                System.Windows.MessageBox.Show(errormessage, errortitle);
            else
            {
                Box.Close();
            }
            clicked = false;
        }

        public string ShowDialog()
        {
            Box.ShowDialog();
            return input.Text;
        }
    }
}
