using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Drawing;
using System.Linq;
using System.Runtime.InteropServices;
using System.Windows.Forms;

namespace TLWindowsEditorWinFormsDemo
{
    /// <summary>
    /// TreeView with multiple selection support:
    ///   - Click                : selects a single node
    ///   - Ctrl + Click         : toggles a node
    ///   - Shift + Click        : selects the range anchor..node (Ctrl+Shift adds the range)
    ///   - Up/Down/Home/End/PgUp/PgDn (+Shift to extend), Ctrl+Arrows move the focus only, Space/Ctrl+Space select/toggle
    ///   - Ctrl + A             : selects every selectable node
    /// The native single selection of the TreeView is only used as the "focus" (lead) node; the real
    /// selection lives in <see cref="SelectedNodes"/> and is painted by this control (owner draw).
    /// </summary>
    public class MultiSelectTreeView : TreeView
    {
        private readonly List<TreeNode> _selected = new List<TreeNode>();
        private TreeNode _anchor;
        private bool _allowNativeSelect;

        public MultiSelectTreeView()
        {
            DrawMode = TreeViewDrawMode.OwnerDrawText;
            HideSelection = false;
        }

        /// <summary>Raised every time the set of selected nodes changes (user action or <see cref="SetSelectedNodes"/> with raiseEvent = true).</summary>
        public event EventHandler SelectedNodesChanged;

        /// <summary>Optional filter that tells whether a node can be selected (e.g. to exclude a root node).</summary>
        [Browsable(false), DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Predicate<TreeNode> NodeSelectable { get; set; }

        /// <summary>Snapshot of the selected nodes, in selection order.</summary>
        [Browsable(false), DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public IList<TreeNode> SelectedNodes
        {
            get
            {
                PurgeSelection();
                return new ReadOnlyCollection<TreeNode>(_selected.ToList());
            }
        }

        public bool IsNodeSelected(TreeNode node)
        {
            return node != null && _selected.Contains(node);
        }

        /// <summary>Replaces the current selection.</summary>
        public void SetSelectedNodes(IEnumerable<TreeNode> nodes, bool raiseEvent)
        {
            ApplySelection(nodes ?? Enumerable.Empty<TreeNode>(), raiseEvent);
        }

        public void ClearSelection(bool raiseEvent)
        {
            ApplySelection(Enumerable.Empty<TreeNode>(), raiseEvent);
        }

        /// <summary>Selects every selectable node of the tree.</summary>
        public void SelectAllNodes()
        {
            ApplySelection(EnumerateAllNodes(Nodes), true);
        }

        // ------------------------------------------------------------------ selection core

        private bool IsSelectableNode(TreeNode node)
        {
            return node != null && node.TreeView == this && (NodeSelectable == null || NodeSelectable(node));
        }

        // nodes removed from the tree (Nodes.Clear(), etc.) have TreeView == null
        private void PurgeSelection()
        {
            _selected.RemoveAll(n => n.TreeView != this);
            if (_anchor != null && _anchor.TreeView != this)
                _anchor = null;
        }

        private void ApplySelection(IEnumerable<TreeNode> nodes, bool raiseEvent)
        {
            PurgeSelection();

            var newList = nodes.Where(IsSelectableNode).Distinct().ToList();
            var oldSet = new HashSet<TreeNode>(_selected);

            if (!oldSet.SetEquals(newList))
            {
                _selected.Clear();
                _selected.AddRange(newList);

                Invalidate();

                if (raiseEvent)
                    OnSelectedNodesChanged(EventArgs.Empty);
            }

            // keep the lead (focus) node inside the selection so keyboard navigation starts from a sensible place
            if (_selected.Count > 0 && (SelectedNode == null || !_selected.Contains(SelectedNode)))
            {
                var lead = _selected[_selected.Count - 1];
                SetLead(lead);
                if (_anchor == null)
                    _anchor = lead;
            }
        }

        protected virtual void OnSelectedNodesChanged(EventArgs e)
        {
            var handler = SelectedNodesChanged;
            if (handler != null)
                handler(this, e);
        }

        private void SetLead(TreeNode node)
        {
            if (node == null) return;
            _allowNativeSelect = true;
            try { SelectedNode = node; }
            finally { _allowNativeSelect = false; }
        }

        // only the control itself is allowed to move the native selection
        protected override void OnBeforeSelect(TreeViewCancelEventArgs e)
        {
            if (!_allowNativeSelect)
            {
                e.Cancel = true;
                return;
            }
            base.OnBeforeSelect(e);
        }

        // ------------------------------------------------------------------ node enumeration

        private static IEnumerable<TreeNode> EnumerateAllNodes(TreeNodeCollection nodes)
        {
            foreach (TreeNode n in nodes)
            {
                yield return n;
                foreach (var c in EnumerateAllNodes(n.Nodes))
                    yield return c;
            }
        }

        private static IEnumerable<TreeNode> EnumerateExpandedNodes(TreeNodeCollection nodes)
        {
            foreach (TreeNode n in nodes)
            {
                yield return n;
                if (n.IsExpanded)
                    foreach (var c in EnumerateExpandedNodes(n.Nodes))
                        yield return c;
            }
        }

        // selectable nodes, in the order they are displayed
        private List<TreeNode> GetNavigableNodes()
        {
            return EnumerateExpandedNodes(Nodes).Where(IsSelectableNode).ToList();
        }

        private void SelectRange(TreeNode from, TreeNode to, bool additive)
        {
            var list = GetNavigableNodes();
            int i1 = list.IndexOf(from);
            int i2 = list.IndexOf(to);
            if (i1 < 0 || i2 < 0)
            {
                ApplySelection(new[] { to }, true);
                return;
            }

            int start = Math.Min(i1, i2);
            int count = Math.Abs(i2 - i1) + 1;
            var range = list.Skip(start).Take(count);
            ApplySelection(additive ? _selected.Union(range) : range, true);
        }

        private void Toggle(TreeNode node)
        {
            PurgeSelection();
            var list = _selected.ToList();
            if (!list.Remove(node))
                list.Add(node);
            ApplySelection(list, true);
        }

        // ------------------------------------------------------------------ mouse

        protected override void OnMouseDown(MouseEventArgs e)
        {
            var hit = HitTest(e.Location);
            var node = hit.Node;

            bool onItem = node != null &&
                (hit.Location == TreeViewHitTestLocations.Label ||
                 hit.Location == TreeViewHitTestLocations.Image ||
                 hit.Location == TreeViewHitTestLocations.StateImage);

            if (onItem && IsSelectableNode(node))
            {
                bool ctrl = (ModifierKeys & Keys.Control) == Keys.Control;
                bool shift = (ModifierKeys & Keys.Shift) == Keys.Shift;

                if (e.Button == MouseButtons.Right)
                {
                    // right click keeps a multiple selection intact if it happens over a selected node
                    if (!IsNodeSelected(node))
                    {
                        ApplySelection(new[] { node }, true);
                        _anchor = node;
                    }
                }
                else if (e.Button == MouseButtons.Left)
                {
                    if (shift && _anchor != null && _anchor.TreeView == this)
                    {
                        SelectRange(_anchor, node, ctrl);
                    }
                    else if (ctrl)
                    {
                        Toggle(node);
                        _anchor = node;
                    }
                    else
                    {
                        ApplySelection(new[] { node }, true);
                        _anchor = node;
                    }
                }

                SetLead(node);
            }

            base.OnMouseDown(e);
        }

        // ------------------------------------------------------------------ keyboard

        protected override bool IsInputKey(Keys keyData)
        {
            switch (keyData & Keys.KeyCode)
            {
                case Keys.Up:
                case Keys.Down:
                case Keys.Home:
                case Keys.End:
                case Keys.PageUp:
                case Keys.PageDown:
                case Keys.Space:
                    return true;
                case Keys.A:
                    if ((keyData & Keys.Control) == Keys.Control)
                        return true;
                    break;
            }
            return base.IsInputKey(keyData);
        }

        protected override void OnKeyDown(KeyEventArgs e)
        {
            if (e.Control && e.KeyCode == Keys.A)
            {
                SelectAllNodes();
                e.Handled = true;
                e.SuppressKeyPress = true;
                return;
            }

            int page = Math.Max(1, ClientSize.Height / Math.Max(1, ItemHeight) - 1);
            int delta;
            bool absolute = false;
            int absoluteIndex = 0;

            switch (e.KeyCode)
            {
                case Keys.Down: delta = 1; break;
                case Keys.Up: delta = -1; break;
                case Keys.PageDown: delta = page; break;
                case Keys.PageUp: delta = -page; break;
                case Keys.Home: delta = 0; absolute = true; absoluteIndex = 0; break;
                case Keys.End: delta = 0; absolute = true; absoluteIndex = int.MaxValue; break;
                case Keys.Space:
                    {
                        var lead = SelectedNode;
                        if (IsSelectableNode(lead))
                        {
                            if (e.Control) Toggle(lead);
                            else ApplySelection(new[] { lead }, true);
                            _anchor = lead;
                        }
                        e.Handled = true;
                        e.SuppressKeyPress = true;
                        return;
                    }
                default:
                    base.OnKeyDown(e);
                    return;
            }

            var list = GetNavigableNodes();
            if (list.Count > 0)
            {
                int cur = list.IndexOf(SelectedNode);
                int target;
                if (absolute)
                    target = absoluteIndex;
                else if (cur < 0)
                    target = delta > 0 ? 0 : list.Count - 1;
                else
                    target = cur + delta;

                target = Math.Max(0, Math.Min(list.Count - 1, target));
                var node = list[target];

                if (e.Shift)
                {
                    var from = (_anchor != null && _anchor.TreeView == this) ? _anchor : (cur >= 0 ? list[cur] : node);
                    if (_anchor == null) _anchor = from;
                    SelectRange(from, node, false);
                }
                else if (!e.Control)
                {
                    ApplySelection(new[] { node }, true);
                    _anchor = node;
                }
                // Ctrl + arrows: only the focus moves

                SetLead(node);
                node.EnsureVisible();
            }

            e.Handled = true;
            e.SuppressKeyPress = true;
        }

        // ------------------------------------------------------------------ painting

        protected override void OnDrawNode(DrawTreeNodeEventArgs e)
        {
            if (e.Node == null || e.Bounds.Width <= 0 || e.Bounds.Height <= 0)
            {
                base.OnDrawNode(e);
                return;
            }

            bool selected = _selected.Contains(e.Node);
            bool isLead = Focused && ReferenceEquals(e.Node, SelectedNode);

            Color back = e.Node.BackColor.IsEmpty ? BackColor : e.Node.BackColor;
            Color fore = e.Node.ForeColor.IsEmpty ? ForeColor : e.Node.ForeColor;

            if (selected)
            {
                if (Focused)
                {
                    back = SystemColors.Highlight;
                    fore = SystemColors.HighlightText;
                }
                else
                {
                    back = Color.FromArgb(217, 217, 217);
                    fore = SystemColors.ControlText;
                }
            }

            var bounds = new Rectangle(e.Bounds.X, e.Bounds.Y, e.Bounds.Width + 3, e.Bounds.Height);

            using (var brush = new SolidBrush(back))
                e.Graphics.FillRectangle(brush, bounds);

            TextRenderer.DrawText(e.Graphics, e.Node.Text, e.Node.NodeFont ?? Font, bounds, fore,
                TextFormatFlags.GlyphOverhangPadding | TextFormatFlags.VerticalCenter | TextFormatFlags.Left | TextFormatFlags.NoPrefix);

            if (isLead)
                ControlPaint.DrawFocusRectangle(e.Graphics, bounds, fore, back);
        }

        protected override void OnGotFocus(EventArgs e)
        {
            base.OnGotFocus(e);
            Invalidate();
        }

        protected override void OnLostFocus(EventArgs e)
        {
            base.OnLostFocus(e);
            Invalidate();
        }
    }

    /// <summary>Cue banner (placeholder) for TextBox controls on .NET Framework.</summary>
    internal static class CueBannerHelper
    {
        private const int EM_SETCUEBANNER = 0x1501;

        [DllImport("user32.dll", CharSet = CharSet.Unicode)]
        private static extern IntPtr SendMessage(IntPtr hWnd, int msg, IntPtr wParam, string lParam);

        public static void SetCueBanner(TextBox textBox, string text)
        {
            if (textBox.IsHandleCreated)
                SendMessage(textBox.Handle, EM_SETCUEBANNER, (IntPtr)1, text);
            else
                textBox.HandleCreated += (s, e) => SendMessage(textBox.Handle, EM_SETCUEBANNER, (IntPtr)1, text);
        }
    }
}