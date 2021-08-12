var exprBuilder = {

    create: function () {
        //get supported expressions
        this.supportedExpr = tleditor.getSupportedExpressions();

        //add event handlers
        $('#expr-name').on('dblclick', 'option', function () {
            //alert($('#expr-name option:selected').text());
            //alert($('#expr-syntax').val());
            $('#expression')[0].insertAtCaret($('#expr-syntax').val());
        });

        //console.log(expr);

        //add expr categories
        var opts = '';
        for (var i in this.supportedExpr) {
            //console.log(expr[i]);]
            opts += '<option name="' + this.supportedExpr[i].category + '" value="' + i + '" >' + this.supportedExpr[i].category.replace(/([A-Z])/g, " $1").trim() + '</option>';
        }
        $('#expr-category').append(opts);

    },

    categoryChanged: function () {
        $('#expr-name').empty();
        var sel = parseInt($('#expr-category option:selected').val());
        //add expr categories
        var opts = '';
        for (var i in this.supportedExpr[sel].expressions) {
            opts += '<option value="' + i + '">' + this.supportedExpr[sel].expressions[i].name + '</option>';
        }
        $('#expr-name').append(opts);
    },

    nameChanged: function () {
        $('#expr-desc').empty();
        $('#expr-syntax').empty();
        $('#expr-example').empty();
        var selCat = parseInt($('#expr-category option:selected').val());
        var selName = parseInt($('#expr-name option:selected').val());
        var expr = this.supportedExpr[selCat].expressions[selName];
        $('#expr-desc').val(expr.desc);
        $('#expr-syntax').val(expr.syntax);
        $('#expr-example').val(expr.example);
    },

    openExpressionBuilder: function (curExpr, isGlobalExpr) {
        if (isGlobalExpr) {
            this.addLabelItems();
            $('#expression').val(this.unescapeExpr(curExpr));
            $("#expression-builder").modal();
        }
        else if (curExpr) {
            this.addLabelItems();
            $('#expression').val(this.unescapeExpr(curExpr));
            $("#expression-builder").modal();
        }
        else if (tleditor.current_selection) {
            this.addLabelItems();
            $('#expression').val(this.unescapeExpr(tleditor.current_selection.expression));
            $("#expression-builder").modal();
        }
        else {
            UIEditor.showErrorMsg('Please select an Item');
        }

    },

    updateItemProp: function () {
        if (this.curElemId) {
            $('#' + this.curElemId).val(this.escapeExpr($('#expression').val()));
            $('#' + this.curElemId).change();
            this.curElemId = null;
        }
        else if (tleditor.current_selection) {
            tleditor.current_selection.expression = this.escapeExpr($('#expression').val());
            tleditor.current_selection.refresh();
        }

        UIEditor.closeModal();
    },

    escapeExpr: function (s) {
        var tagsToReplace = {
            '"': '&#34;',
            '&': '&#38;',
            '<': '&#60;',
            '>': '&#62;'
        };
        return s.replace(/["&<>]/g, function (tag) {
            return tagsToReplace[tag] || tag;
        });
    },
    unescapeExpr: function (s) {
        return s.replace(/_x0022_/g, '\"')
            .replace(/_x003c_/g, '<')
            .replace(/_x003e_/g, '>')
            .replace(/_x0026_/g, '&');
    },

    addLabelItems: function () {
        //add to the category expressions the list of named Items in the current label if any
        var tl = tleditor.get_thermal_label;
        var namedItems = [];
        for (var i in tl.items) {
            if (tl.items[i].name.length > 0) {
                namedItems.push({ name: tl.items[i].name, syntax: "[Items!" + tl.items[i].name + "]", desc: "Item " + tl.items[i].name, example: "[Items!" + tl.items[i].name + "]" });
            }
        }
        if (namedItems.length > 0) {
            var namedItemsExpr = { category: "Items", expressions: namedItems };
            if (this.supportedExpr[this.supportedExpr.length - 1].category === "Items")
                this.supportedExpr[this.supportedExpr.length - 1] = namedItemsExpr;
            else
                this.supportedExpr.push(namedItemsExpr);
        }
        //Update UI
        $('#expr-name').empty();
        $('#expr-desc').empty();
        $('#expr-syntax').empty();
        $('#expr-example').empty();


        if ($("#expr-category option[name='Items']")[0])
            $("#expr-category option[name='Items']").remove();

        if (namedItems.length > 0) {
            var opt = '<option name="Items" value="' + (this.supportedExpr.length - 1) + '" >Items</option>';
            $('#expr-category').append(opt);
        }

    }

};


HTMLTextAreaElement.prototype.insertAtCaret = function (text) {
    text = text || '';
    if (document.selection) {
        // IE
        this.focus();
        var sel = document.selection.createRange();
        sel.text = text;
    } else if (this.selectionStart || this.selectionStart === 0) {
        // Others
        var startPos = this.selectionStart;
        var endPos = this.selectionEnd;
        this.value = this.value.substring(0, startPos) +
            text +
            this.value.substring(endPos, this.value.length);
        this.selectionStart = startPos + text.length;
        this.selectionEnd = startPos + text.length;
    } else {
        this.value += text;
    }
};