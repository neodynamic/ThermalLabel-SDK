// Sample Label Editor UI
// - Referencing and Using ThermalLabelWebEditor-14.0.N.N.js
// NOTE: You can create your own Editor UI around the ThermalLabel Web Editor Canvas 

var UIEditor = {

    closeModal : function() {
        $(".modal").modal("hide");
    },

    newDocument : function () {
        var tl = new Neodynamic.SDK.Printing.ThermalLabel();
        tl.unit_type = $("#doc_unit").children("option:selected").val();
        tl.width = $("#doc_width").val();
        tl.height = $("#doc_height").val();
        tleditor.loadThermalLabel(tl);
        this.closeModal();
        $('#editorTabs a[href="#label-design-tab"]').tab('show');
        tleditor.zoom = 100;
    },

    openDocument : function () {
        

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
                fr.readAsText($("#open_file_local").prop('files')[0] );
                    
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

    addNewItem : async function(itemType, textInputMask) {
        switch (itemType) {
            case 'Rectangle': {
                var newRectItem = new Neodynamic.SDK.Printing.RectangleShapeItem();
                tleditor.active_tool_item = newRectItem;
                tleditor.active_tool = Neodynamic.Web.Editor.EditorTool.Rectangle;
                return;
            }
            case 'Ellipse': {
                var newEllipseItem = new Neodynamic.SDK.Printing.EllipseShapeItem();
                tleditor.active_tool_item = newEllipseItem;
                tleditor.active_tool = Neodynamic.Web.Editor.EditorTool.Ellipse;
                return;
            }
            case 'Line': {
                var newLineItem = new Neodynamic.SDK.Printing.LineShapeItem();
                tleditor.active_tool_item = newLineItem;
                tleditor.active_tool = Neodynamic.Web.Editor.EditorTool.Line;
                return;
            }
            case 'Image': {
                var newImageItem = new Neodynamic.SDK.Printing.ImageItem();
                tleditor.active_tool_item = newImageItem;
                tleditor.active_tool = Neodynamic.Web.Editor.EditorTool.Image;
                return;
            }
            case 'RFID': {
                var newRFIDItem = new Neodynamic.SDK.Printing.RFIDTagItem();
                tleditor.active_tool_item = newRFIDItem;
                tleditor.active_tool = Neodynamic.Web.Editor.EditorTool.RFIDTag;
                return;
            }
            case 'Barcode': {
                var newBarcodeItem = new Neodynamic.SDK.Printing.BarcodeItem();
                newBarcodeItem.sizing = Neodynamic.SDK.Printing.BarcodeSizing.FitProportional; 
                tleditor.active_tool_item = newBarcodeItem;
                tleditor.active_tool = Neodynamic.Web.Editor.EditorTool.Barcode;
                return;
            }
            case 'Barcode2D': {
                var newBarcodeItem = new Neodynamic.SDK.Printing.BarcodeItem();
                newBarcodeItem.symbology = Neodynamic.SDK.Printing.BarcodeSymbology.QRCode;
                newBarcodeItem.sizing = Neodynamic.SDK.Printing.BarcodeSizing.FitProportional; 
                newBarcodeItem.barcode_alignment = Neodynamic.SDK.Printing.BarcodeAlignment.MiddleCenter;

                tleditor.active_tool_item = newBarcodeItem;
                tleditor.active_tool = Neodynamic.Web.Editor.EditorTool.Barcode;
                return;
            }
            case 'Text': {
                var newTextItem = new Neodynamic.SDK.Printing.TextItem();
                newTextItem.font.name = "ZPL Font 0";
                newTextItem.text = "Type here...";

                tleditor.active_tool_item = newTextItem;
                tleditor.active_tool = Neodynamic.Web.Editor.EditorTool.Text;
                return;
            }
            case 'TextResidentFont': {
                var newTextItem = new Neodynamic.SDK.Printing.TextItem();

                if (textInputMask) {
                    newTextItem.input_mask_pattern = textInputMask;
                } else {
                    newTextItem.text = "TYPE HERE...";
                }

                tleditor.active_tool_item = newTextItem;
                tleditor.active_tool = Neodynamic.Web.Editor.EditorTool.Text;
                return;
            }
            case 'TextArc': {
                var newTextItem = new Neodynamic.SDK.Printing.TextItem();
                newTextItem.font.name = "Arial";
                newTextItem.sizing = Neodynamic.SDK.Printing.TextSizing.Arc;
                newTextItem.text = "TEXT";

                tleditor.active_tool_item = newTextItem;
                tleditor.active_tool = Neodynamic.Web.Editor.EditorTool.Text;
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

                tleditor.active_tool_item = newTextItem;
                tleditor.active_tool = Neodynamic.Web.Editor.EditorTool.Text;
                return;
            }
            case 'Table': {
                var b = document.getElementById("tlbTable");
                var bData = b.getBoundingClientRect();
                let [colCount, rowCount] = await tablePicker(bData.left, bData.top + bData.height);

                var newTableItem = new Neodynamic.SDK.Printing.TableShapeItem();
                for (var i = 0; i < colCount; i++) newTableItem.columns.push(new Neodynamic.SDK.Printing.TableColumn());
                for (var i = 0; i < rowCount; i++) newTableItem.rows.push(new Neodynamic.SDK.Printing.TableRow());

                tleditor.active_tool_item = newTableItem;
                tleditor.active_tool = Neodynamic.Web.Editor.EditorTool.Table;
                return;
            }
            case 'Repeater': {
                var newRepItem = new Neodynamic.SDK.Printing.RepeaterItem();
                tleditor.active_tool_item = newRepItem;
                tleditor.active_tool = Neodynamic.Web.Editor.EditorTool.Repeater;
                return;
            }
            case 'Literal': {
                var newLitItem = new Neodynamic.SDK.Printing.LiteralItem();
                tleditor.active_tool_item = newLitItem;
                tleditor.active_tool = Neodynamic.Web.Editor.EditorTool.Literal;
                return;
            }
        }
    },

    changeZoom : function(val) {
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
    },

    lockItem : function() {
        if (tleditor.current_selection === null)
            return;
        tleditor.lockSelectedItems();
    },

    unlockItem: function () {
        if (tleditor.current_selection === null)
            return;
        tleditor.unlockSelectedItems();
    },

    deleteSelectedItems : function() {
        tleditor.deleteSelectedItems();
    },

    sendToBack : function() {
        tleditor.sendToBack();
    },

    sendBackward : function() {
        tleditor.sendBackward();
    },

    bringToFront : function() {
        tleditor.bringToFront();
    },

    bringForward : function() {
        tleditor.bringForward();
    },

    clipboardCut : function() {
        tleditor.clipboardCut();
    },

    clipboardCopy : function() {
        tleditor.clipboardCopy();
    },

    clipboardPaste : function() {
        tleditor.clipboardPaste();
    },

    undo: function () {
        tleditor.undo();
        tleditor.selectionChanged();
    },

    redo: function () {
        tleditor.redo();
        tleditor.selectionChanged();
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

            var dataSourceFormat = null;
            var dataSource = null;
            if ($('#chkUseDataSourceSample').prop('checked')) {
                dataSourceFormat = 'xml';
                dataSource = $('#txtDataSource').val();
            }

            tleditor.getLabelPreview(null, null, 'html', dataSourceFormat, dataSource, function (htmlLabelPreviewContent) {
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
            tleditor.get_thermal_label.expressions.forEach(function(x) {
                htmlExpr += '<tr><td>' + x + '</td></tr>';
            });
            $('#tableGlobalExpressions').html(htmlExpr);
            $('#txtExpressionsCount').html(tleditor.get_thermal_label.expressions.length);
        }
    },

    getGridSettings : function () {
        $("#gs_grid_size").val(tleditor.grid_size);
        $("#gs_show_grid").prop('checked', tleditor.show_grid);
        $("#gs_snap_to_grid").prop('checked', tleditor.snap_to_grid);
        $("#gs_angle_snap").val(tleditor.angle_snap);
        $("#gs_label_unit").text(this.getLabelUnit());
        $("#gs_grid_type").val(tleditor.grid_type);
        $("#grid-settings").modal();
        return;
    },

    setGridSettings : function () {
        tleditor.grid_size = $("#gs_grid_size").val();
        tleditor.show_grid = $("#gs_show_grid").prop('checked');
        tleditor.snap_to_grid = $("#gs_snap_to_grid").prop('checked');
        tleditor.angle_snap = $("#gs_angle_snap").val();
        tleditor.grid_type = $("#gs_grid_type").val();
        this.closeModal();
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
Neodynamic.Web.Editor.ThermalLabelEditor.thermalLabelWebEditorControllerName = "ThermalLabelWebEditorHandler.ashx";

//editor canvas settings
tleditor.rfid_tag_image_file_name = 'images/RFIDTag.png';
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

//Handle Keyboard for specific actions...
var ctrlDown = false,
        ctrlKey = 17,
        cmdKey = 91;
var shiftDown = false, shiftKey = 16;
        
window.addEventListener('keyup', function (e) {
    if (e.keyCode === ctrlKey || e.keyCode === cmdKey) ctrlDown = false;
    if (e.keyCode === shiftKey) shiftDown = false;
}, false);

window.addEventListener('keydown', function (e) {
    
    if (e.keyCode === ctrlKey || e.keyCode === cmdKey) ctrlDown = true;
    if (e.keyCode === shiftKey) shiftDown = true;
    var selectionAndFocused = (document.activeElement === document.body && tleditor.current_selection);
    
    var textItemInEditMode = (tleditor.current_selection instanceof Neodynamic.SDK.Printing.TextItem && tleditor.current_selection.is_in_edit_mode);

    if (textItemInEditMode === false) {
        if (ctrlDown && (e.keyCode === 67 || e.keyCode === 45)) { //Clipboard Copy
            tleditor.clipboardCopy();
        }
        else if ((ctrlDown && e.keyCode === 88) || (shiftDown && e.keyCode === 46)) { //Clipboard Cut
            tleditor.clipboardCut();
        }
        else if ((ctrlDown && e.keyCode === 86) || (shiftDown && e.keyCode === 45)) { //Clipboard Paste
            tleditor.clipboardPaste();
        }
        else if (ctrlDown && e.keyCode === 90) { //Undo
            tleditor.undo();
        }
        else if (ctrlDown && e.keyCode === 89) { //Undo
            tleditor.redo();
        }
        else if (tleditor.current_selection instanceof Neodynamic.SDK.Printing.TextItem && e.keyCode === 113) { //F2 = enter in edit mode
            tleditor.current_selection.enterInEditMode();
            e.preventDefault();
            return false;
        }
        else if (e.keyCode === 46 && selectionAndFocused) { //DEL key
            tleditor.deleteSelectedItems();
        }
        else if (e.keyCode >= 37 && e.keyCode <= 40 && selectionAndFocused) { //Move item by arrow keys
            var moveLargeStep = 10; //in pixel unit
            var moveShortStep = 1; //in pixel unit

            var moveFactor = ctrlDown ? moveLargeStep : moveShortStep;

            if (tleditor.snap_to_grid)
                moveFactor = tleditor.grid_size;
            else
                //convert moveFactor from px to current label unit!!!
                moveFactor = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(moveFactor, tleditor._tl.unit_type);

            if (e.keyCode === 37) //Move selection to the left
                tleditor.moveSelectedItems(-1 * moveFactor, 0);
            else if (e.keyCode === 38) //Move selection to the top
                tleditor.moveSelectedItems(0, -1 * moveFactor);
            else if (e.keyCode === 39) //Move selection to the right
                tleditor.moveSelectedItems(1 * moveFactor, 0);
            else if (e.keyCode === 40) //Move selection to the bottom
                tleditor.moveSelectedItems(0, 1 * moveFactor);

            e.preventDefault();
            return false;
        }
        else if (e.keyCode == 27) {
            tleditor.active_tool_item = null;
            tleditor.active_tool = Neodynamic.Web.Editor.EditorTool.Pointer;
        }
    }
    
}, false);


setInterval(function myTimer() {
    if (tleditor) {
        $('#tlbUndo').prop('disabled', !tleditor.can_undo);
        $('#tlbRedo').prop('disabled', !tleditor.can_redo);
        UIEditor.updateGroupUI();
    }
}, 500);

//create other UI stuff
exprBuilder.create();
gallery.load();

$('#tlbNew').popover();
$('#tlbOpen').popover();
$('#tlbSave').popover();
$('#tlbPrint').popover();
$('#tlbGridSettings').popover();
$('#tlbRect').popover();
$('#tlbEllipse').popover();
$('#tlbLine').popover();
$('#tlbText').popover();
$('#tlbImage').popover();
$('#tlbBarcode').popover();
$('#tlbRFID').popover();
$('#tlbItemSettings').popover();
$('#tlbZoomIn').popover();
$('#tlbZoomOut').popover();
$('#tlbZoom100').popover();
$('#tlbSendBackward').popover();
$('#tlbSendToBack').popover();
$('#tlbBringForward').popover();
$('#tlbBringToFront').popover();
$('#tlbLock').popover();
$('#tlbUnlock').popover();
$('#tlbDelete').popover();
$('#tlbClipboardCut').popover();
$('#tlbClipboardCopy').popover();
$('#tlbClipboardPaste').popover();
$('#tlbExpression').popover();
$('#tlbUndo').popover();
$('#tlbRedo').popover();
$('#tlbResidentFontText').popover();
$('#tlbTextArc').popover();
$('#tlbTextOutline').popover();
$('#tlbBarcode2D').popover();
$('#tlbRepeater').popover();

// load sample data source
$('#txtDataSource').val("<?xml version=\"1.0\"?><catalog><book id=\"bk101\"><author>Gambardella, Matthew</author><title>XML Developer's Guide</title > <genre>Computer</genre><price>44.95</price><publish_date>2000-10-01</publish_date><description>An in-depth look at creating applications with XML.</description></book > <book id=\"bk102\"><author>Ralls, Kim</author><title>Midnight Rain</title><genre>Fantasy</genre><price>5.95</price><publish_date>2000-12-16</publish_date><description>A former architect battles corporate zombies, an evil sorceress, and her own childhood to become queen of the world.</description></book><book id=\"bk103\"><author>Corets, Eva</author><title>Maeve Ascendant</title><genre>Fantasy</genre><price>5.95</price><publish_date>2000-11-17</publish_date><description>After the collapse of a nanotechnology society in England, the young survivors lay the foundation for a new society.</description></book><book id=\"bk104\"><author>Corets, Eva</author><title>Oberon's Legacy</title><genre>Fantasy</genre><price>5.95</price><publish_date>2001-03-10</publish_date><description>In post-apocalypse England, the mysterious agent known only as Oberon helps to create a new life for the inhabitants of London. Sequel to Maeve Ascendant.</description></book><book id=\"bk105\"><author>Corets, Eva</author><title>The Sundered Grail</title><genre>Fantasy</genre><price>5.95</price><publish_date>2001-09-10</publish_date><description>The two daughters of Maeve, half-sisters, battle one another for control of England. Sequel to Oberon's Legacy.</description></book><book id=\"bk106\"><author>Randall, Cynthia</author><title>Lover Birds</title><genre>Romance</genre><price>4.95</price><publish_date>2000-09-02</publish_date><description>When Carla meets Paul at an ornithology conference, tempers fly as feathers get ruffled.</description></book><book id=\"bk107\"><author>Thurman, Paula</author><title>Splish Splash</title><genre>Romance</genre><price>4.95</price><publish_date>2000-11-02</publish_date><description>A deep sea diver finds true love twenty thousand leagues beneath the sea.</description></book><book id=\"bk108\"><author>Knorr, Stefan</author><title>Creepy Crawlies</title><genre>Horror</genre><price>4.95</price><publish_date>2000-12-06</publish_date><description>An anthology of horror stories about roaches,centipedes, scorpions  and other insects.</description></book><book id=\"bk109\"><author>Kress, Peter</author><title>Paradox Lost</title><genre>Science Fiction</genre><price>6.95</price><publish_date>2000-11-02</publish_date><description>After an inadvertant trip through a HeisenbergUncertainty Device, James Salway discovers the problems of being quantum.</description></book><book id=\"bk110\"><author>O'Brien, Tim</author><title>Microsoft .NET: The Programming Bible</title><genre>Computer</genre><price>36.95</price><publish_date>2000-12-09</publish_date><description>Microsoft's .NET initiative is explored in detail in this deep programmer's reference.</description></book><book id=\"bk111\"><author>O'Brien, Tim</author><title>MSXML3: A Comprehensive Guide</title><genre>Computer</genre><price>36.95</price><publish_date>2000-12-01</publish_date><description>The Microsoft MSXML3 parser is covered in detail, with attention to XML DOM interfaces, XSLT processing, SAX and more.</description></book><book id=\"bk112\"><author>Galos, Mike</author><title>Visual Studio 7: A Comprehensive Guide</title><genre>Computer</genre><price>49.95</price><publish_date>2001-04-16</publish_date><description>Microsoft Visual Studio 7 is explored in depth,looking at how Visual Basic, Visual C++, C#, and ASP+ are integrated into a comprehensive development environment.</description></book></catalog>");


// show/hide error messages
$(function () {
    $("[data-hide]").on("click", function () {
        $(this).closest("." + $(this).attr("data-hide")).hide();
    });
});


// table picker (https://stackoverflow.com/a/59163692)
function tablePicker(x, y) {
    return new Promise(resolve => {
        let div = document.querySelector("#tblpck");
        if (div) div.remove();
        let colCount = 0;
        let rowCount = 0;
        div = document.createElement("div");
        div.setAttribute("id", "tblpck");
        div.innerHTML = `<style>
            #tblpck div{background:#ccc;font-family:Verdana;text-align:right}
            #tblpck table{border-spacing:3px;background:#f8f8f8}
            #tblpck td{border:1px solid #888;width:16px;height:16px;box-sizing:border-box}
            #tblpck .tblpckhighlight{border:2px solid orange;}
        <\/style><div>0x0 Table<\/div>
        <table>${`<tr>${`<td><\/td>`.repeat(10)}<\/tr>`.repeat(10)}<\/table>`;
        document.body.appendChild(div);
        Object.assign(div.style, { left: x + "px", top: y + "px", position: "absolute", border: "1px solid #ccc" });

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
            div.children[1].textContent = `${colCount}x${rowCount} Table`;
            return false;
        };

        div.onmousedown = () => {
            div.remove();
            resolve([colCount, rowCount]);
        };
    });
}
