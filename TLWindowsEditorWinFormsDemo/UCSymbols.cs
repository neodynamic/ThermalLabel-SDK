using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO;
using System.Drawing.Text;
using System.Runtime.InteropServices;

namespace TLWindowsEditorWinFormsDemo
{
    public partial class UCSymbols : UserControl
    {
        public UCSymbols()
        {
            InitializeComponent();
        }

        PrivateFontCollection pfc = new PrivateFontCollection(); 
            
        public void CreateSymbolsFromFont(byte[] fontBuffer, string iconChars)
        {
            // create an unsafe memory block for the font data
            System.IntPtr data = Marshal.AllocCoTaskMem(fontBuffer.Length);

            // copy the bytes to the unsafe memory block
            Marshal.Copy(fontBuffer, 0, data, fontBuffer.Length);

            // pass the font to the font collection
            pfc.AddMemoryFont(data, fontBuffer.Length);

            // free up the unsafe memory
            Marshal.FreeCoTaskMem(data);

            // transparent background
            this.BackColor = flPanel.BackColor = Color.Transparent;

            // create symbol chars
            foreach (var c in iconChars)
            {
                var symbButton = new Button()
                {
                    FlatStyle = FlatStyle.Flat,
                    BackColor = Color.White,
                    Text = c.ToString(),
                    Height = 48,
                    Width = 48,
                    Font = new Font(pfc.Families[0], 20),
                    UseCompatibleTextRendering = true
                };

                symbButton.Click += OnSymbolChanged;

                flPanel.Controls.Add(symbButton);

            }

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
