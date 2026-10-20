// Label Document dialog

var LabelDocDialog = (function ($) {

    var Printing = Neodynamic.SDK.Printing;
    var UnitUtils = Neodynamic.Web.Utils.UnitUtils;

    var DIGITS = 4; 

    var LAYOUTS = {
        single:      { img: 'images/labeldoc/roll-single.png',      groups: ['margin', 'vlayout', 'print'] },
        multicolumn: { img: 'images/labeldoc/roll-multicolumn.png', groups: ['margin', 'vlayout', 'hlayout', 'print'] },
        sheet:       { img: 'images/labeldoc/sheet.png',            groups: ['sheet', 'vlayout', 'hlayout'] },
        pages:       { img: 'images/labeldoc/multi-pages.png',      groups: ['margin', 'pages'] },
        duplex:      { img: 'images/labeldoc/duplex.png',           groups: ['margin'] }
    };

    // length fields that must be converted when the unit changes
    var LENGTH_FIELDS = ['#ld_width', '#ld_height', '#ld_gap_length', '#ld_mark_length',
        '#ld_hgap_length', '#ld_sheet_width', '#ld_sheet_height', '#ld_sheet_margin_left',
        '#ld_sheet_margin_top', '#ld_margin_left', '#ld_margin_top', '#ld_margin_right', '#ld_margin_bottom'];

    var _mode = 'new';          // 'new' | 'edit'
    var _layout = 'single';
    var _currentUnit = Printing.UnitType.Inch;
    var _backImage = '';        // raw base64 PNG (no data: prefix), like DesignBackgroundImage

    // ---------- helpers ----------

    function round(v) {
        var f = Math.pow(10, DIGITS);
        return Math.round(v * f) / f;
    }

    function num(sel) {
        var v = parseFloat($(sel).val());
        return isNaN(v) ? 0 : v;
    }

    function int(sel) {
        var v = parseInt($(sel).val(), 10);
        return isNaN(v) ? 0 : v;
    }

    function setNum(sel, v) {
        $(sel).val(round(v || 0));
    }

    function convert(value, fromUnit, toUnit) {
        if (fromUnit === toUnit) return value;
        return round(UnitUtils.convertPixelToUnit(UnitUtils.convertUnitToPixel(value, fromUnit), toUnit));
    }

    // ---------- pages grid (DataGridView replacement) ----------

    function addPageRow(p) {
        p = p || { x: 0, y: 0, width: 0, height: 0 };
        var $tr = $('<tr>');
        ['x', 'y', 'width', 'height'].forEach(function (k) {
            $('<td>').append(
                $('<input type="number" step="any" min="0" class="form-control input-sm">')
                    .attr('data-key', k).attr('aria-label', 'Page ' + k).val(round(p[k] || 0))
            ).appendTo($tr);
        });
        $('<td class="ld-pages-del">').append(
            $('<button type="button" class="btn btn-link btn-xs" title="Remove page"><i class="fa fa-trash-o"></i></button>')
                .on('click', function () { $tr.remove(); updatePagesEmptyState(); })
        ).appendTo($tr);
        $('#ld_pages tbody').append($tr);
        updatePagesEmptyState();
    }

    function updatePagesEmptyState() {
        $('#ld_pages_empty').toggle($('#ld_pages tbody tr').length === 0);
    }

    function setPages(pages) {
        $('#ld_pages tbody').empty();
        (pages || []).forEach(function (p) {
            addPageRow({ x: p.x, y: p.y, width: p.width, height: p.height });
        });
        updatePagesEmptyState();
    }

    
    function getPages() {
        var pages = [];
        $('#ld_pages tbody tr').each(function () {
            var v = {};
            $(this).find('input').each(function () {
                var n = parseFloat($(this).val());
                v[$(this).data('key')] = isNaN(n) ? 0 : n;
            });
            if (!(v.width <= 0 && v.height <= 0)) {
                var pg = new Printing.ThermalLabelPage();
                pg.x = v.x; pg.y = v.y; pg.width = v.width; pg.height = v.height;
                pages.push(pg);
            }
        });
        return pages;
    }

    // ---------- UI state (UpdateLabelOptions) ----------

    function selectLayout(layout) {
        _layout = layout;
        $('#ld_layouts .ld-layout').each(function () {
            var on = $(this).data('layout') === layout;
            $(this).toggleClass('active', on).attr('aria-checked', on ? 'true' : 'false');
        });

        $('#ld_diagram').attr('src', LAYOUTS[layout].img);

        $('#label-document .ld-group[data-group]').each(function () {
            var g = $(this).data('group');
            var always = (g === 'general' || g === 'label');
            $(this).toggle(always || LAYOUTS[layout].groups.indexOf(g) >= 0);
        });

        // multicolumn/sheet need at least 2 labels per row to be detected as such on reload
        if ((layout === 'multicolumn' || layout === 'sheet') && int('#ld_labels_per_row') < 2)
            $('#ld_labels_per_row').val(2);

        if (layout === 'pages' && $('#ld_pages tbody tr').length === 0)
            addPageRow({ x: 0, y: 0, width: num('#ld_width'), height: num('#ld_height') });

        $('#ld_label_width_caption').text(layout === 'duplex' ? 'Width (each side)' : 'Width');
        updateBackImageUI();
    }

    function updateContinuousUI() {
        var cont = $('#ld_is_continuous').prop('checked');
        $('#ld_gap_length, #ld_mark_length').prop('disabled', cont);
    }

    function updateBackImageUI() {
        var allowed = _layout !== 'pages';
        var has = !!(_backImage && _backImage.length);
        $('#ld_backimg_set').toggle(allowed);
        $('#ld_backimg_clear').toggle(allowed && has);
        $('#ld_backimg_thumb').toggle(allowed && has)
            .attr('src', has ? 'data:image/png;base64,' + _backImage : '');
    }

    function onUnitChanged() {
        var newUnit = parseInt($('#ld_unit').val(), 10);
        LENGTH_FIELDS.forEach(function (sel) {
            setNum(sel, convert(num(sel), _currentUnit, newUnit));
        });
        $('#ld_pages tbody input').each(function () {
            var v = parseFloat($(this).val());
            $(this).val(convert(isNaN(v) ? 0 : v, _currentUnit, newUnit));
        });
        _currentUnit = newUnit;
        $('#label-document .ld-unit-suffix').text(Printing.UnitType[newUnit]);
    }

    // ---------- model <-> form ----------

    function loadDefaults() {
        _currentUnit = Printing.UnitType.Inch;
        $('#ld_unit').val(_currentUnit);
        $('#ld_shape').val(Printing.LabelShape.Rectangle);
        setNum('#ld_width', 4); setNum('#ld_height', 3);
        ['#ld_gap_length', '#ld_mark_length', '#ld_hgap_length',
            '#ld_margin_left', '#ld_margin_top', '#ld_margin_right', '#ld_margin_bottom',
            '#ld_sheet_margin_left', '#ld_sheet_margin_top'].forEach(function (s) { setNum(s, 0); });
        setNum('#ld_sheet_width', 8.5); setNum('#ld_sheet_height', 11);
        $('#ld_labels_per_row').val(2);
        $('#ld_sheet_labels_count').val(0);
        $('#ld_is_continuous, #ld_print_mirror, #ld_cut_after_printing').prop('checked', false);
        $('#ld_print_speed').val('');
        _backImage = '';
        setPages([]);
        return 'single';
    }

    
    function loadFromThermalLabel(tl) {
        _currentUnit = parseInt(tl.unit_type, 10);
        $('#ld_unit').val(_currentUnit);

        $('#ld_shape').val(parseInt(tl.shape, 10));

        setNum('#ld_width', tl.width);
        setNum('#ld_height', tl.height);
        setNum('#ld_gap_length', tl.gap_length);
        setNum('#ld_mark_length', tl.mark_length);
        setNum('#ld_hgap_length', tl.labels_horizontal_gap_length);
        $('#ld_labels_per_row').val(tl.labels_per_row);
        setNum('#ld_sheet_width', tl.sheet_labels_width);
        setNum('#ld_sheet_height', tl.sheet_labels_height);
        $('#ld_sheet_labels_count').val(tl.sheet_labels_count);
        var sm = tl.sheet_labels_margin;
        setNum('#ld_sheet_margin_left', sm.left);
        setNum('#ld_sheet_margin_top', sm.top);
        var m = tl.margin;
        setNum('#ld_margin_left', m.left);
        setNum('#ld_margin_top', m.top);
        setNum('#ld_margin_right', m.right);
        setNum('#ld_margin_bottom', m.bottom);

        $('#ld_is_continuous').prop('checked', !!tl.is_continuous);
        $('#ld_print_mirror').prop('checked', !!tl.print_mirror);
        $('#ld_cut_after_printing').prop('checked', !!tl.cut_after_printing);
        $('#ld_print_speed').val(tl.print_speed || '');

        _backImage = tl.design_background_image || '';
        setPages([]);

        // NOTE: in the web model a duplex label's width is already the width of one side
        if (tl.sheet_labels_count > 0 || tl.sheet_labels_height > 0 || tl.sheet_labels_width > 0)
            return 'sheet';
        if (tl.labels_per_row > 1)
            return 'multicolumn';
        if (tl.is_duplex_design)
            return 'duplex';
        if (tl.pages && tl.pages.length > 0) {
            setPages(tl.pages);
            _backImage = '';
            return 'pages';
        }
        return 'single';
    }

    function validate() {
        var errors = [];
        if (num('#ld_width') <= 0) errors.push('Width must be greater than 0.');
        if (num('#ld_height') <= 0) errors.push('Height must be greater than 0.');
        if (_layout === 'pages' && getPages().length === 0)
            errors.push('Add at least one page with a width or height.');
        if (_layout === 'sheet' && (num('#ld_sheet_width') <= 0 || num('#ld_sheet_height') <= 0))
            errors.push('Sheet width and height must be greater than 0.');

        $('#ld_errors').toggle(errors.length > 0).html(errors.join('<br/>'));
        return errors.length === 0;
    }

    function applyToThermalLabel(tl) {
        var layout = _layout;
        var isMultiCol = layout === 'multicolumn';
        var isSheet = layout === 'sheet';

        tl.unit_type = parseInt($('#ld_unit').val(), 10);
        tl.shape = parseInt($('#ld_shape').val(), 10);
        tl.width = num('#ld_width');
        tl.height = num('#ld_height');

        tl.is_continuous = $('#ld_is_continuous').prop('checked');
        tl.gap_length = num('#ld_gap_length');
        tl.mark_length = num('#ld_mark_length');

        tl.print_speed = $('#ld_print_speed').val();
        tl.print_mirror = $('#ld_print_mirror').prop('checked');
        tl.cut_after_printing = $('#ld_cut_after_printing').prop('checked');

        tl.margin = new Printing.FrameThickness(num('#ld_margin_left'), num('#ld_margin_top'),
            num('#ld_margin_right'), num('#ld_margin_bottom'));

        tl.labels_per_row = (isMultiCol || isSheet) ? Math.max(1, int('#ld_labels_per_row')) : 1;
        tl.labels_horizontal_gap_length = (isMultiCol || isSheet) ? num('#ld_hgap_length') : 0;

        tl.sheet_labels_count = isSheet ? int('#ld_sheet_labels_count') : 0;
        tl.sheet_labels_width = isSheet ? num('#ld_sheet_width') : 0;
        tl.sheet_labels_height = isSheet ? num('#ld_sheet_height') : 0;
        tl.sheet_labels_margin = isSheet
            ? new Printing.FrameThickness(num('#ld_sheet_margin_left'), num('#ld_sheet_margin_top'), 0, 0)
            : new Printing.FrameThickness(0, 0, 0, 0);

        tl.design_background_image = (layout === 'pages') ? '' : _backImage;

        if (layout === 'pages')
            tl.pages = getPages();
    }

    // ---------- actions ----------

    function onOk() {
        if (!validate()) return;

        if (_mode === 'new') {
            var tl = new Printing.ThermalLabel();
            applyToThermalLabel(tl);
            if (_layout === 'duplex') {
                var front = new Printing.ThermalLabelPage();
                front.x = 0; front.y = 0; front.width = tl.width; front.height = tl.height;
                var back = new Printing.ThermalLabelPage();
                back.x = tl.width; back.y = 0; back.width = tl.width; back.height = tl.height;
                tl.pages = [front, back];
                tl.is_duplex_design = true;
            }
            tleditor.loadThermalLabel(tl);
            tleditor.zoom = 100;
        } else {
            var cur = tleditor.get_thermal_label;
            if (!cur) return;

            if (cur.is_duplex_design && _layout !== 'duplex') {
                cur.is_duplex_design = false;
                if (cur.is_duplex_design) return;
            }

            if (_layout !== 'pages' && _layout !== 'duplex') cur.pages = [];
            if (_layout === 'duplex' && !cur.is_duplex_design) cur.pages = [];

            applyToThermalLabel(cur);

            if (_layout === 'duplex') cur.is_duplex_design = true;

            tleditor.loadThermalLabel(cur, { resetUndoHistory: false, resetActivePage: false });
            tleditor.saveCurrentLabelCanvasState();
            tleditor.selectionChanged();
        }

        $('#label-document').modal('hide');
    }

    function open(mode) {
        _mode = (mode === 'edit' && tleditor.get_thermal_label) ? 'edit' : 'new';

        var layout = (_mode === 'edit') ? loadFromThermalLabel(tleditor.get_thermal_label) : loadDefaults();

        $('#ld_title_text').text(_mode === 'edit' ? 'Label Properties' : 'New Label');
        $('#ld_title_icon').attr('class', _mode === 'edit' ? 'fa fa-tag' : 'fa fa-file-o');
        $('#ld_ok').text(_mode === 'edit' ? 'Apply changes' : 'Create label');
        $('#ld_errors').hide();
        $('#label-document .ld-unit-suffix').text(Printing.UnitType[_currentUnit]);

        updateContinuousUI();
        selectLayout(layout);
        $('#label-document').modal('show');
    }

    // ---------- wiring ----------

    $(function () {
        var $dlg = $('#label-document');
        if ($dlg.length === 0) return;

        var units = [];
        for (var k in Printing.UnitType) {
            if (isNaN(parseInt(k, 10))) units.push({ name: k, value: Printing.UnitType[k] });
        }
        units.sort(function (a, b) { return a.name.localeCompare(b.name); });
        var $unit = $('#ld_unit').empty();
        units.forEach(function (u) { $unit.append($('<option>').val(u.value).text(u.name)); });

        $unit.on('change', onUnitChanged);

        var shapes = [];
        for (var k in Printing.LabelShape) {
            if (isNaN(parseInt(k, 10))) shapes.push({ name: k, value: Printing.LabelShape[k] });
        }
        var $shape = $('#ld_shape').empty();
        shapes.forEach(function (u) { $shape.append($('<option>').val(u.value).text(u.name)); });

        $('#ld_is_continuous').on('change', updateContinuousUI);
        $('#ld_layouts').on('click', '.ld-layout', function () { selectLayout($(this).data('layout')); });
        $('#ld_layouts').on('keydown', '.ld-layout', function (e) {
            var $all = $('#ld_layouts .ld-layout');
            var i = $all.index(this);
            if (e.which === 39 || e.which === 40) i = (i + 1) % $all.length;
            else if (e.which === 37 || e.which === 38) i = (i - 1 + $all.length) % $all.length;
            else return;
            e.preventDefault();
            $all.eq(i).focus().click();
        });
        $('#ld_pages_add').on('click', function () { addPageRow(); });

        $('#ld_backimg_set').on('click', function () { $('#ld_backimg_file').val('').trigger('click'); });
        $('#ld_backimg_file').on('change', function () {
            var f = this.files && this.files[0];
            if (!f) return;
            var fr = new FileReader();
            fr.onload = function () {
                var s = String(fr.result);
                _backImage = s.substring(s.indexOf(',') + 1); // strip "data:image/png;base64,"
                updateBackImageUI();
            };
            fr.readAsDataURL(f);
        });
        $('#ld_backimg_clear').on('click', function () { _backImage = ''; updateBackImageUI(); });

        $('#ld_ok').on('click', onOk);
        // AcceptButton behaviour
        $dlg.on('keydown', 'input', function (e) {
            if (e.which === 13) { e.preventDefault(); onOk(); }
        });
    });

    return { open: open };

})(jQuery);
