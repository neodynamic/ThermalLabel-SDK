var neoPropertyGrid = {

    numOfFractionalDigits: 4,

    updateProp: function (targetTypeName, propName, value, timestamp) {
        //console.log(targetTypeName);
        //console.log(propName);
        //console.log(value);
        //console.log(typeof(value));
        
        if (this.id != timestamp) {
            // see if update is comming from other selected item
            tleditor.get_thermal_label.items.forEach(function (itm) {
                if (itm._guid == timestamp &&
                    itm[propName] !== undefined) {
                    itm[propName] = value;
                    itm.refresh();
                    tleditor.saveCurrentLabelCanvasState();
                }
            });
            return;
        }

        try {
            if (targetTypeName === 'ThermalLabel') {
                var tl = tleditor.get_thermal_label;

                if (tl[propName] !== undefined) {
                    //var tl = Neodynamic.Web.Utils.Cloner.cloneThermalLabel(curTL);

                    tl[propName] = value;

                    //if (propName === "unit_type") {
                    //    for (var i = 0; i < tl.items.length; i++) {
                    //        var myItem = tl.items[i];
                    //        myItem.unit_type = tl.unit_type;
                    //        myItem.refresh();
                    //    }
                    //}

                    if (propName === "unit_type" ||
                        propName === "height" ||
                        propName === "width") {
                        tleditor.undoRedo = true;
                        tleditor.loadThermalLabel(tl);
                    }

                    tleditor.saveCurrentLabelCanvasState();
                }

            } else if (tleditor.current_selection &&
                tleditor.current_selection[propName] !== undefined) {

                tleditor.current_selection[propName] = value;
                tleditor.current_selection.refresh();

                tleditor.saveCurrentLabelCanvasState();
            }
        }
        catch (err) {
            UIEditor.showErrorMsg(err);            
        }
    },

    updateComplexProp: function (targetTypeName, complexPropName, className, subPropName, valType, value, timestamp) {
        //console.log(targetTypeName);
        //console.log(complexPropName);
        //console.log(className);
        //console.log(subPropName);
        //console.log(value);
        //console.log(valType);

        if (this.id != timestamp) return;

        if (targetTypeName === 'ThermalLabel') {
            var tl = tleditor.get_thermal_label;

            if (tl[complexPropName] !== undefined) {

                var cp = new Neodynamic.SDK.Printing[className]();
                for (var p in tl[complexPropName]) {
                    //console.log(typeof (curTL[complexPropName][p]));
                    var pt = typeof (tl[complexPropName][p]);
                    if (p[0] !== "_" &&
                        (pt === "number" || pt === "string" || pt === "boolean")) {
                        //console.log(p);
                        cp[p] = tl[complexPropName][p];
                    }
                }
                //console.log(cp);

                if (valType === "number")
                    cp[subPropName] = Number(value);
                else if (valType === "string")
                    cp[subPropName] = value;
                else if (valType === "boolean")
                    cp[subPropName] = value;

                //console.log(cp);
                tl[complexPropName] = cp;

                if (complexPropName === "margin") {
                    tleditor.undoRedo = true;
                    tleditor.loadThermalLabel(tl);
                }

                tleditor.saveCurrentLabelCanvasState();

            }

        } else if (tleditor.current_selection &&
            tleditor.current_selection[complexPropName] !== undefined) {

            var cp = new Neodynamic.SDK.Printing[className]();
            for (var p in tleditor.current_selection[complexPropName]) {
                //console.log(typeof (tleditor.current_selection[complexPropName][p]));
                var pt = typeof (tleditor.current_selection[complexPropName][p]);
                if (p[0] !== "_" &&
                    (pt === "number" || pt === "string" || pt === "boolean")) {
                    //console.log(p);
                    cp[p] = tleditor.current_selection[complexPropName][p];
                }
            }
            //console.log(cp);

            if (valType === "number")
                cp[subPropName] = Number(value);
            else if (valType === "string")
                cp[subPropName] = value;
            else if (valType === "boolean")
                cp[subPropName] = value;

            //console.log(cp);
            tleditor.current_selection[complexPropName] = cp;
            tleditor.current_selection.refresh();

            tleditor.saveCurrentLabelCanvasState();

        }
    },

    addTableColumn: function () {
        try {
            if (tleditor.current_selection &&
                tleditor.current_selection['columns'] !== undefined) {

                tleditor.current_selection.columns.push(new Neodynamic.SDK.Printing.TableColumn());
                tleditor.current_selection.refresh();
                tleditor.saveCurrentLabelCanvasState();
                tleditor.selectionChanged();
            }
        }
        catch (err) {
            UIEditor.showErrorMsg(err);
        }
    },

    removeTableColumn: function (index) {
        try {
            if (tleditor.current_selection &&
                tleditor.current_selection['columns'] !== undefined) {

                tleditor.current_selection.columns.splice(index, 1);
                tleditor.current_selection.refresh();
                tleditor.saveCurrentLabelCanvasState();
                tleditor.selectionChanged();
            }
        }
        catch (err) {
            UIEditor.showErrorMsg(err);
        }
    },

    updateTableColumn: function (index, propName, value) {
        try {
            if (tleditor.current_selection &&
                tleditor.current_selection['columns'] !== undefined) {

                tleditor.current_selection.columns[index][propName] = value;
                tleditor.current_selection.refresh();

                tleditor.saveCurrentLabelCanvasState();
            }
        }
        catch (err) {
            UIEditor.showErrorMsg(err);
        }
    },

    addTableRow: function () {
        try {
            if (tleditor.current_selection &&
                tleditor.current_selection['rows'] !== undefined) {

                tleditor.current_selection.rows.push(new Neodynamic.SDK.Printing.TableRow());
                tleditor.current_selection.refresh();
                tleditor.saveCurrentLabelCanvasState();
                tleditor.selectionChanged();
            }
        }
        catch (err) {
            UIEditor.showErrorMsg(err);
        }
    },

    removeTableRow: function (index) {
        try {
            if (tleditor.current_selection &&
                tleditor.current_selection['rows'] !== undefined) {

                tleditor.current_selection.rows.splice(index, 1);
                tleditor.current_selection.refresh();
                tleditor.saveCurrentLabelCanvasState();
                tleditor.selectionChanged();
            }
        }
        catch (err) {
            UIEditor.showErrorMsg(err);
        }
    },

    updateTableRow: function (index, propName, value) {
        try {
            if (tleditor.current_selection &&
                tleditor.current_selection['rows'] !== undefined) {

                tleditor.current_selection.rows[index][propName] = value;
                tleditor.current_selection.refresh();

                tleditor.saveCurrentLabelCanvasState();
            }
        }
        catch (err) {
            UIEditor.showErrorMsg(err);
        }
    },

    createObjectComplexProp: function (targetTypeName, propObj, timestamp) {
        var objVal = propObj.value;
        var propGridContent = '<table class="table">';
        for (var o in objVal) {
            if (o[0] !== '_' &&
                typeof (objVal[o]) !== 'function') {

                let isTableColumn = propObj.name === "TableColumn"; 
                let isTableRow = propObj.name === "TableRow";

                propGridContent += '<tr>';
                propGridContent += '<td>';
                propGridContent += '<span>' + o.replace(/_/g, ' ').replace(/(?: |\b)(\w)/g, function (key, p1) { return key.toUpperCase(); }) + '</span>';
                propGridContent += '</td>';
                propGridContent += '<td>';
                if (typeof (objVal[o]) === "number" || typeof (objVal[o]) === "string") {
                    if (typeof (objVal[o]) === "number") {
                        if (o.indexOf("color") > -1) {
                            if (isTableColumn)
                                propGridContent += this.createSelectForEnum("TableColumn", "Color", objVal[o], o, propObj.index);
                            else if (isTableRow)
                                propGridContent += this.createSelectForEnum("TableRow", "Color", objVal[o], o, propObj.index);
                            else
                                propGridContent += this.createSelectForEnum(targetTypeName, "Color", objVal[o], propObj.name, timestamp);
                        }
                        else if (o.indexOf("unit") > -1)
                            propGridContent += this.createSelectForEnumComplexProp(targetTypeName, "FontUnit", propObj.name, propObj.class_name, o, objVal[o], timestamp);
                        else if (o.indexOf("page") > -1)
                            propGridContent += this.createSelectForEnumComplexProp(targetTypeName, "CodePage", propObj.name, propObj.class_name, o, objVal[o], timestamp);
                        else if (o === "dither_method")
                            propGridContent += this.createSelectForEnumComplexProp(targetTypeName, "DitherMethod", propObj.name, propObj.class_name, o, objVal[o], timestamp);
                        else {
                            if (isTableColumn)
                                propGridContent += '<input type="number" class="form-control input-sm" value="' + objVal[o].toFixed(this.numOfFractionalDigits) + '" onchange="neoPropertyGrid.updateTableColumn(' + propObj.index + ',\'' + o + '\', this.value)" step="any" min="0"/>';
                            else if (isTableRow)
                                propGridContent += '<input type="number" class="form-control input-sm" value="' + objVal[o].toFixed(this.numOfFractionalDigits) + '" onchange="neoPropertyGrid.updateTableRow(' + propObj.index + ',\'' + o + '\', this.value) " step="any" min="0"/>';
                        else
                                propGridContent += '<input type="number" class="form-control input-sm" value="' + objVal[o].toFixed(this.numOfFractionalDigits) + '" onchange="neoPropertyGrid.updateComplexProp(\'' + targetTypeName + '\',\'' + propObj.name + '\', \'' + propObj.class_name + '\',\'' + o + '\', \'' + typeof (objVal[o]) + '\', this.value,\'' + timestamp + '\')" step="any" min="0"/>';
                        }
                            
                    }
                    else if (typeof (objVal[o]) === "string" && o.indexOf("color_hex") > -1) {
                        if (isTableColumn)
                            propGridContent += '<input type="color" class="form-control input-sm" value="' + objVal[o] + '" onchange="neoPropertyGrid.updateTableColumn(' + propObj.index + ',\'' + o + '\', this.value)" />';
                        else if (isTableRow)
                            propGridContent += '<input type="color" class="form-control input-sm" value="' + objVal[o] + '" onchange="neoPropertyGrid.updateTableRow(' + propObj.index + ',\'' + o + '\', this.value) " />';
                        else
                            propGridContent += '<input type="color" class="form-control input-sm" value="' + objVal[o] + '" onchange="neoPropertyGrid.updateProp(\'' + targetTypeName + '\',\'' + propObj.name + '\', this.value,\'' + timestamp + '\')" />';
                    }
                    else if ((propObj.name === "font" || propObj.name === "text_font") && o === "name")
                        propGridContent += this.createSelectForFont(targetTypeName, propObj.name, propObj.class_name, o, objVal[o], timestamp);
                    else
                        propGridContent += '<input type="text" class="form-control input-sm" value="' + objVal[o] + '" onchange="neoPropertyGrid.updateComplexProp(\'' + targetTypeName + '\',\'' + propObj.name + '\', \'' + propObj.class_name + '\',\'' + o + '\', \'' + typeof (objVal[o]) + '\', this.value,\'' + timestamp + '\')" />';
                }
                else if (typeof (objVal[o]) === 'boolean')
                    propGridContent += this.createCheckboxComplexProp(targetTypeName, '', propObj.name, propObj.class_name, o, objVal[o], timestamp);


                propGridContent += '</td>';

            }
        }
        propGridContent += '</table>';

        return propGridContent;
    },

    createCheckbox: function (targetTypeName, label, value, propName, timestamp) {
        return '<div class="checkbox"><label><input type="checkbox" ' + (value ? 'checked' : '') + ' onclick="neoPropertyGrid.updateProp(\'' + targetTypeName + '\',\'' + propName + '\', this.checked,\'' + timestamp + '\')" /><span class="cr"><i class="cr-icon glyphicon glyphicon-ok"></i>' + label + '</span></label></div >';
    },

    createCheckboxComplexProp: function (targetTypeName, label, complexPropName, className, subPropName, value, timestamp) {
        return '<div class="checkbox"><label><input type="checkbox" ' + (value ? 'checked' : '') + ' onclick="neoPropertyGrid.updateComplexProp(\'' + targetTypeName + '\',\'' + complexPropName + '\', \'' + className + '\',\'' + subPropName + '\', \'boolean\', this.checked,\'' + timestamp + '\')" /><span class="cr"><i class="cr-icon glyphicon glyphicon-ok"></i>' + label + '</span></label></div >';
    },

    createSelectForEnum: function (targetTypeName, enumName, value, propName, timestamp) {
        //console.log(enumName);
        var theEnum = Neodynamic.SDK.Printing[enumName];
        if (theEnum) {

            //sort enum by name
            var enumEntries = [];
            for (var e in theEnum) {
                if (typeof (theEnum[e]) === "number") {
                    enumEntries.push({ key: e, value: theEnum[e]});
                }
            }
            enumEntries.sort(function (x, y) {
                return x.key < y.key ? -1 : (x.key > y.key ? 1 : 0);
            });

            var sel = '';

            if (targetTypeName === "TableColumn")
                sel = '<select class="form-control input-sm" onchange="neoPropertyGrid.updateTableColumn(\'' + timestamp + '\',\'' + propName + '\', parseInt(this.value))" >';
            else if (targetTypeName === "TableRow")
                sel = '<select class="form-control input-sm" onchange="neoPropertyGrid.updateTableRow(\'' + timestamp + '\',\'' + propName + '\', parseInt(this.value))" >';
            else
                sel = '<select class="form-control input-sm" onchange="neoPropertyGrid.updateProp(\'' + targetTypeName + '\',\'' + propName + '\', parseInt(this.value),\'' + timestamp + '\')" >';

            for (var i in enumEntries) {
                sel += '<option value="' + enumEntries[i].value + '" ' + (value === enumEntries[i].value ? 'selected' : '') + '>' + enumEntries[i].key + '</option>';
            }

            //for (var e in theEnum) {
            //    if (typeof (theEnum[e]) === "number")
            //        sel += '<option value="' + theEnum[e] + '" ' + (value === theEnum[e] ? 'selected' : '') + '>' + e + '</option>';
            //}

            sel += '</select>';
            //console.log(sel);
            return sel;
        }
    },

    createSelectForEnumComplexProp: function (targetTypeName, enumName, complexPropName, className, subPropName, value, timestamp) {
        //console.log(enumName);
        var theEnum = Neodynamic.SDK.Printing[enumName];
        if (theEnum) {

            var sel = '<select class="form-control input-sm" onchange="neoPropertyGrid.updateComplexProp(\'' + targetTypeName + '\',\'' + complexPropName + '\', \'' + className + '\',\'' + subPropName + '\', \'number\', parseInt(this.value),\'' + timestamp + '\')" >';

            for (var e in theEnum) {
                if (typeof (theEnum[e]) === "number")
                    sel += '<option value="' + theEnum[e] + '" ' + (value === theEnum[e] ? 'selected' : '') + '>' + e + '</option>';
            }

            sel += '</select>';
            //console.log(sel);
            return sel;
        }
    },

    createSelectForFont: function (targetTypeName, complexPropName, className, subPropName, value, timestamp) {
        var id = 'fntsel' + new Date().getTime();
        var sel = '<div class="input-group">';
        sel += '<input type="text" class="form-control input-sm" id="' + id + '" value="' + value + '" onchange="neoPropertyGrid.updateComplexProp(\'' + targetTypeName + '\',\'' + complexPropName + '\', \'' + className + '\',\'' + subPropName + '\', \'string\', this.value,\'' + timestamp + '\')" >';
        sel += '<div class="input-group-btn">';
        sel += '<button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="caret"></span></button>';
        sel += '<ul class="dropdown-menu dropdown-menu-right">';
        sel += '<li><a href="#" onclick="$(\'#' + id + '\').val(this.innerHTML).trigger(\'change\');">NativePrinterFontA</a></li>';
        sel += '<li><a href="#" onclick="$(\'#' + id + '\').val(this.innerHTML).trigger(\'change\');">NativePrinterFontB</a></li>';
        sel += '<li><a href="#" onclick="$(\'#' + id + '\').val(this.innerHTML).trigger(\'change\');">NativePrinterFontS</a></li>';
        sel += '<li><a href="#" onclick="$(\'#' + id + '\').val(this.innerHTML).trigger(\'change\');">ZPL Font 0</a></li>';
        sel += '<li><a href="#" onclick="$(\'#' + id + '\').val(this.innerHTML).trigger(\'change\');">Arial</a></li>';
        sel += '<li><a href="#" onclick="$(\'#' + id + '\').val(this.innerHTML).trigger(\'change\');">Comic Sans MS</a></li>';
        sel += '<li><a href="#" onclick="$(\'#' + id + '\').val(this.innerHTML).trigger(\'change\');">Courier New</a></li>';
        sel += '<li><a href="#" onclick="$(\'#' + id + '\').val(this.innerHTML).trigger(\'change\');">Georgia</a></li>';
        sel += '<li><a href="#" onclick="$(\'#' + id + '\').val(this.innerHTML).trigger(\'change\');">Impact</a></li>';
        sel += '<li><a href="#" onclick="$(\'#' + id + '\').val(this.innerHTML).trigger(\'change\');">Lucida Console</a></li>';
        sel += '<li><a href="#" onclick="$(\'#' + id + '\').val(this.innerHTML).trigger(\'change\');">Lucida Sans Unicode</a></li>';
        sel += '<li><a href="#" onclick="$(\'#' + id + '\').val(this.innerHTML).trigger(\'change\');">Tahoma</a></li>';
        sel += '<li><a href="#" onclick="$(\'#' + id + '\').val(this.innerHTML).trigger(\'change\');">Times New Roman</a></li>';
        sel += '<li><a href="#" onclick="$(\'#' + id + '\').val(this.innerHTML).trigger(\'change\');">Verdana</a></li>';
        sel += '<li><a href="#" onclick="$(\'#' + id + '\').val(this.innerHTML).trigger(\'change\');">Wingdings</a></li>';
        sel += '<li><a href="#" onclick="$(\'#' + id + '\').val(this.innerHTML).trigger(\'change\');">Fresh Fruit</a></li>';
        sel += '</ul>';
        sel += '</div>';
        sel += '</div>';
        return sel;
    },

    createPropertyGrid: function (theObj, targetContainer) {

        if (!(theObj) || (theObj.group_name && theObj.group_name.length > 0)) {
            $('#' + targetContainer).html('');
            return;
        }

        

        var isTL = theObj.constructor.name === 'ThermalLabel';


        var id = isTL ? new Date().getTime() : theObj._guid;
        var timestamp = id;
        this.id = id;

        var targetTypeName = theObj.constructor.name;

        //console.log(theObj.constructor.name);
        var propGridContent = '<table class="table table-hover table-condensed neoPropGrid">';
        propGridContent += '<thead><tr class="info" colspan="2"><th>' + targetTypeName + '</th></tr></thead><tbody>';

        var barcodeRelatedProps;
        if (targetTypeName === "BarcodeItem") {
            barcodeRelatedProps = Neodynamic.Web.Utils.BarcodeItemUtils.getRelatedProperties(theObj.symbology);
        }


        var props = [];

        for (var prop in theObj) {
            if (prop[0] !== '_' &&
                prop !== 'editable' &&
                prop !== 'resizable' &&
                prop !== 'is_in_edit_mode' &&
                prop !== 'input_mask_pattern' &&
                prop !== 'input_mask_prompt_char' &&
                typeof (theObj[prop]) !== 'function') {
                //console.log(prop + ' - ' + typeof(theObj[prop]) + ' - ' + prop.replace(/_/g, ' ').replace(/(?: |\b)(\w)/g, function (key, p1) { return key.toUpperCase(); }));

                var propAccepted = true;
                if (barcodeRelatedProps) {
                    propAccepted = barcodeRelatedProps.indexOf(prop) > -1;
                }

                if (propAccepted) {
                    props.push({ "name": prop, "type": typeof (theObj[prop]), "value": theObj[prop], "class_name": theObj[prop] !== null ? theObj[prop].constructor.name : "", "desc": prop.replace(/_/g, ' ').replace(/(?: |\b)(\w)/g, function (key, p1) { return key.toUpperCase(); }) });
                }

            }
        }

        props.sort(function (a, b) {
            if (a.name < b.name)
                return -1;
            if (a.name > b.name)
                return 1;
            return 0;
        });

        //Special case for BarcodeItem... put Symbology prop to the top
        if (barcodeRelatedProps) {
            propGridContent += '<tr><td>' + "Symbology" + '</td><td>';
            propGridContent += this.createSelectForEnum(targetTypeName, "BarcodeSymbology", theObj.symbology, "symbology", timestamp);
            propGridContent += '</td></tr>';
        }
        //--------------------


        for (var p in props) {

            if (isTL && (props[p].name === "items" || props[p].name === "expressions" || props[p].name.indexOf("data") > -1 || props[p].name === "pages")) continue;
            if (!isTL && props[p].name === "unit_type") continue;

            if (props[p].name === "columns" || props[p].name === "rows") {

                var funcName = props[p].name === "columns" ? "addTableColumn()" : "addTableRow()";

                propGridContent += '<tr><td>' + props[p].desc + '<br/>';
                propGridContent += '<button type="button" class="btn btn-sm btn-info" onclick="neoPropertyGrid.' + funcName + '"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>';
                propGridContent += '</td><td>';
            }
            else
                propGridContent += '<tr><td>' + props[p].desc + '</td><td>';

            if (props[p].type === "number" || props[p].type === "string") {
                var propVal = props[p].value;

                if (props[p].desc.indexOf("Color Hex") > 0)
                    propGridContent += '<input type="color" class="form-control input-sm" value="' + propVal + '" onchange="neoPropertyGrid.updateProp(\'' + targetTypeName + '\',\'' + props[p].name + '\', this.value,\'' + timestamp + '\')" />';
                else if (props[p].name === "text" || props[p].name === "comments" || props[p].name === "design_background_image")
                    propGridContent += '<textarea class="form-control input-sm" rows="3" onchange="neoPropertyGrid.updateProp(\'' + targetTypeName + '\',\'' + props[p].name + '\', this.value,\'' + timestamp + '\')">' + propVal + '</textarea>';
                else if (props[p].name === "expression") {
                    var regEx = /_x[0-9A-Fa-f]{4}_/g;
                    if (regEx.test(propVal)) {
                        propVal = propVal.replace(/_x0022_/g, '&#34;')
                            .replace(/_x003c_/g, '&#60;')
                            .replace(/_x003e_/g, '&#62;')
                            .replace(/_x0026_/g, '&#38;');
                    } else {
                        propVal = propVal.replaceAll("&", '&#38;')
                            .replaceAll("\"", '&#34;')
                            .replaceAll("<", '&#60;')
                            .replaceAll(">", '&#62;');
                    }

                    propGridContent += '<div class="input-group">';
                    id = 'expr' + id;
                    propGridContent += '<input type="text" id="' + id + '" class="form-control input-sm" value="' + propVal + '" onchange="neoPropertyGrid.updateProp(\'' + targetTypeName + '\',\'' + props[p].name + '\', this.value,\'' + timestamp + '\');" />';
                    propGridContent += '<span class="input-group-btn"><button class="btn btn-primary btn-sm" onclick="exprBuilder.openExpressionBuilder($(\'#' + id + '\').val()); exprBuilder.curElemId = \'' + id + '\';"><em><strong>fx</strong></em></button></span>';
                    propGridContent += '</div>';
                }
                else if (props[p].type === "number") {
                    if (props[p].name.indexOf("color") > -1)
                        propGridContent += this.createSelectForEnum(targetTypeName, "Color", props[p].value, props[p].name, timestamp);
                    else if (props[p].name === "unit_type")
                        propGridContent += this.createSelectForEnum(targetTypeName, "UnitType", props[p].value, props[p].name, timestamp);
                    else if (props[p].name === "sizing")
                        propGridContent += this.createSelectForEnum(targetTypeName, theObj.constructor.name === "TextItem" ? "TextSizing" : "BarcodeSizing", props[p].value, props[p].name, timestamp);
                    else if (props[p].name === "data_format")
                        propGridContent += this.createSelectForEnum(targetTypeName, "RFIDTagDataFormat", props[p].value, props[p].name, timestamp);
                    else if (props[p].name === "flip" ||
                        props[p].name === "lock_aspect_ratio" ||
                        props[p].name === "aztec_code_format" ||
                        props[p].name === "barcode_alignment" ||
                        props[p].name === "bearer_bar_style" ||
                        props[p].name === "data_matrix_encoding" ||
                        props[p].name === "data_matrix_format" ||
                        props[p].name === "dot_code_module_shape" ||
                        props[p].name === "han_xin_code_encoding" ||
                        props[p].name === "han_xin_code_error_correction_level" ||
                        props[p].name === "han_xin_code_version" ||
                        props[p].name === "isbt_128_data_structure" ||
                        props[p].name === "msi_checksum" ||
                        props[p].name === "pdf417_compaction_type" ||
                        props[p].name === "telepen_encoding")
                        propGridContent += this.createSelectForEnum(targetTypeName, props[p].name.replace(/_/g, ' ').replace(/(?: |\b)(\w)/g, function (key, p1) { return key.toUpperCase(); }).replace(/ /g, ''), props[p].value, props[p].name, timestamp);
                    else if (props[p].name.indexOf("codabar") > -1)
                        propGridContent += this.createSelectForEnum(targetTypeName, "CodabarStartStopChar", props[p].value, props[p].name, timestamp);
                    else if (props[p].name.indexOf("code128") > -1)
                        propGridContent += this.createSelectForEnum(targetTypeName, "Code128", props[p].value, props[p].name, timestamp);
                    else if (props[p].name.indexOf("code16k") > -1)
                        propGridContent += this.createSelectForEnum(targetTypeName, "Code16K", props[p].value, props[p].name, timestamp);
                    else if (props[p].name === "text_alignment")
                        propGridContent += this.createSelectForEnum(targetTypeName, theObj.constructor.name === "TextItem" ? "TextAlignment" : "BarcodeTextAlignment", props[p].value, props[p].name, timestamp);
                    else if (props[p].name === "text_vertical_alignment")
                        propGridContent += this.createSelectForEnum(targetTypeName, "TextVerticalAlignment", props[p].value, props[p].name, timestamp);
                    else if (props[p].name === "code_alignment")
                        propGridContent += this.createSelectForEnum(targetTypeName, "BarcodeTextAlignment", props[p].value, props[p].name, timestamp);
                    else if (props[p].name === "ean_upc_supplement")
                        propGridContent += this.createSelectForEnum(targetTypeName, "Supplement", props[p].value, props[p].name, timestamp);
                    else if (props[p].name === "error_behavior")
                        propGridContent += this.createSelectForEnum(targetTypeName, "BarcodeErrorBehavior", props[p].value, props[p].name, timestamp);
                    else if (props[p].name.indexOf("itf14") > -1)
                        propGridContent += this.createSelectForEnum(targetTypeName, "ItfHmark", props[p].value, props[p].name, timestamp);
                    else if (props[p].name === "maxi_code_mode")
                        propGridContent += this.createSelectForEnum(targetTypeName, "MaxiCodeModes", props[p].value, props[p].name, timestamp);
                    else if (props[p].name === "micropdf417_version")
                        propGridContent += this.createSelectForEnum(targetTypeName, "MicroPdf417Version", props[p].value, props[p].name, timestamp);
                    else if (props[p].name === "microqr_code_version")
                        propGridContent += this.createSelectForEnum(targetTypeName, "MicroQRCodeVersion", props[p].value, props[p].name, timestamp);
                    else if (props[p].name === "rect_microqr_code_version")
                        propGridContent += this.createSelectForEnum(targetTypeName, "RectMicroQRCodeVersion", props[p].value, props[p].name, timestamp);
                    else if (props[p].name === "pdf417_error_correction_level")
                        propGridContent += this.createSelectForEnum(targetTypeName, "Pdf417ErrorCorrection", props[p].value, props[p].name, timestamp);
                    else if (props[p].name === "qr_code_encoding")
                        propGridContent += this.createSelectForEnum(targetTypeName, "QRCodeEncoding", props[p].value, props[p].name, timestamp);
                    else if (props[p].name === "qr_code_error_correction_level")
                        propGridContent += this.createSelectForEnum(targetTypeName, "QRCodeErrorCorrectionLevel", props[p].value, props[p].name, timestamp);
                    else if (props[p].name === "qr_code_version")
                        propGridContent += this.createSelectForEnum(targetTypeName, "QRCodeVersion", props[p].value, props[p].name, timestamp);
                    else if (props[p].name === "qr_code_mask")
                        propGridContent += this.createSelectForEnum(targetTypeName, "QRCodeMask", props[p].value, props[p].name, timestamp);
                    //else if (props[p].name === "symbology")
                    //    propGridContent += this.createSelectForEnum("BarcodeSymbology", props[p].value, props[p].name, timestamp);
                    else if (props[p].name === "upce_system")
                        propGridContent += this.createSelectForEnum(targetTypeName, "UpcE", props[p].value, props[p].name, timestamp);
                    else if (props[p].name === "usps_fim_pattern")
                        propGridContent += this.createSelectForEnum(targetTypeName, "FIM", props[p].value, props[p].name, timestamp);
                    else if (props[p].name === "orientation")
                        propGridContent += this.createSelectForEnum(targetTypeName, "LineOrientation", props[p].value, props[p].name, timestamp);
                    else if (props[p].name === "stroke_style")
                        propGridContent += this.createSelectForEnum(targetTypeName, "StrokeStyle", props[p].value, props[p].name, timestamp);
                    else if (props[p].name === "code_encoding")
                        propGridContent += this.createSelectForEnum(targetTypeName, "CodeEncoding", props[p].value, props[p].name, timestamp);
                    else
                        propGridContent += '<input type="number" class="form-control input-sm" value="' + props[p].value.toFixed(this.numOfFractionalDigits) + '" onchange="neoPropertyGrid.updateProp(\'' + targetTypeName + '\',\'' + props[p].name + '\', this.value,\'' + timestamp + '\')" />';
                }
                else
                    propGridContent += '<input type="text" class="form-control input-sm" value="' + propVal + '" onchange="neoPropertyGrid.updateProp(\'' + targetTypeName + '\',\'' + props[p].name + '\', this.value,\'' + timestamp + '\')" />';

            }
            else if (props[p].class_name === "Array" &&
                (props[p].name === "columns" || props[p].name === "rows")) {

                var removeFuncName = props[p].name === "columns" ? "removeTableColumn" : "removeTableRow";
                
                var objVal = props[p].value;
                propGridContent += '<table class="table">';

                for (var o in objVal) {
                    if (o[0] !== '_' &&
                        typeof (objVal[o]) !== 'function') {

                        //console.log(o);

                        var propsObj = [];

                        var objName = objVal[o] !== null ? objVal[o].constructor.name : "";
                        propsObj.push({"index": parseInt(o), "name": objName, "type": typeof (objVal[o]), "value": objVal[o], "class_name": objName, "desc": objName.replace(/_/g, ' ').replace(/(?: |\b)(\w)/g, function (key, p1) { return key.toUpperCase(); }) });
                        
                        propGridContent += '<tr>';

                        propGridContent += '<td>';
                        propGridContent += '<span>' + o.replace(/_/g, ' ').replace(/(?: |\b)(\w)/g, function (key, p1) { return key.toUpperCase(); }) + '</span>';
                        propGridContent += '<br/><br/><button type="button" class="btn btn-sm btn-danger" onclick="neoPropertyGrid.' + removeFuncName + '(' + o + ')"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>';
                        propGridContent += '</td>';

                        propGridContent += '<td>';

                        propGridContent += this.createObjectComplexProp(targetTypeName, propsObj[0], timestamp);

                        propGridContent += '</td>';

                    }
                }
                propGridContent += '</table>';
            }
            else if (props[p].type === "object") { //Complex Property
                //console.log(props[p].name);
                propGridContent += this.createObjectComplexProp(targetTypeName, props[p], timestamp);
                
            }            
            else if (props[p].type === "boolean")
                propGridContent += this.createCheckbox(targetTypeName, '', props[p].value, props[p].name, timestamp);
            propGridContent += '</td></tr>';
        }

        propGridContent += '</tbody></table >';
        $('#' + targetContainer).html(propGridContent);
    }
};
