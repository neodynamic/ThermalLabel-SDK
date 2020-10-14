using System;

namespace ThermalLabelSdkSamplesCS
{
    /// <summary>
    /// A sample class for Data Binding
    /// </summary>
    public class Product
    {
        string _id;
        string _name;
        
        public Product(string id, string name)
        {
            this.Id = id;
            this.Name = name;
        }

        public string Id
        {
            get { return _id; }
            set { _id = value; }
        }

        public string Name
        {
            get { return _name; }
            set { _name = value; }
        }

       
        
    }

}
