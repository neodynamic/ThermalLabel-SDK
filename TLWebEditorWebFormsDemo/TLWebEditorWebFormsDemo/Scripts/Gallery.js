var gallery = {
    
    load: function () {

        $('#label-gallery-entries').empty();
        
        var _this = this;
        $.ajax({
            url: 'https://raw.githubusercontent.com/neodynamic/ThermalLabel-SDK/main/LabelsGallery/index-v10.xml',
            async: true
        }).done(function (data) {

            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(data, "text/xml");

            //console.log(xmlDoc.getElementsByTagName("labeltemplate"));

            var galleryIndex = xmlDoc.getElementsByTagName("labeltemplate");

            _this.labels = {};
            

            for (var idx = 0; idx < galleryIndex.length; idx++) {

                _this.curIndex = idx;

                var attr = galleryIndex[idx].attributes['name'];
                if (attr)
                    _this.labels['labelName' + idx] = attr.nodeValue;

                attr = galleryIndex[idx].attributes['filename'];
                if (attr) {
                    //console.log(attr.nodeValue);

                    $.ajax({
                        url: 'https://raw.githubusercontent.com/neodynamic/ThermalLabel-SDK/main/LabelsGallery/' + attr.nodeValue,
                        async: true,
                        curLabelIndex: _this.curIndex
                    }).done(function (data) {

                        _this.labels['labelTemplate' + this.curLabelIndex] = data;

                        var thumbnail = '<div class="gallery-entry">';
                        thumbnail += '<img id="labelIndex' + this.curLabelIndex + '" src="' + _this.getProgressIcon() +'" >';
                        thumbnail += '<p><small>' + _this.labels['labelName' + this.curLabelIndex] + '</small></p>';
                        thumbnail += '<a href="#" class="btn btn-sm btn-default" onclick="gallery.editLabel(' + this.curLabelIndex + ');" ><i class="glyphicon glyphicon-pencil"></i>&nbsp;Edit...</a>';
                        thumbnail += '<br /><br />';
                        thumbnail += '</div>';

                        $('#label-gallery-entries').append(thumbnail);

                        _this.displayLabel(this.curLabelIndex);

                        
                    }).
                        fail((data) => {
                            console.log("Error: " + data.responseText);
                        });

                }

            }

        }).
            fail((data) => {
                console.log ("Error: " + data.responseText);
            });

        

    },

    displayLabel: function (index) {
        _this = this;
        //generate label thumbnail
        tleditor.getLabelThumbnail(200, _this.labels['labelTemplate' + index], null, function (imageContent) {
            $('#labelIndex' + index).attr('src', 'data:image/png;base64,' + imageContent);
        });
    },

    editLabel: function (index) {
        if (this.labels['labelTemplate' + index]) {
            var tl = Neodynamic.SDK.Printing.ThermalLabel.createFromXmlTemplate(this.labels['labelTemplate' + index]);
            tleditor.loadThermalLabel(tl);
            $('#editorTabs a[href="#label-design-tab"]').tab('show');
            tleditor.zoom = 100;

            let htmlExpr = '';
            tl.expressions.forEach(x => {
                htmlExpr += '<tr><td>' + x + '</td></tr>';
            });
            $('#tableGlobalExpressions').html(htmlExpr);
            $('#txtExpressionsCount').html(tl.expressions.length);

        }
    },

    getProgressIcon: function () {
        return 'data:image/gif;base64,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';
    }


};