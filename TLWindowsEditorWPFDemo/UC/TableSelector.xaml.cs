using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace TLWindowsEditorWPFDemo
{
    /// <summary>
    /// Interaction logic for TableSelector.xaml
    /// </summary>
    public partial class TableSelector : UserControl
    {
        public TableSelector()
        {
            InitializeComponent();

            CreateGrid();
        }

        int TotalColumns = 0;
        int TotalRows = 0;

        public int SelectedColumns = 0;
        public int SelectedRows = 0;

        public void CreateGrid(int cols = 9, int rows = 8)
        {
            TotalColumns = cols;
            TotalRows = rows;

            var cellBorderBrush = new SolidColorBrush(Colors.LightGray);
                        
            double cellSize = 16;
            
            for (int r = 0; r < rows; r++)
            {
                for (int c = 0; c < cols; c++)
                {
                    var cell = new Rectangle() { StrokeThickness = 1, Stroke = cellBorderBrush, Width = cellSize, Height = cellSize, SnapsToDevicePixels=true, UseLayoutRounding=true };
                    cell.Tag = new int[2] { c, r };
                    cell.SetValue(Canvas.LeftProperty, (double)(c * cellSize - (c > 0 ? 1 : 0)));
                    cell.SetValue(Canvas.TopProperty, (double)(r * cellSize - (r > 0 ? 1 : 0)));

                    cell.MouseEnter += Cell_MouseEnter;
                    cell.MouseLeftButtonDown += Cell_MouseLeftButtonDown;

                    myCanvas.Children.Add(cell);

                }
            }

            myCanvas.Width = (cols * cellSize);
            myCanvas.Height = (rows * cellSize);

            this.Width = myBorder.Width = myPanel.Width = myCanvas.Width;
            this.Height = myBorder.Height = myPanel.Height = myCanvas.Height + 24;

        }

        public event EventHandler SelectionChanged;

        private void Cell_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            int[] coord = ((Rectangle)sender).Tag as int[];

            SelectedColumns = coord[0] + 1;
            SelectedRows = coord[1] + 1;

            if (SelectionChanged != null)
                SelectionChanged(this, EventArgs.Empty);

            ClearCells();
        }

        private void ClearCells()
        {
            foreach (var elem in myCanvas.Children)
            {
                ((Rectangle)elem).Fill = Brushes.White;
            }

            SelectedColumns = 0;
            SelectedRows = 0;
        }

        

        private void Cell_MouseEnter(object sender, MouseEventArgs e)
        {
            ClearCells();
            ((Rectangle)sender).Fill = Brushes.DeepSkyBlue;

            int[] coord = ((Rectangle)sender).Tag as int[];

            int c2 = coord[0];
            int r2 = coord[1];

            for (int r = 0; r <= r2; r++)
            {
                for (int c = 0; c <= c2; c++)
                {
                    ((Rectangle)(myCanvas.Children[r * TotalColumns + c])).Fill = ((Rectangle)sender).Fill;
                }
            }

            lblTableSize.Content = $"{c2 + 1} x {r2 + 1}";
        }
    }
}
