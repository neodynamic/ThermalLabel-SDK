using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

using Neodynamic.SDK.Printing;

namespace TLWindowsEditorWPFDemo
{
    /// <summary>
    /// Interaction logic for ExpressionDialog.xaml
    /// </summary>
    public partial class ExpressionDialog : Window
    {
        private List<Tuple<string, string, string, string, string>> _supportedExpressions = null;

        public ThermalLabel CurrentThermalLabel = null;

        public ExpressionDialog()
        {
            InitializeComponent();
        }

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            //get supported expressions
            _supportedExpressions = ExpressionBuilder.SupportedExpressions;


            //add current label items if any...
            if (CurrentThermalLabel != null && CurrentThermalLabel.Items.Count > 0)
            {
                foreach (var item in CurrentThermalLabel.Items)
                {
                    if (string.IsNullOrWhiteSpace(item.Name) == false &&
                        _supportedExpressions.Find(t => t.Item2 == item.Name) == null)
                        _supportedExpressions.Insert(0, new Tuple<string, string, string, string, string>("Items", item.Name, $"[Items!{item.Name}]", $"Returns the content of item '{item.Name}'.", $"[Items!{item.Name}]"));
                }
            }

            //Example of adding CUSTOM Function
            Func<string> GetGUID = () => { return Guid.NewGuid().ToString(); };
            ExpressionBuilder.SetCustomFunction("GetGUID", GetGUID);
            if (_supportedExpressions.Find(t => t.Item2 == "GetGUID") == null)
                _supportedExpressions.Add(new Tuple<string, string, string, string, string>("CustomFunctions", "GetGUID", "GetGUID()", $"Returns a new Globally Unique Identifier value.", $"GetGUID()"));
            //Example of adding CUSTOM Variable or Constants
            ExpressionBuilder.SetCustomVariable("PRODUCT_NAME", "Rocky Mountain Growler 20", typeof(string));
            if (_supportedExpressions.Find(t => t.Item2 == "PRODUCT_NAME") == null)
                _supportedExpressions.Add(new Tuple<string, string, string, string, string>("Variables", "PRODUCT_NAME", "PRODUCT_NAME", $"Returns the product name.", $"PRODUCT_NAME"));


            //load Expression Categories
            this.lstExprCategories.ItemsSource = _supportedExpressions.Select(t => t.Item1.Replace("Functions", " Functions").Replace("Operators", " Operators")).ToList().Distinct().ToList();


        }

        private void button1_Click(object sender, RoutedEventArgs e)
        {
            this.UpdateExpression = true;
            this.Close();
        }

        private void button2_Click(object sender, RoutedEventArgs e)
        {
            this.UpdateExpression = false;
            this.Close();
        }

        public bool UpdateExpression = false;

        public string Expression
        {
            get
            {
                return this.txtExpression.Text;
            }
            set
            {
                this.txtExpression.Text = value;
            }
        }

        private void LstExprCategories_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var category = this.lstExprCategories.SelectedValue.ToString().Replace(" ", "");
            //load Expression Functions for selected Category
            this.lstExprName.ItemsSource = _supportedExpressions.Where(t => t.Item1 == category).Select(t => t.Item2).ToList();

        }

        private void LstExprName_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (this.lstExprName.SelectedValue != null)
            {
                var funcName = this.lstExprName.SelectedValue.ToString();
                //load help info for selected Expression Name
                this.txtExprSyntax.Text = _supportedExpressions.Where(t => t.Item2 == funcName).First().Item3;
                this.txtExprDescription.Text = _supportedExpressions.Where(t => t.Item2 == funcName).First().Item4;
                this.txtExprExample.Text = _supportedExpressions.Where(t => t.Item2 == funcName).First().Item5;
            }
        }

        private void LstExprName_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            if (this.lstExprName.SelectedValue != null)
            {
                var exprSyntax = this.txtExprSyntax.Text;

                this.txtExpression.Text = this.txtExpression.Text.Insert(this.txtExpression.SelectionStart, exprSyntax);
                this.txtExpression.SelectionStart = this.txtExpression.Text.Length;
                this.txtExpression.Focus();
            }
        }

        private void Window_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            //https://ramsgotrus.wordpress.com/2009/03/13/best-solution-for-error-cannot-set-visibility-or-call-show-or-showdialog-after-window-has-closed/
            typeof(Window).GetField("_isClosing", BindingFlags.Instance | BindingFlags.NonPublic).SetValue(this, false);
            e.Cancel = true;
            this.Hide();
        }

        
    }
}
