using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

using Neodynamic.SDK.Printing;

namespace TLWindowsEditorWinFormsDemo
{
    public partial class ExpressionEditor : Form
    {
        public ExpressionEditor()
        {
            InitializeComponent();

            
        }

        private List<Tuple<string, string, string, string, string>> _supportedExpressions = null;

        private void ExpressionEditor_Load(object sender, EventArgs e)
        {
            //get supported expressions
            _supportedExpressions = ExpressionBuilder.SupportedExpressions;

            
            //add current label items if any...
            if (Global.CurrentThermalLabel != null && Global.CurrentThermalLabel.Items.Count > 0)
            {
                foreach (var item in Global.CurrentThermalLabel.Items)
                {
                    var itemName = item.Name;
                    if (string.IsNullOrWhiteSpace(itemName) == false &&
                        _supportedExpressions.Find(t => t.Item2 == itemName) == null)
                    {
                        _supportedExpressions.Insert(0, new Tuple<string, string, string, string, string>("Items", itemName, $"[Items!{itemName}]", $"Returns the content of item '{itemName}'.", $"[Items!{itemName}]"));

                        // add Items properties/attributes
                        foreach (var prop in item.GetType().GetProperties().Where(p => Attribute.IsDefined(p, typeof(ExpressionableAttribute))).OrderByDescending(p => p.Name))
                        {   
                            var itemAttribute = item.Name + "." + prop.Name;
                            var itemAttributeType = prop.PropertyType.IsEnum ? "Enum " : (prop.PropertyType.IsPrimitive || prop.PropertyType == typeof(string)  ? "" : "Class ");
                            if (_supportedExpressions.Find(t => t.Item2 == itemAttribute) == null)
                                _supportedExpressions.Insert(0, new Tuple<string, string, string, string, string>("ItemsAttributes", itemAttribute, $"[Items!{itemAttribute}]", $"Gets the item attribute '{itemAttribute}'. {itemAttributeType}Type: {prop.PropertyType}{Environment.NewLine}{Environment.NewLine}To set this attribute, use the SetAttribute function.", $"[Items!{itemAttribute}]"));
                            
                        }
                    }
                }
            }

            //add current data source Fields if any...
            if (Global.DataFields != null && Global.DataFields.Count > 0)
            {
                foreach (var dataField in Global.DataFields)
                {
                    if (string.IsNullOrWhiteSpace(dataField) == false &&
                        _supportedExpressions.Find(t => t.Item2 == dataField) == null)
                        _supportedExpressions.Insert(0, new Tuple<string, string, string, string, string>("DataFields", dataField, $"[DataFields!{dataField}]", $"Returns the content of Data Field  '{dataField}'.", $"[DataFields!{dataField}]"));
                }
            }

            //Example of adding CUSTOM Function
            Func<string> GetGUID = () => { return Guid.NewGuid().ToString(); };
            ExpressionBuilder.SetCustomFunction("GetGUID", GetGUID);
            if(_supportedExpressions.Find(t => t.Item2 == "GetGUID") == null)
                _supportedExpressions.Add(new Tuple<string, string, string, string, string>("CustomFunctions", "GetGUID", "GetGUID()", $"Returns a new Globally Unique Identifier value.", $"GetGUID()"));
            //Example of adding CUSTOM Variable or Constants
            ExpressionBuilder.SetCustomVariable("PRODUCT_NAME", "Rocky Mountain Growler 20", typeof(string));
            if (_supportedExpressions.Find(t => t.Item2 == "PRODUCT_NAME") == null)
                _supportedExpressions.Add(new Tuple<string, string, string, string, string>("Variables", "PRODUCT_NAME", "PRODUCT_NAME", $"Returns the product name.", $"PRODUCT_NAME"));


            //load Expression Categories
            this.lstExprCategories.DataSource = _supportedExpressions.Select(t => t.Item1.Replace("Functions", " Functions").Replace("Operators", " Operators").Replace("Attributes", " Attributes")).ToList().Distinct().ToList();
            

        }

        
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

        private void lstExprCategories_SelectedIndexChanged(object sender, EventArgs e)
        {
            var category = this.lstExprCategories.SelectedItem.ToString().Replace(" ", "");
            //load Expression Functions for selected Category
            this.lstExprName.DataSource = _supportedExpressions.Where(t => t.Item1 == category).Select(t => t.Item2).ToList();

        }

        private void lstExprName_SelectedIndexChanged(object sender, EventArgs e)
        {
            var funcName = this.lstExprName.SelectedItem.ToString();
            //load help info for selected Expression Name
            this.txtExprSyntax.Text = _supportedExpressions.Where(t => t.Item2 == funcName).First().Item3;
            this.txtExprDescription.Text = _supportedExpressions.Where(t => t.Item2 == funcName).First().Item4;
            this.txtExprExample.Text = _supportedExpressions.Where(t => t.Item2 == funcName).First().Item5;
        }

        private void lstExprName_DoubleClick(object sender, EventArgs e)
        {
            if (this.lstExprName.SelectedItem != null)
            {
                var exprSyntax = this.txtExprSyntax.Text;

                this.txtExpression.Text = this.txtExpression.Text.Insert(this.txtExpression.SelectionStart, exprSyntax);
                this.txtExpression.SelectionStart = this.txtExpression.Text.Length;
                this.txtExpression.Focus();
            }
        }

        
    }
}
