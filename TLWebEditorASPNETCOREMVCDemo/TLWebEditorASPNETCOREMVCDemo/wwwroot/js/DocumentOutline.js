/*
 * Single-level Document Outline for ThermalLabel Web Editor.
 *
 * Lists the label items in _tl.items order (= z-order, so each row index matches
 * the one used by selectItemByIndex) and keeps the selection in sync with the
 * canvas in both directions through the editor's selection API:
 *
 *   click                 -> selectItemByIndex
 *   Ctrl/Cmd+click        -> selectItemsByIndexes (add/remove)
 *   Shift+click           -> selectItemsByIndexes (range)
 *   Tag chip              -> selectItemsByTag
 *   "Select" button       -> selectAll / selectItemsByType / selectItemsByIndexes (when a text filter is set)
 *   double click / Enter  -> opens the Properties panel
 *   arrows, Home, End     -> navigate the list (while the list has focus)
 *   Ctrl/Cmd+A            -> selectAll (while the list has focus)
  */
var DocumentOutline = {

    // Known types: class name (same value accepted by selectItemsByType), label and FA 4.x icon
    types: [
        { name: 'TextItem', label: 'Text', icon: 'fa-font' },
        { name: 'BarcodeItem', label: 'Barcode', icon: 'fa-barcode' },
        { name: 'ImageItem', label: 'Image', icon: 'fa-picture-o' },
        { name: 'RectangleShapeItem', label: 'Rectangle', icon: 'fa-square-o' },
        { name: 'EllipseShapeItem', label: 'Ellipse', icon: 'fa-circle-thin' },
        { name: 'LineShapeItem', label: 'Line', icon: 'fa-minus' },
        { name: 'TableShapeItem', label: 'Table', icon: 'fa-table' },
        { name: 'RepeaterItem', label: 'Repeater', icon: 'fa-clone' },
        { name: 'RFIDTagItem', label: 'RFID Tag', icon: 'fa-wifi' },
        { name: 'LiteralItem', label: 'Literal', icon: 'fa-code' }
    ],

    _filterText: '',
    _filterType: '',
    _anchorIndex: null,     // pivot for Shift+click
    _renderQueued: false,
    _rows: [],              // item indexes currently listed (after filters), in order
    _lastSelGuid: null,

    /* ---------------------------------------------------------------- init */

    init: function () {
        var self = this;

        // Chain (don't replace) the handlers already defined by the demo.
        // NOTE: the editor invokes selectionItemPropertyChanged with `this` = item,
        // hence apply(this) plus a closure for `self`.
        ['selectionChanged', 'selectionItemPropertyChanged', 'undoStateChanged'].forEach(function (hook) {
            var prev = tleditor[hook];
            tleditor[hook] = function () {
                var r = prev ? prev.apply(this, arguments) : undefined;
                self.scheduleRender();
                return r;
            };
        });
    },

    /* ------------------------------------------------------------- helpers */

    isVisible: function () {
        return $('#document-outline').length > 0;
    },

    getItems: function () {
        var tl = tleditor.get_thermal_label;
        return (tl && tl.items) ? tl.items : [];
    },

    getTypeInfo: function (item) {
        var ns = Neodynamic.SDK.Printing;
        for (var i = 0; i < this.types.length; i++) {
            var ctor = ns[this.types[i].name];
            if (ctor && item.constructor === ctor) return this.types[i];
        }
        return { name: 'Item', label: 'Item', icon: 'fa-question' };
    },

    // Secondary text: the most representative content of the item
    getDetail: function (item, typeInfo) {
        var d = '';
        try {
            switch (typeInfo.name) {
                case 'TextItem': d = item.text; break;
                case 'BarcodeItem':
                    var symb = Neodynamic.SDK.Printing.BarcodeSymbology;
                    d = (symb && symb[item.symbology] ? symb[item.symbology] + ': ' : '') + (item.code || '');
                    break;
            }
            if (!d && item.data_field) d = '[' + item.data_field + ']';
        } catch (e) { d = ''; }
        d = (d == null ? '' : String(d)).replace(/\s+/g, ' ').trim();
        return d.length > 40 ? d.substring(0, 40) + '…' : d;
    },

    isRealGroup: function (gn) {
        gn = (gn || '').trim();
        return gn !== '' && gn.indexOf('TMPGRP_') !== 0; // TMPGRP_ = temporary group created by multi-selection
    },

    // Selected indexes: the active item + those sharing its group_name
    // (either a real group or the multi-selection temporary group)
    getSelectedIndexes: function () {
        var cur = tleditor.current_selection;
        if (!cur) return [];
        var gn = (cur.group_name || '').trim();
        var res = [];
        this.getItems().forEach(function (it, i) {
            if (it._guid === cur._guid || (gn !== '' && (it.group_name || '').trim() === gn)) res.push(i);
        });
        return res;
    },

    escapeHtml: function (s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    },

    /* ---------------------------------------------------------- selection */

    selectIndexes: function (indexes) {
        if (!indexes || indexes.length === 0) return;
        if (indexes.length === 1) {
            tleditor.selectItemByIndex(indexes[0]);
        } else if (typeof tleditor.selectItemsByIndexes === 'function') {
            tleditor.selectItemsByIndexes(indexes);
        } else {
            // Fallback for builds without selectItemsByIndexes: named items only
            var items = this.getItems();
            var names = indexes.map(function (i) { return items[i].name; }).filter(function (n) { return !!n; });
            if (names.length) tleditor.selectItemsByNames(names);
        }
    },

    onRowClick: function (e, index) {
        var mod = e.ctrlKey || e.metaKey;
        var sel = this.getSelectedIndexes();

        if (e.shiftKey && this._anchorIndex !== null) {
            // Range between the pivot and the clicked item, following the listed order
            var a = this._rows.indexOf(this._anchorIndex), b = this._rows.indexOf(index);
            if (a === -1) a = b;
            var range = this._rows.slice(Math.min(a, b), Math.max(a, b) + 1);
            this.selectIndexes(mod ? sel.concat(range) : range);
            return; // Shift does not move the pivot
        }

        if (mod) {
            var pos = sel.indexOf(index);
            if (pos === -1) sel.push(index); else sel.splice(pos, 1);
            if (sel.length) this.selectIndexes(sel);
        } else {
            tleditor.selectItemByIndex(index);
        }
        this._anchorIndex = index;
    },

    selectListed: function () {
        if (this._filterText) {
            this.selectIndexes(this._rows.slice());   // text filter -> what is listed
        } else if (this._filterType) {
            tleditor.selectItemsByType(this._filterType);
        } else {
            tleditor.selectAll();
        }
    },

    openProperties: function () {
        var $btn = $('.sidebar-right-tools .tool-item[data-target="properties"]');
        if (!$btn.hasClass('active')) $btn.click();
    },

    /* ------------------------------------------------------------- render */

    scheduleRender: function () {
        if (this._renderQueued || !this.isVisible()) return;
        this._renderQueued = true;
        var self = this;
        (window.requestAnimationFrame || setTimeout)(function () {
            self._renderQueued = false;
            self.renderList();
        });
    },

    // Builds the whole panel (toolbar + list). Called when the panel is opened.
    render: function () {
        var self = this;
        var $root = $('#document-outline');
        if (!$root.length) return;

        $root.html(
            '<div class="outline-toolbar">' +
            '  <div class="input-group input-group-sm">' +
            '    <span class="input-group-addon"><i class="fa fa-search"></i></span>' +
            '    <input type="text" class="form-control" id="outline-filter" placeholder="Filter by name, content, tag…" />' +
            '  </div>' +
            '  <div class="outline-toolbar-row">' +
            '    <select class="form-control input-sm" id="outline-type"></select>' +
            '    <button type="button" class="btn btn-default btn-sm" id="outline-select-listed" title="Select the listed items">' +
            '      <i class="fa fa-check-square-o"></i> Select' +
            '    </button>' +
            '  </div>' +
            '</div>' +
            '<div class="outline-list" id="outline-list" tabindex="0"></div>' +
            '<div class="outline-footer" id="outline-footer"></div>'
        );

        $('#outline-filter').val(this._filterText).on('input', function () {
            self._filterText = $(this).val().trim().toLowerCase();
            self.renderList();
        });
        $('#outline-type').on('change', function () {
            self._filterType = $(this).val();
            self.renderList();
        });
        $('#outline-select-listed').on('click', function () { self.selectListed(); });

        var $list = $('#outline-list');
        $list.on('click', '.outline-row', function (e) {
            if ($(e.target).closest('.outline-tag').length) return;
            self.onRowClick(e, parseInt($(this).attr('data-index'), 10));
        });
        $list.on('dblclick', '.outline-row', function () { self.openProperties(); });
        $list.on('click', '.outline-tag', function (e) {
            e.stopPropagation();
            tleditor.selectItemsByTag($(this).attr('data-tag'));
        });
        // Prevent Shift+click from selecting browser text
        $list.on('mousedown', '.outline-row', function (e) { if (e.shiftKey) e.preventDefault(); });
        $list.on('keydown', function (e) { self.onListKeyDown(e); });

        this._lastSelGuid = null;
        this.renderList();
    },

    // Rebuilds only the type combo and the rows (keeps focus and scroll).
    renderList: function () {
        if (!this.isVisible()) return;
        var self = this;
        var items = this.getItems();
        var selected = this.getSelectedIndexes();

        // Type combo: only the types present in the label, with their count
        var counts = {};
        items.forEach(function (it) { var t = self.getTypeInfo(it).name; counts[t] = (counts[t] || 0) + 1; });
        if (this._filterType && !counts[this._filterType]) this._filterType = '';
        var opts = '<option value="">All types (' + items.length + ')</option>';
        this.types.forEach(function (t) {
            if (counts[t.name]) opts += '<option value="' + t.name + '">' + t.label + ' (' + counts[t.name] + ')</option>';
        });
        $('#outline-type').html(opts).val(this._filterType);

        // Rows
        var html = '';
        this._rows = [];
        items.forEach(function (item, i) {
            var ti = self.getTypeInfo(item);
            if (self._filterType && ti.name !== self._filterType) return;

            var name = item.name || '';
            var detail = self.getDetail(item, ti);
            var tag = item.tag || '';
            if (self._filterText) {
                var hay = (name + ' ' + detail + ' ' + tag + ' ' + ti.label).toLowerCase();
                if (hay.indexOf(self._filterText) === -1) return;
            }
            self._rows.push(i);

            var cls = 'outline-row' + (selected.indexOf(i) !== -1 ? ' selected' : '') +
                (item.visible === false ? ' is-hidden' : '');
            var title = ti.label + (name ? ' "' + name + '"' : '') + (item.comments ? '\n' + item.comments : '');

            html += '<div class="' + cls + '" data-index="' + i + '" title="' + self.escapeHtml(title) + '">' +
                '<span class="outline-index">' + i + '</span>' +
                '<i class="fa ' + ti.icon + ' fa-fw outline-icon"></i>' +
                '<span class="outline-text">' +
                (name
                    ? '<span class="outline-name">' + self.escapeHtml(name) + '</span>'
                    : '<span class="outline-name unnamed">(' + ti.label + ')</span>') +
                (detail ? ' <span class="outline-detail">' + self.escapeHtml(detail) + '</span>' : '') +
                '</span>' +
                '<span class="outline-badges">' +
                (tag ? '<span class="outline-tag" data-tag="' + self.escapeHtml(tag) + '" title="Select all items tagged \'' + self.escapeHtml(tag) + '\'">' + self.escapeHtml(tag) + '</span>' : '') +
                (self.isRealGroup(item.group_name) ? '<i class="fa fa-object-group" title="Group: ' + self.escapeHtml(item.group_name) + '"></i>' : '') +
                (item.visible === false ? '<i class="fa fa-eye-slash" title="Hidden"></i>' : '') +
                (item.locked ? '<i class="fa fa-lock" title="Locked"></i>' : '') +
                '</span>' +
                '</div>';
        });

        if (!html) {
            html = '<div class="outline-empty">' +
                (items.length ? 'No items match the current filter.' : 'The label has no items yet.') + '</div>';
        }
        $('#outline-list').html(html);

        $('#outline-footer').text(items.length + ' item' + (items.length === 1 ? '' : 's') +
            (selected.length ? ' · ' + selected.length + ' selected' : ''));

        // Keep the active row visible, only when the selection changes
        // (e.g. selecting from the canvas); not while editing properties.
        var cur = tleditor.current_selection;
        var curGuid = cur ? cur._guid : null;
        if (cur && curGuid !== this._lastSelGuid) {
            var row = $('#outline-list .outline-row[data-index="' + items.indexOf(cur) + '"]')[0];
            if (row) this.scrollIntoView(row);
        }
        this._lastSelGuid = curGuid;
    },

    scrollIntoView: function (row) {
        var list = row.parentNode;
        if (row.offsetTop < list.scrollTop)
            list.scrollTop = row.offsetTop;
        else if (row.offsetTop + row.offsetHeight > list.scrollTop + list.clientHeight)
            list.scrollTop = row.offsetTop + row.offsetHeight - list.clientHeight;
    },

    /* ----------------------------------------------------------- keyboard */

    onListKeyDown: function (e) {
        var key = e.keyCode, mod = e.ctrlKey || e.metaKey;
        if (!this._rows.length) return;

        if (mod && key === 65) {                       // Ctrl/Cmd+A
            tleditor.selectAll();
            e.preventDefault();
            return;
        }
        if (key === 13) {                              // Enter
            this.openProperties();
            e.preventDefault();
            return;
        }

        var cur = tleditor.current_selection;
        var pos = cur ? this._rows.indexOf(this.getItems().indexOf(cur)) : -1;
        var next = null;
        if (key === 38) next = pos <= 0 ? 0 : pos - 1;                                    // Up
        else if (key === 40) next = pos === -1 ? 0 : Math.min(pos + 1, this._rows.length - 1); // Down
        else if (key === 36) next = 0;                                                    // Home
        else if (key === 35) next = this._rows.length - 1;                                // End
        if (next === null) return;

        e.preventDefault();
        var index = this._rows[next];
        if (e.shiftKey) {
            this.onRowClick({ shiftKey: true, ctrlKey: false, metaKey: false }, index);
        } else {
            tleditor.selectItemByIndex(index);
            this._anchorIndex = index;
        }
    }
};

DocumentOutline.init();