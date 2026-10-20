// Sample Label Editor UI
// - Referencing and Using ThermalLabelWebEditor-16.0.N.N.js
// NOTE: You can create your own Editor UI around the ThermalLabel Web Editor Canvas 

var UIEditor = {

    isTouch: function () { return window.matchMedia("(pointer: coarse)").matches },

    closeModal: function () {
        $(".modal").modal("hide");
    },

    newDocument: function () {
        var tl = new Neodynamic.SDK.Printing.ThermalLabel();
        tl.unit_type = $("#doc_unit").children("option:selected").val();
        tl.width = $("#doc_width").val();
        tl.height = $("#doc_height").val();
        tleditor.loadThermalLabel(tl);
        this.closeModal();
        $('#editorTabs a[href="#label-design-tab"]').tab('show');
        tleditor.zoom = 100;
    },

    openDocument: function () {


        if ($("#open_file_url").val() && $("#open_file_url").val().length > 0) {
            $.get($("#open_file_url").val()).
                success(function (data) {
                    var tl = data[0] == '<' ? Neodynamic.SDK.Printing.ThermalLabel.createFromXmlTemplate(data) : Neodynamic.SDK.Printing.ThermalLabel.createFromJsonTemplate(data);
                    tleditor.loadThermalLabel(tl);
                    UIEditor.displayGlobalExpressions();
                    UIEditor.closeModal();
                    $('#editorTabs a[href="#label-design-tab"]').tab('show');
                    tleditor.zoom = 100;
                }).
                error(function (data) {
                    console.error(data);
                    UIEditor.showErrorMsg("Check the console for more information.");
                    UIEditor.closeModal();
                });
        }
        else if ($("#open_file_local").prop('files')[0]) {

            if (window.FileReader) {
                var fr = new FileReader();
                fr.onload = function () {
                    var tl = fr.result[0] == '<' ? Neodynamic.SDK.Printing.ThermalLabel.createFromXmlTemplate(fr.result) : Neodynamic.SDK.Printing.ThermalLabel.createFromJsonTemplate(fr.result);
                    tleditor.loadThermalLabel(tl);
                    UIEditor.displayGlobalExpressions();
                    UIEditor.closeModal();
                    $('#editorTabs a[href="#label-design-tab"]').tab('show');
                    tleditor.zoom = 100;
                };
                fr.readAsText($("#open_file_local").prop('files')[0]);

            } else {
                UIEditor.showErrorMsg('The File APIs are not fully supported in this browser.');
                UIEditor.closeModal();
            }
        }

    },

    saveDocument: function (format) {
        if (tleditor.get_thermal_label) {
            tleditor.save(null, null, format);
        }
    },

    exportDocument: function (format) {
        if (tleditor.get_thermal_label) {

            let self = this;

            let ds = this.getDataSource();

            switch (format) {
                case 'Png':
                case 'Jpeg':
                case 'Svg':
                    let ret = prompt("Please specify the output DPI (default is 96):");
                    let dpi = parseFloat(ret);

                    if (isNaN(dpi)) {
                        dpi = 96;
                    }

                    let imgSettings = new Neodynamic.SDK.Printing.ImageSettings(Neodynamic.SDK.Printing.ImageFormat[format]);
                    imgSettings.anti_alias = true;
                    tleditor.getLabelAsImage(null, null, imgSettings, dpi, ds.dataSourceFormat, ds.dataSource, function (labelOutContent) {
                        let mimeType = 'image/' + format.toLowerCase();
                        if (format == 'Svg') mimeType += '+xml';
                        self.downloadContent(labelOutContent, mimeType, 'label_export.' + format.toLowerCase());
                    });
                    break;
                case 'Html':
                    tleditor.getLabelAsHtml(null, null, ds.dataSourceFormat, ds.dataSource, function (labelOutContent) {
                        self.downloadContent(labelOutContent, 'text/html', 'label_export.' + format.toLowerCase());
                    });
                    break;
                case 'Pdf':
                    let pdfMetadata = new Neodynamic.SDK.Printing.PdfMetadata();
                    pdfMetadata.use_vector_drawing = true;
                    tleditor.getLabelAsPdf(null, null, pdfMetadata, null, ds.dataSourceFormat, ds.dataSource, function (labelOutContent) {
                        self.downloadContent(labelOutContent, 'application/pdf', 'label_export.' + format.toLowerCase());
                    });
                    break;
            }

        }
    },

    downloadContent: function (base64Content, mimeType, fileName) {
        let Blo
        if (mimeType == 'text/html') {
            const htmlContent = `
                                <!DOCTYPE html>
                                <html>
                                <head>
                                    <title>Label</title>
                                </head>
                                <body>
                                    ${base64Content}
                                </body>
                                </html>
                                `;
            blob = new Blob([htmlContent], { type: 'text/html' });
        } else {
            const bytesBin = atob(base64Content);
            const count = bytesBin.length;
            const arrayBytes = new Uint8Array(count);
            for (let i = 0; i < count; i++) {
                arrayBytes[i] = bytesBin.charCodeAt(i);
            }
            blob = new Blob([arrayBytes], { type: mimeType });
        }

        const urlBlob = URL.createObjectURL(blob);

        const aDownload = document.createElement('a');
        aDownload.href = urlBlob;
        aDownload.download = fileName;
        aDownload.style.display = 'none';

        document.body.appendChild(aDownload);
        aDownload.click();
        document.body.removeChild(aDownload);

        URL.revokeObjectURL(urlBlob);
    },

    addNewItem: async function (itemType, extraParam) {
        switch (itemType) {
            case 'Rectangle': {
                var newRectItem = new Neodynamic.SDK.Printing.RectangleShapeItem();

                if (this.isTouch()) {
                    tleditor.addItem(newRectItem);
                }
                else {
                    tleditor.active_tool_item = newRectItem;
                    tleditor.active_tool = Neodynamic.Web.Editor.EditorTool.Rectangle;
                }

                return;
            }
            case 'Ellipse': {
                var newEllipseItem = new Neodynamic.SDK.Printing.EllipseShapeItem();
                if (this.isTouch()) {
                    tleditor.addItem(newEllipseItem);
                }
                else {
                    tleditor.active_tool_item = newEllipseItem;
                    tleditor.active_tool = Neodynamic.Web.Editor.EditorTool.Ellipse;
                }
                return;
            }
            case 'Line': {
                var newLineItem = new Neodynamic.SDK.Printing.LineShapeItem();
                if (this.isTouch()) {
                    tleditor.addItem(newLineItem);
                }
                else {
                    tleditor.active_tool_item = newLineItem;
                    tleditor.active_tool = Neodynamic.Web.Editor.EditorTool.Line;
                }
                return;
            }
            case 'Image': {
                var newImageItem = new Neodynamic.SDK.Printing.ImageItem();
                if (extraParam) {
                    var base64Image = extraParam.split(',')[1];
                    newImageItem.source_base64 = base64Image;
                    newImageItem.convert_to_monochrome = false;
                }

                if (this.isTouch()) {
                    tleditor.addItem(newImageItem);
                }
                else {
                    tleditor.active_tool_item = newImageItem;
                    tleditor.active_tool = Neodynamic.Web.Editor.EditorTool.Image;
                }
                return;
            }
            case 'RFID': {
                var newRFIDItem = new Neodynamic.SDK.Printing.RFIDTagItem();

                if (extraParam) {
                    newRFIDItem.data_format = Neodynamic.SDK.Printing.RFIDTagDataFormat[extraParam[0]];
                    newRFIDItem.data_to_encode = extraParam[1];

                    if (extraParam[0] == 'EPC') newRFIDItem.epc_data_structure = extraParam[2];
                    if (extraParam[0] == 'Hexadecimal' && extraParam[2]) {
                        newRFIDItem.tag_type = Neodynamic.SDK.Printing.RFIDTagType[extraParam[2]];
                        newRFIDItem.number_of_bytes = extraParam[3];
                        newRFIDItem.starting_block = extraParam[4];
                        newRFIDItem.memory_bank = extraParam[5];
                    }
                }

                if (this.isTouch()) {
                    tleditor.addItem(newRFIDItem);
                }
                else {
                    tleditor.active_tool_item = newRFIDItem;
                    tleditor.active_tool = Neodynamic.Web.Editor.EditorTool.RFIDTag;
                }
                return;
            }
            case 'Barcode': {
                var newBarcodeItem = new Neodynamic.SDK.Printing.BarcodeItem();
                newBarcodeItem.sizing = Neodynamic.SDK.Printing.BarcodeSizing.FitProportional;
                if (extraParam) {
                    newBarcodeItem.symbology = Neodynamic.SDK.Printing.BarcodeSymbology[extraParam[0]];
                    newBarcodeItem.code = extraParam[1];

                    if (extraParam[0] == 'Code39') newBarcodeItem.add_checksum = false;
                }

                if (newBarcodeItem.symbology == Neodynamic.SDK.Printing.BarcodeSymbology.UpcA ||
                    newBarcodeItem.symbology == Neodynamic.SDK.Printing.BarcodeSymbology.UpcE ||
                    newBarcodeItem.symbology == Neodynamic.SDK.Printing.BarcodeSymbology.Ean13 ||
                    newBarcodeItem.symbology == Neodynamic.SDK.Printing.BarcodeSymbology.Ean8) {
                    newBarcodeItem.font.name = "OCR B";
                }
                else {
                    newBarcodeItem.font.name = "ZPLFont0";
                }

                if (this.isTouch()) {
                    tleditor.addItem(newBarcodeItem);
                }
                else {
                    tleditor.active_tool_item = newBarcodeItem;
                    tleditor.active_tool = Neodynamic.Web.Editor.EditorTool.Barcode;
                }
                return;
            }
            case 'Barcode2D': {
                var newBarcodeItem = new Neodynamic.SDK.Printing.BarcodeItem();
                newBarcodeItem.symbology = Neodynamic.SDK.Printing.BarcodeSymbology.QRCode;
                newBarcodeItem.sizing = Neodynamic.SDK.Printing.BarcodeSizing.FitProportional;
                newBarcodeItem.barcode_alignment = Neodynamic.SDK.Printing.BarcodeAlignment.MiddleCenter;

                if (extraParam) {
                    newBarcodeItem.symbology = Neodynamic.SDK.Printing.BarcodeSymbology[extraParam[0]];
                    newBarcodeItem.code = extraParam[1];
                    if (extraParam[0] == 'Maxicode') newBarcodeItem.maxi_code_mode = Neodynamic.SDK.Printing.MaxiCodeModes[extraParam[2]];
                }

                newBarcodeItem.font.name = "ZPLFont0";

                if (this.isTouch()) {
                    tleditor.addItem(newBarcodeItem);
                }
                else {
                    tleditor.active_tool_item = newBarcodeItem;
                    tleditor.active_tool = Neodynamic.Web.Editor.EditorTool.Barcode;
                }
                return;
            }
            case 'Text': {
                var newTextItem = new Neodynamic.SDK.Printing.TextItem();
                newTextItem.font.name = "ZPL Font 0";

                if (extraParam) {
                    newTextItem.input_mask_pattern = extraParam;
                } else {
                    newTextItem.text = "TYPE HERE...";
                }

                if (this.isTouch()) {
                    tleditor.addItem(newTextItem);
                }
                else {
                    tleditor.active_tool_item = newTextItem;
                    tleditor.active_tool = Neodynamic.Web.Editor.EditorTool.Text;
                }
                return;
            }
            case 'TextResidentFont': {
                var newTextItem = new Neodynamic.SDK.Printing.TextItem();

                if (extraParam) {
                    newTextItem.input_mask_pattern = extraParam;
                } else {
                    newTextItem.text = "TYPE HERE...";
                }

                if (this.isTouch()) {
                    tleditor.addItem(newTextItem);
                }
                else {
                    tleditor.active_tool_item = newTextItem;
                    tleditor.active_tool = Neodynamic.Web.Editor.EditorTool.Text;
                }
                return;
            }
            case 'TextArc': {
                var newTextItem = new Neodynamic.SDK.Printing.TextItem();
                newTextItem.font.name = "Arial";
                newTextItem.sizing = Neodynamic.SDK.Printing.TextSizing.Arc;
                newTextItem.text = "TEXT";

                if (this.isTouch()) {
                    tleditor.addItem(newTextItem);
                }
                else {
                    tleditor.active_tool_item = newTextItem;
                    tleditor.active_tool = Neodynamic.Web.Editor.EditorTool.Text;
                }
                return;
            }
            case 'TextOutline': {
                var newTextItem = new Neodynamic.SDK.Printing.TextItem();
                newTextItem.font.name = "Arial";
                newTextItem.sizing = Neodynamic.SDK.Printing.TextSizing.Stretch;
                newTextItem.stroke_color_hex = "#ff0000";
                newTextItem.stroke_thickness = 0.02;
                newTextItem.fore_color_hex = "#0000ff";
                newTextItem.text = "TEXT";

                if (this.isTouch()) {
                    tleditor.addItem(newTextItem);
                }
                else {
                    tleditor.active_tool_item = newTextItem;
                    tleditor.active_tool = Neodynamic.Web.Editor.EditorTool.Text;
                }
                return;
            }
            case 'Table': {
                var b = document.getElementById("tlbTable");
                var bData = b.getBoundingClientRect();
                let [colCount, rowCount] = await tablePicker(bData.left, bData.top + bData.height);

                var newTableItem = new Neodynamic.SDK.Printing.TableShapeItem();
                for (var i = 0; i < colCount; i++) newTableItem.columns.push(new Neodynamic.SDK.Printing.TableColumn());
                for (var i = 0; i < rowCount; i++) newTableItem.rows.push(new Neodynamic.SDK.Printing.TableRow());

                if (this.isTouch()) {
                    tleditor.addItem(newTableItem);
                }
                else {
                    tleditor.active_tool_item = newTableItem;
                    tleditor.active_tool = Neodynamic.Web.Editor.EditorTool.Table;
                }
                return;
            }
            case 'Repeater': {
                var newRepItem = new Neodynamic.SDK.Printing.RepeaterItem();
                if (this.isTouch()) {
                    tleditor.addItem(newRepItem);
                }
                else {
                    tleditor.active_tool_item = newRepItem;
                    tleditor.active_tool = Neodynamic.Web.Editor.EditorTool.Repeater;
                }
                return;
            }
            case 'Literal': {
                var newLitItem = new Neodynamic.SDK.Printing.LiteralItem();
                newLitItem.text = "LITERAL";
                if (this.isTouch()) {
                    tleditor.addItem(newLitItem);
                }
                else {
                    tleditor.active_tool_item = newLitItem;
                    tleditor.active_tool = Neodynamic.Web.Editor.EditorTool.Literal;
                }
                return;
            }
        }
    },

    alignItems: function (alignment) {
        tleditor.alignItems(Neodynamic.Web.Editor.LayoutAlignment[alignment]);
    },

    setSelectedItemsToSameSize: function (sameWidth, sameHeight) {
        tleditor.setSelectedItemsToSameSize(sameWidth, sameHeight);
    },

    rotateView: function (angle, element) {
        tleditor.rotateView(Neodynamic.Web.Editor.Rotate[angle]);

        var $menu = $(element).closest('.dropdown-menu');

        $menu.find('.dynamic-check').addClass('hidden');

        $(element).find('.dynamic-check').removeClass('hidden');
    },

    changeZoom: function (val) {
        switch (val) {
            case "+": {
                tleditor.zoom += 10;
            } break;
            case "-": {
                tleditor.zoom -= 10;
            } break;
            default: {
                tleditor.zoom = 100;
            } break;
        }
        $('#zoom-val').text(`${Math.trunc(tleditor.zoom)}%`);
    },

    lockItem: function () {
        if (tleditor.current_selection === null)
            return;
        tleditor.lockSelectedItems();
    },

    unlockItem: function () {
        if (tleditor.current_selection === null)
            return;
        tleditor.unlockSelectedItems();
    },

    deleteSelectedItems: function () {
        tleditor.deleteSelectedItems();
    },

    sendToBack: function () {
        tleditor.sendToBack();
    },

    sendBackward: function () {
        tleditor.sendBackward();
    },

    bringToFront: function () {
        tleditor.bringToFront();
    },

    bringForward: function () {
        tleditor.bringForward();
    },

    clipboardCut: function () {
        tleditor.clipboardCut();
    },

    clipboardCopy: function () {
        tleditor.clipboardCopy();
    },

    clipboardPaste: function () {
        tleditor.clipboardPaste();
    },

    objectDuplicate: function () {
        tleditor.duplicateSelectedItems();
    },

    undo: function () {
        tleditor.undo();
        tleditor.selectionChanged();
    },

    redo: function () {
        tleditor.redo();
        tleditor.selectionChanged();
    },

    getDataSource: function () {
        let dataSourceFormat = null;
        let dataSource = null;
        if ($('#chkUseDataSourceSample').prop('checked')) {
            dataSourceFormat = 'xml';
            dataSource = $('#txtDataSource').val();
        }

        return { dataSourceFormat: dataSourceFormat, dataSource: dataSource };
    },

    getLabelUnit: function () {
        var tl = tleditor.get_thermal_label;
        if (tl) {
            return Neodynamic.SDK.Printing.UnitType[tl.unit_type];
        } else
            return "";
    },

    showLabelPreview: function () {
        if (tleditor.get_thermal_label) {
            //var imgLabelB64 = tleditor.getLabelPreview();
            //$('#imgLabelPreview').attr('src', 'data:image/png;base64,' + imgLabelB64);

            var ds = this.getDataSource();

            tleditor.getLabelPreview(null, null, 'html', ds.dataSourceFormat, ds.dataSource, function (htmlLabelPreviewContent) {
                $('#htmlLabelPreview').html(htmlLabelPreviewContent);
            });

        }
    },

    doPrinting: function () {
        if (tleditor.get_thermal_label) {
            var dataSourceFormat = null;
            var dataSource = null;
            if ($('#chkUseDataSourceSample').prop('checked')) {
                dataSourceFormat = 'xml';
                dataSource = $('#txtDataSource').val();
            }

            tleditor.print(null, dataSourceFormat, dataSource);
        }
    },

    editGlobalExpressions: function () {
        if (tleditor.get_thermal_label) {

            let globalExpr = tleditor.get_thermal_label.expressions.join('\n');

            tleditor.hideItemTooltip();
            exprBuilder.openExpressionBuilder(globalExpr, true);
            exprBuilder.curElemId = 'txtGlobalExpressions';

        }
    },

    setGlobalExpressions: function () {
        if (tleditor.get_thermal_label) {
            let globalExpr = $('#txtGlobalExpressions').val();
            tleditor.get_thermal_label.expressions = globalExpr.split('\n');
        }
    },

    displayGlobalExpressions: function () {
        if (tleditor.get_thermal_label) {

            let htmlExpr = '';
            tleditor.get_thermal_label.expressions.forEach(function (x) {
                htmlExpr += '<tr><td>' + x + '</td></tr>';
            });
            $('#tableGlobalExpressions').html(htmlExpr);
            $('#txtExpressionsCount').html(tleditor.get_thermal_label.expressions.length);
        }
    },

    // ---------- Editor options dialog (#options) ----------

    OPTIONS_STORAGE_KEY: 'tlwe.editorOptions',
    _optDefaults: null,      // captured once in initOptions(), before saved prefs are applied
    _optPending: null,       // saved prefs waiting for a label to be loaded (grid size needs a unit)

    // Normalizes any CSS color to #rrggbb (what <input type="color"> requires)
    _toHexColor: function (c, fallback) {
        try {
            var ctx = document.createElement('canvas').getContext('2d');
            ctx.fillStyle = '#000000';
            ctx.fillStyle = String(c || '').trim();
            var v = ctx.fillStyle;
            return /^#[0-9a-f]{6}$/i.test(v) ? v : fallback;
        } catch (e) { return fallback; }
    },

    _setGridColor: function (hex, isDefault) {
        var el = document.getElementById('thermalLabelWebEditor');
        if (!el) return;
        if (isDefault) el.style.removeProperty('--grid-color'); // fall back to the stylesheet value
        else el.style.setProperty('--grid-color', hex);
    },

    _selectGridType: function (type) {
        type = parseInt(type, 10) || 0;
        $('#opt_grid_types .ld-layout').each(function () {
            var on = parseInt($(this).data('grid-type'), 10) === type;
            $(this).toggleClass('active', on).attr('aria-checked', on ? 'true' : 'false').attr('tabindex', on ? '0' : '-1');
        });
    },

    _getSelectedGridType: function () {
        return parseInt($('#opt_grid_types .ld-layout.active').data('grid-type'), 10) || 0;
    },

    _updateGridOptionsUI: function () {
        var on = $('#opt_show_grid').prop('checked');
        $('#opt_grid_types').toggleClass('disabled', !on).find('.ld-layout').prop('disabled', !on);
        $('#opt_grid_color').prop('disabled', !on);
    },

    _round: function (v, digits) {
        return parseFloat(Number(v).toFixed(digits));
    },

    // Fills the form from an options object (editor state or defaults)
    _fillOptionsForm: function (o) {
        var tl = tleditor.get_thermal_label;
        var UnitUtils = Neodynamic.Web.Utils.UnitUtils;
        if (tl)
            $('#opt_grid_size').val(this._round(UnitUtils.convertPixelToUnit(o.grid_size_px, tl.unit_type), 4)).prop('disabled', false);
        else
            $('#opt_grid_size').val('').prop('disabled', true);
        $('#opt_label_unit').text(this.getLabelUnit());

        $('#opt_show_grid').prop('checked', !!o.show_grid);
        $('#opt_snap_to_grid').prop('checked', !!o.snap_to_grid);
        this._selectGridType(o.grid_type);
        $('#opt_grid_color').val(o.grid_color);
        $('#opt_snap_to_items').prop('checked', !!o.snap_to_items);
        $('#opt_angle_snap').val(o.angle_snap);
        $('#opt_show_ruler').prop('checked', !!o.show_ruler);
        $('#opt_adorner_out_of_label').prop('checked', !!o.adorner_out_of_label_visible);
        $('#opt_fractional_digits').val(o.num_of_fractional_digits);
        $('#opt_system_clipboard').prop('checked', o.clipboard_mode === Neodynamic.Web.Editor.EditorClipboardMode.System);

        $('#options .ld-field').removeClass('ld-invalid');
        $('#opt_errors').hide();
        this._updateGridOptionsUI();
    },

    // Current editor state as a unit-independent options object
    _readEditorOptions: function () {
        var tl = tleditor.get_thermal_label;
        if (!tl && this._optPending) {
            // Not applied yet: show what will be applied
            var p = $.extend({}, this._optPending);
            if (p.grid_size_px == null) p.grid_size_px = this._optDefaults.grid_size_px;
            return p;
        }
        var gridPx = tl
            ? Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(tleditor.grid_size, tl.unit_type)
            : this._optDefaults.grid_size_px;
        return {
            grid_size_px: gridPx,
            show_grid: !!tleditor.show_grid,
            snap_to_grid: !!tleditor.snap_to_grid,
            grid_type: parseInt(tleditor.grid_type, 10) || 0,
            grid_color: this._toHexColor(tleditor.getStyleValue('--grid-color'), this._optDefaults.grid_color),
            snap_to_items: !!tleditor.snap_to_items,
            angle_snap: parseInt(tleditor.angle_snap, 10) || 0,
            show_ruler: !!tleditor.show_ruler,
            adorner_out_of_label_visible: !!tleditor.adorner_out_of_label_visible,
            num_of_fractional_digits: parseInt(tleditor.num_of_fractional_digits, 10),
            clipboard_mode: tleditor.clipboard_mode
        };
    },

    // Validates the form; returns an options object or null (errors shown inline)
    _readOptionsForm: function () {
        var errors = [];
        var tl = tleditor.get_thermal_label;
        $('#options .ld-field').removeClass('ld-invalid');
        function fail($input, msg) { $input.closest('.ld-field').addClass('ld-invalid'); errors.push(msg); }
        function isInt(s) { return /^\d+$/.test(String(s).trim()); }

        var gridPx = null;
        if (tl) {
            var gs = parseFloat($('#opt_grid_size').val());
            if (!(gs > 0)) fail($('#opt_grid_size'), 'Grid size must be greater than 0.');
            else {
                gridPx = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(gs, tl.unit_type);
                if (gridPx < 2) fail($('#opt_grid_size'), 'Grid size is too small to be displayed.');
            }
        }

        var angle = $('#opt_angle_snap').val();
        if (!isInt(angle) || +angle > 90) fail($('#opt_angle_snap'), 'Angle snap must be a whole number between 0 and 90.');

        var digits = $('#opt_fractional_digits').val();
        if (!isInt(digits) || +digits > 6) fail($('#opt_fractional_digits'), 'Decimal places must be a whole number between 0 and 6.');

        $('#opt_errors').toggle(errors.length > 0).html(errors.join('<br/>'));
        if (errors.length) {
            $('#options .ld-invalid .form-control').first().focus();
            return null;
        }

        return {
            grid_size_px: gridPx,  // null = keep current (no label loaded)
            show_grid: $('#opt_show_grid').prop('checked'),
            snap_to_grid: $('#opt_snap_to_grid').prop('checked'),
            grid_type: this._getSelectedGridType(),
            grid_color: this._toHexColor($('#opt_grid_color').val(), this._optDefaults.grid_color),
            snap_to_items: $('#opt_snap_to_items').prop('checked'),
            angle_snap: parseInt(angle, 10),
            show_ruler: $('#opt_show_ruler').prop('checked'),
            adorner_out_of_label_visible: $('#opt_adorner_out_of_label').prop('checked'),
            num_of_fractional_digits: parseInt(digits, 10),
            clipboard_mode: $('#opt_system_clipboard').prop('checked')
                ? Neodynamic.Web.Editor.EditorClipboardMode.System
                : Neodynamic.Web.Editor.EditorClipboardMode.Internal
        };
    },

    // Pushes an options object into the editor
    _applyOptions: function (o) {
        var tl = tleditor.get_thermal_label;

        // The grid setters redraw the canvas background, which needs a loaded label.
        // Without one, keep the options and apply them on the next loadThermalLabel().
        if (!tl) { this._optPending = o; return; }
        this._optPending = null;

        // Grid color first: the grid is rebuilt below and reads --grid-color at that moment
        this._setGridColor(o.grid_color, o.grid_color.toLowerCase() === this._optDefaults.grid_color.toLowerCase());

        // Order matters: the grid_type setter clears the grid when given Lines (0),
        // so type and size go first and show_grid last (its setter rebuilds the grid).
        tleditor.grid_type = o.grid_type;
        if (o.grid_size_px != null)
            tleditor.grid_size = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(o.grid_size_px, tl.unit_type);
        tleditor.snap_to_grid = o.snap_to_grid;
        tleditor.show_grid = o.show_grid;

        tleditor.snap_to_items = o.snap_to_items;
        tleditor.angle_snap = o.angle_snap;
        tleditor.show_ruler = o.show_ruler;
        tleditor.adorner_out_of_label_visible = o.adorner_out_of_label_visible;
        tleditor.num_of_fractional_digits = o.num_of_fractional_digits;
        tleditor.clipboard_mode = o.clipboard_mode;

        // Refresh the property grid so the new decimal places are used
        if (typeof tleditor.selectionChanged === 'function') tleditor.selectionChanged();
    },

    _saveOptions: function (o) {
        try {
            var data = $.extend({}, o);
            if (data.grid_size_px == null) data.grid_size_px = this._readEditorOptions().grid_size_px;
            localStorage.setItem(this.OPTIONS_STORAGE_KEY, JSON.stringify(data));
        } catch (e) { /* storage unavailable (private mode, quota...): options just won't persist */ }
    },

    _loadSavedOptions: function () {
        try {
            var raw = localStorage.getItem(this.OPTIONS_STORAGE_KEY);
            if (!raw) return null;
            var saved = JSON.parse(raw);
            if (!saved || typeof saved !== 'object') return null;
            // Merge over defaults so options added in future versions get a value
            var o = $.extend({}, this._optDefaults, saved);
            if (!(o.grid_size_px > 0)) o.grid_size_px = this._optDefaults.grid_size_px;
            o.grid_color = this._toHexColor(o.grid_color, this._optDefaults.grid_color);
            return o;
        } catch (e) { return null; }
    },

    // Called once at startup, after the editor is configured
    initOptions: function () {
        var self = this;

        // Defaults = editor's initial state (+ this sample's System clipboard choice)
        this._optDefaults = {
            grid_size_px: 15,
            show_grid: false,
            snap_to_grid: false,
            grid_type: Neodynamic.Web.Editor.GridType.Lines,
            grid_color: this._toHexColor(tleditor.getStyleValue('--grid-color'), '#cccccc'),
            snap_to_items: false,
            angle_snap: 5,
            show_ruler: true,
            adorner_out_of_label_visible: true,
            num_of_fractional_digits: 4,
            clipboard_mode: Neodynamic.Web.Editor.EditorClipboardMode.System
        };

        // When a label gets loaded, apply any saved prefs that needed one (grid size depends on the unit)
        var originalLoad = tleditor.loadThermalLabel;
        tleditor.loadThermalLabel = function () {
            var r = originalLoad.apply(tleditor, arguments);
            if (self._optPending && tleditor.get_thermal_label) self._applyOptions(self._optPending);
            return r;
        };

        var saved = this._loadSavedOptions();
        if (saved) this._applyOptions(saved);

        // Dialog wiring
        $('#opt_grid_types').on('click', '.ld-layout', function () { self._selectGridType($(this).data('grid-type')); });
        $('#opt_grid_types').on('keydown', '.ld-layout', function (e) {
            var $all = $('#opt_grid_types .ld-layout');
            var i = $all.index(this);
            if (e.which === 39 || e.which === 40) i = (i + 1) % $all.length;
            else if (e.which === 37 || e.which === 38) i = (i - 1 + $all.length) % $all.length;
            else return;
            e.preventDefault();
            $all.eq(i).focus().click();
        });
        $('#opt_show_grid').on('change', function () { self._updateGridOptionsUI(); });
        $('#opt_restore').on('click', function () { self._fillOptionsForm(self._optDefaults); });
        $('#opt_apply').on('click', function () { self.setOptions(); });
        $('#options').on('keydown', 'input', function (e) {
            if (e.which === 13) { e.preventDefault(); self.setOptions(); }
        });
        $('#options').on('input change', '.ld-invalid .form-control', function () {
            $(this).closest('.ld-field').removeClass('ld-invalid');
        });
    },

    getOptions: function () {
        if (!this._optDefaults) this.initOptions();
        this._fillOptionsForm(this._readEditorOptions());
    },

    setOptions: function () {
        var o = this._readOptionsForm();
        if (!o) return;
        this._applyOptions(o);
        this._saveOptions(o);
        $('#options').modal('hide');
    },

    showErrorMsg: function (msg) {
        $("#error-msg").text(msg);
        $("#error-dialog").modal();
        return;
    },

    startGroup: function () {
        tleditor.startGroup();
    },
    cancelGroup: function () {
        tleditor.cancelGroup();
    },
    createGroup: function () {
        tleditor.createGroup();
    },
    unGroup: function () {
        tleditor.unGroup();
    },
    updateGroupUI: function () {
        $("#tlbGroupSelectedItems").css('display', 'none');
        $("#tlbCreateGroup").css('display', 'none');
        $("#tlbCancelGroup").css('display', 'none');
        $("#tlbStartGroup").css('display', 'none');
        $("#tlbUngroup").css('display', 'none');

        $("#tlbGroupSelectedItems").text(tleditor.items_in_started_group + ' items in the group');
        if (tleditor.group_started) {
            $("#tlbGroupSelectedItems").css('display', 'block');
            $("#tlbCreateGroup").css('display', 'block');
            $("#tlbCancelGroup").css('display', 'block');
        } else {
            if (tleditor.current_selection && tleditor.current_selection.group_name && tleditor.current_selection.group_name.length > 0) {
                $("#tlbUngroup").css('display', 'block');
            } else if (tleditor.items_in_started_group == 0) {
                $("#tlbStartGroup").css('display', 'block');
            }
        }
    }

};


//Create a ThermalLabelEditor instance
var tleditor = new Neodynamic.Web.Editor.ThermalLabelEditor("#tle-container");
//Set the label web editor controller
Neodynamic.Web.Editor.ThermalLabelEditor.thermalLabelWebEditorControllerName = "ThermalLabelWebEditorHandler/ProcessRequest";

//editor canvas settings
tleditor.rfid_tag_image_file_name = 'images/icons/RFIDTag.png';
tleditor.literal_image_file_name = 'images/icons/literal.png';
tleditor.enableEditor();

//Handle events related to items...
tleditor.onError = function (errMsg, className) {
    $("#error-msg").html('<strong>' + className + '</strong><br/>' + errMsg.replaceAll("\r\n", "<br/>"));
    $("#error-dialog").modal();
    return;
};


tleditor.newItemCreated = function () {
    console.log('NEW ITEM CREATED!');
    console.log(tleditor.current_selection);
};

tleditor.selectionChanged = tleditor.selectionItemPropertyChanged = function () {
    var selObj = tleditor.current_selection ? tleditor.current_selection : tleditor.get_thermal_label;
    neoPropertyGrid.numOfDecimalPlaces = tleditor.num_of_fractional_digits;
    neoPropertyGrid.createPropertyGrid(selObj, 'propGrid');

    if (tleditor.current_selection == null && tleditor.group_started) tleditor.cancelGroup();
};

tleditor.selectionChanged();

var itemDeleted = null;
tleditor.currentSelectionBeforeDelete = function () {
    itemDeleted = tleditor.current_selection;
    return confirm('Do you really want to delete the selected item?');
};

tleditor.currentSelectionAfterDelete = function () {
    console.log('ITEM DELETED!');
    console.log(itemDeleted);
};

tleditor.beforeDuplexDesignDisabled = function () {
    return confirm('Do you really want remove the back side label?');
};

tleditor.viewRotationChanged = function () {

};


function isEditableElement(el) {
    if (!el) return false;
    if (el.hasAttribute && el.hasAttribute('data-tlwe-clip-sink')) return false;
    var tag = (el.tagName || '').toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable;
}

// System-wide Clipboard Mode
tleditor.clipboard_mode = Neodynamic.Web.Editor.EditorClipboardMode.System;

// Editor options: defaults, saved preferences (localStorage) and #options dialog wiring
UIEditor.initOptions();

window.addEventListener('keydown', function (e) {

    if (isEditableElement(document.activeElement)) return;

    var sel = tleditor.current_selection;
    if (sel instanceof Neodynamic.SDK.Printing.TextItem && sel.is_in_edit_mode) return;

    var mod = e.ctrlKey || e.metaKey;   // Ctrl -> Windows/Linux, Cmd -> Mac
    var key = e.keyCode;
    var selectionAndFocused = (document.activeElement === document.body && !!sel);

    if (mod && key === 90) {                        // Ctrl+Z / Ctrl+Shift+Z
        if (e.shiftKey) tleditor.redo(); else tleditor.undo();
        e.preventDefault();
    }
    else if (mod && key === 89) {                   // Ctrl+Y
        tleditor.redo();
        e.preventDefault();
    }
    else if (key === 113 && sel instanceof Neodynamic.SDK.Printing.TextItem) { // F2
        sel.enterInEditMode();
        e.preventDefault();
    }
    else if ((key === 46 || key === 8) && !e.shiftKey && !mod && selectionAndFocused) { // Supr / Backspace (Mac)
        tleditor.deleteSelectedItems();
        e.preventDefault();
    }
    else if (key >= 37 && key <= 40 && selectionAndFocused) { // arrow actions
        var moveFactor = mod ? 10 : 1; // px
        if (tleditor.snap_to_grid)
            moveFactor = tleditor.grid_size;
        else
            moveFactor = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(moveFactor, tleditor._tl.unit_type);

        if (key === 37) tleditor.moveSelectedItems(-moveFactor, 0);
        else if (key === 38) tleditor.moveSelectedItems(0, -moveFactor);
        else if (key === 39) tleditor.moveSelectedItems(moveFactor, 0);
        else tleditor.moveSelectedItems(0, moveFactor);
        e.preventDefault();
    }
    else if (key === 27) {                          // Esc
        tleditor.active_tool_item = null;
        tleditor.active_tool = Neodynamic.Web.Editor.EditorTool.Pointer;
    }
}, false);


setInterval(function myTimer() {
    if (tleditor) {
        $('#btn-undo').prop('disabled', !tleditor.can_undo);
        $('#btn-redo').prop('disabled', !tleditor.can_redo);
        UIEditor.updateGroupUI();
    }
}, 500);

//create other UI stuff
exprBuilder.create();
gallery.load();


// show/hide error messages
$(function () {
    $("[data-hide]").on("click", function () {
        $(this).closest("." + $(this).attr("data-hide")).hide();
    });
});


// based on table picker (https://stackoverflow.com/a/59163692)
function tablePicker(x, y) {
    return new Promise(resolve => {
        let div = document.querySelector("#tblpck");
        if (div) div.remove();

        let colCount = 0;
        let rowCount = 0;

        div = document.createElement("div");
        div.setAttribute("id", "tblpck");
        div.className = "panel panel-default";

        div.innerHTML = `
            <style>
                #tblpck table { margin-bottom: 0; }
                #tblpck td { width: 24px; height: 24px; cursor: pointer; transition: background 0.1s; }
                #tblpck .tblpckhighlight { background-color: #337ab7 !important; border-color: #2e6da4 !important; }
            </style>
            <div class="panel-heading text-center" style="font-weight: bold; padding: 5px 10px;">0 x 0 Table</div>
            <table class="table table-bordered text-center">
                ${`<tr>${`<td></td>`.repeat(10)}</tr>`.repeat(10)}
            </table>
            <div class="panel-body text-center" style="padding: 6px;">
                <button type="button" id="tblpck-cancel" class="btn btn-danger btn-xs btn-block">
                    <span class="glyphicon glyphicon-remove"></span> Cancel
                </button>
            </div>`;

        document.body.appendChild(div);

        Object.assign(div.style, {
            left: x + "px",
            top: y + "px",
            position: "absolute",
            zIndex: "1050",
            boxShadow: "0 5px 15px rgba(0,0,0,.3)",
            width: "242px"
        });

        const closePicker = (result) => {
            document.removeEventListener("click", outsideClickHandler);
            div.remove();
            resolve(result);
        };

        const outsideClickHandler = (e) => {
            if (!div.contains(e.target)) {
                closePicker();
            }
        };

        setTimeout(() => {
            document.addEventListener("click", outsideClickHandler);
        }, 0);

        div.onmouseover = (e) => {
            if (e.target.tagName !== "TD") return;
            let td = e.target;
            let tr = td.parentNode;
            let table = tr.parentNode;

            colCount = td.cellIndex + 1;
            rowCount = tr.rowIndex + 1;

            for (let row of table.rows) {
                let inside = row.rowIndex < rowCount;
                for (let cell of row.cells) {
                    cell.classList.toggle("tblpckhighlight", inside && cell.cellIndex < colCount);
                }
            }

            div.children[1].textContent = `${colCount} x ${rowCount} Table`;
            return false;
        };

        div.onmousedown = (e) => {
            if (e.target.closest("#tblpck-cancel")) return;

            if (e.target.tagName === "TD") {
                closePicker([colCount, rowCount]);
            }
        };

        document.getElementById("tblpck-cancel").onclick = (e) => {
            e.stopPropagation();
            closePicker();
        };
    });
}