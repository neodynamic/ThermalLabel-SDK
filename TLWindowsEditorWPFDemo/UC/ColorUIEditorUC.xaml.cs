using System;
using System.Collections.Generic;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using Xceed.Wpf.Toolkit.PropertyGrid;
using Xceed.Wpf.Toolkit.PropertyGrid.Editors;

namespace TLWindowsEditorWPFDemo
{
    /// <summary>
    /// Interaction logic for ColorUIEditorUC.xaml
    /// </summary>
    public partial class ColorUIEditorUC : UserControl, ITypeEditor
    {
        public ColorUIEditorUC()
        {
            InitializeComponent();
        }

        public static readonly DependencyProperty ValueProperty = DependencyProperty.Register("Value", typeof(string), typeof(ColorUIEditorUC),
                                                                                                new FrameworkPropertyMetadata(null, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault));
        public string Value
        {
            get { return (string)GetValue(ValueProperty); }
            set { SetValue(ValueProperty, value); }
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            string colorHex = (string)Value;

            var cd = new ColorDialog();
            cd.ColorHex = colorHex;

            if (cd.ShowDialog().Value)
            {
                Value = cd.ColorHex;
            }
        }

        public FrameworkElement ResolveEditor(PropertyItem propertyItem)
        {
            Binding binding = new Binding("Value");
            binding.Source = propertyItem;
            binding.Mode = propertyItem.IsReadOnly ? BindingMode.OneWay : BindingMode.TwoWay;
            BindingOperations.SetBinding(this, ValueProperty, binding);
            return this;
        }
    }
}
