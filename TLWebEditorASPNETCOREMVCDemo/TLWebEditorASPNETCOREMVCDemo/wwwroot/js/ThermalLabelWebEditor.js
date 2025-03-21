﻿/*
 * ThermalLabel Web Editor Add-on
 * ThermalLabelWebEditor-14.0.0.0.js
 * @author Neodynamic (http://neodynamic.com/)
 * Contact: https://neodynamic.com/support
 * WebPage: https://neodynamic.com/products/printing/thermal-label/web-editor/
 */
﻿
﻿
/**
 * fabric.canvasex.js
 * @author Jim Ma (https://github.com/mazong1123)
 * Contact: mazong1123@gmail.com
 * License: MIT
 */
(function () {
    'use strict';

    var addListener = fabric.util.addListener;
    var removeListener = fabric.util.removeListener;

    fabric.CanvasEx = fabric.util.createClass(fabric.Canvas, /** @lends fabric.Canvas */ {
        tapholdThreshold: 2000,

        _bindEvents: function () {
            var self = this;

            self.callSuper('_bindEvents');

            self._onDoubleClick = self._onDoubleClick.bind(self);
            self._onTapHold = self._onTapHold.bind(self);
        },

        _onDoubleClick: function (e) {
            var self = this;

            var target = self.findRealTarget(e);
            self.fire('mouse:dblclick', {
                target: target,
                e: e
            });

            if (target && !self.isDrawingMode) {
                // To unify the behavior, the object's double click event does not fire on drawing mode.
                target.fire('object:dblclick', {
                    e: e
                });
            }
        },

        _onTapHold: function (e) {
            var self = this;

            var target = self.findRealTarget(e);
            self.fire('touch:taphold', {
                target: target,
                e: e
            });

            if (target && !self.isDrawingMode) {
                // To unify the behavior, the object's tap hold event does not fire on drawing mode.
                target.fire('taphold', {
                    e: e
                });
            }

            if (e.type === 'touchend' && self.touchStartTimer != null) {
                clearTimeout(self.touchStartTimer);
            }
        },

        _onMouseDown: function (e) {
            var self = this;

            self.callSuper('_onMouseDown', e);

            if (e.type === 'touchstart') {
                var touchStartTimer = setTimeout(function () {
                    self._onTapHold(e);
                    self.isLongTap = true;
                }, self.tapholdThreshold);

                self.touchStartTimer = touchStartTimer;

                return;
            }

            var isTargetGroup = false;
            var target = self.findTarget(e);
            if (target !== undefined && target._objects !== undefined) {
                isTargetGroup = true;
            }

            // Add right click support and group object click support.
            if (e.which === 3 || (isTargetGroup && self.fireEventForObjectInsideGroup)) {
                // Skip group to find the real object.
                var target = self.findRealTarget(e);

                if (!isTargetGroup || !self.fireEventForObjectInsideGroup) {
                    // Canvas event only for right click. For group object, the super method already fired a canvas event.
                    self.fire('mouse:down', { target: target, e: e });
                }

                if (target && !self.isDrawingMode) {
                    // To unify the behavior, the object's mouse down event does not fire on drawing mode.
                    target.fire('mousedown', {
                        e: e
                    });
                }
            }
        },

        _onMouseUp: function (e) {
            var self = this;

            self.callSuper('_onMouseUp', e);

            if (e.type === 'touchend') {
                // Process tap hold.
                if (self.touchStartTimer != null) {
                    clearTimeout(self.touchStartTimer);
                }

                // Process long tap.
                if (self.isLongTap) {
                    self._onLongTapEnd(e);
                    self.isLongTap = false;
                }

                // Process double click
                var now = new Date().getTime();
                var lastTouch = self.lastTouch || now + 1;
                var delta = now - lastTouch;
                if (delta < 300 && delta > 0) {
                    // After we detct a doubletap, start over
                    self.lastTouch = null;

                    self._onDoubleTap(e);
                } else {
                    self.lastTouch = now;
                }

                return;
            }
        },

        _onDoubleTap: function (e) {
            var self = this;

            var target = self.findRealTarget(e);
            self.fire('touch:doubletap', {
                target: target,
                e: e
            });

            if (target && !self.isDrawingMode) {
                // To unify the behavior, the object's double tap event does not fire on drawing mode.
                target.fire('object:doubletap', {
                    e: e
                });
            }
        },

        _onLongTapEnd: function (e) {
            var self = this;

            var target = self.findRealTarget(e);
            self.fire('touch:longtapend', {
                target: target,
                e: e
            });

            if (target && !self.isDrawingMode) {
                // To unify the behavior, the object's long tap end event does not fire on drawing mode.
                target.fire('object:longtapend', {
                    e: e
                });
            }
        },

        _initEventListeners: function () {
            var self = this;
            self.callSuper('_initEventListeners');

            addListener(self.upperCanvasEl, 'dblclick', self._onDoubleClick);
        },

        _checkTargetForGroupObject: function (obj, pointer) {
            if (obj &&
                obj.visible &&
                obj.evented &&
                this._containsPointForGroupObject(pointer, obj)) {
                if ((this.perPixelTargetFind || obj.perPixelTargetFind) && !obj.isEditing) {
                    var isTransparent = this.isTargetTransparent(obj, pointer.x, pointer.y);
                    if (!isTransparent) {
                        return true;
                    }
                }
                else {
                    return true;
                }
            }
        },

        _containsPointForGroupObject: function (pointer, target) {
            var xy = this._normalizePointer(target, pointer);

            // http://www.geog.ubc.ca/courses/klink/gis.notes/ncgia/u32.html
            // http://idav.ucdavis.edu/~okreylos/TAship/Spring2000/PointInPolygon.html
            return (target.containsPoint(xy) || target._findTargetCorner(pointer));
        },

        _adjustPointerAccordingToGroupObjects: function (originalPointer, group) {
            var groupObjects = group._objects;
            var objectLength = groupObjects.length;
            if (objectLength <= 0) {
                return originalPointer;
            }

            var minLeft = 99999;
            var minTop = 99999;

            var i;
            for (i = 0; i < objectLength; i++) {
                var obj = groupObjects[i];
                if (minLeft > obj.left) {
                    minLeft = obj.left;
                }

                if (minTop > obj.top) {
                    minTop = obj.top;
                }
            }

            originalPointer.x += minLeft - group.left;
            originalPointer.y += minTop - group.top;

            return originalPointer;
        },

        findRealTarget: function (e) {
            var self = this;
            var target;
            if (!self.fireEventForObjectInsideGroup) {
                target = self.findTarget(e);
            }
            else {
                // Skip group to find the real object.
                var target = self.findTarget(e, true);
                if (target !== undefined && target._objects !== undefined) {
                    var pointer = self.getPointer(e, true);
                    var objects = target._objects;
                    pointer = self._adjustPointerAccordingToGroupObjects(pointer, target);
                    var i = objects.length;
                    while (i--) {
                        if (self._checkTargetForGroupObject(objects[i], pointer)) {
                            target = objects[i];

                            break;
                        }
                    }
                }
            }

            return target;
        },

        removeListeners: function () {
            var self = this;
            self.callSuper('removeListeners');

            removeListener(self.upperCanvasEl, 'dblclick', self._onDoubleClick);
        },

        fireEventForObjectInsideGroup: false
    });

})();

var Neodynamic;
(function (Neodynamic) {
    var SDK;
    (function (SDK) {
        var Printing;
        (function (Printing) {
            var PdfMetadata = /** @class */ (function () {
                function PdfMetadata() {
                    this._author = '';
                    this._creator = '';
                    this._producer = '';
                    this._subject = '';
                    this._title = '';
                    this._use_vector_drawing = false;
                }
                Object.defineProperty(PdfMetadata.prototype, "author", {
                    get: function () { return this._author; },
                    set: function (value) {
                        this._author = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(PdfMetadata.prototype, "creator", {
                    get: function () { return this._creator; },
                    set: function (value) {
                        this._creator = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(PdfMetadata.prototype, "producer", {
                    get: function () { return this._producer; },
                    set: function (value) {
                        this._producer = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(PdfMetadata.prototype, "subject", {
                    get: function () { return this._subject; },
                    set: function (value) {
                        this._subject = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(PdfMetadata.prototype, "title", {
                    get: function () { return this._title; },
                    set: function (value) {
                        this._title = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(PdfMetadata.prototype, "use_vector_drawing", {
                    get: function () { return this._use_vector_drawing; },
                    set: function (value) {
                        this._use_vector_drawing = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                return PdfMetadata;
            }());
            Printing.PdfMetadata = PdfMetadata;
        })(Printing = SDK.Printing || (SDK.Printing = {}));
    })(SDK = Neodynamic.SDK || (Neodynamic.SDK = {}));
})(Neodynamic || (Neodynamic = {}));
var Neodynamic;
(function (Neodynamic) {
    var SDK;
    (function (SDK) {
        var Printing;
        (function (Printing) {
            var Item = /** @class */ (function () {
                function Item() {
                    this._comments = '';
                    this._data_field = '';
                    this._data_field_format_string = '';
                    this._dpi = 96;
                    this._name = '';
                    this._print_as_graphic = false;
                    this._tag = '';
                    this._unit_type = Printing.UnitType.Inch;
                    this._x = 0;
                    this._y = 0;
                    this._locked = false;
                    this._editable = true;
                    this._expression = '';
                    this._use_cache = false;
                    this._cache_item_id = '';
                    this._visible = true;
                    this._group_name = '';
                    this._resizable = true;
                    this._readonly = false;
                    this._fabric_item = '';
                    this._guid = '';
                    this._missing_image = "data:image/gif;base64,R0lGODlhWALCAfIAALu7u7y8ury8u729u7y8vAAAAAAAAAAAACH5BAEAAAUALAAAAABYAsIBAAP+KLrc/jDKSau9OOvNu/9gKI5kaZ5oqq5s675wLM90bd94ru987//AoHBILBqPyKRyyWw6n9CodEqtWq/YrHbL7Xq/4LB4TC6bz+i0es1uu9/wuHxOr9vv+Lx+z+/7/4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAMKHEiwoMGDCBMq7FegocOHECNKnEixosWLGDNq3Mj+saPHjyBDihxJsqTJkyhTisSjsqXLlzBjypxJs6bNmzglsszJs6fPn0CDCh1KtOHOokiTKl3KtKnTkkefSp1KtarVqymjYt3KtavXr0i1gh1LtqzZsx3Fol3Ltq1bq2rfyp1Lt67NuHbz6t3LVyPevoADC6b7d7Dhw4i7Fk7MuLHjsHceS55MOejiypgzaw55ebPnz6Ahdg5NujTl0aZTqzaMerXr13Zbw55NG63s2rhzc72tu7dvp7x/Cx8uNDjx48jvRk7OvPlQ486jS+e8fLr16y6hY9/O3aH27uCtfw9Pvvn48uiJn0/Pvvf69vBpv49Pf/X8+vhJ38/Pf/P+/v4AnlZdgAS6N2CBCMp3YIIM2rdggxDq92CEFPo3YYUYCmhHhhxq9l+HIJb1YYgkejViiShedWKKLEq1YoswLvVijDQSNWONOP50Y4484rRjj1IBQIAEQwYA349AJvUBAEaSh2SSQgFQAgDgPQllTytQuZ2VV94EQ5PTcdnlTDQQEOaFY3YlpQ3SiZlmSzqYaR6ab1blw5wb1mkiEMm5qadIAQyBnJ9/fhQoEccRWihHSKhH56JFKTGcopBetGYSwlFaKUVDMvGbpptGNIATA/gGaqgPRWFgnqhGGoWWuJ2KKhW6ybppp1PkZmulVoA5266LYhHro63WlEVtwOr+NqSIWfjqWrK6KjDWocf+SmyDDJT6FRcKsgoirtJuyy1s0M4G7gJ7jvtaueRCoFgXzqbG7rMSbAVGu95iOGq9WIEhp4P5VlhBv/fSG3CEF8AVxrrXApiBnQsbXAeHGcD61BgS05HhBlRhDPDEFZ6b8MUeqzZvaB88JXIXGc8hcMpNkREvyg3XFwJwY2grb83xrcwxU2V8rDGEJABNhtAuY1uCjEebzDN71I6g1KViIC2H0iYkFXXEOx/cnwpIbV1w1yAXuILOQu1bsmknVya2CTP39LYXVseBoAuurl1a25P5fIKNTZM9NIBUt/Bc4Gw/XWUMcfuI+N6Kc0dDcWP+NO4Z343NbThQj0Pu9ZE1WMxT5xJ+zh4O/46ut+dl25wD52Gknrjp5amNg45hoD176/H14JPfwrZ8dX2Fv84T8FcwTDt4mttgeUxcO718d0H0ZPsW+PKenqCqcyG74Em3V3wP39PkhejgD9+eETnRnf3g27PfvrrC2316o45r0a32zCeBPplZ+F/67IeeJQgQJshzArIid5zxFWF+Vjjg7uAHngQKAYK0WuD0ogMFnFyvg8PaIJ6ekL8o6O594aOeFCSYnVfVioGfypWXVPVCEQ6KCuWDHglXxb/pNI8JOYSJAk0Fw9w4EAoshJOniGjDSVVrhkg4YQh76Bz6Gev+CEHcHwWlc8QMQnEIz7NWE5loRZp80HeJKqIYWZaTLt6gT2pU3hewRD7mYK4tq7uiDpIYrTFOMXolpIEUHeVH2rhRC2GEyRnx1qY4pmaRc/zJIZcmHkdOcAxZrIkFQbAlS5YODUOZpAb4eMNCuuaHgJRkCALlJE+Cpg1KGdImFUDKRppSemygCgEIUEsV3vKSayhWRu44ljgMUpipcqWH1IfMiRDTK6I0QzMp8kyuoDINiZyVMitzh0y2qpoEu0Mvg7VNycwymNNM5i8vt4d0eqecjulDNsm5zsyc0w3jrBM4O/YHd+7TRYFI5z9xJohpDpQp0axnjg7KNEI0k6H+SjoEMiGaN4kWi6KAQ8Qx/4RRyiniovAMTEL7EJhwfXKLuFxEX/a1UW6GtC+QyCdZGMA6lNa0EfNkFk1pplDETCIvH5Qpa16ql0rE5gE8peJnLkEYCOTUp0StyzUV8VR78YudPRVMJt6SwKVGdS6bcEsFqqrVr75lqo5gy8iWmVWYdsI2GLBQW/fyibPcU6h86agmQWGWn2FGr+YDRUsh5lcNKdWwfBUXBwY71LnWpRR4zSgH/mrWs0Dyre+C2WQAK8RT7OZmiE1hZlLB2KRc9mGbrSxZ0LqJyNJRapLhrBJVobCixVa1YHEFVU472cfIFiX39MRUUuBb3KZLtwT+/Vs8jftZWCQXBct17FpYOwqmBHeUjfktSWzR0BVkl7kq4i5kWuDNooKXsLUga2dfwBjthuS6piAKfD2QGPeCZBeHkwFUpTtTXlhmcoexb0d4G4vSvuSNjT0sYH6BuxoY+C0C3kgwXsumwUQ4IwSuBQYRXNLzWpcYN8lwCx6sVg93d8LK2UFZ+WtNY+iRBx1mMVZEnIuZ0Ji9CzbxeI8hk+q5Vca1RYZrLyIEEvdVx0O5MX5beMG8Itmjy2jJfGHgZCAP9xkqOQJdn9xgLJ8Ef3m5MESUDIwvYyrMXKYwNEpC5hsYWbEKFms1trsENFvZaNZYCRPenNk4lzjP9x3+YlPvHMtsBFrQchEzNzwShfIWM80pzgaJZZhoSAeWG44uQJv5VGlCS3bRw6xCp/282nBgJHkQtrQOTV2RTXMPj6o+8DiyqD9Yexp25KBmrf9MajiPQydl1GmvuzLlaIiu2PJby2/VkbpIwvXWajbHO8+n7FijpB0FqNqzh30VVy+EymcB7Ei/XWFh2/TR5H7gkaEd6XQjytyiLbW7tdxfdl963upGN7elgmx8gzu31qaOv4/A54jae9UDT/Zxz23VhB9BvTtmeHgdDuY+S7wq3qb4DHwd7+Zq/OEL73g4P17xkV88SCSvs8dPTrKUJwHi/z34tV2ucpOLXJc0X+L+xPdd0ZwjAeY+qabPm2BzZlql30MHMHpZrrWkEz3ITI+408/MT5nreepPv7LVQTJurMO46jzvstdr3vKwR3vsL9e62XOCdLTXQO1Rj7nbgQjQrTNq7iCMWcAh0na8v/25Ny9K1/1eR73bPdSE3yGe137vxCPa4IzvseOlsPi4b3jyWYe85b+IecVL3ehFoW7nm/x5Amp+9I/Pb+SZjHoa9jzwv2v9FIA+29VnRfZeVP3mJY97SkN59+vtPeU/DXuc9F34xvt98TmPfNfj2vZQab6olQ96uUnfCtQ3vdivHwXaR//w2eY+9p8P/JmLf/xB1/Hxz68D718d+odm//T+z65948s/eN2Df1ruj//LV//F/Dd/gbR8rBeAVZBpt3dwomeA9DaA/8d7DIhqzPeAwReBveKA9QeBFiiBAEiAJ5FxG/hqjeeBJhGCW4CAdHZrg2eCDQhAnraALEh1GkiCIxGDwVaANChwNrhrCFd+G7GCO1hyOEiB7lSEdwd+RggkYpaEBbR3TJgiS/iE4RGFUuhL+leFoUKFWIgdWriFlYSEXtgiXRiGHOSEZIghY3iGdmSGaogwbNiGWHOFcJgmaTiHTgSGdkgxb5iHBFKHfMhDPviHeuKHgvhHOViI9CSHiLhQe7iIroOHjpgghBiJ9QMHlOhPjXiJ9wOJmuivMJnYieUxiaB4Uoc4ikkiiqboVZyYivSBiqzIVor4ih3iirLoUkF4i7iYi7q4i7zYi774i8AYjMI4jMRYjMZ4jMiYjMq4jMzYjM74jNAYjdI4jdRYjdZ4jdiYjdq4jdzYjd74jeAYjuI4juRYjuZ4juiYjuq4juzYju74jvAYj/I4j/RYj/Z4j/iYj/q4j/zYj/74jwAZkAI5kARZkAZ5kAiZkAq5kAzZkA75kOOQAAA7";
                }
                Object.defineProperty(Item.prototype, "x", {
                    get: function () { return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._x, this._unit_type); },
                    set: function (value) {
                        this._x = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(Item.prototype, "y", {
                    get: function () { return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._y, this._unit_type); },
                    set: function (value) {
                        this._y = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(Item.prototype, "locked", {
                    get: function () { return this._locked; },
                    set: function (value) {
                        this._locked = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(Item.prototype, "editable", {
                    get: function () { return this._editable; },
                    set: function (value) {
                        this._editable = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(Item.prototype, "comments", {
                    get: function () { return this._comments; },
                    set: function (value) {
                        this._comments = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(Item.prototype, "data_field", {
                    get: function () { return this._data_field; },
                    set: function (value) {
                        this._data_field = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(Item.prototype, "data_field_format_string", {
                    get: function () { return this._data_field_format_string; },
                    set: function (value) {
                        this._data_field_format_string = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(Item.prototype, "name", {
                    get: function () { return this._name; },
                    set: function (value) {
                        this._name = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(Item.prototype, "print_as_graphic", {
                    get: function () { return this._print_as_graphic; },
                    set: function (value) {
                        this._print_as_graphic = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(Item.prototype, "unit_type", {
                    get: function () { return this._unit_type; },
                    set: function (value) {
                        this._unit_type = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(Item.prototype, "tag", {
                    get: function () { return this._tag; },
                    set: function (value) {
                        this._tag = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(Item.prototype, "expression", {
                    get: function () { return this._expression; },
                    set: function (value) {
                        this._expression = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(Item.prototype, "use_cache", {
                    get: function () { return this._use_cache; },
                    set: function (value) {
                        this._use_cache = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(Item.prototype, "cache_item_id", {
                    get: function () { return this._cache_item_id; },
                    set: function (value) {
                        this._cache_item_id = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(Item.prototype, "visible", {
                    get: function () { return this._visible; },
                    set: function (value) {
                        this._visible = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(Item.prototype, "group_name", {
                    get: function () { return this._group_name; },
                    set: function (value) {
                        this._group_name = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(Item.prototype, "resizable", {
                    get: function () { return this._resizable; },
                    set: function (value) {
                        this._resizable = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(Item.prototype, "read_only", {
                    get: function () { return this._readonly; },
                    set: function (value) {
                        this._readonly = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Item.prototype._updateFromCanvas = function (property) { };
                Item.prototype._updateToCanvas = function (property) { };
                Item.prototype._getProperties = function () { };
                Item.prototype.propertyChanged = function () { };
                Item.prototype.refresh = function () { };
                //public _clone(): Item { return null; }
                Item.prototype.onError = function (errMsg, className) { };
                Item.prototype._onError = function (errMsg, className) { this.onError(errMsg, className); };
                return Item;
            }());
            Printing.Item = Item;
        })(Printing = SDK.Printing || (SDK.Printing = {}));
    })(SDK = Neodynamic.SDK || (Neodynamic.SDK = {}));
})(Neodynamic || (Neodynamic = {}));
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/// <reference path="item.ts" />
var Neodynamic;
(function (Neodynamic) {
    var SDK;
    (function (SDK) {
        var Printing;
        (function (Printing) {
            var LiteralItem = /** @class */ (function (_super) {
                __extends(LiteralItem, _super);
                function LiteralItem() {
                    var _this = _super.call(this) || this;
                    _this._text = '';
                    var self = _this;
                    _this._guid = Neodynamic.Web.Utils.NamingUtils.newGuid();
                    _this._fabric_item = new fabric.Text("", {
                        //check the unittype
                        thermal_label_object: self,
                        fontFamily: 'Courier New',
                        fontSize: 12,
                        backgroundColor: '#f5f5f5',
                        originX: 'left',
                        originY: 'top',
                        hasControls: false,
                        top: self._y,
                        left: self._x,
                        width: 100,
                        height: 100,
                        lockScalingX: true,
                        lockScalingY: true,
                        lockRotation: true
                    }).on('modified', function (e) {
                        self._updateFromCanvas();
                        self._fabric_item.setCoords();
                    });
                    return _this;
                }
                Object.defineProperty(LiteralItem.prototype, "text", {
                    get: function () {
                        return this._text;
                    },
                    set: function (value) {
                        if (this._readonly)
                            return;
                        this._text = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                LiteralItem.prototype._updateFromCanvas = function (property) {
                    if (property == null) {
                        this._updateFromCanvas('left');
                        this._updateFromCanvas('top');
                        return;
                    }
                    switch (property) {
                        case "left":
                            {
                                this._x = this._fabric_item.left;
                            }
                            break;
                        case "top":
                            {
                                this._y = this._fabric_item.top;
                            }
                            break;
                        default:
                            {
                                this["_" + property] = this._fabric_item[property];
                            }
                            break;
                    }
                };
                LiteralItem.prototype._updateToCanvas = function (property) {
                    if (property == null) {
                        this._updateToCanvas("x");
                        this._updateToCanvas("y");
                        this._updateToCanvas("text");
                        this._updateToCanvas("locked");
                        return;
                    }
                    switch (property) {
                        case "x":
                            {
                                this._fabric_item.left = this._x;
                            }
                            break;
                        case "y":
                            {
                                this._fabric_item.top = this._y;
                            }
                            break;
                        case "locked":
                            {
                                this._fabric_item.lockMovementX = this._locked;
                                this._fabric_item.lockMovementY = this._locked;
                            }
                            break;
                        case "editable":
                            {
                                this._fabric_item.selectable = this._editable;
                            }
                            break;
                        default:
                            {
                                this._fabric_item[property] = this[property];
                            }
                            break;
                        case "text":
                            {
                                this._fabric_item.text = this._text;
                            }
                            break;
                    }
                    this._fabric_item.setCoords();
                };
                LiteralItem.prototype.refresh = function () {
                    this._updateToCanvas();
                    if (this._fabric_item.canvas)
                        this._fabric_item.canvas.renderAll();
                };
                LiteralItem.prototype._getProperties = function () {
                    return {
                        Type: "Literal",
                        Name: this.name,
                        X: this.x,
                        Y: this.y,
                        UnitType: this.unit_type,
                        DataField: this.data_field,
                        DataFieldFormatString: this.data_field_format_string,
                        PrintAsGraphic: this.print_as_graphic,
                        Comments: this.comments,
                        Tag: this.tag,
                        Locked: this.locked,
                        Editable: this.editable,
                        Expression: Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(this.expression),
                        UseCache: this.use_cache,
                        CacheItemId: this.cache_item_id,
                        Visible: this.visible,
                        GroupName: this.group_name,
                        Resizable: this.resizable,
                        ReadOnly: this.read_only,
                        Text: this.text
                    };
                };
                return LiteralItem;
            }(Printing.Item));
            Printing.LiteralItem = LiteralItem;
        })(Printing = SDK.Printing || (SDK.Printing = {}));
    })(SDK = Neodynamic.SDK || (Neodynamic.SDK = {}));
})(Neodynamic || (Neodynamic = {}));
var Neodynamic;
(function (Neodynamic) {
    var SDK;
    (function (SDK) {
        var Printing;
        (function (Printing) {
            var TableRow = /** @class */ (function () {
                function TableRow() {
                    this._height = 0;
                    this._fill_color = Printing.Color.White;
                    this._fill_color_hex = '';
                }
                Object.defineProperty(TableRow.prototype, "height", {
                    get: function () { return this._height; },
                    set: function (value) {
                        this._height = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(TableRow.prototype, "fill_color", {
                    get: function () { return this._fill_color; },
                    set: function (value) {
                        this._fill_color = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(TableRow.prototype, "fill_color_hex", {
                    get: function () { return this._fill_color_hex; },
                    set: function (value) {
                        this._fill_color_hex = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                TableRow.prototype._getProperties = function () {
                    return {
                        Height: this.height,
                        FillColor: this.fill_color,
                        FillColorHex: this.fill_color_hex
                    };
                };
                ;
                return TableRow;
            }());
            Printing.TableRow = TableRow;
        })(Printing = SDK.Printing || (SDK.Printing = {}));
    })(SDK = Neodynamic.SDK || (Neodynamic.SDK = {}));
})(Neodynamic || (Neodynamic = {}));
/// <reference path="item.ts" />
var Neodynamic;
(function (Neodynamic) {
    var SDK;
    (function (SDK) {
        var Printing;
        (function (Printing) {
            var ShapeItem = /** @class */ (function (_super) {
                __extends(ShapeItem, _super);
                function ShapeItem() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    //#region Private Properties
                    _this._width = 96;
                    _this._height = 96;
                    _this._stroke_color = Printing.Color.Black;
                    _this._stroke_thickness = 1;
                    _this._stroke_color_hex = '';
                    //#endregion       
                    _this._stroke_style = Printing.StrokeStyle.Solid;
                    _this._stroke_style_pattern = '';
                    return _this;
                }
                Object.defineProperty(ShapeItem.prototype, "width", {
                    //#endregion
                    //#region Public Properties
                    get: function () {
                        //var real_width = this._width + this._stroke_thickness / 2;
                        //return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(real_width, this._unit_type);
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._width, this._unit_type);
                    },
                    set: function (value) {
                        //var real_width = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        //this._width = real_width - this._stroke_thickness / 2;  
                        this._width = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(ShapeItem.prototype, "height", {
                    get: function () {
                        //var real_height = this._height + this._stroke_thickness / 2;
                        //return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(real_height, this._unit_type);
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._height, this._unit_type);
                    },
                    set: function (value) {
                        //var real_width = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        //this._height = real_width - this._stroke_thickness / 2;
                        this._height = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(ShapeItem.prototype, "stroke_color", {
                    get: function () { return this._stroke_color; },
                    set: function (value) {
                        this._stroke_color = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(ShapeItem.prototype, "stroke_thickness", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._stroke_thickness, this._unit_type);
                    },
                    set: function (value) {
                        //Obtener ancho y alto con thickness anterior
                        //this._width = this._width + (this._stroke_thickness / 2);
                        //this._height = this._height + (this._stroke_thickness / 2);
                        //Setear nuevo thickness
                        this._stroke_thickness = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        //Setear nuevo ancho y alto 
                        //this._width = this._width - (this._stroke_thickness / 2);
                        //this._height = this._height - (this._stroke_thickness / 2);            
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(ShapeItem.prototype, "stroke_color_hex", {
                    get: function () { return this._stroke_color_hex; },
                    set: function (value) {
                        this._stroke_color_hex = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(ShapeItem.prototype, "stroke_style", {
                    get: function () { return this._stroke_style; },
                    set: function (value) {
                        this._stroke_style = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(ShapeItem.prototype, "stroke_style_pattern", {
                    get: function () { return this._stroke_style_pattern; },
                    set: function (value) {
                        this._stroke_style_pattern = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                ShapeItem.prototype.getStrokeStylePattern = function () {
                    var TextUtils = Neodynamic.Web.Utils.TextUtils;
                    var buffer = [];
                    if (TextUtils.isEmpty(this.stroke_style_pattern) == false) {
                        var vals = this.stroke_style_pattern.split('|');
                        for (var i = 0; i < vals.length; i++) {
                            try {
                                var val = parseFloat(vals[i]);
                                buffer.push(Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(val, this._unit_type));
                            }
                            catch (_a) { }
                        }
                    }
                    else {
                        buffer.push(this._stroke_thickness);
                        buffer.push(this._stroke_thickness);
                    }
                    return buffer;
                };
                return ShapeItem;
            }(Printing.Item));
            Printing.ShapeItem = ShapeItem;
        })(Printing = SDK.Printing || (SDK.Printing = {}));
    })(SDK = Neodynamic.SDK || (Neodynamic.SDK = {}));
})(Neodynamic || (Neodynamic = {}));
/// <reference path="shapeitem.ts" />
var Neodynamic;
(function (Neodynamic) {
    var SDK;
    (function (SDK) {
        var Printing;
        (function (Printing) {
            var ClosedShapeItem = /** @class */ (function (_super) {
                __extends(ClosedShapeItem, _super);
                function ClosedShapeItem() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this._fill_color = Printing.Color.White;
                    _this._fill_color_hex = '';
                    return _this;
                }
                Object.defineProperty(ClosedShapeItem.prototype, "fill_color", {
                    get: function () { return this._fill_color; },
                    set: function (value) {
                        this._fill_color = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(ClosedShapeItem.prototype, "fill_color_hex", {
                    get: function () { return this._fill_color_hex; },
                    set: function (value) {
                        this._fill_color_hex = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                return ClosedShapeItem;
            }(Printing.ShapeItem));
            Printing.ClosedShapeItem = ClosedShapeItem;
        })(Printing = SDK.Printing || (SDK.Printing = {}));
    })(SDK = Neodynamic.SDK || (Neodynamic.SDK = {}));
})(Neodynamic || (Neodynamic = {}));
/// <reference path="closedshapeitem.ts" />
var Neodynamic;
(function (Neodynamic) {
    var SDK;
    (function (SDK) {
        var Printing;
        (function (Printing) {
            var TableShapeItem = /** @class */ (function (_super) {
                __extends(TableShapeItem, _super);
                function TableShapeItem() {
                    var _this = _super.call(this) || this;
                    //#region Private Properties
                    _this._corner_radius = new Printing.RectangleCornerRadius();
                    _this._rotation_angle = 0;
                    _this._columns_line_visible = true;
                    _this._rows_line_visible = true;
                    /*  Booleano si tiene que recargar la imagen    */
                    _this._has_to_reload = false;
                    /*  Imagen contenedora del BC   */
                    _this._image_item = new Image();
                    //#endregion
                    //#region Public Properties
                    _this.columns = [];
                    _this.rows = [];
                    var self = _this;
                    _this._guid = Neodynamic.Web.Utils.NamingUtils.newGuid();
                    _this._image_item.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
                    _this._image_item.onload = function () {
                        if (self._fabric_item.canvas)
                            self._fabric_item.canvas.renderAll();
                    };
                    _this._fabric_item = new fabric.Image(self._image_item, {
                        //check the unittype
                        thermal_label_object: self,
                        originX: 'left',
                        originY: 'top',
                        top: self._y,
                        left: self._x,
                        width: 1,
                        height: 1,
                        stroke: '#dadada',
                        strokeWidth: 1,
                        angle: self._rotation_angle
                    }).on('modified', function (e) {
                        self._updateFromCanvas();
                        self._fabric_item.setCoords();
                        /*if (self._has_to_reload) {
                            self.refresh();
                        } */
                    }).on('scaling', function () {
                        self._has_to_reload = true;
                    }).on('mouseup', function (e) {
                        self._updateFromCanvas();
                        self._fabric_item.setCoords();
                        if (self._has_to_reload) {
                            self.refresh();
                        }
                    });
                    return _this;
                }
                Object.defineProperty(TableShapeItem.prototype, "rotation_angle", {
                    get: function () { return this._rotation_angle; },
                    set: function (value) {
                        this._rotation_angle = Math.round(value / 90) * 90;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(TableShapeItem.prototype, "corner_radius", {
                    get: function () { return this._corner_radius; },
                    set: function (value) {
                        this._corner_radius = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(TableShapeItem.prototype, "columns_line_visible", {
                    get: function () { return this._columns_line_visible; },
                    set: function (value) {
                        this._columns_line_visible = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(TableShapeItem.prototype, "rows_line_visible", {
                    get: function () { return this._rows_line_visible; },
                    set: function (value) {
                        this._rows_line_visible = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                //#endregion
                TableShapeItem.prototype._getProperties = function () {
                    var c = [];
                    for (var i = 0; i < this.columns.length; i++) {
                        c.push(this.columns[i]._getProperties());
                    }
                    var r = [];
                    for (var i = 0; i < this.rows.length; i++) {
                        r.push(this.rows[i]._getProperties());
                    }
                    return {
                        Type: "Table",
                        UnitType: this.unit_type,
                        X: this.x,
                        Y: this.y,
                        Width: this.width,
                        Height: this.height,
                        //Dpi: 96,
                        Dpi: 96 * (this._fabric_item.scaleX || 1),
                        CornerRadius_BottomLeft: this.corner_radius.bottom_left,
                        CornerRadius_BottomRight: this.corner_radius.bottom_right,
                        CornerRadius_TopLeft: this.corner_radius.top_left,
                        CornerRadius_TopRight: this.corner_radius.top_right,
                        RotationAngle: this.rotation_angle,
                        FillColor: this.fill_color,
                        StrokeThickness: this.stroke_thickness,
                        StrokeColor: this.stroke_color,
                        FillColorHex: this.fill_color_hex,
                        StrokeColorHex: this.stroke_color_hex,
                        StrokeStyle: this.stroke_style,
                        StrokeStylePattern: this.stroke_style_pattern,
                        ColumnsLineVisible: this.columns_line_visible,
                        RowsLineVisible: this.rows_line_visible,
                        Columns: c,
                        Rows: r,
                        Comments: this.comments,
                        DataField: this.data_field,
                        DataFieldFormatString: this.data_field_format_string,
                        Name: this.name,
                        PrintAsGraphic: this.print_as_graphic,
                        Tag: this.tag,
                        Locked: this.locked,
                        Editable: this.editable,
                        Expression: Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(this.expression),
                        UseCache: this.use_cache,
                        CacheItemId: this.cache_item_id,
                        Visible: this.visible,
                        GroupName: this.group_name,
                        Resizable: this.resizable,
                        ReadOnly: this.read_only
                    };
                };
                ;
                TableShapeItem.prototype._updateFromCanvas = function () {
                    if (this._width != this._fabric_item.width || this._height != this._fabric_item.height)
                        this._has_to_reload = true;
                    var MathUtils = Neodynamic.Web.Utils.MathUtils;
                    this._fabric_item.angle = Math.round(this._fabric_item.angle / 90) * 90;
                    this._rotation_angle = (this._fabric_item.angle >= 360) ? 360 - this._fabric_item.angle : this._fabric_item.angle;
                    this._width = this._fabric_item.width;
                    this._height = this._fabric_item.height;
                    if (this._fabric_item.angle == 0) {
                        this._x = this._fabric_item.left / this._fabric_item.scaleX;
                        this._y = this._fabric_item.top / this._fabric_item.scaleY;
                    }
                    else {
                        var boundRect = this._fabric_item.getBoundingRect();
                        this._x = boundRect.left / this._fabric_item.scaleX;
                        this._y = boundRect.top / this._fabric_item.scaleY;
                    }
                };
                ;
                TableShapeItem.prototype._updateToCanvas = function () {
                    this._fabric_item.selectable = this._fabric_item.evented = this._editable;
                    this._fabric_item.lockMovementX = this._locked;
                    this._fabric_item.lockMovementY = this._locked;
                    this._fabric_item.lockScalingX = this._locked || !this.resizable;
                    this._fabric_item.lockScalingY = this._locked || !this.resizable;
                    this._fabric_item.lockRotation = this._locked;
                    this._fabric_item.angle = this._rotation_angle;
                    this._rotation_angle = Math.round(this._rotation_angle / 90) * 90;
                    this._rotation_angle = (this._rotation_angle >= 360) ? 360 - this._rotation_angle : this._rotation_angle;
                    this._fabric_item.angle = this._rotation_angle;
                    var MathUtils = Neodynamic.Web.Utils.MathUtils;
                    var rect = MathUtils.calcOuterRectOfRotatedRect(0, 0, this._width, this._height, this._fabric_item.angle);
                    if (this._rotation_angle == 0 || this._rotation_angle == 360) {
                        this._fabric_item.left = this._x * this._fabric_item.scaleX;
                        this._fabric_item.top = this._y * this._fabric_item.scaleY;
                    }
                    else {
                        if (this._rotation_angle == 90) {
                            this._fabric_item.left = (this._x + this._height) * this._fabric_item.scaleX;
                            this._fabric_item.top = this._y * this._fabric_item.scaleY;
                        }
                        else if (this._rotation_angle == 180) {
                            this._fabric_item.left = (this._x + this._width) * this._fabric_item.scaleX;
                            this._fabric_item.top = (this._y + this._height) * this._fabric_item.scaleY;
                        }
                        else if (this._rotation_angle == 270) {
                            this._fabric_item.left = this._x * this._fabric_item.scaleX;
                            this._fabric_item.top = (this._y + this._width) * this._fabric_item.scaleY;
                        }
                    }
                    this._fabric_item.width = this._width;
                    this._fabric_item.height = this._height;
                    this._fabric_item.setCoords();
                };
                ;
                TableShapeItem.prototype.refresh = function () {
                    var _this = this;
                    this._updateToCanvas();
                    //var error_message = "";
                    var rootUrl = $(location).attr('protocol') + "//" + $(location).attr('host');
                    var TLE = Neodynamic.Web.Editor.ThermalLabelEditor;
                    if (TLE.websiteRootAbsoluteUrl)
                        rootUrl = TLE.websiteRootAbsoluteUrl;
                    this._fabric_item.dpi = 96 * (this._fabric_item.scaleX || 1);
                    $.ajax({
                        url: rootUrl + "/" + TLE.thermalLabelWebEditorControllerName + "?_=" + new Date().getTime(),
                        type: "POST",
                        data: { Action: "Render", Type: "Table", Properties: JSON.stringify(this._getProperties()) },
                        async: true
                    }).
                        done(function (data) {
                        if (data.startsWith("ERROR")) {
                            _this._fabric_item.dpi = -1; // force fitting the error image to the fabric.Image obj
                            _this._image_item.src = _this._missing_image;
                            _super.prototype._onError.call(_this, data, "TableShapeItem");
                        }
                        else {
                            _this._image_item.src = data;
                            _this._has_to_reload = false;
                        }
                        //if (this._fabric_item.canvas)
                        //    this._fabric_item.canvas.renderAll();
                    }).
                        fail(function (data) {
                        _this._fabric_item.dpi = -1; // force fitting the error image to the fabric.Image obj
                        _this._image_item.src = _this._missing_image;
                        //if (this._fabric_item.canvas)
                        //    this._fabric_item.canvas.renderAll();
                        //error_message = "Error when loading image: " + data.responseText;                   
                        _super.prototype._onError.call(_this, data.responseText, "TableShapeItem");
                    });
                    //if (error_message)
                    //    this._onError(error_message, typeof(this));
                };
                ;
                ;
                return TableShapeItem;
            }(Printing.ClosedShapeItem));
            Printing.TableShapeItem = TableShapeItem;
        })(Printing = SDK.Printing || (SDK.Printing = {}));
    })(SDK = Neodynamic.SDK || (Neodynamic.SDK = {}));
})(Neodynamic || (Neodynamic = {}));
/// <reference path="item.ts" />
var Neodynamic;
(function (Neodynamic) {
    var SDK;
    (function (SDK) {
        var Printing;
        (function (Printing) {
            var BarcodeItem = /** @class */ (function (_super) {
                __extends(BarcodeItem, _super);
                function BarcodeItem() {
                    var _this = _super.call(this) || this;
                    //#region Private Properties
                    _this._add_checksum = true;
                    _this._aztec_code_byte_encoding_name = "ISO-8859-1";
                    _this._aztec_code_error_correction = 23;
                    _this._aztec_code_format = Printing.AztecCodeFormat.Auto;
                    _this._aztec_code_module_size = 4.0032;
                    _this._aztec_code_process_tilde = false;
                    _this._aztec_code_rune = -1;
                    _this._back_color = Printing.Color.White;
                    _this._barcode_alignment = Printing.BarcodeAlignment.TopLeft;
                    _this._barcode_padding = new Printing.FrameThickness();
                    _this._bar_color = Printing.Color.Black;
                    _this._bar_height = 48;
                    _this._bar_ratio = 2;
                    _this._bar_width = 0.9984;
                    _this._bar_width_adjustment = 0;
                    _this._bearer_bar_style = Printing.BearerBarStyle.None;
                    _this._bearer_bar_thickness = 4.8;
                    _this._border_color = Printing.Color.Black;
                    _this._border_thickness = new Printing.FrameThickness();
                    _this._codabar_start_char = Printing.CodabarStartStopChar.A;
                    _this._codabar_stop_char = Printing.CodabarStartStopChar.A;
                    _this._code = '1234567890';
                    _this._code128_charset = Printing.Code128.Auto;
                    _this._code16k_mode = Printing.Code16K.Mode1;
                    _this._code39_full_ascii_mode = true;
                    _this._code93_full_ascii_mode = true;
                    _this._code_alignment = Printing.BarcodeTextAlignment.BelowCenter;
                    _this._code_format_pattern = '';
                    _this._corner_radius = new Printing.RectangleCornerRadius();
                    _this._counter_step = 0;
                    _this._counter_using_leading_zeros = false;
                    _this._data_matrix_byte_encoding_name = 'ISO-8859-1';
                    _this._data_matrix_encoding = Printing.DataMatrixEncoding.Auto;
                    _this._data_matrix_file_id = '001001';
                    _this._data_matrix_format = Printing.DataMatrixFormat.Auto;
                    _this._data_matrix_module_size = 4.0032;
                    _this._data_matrix_process_tilde = false;
                    _this._data_matrix_symbol_count = 1;
                    _this._data_matrix_symbol_index = 1;
                    _this._display_checksum = true;
                    _this._display_code = true;
                    _this._display_start_stop_char = true;
                    _this._ean_upc_display_light_margin_indicator = false;
                    _this._ean_upc_guard_bar = true;
                    _this._ean_upc_guard_bar_height = 52.8;
                    _this._ean_upc_magnification_factor = 0;
                    _this._ean_upc_supplement = Printing.Supplement.None;
                    _this._ean_upc_supplement_code = '0';
                    _this._ean_upc_supplement_separation = 14.4;
                    _this._ean_upc_supplement_top_margin = 14.4;
                    _this._error_behavior = Printing.BarcodeErrorBehavior.BlankImage;
                    _this._font = new Printing.Font();
                    _this._fore_color = Printing.Color.Black;
                    _this._han_xin_code_byte_encoding_name = "ISO-8859-1";
                    _this._han_xin_code_encoding = Printing.HanXinCodeEncoding.Auto;
                    _this._han_xin_code_error_correction_level = Printing.HanXinCodeErrorCorrectionLevel.L1;
                    _this._han_xin_code_module_size = 4.0032;
                    _this._han_xin_code_process_tilde = false;
                    _this._han_xin_code_version = Printing.HanXinCodeVersion.Auto;
                    _this._height = 48;
                    _this._hibc_format_human_readable_text = true;
                    _this._hibc_use_iso_iec_15434_encoding = false;
                    _this._hide_if_empty = false;
                    _this._human_readable_text = '';
                    _this._isbt_128_data_structure = Printing.Isbt128DataStructure.DS001;
                    _this._itf14_left_h_mark = Printing.ItfHmark.None;
                    _this._itf14_right_h_mark = Printing.ItfHmark.None;
                    _this._mask = '';
                    _this._mask_increment = '';
                    _this._maxi_code_mode = Printing.MaxiCodeModes.Mode4;
                    _this._maxi_code_process_tilde = false;
                    _this._maxi_code_symbol_count = 1;
                    _this._maxi_code_symbol_index = 1;
                    _this._micropdf417_version = Printing.MicroPdf417Version.Auto;
                    _this._microqr_code_version = Printing.MicroQRCodeVersion.Auto;
                    _this._msi_checksum = Printing.MsiChecksum.OneMod10;
                    _this._pdf417_aspect_ratio = 0;
                    _this._pdf417_byte_encoding_name = 'ISO-8859-1';
                    _this._pdf417_columns = 0;
                    _this._pdf417_compaction_type = Printing.Pdf417CompactionType.Auto;
                    _this._pdf417_error_correction_level = Printing.Pdf417ErrorCorrection.Level2;
                    _this._pdf417_file_id = '000';
                    _this._pdf417_rows = 0;
                    _this._pdf417_segment_count = 0;
                    _this._pdf417_segment_index = 0;
                    _this._pdf417_truncated = false;
                    _this._pdf417_process_tilde = false;
                    _this._pharmacode_bars_spacing = 4.0032;
                    _this._pharmacode_thick_bar_width = 6;
                    _this._pharmacode_thin_bar_width = 1.9968;
                    _this._planet_height_short_bar = 9.6;
                    _this._planet_height_tall_bar = 19.2;
                    _this._postal_4_state_add_start_stop_char = true;
                    _this._postal_4_state_bars_spacing = 3.0048;
                    _this._postal_4_state_tracker_bar_height = 7.68;
                    _this._postal_4_state_tracker_bar_width = 1.9968;
                    _this._postnet_height_short_bar = 9.6;
                    _this._postnet_height_tall_bar = 19.2;
                    _this._qr_code_byte_encoding_name = 'ISO-8859-1';
                    _this._qr_code_encoding = Printing.QRCodeEncoding.Auto;
                    _this._qr_code_error_correction_level = Printing.QRCodeErrorCorrectionLevel.M;
                    _this._qr_code_module_size = 4.0032;
                    _this._qr_code_process_tilde = false;
                    _this._qr_code_version = Printing.QRCodeVersion.Auto;
                    _this._quiet_zone = new Printing.FrameThickness(9.6, 0, 9.6, 1.92);
                    _this._rotation_angle = 0;
                    _this._segments_per_row = 4;
                    _this._sizing = Printing.BarcodeSizing.None;
                    _this._symbology = Printing.BarcodeSymbology.Code39;
                    _this._telepen_encoding = Printing.TelepenEncoding.Ascii;
                    _this._text = '';
                    _this._text_alignment = Printing.BarcodeTextAlignment.AboveCenter;
                    _this._text_font = new Printing.Font();
                    _this._text_fore_color = Printing.Color.Black;
                    _this._text_format_pattern = '';
                    _this._upce_system = Printing.UpcE.System0;
                    _this._use_quiet_zone_for_text = false;
                    _this._usps_fim_pattern = Printing.FIM.A;
                    _this._usps_horizontal_bars_count = 10;
                    _this._width = 96;
                    _this._gs1_data_strict_validation = false;
                    _this._maxi_code_draw_pixel_based_symbol = true;
                    _this._dot_code_columns = 0;
                    _this._dot_code_module_size = 4.0032;
                    _this._dot_code_process_tilde = false;
                    _this._dot_code_rows = 0;
                    _this._dot_code_aspect_ratio = '';
                    _this._dot_code_module_shape = Printing.DotCodeModuleShape.Circle;
                    _this._data_matrix_include_rect_formats_in_auto_mode = false;
                    _this._back_color_hex = '';
                    _this._border_color_hex = '';
                    _this._bar_color_hex = '';
                    _this._fore_color_hex = '';
                    _this._text_fore_color_hex = '';
                    _this._code11_two_digits_checksum = false;
                    _this._tlc39_micro_pdf417_bar_width = 1;
                    _this._tlc39_micro_pdf417_row_bar_height = 3;
                    _this._right_to_left = false;
                    _this._rect_microqr_code_version = Printing.RectMicroQRCodeVersion.Auto;
                    _this._print_as_resident_element = false;
                    _this._qr_code_mask = Printing.QRCodeMask.Auto;
                    _this._code_encoding = Printing.CodeEncoding.Text;
                    /*  Booleano si tiene que recargar la imagen    */
                    _this._has_to_reload = false;
                    /*  Imagen contenedora del BC   */
                    _this._image_item = new Image();
                    var self = _this;
                    _this._guid = Neodynamic.Web.Utils.NamingUtils.newGuid();
                    _this._image_item.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
                    _this._image_item.onload = function () {
                        //self._fabric_item.width = this.width;
                        //self._fabric_item.height = this.height;
                        //self._width = this.width;
                        //self._height = this.height;
                        //if (self._fabric_item.dpi != -1)
                        //    self._fabric_item.dpi = 96 * (self._fabric_item.scaleX || 1);
                        var curBcWidth = self._width;
                        var curBcHeight = self._height;
                        if (self._sizing == Printing.BarcodeSizing.AutoSize) {
                            self._updateFromCanvas();
                            // reset auto size barcode image...
                            var bcAutoSizeW = self._image_item.width;
                            var bcAutoSizeH = self._image_item.height;
                            self._width = bcAutoSizeW;
                            self._height = bcAutoSizeH;
                            // reset X, Y depending on the barcode alignment
                            var diffX = 0;
                            var diffY = 0;
                            if (self.barcode_alignment == SDK.Printing.BarcodeAlignment.MiddleCenter) {
                                diffX = (curBcWidth - bcAutoSizeW) / 2;
                                diffY = (curBcHeight - bcAutoSizeH) / 2;
                            }
                            else if (self.barcode_alignment == SDK.Printing.BarcodeAlignment.MiddleLeft) {
                                diffX = 0;
                                diffY = (curBcHeight - bcAutoSizeH) / 2;
                                if (self.rotation_angle == 270 || self.rotation_angle == 180) {
                                    diffX = (curBcWidth - bcAutoSizeW);
                                }
                            }
                            else if (self.barcode_alignment == SDK.Printing.BarcodeAlignment.MiddleRight) {
                                diffX = (curBcWidth - bcAutoSizeW);
                                diffY = (curBcHeight - bcAutoSizeH) / 2;
                                if (self.rotation_angle == 270 || self.rotation_angle == 180) {
                                    diffX = 0;
                                }
                            }
                            else if (self.barcode_alignment == SDK.Printing.BarcodeAlignment.TopCenter) {
                                diffX = (curBcWidth - bcAutoSizeW) / 2;
                                diffY = 0;
                                if (self.rotation_angle == 90 || self.rotation_angle == 180)
                                    diffY = (curBcHeight - bcAutoSizeH);
                            }
                            else if (self.barcode_alignment == SDK.Printing.BarcodeAlignment.TopLeft) {
                                if (self.rotation_angle == 90) {
                                    diffY = (curBcHeight - bcAutoSizeH);
                                }
                                else if (self.rotation_angle == 180) {
                                    diffX = (curBcWidth - bcAutoSizeW);
                                    diffY = (curBcHeight - bcAutoSizeH);
                                }
                                else if (self.rotation_angle == 270) {
                                    diffX = (curBcWidth - bcAutoSizeW);
                                }
                            }
                            else if (self.barcode_alignment == SDK.Printing.BarcodeAlignment.TopRight) {
                                if (self.rotation_angle == 90) {
                                    diffY = (curBcHeight - bcAutoSizeH);
                                    diffX = (curBcWidth - bcAutoSizeW);
                                }
                                else if (self.rotation_angle == 180) {
                                    diffY = (curBcHeight - bcAutoSizeH);
                                }
                                else if (self.rotation_angle == 270) {
                                    //diffY = (curBcHeight - bcAutoSizeH);
                                    //diffX = (curBcWidth - bcAutoSizeW);
                                }
                                else {
                                    diffX = (curBcWidth - bcAutoSizeW);
                                }
                            }
                            else if (self.barcode_alignment == SDK.Printing.BarcodeAlignment.BottomCenter) {
                                if (self.rotation_angle == 180) {
                                    diffX = (curBcWidth - bcAutoSizeW) / 2;
                                }
                                else if (self.rotation_angle == 90) {
                                    diffX = (curBcWidth - bcAutoSizeW) / 2;
                                }
                                else {
                                    diffX = (curBcWidth - bcAutoSizeW) / 2;
                                    diffY = (curBcHeight - bcAutoSizeH);
                                }
                            }
                            else if (self.barcode_alignment == SDK.Printing.BarcodeAlignment.BottomLeft) {
                                if (self.rotation_angle == 90) {
                                }
                                else if (self.rotation_angle == 180) {
                                    diffX = (curBcWidth - bcAutoSizeW);
                                }
                                else if (self.rotation_angle == 270) {
                                    diffX = (curBcWidth - bcAutoSizeW);
                                    diffY = (curBcHeight - bcAutoSizeH);
                                }
                                else if (self.rotation_angle == 0) {
                                    diffY = (curBcHeight - bcAutoSizeH);
                                }
                            }
                            else if (self.barcode_alignment == SDK.Printing.BarcodeAlignment.BottomRight) {
                                if (self.rotation_angle == 90) {
                                    diffX = (curBcWidth - bcAutoSizeW);
                                }
                                else if (self.rotation_angle == 180) {
                                }
                                else if (self.rotation_angle == 270) {
                                    diffY = (curBcHeight - bcAutoSizeH);
                                }
                                else {
                                    diffX = (curBcWidth - bcAutoSizeW);
                                    diffY = (curBcHeight - bcAutoSizeH);
                                }
                            }
                            self._x += (self.rotation_angle == 0 || self.rotation_angle == 180) ? diffX : diffY;
                            self._y += (self.rotation_angle == 0 || self.rotation_angle == 180) ? diffY : diffX;
                            self._updateToCanvas();
                        }
                        if (self._fabric_item.canvas)
                            self._fabric_item.canvas.renderAll();
                    };
                    _this._fabric_item = new fabric.Image(self._image_item, {
                        //check the unittype
                        thermal_label_object: self,
                        originX: 'left',
                        originY: 'top',
                        top: self._y,
                        left: self._x,
                        width: 1,
                        height: 1,
                        stroke: '#dadada',
                        strokeWidth: 1,
                        angle: self._rotation_angle
                    }).on('modified', function (e) {
                        self._updateFromCanvas();
                        self._fabric_item.setCoords();
                        /*if (self._has_to_reload) {
                            self.refresh();
                        } */
                    }).on('scaling', function () {
                        self._has_to_reload = true;
                    }).on('mouseup', function (e) {
                        self._updateFromCanvas();
                        self._fabric_item.setCoords();
                        if (self._has_to_reload) {
                            self.refresh();
                        }
                    });
                    return _this;
                }
                Object.defineProperty(BarcodeItem.prototype, "add_checksum", {
                    //#endregion
                    //#region Public Properties
                    get: function () { return this._add_checksum; },
                    set: function (value) {
                        this._add_checksum = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "aztec_code_byte_encoding_name", {
                    get: function () { return this._aztec_code_byte_encoding_name; },
                    set: function (value) {
                        this._aztec_code_byte_encoding_name = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "aztec_code_error_correction", {
                    get: function () { return this._aztec_code_error_correction; },
                    set: function (value) {
                        this._aztec_code_error_correction = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "aztec_code_format", {
                    get: function () { return this._aztec_code_format; },
                    set: function (value) {
                        this._aztec_code_format = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "aztec_code_module_size", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._aztec_code_module_size, this._unit_type);
                    },
                    set: function (value) {
                        //if (value < 0 )
                        //    this._onError('Invalid value for aztec_code_module_size', typeof (this));             
                        this._aztec_code_module_size = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "aztec_code_process_tilde", {
                    get: function () { return this._aztec_code_process_tilde; },
                    set: function (value) {
                        this._aztec_code_process_tilde = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "aztec_code_rune", {
                    get: function () { return this._aztec_code_rune; },
                    set: function (value) {
                        this._aztec_code_rune = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "back_color", {
                    get: function () { return this._back_color; },
                    set: function (value) {
                        this._back_color = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "barcode_alignment", {
                    get: function () { return this._barcode_alignment; },
                    set: function (value) {
                        this._barcode_alignment = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "barcode_padding", {
                    get: function () {
                        var toRet = new Printing.FrameThickness();
                        toRet.bottom = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._barcode_padding.bottom, this._unit_type);
                        toRet.right = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._barcode_padding.right, this._unit_type);
                        toRet.left = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._barcode_padding.left, this._unit_type);
                        toRet.top = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._barcode_padding.top, this._unit_type);
                        return toRet;
                    },
                    set: function (value) {
                        this._barcode_padding.top = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value.top, this._unit_type);
                        this._barcode_padding.left = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value.left, this._unit_type);
                        this._barcode_padding.right = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value.right, this._unit_type);
                        this._barcode_padding.bottom = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value.bottom, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(BarcodeItem.prototype, "bar_color", {
                    get: function () { return this._bar_color; },
                    set: function (value) {
                        this._bar_color = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "bar_height", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._bar_height, this._unit_type);
                    },
                    set: function (value) {
                        this._bar_height = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "bar_ratio", {
                    get: function () { return this._bar_ratio; },
                    set: function (value) {
                        this._bar_ratio = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "bar_width", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._bar_width, this._unit_type);
                    },
                    set: function (value) {
                        this._bar_width = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "bar_width_adjustment", {
                    get: function () { return this._bar_width_adjustment; },
                    set: function (value) {
                        this._bar_width_adjustment = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "bearer_bar_style", {
                    get: function () { return this._bearer_bar_style; },
                    set: function (value) {
                        this._bearer_bar_style = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "bearer_bar_thickness", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._bearer_bar_thickness, this._unit_type);
                    },
                    set: function (value) {
                        this._bearer_bar_thickness = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "border_color", {
                    get: function () { return this._border_color; },
                    set: function (value) {
                        this._border_color = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "border_thickness", {
                    get: function () { return this._border_thickness; },
                    set: function (value) {
                        this._border_thickness = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "codabar_start_char", {
                    get: function () { return this._codabar_start_char; },
                    set: function (value) {
                        this._codabar_start_char = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "codabar_stop_char", {
                    get: function () { return this._codabar_stop_char; },
                    set: function (value) {
                        this._codabar_stop_char = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "code", {
                    get: function () { return this._code; },
                    set: function (value) {
                        if (this._readonly)
                            return;
                        this._code = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "code128_charset", {
                    get: function () { return this._code128_charset; },
                    set: function (value) {
                        this._code128_charset = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "code16k_mode", {
                    get: function () { return this._code16k_mode; },
                    set: function (value) {
                        this._code16k_mode = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "code39_full_ascii_mode", {
                    get: function () { return this._code39_full_ascii_mode; },
                    set: function (value) {
                        this._code39_full_ascii_mode = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "code93_full_ascii_mode", {
                    get: function () { return this._code93_full_ascii_mode; },
                    set: function (value) {
                        this._code93_full_ascii_mode = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "code_alignment", {
                    get: function () { return this._code_alignment; },
                    set: function (value) {
                        this._code_alignment = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "code_format_pattern", {
                    get: function () { return this._code_format_pattern; },
                    set: function (value) {
                        this._code_format_pattern = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "corner_radius", {
                    get: function () { return this._corner_radius; },
                    set: function (value) {
                        this._corner_radius = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "counter_step", {
                    get: function () { return this._counter_step; },
                    set: function (value) {
                        this._counter_step = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "counter_using_leading_zeros", {
                    get: function () { return this._counter_using_leading_zeros; },
                    set: function (value) {
                        this._counter_using_leading_zeros = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "data_matrix_byte_encoding_name", {
                    get: function () { return this._data_matrix_byte_encoding_name; },
                    set: function (value) {
                        this._data_matrix_byte_encoding_name = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "data_matrix_encoding", {
                    get: function () { return this._data_matrix_encoding; },
                    set: function (value) {
                        this._data_matrix_encoding = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "data_matrix_file_id", {
                    get: function () { return this._data_matrix_file_id; },
                    set: function (value) {
                        this._data_matrix_file_id = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "data_matrix_format", {
                    get: function () { return this._data_matrix_format; },
                    set: function (value) {
                        this._data_matrix_format = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "data_matrix_module_size", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._data_matrix_module_size, this._unit_type);
                    },
                    set: function (value) {
                        //if (value < 0)
                        //    this._onError('Invalid value for data_matrix_module_size', typeof (this));
                        this._data_matrix_module_size = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "data_matrix_process_tilde", {
                    get: function () { return this._data_matrix_process_tilde; },
                    set: function (value) {
                        this._data_matrix_process_tilde = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "data_matrix_symbol_count", {
                    get: function () { return this._data_matrix_symbol_count; },
                    set: function (value) {
                        this._data_matrix_symbol_count = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "data_matrix_symbol_index", {
                    get: function () { return this._data_matrix_symbol_index; },
                    set: function (value) {
                        this._data_matrix_symbol_index = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "display_checksum", {
                    get: function () { return this._display_checksum; },
                    set: function (value) {
                        this._display_checksum = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "display_code", {
                    get: function () { return this._display_code; },
                    set: function (value) {
                        this._display_code = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "display_start_stop_char", {
                    get: function () { return this._display_start_stop_char; },
                    set: function (value) {
                        this._display_start_stop_char = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "ean_upc_display_light_margin_indicator", {
                    get: function () { return this._ean_upc_display_light_margin_indicator; },
                    set: function (value) {
                        this._ean_upc_display_light_margin_indicator = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "ean_upc_guard_bar", {
                    get: function () { return this._ean_upc_guard_bar; },
                    set: function (value) {
                        this._ean_upc_guard_bar = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "ean_upc_guard_bar_height", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._ean_upc_guard_bar_height, this._unit_type);
                    },
                    set: function (value) {
                        this._ean_upc_guard_bar_height = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "ean_upc_magnification_factor", {
                    get: function () { return this._ean_upc_magnification_factor; },
                    set: function (value) {
                        this._ean_upc_magnification_factor = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "ean_upc_supplement", {
                    get: function () { return this._ean_upc_supplement; },
                    set: function (value) {
                        this._ean_upc_supplement = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "ean_upc_supplement_code", {
                    get: function () { return this._ean_upc_supplement_code; },
                    set: function (value) {
                        if (this._readonly)
                            return;
                        this._ean_upc_supplement_code = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "ean_upc_supplement_separation", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._ean_upc_supplement_separation, this._unit_type);
                    },
                    set: function (value) {
                        this._ean_upc_supplement_separation = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "ean_upc_supplement_top_margin", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._ean_upc_supplement_top_margin, this._unit_type);
                    },
                    set: function (value) {
                        this._ean_upc_supplement_top_margin = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "error_behavior", {
                    get: function () { return this._error_behavior; },
                    set: function (value) {
                        this._error_behavior = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "font", {
                    get: function () { return this._font; },
                    set: function (value) {
                        this._font = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "fore_color", {
                    get: function () { return this._fore_color; },
                    set: function (value) {
                        this._fore_color = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "han_xin_code_byte_encoding_name", {
                    get: function () { return this._han_xin_code_byte_encoding_name; },
                    set: function (value) {
                        this._han_xin_code_byte_encoding_name = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "han_xin_code_encoding", {
                    get: function () { return this._han_xin_code_encoding; },
                    set: function (value) {
                        this._han_xin_code_encoding = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "han_xin_code_error_correction_level", {
                    get: function () { return this._han_xin_code_error_correction_level; },
                    set: function (value) {
                        this._han_xin_code_error_correction_level = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "han_xin_code_module_size", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._han_xin_code_module_size, this._unit_type);
                    },
                    set: function (value) {
                        //if (value < 0)
                        //    this._onError('Invalid value for han_xin_code_module_size', typeof (this));
                        this._han_xin_code_module_size = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "han_xin_code_process_tilde", {
                    get: function () { return this._han_xin_code_process_tilde; },
                    set: function (value) {
                        this._han_xin_code_process_tilde = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "han_xin_code_version", {
                    get: function () { return this._han_xin_code_version; },
                    set: function (value) {
                        this._han_xin_code_version = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "height", {
                    get: function () { return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._height, this._unit_type); },
                    set: function (value) {
                        this._height = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this._updateToCanvas();
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "hibc_format_human_readable_text", {
                    get: function () { return this._hibc_format_human_readable_text; },
                    set: function (value) {
                        this._hibc_format_human_readable_text = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "hibc_use_iso_iec_15434_encoding", {
                    get: function () { return this._hibc_use_iso_iec_15434_encoding; },
                    set: function (value) {
                        this._hibc_use_iso_iec_15434_encoding = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "hide_if_empty", {
                    get: function () { return this._hide_if_empty; },
                    set: function (value) {
                        this._hide_if_empty = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "human_readable_text", {
                    get: function () { return this._human_readable_text; },
                    set: function (value) {
                        if (this._readonly)
                            return;
                        this._human_readable_text = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "isbt_128_data_structure", {
                    get: function () { return this._isbt_128_data_structure; },
                    set: function (value) {
                        this._isbt_128_data_structure = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "itf14_left_h_mark", {
                    get: function () { return this._itf14_left_h_mark; },
                    set: function (value) {
                        this._itf14_left_h_mark = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "itf14_right_h_mark", {
                    get: function () { return this._itf14_right_h_mark; },
                    set: function (value) {
                        this._itf14_right_h_mark = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "mask", {
                    get: function () { return this._mask; },
                    set: function (value) {
                        this._mask = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "mask_increment", {
                    get: function () { return this._mask_increment; },
                    set: function (value) {
                        this._mask_increment = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "maxi_code_mode", {
                    get: function () { return this._maxi_code_mode; },
                    set: function (value) {
                        this._maxi_code_mode = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "maxi_code_process_tilde", {
                    get: function () { return this._maxi_code_process_tilde; },
                    set: function (value) {
                        this._maxi_code_process_tilde = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "maxi_code_symbol_count", {
                    get: function () { return this._maxi_code_symbol_count; },
                    set: function (value) {
                        this._maxi_code_symbol_count = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "maxi_code_symbol_index", {
                    get: function () { return this._maxi_code_symbol_index; },
                    set: function (value) {
                        this._maxi_code_symbol_index = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "micropdf417_version", {
                    get: function () { return this._micropdf417_version; },
                    set: function (value) {
                        this._micropdf417_version = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "microqr_code_version", {
                    get: function () { return this._microqr_code_version; },
                    set: function (value) {
                        this._microqr_code_version = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "msi_checksum", {
                    get: function () { return this._msi_checksum; },
                    set: function (value) {
                        this._msi_checksum = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "pdf417_aspect_ratio", {
                    get: function () { return this._pdf417_aspect_ratio; },
                    set: function (value) {
                        this._pdf417_aspect_ratio = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "pdf417_byte_encoding_name", {
                    get: function () { return this._pdf417_byte_encoding_name; },
                    set: function (value) {
                        this._pdf417_byte_encoding_name = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "pdf417_columns", {
                    get: function () { return this._pdf417_columns; },
                    set: function (value) {
                        this._pdf417_columns = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "pdf417_compaction_type", {
                    get: function () { return this._pdf417_compaction_type; },
                    set: function (value) {
                        this._pdf417_compaction_type = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "pdf417_error_correction_level", {
                    get: function () { return this._pdf417_error_correction_level; },
                    set: function (value) {
                        this._pdf417_error_correction_level = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "pdf417_file_id", {
                    get: function () { return this._pdf417_file_id; },
                    set: function (value) {
                        this._pdf417_file_id = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "pdf417_rows", {
                    get: function () { return this._pdf417_rows; },
                    set: function (value) {
                        this._pdf417_rows = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "pdf417_segment_count", {
                    get: function () { return this._pdf417_segment_count; },
                    set: function (value) {
                        this._pdf417_segment_count = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "pdf417_segment_index", {
                    get: function () { return this._pdf417_segment_index; },
                    set: function (value) {
                        this._pdf417_segment_index = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "pdf417_truncated", {
                    get: function () { return this._pdf417_truncated; },
                    set: function (value) {
                        this._pdf417_truncated = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "pdf417_process_tilde", {
                    get: function () { return this._pdf417_process_tilde; },
                    set: function (value) {
                        this._pdf417_process_tilde = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "pharmacode_bars_spacing", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._pharmacode_bars_spacing, this._unit_type);
                    },
                    set: function (value) {
                        this._pharmacode_bars_spacing = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "pharmacode_thick_bar_width", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._pharmacode_thick_bar_width, this._unit_type);
                    },
                    set: function (value) {
                        this._pharmacode_thick_bar_width = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "pharmacode_thin_bar_width", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._pharmacode_thin_bar_width, this._unit_type);
                    },
                    set: function (value) {
                        this._pharmacode_thin_bar_width = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "planet_height_short_bar", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._planet_height_short_bar, this._unit_type);
                    },
                    set: function (value) {
                        this._planet_height_short_bar = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "planet_height_tall_bar", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._planet_height_tall_bar, this._unit_type);
                    },
                    set: function (value) {
                        this._planet_height_tall_bar = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "postal_4_state_add_start_stop_char", {
                    get: function () { return this._postal_4_state_add_start_stop_char; },
                    set: function (value) {
                        this._postal_4_state_add_start_stop_char = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "postal_4_state_bars_spacing", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._postal_4_state_bars_spacing, this._unit_type);
                    },
                    set: function (value) {
                        this._postal_4_state_bars_spacing = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "postal_4_state_tracker_bar_height", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._postal_4_state_tracker_bar_height, this._unit_type);
                    },
                    set: function (value) {
                        this._postal_4_state_tracker_bar_height = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "postal_4_state_tracker_bar_width", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._postal_4_state_tracker_bar_width, this._unit_type);
                    },
                    set: function (value) {
                        this._postal_4_state_tracker_bar_width = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "postnet_height_short_bar", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._postnet_height_short_bar, this._unit_type);
                    },
                    set: function (value) {
                        this._postnet_height_short_bar = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "postnet_height_tall_bar", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._postnet_height_tall_bar, this._unit_type);
                    },
                    set: function (value) {
                        this._postnet_height_tall_bar = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "qr_code_byte_encoding_name", {
                    get: function () { return this._qr_code_byte_encoding_name; },
                    set: function (value) {
                        this._qr_code_byte_encoding_name = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "qr_code_encoding", {
                    get: function () { return this._qr_code_encoding; },
                    set: function (value) {
                        this._qr_code_encoding = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "qr_code_error_correction_level", {
                    get: function () { return this._qr_code_error_correction_level; },
                    set: function (value) {
                        this._qr_code_error_correction_level = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "qr_code_module_size", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._qr_code_module_size, this._unit_type);
                    },
                    set: function (value) {
                        //if (value < 0)
                        //    this._onError('Invalid value for qr_code_module_size', typeof (this));
                        this._qr_code_module_size = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "qr_code_process_tilde", {
                    get: function () { return this._qr_code_process_tilde; },
                    set: function (value) {
                        this._qr_code_process_tilde = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "qr_code_version", {
                    get: function () { return this._qr_code_version; },
                    set: function (value) {
                        this._qr_code_version = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "quiet_zone", {
                    get: function () {
                        var left = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._quiet_zone.left, this._unit_type);
                        var top = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._quiet_zone.top, this._unit_type);
                        var right = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._quiet_zone.right, this._unit_type);
                        var bottom = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._quiet_zone.bottom, this._unit_type);
                        return new Printing.FrameThickness(left, top, right, bottom);
                    },
                    set: function (value) {
                        var left = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value.left, this._unit_type);
                        var top = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value.top, this._unit_type);
                        var right = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value.right, this._unit_type);
                        var bottom = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value.bottom, this._unit_type);
                        this._quiet_zone = new Printing.FrameThickness(left, top, right, bottom);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "rotation_angle", {
                    get: function () { return this._rotation_angle; },
                    set: function (value) {
                        this._rotation_angle = Math.round(value / 90) * 90;
                        this._updateToCanvas();
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "segments_per_row", {
                    get: function () { return this._segments_per_row; },
                    set: function (value) {
                        this._segments_per_row = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "sizing", {
                    get: function () { return this._sizing; },
                    set: function (value) {
                        this._sizing = value;
                        this._resizable = (value != Printing.BarcodeSizing.AutoSize);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "symbology", {
                    get: function () { return this._symbology; },
                    set: function (value) {
                        if (this._readonly)
                            return;
                        this._symbology = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "telepen_encoding", {
                    get: function () { return this._telepen_encoding; },
                    set: function (value) {
                        this._telepen_encoding = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "text", {
                    get: function () { return this._text; },
                    set: function (value) {
                        if (this._readonly)
                            return;
                        this._text = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "text_alignment", {
                    get: function () { return this._text_alignment; },
                    set: function (value) {
                        this._text_alignment = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "text_font", {
                    get: function () { return this._text_font; },
                    set: function (value) {
                        this._text_font = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "text_fore_color", {
                    get: function () { return this._text_fore_color; },
                    set: function (value) {
                        this._text_fore_color = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "text_format_pattern", {
                    get: function () { return this._text_format_pattern; },
                    set: function (value) {
                        this._text_format_pattern = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "upce_system", {
                    get: function () { return this._upce_system; },
                    set: function (value) {
                        this._upce_system = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "use_quiet_zone_for_text", {
                    get: function () { return this._use_quiet_zone_for_text; },
                    set: function (value) {
                        this._use_quiet_zone_for_text = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "usps_fim_pattern", {
                    get: function () { return this._usps_fim_pattern; },
                    set: function (value) {
                        this._usps_fim_pattern = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "usps_horizontal_bars_count", {
                    get: function () { return this._usps_horizontal_bars_count; },
                    set: function (value) {
                        this._usps_horizontal_bars_count = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "width", {
                    get: function () { return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._width, this._unit_type); },
                    set: function (value) {
                        this._width = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this._updateToCanvas();
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "gs1_data_strict_validation", {
                    get: function () { return this._gs1_data_strict_validation; },
                    set: function (value) {
                        this._gs1_data_strict_validation = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "maxi_code_draw_pixel_based_symbol", {
                    get: function () { return this._maxi_code_draw_pixel_based_symbol; },
                    set: function (value) {
                        this._maxi_code_draw_pixel_based_symbol = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "dot_code_columns", {
                    get: function () { return this._dot_code_columns; },
                    set: function (value) {
                        if (value == 0 || (value >= 5 && value <= 200)) {
                            this._dot_code_columns = value;
                            this.propertyChanged();
                        }
                        else {
                            //this._onError('Invalid value for dot_code_columns', typeof (this));
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "dot_code_module_size", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._dot_code_module_size, this._unit_type);
                    },
                    set: function (value) {
                        //if (value < 0)
                        //    this._onError('Invalid value for dot_code_module_size', typeof (this));
                        this._dot_code_module_size = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "dot_code_process_tilde", {
                    get: function () { return this._dot_code_process_tilde; },
                    set: function (value) {
                        this._dot_code_process_tilde = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "dot_code_rows", {
                    get: function () { return this._dot_code_rows; },
                    set: function (value) {
                        if (value == 0 || (value >= 5 && value <= 200)) {
                            this._dot_code_rows = value;
                            this.propertyChanged();
                        }
                        else {
                            //this._onError('Invalid value for dot_code_rows', typeof (this));
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "dot_code_aspect_ratio", {
                    get: function () { return this._dot_code_aspect_ratio; },
                    set: function (value) {
                        this._dot_code_aspect_ratio = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "dot_code_module_shape", {
                    get: function () { return this._dot_code_module_shape; },
                    set: function (value) {
                        this._dot_code_module_shape = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "data_matrix_include_rect_formats_in_auto_mode", {
                    get: function () { return this._data_matrix_include_rect_formats_in_auto_mode; },
                    set: function (value) {
                        this._data_matrix_include_rect_formats_in_auto_mode = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "back_color_hex", {
                    get: function () { return this._back_color_hex; },
                    set: function (value) {
                        this._back_color_hex = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "bar_color_hex", {
                    get: function () { return this._bar_color_hex; },
                    set: function (value) {
                        this._bar_color_hex = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "border_color_hex", {
                    get: function () { return this._border_color_hex; },
                    set: function (value) {
                        this._border_color_hex = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "fore_color_hex", {
                    get: function () { return this._fore_color_hex; },
                    set: function (value) {
                        this._fore_color_hex = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "text_fore_color_hex", {
                    get: function () { return this._text_fore_color_hex; },
                    set: function (value) {
                        this._text_fore_color_hex = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "code11_two_digits_checksum", {
                    get: function () { return this._code11_two_digits_checksum; },
                    set: function (value) {
                        this._code11_two_digits_checksum = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "tlc39_micro_pdf417_bar_width", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._tlc39_micro_pdf417_bar_width, this._unit_type);
                    },
                    set: function (value) {
                        //if (value < 0)
                        //    this._onError('Invalid value for tlc39_micro_pdf417_bar_width', typeof (this));
                        this._tlc39_micro_pdf417_bar_width = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "tlc39_micro_pdf417_row_bar_height", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._tlc39_micro_pdf417_row_bar_height, this._unit_type);
                    },
                    set: function (value) {
                        //if (value < 0)
                        //    this._onError('Invalid value for tlc39_micro_pdf417_row_bar_height', typeof (this));
                        this._tlc39_micro_pdf417_row_bar_height = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "right_to_left", {
                    get: function () { return this._right_to_left; },
                    set: function (value) {
                        this._right_to_left = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BarcodeItem.prototype, "rect_microqr_code_version", {
                    get: function () { return this._rect_microqr_code_version; },
                    set: function (value) {
                        this._rect_microqr_code_version = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "print_as_resident_element", {
                    get: function () { return this._print_as_resident_element; },
                    set: function (value) {
                        this._print_as_resident_element = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BarcodeItem.prototype, "qr_code_mask", {
                    get: function () { return this._qr_code_mask; },
                    set: function (value) {
                        this._qr_code_mask = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(BarcodeItem.prototype, "code_encoding", {
                    get: function () { return this._code_encoding; },
                    set: function (value) {
                        this._code_encoding = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                //#endregion
                BarcodeItem.prototype._getProperties = function () {
                    return {
                        Type: "Barcode",
                        UnitType: this.unit_type,
                        X: this.x,
                        Y: this.y,
                        Width: this.width,
                        Height: this.height,
                        //Dpi: 96,
                        Dpi: 96 * (this._fabric_item.scaleX || 1),
                        CornerRadius_BottomLeft: this.corner_radius.bottom_left,
                        CornerRadius_BottomRight: this.corner_radius.bottom_right,
                        CornerRadius_TopLeft: this.corner_radius.top_left,
                        CornerRadius_TopRight: this.corner_radius.top_right,
                        BorderThickness_Bottom: this.border_thickness.bottom,
                        BorderThickness_Left: this.border_thickness.left,
                        BorderThickness_Right: this.border_thickness.right,
                        BorderThickness_Top: this.border_thickness.top,
                        BarcodePadding_Bottom: this.barcode_padding.bottom,
                        BarcodePadding_Left: this.barcode_padding.left,
                        BarcodePadding_Right: this.barcode_padding.right,
                        BarcodePadding_Top: this.barcode_padding.top,
                        QuietZone_Bottom: this.quiet_zone.bottom,
                        QuietZone_Left: this.quiet_zone.left,
                        QuietZone_Right: this.quiet_zone.right,
                        QuietZone_Top: this.quiet_zone.top,
                        TextFont_Bold: this.text_font.bold,
                        TextFont_CodePage: this.text_font.code_page,
                        TextFont_CustomFontFile: this.text_font.custom_font_file,
                        TextFont_CustomFontFileFamilyName: this.text_font.custom_font_file_family_name,
                        TextFont_IsBitmapFont: this.text_font.is_bitmap_font,
                        TextFont_Italic: this.text_font.italic,
                        TextFont_Name: this.text_font.name,
                        TextFont_NameAtPrinterStorage: this.text_font.name_at_printer_storage,
                        TextFont_Size: this.text_font.size,
                        TextFont_Strikeout: this.text_font.strikeout,
                        TextFont_Threshold: this.text_font.threshold,
                        TextFont_Underline: this.text_font.underline,
                        TextFont_Unit: this.text_font.unit,
                        Font_Bold: this.font.bold,
                        Font_CodePage: this.font.code_page,
                        Font_CustomFontFile: this.font.custom_font_file,
                        Font_CustomFontFileFamilyName: this.font.custom_font_file_family_name,
                        Font_IsBitmapFont: this.font.is_bitmap_font,
                        Font_Italic: this.font.italic,
                        Font_Name: this.font.name,
                        Font_NameAtPrinterStorage: this.font.name_at_printer_storage,
                        Font_Size: this.font.size,
                        Font_Strikeout: this.font.strikeout,
                        Font_Threshold: this.font.threshold,
                        Font_Underline: this.font.underline,
                        Font_Unit: this.font.unit,
                        AddChecksum: this.add_checksum,
                        AztecCodeByteEncodingName: this.aztec_code_byte_encoding_name,
                        AztecCodeErrorCorrection: this.aztec_code_error_correction,
                        AztecCodeFormat: this.aztec_code_format,
                        AztecCodeModuleSize: this.aztec_code_module_size,
                        AztecCodeProcessTilde: this.aztec_code_process_tilde,
                        AztecCodeRune: this.aztec_code_rune,
                        BackColor: this.back_color,
                        BarcodeAlignment: this.barcode_alignment,
                        BarColor: this.bar_color,
                        BarHeight: this.bar_height,
                        BarRatio: this.bar_ratio,
                        BarWidth: this.bar_width,
                        BarWidthAdjustment: this.bar_width_adjustment,
                        BearerBarStyle: this.bearer_bar_style,
                        BearerBarThickness: this.bearer_bar_thickness,
                        BorderColor: this.border_color,
                        CodabarStartChar: this.codabar_start_char,
                        CodabarStopChar: this.codabar_stop_char,
                        Code: this.code,
                        Code128CharSet: this.code128_charset,
                        Code16kMode: this.code16k_mode,
                        Code39FullAsciiMode: this.code39_full_ascii_mode,
                        Code93FullAsciiMode: this.code93_full_ascii_mode,
                        CodeAlignment: this.code_alignment,
                        CodeFormatPattern: this.code_format_pattern,
                        CornerRadius: this.corner_radius,
                        CounterStep: this.counter_step,
                        CounterUseLeadingZeros: this.counter_using_leading_zeros,
                        DataMatrixByteEncodingName: this.data_matrix_byte_encoding_name,
                        DataMatrixEncoding: this.data_matrix_encoding,
                        DataMatrixFileId: this.data_matrix_file_id,
                        DataMatrixFormat: this.data_matrix_format,
                        DataMatrixModuleSize: this.data_matrix_module_size,
                        DataMatrixProcessTilde: this.data_matrix_process_tilde,
                        DataMatrixSymbolCount: this.data_matrix_symbol_count,
                        DataMatrixSymbolIndex: this.data_matrix_symbol_index,
                        DisplayChecksum: this.display_checksum,
                        DisplayCode: this.display_code,
                        DisplayStartStopChar: this.display_start_stop_char,
                        EanUpcDisplayLightMarginIndicator: this.ean_upc_display_light_margin_indicator,
                        EanUpcGuardBar: this.ean_upc_guard_bar,
                        EanUpcGuardBarHeight: this.ean_upc_guard_bar_height,
                        EanUpcMagnificationFactor: this.ean_upc_magnification_factor,
                        EanUpcSupplement: this.ean_upc_supplement,
                        EanUpcSupplementCode: this.ean_upc_supplement_code,
                        EanUpcSupplementSeparation: this.ean_upc_supplement_separation,
                        EanUpcSupplementTopMargin: this.ean_upc_supplement_top_margin,
                        ErrorBehavior: this.error_behavior,
                        Font: this.font,
                        ForeColor: this.fore_color,
                        HanXinCodeByteEncodingName: this.han_xin_code_byte_encoding_name,
                        HanXinCodeEncoding: this.han_xin_code_encoding,
                        HanXinCodeErrorCorrectionLevel: this.han_xin_code_error_correction_level,
                        HanXinCodeModuleSize: this.han_xin_code_module_size,
                        HanXinCodeProcessTilde: this.han_xin_code_process_tilde,
                        HanXinCodeVersion: this.han_xin_code_version,
                        HibcFormatHumanReadableText: this.hibc_format_human_readable_text,
                        HibcUseIsoIec15434Encoding: this.hibc_use_iso_iec_15434_encoding,
                        HideIfEmpty: this.hide_if_empty,
                        HumanReadableText: this.human_readable_text,
                        Isbt128DataStructure: this.isbt_128_data_structure,
                        Itf14LeftHMark: this.itf14_left_h_mark,
                        Itf14RightHMark: this.itf14_right_h_mark,
                        Mask: this.mask,
                        MaskIncrement: this.mask_increment,
                        MaxiCodeMode: this.maxi_code_mode,
                        MaxiCodeProcessTilde: this.maxi_code_process_tilde,
                        MaxiCodeSymbolCount: this.maxi_code_symbol_count,
                        MaxiCodeSymbolIndex: this.maxi_code_symbol_index,
                        MicroPdf417Version: this.micropdf417_version,
                        MicroQRCodeVersion: this.microqr_code_version,
                        MsiChecksum: this.msi_checksum,
                        Pdf417AspectRatio: this.pdf417_aspect_ratio,
                        Pdf417ByteEncodingName: this.pdf417_byte_encoding_name,
                        Pdf417Columns: this.pdf417_columns,
                        Pdf417CompactionType: this.pdf417_compaction_type,
                        Pdf417ErrorCorrectionLevel: this.pdf417_error_correction_level,
                        Pdf417FileId: this.pdf417_file_id,
                        Pdf417Rows: this.pdf417_rows,
                        Pdf417SegmentCount: this.pdf417_segment_count,
                        Pdf417SegmentIndex: this.pdf417_segment_index,
                        Pdf417Truncated: this.pdf417_truncated,
                        Pdf417ProcessTilde: this.pdf417_process_tilde,
                        PharmacodeBarsSpacing: this.pharmacode_bars_spacing,
                        PharmacodeThickBarWidth: this.pharmacode_thick_bar_width,
                        PharmacodeThinBarWidth: this.pharmacode_thin_bar_width,
                        PlanetHeightShortBar: this.planet_height_short_bar,
                        PlanetHeightTallBar: this.planet_height_tall_bar,
                        Postal4StateAddStartStopChar: this.postal_4_state_add_start_stop_char,
                        Postal4StateBarsSpacing: this.postal_4_state_bars_spacing,
                        Postal4StateTrackerBarHeight: this.postal_4_state_tracker_bar_height,
                        Postal4StateTrackerBarWidth: this.postal_4_state_tracker_bar_width,
                        PostnetHeightShortBar: this.postnet_height_short_bar,
                        PostnetHeightTallBar: this.postnet_height_tall_bar,
                        QRCodeByteEncodingName: this.qr_code_byte_encoding_name,
                        QRCodeEncoding: this.qr_code_encoding,
                        QRCodeErrorCorrectionLevel: this.qr_code_error_correction_level,
                        QRCodeModuleSize: this.qr_code_module_size,
                        QRCodeProcessTilde: this.qr_code_process_tilde,
                        QRCodeVersion: this.qr_code_version,
                        RotationAngle: this.rotation_angle,
                        SegmentsPerRow: this.segments_per_row,
                        Sizing: this.sizing,
                        Symbology: this.symbology,
                        TelepenEncoding: this.telepen_encoding,
                        Text: this.text,
                        TextAlignment: this.text_alignment,
                        TextFont: this.text_font,
                        TextForeColor: this.text_fore_color,
                        TextFormatPattern: this.text_format_pattern,
                        UpcESystem: this.upce_system,
                        UseQuietZoneForText: this.use_quiet_zone_for_text,
                        UspsFimPattern: this.usps_fim_pattern,
                        UspsHorizontalBarsCount: this.usps_horizontal_bars_count,
                        Comments: this.comments,
                        DataField: this.data_field,
                        DataFieldFormatString: this.data_field_format_string,
                        Name: this.name,
                        PrintAsGraphic: this.print_as_graphic,
                        Tag: this.tag,
                        Locked: this.locked,
                        GS1DataStrictValidation: this.gs1_data_strict_validation,
                        MaxiCodeDrawPixelBasedSymbol: this.maxi_code_draw_pixel_based_symbol,
                        DotCodeColumns: this.dot_code_columns,
                        DotCodeModuleSize: this.dot_code_module_size,
                        DotCodeProcessTilde: this.dot_code_process_tilde,
                        DotCodeRows: this.dot_code_rows,
                        DotCodeAspectRatio: this.dot_code_aspect_ratio,
                        DotCodeModuleShape: this.dot_code_module_shape,
                        DataMatrixIncludeRectFormatsInAutoMode: this.data_matrix_include_rect_formats_in_auto_mode,
                        Editable: this.editable,
                        BorderColorHex: this.border_color_hex,
                        BackColorHex: this.back_color_hex,
                        BarColorHex: this.bar_color_hex,
                        ForeColorHex: this.fore_color_hex,
                        TextForeColorHex: this.text_fore_color_hex,
                        Expression: Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(this.expression),
                        UseCache: this.use_cache,
                        CacheItemId: this.cache_item_id,
                        Visible: this.visible,
                        Code11TwoDigitsChecksum: this.code11_two_digits_checksum,
                        Tlc39MicroPdf417BarWidth: this.tlc39_micro_pdf417_bar_width,
                        Tlc39MicroPdf417RowBarHeight: this.tlc39_micro_pdf417_row_bar_height,
                        RightToLeft: this.right_to_left,
                        RectMicroQRCodeVersion: this.rect_microqr_code_version,
                        PrintAsResidentElement: this.print_as_resident_element,
                        QRCodeMask: this.qr_code_mask,
                        GroupName: this.group_name,
                        Resizable: this.resizable,
                        ReadOnly: this.read_only,
                        CodeEncoding: this.code_encoding
                    };
                };
                ;
                //public _clone() {
                //    var clone = new Neodynamic.SDK.Printing.BarcodeItem();
                //    clone.name = this.name;// + new Date().getTime();
                //    clone.unit_type = this.unit_type;
                //    clone._x = this._x;
                //    clone._y = this._y;
                //    clone._width = this._width;
                //    clone._height = this._height;
                //    clone._corner_radius.bottom_left = this._corner_radius.bottom_left;
                //    clone._corner_radius.bottom_right = this._corner_radius.bottom_right;
                //    clone._corner_radius.top_left = this._corner_radius.top_left;
                //    clone._corner_radius.top_right = this._corner_radius.top_right;
                //    clone._border_thickness.bottom = this._border_thickness.bottom;
                //    clone._border_thickness.left = this._border_thickness.left;
                //    clone._border_thickness.right = this._border_thickness.right;
                //    clone._border_thickness.top = this._border_thickness.top;
                //    clone._barcode_padding.bottom = this._barcode_padding.bottom;
                //    clone._barcode_padding.left = this._barcode_padding.left;
                //    clone._barcode_padding.right = this._barcode_padding.right;
                //    clone._barcode_padding.top = this._barcode_padding.top;
                //    clone._quiet_zone.bottom = this._quiet_zone.bottom;
                //    clone._quiet_zone.left = this._quiet_zone.left;
                //    clone._quiet_zone.right = this._quiet_zone.right;
                //    clone._quiet_zone.top = this._quiet_zone.top;
                //    clone.text_font.bold = this.text_font.bold;
                //    clone.text_font.code_page = this.text_font.code_page;
                //    clone.text_font.custom_font_file = this.text_font.custom_font_file;
                //    clone.text_font.custom_font_file_family_name = this.text_font.custom_font_file_family_name;
                //    clone.text_font.is_bitmap_font = this.text_font.is_bitmap_font;
                //    clone.text_font.italic = this.text_font.italic;
                //    clone.text_font.name = this.text_font.name;
                //    clone.text_font.name_at_printer_storage = this.text_font.name_at_printer_storage;
                //    clone.text_font.size = this.text_font.size;
                //    clone.text_font.strikeout = this.text_font.strikeout;
                //    clone.text_font.threshold = this.text_font.threshold;
                //    clone.text_font.underline = this.text_font.underline;
                //    clone.text_font.unit = this.text_font.unit;
                //    clone.font.bold = this.font.bold;
                //    clone.font.code_page = this.font.code_page;
                //    clone.font.custom_font_file = this.font.custom_font_file;
                //    clone.font.custom_font_file_family_name = this.font.custom_font_file_family_name;
                //    clone.font.is_bitmap_font = this.font.is_bitmap_font;
                //    clone.font.italic = this.font.italic;
                //    clone.font.name = this.font.name;
                //    clone.font.name_at_printer_storage = this.font.name_at_printer_storage;
                //    clone.font.size = this.font.size;
                //    clone.font.strikeout = this.font.strikeout;
                //    clone.font.threshold = this.font.threshold;
                //    clone.font.underline = this.font.underline;
                //    clone.font.unit = this.font.unit;
                //    clone.add_checksum = this.add_checksum;
                //    clone.aztec_code_byte_encoding_name = this.aztec_code_byte_encoding_name;
                //    clone.aztec_code_error_correction = this.aztec_code_error_correction;
                //    clone.aztec_code_format = this.aztec_code_format;
                //    clone._aztec_code_module_size = this._aztec_code_module_size;
                //    clone.aztec_code_process_tilde = this.aztec_code_process_tilde;
                //    clone.aztec_code_rune = this.aztec_code_rune;
                //    clone.back_color = this.back_color;
                //    clone.barcode_alignment = this.barcode_alignment;
                //    clone.bar_color = this.bar_color;
                //    clone._bar_height = this._bar_height;
                //    clone._bar_ratio = this._bar_ratio;
                //    clone._bar_width = this._bar_width;
                //    clone._bar_width_adjustment = this._bar_width_adjustment;
                //    clone.bearer_bar_style = this.bearer_bar_style;
                //    clone._bearer_bar_thickness = this._bearer_bar_thickness;
                //    clone.border_color = this.border_color;
                //    clone.codabar_start_char = this.codabar_start_char;
                //    clone.codabar_stop_char = this.codabar_stop_char;
                //    clone.code = this.code;
                //    clone.code128_charset = this.code128_charset;
                //    clone.code16k_mode = this.code16k_mode;
                //    clone.code39_full_ascii_mode = this.code39_full_ascii_mode;
                //    clone.code93_full_ascii_mode = this.code93_full_ascii_mode;
                //    clone.code_alignment = this.code_alignment;
                //    clone.code_format_pattern = this.code_format_pattern;
                //    clone._corner_radius = this._corner_radius;
                //    clone.counter_step = this.counter_step;
                //    clone.counter_using_leading_zeros = this.counter_using_leading_zeros;
                //    clone.data_matrix_byte_encoding_name = this.data_matrix_byte_encoding_name;
                //    clone.data_matrix_encoding = this.data_matrix_encoding;
                //    clone.data_matrix_file_id = this.data_matrix_file_id;
                //    clone.data_matrix_format = this.data_matrix_format;
                //    clone._data_matrix_module_size = this._data_matrix_module_size;
                //    clone.data_matrix_process_tilde = this.data_matrix_process_tilde;
                //    clone.data_matrix_symbol_count = this.data_matrix_symbol_count;
                //    clone.data_matrix_symbol_index = this.data_matrix_symbol_index;
                //    clone.display_checksum = this.display_checksum;
                //    clone.display_code = this.display_code;
                //    clone.display_start_stop_char = this.display_start_stop_char;
                //    clone.ean_upc_display_light_margin_indicator = this.ean_upc_display_light_margin_indicator;
                //    clone.ean_upc_guard_bar = this.ean_upc_guard_bar;
                //    clone._ean_upc_guard_bar_height = this._ean_upc_guard_bar_height;
                //    clone._ean_upc_magnification_factor = this._ean_upc_magnification_factor;
                //    clone.ean_upc_supplement = this.ean_upc_supplement;
                //    clone.ean_upc_supplement_code = this.ean_upc_supplement_code;
                //    clone._ean_upc_supplement_separation = this._ean_upc_supplement_separation;
                //    clone._ean_upc_supplement_top_margin = this._ean_upc_supplement_top_margin;
                //    clone.error_behavior = this.error_behavior;
                //    clone.font = this.font;
                //    clone.fore_color = this.fore_color;
                //    clone.han_xin_code_byte_encoding_name = this.han_xin_code_byte_encoding_name;
                //    clone.han_xin_code_encoding = this.han_xin_code_encoding;
                //    clone.han_xin_code_error_correction_level = this.han_xin_code_error_correction_level;
                //    clone._han_xin_code_module_size = this._han_xin_code_module_size;
                //    clone.han_xin_code_process_tilde = this.han_xin_code_process_tilde;
                //    clone.han_xin_code_version = this.han_xin_code_version;
                //    clone.hibc_format_human_readable_text = this.hibc_format_human_readable_text;
                //    clone.hibc_use_iso_iec_15434_encoding = this.hibc_use_iso_iec_15434_encoding;
                //    clone.hide_if_empty = this.hide_if_empty;
                //    clone.human_readable_text = this.human_readable_text;
                //    clone.isbt_128_data_structure = this.isbt_128_data_structure;
                //    clone.itf14_left_h_mark = this.itf14_left_h_mark;
                //    clone.itf14_right_h_mark = this.itf14_right_h_mark;
                //    clone.mask = this.mask;
                //    clone.mask_increment = this.mask_increment;
                //    clone.maxi_code_mode = this.maxi_code_mode;
                //    clone.maxi_code_process_tilde = this.maxi_code_process_tilde;
                //    clone.maxi_code_symbol_count = this.maxi_code_symbol_count;
                //    clone.maxi_code_symbol_index = this.maxi_code_symbol_index;
                //    clone.micropdf417_version = this.micropdf417_version;
                //    clone.microqr_code_version = this.microqr_code_version;
                //    clone.msi_checksum = this.msi_checksum;
                //    clone._pdf417_aspect_ratio = this._pdf417_aspect_ratio;
                //    clone.pdf417_byte_encoding_name = this.pdf417_byte_encoding_name;
                //    clone.pdf417_columns = this.pdf417_columns;
                //    clone.pdf417_compaction_type = this.pdf417_compaction_type;
                //    clone.pdf417_error_correction_level = this.pdf417_error_correction_level;
                //    clone.pdf417_file_id = this.pdf417_file_id;
                //    clone.pdf417_rows = this.pdf417_rows;
                //    clone.pdf417_segment_count = this.pdf417_segment_count;
                //    clone.pdf417_segment_index = this.pdf417_segment_index;
                //    clone.pdf417_truncated = this.pdf417_truncated;
                //    clone._pharmacode_bars_spacing = this._pharmacode_bars_spacing;
                //    clone._pharmacode_thick_bar_width = this._pharmacode_thick_bar_width;
                //    clone._pharmacode_thin_bar_width = this._pharmacode_thin_bar_width;
                //    clone._planet_height_short_bar = this._planet_height_short_bar;
                //    clone._planet_height_tall_bar = this._planet_height_tall_bar;
                //    clone.postal_4_state_add_start_stop_char = this.postal_4_state_add_start_stop_char;
                //    clone._postal_4_state_bars_spacing = this._postal_4_state_bars_spacing;
                //    clone._postal_4_state_tracker_bar_height = this._postal_4_state_tracker_bar_height;
                //    clone._postal_4_state_tracker_bar_width = this._postal_4_state_tracker_bar_width;
                //    clone._postnet_height_short_bar = this._postnet_height_short_bar;
                //    clone._postnet_height_tall_bar = this._postnet_height_tall_bar;
                //    clone.qr_code_byte_encoding_name = this.qr_code_byte_encoding_name;
                //    clone.qr_code_encoding = this.qr_code_encoding;
                //    clone.qr_code_error_correction_level = this.qr_code_error_correction_level;
                //    clone._qr_code_module_size = this._qr_code_module_size;
                //    clone.qr_code_process_tilde = this.qr_code_process_tilde;
                //    clone.qr_code_version = this.qr_code_version;
                //    clone.rotation_angle = this.rotation_angle;
                //    clone.segments_per_row = this.segments_per_row;
                //    clone.sizing = this.sizing;
                //    clone.symbology = this.symbology;
                //    clone.telepen_encoding = this.telepen_encoding;
                //    clone.text = this.text;
                //    clone.text_alignment = this.text_alignment;
                //    clone.text_font = this.text_font;
                //    clone.text_fore_color = this.text_fore_color;
                //    clone.text_format_pattern = this.text_format_pattern;
                //    clone.upce_system = this.upce_system;
                //    clone.use_quiet_zone_for_text = this.use_quiet_zone_for_text;
                //    clone.usps_fim_pattern = this.usps_fim_pattern;
                //    clone.usps_horizontal_bars_count = this.usps_horizontal_bars_count;
                //    clone.comments = this.comments;
                //    clone.data_field = this.data_field;
                //    clone.data_field_format_string = this.data_field_format_string;
                //    clone.print_as_graphic = this.print_as_graphic;
                //    clone.tag = this.tag;
                //    clone.locked = this.locked;
                //    clone.gs1_data_strict_validation = this.gs1_data_strict_validation;
                //    clone.maxi_code_draw_pixel_based_symbol = this.maxi_code_draw_pixel_based_symbol;
                //    clone.dot_code_columns = this.dot_code_columns;
                //    clone.dot_code_module_size = this.dot_code_module_size;
                //    clone._dot_code_module_size = this._dot_code_module_size;
                //    clone.dot_code_process_tilde = this.dot_code_process_tilde;
                //    clone.dot_code_rows = this.dot_code_rows;
                //    clone.dot_code_aspect_ratio = this.dot_code_aspect_ratio;
                //    clone.dot_code_module_shape = this.dot_code_module_shape;
                //    clone.data_matrix_include_rect_formats_in_auto_mode = this.data_matrix_include_rect_formats_in_auto_mode;
                //    clone.editable = this.editable;
                //    clone.border_color_hex = this.border_color_hex;
                //    clone.back_color_hex = this.back_color_hex;
                //    clone.bar_color_hex = this.bar_color_hex;
                //    clone.fore_color_hex = this.fore_color_hex;
                //    clone.text_fore_color_hex = this.text_fore_color_hex;
                //    clone.expression = this.expression;
                //    clone.use_cache = this.use_cache;
                //    clone.cache_item_id = this.cache_item_id;
                //    clone.visible = this.visible;
                //    clone._code11_two_digits_checksum = this._code11_two_digits_checksum;
                //    clone._tlc39_micro_pdf417_bar_width = this._tlc39_micro_pdf417_bar_width;
                //    clone._tlc39_micro_pdf417_row_bar_height = this._tlc39_micro_pdf417_row_bar_height;
                //    clone._updateToCanvas();
                //    return clone;
                //}
                BarcodeItem.prototype._updateFromCanvas = function () {
                    if (this._width != this._fabric_item.width || this._height != this._fabric_item.height)
                        this._has_to_reload = true;
                    var MathUtils = Neodynamic.Web.Utils.MathUtils;
                    this._fabric_item.angle = Math.round(this._fabric_item.angle / 90) * 90;
                    this._rotation_angle = (this._fabric_item.angle == 360) ? 0 : this._fabric_item.angle;
                    this._width = this._fabric_item.width;
                    this._height = this._fabric_item.height;
                    if (this._fabric_item.angle == 0) {
                        this._x = this._fabric_item.left / this._fabric_item.scaleX;
                        this._y = this._fabric_item.top / this._fabric_item.scaleY;
                    }
                    else {
                        var boundRect = this._fabric_item.getBoundingRect();
                        this._x = boundRect.left / this._fabric_item.scaleX;
                        this._y = boundRect.top / this._fabric_item.scaleY;
                    }
                };
                ;
                BarcodeItem.prototype._updateToCanvas = function () {
                    this._fabric_item.selectable = this._fabric_item.evented = this._editable;
                    this._fabric_item.lockMovementX = this._locked;
                    this._fabric_item.lockMovementY = this._locked;
                    this._fabric_item.lockScalingX = this._locked || !this.resizable;
                    this._fabric_item.lockScalingY = this._locked || !this.resizable;
                    this._fabric_item.lockRotation = this._locked;
                    this._fabric_item.angle = this._rotation_angle;
                    this._rotation_angle = Math.round(this._rotation_angle / 90) * 90;
                    this._rotation_angle = (this._rotation_angle >= 360) ? 360 - this._rotation_angle : this._rotation_angle;
                    this._fabric_item.angle = this._rotation_angle;
                    var MathUtils = Neodynamic.Web.Utils.MathUtils;
                    var rect = MathUtils.calcOuterRectOfRotatedRect(0, 0, this._width, this._height, this._fabric_item.angle);
                    if (this._rotation_angle == 0 || this._rotation_angle == 360) {
                        this._fabric_item.left = this._x * this._fabric_item.scaleX;
                        this._fabric_item.top = this._y * this._fabric_item.scaleY;
                    }
                    else {
                        if (this._rotation_angle == 90) {
                            this._fabric_item.left = (this._x + this._height) * this._fabric_item.scaleX;
                            this._fabric_item.top = this._y * this._fabric_item.scaleY;
                        }
                        else if (this._rotation_angle == 180) {
                            this._fabric_item.left = (this._x + this._width) * this._fabric_item.scaleX;
                            this._fabric_item.top = (this._y + this._height) * this._fabric_item.scaleY;
                        }
                        else if (this._rotation_angle == 270) {
                            this._fabric_item.left = this._x * this._fabric_item.scaleX;
                            this._fabric_item.top = (this._y + this._width) * this._fabric_item.scaleY;
                        }
                    }
                    this._fabric_item.width = this._width;
                    this._fabric_item.height = this._height;
                    this._fabric_item.setCoords();
                };
                ;
                BarcodeItem.prototype.refresh = function () {
                    var _this = this;
                    this._updateToCanvas();
                    //var error_message = "";
                    var rootUrl = $(location).attr('protocol') + "//" + $(location).attr('host');
                    var TLE = Neodynamic.Web.Editor.ThermalLabelEditor;
                    if (TLE.websiteRootAbsoluteUrl)
                        rootUrl = TLE.websiteRootAbsoluteUrl;
                    this._fabric_item.dpi = 96 * (this._fabric_item.scaleX || 1);
                    $.ajax({
                        url: rootUrl + "/" + TLE.thermalLabelWebEditorControllerName + "?_=" + new Date().getTime(),
                        type: "POST",
                        data: { Action: "Render", Type: "Barcode", Properties: JSON.stringify(this._getProperties()) },
                        async: true
                    }).
                        done(function (data) {
                        if (data.startsWith("ERROR")) {
                            _this._fabric_item.dpi = -1; // force fitting the error image to the fabric.Image obj
                            _this._image_item.src = _this._missing_image;
                            _super.prototype._onError.call(_this, data, "BarcodeItem");
                        }
                        else {
                            _this._image_item.src = data;
                            _this._has_to_reload = false;
                            if (_this.print_as_resident_element)
                                _this.printAsResidentElementIsSupported();
                        }
                        //if (this._fabric_item.canvas)
                        //    this._fabric_item.canvas.renderAll();
                    }).
                        fail(function (data) {
                        _this._fabric_item.dpi = -1; // force fitting the error image to the fabric.Image obj
                        _this._image_item.src = _this._missing_image;
                        //if (this._fabric_item.canvas)
                        //    this._fabric_item.canvas.renderAll();
                        //error_message = "Error when loading image: " + data.responseText;                   
                        _super.prototype._onError.call(_this, data.responseText, "BarcodeItem");
                    });
                    //if (error_message)
                    //    this._onError(error_message, typeof(this));
                };
                ;
                BarcodeItem.prototype.printAsResidentElementIsSupported = function () {
                    var _this = this;
                    this._printAsResidentElementValidationResult = {};
                    var rootUrl = $(location).attr('protocol') + "//" + $(location).attr('host');
                    var TLE = Neodynamic.Web.Editor.ThermalLabelEditor;
                    if (TLE.websiteRootAbsoluteUrl)
                        rootUrl = TLE.websiteRootAbsoluteUrl;
                    $.ajax({
                        url: rootUrl + "/" + TLE.thermalLabelWebEditorControllerName + "?_=" + new Date().getTime(),
                        type: "POST",
                        data: { Action: "Validate", Type: "Barcode", Properties: JSON.stringify(this._getProperties()) },
                        async: true
                    }).
                        done(function (data) {
                        var validationRes = JSON.parse(data);
                        _this._printAsResidentElementValidationResult = validationRes;
                        if (validationRes.printAsResidentElement == false) {
                            _super.prototype._onError.call(_this, validationRes.error, "BarcodeItem");
                        }
                        _this.sizing = Printing.BarcodeSizing.AutoSize;
                        if (_this._fabric_item.canvas)
                            _this._fabric_item.canvas.renderAll();
                    }).
                        fail(function (data) {
                        _super.prototype._onError.call(_this, data.responseText, "BarcodeItem");
                    });
                };
                ;
                ;
                return BarcodeItem;
            }(Printing.Item));
            Printing.BarcodeItem = BarcodeItem;
        })(Printing = SDK.Printing || (SDK.Printing = {}));
    })(SDK = Neodynamic.SDK || (Neodynamic.SDK = {}));
})(Neodynamic || (Neodynamic = {}));
var Neodynamic;
(function (Neodynamic) {
    var SDK;
    (function (SDK) {
        var Printing;
        (function (Printing) {
            var EllipseShapeItem = /** @class */ (function (_super) {
                __extends(EllipseShapeItem, _super);
                //public _clone() {
                //    var clone = new Neodynamic.SDK.Printing.EllipseShapeItem();
                //    clone.rotation_angle = this.rotation_angle;
                //    clone.fill_color = this.fill_color;
                //    clone._stroke_thickness = this._stroke_thickness;
                //    clone.stroke_color = this.stroke_color;
                //    clone._width = this._width;
                //    clone._height = this._height;
                //    clone.name = this.name;// + new Date().getTime();
                //    clone._x = this._x;
                //    clone._y = this._y;
                //    clone.unit_type = this.unit_type;
                //    clone.data_field = this.data_field;
                //    clone.data_field_format_string = this.data_field_format_string;
                //    clone.print_as_graphic = this.print_as_graphic;
                //    clone.comments = this.comments;
                //    clone.tag = this.tag;
                //    clone.locked = this.locked;
                //    clone.editable = this.editable;
                //    clone.stroke_color_hex = this.stroke_color_hex;
                //    clone.fill_color_hex = this.fill_color_hex;
                //    clone.expression = this.expression;
                //    clone.use_cache = this.use_cache;
                //    clone.cache_item_id = this.cache_item_id;
                //    clone.visible = this.visible;
                //    clone._updateToCanvas();
                //    return clone;
                //}
                function EllipseShapeItem() {
                    var _this = _super.call(this) || this;
                    _this._rotation_angle = 0;
                    var self = _this;
                    _this._guid = Neodynamic.Web.Utils.NamingUtils.newGuid();
                    var TextUtils = Neodynamic.Web.Utils.TextUtils;
                    _this._fabric_item = new fabric.Ellipse({
                        //check the unittype
                        thermal_label_object: self,
                        originX: 'left',
                        originY: 'top',
                        rx: 1 / 2,
                        ry: 1 / 2,
                        width: 1,
                        height: 1,
                        angle: self._rotation_angle,
                        top: self._y,
                        left: self._x,
                        fill: TextUtils.isEmpty(self._fill_color_hex) ? (self._fill_color == Neodynamic.SDK.Printing.Color.Black ? 'black' : 'transparent') : self._fill_color_hex,
                        stroke: TextUtils.isEmpty(self._stroke_color_hex) ? (self._stroke_color == Neodynamic.SDK.Printing.Color.Black ? 'black' : 'transparent') : self._stroke_color_hex,
                        strokeWidth: self._stroke_thickness
                    }).on('modified', function (e) {
                        self._updateFromCanvas();
                        self._fabric_item.setCoords();
                    });
                    return _this;
                    //this._fabric_item = new fabric.Group([new fabric.Ellipse({
                    //    //check the unittype
                    //    originX: 'left',
                    //    originY: 'top',
                    //    rx: 1 / 2,
                    //    ry: 1 / 2,
                    //    width: 1,
                    //    height: 1,
                    //    angle: self._rotation_angle,
                    //    top: 0,
                    //    left: 0,
                    //    fill: TextUtils.isEmpty(self._fill_color_hex) ? (self._fill_color == Neodynamic.SDK.Printing.Color.Black ? 'black' : 'transparent') : self._fill_color_hex,
                    //    stroke: TextUtils.isEmpty(self._stroke_color_hex) ? (self._stroke_color == Neodynamic.SDK.Printing.Color.Black ? 'black' : 'transparent') : self._stroke_color_hex,
                    //    strokeWidth: self._stroke_thickness
                    //}), new fabric.Image(document.getElementById("tleLockedIcon") as HTMLImageElement, {
                    //    originX: 'left',
                    //    originY: 'top',
                    //    left: 0, top: 0
                    //    })], {
                    //        top: self._y,
                    //    left: self._x
                    //    }).on('modified', function (e) {
                    //    self._updateFromCanvas();
                    //    self._fabric_item.setCoords();
                    //    });
                    //var lockedIcon = new fabric.Image(document.getElementById("tleLockedIcon") as HTMLImageElement, {
                    //    originX: 'left',
                    //    originY: 'top',
                    //    left: 0, top: 0
                    //});
                    //this._fabric_item = new fabric.Group([fObj, lockedIcon], {
                    //    originX: 'left',
                    //    originY: 'top',
                    //    top: self._y,
                    //    left: self._x});           
                }
                Object.defineProperty(EllipseShapeItem.prototype, "rotation_angle", {
                    get: function () { return this._rotation_angle; },
                    set: function (value) {
                        if (value < 0 || value > 360)
                            throw new RangeError();
                        this._rotation_angle = (value == 360) ? 0 : value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                EllipseShapeItem.prototype._updateFromCanvas = function (property) {
                    var MathUtils = Neodynamic.Web.Utils.MathUtils;
                    this._rotation_angle = (this._fabric_item.angle == 360) ? 0 : this._fabric_item.angle;
                    this._width = this._fabric_item.width;
                    this._height = this._fabric_item.height;
                    if (this._stroke_color == Neodynamic.SDK.Printing.Color.Black) {
                        this._width += this._fabric_item.strokeWidth;
                        this._height += this._fabric_item.strokeWidth;
                    }
                    if (this._fabric_item.angle == 0) {
                        this._x = this._fabric_item.left / this._fabric_item.scaleX;
                        this._y = this._fabric_item.top / this._fabric_item.scaleY;
                    }
                    else {
                        var boundRect = this._fabric_item.getBoundingRect();
                        this._x = boundRect.left / this._fabric_item.scaleX;
                        this._y = boundRect.top / this._fabric_item.scaleY;
                    }
                };
                EllipseShapeItem.prototype._updateToCanvas = function (property) {
                    var TextUtils = Neodynamic.Web.Utils.TextUtils;
                    this._fabric_item.selectable = this._fabric_item.evented = this._editable;
                    this._fabric_item.fill = TextUtils.isEmpty(this._fill_color_hex) ? (this._fill_color == Neodynamic.SDK.Printing.Color.Black ? 'black' : 'transparent') : this._fill_color_hex;
                    this._fabric_item.stroke = TextUtils.isEmpty(this._stroke_color_hex) ? (this._stroke_color == Neodynamic.SDK.Printing.Color.Black ? 'black' : 'transparent') : this._stroke_color_hex;
                    this._fabric_item.lockMovementX = this._locked;
                    this._fabric_item.lockMovementY = this._locked;
                    this._fabric_item.lockScalingX = this._locked || !this.resizable;
                    this._fabric_item.lockScalingY = this._locked || !this.resizable;
                    this._fabric_item.lockRotation = this._locked;
                    this._fabric_item.strokeWidth = this._stroke_thickness;
                    if (this._stroke_thickness > 0) {
                        if (this._stroke_style == Neodynamic.SDK.Printing.StrokeStyle.Solid) {
                            this._fabric_item.strokeDashArray = null;
                        }
                        else if (this._stroke_style == Neodynamic.SDK.Printing.StrokeStyle.Dash) {
                            this._fabric_item.strokeDashArray = this.getStrokeStylePattern();
                            this._fabric_item.strokeLineCap = 'butt';
                        }
                        else if (this._stroke_style == Neodynamic.SDK.Printing.StrokeStyle.Dot) {
                            this._fabric_item.strokeDashArray = [0, this._stroke_thickness * 2];
                            this._fabric_item.strokeLineCap = 'round';
                        }
                    }
                    this._rotation_angle = (this._rotation_angle >= 360) ? 360 - this._rotation_angle : this._rotation_angle;
                    this._fabric_item.angle = this._rotation_angle;
                    var MathUtils = Neodynamic.Web.Utils.MathUtils;
                    var rect = MathUtils.calcOuterRectOfRotatedRect(0, 0, this._width, this._height, this._fabric_item.angle);
                    if (this._rotation_angle == 0 || this._rotation_angle == 360) {
                        this._fabric_item.left = this._x * this._fabric_item.scaleX;
                        this._fabric_item.top = this._y * this._fabric_item.scaleY;
                    }
                    else {
                        if (this._rotation_angle > 0 && this._rotation_angle < 90) {
                            var beta = 180 - 90 - this._rotation_angle;
                            var offsetX = Math.cos(MathUtils.convertDegreesToRad(beta)) * this._height;
                            //var offsetY = Math.sin(MathUtils.convertDegreesToRad(beta)) * this._height;
                            this._fabric_item.left = (this._x + offsetX) * this._fabric_item.scaleX;
                            this._fabric_item.top = this._y * this._fabric_item.scaleY;
                        }
                        else if (this._rotation_angle == 90) {
                            this._fabric_item.left = (this._x + this._height) * this._fabric_item.scaleX;
                            this._fabric_item.top = this._y * this._fabric_item.scaleY;
                        }
                        if (this._rotation_angle > 90 && this._rotation_angle < 180) {
                            var beta = 270 - 90 - this._rotation_angle;
                            var offsetY = Math.cos(MathUtils.convertDegreesToRad(beta)) * this._height;
                            this._fabric_item.left = (this._x + rect[2]) * this._fabric_item.scaleX;
                            this._fabric_item.top = (this._y + offsetY) * this._fabric_item.scaleY;
                        }
                        else if (this._rotation_angle == 180) {
                            this._fabric_item.left = (this._x + this._width) * this._fabric_item.scaleX;
                            this._fabric_item.top = (this._y + this._height) * this._fabric_item.scaleY;
                        }
                        if (this._rotation_angle > 180 && this._rotation_angle < 270) {
                            var beta = this._rotation_angle - 180;
                            var offsetX = Math.cos(MathUtils.convertDegreesToRad(beta)) * this._width;
                            this._fabric_item.left = (this._x + offsetX) * this._fabric_item.scaleX;
                            this._fabric_item.top = (this._y + rect[3]) * this._fabric_item.scaleY;
                        }
                        else if (this._rotation_angle == 270) {
                            this._fabric_item.left = this._x * this._fabric_item.scaleX;
                            this._fabric_item.top = (this._y + this._width) * this._fabric_item.scaleY;
                        }
                        if (this._rotation_angle > 270 && this._rotation_angle < 360) {
                            var beta = 360 - this._rotation_angle;
                            var offsetY = Math.sin(MathUtils.convertDegreesToRad(beta)) * this._width;
                            this._fabric_item.left = this._x * this._fabric_item.scaleX;
                            this._fabric_item.top = (this._y + offsetY) * this._fabric_item.scaleY;
                        }
                    }
                    if (this._stroke_color == Neodynamic.SDK.Printing.Color.Black) {
                        this._fabric_item.width = this._width - this._stroke_thickness;
                        this._fabric_item.height = this._height - this._stroke_thickness;
                    }
                    else {
                        this._fabric_item.width = this._width;
                        this._fabric_item.height = this._height;
                    }
                    this._fabric_item.rx = this._fabric_item.width / 2;
                    this._fabric_item.ry = this._fabric_item.height / 2;
                    this._fabric_item.setCoords();
                };
                EllipseShapeItem.prototype.refresh = function () {
                    this._updateToCanvas();
                    if (this._fabric_item.canvas)
                        this._fabric_item.canvas.renderAll();
                };
                EllipseShapeItem.prototype._getProperties = function () {
                    return {
                        Type: "Ellipse",
                        RotationAngle: this.rotation_angle,
                        FillColor: this.fill_color,
                        StrokeThickness: this.stroke_thickness,
                        StrokeColor: this.stroke_color,
                        Width: this.width,
                        Height: this.height,
                        Name: this.name,
                        X: this.x,
                        Y: this.y,
                        UnitType: this.unit_type,
                        DataField: this.data_field,
                        DataFieldFormatString: this.data_field_format_string,
                        PrintAsGraphic: this.print_as_graphic,
                        Comments: this.comments,
                        Tag: this.tag,
                        Locked: this.locked,
                        Editable: this.editable,
                        FillColorHex: this.fill_color_hex,
                        StrokeColorHex: this.stroke_color_hex,
                        Expression: Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(this.expression),
                        UseCache: this.use_cache,
                        CacheItemId: this.cache_item_id,
                        Visible: this.visible,
                        StrokeStyle: this.stroke_style,
                        StrokeStylePattern: this.stroke_style_pattern,
                        GroupName: this.group_name,
                        Resizable: this.resizable
                    };
                };
                return EllipseShapeItem;
            }(Printing.ClosedShapeItem));
            Printing.EllipseShapeItem = EllipseShapeItem;
        })(Printing = SDK.Printing || (SDK.Printing = {}));
    })(SDK = Neodynamic.SDK || (Neodynamic.SDK = {}));
})(Neodynamic || (Neodynamic = {}));
var Neodynamic;
(function (Neodynamic) {
    var SDK;
    (function (SDK) {
        var Printing;
        (function (Printing) {
            var UnitType;
            (function (UnitType) {
                UnitType[UnitType["Cm"] = 0] = "Cm";
                UnitType[UnitType["Inch"] = 1] = "Inch";
                UnitType[UnitType["Mm"] = 2] = "Mm";
                UnitType[UnitType["DotsPerInch"] = 3] = "DotsPerInch";
                UnitType[UnitType["Point"] = 4] = "Point";
                UnitType[UnitType["Pica"] = 5] = "Pica";
                UnitType[UnitType["Mils"] = 6] = "Mils";
                UnitType[UnitType["Twip"] = 7] = "Twip";
            })(UnitType = Printing.UnitType || (Printing.UnitType = {}));
            ;
            var RFIDTagDataFormat;
            (function (RFIDTagDataFormat) {
                RFIDTagDataFormat[RFIDTagDataFormat["ASCII"] = 0] = "ASCII";
                RFIDTagDataFormat[RFIDTagDataFormat["Hexadecimal"] = 1] = "Hexadecimal";
                RFIDTagDataFormat[RFIDTagDataFormat["EPC"] = 2] = "EPC";
            })(RFIDTagDataFormat = Printing.RFIDTagDataFormat || (Printing.RFIDTagDataFormat = {}));
            ;
            var RFIDTagType;
            (function (RFIDTagType) {
                RFIDTagType[RFIDTagType["Default"] = 0] = "Default";
                RFIDTagType[RFIDTagType["None"] = 1] = "None";
                RFIDTagType[RFIDTagType["EPCClass0"] = 2] = "EPCClass0";
                RFIDTagType[RFIDTagType["EPCClass0Plus"] = 3] = "EPCClass0Plus";
                RFIDTagType[RFIDTagType["EPCClass164bit"] = 4] = "EPCClass164bit";
                RFIDTagType[RFIDTagType["EPCClass196bit"] = 5] = "EPCClass196bit";
                RFIDTagType[RFIDTagType["UCODEEPC119"] = 6] = "UCODEEPC119";
                RFIDTagType[RFIDTagType["ImpinjClass0Plus"] = 7] = "ImpinjClass0Plus";
                RFIDTagType[RFIDTagType["ISO1800006A"] = 8] = "ISO1800006A";
                RFIDTagType[RFIDTagType["EPCClass1Gen2"] = 9] = "EPCClass1Gen2";
                RFIDTagType[RFIDTagType["ISO1800006B"] = 10] = "ISO1800006B";
            })(RFIDTagType = Printing.RFIDTagType || (Printing.RFIDTagType = {}));
            var LockAspectRatio;
            (function (LockAspectRatio) {
                LockAspectRatio[LockAspectRatio["Fit"] = 3] = "Fit";
                LockAspectRatio[LockAspectRatio["HeightBased"] = 2] = "HeightBased";
                LockAspectRatio[LockAspectRatio["None"] = 0] = "None";
                LockAspectRatio[LockAspectRatio["WidthBased"] = 1] = "WidthBased";
            })(LockAspectRatio = Printing.LockAspectRatio || (Printing.LockAspectRatio = {}));
            ;
            var LineOrientation;
            (function (LineOrientation) {
                LineOrientation[LineOrientation["Horizontal"] = 0] = "Horizontal";
                LineOrientation[LineOrientation["Vertical"] = 1] = "Vertical";
                LineOrientation[LineOrientation["DiagonalUp"] = 2] = "DiagonalUp";
                LineOrientation[LineOrientation["DiagonalDown"] = 3] = "DiagonalDown";
            })(LineOrientation = Printing.LineOrientation || (Printing.LineOrientation = {}));
            ;
            var Flip;
            (function (Flip) {
                Flip[Flip["None"] = 0] = "None";
                Flip[Flip["X"] = 1] = "X";
                Flip[Flip["XY"] = 3] = "XY";
                Flip[Flip["Y"] = 2] = "Y";
            })(Flip = Printing.Flip || (Printing.Flip = {}));
            ;
            var AztecCodeFormat;
            (function (AztecCodeFormat) {
                AztecCodeFormat[AztecCodeFormat["Auto"] = 0] = "Auto";
                AztecCodeFormat[AztecCodeFormat["C15X15Compact"] = 1] = "C15X15Compact";
                AztecCodeFormat[AztecCodeFormat["C19X19"] = 2] = "C19X19";
                AztecCodeFormat[AztecCodeFormat["C19X19Compact"] = 3] = "C19X19Compact";
                AztecCodeFormat[AztecCodeFormat["C23X23"] = 4] = "C23X23";
                AztecCodeFormat[AztecCodeFormat["C23X23Compact"] = 5] = "C23X23Compact";
                AztecCodeFormat[AztecCodeFormat["C27X27"] = 6] = "C27X27";
                AztecCodeFormat[AztecCodeFormat["C27X27Compact"] = 7] = "C27X27Compact";
                AztecCodeFormat[AztecCodeFormat["C31X31"] = 8] = "C31X31";
                AztecCodeFormat[AztecCodeFormat["C37X37"] = 9] = "C37X37";
                AztecCodeFormat[AztecCodeFormat["C41X41"] = 10] = "C41X41";
                AztecCodeFormat[AztecCodeFormat["C45X45"] = 11] = "C45X45";
                AztecCodeFormat[AztecCodeFormat["C49X49"] = 12] = "C49X49";
                AztecCodeFormat[AztecCodeFormat["C53X53"] = 13] = "C53X53";
                AztecCodeFormat[AztecCodeFormat["C57X57"] = 14] = "C57X57";
                AztecCodeFormat[AztecCodeFormat["C61X61"] = 15] = "C61X61";
                AztecCodeFormat[AztecCodeFormat["C67X67"] = 16] = "C67X67";
                AztecCodeFormat[AztecCodeFormat["C71X71"] = 17] = "C71X71";
                AztecCodeFormat[AztecCodeFormat["C75X75"] = 18] = "C75X75";
                AztecCodeFormat[AztecCodeFormat["C79X79"] = 19] = "C79X79";
                AztecCodeFormat[AztecCodeFormat["C83X83"] = 20] = "C83X83";
                AztecCodeFormat[AztecCodeFormat["C87X87"] = 21] = "C87X87";
                AztecCodeFormat[AztecCodeFormat["C91X91"] = 22] = "C91X91";
                AztecCodeFormat[AztecCodeFormat["C95X95"] = 23] = "C95X95";
                AztecCodeFormat[AztecCodeFormat["C101X101"] = 24] = "C101X101";
                AztecCodeFormat[AztecCodeFormat["C105X105"] = 25] = "C105X105";
                AztecCodeFormat[AztecCodeFormat["C109X109"] = 26] = "C109X109";
                AztecCodeFormat[AztecCodeFormat["C113X113"] = 27] = "C113X113";
                AztecCodeFormat[AztecCodeFormat["C117X117"] = 28] = "C117X117";
                AztecCodeFormat[AztecCodeFormat["C121X121"] = 29] = "C121X121";
                AztecCodeFormat[AztecCodeFormat["C125X125"] = 30] = "C125X125";
                AztecCodeFormat[AztecCodeFormat["C131X131"] = 31] = "C131X131";
                AztecCodeFormat[AztecCodeFormat["C135X135"] = 32] = "C135X135";
                AztecCodeFormat[AztecCodeFormat["C139X139"] = 33] = "C139X139";
                AztecCodeFormat[AztecCodeFormat["C143X143"] = 34] = "C143X143";
                AztecCodeFormat[AztecCodeFormat["C147X147"] = 35] = "C147X147";
                AztecCodeFormat[AztecCodeFormat["C151X151"] = 36] = "C151X151";
            })(AztecCodeFormat = Printing.AztecCodeFormat || (Printing.AztecCodeFormat = {}));
            ;
            var Color;
            (function (Color) {
                Color[Color["Black"] = 0] = "Black";
                Color[Color["White"] = 1] = "White";
            })(Color = Printing.Color || (Printing.Color = {}));
            ;
            var BarcodeAlignment;
            (function (BarcodeAlignment) {
                BarcodeAlignment[BarcodeAlignment["TopLeft"] = 1] = "TopLeft";
                BarcodeAlignment[BarcodeAlignment["TopCenter"] = 2] = "TopCenter";
                BarcodeAlignment[BarcodeAlignment["TopRight"] = 4] = "TopRight";
                BarcodeAlignment[BarcodeAlignment["MiddleLeft"] = 16] = "MiddleLeft";
                BarcodeAlignment[BarcodeAlignment["MiddleCenter"] = 32] = "MiddleCenter";
                BarcodeAlignment[BarcodeAlignment["MiddleRight"] = 64] = "MiddleRight";
                BarcodeAlignment[BarcodeAlignment["BottomLeft"] = 256] = "BottomLeft";
                BarcodeAlignment[BarcodeAlignment["BottomCenter"] = 512] = "BottomCenter";
                BarcodeAlignment[BarcodeAlignment["BottomRight"] = 1024] = "BottomRight";
            })(BarcodeAlignment = Printing.BarcodeAlignment || (Printing.BarcodeAlignment = {}));
            ;
            var BearerBarStyle;
            (function (BearerBarStyle) {
                BearerBarStyle[BearerBarStyle["None"] = 0] = "None";
                BearerBarStyle[BearerBarStyle["Frame"] = 1] = "Frame";
                BearerBarStyle[BearerBarStyle["HorizontalRules"] = 2] = "HorizontalRules";
            })(BearerBarStyle = Printing.BearerBarStyle || (Printing.BearerBarStyle = {}));
            ;
            var CodabarStartStopChar;
            (function (CodabarStartStopChar) {
                CodabarStartStopChar[CodabarStartStopChar["A"] = 0] = "A";
                CodabarStartStopChar[CodabarStartStopChar["B"] = 1] = "B";
                CodabarStartStopChar[CodabarStartStopChar["C"] = 2] = "C";
                CodabarStartStopChar[CodabarStartStopChar["D"] = 3] = "D";
            })(CodabarStartStopChar = Printing.CodabarStartStopChar || (Printing.CodabarStartStopChar = {}));
            ;
            var Code128;
            (function (Code128) {
                Code128[Code128["Auto"] = 0] = "Auto";
                Code128[Code128["A"] = 1] = "A";
                Code128[Code128["B"] = 2] = "B";
                Code128[Code128["C"] = 3] = "C";
            })(Code128 = Printing.Code128 || (Printing.Code128 = {}));
            ;
            var Code16K;
            (function (Code16K) {
                Code16K[Code16K["Mode0"] = 0] = "Mode0";
                Code16K[Code16K["Mode1"] = 1] = "Mode1";
                Code16K[Code16K["Mode2"] = 2] = "Mode2";
            })(Code16K = Printing.Code16K || (Printing.Code16K = {}));
            ;
            var BarcodeTextAlignment;
            (function (BarcodeTextAlignment) {
                BarcodeTextAlignment[BarcodeTextAlignment["AboveCenter"] = 0] = "AboveCenter";
                BarcodeTextAlignment[BarcodeTextAlignment["AboveLeft"] = 1] = "AboveLeft";
                BarcodeTextAlignment[BarcodeTextAlignment["AboveRight"] = 2] = "AboveRight";
                BarcodeTextAlignment[BarcodeTextAlignment["AboveJustify"] = 3] = "AboveJustify";
                BarcodeTextAlignment[BarcodeTextAlignment["BelowCenter"] = 4] = "BelowCenter";
                BarcodeTextAlignment[BarcodeTextAlignment["BelowLeft"] = 5] = "BelowLeft";
                BarcodeTextAlignment[BarcodeTextAlignment["BelowRight"] = 6] = "BelowRight";
                BarcodeTextAlignment[BarcodeTextAlignment["BelowJustify"] = 7] = "BelowJustify";
            })(BarcodeTextAlignment = Printing.BarcodeTextAlignment || (Printing.BarcodeTextAlignment = {}));
            ;
            var DataMatrixEncoding;
            (function (DataMatrixEncoding) {
                DataMatrixEncoding[DataMatrixEncoding["Auto"] = 0] = "Auto";
                DataMatrixEncoding[DataMatrixEncoding["Ascii"] = 1] = "Ascii";
                DataMatrixEncoding[DataMatrixEncoding["C40"] = 2] = "C40";
                DataMatrixEncoding[DataMatrixEncoding["Text"] = 3] = "Text";
                DataMatrixEncoding[DataMatrixEncoding["Base256"] = 4] = "Base256";
            })(DataMatrixEncoding = Printing.DataMatrixEncoding || (Printing.DataMatrixEncoding = {}));
            ;
            var DataMatrixFormat;
            (function (DataMatrixFormat) {
                DataMatrixFormat[DataMatrixFormat["Auto"] = 0] = "Auto";
                DataMatrixFormat[DataMatrixFormat["AutoDMRE"] = 1] = "AutoDMRE";
                DataMatrixFormat[DataMatrixFormat["C10X10"] = 2] = "C10X10";
                DataMatrixFormat[DataMatrixFormat["C12X12"] = 3] = "C12X12";
                DataMatrixFormat[DataMatrixFormat["C8X18"] = 4] = "C8X18";
                DataMatrixFormat[DataMatrixFormat["C14X14"] = 5] = "C14X14";
                DataMatrixFormat[DataMatrixFormat["C8X32"] = 6] = "C8X32";
                DataMatrixFormat[DataMatrixFormat["C16X16"] = 7] = "C16X16";
                DataMatrixFormat[DataMatrixFormat["C12X26"] = 8] = "C12X26";
                DataMatrixFormat[DataMatrixFormat["C18X18"] = 9] = "C18X18";
                DataMatrixFormat[DataMatrixFormat["C20X20"] = 10] = "C20X20";
                DataMatrixFormat[DataMatrixFormat["C12X36"] = 11] = "C12X36";
                DataMatrixFormat[DataMatrixFormat["C22X22"] = 12] = "C22X22";
                DataMatrixFormat[DataMatrixFormat["C16X36"] = 13] = "C16X36";
                DataMatrixFormat[DataMatrixFormat["C24X24"] = 14] = "C24X24";
                DataMatrixFormat[DataMatrixFormat["C26X26"] = 15] = "C26X26";
                DataMatrixFormat[DataMatrixFormat["C16X48"] = 16] = "C16X48";
                DataMatrixFormat[DataMatrixFormat["C32X32"] = 17] = "C32X32";
                DataMatrixFormat[DataMatrixFormat["C36X36"] = 18] = "C36X36";
                DataMatrixFormat[DataMatrixFormat["C40X40"] = 19] = "C40X40";
                DataMatrixFormat[DataMatrixFormat["C44X44"] = 20] = "C44X44";
                DataMatrixFormat[DataMatrixFormat["C48X48"] = 21] = "C48X48";
                DataMatrixFormat[DataMatrixFormat["C52X52"] = 22] = "C52X52";
                DataMatrixFormat[DataMatrixFormat["C64X64"] = 23] = "C64X64";
                DataMatrixFormat[DataMatrixFormat["C72X72"] = 24] = "C72X72";
                DataMatrixFormat[DataMatrixFormat["C80X80"] = 25] = "C80X80";
                DataMatrixFormat[DataMatrixFormat["C88X88"] = 26] = "C88X88";
                DataMatrixFormat[DataMatrixFormat["C96X96"] = 27] = "C96X96";
                DataMatrixFormat[DataMatrixFormat["C104X104"] = 28] = "C104X104";
                DataMatrixFormat[DataMatrixFormat["C120X120"] = 29] = "C120X120";
                DataMatrixFormat[DataMatrixFormat["C132X132"] = 30] = "C132X132";
                DataMatrixFormat[DataMatrixFormat["C144X144"] = 31] = "C144X144";
                DataMatrixFormat[DataMatrixFormat["DMRE8X48"] = 32] = "DMRE8X48";
                DataMatrixFormat[DataMatrixFormat["DMRE8X64"] = 33] = "DMRE8X64";
                DataMatrixFormat[DataMatrixFormat["DMRE12X64"] = 34] = "DMRE12X64";
                DataMatrixFormat[DataMatrixFormat["DMRE24X32"] = 35] = "DMRE24X32";
                DataMatrixFormat[DataMatrixFormat["DMRE26X32"] = 36] = "DMRE26X32";
                DataMatrixFormat[DataMatrixFormat["DMRE24X36"] = 37] = "DMRE24X36";
                DataMatrixFormat[DataMatrixFormat["DMRE16X64"] = 38] = "DMRE16X64";
                DataMatrixFormat[DataMatrixFormat["DMRE26X40"] = 39] = "DMRE26X40";
                DataMatrixFormat[DataMatrixFormat["DMRE24X48"] = 40] = "DMRE24X48";
                DataMatrixFormat[DataMatrixFormat["DMRE26X48"] = 41] = "DMRE26X48";
                DataMatrixFormat[DataMatrixFormat["DMRE24X64"] = 42] = "DMRE24X64";
                DataMatrixFormat[DataMatrixFormat["DMRE26X64"] = 43] = "DMRE26X64";
            })(DataMatrixFormat = Printing.DataMatrixFormat || (Printing.DataMatrixFormat = {}));
            ;
            var Supplement;
            (function (Supplement) {
                Supplement[Supplement["None"] = 0] = "None";
                Supplement[Supplement["Digits2"] = 1] = "Digits2";
                Supplement[Supplement["Digits5"] = 2] = "Digits5";
            })(Supplement = Printing.Supplement || (Printing.Supplement = {}));
            ;
            var BarcodeErrorBehavior;
            (function (BarcodeErrorBehavior) {
                BarcodeErrorBehavior[BarcodeErrorBehavior["BlankImage"] = 0] = "BlankImage";
                BarcodeErrorBehavior[BarcodeErrorBehavior["ThrowException"] = 2] = "ThrowException";
            })(BarcodeErrorBehavior = Printing.BarcodeErrorBehavior || (Printing.BarcodeErrorBehavior = {}));
            var HanXinCodeEncoding;
            (function (HanXinCodeEncoding) {
                HanXinCodeEncoding[HanXinCodeEncoding["Auto"] = 0] = "Auto";
                HanXinCodeEncoding[HanXinCodeEncoding["Numeric"] = 1] = "Numeric";
                HanXinCodeEncoding[HanXinCodeEncoding["Text"] = 2] = "Text";
                HanXinCodeEncoding[HanXinCodeEncoding["BinaryByte"] = 3] = "BinaryByte";
                HanXinCodeEncoding[HanXinCodeEncoding["ChineseReg1"] = 4] = "ChineseReg1";
                HanXinCodeEncoding[HanXinCodeEncoding["ChineseReg2"] = 5] = "ChineseReg2";
                HanXinCodeEncoding[HanXinCodeEncoding["GB18030Bytes2"] = 6] = "GB18030Bytes2";
                HanXinCodeEncoding[HanXinCodeEncoding["GB18030Bytes4"] = 7] = "GB18030Bytes4";
            })(HanXinCodeEncoding = Printing.HanXinCodeEncoding || (Printing.HanXinCodeEncoding = {}));
            var HanXinCodeErrorCorrectionLevel;
            (function (HanXinCodeErrorCorrectionLevel) {
                HanXinCodeErrorCorrectionLevel[HanXinCodeErrorCorrectionLevel["L1"] = 0] = "L1";
                HanXinCodeErrorCorrectionLevel[HanXinCodeErrorCorrectionLevel["L2"] = 1] = "L2";
                HanXinCodeErrorCorrectionLevel[HanXinCodeErrorCorrectionLevel["L3"] = 2] = "L3";
                HanXinCodeErrorCorrectionLevel[HanXinCodeErrorCorrectionLevel["L4"] = 3] = "L4";
            })(HanXinCodeErrorCorrectionLevel = Printing.HanXinCodeErrorCorrectionLevel || (Printing.HanXinCodeErrorCorrectionLevel = {}));
            ;
            var HanXinCodeVersion;
            (function (HanXinCodeVersion) {
                HanXinCodeVersion[HanXinCodeVersion["Auto"] = 0] = "Auto";
                HanXinCodeVersion[HanXinCodeVersion["V01"] = 1] = "V01";
                HanXinCodeVersion[HanXinCodeVersion["V02"] = 2] = "V02";
                HanXinCodeVersion[HanXinCodeVersion["V03"] = 3] = "V03";
                HanXinCodeVersion[HanXinCodeVersion["V04"] = 4] = "V04";
                HanXinCodeVersion[HanXinCodeVersion["V05"] = 5] = "V05";
                HanXinCodeVersion[HanXinCodeVersion["V06"] = 6] = "V06";
                HanXinCodeVersion[HanXinCodeVersion["V07"] = 7] = "V07";
                HanXinCodeVersion[HanXinCodeVersion["V08"] = 8] = "V08";
                HanXinCodeVersion[HanXinCodeVersion["V09"] = 9] = "V09";
                HanXinCodeVersion[HanXinCodeVersion["V10"] = 10] = "V10";
                HanXinCodeVersion[HanXinCodeVersion["V11"] = 11] = "V11";
                HanXinCodeVersion[HanXinCodeVersion["V12"] = 12] = "V12";
                HanXinCodeVersion[HanXinCodeVersion["V13"] = 13] = "V13";
                HanXinCodeVersion[HanXinCodeVersion["V14"] = 14] = "V14";
                HanXinCodeVersion[HanXinCodeVersion["V15"] = 15] = "V15";
                HanXinCodeVersion[HanXinCodeVersion["V16"] = 16] = "V16";
                HanXinCodeVersion[HanXinCodeVersion["V17"] = 17] = "V17";
                HanXinCodeVersion[HanXinCodeVersion["V18"] = 18] = "V18";
                HanXinCodeVersion[HanXinCodeVersion["V19"] = 19] = "V19";
                HanXinCodeVersion[HanXinCodeVersion["V20"] = 20] = "V20";
                HanXinCodeVersion[HanXinCodeVersion["V21"] = 21] = "V21";
                HanXinCodeVersion[HanXinCodeVersion["V22"] = 22] = "V22";
                HanXinCodeVersion[HanXinCodeVersion["V23"] = 23] = "V23";
                HanXinCodeVersion[HanXinCodeVersion["V24"] = 24] = "V24";
                HanXinCodeVersion[HanXinCodeVersion["V25"] = 25] = "V25";
                HanXinCodeVersion[HanXinCodeVersion["V26"] = 26] = "V26";
                HanXinCodeVersion[HanXinCodeVersion["V27"] = 27] = "V27";
                HanXinCodeVersion[HanXinCodeVersion["V28"] = 28] = "V28";
                HanXinCodeVersion[HanXinCodeVersion["V29"] = 29] = "V29";
                HanXinCodeVersion[HanXinCodeVersion["V30"] = 30] = "V30";
                HanXinCodeVersion[HanXinCodeVersion["V31"] = 31] = "V31";
                HanXinCodeVersion[HanXinCodeVersion["V32"] = 32] = "V32";
                HanXinCodeVersion[HanXinCodeVersion["V33"] = 33] = "V33";
                HanXinCodeVersion[HanXinCodeVersion["V34"] = 34] = "V34";
                HanXinCodeVersion[HanXinCodeVersion["V35"] = 35] = "V35";
                HanXinCodeVersion[HanXinCodeVersion["V36"] = 36] = "V36";
                HanXinCodeVersion[HanXinCodeVersion["V37"] = 37] = "V37";
                HanXinCodeVersion[HanXinCodeVersion["V38"] = 38] = "V38";
                HanXinCodeVersion[HanXinCodeVersion["V39"] = 39] = "V39";
                HanXinCodeVersion[HanXinCodeVersion["V40"] = 40] = "V40";
                HanXinCodeVersion[HanXinCodeVersion["V41"] = 41] = "V41";
                HanXinCodeVersion[HanXinCodeVersion["V42"] = 42] = "V42";
                HanXinCodeVersion[HanXinCodeVersion["V43"] = 43] = "V43";
                HanXinCodeVersion[HanXinCodeVersion["V44"] = 44] = "V44";
                HanXinCodeVersion[HanXinCodeVersion["V45"] = 45] = "V45";
                HanXinCodeVersion[HanXinCodeVersion["V46"] = 46] = "V46";
                HanXinCodeVersion[HanXinCodeVersion["V47"] = 47] = "V47";
                HanXinCodeVersion[HanXinCodeVersion["V48"] = 48] = "V48";
                HanXinCodeVersion[HanXinCodeVersion["V49"] = 49] = "V49";
                HanXinCodeVersion[HanXinCodeVersion["V50"] = 50] = "V50";
                HanXinCodeVersion[HanXinCodeVersion["V51"] = 51] = "V51";
                HanXinCodeVersion[HanXinCodeVersion["V52"] = 52] = "V52";
                HanXinCodeVersion[HanXinCodeVersion["V53"] = 53] = "V53";
                HanXinCodeVersion[HanXinCodeVersion["V54"] = 54] = "V54";
                HanXinCodeVersion[HanXinCodeVersion["V55"] = 55] = "V55";
                HanXinCodeVersion[HanXinCodeVersion["V56"] = 56] = "V56";
                HanXinCodeVersion[HanXinCodeVersion["V57"] = 57] = "V57";
                HanXinCodeVersion[HanXinCodeVersion["V58"] = 58] = "V58";
                HanXinCodeVersion[HanXinCodeVersion["V59"] = 59] = "V59";
                HanXinCodeVersion[HanXinCodeVersion["V60"] = 60] = "V60";
                HanXinCodeVersion[HanXinCodeVersion["V61"] = 61] = "V61";
                HanXinCodeVersion[HanXinCodeVersion["V62"] = 62] = "V62";
                HanXinCodeVersion[HanXinCodeVersion["V63"] = 63] = "V63";
                HanXinCodeVersion[HanXinCodeVersion["V64"] = 64] = "V64";
                HanXinCodeVersion[HanXinCodeVersion["V65"] = 65] = "V65";
                HanXinCodeVersion[HanXinCodeVersion["V66"] = 66] = "V66";
                HanXinCodeVersion[HanXinCodeVersion["V67"] = 67] = "V67";
                HanXinCodeVersion[HanXinCodeVersion["V68"] = 68] = "V68";
                HanXinCodeVersion[HanXinCodeVersion["V69"] = 69] = "V69";
                HanXinCodeVersion[HanXinCodeVersion["V70"] = 70] = "V70";
                HanXinCodeVersion[HanXinCodeVersion["V71"] = 71] = "V71";
                HanXinCodeVersion[HanXinCodeVersion["V72"] = 72] = "V72";
                HanXinCodeVersion[HanXinCodeVersion["V73"] = 73] = "V73";
                HanXinCodeVersion[HanXinCodeVersion["V74"] = 74] = "V74";
                HanXinCodeVersion[HanXinCodeVersion["V75"] = 75] = "V75";
                HanXinCodeVersion[HanXinCodeVersion["V76"] = 76] = "V76";
                HanXinCodeVersion[HanXinCodeVersion["V77"] = 77] = "V77";
                HanXinCodeVersion[HanXinCodeVersion["V78"] = 78] = "V78";
                HanXinCodeVersion[HanXinCodeVersion["V79"] = 79] = "V79";
                HanXinCodeVersion[HanXinCodeVersion["V80"] = 80] = "V80";
                HanXinCodeVersion[HanXinCodeVersion["V81"] = 81] = "V81";
                HanXinCodeVersion[HanXinCodeVersion["V82"] = 82] = "V82";
                HanXinCodeVersion[HanXinCodeVersion["V83"] = 83] = "V83";
                HanXinCodeVersion[HanXinCodeVersion["V84"] = 84] = "V84";
            })(HanXinCodeVersion = Printing.HanXinCodeVersion || (Printing.HanXinCodeVersion = {}));
            ;
            var Isbt128DataStructure;
            (function (Isbt128DataStructure) {
                Isbt128DataStructure[Isbt128DataStructure["DS001"] = 0] = "DS001";
                //     Blood Groups (ABO and RhD)
                Isbt128DataStructure[Isbt128DataStructure["DS002"] = 1] = "DS002";
                Isbt128DataStructure[Isbt128DataStructure["DS003"] = 2] = "DS003";
                Isbt128DataStructure[Isbt128DataStructure["DS004"] = 3] = "DS004";
                Isbt128DataStructure[Isbt128DataStructure["DS005"] = 4] = "DS005";
                Isbt128DataStructure[Isbt128DataStructure["DS006"] = 5] = "DS006";
                Isbt128DataStructure[Isbt128DataStructure["DS007"] = 6] = "DS007";
                Isbt128DataStructure[Isbt128DataStructure["DS008"] = 7] = "DS008";
                Isbt128DataStructure[Isbt128DataStructure["DS009"] = 8] = "DS009";
                //     Special Testing: General
                Isbt128DataStructure[Isbt128DataStructure["DS010"] = 9] = "DS010";
                //     Special Testing: Red Blood Cell Antigens (withdrawn)
                Isbt128DataStructure[Isbt128DataStructure["DS011"] = 10] = "DS011";
                //     Special Testing: Red Blood Cell Antigens - General
                Isbt128DataStructure[Isbt128DataStructure["DS012"] = 11] = "DS012";
                //     Special Testing: Red Blood Cell Antigens - Finnish
                Isbt128DataStructure[Isbt128DataStructure["DS013"] = 12] = "DS013";
                //     Special Testing: Platelet HLA and Platelet-Specific Antigens
                Isbt128DataStructure[Isbt128DataStructure["DS014"] = 13] = "DS014";
                //     Special Testing: HLA-A and -B Alleles
                Isbt128DataStructure[Isbt128DataStructure["DS015"] = 14] = "DS015";
                //     Special Testing: HLA-DRB1 Alleles
                Isbt128DataStructure[Isbt128DataStructure["DS016"] = 15] = "DS016";
                Isbt128DataStructure[Isbt128DataStructure["DS017"] = 16] = "DS017";
                Isbt128DataStructure[Isbt128DataStructure["DS018"] = 17] = "DS018";
                Isbt128DataStructure[Isbt128DataStructure["DS019"] = 18] = "DS019";
                Isbt128DataStructure[Isbt128DataStructure["DS020"] = 19] = "DS020";
                //     Manufacturer and Catalog Number: Items Other Than Containers
                Isbt128DataStructure[Isbt128DataStructure["DS021"] = 20] = "DS021";
                //     Lot Number: Items Other Than Containers
                Isbt128DataStructure[Isbt128DataStructure["DS022"] = 21] = "DS022";
                Isbt128DataStructure[Isbt128DataStructure["DS023"] = 22] = "DS023";
                Isbt128DataStructure[Isbt128DataStructure["DS024"] = 23] = "DS024";
                Isbt128DataStructure[Isbt128DataStructure["DS025"] = 24] = "DS025";
                Isbt128DataStructure[Isbt128DataStructure["DS026"] = 25] = "DS026";
                Isbt128DataStructure[Isbt128DataStructure["DS027"] = 26] = "DS027";
                Isbt128DataStructure[Isbt128DataStructure["DS028"] = 27] = "DS028";
                Isbt128DataStructure[Isbt128DataStructure["DS029"] = 28] = "DS029";
                Isbt128DataStructure[Isbt128DataStructure["DS030"] = 29] = "DS030";
                Isbt128DataStructure[Isbt128DataStructure["DS031"] = 30] = "DS031";
                Isbt128DataStructure[Isbt128DataStructure["DS032"] = 31] = "DS032";
                Isbt128DataStructure[Isbt128DataStructure["DS033"] = 32] = "DS033";
                Isbt128DataStructure[Isbt128DataStructure["DS034"] = 33] = "DS034";
            })(Isbt128DataStructure = Printing.Isbt128DataStructure || (Printing.Isbt128DataStructure = {}));
            ;
            var ItfHmark;
            (function (ItfHmark) {
                ItfHmark[ItfHmark["None"] = 0] = "None";
                ItfHmark[ItfHmark["Mark1"] = 1] = "Mark1";
                ItfHmark[ItfHmark["Mark2"] = 2] = "Mark2";
                ItfHmark[ItfHmark["Mark3"] = 3] = "Mark3";
                ItfHmark[ItfHmark["Mark4"] = 4] = "Mark4";
                ItfHmark[ItfHmark["Mark5"] = 5] = "Mark5";
                ItfHmark[ItfHmark["Mark6"] = 6] = "Mark6";
                ItfHmark[ItfHmark["Mark7"] = 7] = "Mark7";
            })(ItfHmark = Printing.ItfHmark || (Printing.ItfHmark = {}));
            ;
            var MaxiCodeModes;
            (function (MaxiCodeModes) {
                //     code (U.S.).
                MaxiCodeModes[MaxiCodeModes["Mode2"] = 2] = "Mode2";
                //     postal code (non-U.S.).
                MaxiCodeModes[MaxiCodeModes["Mode3"] = 3] = "Mode3";
                //     Indicates the symbol contains general-purpose data, protected by the standard
                //     error correction.
                MaxiCodeModes[MaxiCodeModes["Mode4"] = 4] = "Mode4";
                //     Indicates the symbol contains general-purpose data, protected by enhanced error
                //     correction (EEC).
                MaxiCodeModes[MaxiCodeModes["Mode5"] = 5] = "Mode5";
                //     Reserved for symbols used to program internal parameters of MaxiCode readers.
                MaxiCodeModes[MaxiCodeModes["Mode6"] = 6] = "Mode6";
            })(MaxiCodeModes = Printing.MaxiCodeModes || (Printing.MaxiCodeModes = {}));
            ;
            var MicroPdf417Version;
            (function (MicroPdf417Version) {
                MicroPdf417Version[MicroPdf417Version["Auto"] = 0] = "Auto";
                MicroPdf417Version[MicroPdf417Version["V1X11"] = 1] = "V1X11";
                MicroPdf417Version[MicroPdf417Version["V1X14"] = 2] = "V1X14";
                MicroPdf417Version[MicroPdf417Version["V1X17"] = 3] = "V1X17";
                MicroPdf417Version[MicroPdf417Version["V1X20"] = 4] = "V1X20";
                MicroPdf417Version[MicroPdf417Version["V1X24"] = 5] = "V1X24";
                MicroPdf417Version[MicroPdf417Version["V1X28"] = 6] = "V1X28";
                MicroPdf417Version[MicroPdf417Version["V2X8"] = 7] = "V2X8";
                MicroPdf417Version[MicroPdf417Version["V2X11"] = 8] = "V2X11";
                MicroPdf417Version[MicroPdf417Version["V2X14"] = 9] = "V2X14";
                MicroPdf417Version[MicroPdf417Version["V2X17"] = 10] = "V2X17";
                MicroPdf417Version[MicroPdf417Version["V2X20"] = 11] = "V2X20";
                MicroPdf417Version[MicroPdf417Version["V2X23"] = 12] = "V2X23";
                MicroPdf417Version[MicroPdf417Version["V2X26"] = 13] = "V2X26";
                MicroPdf417Version[MicroPdf417Version["V3X6"] = 14] = "V3X6";
                MicroPdf417Version[MicroPdf417Version["V3X8"] = 15] = "V3X8";
                MicroPdf417Version[MicroPdf417Version["V3X10"] = 16] = "V3X10";
                MicroPdf417Version[MicroPdf417Version["V3X12"] = 17] = "V3X12";
                MicroPdf417Version[MicroPdf417Version["V3X15"] = 18] = "V3X15";
                MicroPdf417Version[MicroPdf417Version["V3X20"] = 19] = "V3X20";
                MicroPdf417Version[MicroPdf417Version["V3X26"] = 20] = "V3X26";
                MicroPdf417Version[MicroPdf417Version["V3X32"] = 21] = "V3X32";
                MicroPdf417Version[MicroPdf417Version["V3X38"] = 22] = "V3X38";
                MicroPdf417Version[MicroPdf417Version["V3X44"] = 23] = "V3X44";
                MicroPdf417Version[MicroPdf417Version["V4X4"] = 24] = "V4X4";
                MicroPdf417Version[MicroPdf417Version["V4X6"] = 25] = "V4X6";
                MicroPdf417Version[MicroPdf417Version["V4X8"] = 26] = "V4X8";
                MicroPdf417Version[MicroPdf417Version["V4X10"] = 27] = "V4X10";
                MicroPdf417Version[MicroPdf417Version["V4X12"] = 28] = "V4X12";
                MicroPdf417Version[MicroPdf417Version["V4X15"] = 29] = "V4X15";
                MicroPdf417Version[MicroPdf417Version["V4X20"] = 30] = "V4X20";
                MicroPdf417Version[MicroPdf417Version["V4X26"] = 31] = "V4X26";
                MicroPdf417Version[MicroPdf417Version["V4X32"] = 32] = "V4X32";
                MicroPdf417Version[MicroPdf417Version["V4X38"] = 33] = "V4X38";
                MicroPdf417Version[MicroPdf417Version["V4X44"] = 34] = "V4X44";
            })(MicroPdf417Version = Printing.MicroPdf417Version || (Printing.MicroPdf417Version = {}));
            ;
            var MicroQRCodeVersion;
            (function (MicroQRCodeVersion) {
                MicroQRCodeVersion[MicroQRCodeVersion["Auto"] = 0] = "Auto";
                MicroQRCodeVersion[MicroQRCodeVersion["M1"] = 1] = "M1";
                MicroQRCodeVersion[MicroQRCodeVersion["M2"] = 2] = "M2";
                MicroQRCodeVersion[MicroQRCodeVersion["M3"] = 3] = "M3";
                MicroQRCodeVersion[MicroQRCodeVersion["M4"] = 4] = "M4";
            })(MicroQRCodeVersion = Printing.MicroQRCodeVersion || (Printing.MicroQRCodeVersion = {}));
            ;
            var MsiChecksum;
            (function (MsiChecksum) {
                MsiChecksum[MsiChecksum["OneMod10"] = 0] = "OneMod10";
                MsiChecksum[MsiChecksum["TwoMod10"] = 1] = "TwoMod10";
                MsiChecksum[MsiChecksum["Mod11AndMod10"] = 2] = "Mod11AndMod10";
            })(MsiChecksum = Printing.MsiChecksum || (Printing.MsiChecksum = {}));
            ;
            var Pdf417CompactionType;
            (function (Pdf417CompactionType) {
                //     It switches between Text, Binary and Numeric modes in order to minimize the number
                //     of codewords to be encoded.
                Pdf417CompactionType[Pdf417CompactionType["Auto"] = 0] = "Auto";
                //     It allows encoding all 256 possible 8-bit byte values. This includes all ASCII
                //     set support.
                Pdf417CompactionType[Pdf417CompactionType["Binary"] = 1] = "Binary";
                //     It allows encoding all printable ASCII characters, i.e. values from 32 to 126
                //     inclusive in accordance with ISO/IEC 646, as well as selected control characters
                //     such as TAB (horizontal tab ASCII 9), LF (NL line feed, new line ASCII 10) and
                //     CR (carriage return ASCII 13).
                Pdf417CompactionType[Pdf417CompactionType["Text"] = 2] = "Text";
                //     It allows encoding numeric data strings.
                Pdf417CompactionType[Pdf417CompactionType["Numeric"] = 3] = "Numeric";
            })(Pdf417CompactionType = Printing.Pdf417CompactionType || (Printing.Pdf417CompactionType = {}));
            ;
            var Pdf417ErrorCorrection;
            (function (Pdf417ErrorCorrection) {
                Pdf417ErrorCorrection[Pdf417ErrorCorrection["Level0"] = 0] = "Level0";
                Pdf417ErrorCorrection[Pdf417ErrorCorrection["Level1"] = 1] = "Level1";
                Pdf417ErrorCorrection[Pdf417ErrorCorrection["Level2"] = 2] = "Level2";
                Pdf417ErrorCorrection[Pdf417ErrorCorrection["Level3"] = 3] = "Level3";
                Pdf417ErrorCorrection[Pdf417ErrorCorrection["Level4"] = 4] = "Level4";
                Pdf417ErrorCorrection[Pdf417ErrorCorrection["Level5"] = 5] = "Level5";
                Pdf417ErrorCorrection[Pdf417ErrorCorrection["Level6"] = 6] = "Level6";
                Pdf417ErrorCorrection[Pdf417ErrorCorrection["Level7"] = 7] = "Level7";
                Pdf417ErrorCorrection[Pdf417ErrorCorrection["Level8"] = 8] = "Level8";
            })(Pdf417ErrorCorrection = Printing.Pdf417ErrorCorrection || (Printing.Pdf417ErrorCorrection = {}));
            ;
            var QRCodeEncoding;
            (function (QRCodeEncoding) {
                QRCodeEncoding[QRCodeEncoding["Auto"] = 0] = "Auto";
                QRCodeEncoding[QRCodeEncoding["Numeric"] = 1] = "Numeric";
                QRCodeEncoding[QRCodeEncoding["AlphaNumeric"] = 2] = "AlphaNumeric";
                QRCodeEncoding[QRCodeEncoding["Kanji"] = 3] = "Kanji";
                QRCodeEncoding[QRCodeEncoding["Byte"] = 4] = "Byte";
            })(QRCodeEncoding = Printing.QRCodeEncoding || (Printing.QRCodeEncoding = {}));
            ;
            var QRCodeErrorCorrectionLevel;
            (function (QRCodeErrorCorrectionLevel) {
                //     Approx. 7% of codewords can be restored. Error correction level L is appropriate
                //     for high symbol quality and/or the need for the smallest possible symbol.
                QRCodeErrorCorrectionLevel[QRCodeErrorCorrectionLevel["L"] = 0] = "L";
                //     Approx. 15% of codewords can be restored. Level M is described as Standard level
                //     and offers a good compromise between small size and increased reliability.
                QRCodeErrorCorrectionLevel[QRCodeErrorCorrectionLevel["M"] = 1] = "M";
                //     Approx. 25% of codewords can be restored. Level Q is a High reliability level
                //     and suitable for more critical or poor print quality applications.
                QRCodeErrorCorrectionLevel[QRCodeErrorCorrectionLevel["Q"] = 2] = "Q";
                //     Approx. 30% of codewords can be restored. Level H offers the maximum achievable
                //     reliability.
                QRCodeErrorCorrectionLevel[QRCodeErrorCorrectionLevel["H"] = 3] = "H";
            })(QRCodeErrorCorrectionLevel = Printing.QRCodeErrorCorrectionLevel || (Printing.QRCodeErrorCorrectionLevel = {}));
            ;
            var QRCodeVersion;
            (function (QRCodeVersion) {
                QRCodeVersion[QRCodeVersion["Auto"] = 0] = "Auto";
                QRCodeVersion[QRCodeVersion["V01"] = 1] = "V01";
                QRCodeVersion[QRCodeVersion["V02"] = 2] = "V02";
                QRCodeVersion[QRCodeVersion["V03"] = 3] = "V03";
                QRCodeVersion[QRCodeVersion["V04"] = 4] = "V04";
                QRCodeVersion[QRCodeVersion["V05"] = 5] = "V05";
                QRCodeVersion[QRCodeVersion["V06"] = 6] = "V06";
                QRCodeVersion[QRCodeVersion["V07"] = 7] = "V07";
                QRCodeVersion[QRCodeVersion["V08"] = 8] = "V08";
                QRCodeVersion[QRCodeVersion["V09"] = 9] = "V09";
                QRCodeVersion[QRCodeVersion["V10"] = 10] = "V10";
                QRCodeVersion[QRCodeVersion["V11"] = 11] = "V11";
                QRCodeVersion[QRCodeVersion["V12"] = 12] = "V12";
                QRCodeVersion[QRCodeVersion["V13"] = 13] = "V13";
                QRCodeVersion[QRCodeVersion["V14"] = 14] = "V14";
                QRCodeVersion[QRCodeVersion["V15"] = 15] = "V15";
                QRCodeVersion[QRCodeVersion["V16"] = 16] = "V16";
                QRCodeVersion[QRCodeVersion["V17"] = 17] = "V17";
                QRCodeVersion[QRCodeVersion["V18"] = 18] = "V18";
                QRCodeVersion[QRCodeVersion["V19"] = 19] = "V19";
                QRCodeVersion[QRCodeVersion["V20"] = 20] = "V20";
                QRCodeVersion[QRCodeVersion["V21"] = 21] = "V21";
                QRCodeVersion[QRCodeVersion["V22"] = 22] = "V22";
                QRCodeVersion[QRCodeVersion["V23"] = 23] = "V23";
                QRCodeVersion[QRCodeVersion["V24"] = 24] = "V24";
                QRCodeVersion[QRCodeVersion["V25"] = 25] = "V25";
                QRCodeVersion[QRCodeVersion["V26"] = 26] = "V26";
                QRCodeVersion[QRCodeVersion["V27"] = 27] = "V27";
                QRCodeVersion[QRCodeVersion["V28"] = 28] = "V28";
                QRCodeVersion[QRCodeVersion["V29"] = 29] = "V29";
                QRCodeVersion[QRCodeVersion["V30"] = 30] = "V30";
                QRCodeVersion[QRCodeVersion["V31"] = 31] = "V31";
                QRCodeVersion[QRCodeVersion["V32"] = 32] = "V32";
                QRCodeVersion[QRCodeVersion["V33"] = 33] = "V33";
                QRCodeVersion[QRCodeVersion["V34"] = 34] = "V34";
                QRCodeVersion[QRCodeVersion["V35"] = 35] = "V35";
                QRCodeVersion[QRCodeVersion["V36"] = 36] = "V36";
                QRCodeVersion[QRCodeVersion["V37"] = 37] = "V37";
                QRCodeVersion[QRCodeVersion["V38"] = 38] = "V38";
                QRCodeVersion[QRCodeVersion["V39"] = 39] = "V39";
                QRCodeVersion[QRCodeVersion["V40"] = 40] = "V40";
            })(QRCodeVersion = Printing.QRCodeVersion || (Printing.QRCodeVersion = {}));
            ;
            var BarcodeSizing;
            (function (BarcodeSizing) {
                //     The barcode content preserves size which is based on all barcode-related dimensions
                //     involved such as BarWidth, BarHeight, BarRatio, etc.
                BarcodeSizing[BarcodeSizing["None"] = 0] = "None";
                //     The barcode content is resized to fill the destination dimensions. The aspect
                //     ratio is not preserved.
                BarcodeSizing[BarcodeSizing["Fill"] = 1] = "Fill";
                //     The barcode symbol is created by automatically calculating the bars or modules sizes 
                //     so it fits the available area proportinally.
                BarcodeSizing[BarcodeSizing["FitProportional"] = 2] = "FitProportional";
                //     The barcode symbol is resized based on all the specified barcode-related dimensions 
                //     such as BarWidth, BarHeight, BarRatio, 2D ModuleSize, etc.
                BarcodeSizing[BarcodeSizing["AutoSize"] = 3] = "AutoSize";
            })(BarcodeSizing = Printing.BarcodeSizing || (Printing.BarcodeSizing = {}));
            ;
            var BarcodeSymbology;
            (function (BarcodeSymbology) {
                //     Codabar a.k.a. ABC Codabar, CodaBar, USD-4, NW-7, Code 2 of 7, Monarch, Code-27,
                //     Ames code, Rationalized Codabar, 2 of 7 Code, ANSI/AIM Codabar, Uniform Symbology
                //     Specification Codabar, USS Codabar
                BarcodeSymbology[BarcodeSymbology["Codabar"] = 0] = "Codabar";
                //     Code 11 a.k.a. Code11, USD-8, USD8
                BarcodeSymbology[BarcodeSymbology["Code11"] = 1] = "Code11";
                BarcodeSymbology[BarcodeSymbology["Code16k"] = 2] = "Code16k";
                //     Code 39 a.k.a. ANSI/AIM Code 39, ANSI/AIM Code 39, Uniform Symbology Specification
                //     Code 39, USS Code 39, USS 39, Code 3/9, Code 3 of 9, USD-3, LOGMARS, Alpha39,
                //     Code 39 Extended, and Code 39 Full ASCII
                BarcodeSymbology[BarcodeSymbology["Code39"] = 3] = "Code39";
                //     Code 93 a.k.a. ANSI/AIM Code 93, ANSI/AIM Code 93, Uniform Symbology Specification
                //     Code 93, USS Code 93, USS 93, Code 9/3, USS-93, USD-3, Code 93 Extended, and
                BarcodeSymbology[BarcodeSymbology["Code93"] = 4] = "Code93";
                //     Code 128 a.k.a. ANSI/AIM 128, ANSI/AIM Code 128, USS Code 128, Uniform Symbology
                //     Specification Code 128, Code 128 Code Set A, Code 128 Code Set B, Code 128 Code
                //     Set C, Code 128A, Code 128B, Code 128C
                BarcodeSymbology[BarcodeSymbology["Code128"] = 5] = "Code128";
                //     Data Matrix a.k.a. Data Matrix ECC200
                BarcodeSymbology[BarcodeSymbology["DataMatrix"] = 6] = "DataMatrix";
                //     EAN-8 a.k.a. European Article Number 8, EAN-8 Supplement 5/Five-digit Add-On,
                //     EAN-8 Supplement 2/Two-digit Add-On, EAN-8+5, EAN-8+2, EAN8, EAN8+5, EAN13+2,
                //     UPC-8, GTIN-8, GS1-8
                BarcodeSymbology[BarcodeSymbology["Ean8"] = 7] = "Ean8";
                //     EAN-13 a.k.a. European Article Number 13, EAN-13 Supplement 5/Five-digit Add-On,
                //     EAN-13 Supplement 2/Two-digit Add-On, EAN-13+5, EAN-13+2, EAN13, EAN13+5, EAN13+2,
                //     UPC-13, GTIN-13, GS1-13
                BarcodeSymbology[BarcodeSymbology["Ean13"] = 8] = "Ean13";
                //     Industrial 2 of 5 a.k.a. 2 of 5 Industrial, 2/5 Industrial, 2 of 5 Standard,
                //     Standard 2 of 5, 2/5 Standard, Code 2/5, 2 of 5, C 2 of 5
                BarcodeSymbology[BarcodeSymbology["Industrial2of5"] = 9] = "Industrial2of5";
                //     Interleaved 2 of 5 a.k.a. ANSI/AIM ITF 25, ANSI/AIM I-2/5, Uniform Symbology
                //     Specification ITF, USS ITF 2/5, ITF, I-2/5, 2 of 5 Interleaved, 2/5 Interleaved
                BarcodeSymbology[BarcodeSymbology["Interleaved2of5"] = 10] = "Interleaved2of5";
                //     ISBN a.k.a. International Standard Book Number, Bookland EAN, ISBN-13, ISBN-10,
                //     ISBN+5, ISBN+2, ISBN Supplement 5/Five-digit Add-On, ISBN Supplement 2/Two-digit
                //     Add-On
                BarcodeSymbology[BarcodeSymbology["Isbn"] = 11] = "Isbn";
                //     MSI a.k.a. MSI/Plessey, Modified Plessey
                BarcodeSymbology[BarcodeSymbology["Msi"] = 12] = "Msi";
                //     PDF417 a.k.a. Portable Data File 417, PDF 417, PDF417 Truncated
                BarcodeSymbology[BarcodeSymbology["Pdf417"] = 13] = "Pdf417";
                //     PLANET a.k.a. USPS PLANET Barcode, USPS Confirm Service Barcode
                BarcodeSymbology[BarcodeSymbology["Planet"] = 14] = "Planet";
                //     POSTNET a.k.a. USPS POSTNET Barcode, USPS POSTal Numeric Encoding Technique Barcode,
                //     Delivery Point Barcode (DPBC), Postnet 3 of 5
                BarcodeSymbology[BarcodeSymbology["Postnet"] = 15] = "Postnet";
                //     UCC/EAN-128 a.k.a. EAN-128, UCC-128, USS-128, GS1-128, UCC.EAN-128, GTIN-128
                BarcodeSymbology[BarcodeSymbology["UccEan128"] = 16] = "UccEan128";
                //     UPC-A a.k.a. Universal Product Code version A, UPC-A Supplement 5/Five-digit
                //     Add-On, UPC-A Supplement 2/Two-digit Add-On, UPC-A+5, UPC-A+2, UPC Code, UPC
                //     Symbol, GTIN-12, GS1-12
                BarcodeSymbology[BarcodeSymbology["UpcA"] = 17] = "UpcA";
                //     UPC-E a.k.a. Universal Product Code version E, UPC-E Supplement 5/Five-digit
                //     Add-On, UPC-E Supplement 2/Two-digit Add-On, UPC-E+5, UPC-E+2, UPC-E0, E0, UPC-E1,
                //     E1, GTIN-12 with lead 0, GS1-12
                BarcodeSymbology[BarcodeSymbology["UpcE"] = 18] = "UpcE";
                //     USPS OneCode 4-State Customer Barcode a.k.a. OneCode 4CB, USPS 4CB, 4-CB, 4-State
                //     Customer Barcode, USPS OneCode Solution Barcode
                BarcodeSymbology[BarcodeSymbology["UspsOneCode4CB"] = 19] = "UspsOneCode4CB";
                //     British Royal Mail 4-State Customer Barcode a.k.a. RM4SCC, RoyalMail4SCC, British
                //     Royal Mail 4-State Customer Code and Royal Mail Barcode
                BarcodeSymbology[BarcodeSymbology["RoyalMail"] = 20] = "RoyalMail";
                //     Australia Post 4-state Barcode a.k.a. Australian 4-state postal barcode, Australia
                BarcodeSymbology[BarcodeSymbology["AustraliaPost"] = 21] = "AustraliaPost";
                //     Royal TPG Post KIX 4-State Barcode a.k.a. Kix Barcode, Klantenindex (client index)
                //     Barcode, Dutch KIX 4-State Bar Code, Dutch KIX, TPG KIX, and TPGPOST KIX
                BarcodeSymbology[BarcodeSymbology["RoyalTpgPostKix"] = 22] = "RoyalTpgPostKix";
                //     SSCC-18 a.k.a. UPC-128 Shipping Container Code, Code 128 UPC Shipping Container
                //     Code, Serial Shipping Container Code, UCC-128, EAN-18, NVE (Nummer der Versandeinheit)
                BarcodeSymbology[BarcodeSymbology["Sscc18"] = 23] = "Sscc18";
                //     PZN a.k.a. Pharma-Zentral-Nummer, Pharmazentralnummer, Code PZN, CodePZN
                BarcodeSymbology[BarcodeSymbology["Pzn"] = 24] = "Pzn";
                //     Deutsche Post Leitcode Barcode a.k.a. German Postal 2 of 5 Leitcode, CodeLeitcode,
                //     Leitcode, Deutsche Post AG (DHL)
                BarcodeSymbology[BarcodeSymbology["DeutschePostLeitcode"] = 25] = "DeutschePostLeitcode";
                //     Deutsche Post Identcode Barcode a.k.a. German Postal 2 of 5 Identcode, Deutsche
                //     Post AG Identcode, Deutsche Frachtpost Identcode, Identcode, CodeIdentcode, Deutsche
                //     Post AG (DHL)
                BarcodeSymbology[BarcodeSymbology["DeutschePostIdentcode"] = 26] = "DeutschePostIdentcode";
                //     USPS Tray Label Barcode a.k.a. USPS 25 Tray label
                BarcodeSymbology[BarcodeSymbology["UspsTrayLabel"] = 27] = "UspsTrayLabel";
                //     USPS Sack Label Barcode a.k.a. USPS 25 Sack label
                BarcodeSymbology[BarcodeSymbology["UspsSackLabel"] = 28] = "UspsSackLabel";
                //     EAN-Velocity a.k.a. Velocity Barcode
                BarcodeSymbology[BarcodeSymbology["EanVelocity"] = 29] = "EanVelocity";
                //     Singapore 4-State Postal Code Barcode a.k.a. Singapore 4-State Postal, SingPost
                //     4-State, and SingPost Barcode
                BarcodeSymbology[BarcodeSymbology["SingaporePost"] = 30] = "SingaporePost";
                //     JAN-8 a.k.a. Japanese Article Number 8, JAN-8 Supplement 5/Five-digit Add-On,
                //     JAN-8 Supplement 2/Two-digit Add-On, JAN-8+5, JAN-8+2, JAN8, JAN8+5, JAN8+2
                BarcodeSymbology[BarcodeSymbology["Jan8"] = 31] = "Jan8";
                //     JAN-13 a.k.a. Japanese Article Number 13, JAN-13 Supplement 5/Five-digit Add-On,
                //     JAN-13 Supplement 2/Two-digit Add-On, JAN-13+5, JAN-13+2, JAN13, JAN13+5, JAN13+2
                BarcodeSymbology[BarcodeSymbology["Jan13"] = 32] = "Jan13";
                //     Swiss PostParcel Barcode a.k.a. SwissPost Parcel Barcode, Switzerland Post Parcel
                BarcodeSymbology[BarcodeSymbology["SwissPostParcel"] = 33] = "SwissPostParcel";
                //     OPC a.k.a. Optical Product Code, VCA Barcode, VCA OPC, Vision Council of America
                BarcodeSymbology[BarcodeSymbology["Opc"] = 34] = "Opc";
                //     EAN-99 a.k.a. European Article Number 99, EAN-99 Supplement 5/Five-digit Add-On,
                //     EAN-99 Supplement 2/Two-digit Add-On, EAN-99+5, EAN-99+2, EAN99, EAN99+5, EAN99+2,
                //     GTIN-99, GS1-99, Coupon Barcode
                BarcodeSymbology[BarcodeSymbology["Ean99"] = 35] = "Ean99";
                //     ITF-14 a.k.a. UPC Shipping Container Symbol ITF-14, ITF14, Case Code, UPC Case
                //     Code, EAN/UCC-14, EAN-14, UCC-14, DUN-14, GTIN-14
                BarcodeSymbology[BarcodeSymbology["Itf14"] = 36] = "Itf14";
                //     SCC-14 a.k.a. Shipping Container Code, EAN/UCC 14, DUN-14, EAN-14, UCC-14, UPC
                //     Case Code, UPC Shipping Container Code, Distribution Unit Number 14, SCC14, DUN14,
                //     EAN14, UCC14, EAN/UCC-14, Despatch Unit Number 14, GTIN-14
                BarcodeSymbology[BarcodeSymbology["Scc14"] = 37] = "Scc14";
                //     ISSN a.k.a. International Standard Serial Number, ISSN-13, ISSN-10, ISSN+5, ISSN+2,
                //     ISSN Supplement 5/Five-digit Add-On, ISSN Supplement 2/Two-digit Add-On
                BarcodeSymbology[BarcodeSymbology["Issn"] = 38] = "Issn";
                //     ISMN a.k.a. International Standard Music Number, ISMN-13, ISMN-10, ISMN+5, ISMN+2,
                //     ISMN Supplement 5/Five-digit Add-On, ISMN Supplement 2/Two-digit Add-On, ISO
                BarcodeSymbology[BarcodeSymbology["Ismn"] = 39] = "Ismn";
                //     Numly Number a.k.a. ESN, Electronic Serial Number, Electronic Standard Book Number,
                BarcodeSymbology[BarcodeSymbology["NumlyNumber"] = 40] = "NumlyNumber";
                //     QR Code a.k.a. Quick Response Code, QRCode Model 2, JIS X 0510, ISO-IEC 18004
                BarcodeSymbology[BarcodeSymbology["QRCode"] = 41] = "QRCode";
                //     USPS FIM a.k.a. Facing Identification Marks, FIM A B C D
                BarcodeSymbology[BarcodeSymbology["UspsFim"] = 42] = "UspsFim";
                BarcodeSymbology[BarcodeSymbology["UspsHorizontalBars"] = 43] = "UspsHorizontalBars";
                //     Telepen a.k.a. SB Telepen
                BarcodeSymbology[BarcodeSymbology["Telepen"] = 44] = "Telepen";
                //     Pharmacode a.k.a. Pharmacode Laetus, Pharmaceutical Binary Code
                BarcodeSymbology[BarcodeSymbology["Pharmacode"] = 45] = "Pharmacode";
                //     Semacode a.k.a. URL Barcode, Semacode Tag
                BarcodeSymbology[BarcodeSymbology["Semacode"] = 46] = "Semacode";
                //     Code 32 a.k.a. Italian Pharmacode, IMH, Codice 32 Pharmacode, Codice Farmaceutico
                //     Italiano, Radix 32 Barcode
                BarcodeSymbology[BarcodeSymbology["Code32"] = 47] = "Code32";
                //     USPS PIC UCC/EAN-128 a.k.a. USPS Package Identification Code, USPS Confirmation
                BarcodeSymbology[BarcodeSymbology["UspsPicUccEan128"] = 48] = "UspsPicUccEan128";
                //     FedEx Ground 96 a.k.a. FedEx 96 Barcode, FedEx Ground 96 UCC/EAN-128, 96 Barcode
                BarcodeSymbology[BarcodeSymbology["FedExGround96"] = 49] = "FedExGround96";
                //     Aztec Code a.k.a. AIM Aztec Barcode, ANSI/AIM BC13 ITS/97/002
                BarcodeSymbology[BarcodeSymbology["AztecCode"] = 50] = "AztecCode";
                //     Compact PDF417 a.k.a. Compact Portable Data File 417, Compact PDF 417, PDF417
                BarcodeSymbology[BarcodeSymbology["CompactPdf417"] = 51] = "CompactPdf417";
                //     Macro PDF417 a.k.a. Macro Portable Data File 417, Macro PDF 417, MacroPDF417
                BarcodeSymbology[BarcodeSymbology["MacroPdf417"] = 52] = "MacroPdf417";
                //     Micro PDF417 a.k.a. Micro Portable Data File 417, Micro PDF 417, MicroPDF417
                BarcodeSymbology[BarcodeSymbology["MicroPdf417"] = 53] = "MicroPdf417";
                //     VICS BOL a.k.a. VICS Bill of Lading, Voluntary Interindustry Commerce Solutions
                //     Bill of Lading, BOL Barcode, 17-digit BOL, VICS standard Bill of Lading
                BarcodeSymbology[BarcodeSymbology["VicsBol"] = 54] = "VicsBol";
                //     VICS SCAC PRO a.k.a. VICS Bill of Lading SCAC PRO, Voluntary Interindustry Commerce
                //     Solutions Bill of Lading SCAC PRO, SCAC Barcode, PRO Barcode, VICS SCAC, VICS
                //     PRO, SCAC/Pro Barcode, Standard Carrier Alpha Code, Carrier SCAC Barcode
                BarcodeSymbology[BarcodeSymbology["VicsScacPro"] = 55] = "VicsScacPro";
                //     Italian Post 25 a.k.a. Italian Post ITF 2/5, PosteItaliane Registered Mail Barcode,
                BarcodeSymbology[BarcodeSymbology["ItalianPost25"] = 56] = "ItalianPost25";
                //     ISBT 128 a.k.a. ISBT Barcode, ISBT128, International Society of Blood Transfusion
                //     Barcode, ICCBBA 128, International Council for Commonality in Blood Banking Automation
                //     Barcode, Unique Donation Identification Barcode, American Association of Blood
                //     Banks AABB 128 Barcode, American Red Cross ARC Barcode
                BarcodeSymbology[BarcodeSymbology["Isbt128"] = 57] = "Isbt128";
                //     HIBC LIC 39 a.k.a. HIBCC LIC, HIBC Labeler Identification Code, HIBC Supplier
                //     Labeling Standard Barcode, HIBC SLS Barcode, HIBC LIC Primary Data Structure,
                //     HIBC LIC Secondary Data Structure, HIBC Code 39, HIBC PCN Barcode, HIBC Universal
                //     Product Number, HIBC UPN Barcode, Health Industry Bar Code, Health Industry Business
                BarcodeSymbology[BarcodeSymbology["HibcLic39"] = 58] = "HibcLic39";
                //     HIBC LIC 128 a.k.a. HIBCC LIC, HIBC Labeler Identification Code, HIBC Supplier
                //     Labeling Standard Barcode, HIBC SLS Barcode, HIBC LIC Primary Data Structure,
                //     HIBC LIC Secondary Data Structure, HIBC Code 128, HIBC PCN Barcode, HIBC Universal
                //     Product Number, HIBC UPN Barcode, Health Industry Bar Code, Health Industry Business
                BarcodeSymbology[BarcodeSymbology["HibcLic128"] = 59] = "HibcLic128";
                //     HIBC PAS 39 a.k.a. HIBCC PAS, HIBC Provider Applications Standard, HIBC Provider
                //     Applications Standard Barcode, HIBC PAS Barcode, HIBC PAS Data Structure, HIBC
                //     PAS Single Data Structure, HIBC PAS Split Data Field, HIBC PAS Multiple Data
                //     Field (Concatenated), HIBC PAS Code 39, HIBC Health Care Services Provider Barcode
                BarcodeSymbology[BarcodeSymbology["HibcPas39"] = 60] = "HibcPas39";
                //     HIBC PAS 128 a.k.a. HIBCC PAS, HIBC Provider Applications Standard, HIBC Provider
                //     Applications Standard Barcode, HIBC PAS Barcode, HIBC PAS Data Structure, HIBC
                //     PAS Single Data Structure, HIBC PAS Split Data Field, HIBC PAS Multiple Data
                //     Field (Concatenated), HIBC PAS Code 128, HIBC Health Care Services Provider Barcode
                BarcodeSymbology[BarcodeSymbology["HibcPas128"] = 61] = "HibcPas128";
                //     USPS Intelligent Mail Barcode a.k.a. OneCode 4CB, USPS 4CB, 4-CB, 4-State Customer
                //     Barcode, USPS OneCode Solution Barcode
                BarcodeSymbology[BarcodeSymbology["UspsIntelligentMail"] = 62] = "UspsIntelligentMail";
                //     EAN UPC Add On 2 a.k.a. EAN Supplement 2/Two-digit Add-On, EAN+2, UPC Supplement
                //     2/Two-digit Add-On, UPC+2
                BarcodeSymbology[BarcodeSymbology["EanUpcAddOn2"] = 63] = "EanUpcAddOn2";
                //     EAN UPC Add On 5 a.k.a. EAN Supplement 5/Five-digit Add-On, EAN+5, UPC Supplement
                //     5/Five-digit Add-On, UPC+5
                BarcodeSymbology[BarcodeSymbology["EanUpcAddOn5"] = 64] = "EanUpcAddOn5";
                //     USPS PIC Code 128 a.k.a. USPS Package Identification Code USS Code 128, USPS
                BarcodeSymbology[BarcodeSymbology["UspsPicCode128"] = 65] = "UspsPicCode128";
                //     GS1 DataBar Omnidirectional a.k.a. RSS14, Reduced Space Symbology 14
                BarcodeSymbology[BarcodeSymbology["GS1DataBarOmnidirectional"] = 66] = "GS1DataBarOmnidirectional";
                //     GS1 DataBar-14 a.k.a. GS1 DataBar Omnidirectional, RSS14, Reduced Space Symbology
                BarcodeSymbology[BarcodeSymbology["GS1DataBar14"] = 67] = "GS1DataBar14";
                //     RSS14 a.k.a. RSS 14, Reduced Space Symbology 14, GS1 DataBar Omnidirectional
                BarcodeSymbology[BarcodeSymbology["Rss14"] = 68] = "Rss14";
                //     GS1 DataBar Truncated a.k.a. RSS 14 Truncated, Reduced Space Symbology 14 Truncated
                BarcodeSymbology[BarcodeSymbology["GS1DataBarTruncated"] = 69] = "GS1DataBarTruncated";
                //     GS1 DataBar-14 Truncated a.k.a. GS1 DataBar Truncated, RSS 14 Truncated, Reduced
                BarcodeSymbology[BarcodeSymbology["GS1DataBar14Truncated"] = 70] = "GS1DataBar14Truncated";
                //     RSS14 Truncated a.k.a. RSS 14 Truncated, Reduced Space Symbology 14 Truncated,
                BarcodeSymbology[BarcodeSymbology["Rss14Truncated"] = 71] = "Rss14Truncated";
                //     GS1 DataBar Stacked a.k.a. RSS 14 Stacked, Reduced Space Symbology 14 Stacked,
                BarcodeSymbology[BarcodeSymbology["GS1DataBarStacked"] = 72] = "GS1DataBarStacked";
                //     GS1 DataBar-14 Stacked a.k.a. RSS 14 Stacked, Reduced Space Symbology 14 Stacked,
                BarcodeSymbology[BarcodeSymbology["GS1DataBar14Stacked"] = 73] = "GS1DataBar14Stacked";
                //     RSS14 Stacked a.k.a. RSS 14 Stacked, Reduced Space Symbology 14 Stacked, GS1
                BarcodeSymbology[BarcodeSymbology["Rss14Stacked"] = 74] = "Rss14Stacked";
                //     GS1 DataBar Stacked Omnidirectional a.k.a. GS1 DataBar-14 Stacked Omnidirectional,
                //     RSS 14 Stacked Omnidirectional, Reduced Space Symbology 14 Stacked Omnidirectional
                BarcodeSymbology[BarcodeSymbology["GS1DataBarStackedOmnidirectional"] = 75] = "GS1DataBarStackedOmnidirectional";
                //     GS1 DataBar-14 Stacked Omnidirectional a.k.a. GS1 DataBar Stacked Omnidirectional,
                //     RSS 14 Stacked Omnidirectional, Reduced Space Symbology 14 Stacked Omnidirectional
                BarcodeSymbology[BarcodeSymbology["GS1DataBar14StackedOmnidirectional"] = 76] = "GS1DataBar14StackedOmnidirectional";
                //     RSS14 Stacked Omnidirectional a.k.a. RSS 14 Stacked Omnidirectional, Reduced
                //     Space Symbology 14 Stacked Omnidirectional, GS1 DataBar-14 Stacked Omnidirectional,
                BarcodeSymbology[BarcodeSymbology["Rss14StackedOmnidirectional"] = 77] = "Rss14StackedOmnidirectional";
                //     GS1 DataBar Limited a.k.a. GS1 DataBar-14 Limited, RSS Limited, Reduced Space
                BarcodeSymbology[BarcodeSymbology["GS1DataBarLimited"] = 78] = "GS1DataBarLimited";
                //     RSS Limited a.k.a. Reduced Space Symbology Limited, GS1 DataBar-14 Limited, GS1
                BarcodeSymbology[BarcodeSymbology["RssLimited"] = 80] = "RssLimited";
                //     GS1 DataBar Expanded a.k.a. RSS Expanded, Reduced Space Symbology Expanded
                BarcodeSymbology[BarcodeSymbology["GS1DataBarExpanded"] = 81] = "GS1DataBarExpanded";
                //     RSS Expanded a.k.a. GS1 DataBar Expanded, Reduced Space Symbology Expanded
                BarcodeSymbology[BarcodeSymbology["RssExpanded"] = 82] = "RssExpanded";
                //     GS1 DataBar Expanded Stacked a.k.a. RSS Expanded Stacked, Reduced Space Symbology
                BarcodeSymbology[BarcodeSymbology["GS1DataBarExpandedStacked"] = 83] = "GS1DataBarExpandedStacked";
                //     RSS Expanded Stacked a.k.a. GS1 DataBar Expanded Stacked, Reduced Space Symbology
                BarcodeSymbology[BarcodeSymbology["RssExpandedStacked"] = 84] = "RssExpandedStacked";
                //     GS1-128 a.k.a. UCC/EAN-128, EAN-128, UCC-128, USS-128, UCC.EAN-128, GTIN-128
                BarcodeSymbology[BarcodeSymbology["GS1128"] = 85] = "GS1128";
                //     MaxiCode a.k.a. UPS MaxiCode, Maxi Code, United Parcel Service MaxiCode
                BarcodeSymbology[BarcodeSymbology["MaxiCode"] = 86] = "MaxiCode";
                //     Micro QR Code a.k.a. Micro Quick Response Code, Micro QRCode Model 2
                BarcodeSymbology[BarcodeSymbology["MicroQRCode"] = 87] = "MicroQRCode";
                //     Matrix 2 of 5 a.k.a. 2 of 5 Matrix, 2/5 Matrix
                BarcodeSymbology[BarcodeSymbology["Matrix2of5"] = 88] = "Matrix2of5";
                //     Danish Postal 39 a.k.a. Danish PTT 39, Post Danmark A/S Barcode, Post Danmark
                BarcodeSymbology[BarcodeSymbology["DanishPostal39"] = 89] = "DanishPostal39";
                //     French Postal 39 A/R a.k.a. French Postal A/R 39, La Poste A/R 39
                BarcodeSymbology[BarcodeSymbology["FrenchPostal39AR"] = 90] = "FrenchPostal39AR";
                //     IATA 2 of 5 a.k.a. International Air Transport Assosiation 2 of 5
                BarcodeSymbology[BarcodeSymbology["IATA2of5"] = 91] = "IATA2of5";
                //     Australia Post Domestic eParcel Barcode ak.a. Australia Post Domestic eParcel
                BarcodeSymbology[BarcodeSymbology["AustraliaPostDomesticEParcelBarcode"] = 92] = "AustraliaPostDomesticEParcelBarcode";
                //     USPS Intelligent Mail Container Barcode a.k.a. USPS IM Container Barcode, IM
                BarcodeSymbology[BarcodeSymbology["UspsIntelligentMailContainerBarcode"] = 93] = "UspsIntelligentMailContainerBarcode";
                BarcodeSymbology[BarcodeSymbology["KodakPatchCode"] = 94] = "KodakPatchCode";
                //     GS1 DataMatrix a.k.a. GS1 Data Matrix ECC200
                BarcodeSymbology[BarcodeSymbology["GS1DataMatrix"] = 95] = "GS1DataMatrix";
                //     EAN-13 CC-A a.k.a. European Article Number 13 with CC-A
                BarcodeSymbology[BarcodeSymbology["Ean13CCA"] = 96] = "Ean13CCA";
                //     EAN-13 CC-B a.k.a. European Article Number 13 with CC-B
                BarcodeSymbology[BarcodeSymbology["Ean13CCB"] = 97] = "Ean13CCB";
                //     EAN-8 CC-A a.k.a. European Article Number 8 with CC-A
                BarcodeSymbology[BarcodeSymbology["Ean8CCA"] = 98] = "Ean8CCA";
                //     EAN-8 CC-B a.k.a. European Article Number 8 with CC-B
                BarcodeSymbology[BarcodeSymbology["Ean8CCB"] = 99] = "Ean8CCB";
                //     UPC-A CC-A a.k.a. Universal Product Code version A with CC-A
                BarcodeSymbology[BarcodeSymbology["UpcACCA"] = 100] = "UpcACCA";
                //     UPC-A CC-B a.k.a. Universal Product Code version A with CC-B
                BarcodeSymbology[BarcodeSymbology["UpcACCB"] = 101] = "UpcACCB";
                //     UPC-E CC-A a.k.a. Universal Product Code version E with CC-A
                BarcodeSymbology[BarcodeSymbology["UpcECCA"] = 102] = "UpcECCA";
                //     UPC-E CC-B a.k.a. Universal Product Code version E with CC-B
                BarcodeSymbology[BarcodeSymbology["UpcECCB"] = 103] = "UpcECCB";
                //     UCC/EAN-128 CC-A a.k.a. GS1-128 with CC-A
                BarcodeSymbology[BarcodeSymbology["UccEan128CCA"] = 104] = "UccEan128CCA";
                //     UCC/EAN-128 CC-B a.k.a. GS1-128 with CC-B
                BarcodeSymbology[BarcodeSymbology["UccEan128CCB"] = 105] = "UccEan128CCB";
                //     UCC/EAN-128 CC-C a.k.a. GS1-128 with CC-C
                BarcodeSymbology[BarcodeSymbology["UccEan128CCC"] = 106] = "UccEan128CCC";
                //     GS1-128 CC-A a.k.a. UCC/EAN-128 with CC-A
                BarcodeSymbology[BarcodeSymbology["GS1128CCA"] = 107] = "GS1128CCA";
                //     GS1-128 CC-B a.k.a. UCC/EAN-128 with CC-B
                BarcodeSymbology[BarcodeSymbology["GS1128CCB"] = 108] = "GS1128CCB";
                //     GS1-128 CC-C a.k.a. UCC/EAN-128 with CC-C
                BarcodeSymbology[BarcodeSymbology["GS1128CCC"] = 109] = "GS1128CCC";
                //     GS1 DataBar Omnidirectional with CC-A a.k.a. RSS14 CC-A
                BarcodeSymbology[BarcodeSymbology["GS1DataBarOmnidirectionalCCA"] = 110] = "GS1DataBarOmnidirectionalCCA";
                //     GS1 DataBar-14 with CC-A a.k.a. RSS14 with CC-A
                BarcodeSymbology[BarcodeSymbology["GS1DataBar14CCA"] = 111] = "GS1DataBar14CCA";
                //     RSS14 CC-A
                BarcodeSymbology[BarcodeSymbology["Rss14CCA"] = 112] = "Rss14CCA";
                //     GS1 DataBar Omnidirectional with CC-B a.k.a. RSS14 CC-B
                BarcodeSymbology[BarcodeSymbology["GS1DataBarOmnidirectionalCCB"] = 113] = "GS1DataBarOmnidirectionalCCB";
                //     GS1 DataBar-14 with CC-B a.k.a. RSS14 with CC-B
                BarcodeSymbology[BarcodeSymbology["GS1DataBar14CCB"] = 114] = "GS1DataBar14CCB";
                //     RSS14 CC-B
                BarcodeSymbology[BarcodeSymbology["Rss14CCB"] = 115] = "Rss14CCB";
                //     GS1 DataBar Truncated CC-A a.k.a. RSS 14 Truncated CC-A
                BarcodeSymbology[BarcodeSymbology["GS1DataBarTruncatedCCA"] = 116] = "GS1DataBarTruncatedCCA";
                //     GS1 DataBar-14 Truncated CC-A a.k.a. RSS 14 Truncated CC-A
                BarcodeSymbology[BarcodeSymbology["GS1DataBar14TruncatedCCA"] = 117] = "GS1DataBar14TruncatedCCA";
                //     RSS14 Truncated CC-A
                BarcodeSymbology[BarcodeSymbology["Rss14TruncatedCCA"] = 118] = "Rss14TruncatedCCA";
                //     GS1 DataBar Truncated CC-B a.k.a. RSS 14 Truncated CC-B
                BarcodeSymbology[BarcodeSymbology["GS1DataBarTruncatedCCB"] = 119] = "GS1DataBarTruncatedCCB";
                //     GS1 DataBar-14 Truncated CC-B a.k.a. RSS 14 Truncated CC-B
                BarcodeSymbology[BarcodeSymbology["GS1DataBar14TruncatedCCB"] = 120] = "GS1DataBar14TruncatedCCB";
                //     RSS14 Truncated CC-B
                BarcodeSymbology[BarcodeSymbology["Rss14TruncatedCCB"] = 121] = "Rss14TruncatedCCB";
                //     GS1 DataBar Limited CC-A a.k.a. RSS Limited CC-A
                BarcodeSymbology[BarcodeSymbology["GS1DataBarLimitedCCA"] = 122] = "GS1DataBarLimitedCCA";
                //     RSS Limited CC-A
                BarcodeSymbology[BarcodeSymbology["RssLimitedCCA"] = 123] = "RssLimitedCCA";
                //     GS1 DataBar Limited CC-B a.k.a. RSS Limited CC-B
                BarcodeSymbology[BarcodeSymbology["GS1DataBarLimitedCCB"] = 124] = "GS1DataBarLimitedCCB";
                //     RSS Limited CC-B
                BarcodeSymbology[BarcodeSymbology["RssLimitedCCB"] = 125] = "RssLimitedCCB";
                //     GS1 DataBar Stacked CC-A a.k.a. RSS 14 Stacked CC-A
                BarcodeSymbology[BarcodeSymbology["GS1DataBarStackedCCA"] = 126] = "GS1DataBarStackedCCA";
                //     GS1 DataBar-14 Stacked CC-A a.k.a. RSS 14 Stacked CC-A
                BarcodeSymbology[BarcodeSymbology["GS1DataBar14StackedCCA"] = 127] = "GS1DataBar14StackedCCA";
                //     RSS14 Stacked CC-A a.k.a. RSS 14 Stacked CC-A
                BarcodeSymbology[BarcodeSymbology["Rss14StackedCCA"] = 128] = "Rss14StackedCCA";
                //     GS1 DataBar Stacked CC-B a.k.a. RSS 14 Stacked CC-B
                BarcodeSymbology[BarcodeSymbology["GS1DataBarStackedCCB"] = 129] = "GS1DataBarStackedCCB";
                //     GS1 DataBar-14 Stacked CC-B a.k.a. RSS 14 Stacked CC-B
                BarcodeSymbology[BarcodeSymbology["GS1DataBar14StackedCCB"] = 130] = "GS1DataBar14StackedCCB";
                //     RSS14 Stacked CC-B a.k.a. RSS 14 Stacked CC-B
                BarcodeSymbology[BarcodeSymbology["Rss14StackedCCB"] = 131] = "Rss14StackedCCB";
                //     GS1 DataBar Stacked Omnidirectional CC-A a.k.a. RSS 14 Stacked Omnidirectional
                //     CC-A
                BarcodeSymbology[BarcodeSymbology["GS1DataBarStackedOmnidirectionalCCA"] = 132] = "GS1DataBarStackedOmnidirectionalCCA";
                //     GS1 DataBar-14 Stacked Omnidirectional CC-A a.k.a. RSS 14 Stacked Omnidirectional
                //     CC-A
                BarcodeSymbology[BarcodeSymbology["GS1DataBar14StackedOmnidirectionalCCA"] = 133] = "GS1DataBar14StackedOmnidirectionalCCA";
                //     RSS14 Stacked Omnidirectional CC-A
                BarcodeSymbology[BarcodeSymbology["Rss14StackedOmnidirectionalCCA"] = 134] = "Rss14StackedOmnidirectionalCCA";
                //     GS1 DataBar Stacked Omnidirectional CC-B a.k.a. RSS 14 Stacked Omnidirectional
                //     CC-B
                BarcodeSymbology[BarcodeSymbology["GS1DataBarStackedOmnidirectionalCCB"] = 135] = "GS1DataBarStackedOmnidirectionalCCB";
                //     GS1 DataBar-14 Stacked Omnidirectional CC-B a.k.a. RSS 14 Stacked Omnidirectional
                //     CC-B
                BarcodeSymbology[BarcodeSymbology["GS1DataBar14StackedOmnidirectionalCCB"] = 136] = "GS1DataBar14StackedOmnidirectionalCCB";
                //     RSS14 Stacked Omnidirectional CC-B
                BarcodeSymbology[BarcodeSymbology["Rss14StackedOmnidirectionalCCB"] = 137] = "Rss14StackedOmnidirectionalCCB";
                //     GS1 DataBar Expanded CC-A a.k.a. RSS Expanded CC-A
                BarcodeSymbology[BarcodeSymbology["GS1DataBarExpandedCCA"] = 138] = "GS1DataBarExpandedCCA";
                //     RSS Expanded CC-A
                BarcodeSymbology[BarcodeSymbology["RssExpandedCCA"] = 139] = "RssExpandedCCA";
                //     GS1 DataBar Expanded CC-B a.k.a. RSS Expanded CC-B
                BarcodeSymbology[BarcodeSymbology["GS1DataBarExpandedCCB"] = 140] = "GS1DataBarExpandedCCB";
                //     RSS Expanded CC-B
                BarcodeSymbology[BarcodeSymbology["RssExpandedCCB"] = 141] = "RssExpandedCCB";
                //     GS1 DataBar Expanded Stacked CC-A a.k.a. RSS Expanded Stacked CC-A
                BarcodeSymbology[BarcodeSymbology["GS1DataBarExpandedStackedCCA"] = 142] = "GS1DataBarExpandedStackedCCA";
                //     RSS Expanded Stacked CC-A
                BarcodeSymbology[BarcodeSymbology["RssExpandedStackedCCA"] = 143] = "RssExpandedStackedCCA";
                //     GS1 DataBar Expanded Stacked CC-B a.k.a. RSS Expanded Stacked CC-B
                BarcodeSymbology[BarcodeSymbology["GS1DataBarExpandedStackedCCB"] = 144] = "GS1DataBarExpandedStackedCCB";
                //     RSS Expanded Stacked CC-B
                BarcodeSymbology[BarcodeSymbology["RssExpandedStackedCCB"] = 145] = "RssExpandedStackedCCB";
                //     EAN-14 a.k.a. GTIN-14, UCC-14
                BarcodeSymbology[BarcodeSymbology["Ean14"] = 147] = "Ean14";
                // DUN-14 ITF Version
                BarcodeSymbology[BarcodeSymbology["Dun14Itf"] = 148] = "Dun14Itf";
                // DUN-14 GS1/EAN/UCC Version
                BarcodeSymbology[BarcodeSymbology["Dun14Ean"] = 149] = "Dun14Ean";
                // GS1 QR Code
                BarcodeSymbology[BarcodeSymbology["GS1QRCode"] = 150] = "GS1QRCode";
                // PPN a.k.a. IFA PPN, IFA Pharmacy Product Number, IFA securPharm
                BarcodeSymbology[BarcodeSymbology["Ppn"] = 151] = "Ppn";
                // IFA securPharm a.k.a. PPN
                BarcodeSymbology[BarcodeSymbology["IFAsecurPharm"] = 152] = "IFAsecurPharm";
                // DHL AWB
                BarcodeSymbology[BarcodeSymbology["DhlAwb"] = 153] = "DhlAwb";
                // HIBC LIC Data Matrix
                BarcodeSymbology[BarcodeSymbology["HibcLicDataMatrix"] = 154] = "HibcLicDataMatrix";
                // HIBC LIC QR Code
                BarcodeSymbology[BarcodeSymbology["HibcLicQRCode"] = 155] = "HibcLicQRCode";
                // HIBC LIC Aztec Code
                BarcodeSymbology[BarcodeSymbology["HibcLicAztecCode"] = 156] = "HibcLicAztecCode";
                // HIBC PAS Data Matrix
                BarcodeSymbology[BarcodeSymbology["HibcPasDataMatrix"] = 157] = "HibcPasDataMatrix";
                // HIBC PAS QR COde
                BarcodeSymbology[BarcodeSymbology["HibcPasQRCode"] = 158] = "HibcPasQRCode";
                // HIBC PAS Aztec Code
                BarcodeSymbology[BarcodeSymbology["HibcPasAztecCode"] = 159] = "HibcPasAztecCode";
                // ISBT 128 Data Matrix
                BarcodeSymbology[BarcodeSymbology["Isbt128DataMatrix"] = 160] = "Isbt128DataMatrix";
                // Deutsche Post PostMatrix
                BarcodeSymbology[BarcodeSymbology["DeutschePostResponsePlusPostMatrix"] = 161] = "DeutschePostResponsePlusPostMatrix";
                // Deutsche Post BZL
                BarcodeSymbology[BarcodeSymbology["DeutschePostBzl"] = 162] = "DeutschePostBzl";
                // USPS Intelligent Mail Package Barcode a.k.a. USPS IMpb
                BarcodeSymbology[BarcodeSymbology["UspsIntelligentMailPackageBarcode"] = 163] = "UspsIntelligentMailPackageBarcode";
                // Han Xin Code a.k.a. 2D Chinese Barcode
                BarcodeSymbology[BarcodeSymbology["HanXinCode"] = 164] = "HanXinCode";
                // Japan Post 4 State Customer Barcode a.k.a. Japanese Postal Barcode, Kasutama Barcode
                BarcodeSymbology[BarcodeSymbology["JapanPost"] = 165] = "JapanPost";
                // Korea Post Barcode a.k.a. Korean Postal Authority Barcode
                BarcodeSymbology[BarcodeSymbology["KoreaPost"] = 166] = "KoreaPost";
                // Data Logic 2 of 5 Barcode a.k.a. China Post Barcode
                BarcodeSymbology[BarcodeSymbology["DataLogic2of5"] = 167] = "DataLogic2of5";
                // Royal Mail Mailmark CMDM a.k.a. 2D CMDM Mailmark, Complex Mail Data Marks
                BarcodeSymbology[BarcodeSymbology["MailmarkCMDM"] = 168] = "MailmarkCMDM";
                // Royal Mail Mailmark 4-State Barcode C
                BarcodeSymbology[BarcodeSymbology["Mailmark4StateC"] = 169] = "Mailmark4StateC";
                // Royal Mail Mailmark 4-State Barcode L
                BarcodeSymbology[BarcodeSymbology["Mailmark4StateL"] = 170] = "Mailmark4StateL";
                // DotCode a.k.a. ISS DotCode
                BarcodeSymbology[BarcodeSymbology["DotCode"] = 171] = "DotCode";
                // GS1 Aztec Code
                BarcodeSymbology[BarcodeSymbology["GS1AztecCode"] = 172] = "GS1AztecCode";
                // Swiss QR Code a.k.a. QR-bill
                BarcodeSymbology[BarcodeSymbology["SwissQRCode"] = 173] = "SwissQRCode";
                // Plessey a.k.a. UK Plessey
                BarcodeSymbology[BarcodeSymbology["Plessey"] = 174] = "Plessey";
                // EPC QR Code a.k.a. SEPA Credit Transfer QR Code, SCT QR Code
                BarcodeSymbology[BarcodeSymbology["EPCQRCode"] = 175] = "EPCQRCode";
                // Code 49 a.k.a. USS-49, ANSI/AIM BC6 - USS Code 49
                BarcodeSymbology[BarcodeSymbology["Code49"] = 176] = "Code49";
                // Codablock F a.k.a. USS Codablock F
                BarcodeSymbology[BarcodeSymbology["CodablockF"] = 177] = "CodablockF";
                // TLC39 a.k.a. TCIF Linked Code 39
                BarcodeSymbology[BarcodeSymbology["Tlc39"] = 178] = "Tlc39";
                // HIBC LIC Codablock-F a.k.a. HIBCC LIC, HIBC Labeler Identification Code, HIBC Supplier Labeling Standard Barcode, HIBC SLS Barcode, HIBC LIC Primary Data Structure, HIBC LIC Secondary Data Structure, HIBC Codablock-F, HIBC PCN Barcode, HIBC Universal Product Number, HIBC UPN Barcode, Health Industry Bar Code, Health Industry Business Communications Council Barcode
                BarcodeSymbology[BarcodeSymbology["HibcLicCodablockF"] = 179] = "HibcLicCodablockF";
                // HIBC PAS Codablock-F a.k.a. HIBCC PAS, HIBC Provider Applications Standard, HIBC Provider Applications Standard Barcode, HIBC PAS Barcode, HIBC PAS Data Structure, HIBC PAS Single Data Structure, HIBC PAS Split Data Field, HIBC PAS Multiple Data Field (Concatenated), HIBC PAS Codablock-F, HIBC Health Care Services Provider Barcode
                BarcodeSymbology[BarcodeSymbology["HibcPasCodablockF"] = 180] = "HibcPasCodablockF";
                // TriOptic a.k.a. Tri-Optic Code 39
                BarcodeSymbology[BarcodeSymbology["TriOptic"] = 181] = "TriOptic";
                // DIM SPEC QR Code a.k.a. DIN SPEC 91406 2D Code
                BarcodeSymbology[BarcodeSymbology["DINSpecQRCode"] = 182] = "DINSpecQRCode";
                // DIM SPEC Data Matrix a.k.a. DIN SPEC 91406 2D Code
                BarcodeSymbology[BarcodeSymbology["DINSpecDataMatrix"] = 183] = "DINSpecDataMatrix";
                // Rectangular Micro QR Code a.k.a. rMQR
                BarcodeSymbology[BarcodeSymbology["RectMicroQRCode"] = 184] = "RectMicroQRCode";
                // GS1 Rectangular Micro QR Code
                BarcodeSymbology[BarcodeSymbology["GS1RectMicroQRCode"] = 185] = "GS1RectMicroQRCode";
                // DPD (Deutsher Paket Dienst) Code
                BarcodeSymbology[BarcodeSymbology["DPDCode"] = 186] = "DPDCode";
                // DAFT Generic Four-State
                BarcodeSymbology[BarcodeSymbology["DAFT"] = 187] = "DAFT";
            })(BarcodeSymbology = Printing.BarcodeSymbology || (Printing.BarcodeSymbology = {}));
            ;
            var TelepenEncoding;
            (function (TelepenEncoding) {
                TelepenEncoding[TelepenEncoding["Ascii"] = 0] = "Ascii";
                TelepenEncoding[TelepenEncoding["Numeric"] = 1] = "Numeric";
            })(TelepenEncoding = Printing.TelepenEncoding || (Printing.TelepenEncoding = {}));
            ;
            var UpcE;
            (function (UpcE) {
                UpcE[UpcE["System0"] = 0] = "System0";
                UpcE[UpcE["System1"] = 1] = "System1";
            })(UpcE = Printing.UpcE || (Printing.UpcE = {}));
            ;
            var FIM;
            (function (FIM) {
                FIM[FIM["A"] = 0] = "A";
                FIM[FIM["B"] = 1] = "B";
                FIM[FIM["C"] = 2] = "C";
                FIM[FIM["D"] = 3] = "D";
            })(FIM = Printing.FIM || (Printing.FIM = {}));
            ;
            var FontUnit;
            (function (FontUnit) {
                FontUnit[FontUnit["Inch"] = 0] = "Inch";
                FontUnit[FontUnit["Millimeter"] = 1] = "Millimeter";
                FontUnit[FontUnit["Pixel"] = 2] = "Pixel";
                FontUnit[FontUnit["Point"] = 3] = "Point";
                FontUnit[FontUnit["Twip"] = 4] = "Twip";
            })(FontUnit = Printing.FontUnit || (Printing.FontUnit = {}));
            ;
            var TextSizing;
            (function (TextSizing) {
                TextSizing[TextSizing["None"] = 0] = "None";
                TextSizing[TextSizing["Stretch"] = 1] = "Stretch";
                TextSizing[TextSizing["FontSizeScaling"] = 2] = "FontSizeScaling";
                TextSizing[TextSizing["ParagraphScaling"] = 3] = "ParagraphScaling";
                TextSizing[TextSizing["Arc"] = 4] = "Arc";
                TextSizing[TextSizing["Vertical"] = 5] = "Vertical";
                TextSizing[TextSizing["OuterArc"] = 6] = "OuterArc";
                TextSizing[TextSizing["ParagraphScalingAndFill"] = 7] = "ParagraphScalingAndFill";
                TextSizing[TextSizing["AutoSize"] = 8] = "AutoSize";
                TextSizing[TextSizing["OverflowSplit"] = 9] = "OverflowSplit";
            })(TextSizing = Printing.TextSizing || (Printing.TextSizing = {}));
            ;
            var TextAlignment;
            (function (TextAlignment) {
                TextAlignment[TextAlignment["Left"] = 0] = "Left";
                TextAlignment[TextAlignment["Center"] = 1] = "Center";
                TextAlignment[TextAlignment["Right"] = 2] = "Right";
                TextAlignment[TextAlignment["Justify"] = 3] = "Justify";
            })(TextAlignment = Printing.TextAlignment || (Printing.TextAlignment = {}));
            ;
            var CodePage;
            (function (CodePage) {
                CodePage[CodePage["CP850"] = 0] = "CP850";
                CodePage[CodePage["CP1250"] = 1] = "CP1250";
                CodePage[CodePage["CP1251"] = 2] = "CP1251";
                CodePage[CodePage["CP1252"] = 3] = "CP1252";
                CodePage[CodePage["CP1253"] = 4] = "CP1253";
                CodePage[CodePage["CP1254"] = 5] = "CP1254";
                CodePage[CodePage["CP1255"] = 6] = "CP1255";
                CodePage[CodePage["UTF8"] = 7] = "UTF8";
            })(CodePage = Printing.CodePage || (Printing.CodePage = {}));
            ;
            var DitherMethod;
            (function (DitherMethod) {
                DitherMethod[DitherMethod["Threshold"] = 0] = "Threshold";
                DitherMethod[DitherMethod["PatternDiffusion"] = 1] = "PatternDiffusion";
                DitherMethod[DitherMethod["FloydSteinberg"] = 2] = "FloydSteinberg";
                DitherMethod[DitherMethod["OtsuThreshold"] = 3] = "OtsuThreshold";
            })(DitherMethod = Printing.DitherMethod || (Printing.DitherMethod = {}));
            ;
            var DotCodeModuleShape;
            (function (DotCodeModuleShape) {
                DotCodeModuleShape[DotCodeModuleShape["Circle"] = 0] = "Circle";
                DotCodeModuleShape[DotCodeModuleShape["Square"] = 1] = "Square";
            })(DotCodeModuleShape = Printing.DotCodeModuleShape || (Printing.DotCodeModuleShape = {}));
            ;
            var RectMicroQRCodeVersion;
            (function (RectMicroQRCodeVersion) {
                RectMicroQRCodeVersion[RectMicroQRCodeVersion["Auto"] = 0] = "Auto";
                RectMicroQRCodeVersion[RectMicroQRCodeVersion["R7x43"] = 1] = "R7x43";
                RectMicroQRCodeVersion[RectMicroQRCodeVersion["R7x59"] = 2] = "R7x59";
                RectMicroQRCodeVersion[RectMicroQRCodeVersion["R7x77"] = 3] = "R7x77";
                RectMicroQRCodeVersion[RectMicroQRCodeVersion["R7x99"] = 4] = "R7x99";
                RectMicroQRCodeVersion[RectMicroQRCodeVersion["R7x139"] = 5] = "R7x139";
                RectMicroQRCodeVersion[RectMicroQRCodeVersion["R9x43"] = 6] = "R9x43";
                RectMicroQRCodeVersion[RectMicroQRCodeVersion["R9x59"] = 7] = "R9x59";
                RectMicroQRCodeVersion[RectMicroQRCodeVersion["R9x77"] = 8] = "R9x77";
                RectMicroQRCodeVersion[RectMicroQRCodeVersion["R9x99"] = 9] = "R9x99";
                RectMicroQRCodeVersion[RectMicroQRCodeVersion["R9x139"] = 10] = "R9x139";
                RectMicroQRCodeVersion[RectMicroQRCodeVersion["R11x27"] = 11] = "R11x27";
                RectMicroQRCodeVersion[RectMicroQRCodeVersion["R11x43"] = 12] = "R11x43";
                RectMicroQRCodeVersion[RectMicroQRCodeVersion["R11x59"] = 13] = "R11x59";
                RectMicroQRCodeVersion[RectMicroQRCodeVersion["R11x77"] = 14] = "R11x77";
                RectMicroQRCodeVersion[RectMicroQRCodeVersion["R11x99"] = 15] = "R11x99";
                RectMicroQRCodeVersion[RectMicroQRCodeVersion["R11x139"] = 16] = "R11x139";
                RectMicroQRCodeVersion[RectMicroQRCodeVersion["R13x27"] = 17] = "R13x27";
                RectMicroQRCodeVersion[RectMicroQRCodeVersion["R13x43"] = 18] = "R13x43";
                RectMicroQRCodeVersion[RectMicroQRCodeVersion["R13x59"] = 19] = "R13x59";
                RectMicroQRCodeVersion[RectMicroQRCodeVersion["R13x77"] = 20] = "R13x77";
                RectMicroQRCodeVersion[RectMicroQRCodeVersion["R13x99"] = 21] = "R13x99";
                RectMicroQRCodeVersion[RectMicroQRCodeVersion["R13x139"] = 22] = "R13x139";
                RectMicroQRCodeVersion[RectMicroQRCodeVersion["R15x43"] = 23] = "R15x43";
                RectMicroQRCodeVersion[RectMicroQRCodeVersion["R15x59"] = 24] = "R15x59";
                RectMicroQRCodeVersion[RectMicroQRCodeVersion["R15x77"] = 25] = "R15x77";
                RectMicroQRCodeVersion[RectMicroQRCodeVersion["R15x99"] = 26] = "R15x99";
                RectMicroQRCodeVersion[RectMicroQRCodeVersion["R15x139"] = 27] = "R15x139";
                RectMicroQRCodeVersion[RectMicroQRCodeVersion["R17x43"] = 28] = "R17x43";
                RectMicroQRCodeVersion[RectMicroQRCodeVersion["R17x59"] = 29] = "R17x59";
                RectMicroQRCodeVersion[RectMicroQRCodeVersion["R17x77"] = 30] = "R17x77";
                RectMicroQRCodeVersion[RectMicroQRCodeVersion["R17x99"] = 31] = "R17x99";
                RectMicroQRCodeVersion[RectMicroQRCodeVersion["R17x139"] = 32] = "R17x139";
            })(RectMicroQRCodeVersion = Printing.RectMicroQRCodeVersion || (Printing.RectMicroQRCodeVersion = {}));
            ;
            var StrokeStyle;
            (function (StrokeStyle) {
                StrokeStyle[StrokeStyle["Solid"] = 0] = "Solid";
                StrokeStyle[StrokeStyle["Dash"] = 1] = "Dash";
                StrokeStyle[StrokeStyle["Dot"] = 2] = "Dot";
            })(StrokeStyle = Printing.StrokeStyle || (Printing.StrokeStyle = {}));
            ;
            var PrintOrientation;
            (function (PrintOrientation) {
                PrintOrientation[PrintOrientation["Portrait"] = 0] = "Portrait";
                PrintOrientation[PrintOrientation["Portrait180"] = 2] = "Portrait180";
                PrintOrientation[PrintOrientation["Landscape90"] = 1] = "Landscape90";
                PrintOrientation[PrintOrientation["Landscape270"] = 3] = "Landscape270";
            })(PrintOrientation = Printing.PrintOrientation || (Printing.PrintOrientation = {}));
            ;
            var ProgrammingLanguage;
            (function (ProgrammingLanguage) {
                ProgrammingLanguage[ProgrammingLanguage["ZPL"] = 0] = "ZPL";
                ProgrammingLanguage[ProgrammingLanguage["EPL"] = 1] = "EPL";
                ProgrammingLanguage[ProgrammingLanguage["Fingerprint"] = 2] = "Fingerprint";
                ProgrammingLanguage[ProgrammingLanguage["ESCPOS"] = 3] = "ESCPOS";
                ProgrammingLanguage[ProgrammingLanguage["PCL"] = 4] = "PCL";
            })(ProgrammingLanguage = Printing.ProgrammingLanguage || (Printing.ProgrammingLanguage = {}));
            ;
            var TextVerticalAlignment;
            (function (TextVerticalAlignment) {
                TextVerticalAlignment[TextVerticalAlignment["Top"] = 0] = "Top";
                TextVerticalAlignment[TextVerticalAlignment["Bottom"] = 1] = "Bottom";
            })(TextVerticalAlignment = Printing.TextVerticalAlignment || (Printing.TextVerticalAlignment = {}));
            ;
            var QRCodeMask;
            (function (QRCodeMask) {
                QRCodeMask[QRCodeMask["Auto"] = 0] = "Auto";
                QRCodeMask[QRCodeMask["Mask0"] = 1] = "Mask0";
                QRCodeMask[QRCodeMask["Mask1"] = 2] = "Mask1";
                QRCodeMask[QRCodeMask["Mask2"] = 3] = "Mask2";
                QRCodeMask[QRCodeMask["Mask3"] = 4] = "Mask3";
                QRCodeMask[QRCodeMask["Mask4"] = 5] = "Mask4";
                QRCodeMask[QRCodeMask["Mask5"] = 6] = "Mask5";
                QRCodeMask[QRCodeMask["Mask6"] = 7] = "Mask6";
                QRCodeMask[QRCodeMask["Mask7"] = 8] = "Mask7";
            })(QRCodeMask = Printing.QRCodeMask || (Printing.QRCodeMask = {}));
            ;
            var CodeEncoding;
            (function (CodeEncoding) {
                CodeEncoding[CodeEncoding["Text"] = 0] = "Text";
                CodeEncoding[CodeEncoding["Base64"] = 1] = "Base64";
                CodeEncoding[CodeEncoding["Hex"] = 2] = "Hex";
            })(CodeEncoding = Printing.CodeEncoding || (Printing.CodeEncoding = {}));
            ;
        })(Printing = SDK.Printing || (SDK.Printing = {}));
    })(SDK = Neodynamic.SDK || (Neodynamic.SDK = {}));
})(Neodynamic || (Neodynamic = {}));
var Neodynamic;
(function (Neodynamic) {
    var SDK;
    (function (SDK) {
        var Printing;
        (function (Printing) {
            var Font = /** @class */ (function () {
                //#endregion
                function Font() {
                    //#region Private Properties
                    this._bold = false;
                    this._code_page = Printing.CodePage.CP850;
                    this._custom_font_file = '';
                    this._custom_font_file_family_name = '';
                    this._is_bitmap_font = false;
                    this._italic = false;
                    this._name = 'NativePrinterFontA';
                    this._name_at_printer_storage = '';
                    this._size = 10;
                    this._strikeout = false;
                    this._threshold = 90;
                    this._underline = false;
                    this._unit = Printing.FontUnit.Point;
                }
                Object.defineProperty(Font.prototype, "bold", {
                    //#endregion
                    //#region Public Properties
                    get: function () { return this._bold; },
                    set: function (value) {
                        this._bold = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Font.prototype, "code_page", {
                    get: function () { return this._code_page; },
                    set: function (value) {
                        this._code_page = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Font.prototype, "custom_font_file", {
                    get: function () { return this._custom_font_file; },
                    set: function (value) {
                        this._custom_font_file = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Font.prototype, "custom_font_file_family_name", {
                    get: function () { return this._custom_font_file_family_name; },
                    set: function (value) {
                        this._custom_font_file_family_name = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Font.prototype, "is_bitmap_font", {
                    get: function () { return this._is_bitmap_font; },
                    set: function (value) {
                        this._is_bitmap_font = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Font.prototype, "italic", {
                    get: function () { return this._italic; },
                    set: function (value) {
                        this._italic = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Font.prototype, "name", {
                    get: function () { return this._name; },
                    set: function (value) {
                        this._name = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Font.prototype, "name_at_printer_storage", {
                    get: function () { return this._name_at_printer_storage; },
                    set: function (value) {
                        this._name_at_printer_storage = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Font.prototype, "size", {
                    get: function () { return this._size; },
                    set: function (value) {
                        this._size = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Font.prototype, "strikeout", {
                    get: function () { return this._strikeout; },
                    set: function (value) {
                        this._strikeout = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Font.prototype, "threshold", {
                    get: function () { return this._threshold; },
                    set: function (value) {
                        if (value > 100 || value < 0)
                            throw RangeError();
                        this._threshold = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Font.prototype, "underline", {
                    get: function () { return this._underline; },
                    set: function (value) {
                        this._underline = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Font.prototype, "unit", {
                    get: function () { return this._unit; },
                    set: function (value) {
                        this._unit = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Font.prototype.propertyChanged = function () { };
                ;
                return Font;
            }());
            Printing.Font = Font;
        })(Printing = SDK.Printing || (SDK.Printing = {}));
    })(SDK = Neodynamic.SDK || (Neodynamic.SDK = {}));
})(Neodynamic || (Neodynamic = {}));
var Neodynamic;
(function (Neodynamic) {
    var SDK;
    (function (SDK) {
        var Printing;
        (function (Printing) {
            var FrameThickness = /** @class */ (function () {
                function FrameThickness(left, top, right, bottom) {
                    this._bottom = 0;
                    this._left = 0;
                    this._right = 0;
                    this._top = 0;
                    if (left != null && top != null && right != null && bottom != null) {
                        this._bottom = bottom;
                        this._left = left;
                        this._right = right;
                        this._top = top;
                    }
                }
                Object.defineProperty(FrameThickness.prototype, "bottom", {
                    get: function () { return this._bottom; },
                    set: function (value) {
                        this._bottom = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FrameThickness.prototype, "left", {
                    get: function () { return this._left; },
                    set: function (value) {
                        this._left = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FrameThickness.prototype, "right", {
                    get: function () { return this._right; },
                    set: function (value) {
                        this._right = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FrameThickness.prototype, "top", {
                    get: function () { return this._top; },
                    set: function (value) {
                        this._top = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                FrameThickness.prototype.propertyChanged = function () { };
                ;
                return FrameThickness;
            }());
            Printing.FrameThickness = FrameThickness;
        })(Printing = SDK.Printing || (SDK.Printing = {}));
    })(SDK = Neodynamic.SDK || (Neodynamic.SDK = {}));
})(Neodynamic || (Neodynamic = {}));
var Neodynamic;
(function (Neodynamic) {
    var SDK;
    (function (SDK) {
        var Printing;
        (function (Printing) {
            var ImageItem = /** @class */ (function (_super) {
                __extends(ImageItem, _super);
                function ImageItem() {
                    var _this = _super.call(this) || this;
                    //#region Private Properties
                    _this._height = 0;
                    _this._width = 0;
                    _this._flip = Printing.Flip.None;
                    _this._hide_if_not_found = false;
                    _this._is_grayscale_or_black_white = false;
                    _this._lock_aspect_ratio = Printing.LockAspectRatio.None;
                    _this._monochrome_settings = new Printing.MonochromeSettings();
                    _this._rotation_angle = 0;
                    _this._source_base64 = '';
                    _this._name_at_printer_storage = '';
                    _this._source_dpi = 96;
                    _this._convert_to_monochrome = true;
                    _this._source_file = '';
                    _this._httpPattern = /^(http:|https:)/i;
                    /*  Booleano si tiene que recargar la imagen    */
                    _this._has_to_reload = false;
                    /*  Imagen contenedora del BC   */
                    _this._image_item = new Image();
                    /*  Imagen a partir del source B64  */
                    _this._original_image_item = new Image();
                    _this._is_missing_image = false;
                    var self = _this;
                    _this._guid = Neodynamic.Web.Utils.NamingUtils.newGuid();
                    _this._image_item.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
                    _this._image_item.onload = function () {
                        if (!self._is_missing_image) {
                            self._fabric_item.width = self._image_item.width / self._fabric_item.scaleX;
                            self._fabric_item.height = self._image_item.height / self._fabric_item.scaleY;
                        }
                        self._fabric_item.setCoords();
                        //self._updateToCanvas();
                        self._has_to_reload = false;
                        //self._fabric_item.dpi = 96 * (self._fabric_item.scaleX || 1);
                        if (self._fabric_item.canvas)
                            self._fabric_item.canvas.renderAll();
                    };
                    _this._fabric_item = new fabric.Image(self._image_item, {
                        //check the unittype
                        thermal_label_object: self,
                        originX: 'left',
                        originY: 'top',
                        top: self._y,
                        left: self._x,
                        width: 1,
                        height: 1,
                        stroke: '#dadada',
                        strokeWidth: 1,
                        angle: self._rotation_angle
                    }).on('modified', function (e) {
                        self._updateFromCanvas();
                        //self._fabric_item.setCoords();
                        /*if (self._has_to_reload) {
                            self.refresh();
                        }*/
                    }).on('scaling', function () {
                        self._has_to_reload = true;
                    }).on('mouseup', function (e) {
                        self._updateFromCanvas();
                        //self._fabric_item.setCoords();
                        if (self._has_to_reload) {
                            self.refresh();
                        }
                    });
                    return _this;
                }
                Object.defineProperty(ImageItem.prototype, "height", {
                    //#endregion
                    //#region Public Properties
                    get: function () { return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._height, this._unit_type); },
                    set: function (value) {
                        //if (value == 0) {
                        //    this._height = this._original_image_item.height;
                        //    return;
                        //}
                        //this._height = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);     
                        if (value == 0) {
                            this._height = this._original_image_item.height;
                        }
                        else {
                            this._height = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        }
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(ImageItem.prototype, "width", {
                    get: function () { return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._width, this._unit_type); },
                    set: function (value) {
                        //if (value == 0) {
                        //    this._width = this._original_image_item.width;
                        //    return;
                        //}
                        //this._width = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);        
                        if (value == 0) {
                            this._width = this._original_image_item.width;
                        }
                        else {
                            this._width = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        }
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(ImageItem.prototype, "flip", {
                    get: function () { return this._flip; },
                    set: function (value) {
                        this._flip = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(ImageItem.prototype, "hide_if_not_found", {
                    get: function () { return this._hide_if_not_found; },
                    set: function (value) {
                        this._hide_if_not_found = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(ImageItem.prototype, "is_grayscale_or_black_white", {
                    get: function () { return this._is_grayscale_or_black_white; },
                    set: function (value) {
                        this._is_grayscale_or_black_white = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(ImageItem.prototype, "lock_aspect_ratio", {
                    get: function () { return this._lock_aspect_ratio; },
                    set: function (value) {
                        this._lock_aspect_ratio = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(ImageItem.prototype, "monochrome_settings", {
                    get: function () { return this._monochrome_settings; },
                    set: function (value) {
                        this._monochrome_settings = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(ImageItem.prototype, "rotation_angle", {
                    get: function () { return this._rotation_angle; },
                    set: function (value) {
                        if (value < 0 || value > 360)
                            throw new RangeError();
                        this._rotation_angle = (value == 360) ? 0 : value;
                        this._updateToCanvas();
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(ImageItem.prototype, "source_base64", {
                    get: function () { return this._source_base64; },
                    set: function (value) {
                        if (this._readonly)
                            return;
                        this._source_base64 = value;
                        this._original_image_item.src = "data:image;base64," + value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(ImageItem.prototype, "name_at_printer_storage", {
                    get: function () { return this._name_at_printer_storage; },
                    set: function (value) {
                        this._name_at_printer_storage = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(ImageItem.prototype, "source_dpi", {
                    get: function () { return this._source_dpi; },
                    set: function (value) {
                        this._source_dpi = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(ImageItem.prototype, "convert_to_monochrome", {
                    get: function () { return this._convert_to_monochrome; },
                    set: function (value) {
                        this._convert_to_monochrome = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(ImageItem.prototype, "source_file", {
                    get: function () { return this._source_file; },
                    set: function (value) {
                        if (this._readonly)
                            return;
                        this._source_file = value;
                        if (this._source_file && this.source_file.length > 0 && !this._httpPattern.test(this.source_file))
                            this._original_image_item.src = this._missing_image;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                //#endregion
                ImageItem.prototype._getProperties = function () {
                    return {
                        Type: "Image",
                        //Dpi: 96,
                        Dpi: 96 * (this._fabric_item.scaleX || 1),
                        MonochromeSettings_DitherMethod: this.monochrome_settings.dither_method,
                        MonochromeSettings_ReverseEffect: this.monochrome_settings.reverse_effect,
                        MonochromeSettings_Threshold: this.monochrome_settings.threshold,
                        SourceBase64: this.source_base64,
                        LockAspectRatio: this.lock_aspect_ratio,
                        Flip: this.flip,
                        RotationAngle: this.rotation_angle,
                        IsGrayscaleOrBlackWhite: this.is_grayscale_or_black_white,
                        Height: this.height,
                        Width: this.width,
                        UnitType: this.unit_type,
                        X: this.x,
                        Y: this.y,
                        Comments: this.comments,
                        DataField: this.data_field,
                        DataFieldFormatString: this.data_field_format_string,
                        Name: this.name,
                        PrintAsGraphic: this.print_as_graphic,
                        Tag: this.tag,
                        Locked: this.locked,
                        Editable: this.editable,
                        NameAtPrinterStorage: this.name_at_printer_storage,
                        SourceDpi: this._source_dpi,
                        ConvertToMonochrome: this._convert_to_monochrome,
                        Expression: Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(this.expression),
                        SourceFile: this.source_file,
                        UseCache: this.use_cache,
                        CacheItemId: this.cache_item_id,
                        Visible: this.visible,
                        GroupName: this.group_name,
                        Resizable: this.resizable,
                        ReadOnly: this.read_only
                    };
                };
                ;
                //public _clone() {
                //    var clone = new Neodynamic.SDK.Printing.ImageItem();
                //    clone.monochrome_settings.dither_method = this.monochrome_settings.dither_method;
                //    clone.monochrome_settings.reverse_effect = this.monochrome_settings.reverse_effect;
                //    clone.monochrome_settings.threshold = this.monochrome_settings.threshold;
                //    clone.source_base64 = this.source_base64;
                //    clone.lock_aspect_ratio = this.lock_aspect_ratio;
                //    clone.flip = this.flip;
                //    clone.rotation_angle = this.rotation_angle;
                //    clone.is_grayscale_or_black_white = this.is_grayscale_or_black_white;
                //    clone._height = this._height;
                //    clone._width = this._width;
                //    clone.name = this.name;// + new Date().getTime();
                //    clone.unit_type = this.unit_type;
                //    clone._x = this._x;
                //    clone._y = this._y;
                //    clone.comments = this.comments;
                //    clone.data_field = this.data_field;
                //    clone.data_field_format_string = this.data_field_format_string;
                //    clone.source_dpi = this.source_dpi;
                //    clone.convert_to_monochrome = this.convert_to_monochrome;
                //    clone.expression = this.expression;
                //    clone.source_file = this.source_file;
                //    clone.use_cache = this.use_cache;
                //    clone.cache_item_id = this.cache_item_id;
                //    clone.visible = this.visible;
                //    clone._updateToCanvas();
                //    return clone;
                //}
                ImageItem.prototype._updateFromCanvas = function () {
                    /*
                    if (property == null) {
                        if (this._width != this._fabric_item.width || this._height != this._fabric_item.height)
                            this._has_to_reload = true;
                        this._updateFromCanvas('left');
                        this._updateFromCanvas('top');
                        this._updateFromCanvas('width');
                        this._updateFromCanvas('height');
                        this._updateFromCanvas('angle');
                        return;
                    }
                    switch (property) {
                        case "left": {
                            this._x = this._fabric_item.left;
                        } break;
                        case "top": {
                            this._y = this._fabric_item.top;
                        } break;
                        case "angle": {
                            this._rotation_angle = this._fabric_item.angle;
                        } break;
                        case "height": {
                            this._height = this._fabric_item.height;
                        } break;
                        case "width": {
                            this._width = this._fabric_item.width;
                        } break;
                        default: {
                            this["_" + property] = this._fabric_item[property];
                        } break;
                    }
                    */
                    if (this._width != this._fabric_item.width || this._height != this._fabric_item.height)
                        this._has_to_reload = true;
                    var MathUtils = Neodynamic.Web.Utils.MathUtils;
                    this._rotation_angle = (this._fabric_item.angle == 360) ? 0 : this._fabric_item.angle;
                    this._width = this._fabric_item.width;
                    this._height = this._fabric_item.height;
                    if (this._fabric_item.angle == 0) {
                        this._x = this._fabric_item.left / this._fabric_item.scaleX;
                        this._y = this._fabric_item.top / this._fabric_item.scaleY;
                    }
                    else {
                        var boundRect = this._fabric_item.getBoundingRect();
                        this._x = boundRect.left / this._fabric_item.scaleX;
                        this._y = boundRect.top / this._fabric_item.scaleY;
                    }
                };
                ImageItem.prototype._updateToCanvas = function () {
                    /*
                    if (property == null) {
                        this._updateToCanvas("x");
                        this._updateToCanvas("y");
                        this._updateToCanvas("width");
                        this._updateToCanvas("height");
                        this._updateToCanvas("locked");
                        this._updateToCanvas("rotation_angle");
                        return;
                    }
                    switch (property) {
                        case "x": {
                            this._fabric_item.left = this._x;
                        } break;
                        case "y": {
                            this._fabric_item.top = this._y;
                        } break;
                        case "locked": {
                            function _l(object, lock) {
                                object.lockMovementX = lock;
                                object.lockMovementY = lock;
                                object.lockScalingX = lock;
                                object.lockScalingY = lock;
                                object.lockRotation = lock;
                            }
                            _l(this._fabric_item, this._locked);
                        } break;
                        case "rotation_angle": {
                            this._fabric_item.angle = this._rotation_angle;
                        } break;
                        case "width": {
                            this._fabric_item.width = this._width;
        
                        } break;
                        case "height": {
                            this._fabric_item.height = this._height;
        
                        } break;
                        default: {
                            this._fabric_item[property] = this[property];
                        } break;
                    }
                    this._fabric_item.setCoords();
                    */
                    this._fabric_item.selectable = this._fabric_item.evented = this._editable;
                    this._fabric_item.lockMovementX = this._locked;
                    this._fabric_item.lockMovementY = this._locked;
                    this._fabric_item.lockScalingX = this._locked || !this.resizable;
                    this._fabric_item.lockScalingY = this._locked || !this.resizable;
                    this._fabric_item.lockRotation = this._locked;
                    this._rotation_angle = (this._rotation_angle >= 360) ? 360 - this._rotation_angle : this._rotation_angle;
                    this._fabric_item.angle = this._rotation_angle;
                    var MathUtils = Neodynamic.Web.Utils.MathUtils;
                    var rect = MathUtils.calcOuterRectOfRotatedRect(0, 0, this._width, this._height, this._fabric_item.angle);
                    if (this._rotation_angle == 0 || this._rotation_angle == 360) {
                        this._fabric_item.left = this._x * this._fabric_item.scaleX;
                        this._fabric_item.top = this._y * this._fabric_item.scaleY;
                    }
                    else {
                        if (this._rotation_angle > 0 && this._rotation_angle < 90) {
                            var beta = 180 - 90 - this._rotation_angle;
                            var offsetX = Math.cos(MathUtils.convertDegreesToRad(beta)) * this._height;
                            //var offsetY = Math.sin(MathUtils.convertDegreesToRad(beta)) * this._height;
                            this._fabric_item.left = (this._x + offsetX) * this._fabric_item.scaleX;
                            this._fabric_item.top = this._y * this._fabric_item.scaleY;
                        }
                        else if (this._rotation_angle == 90) {
                            this._fabric_item.left = (this._x + this._height) * this._fabric_item.scaleX;
                            this._fabric_item.top = this._y * this._fabric_item.scaleY;
                        }
                        if (this._rotation_angle > 90 && this._rotation_angle < 180) {
                            var beta = 270 - 90 - this._rotation_angle;
                            var offsetY = Math.cos(MathUtils.convertDegreesToRad(beta)) * this._height;
                            this._fabric_item.left = (this._x + rect[2]) * this._fabric_item.scaleX;
                            this._fabric_item.top = (this._y + offsetY) * this._fabric_item.scaleY;
                        }
                        else if (this._rotation_angle == 180) {
                            this._fabric_item.left = (this._x + this._width) * this._fabric_item.scaleX;
                            this._fabric_item.top = (this._y + this._height) * this._fabric_item.scaleY;
                        }
                        if (this._rotation_angle > 180 && this._rotation_angle < 270) {
                            var beta = this._rotation_angle - 180;
                            var offsetX = Math.cos(MathUtils.convertDegreesToRad(beta)) * this._width;
                            this._fabric_item.left = (this._x + offsetX) * this._fabric_item.scaleX;
                            this._fabric_item.top = (this._y + rect[3]) * this._fabric_item.scaleY;
                        }
                        else if (this._rotation_angle == 270) {
                            this._fabric_item.left = this._x * this._fabric_item.scaleX;
                            this._fabric_item.top = (this._y + this._width) * this._fabric_item.scaleY;
                        }
                        if (this._rotation_angle > 270 && this._rotation_angle < 360) {
                            var beta = 360 - this._rotation_angle;
                            var offsetY = Math.sin(MathUtils.convertDegreesToRad(beta)) * this._width;
                            this._fabric_item.left = this._x * this._fabric_item.scaleX;
                            this._fabric_item.top = (this._y + offsetY) * this._fabric_item.scaleY;
                        }
                    }
                    this._fabric_item.width = this._width;
                    this._fabric_item.height = this._height;
                    this._fabric_item.setCoords();
                };
                ImageItem.prototype.refresh = function () {
                    //this._updateToCanvas();
                    //var error_message = "";
                    var _this = this;
                    if (!this._source_base64 && !this._source_file) {
                        this._image_item.src = this._missing_image;
                        this._is_missing_image = true;
                        //this._image_item.width = 96;
                        //this._image_item.height = 96;
                        //if (!this._width)
                        //    this._width = 96;
                        //if (!this._height)
                        //    this._height = 96;
                    }
                    else {
                        var rootUrl = $(location).attr('protocol') + "//" + $(location).attr('host');
                        var TLE = Neodynamic.Web.Editor.ThermalLabelEditor;
                        if (TLE.websiteRootAbsoluteUrl)
                            rootUrl = TLE.websiteRootAbsoluteUrl;
                        this._fabric_item.dpi = 96 * (this._fabric_item.scaleX || 1);
                        $.ajax({
                            url: rootUrl + "/" + TLE.thermalLabelWebEditorControllerName + "?_=" + new Date().getTime(),
                            type: "POST",
                            data: { Action: "Render", Type: "Image", Properties: JSON.stringify(this._getProperties()) },
                            async: true
                        }).
                            done(function (data) {
                            if (data.startsWith("ERROR")) {
                                _this._fabric_item.dpi = -1; // force fitting the error image to the fabric.Image obj
                                _this._image_item.src = _this._missing_image;
                                _this._is_missing_image = true;
                                _super.prototype._onError.call(_this, data, "ImageItem");
                            }
                            else {
                                _this._image_item.src = data;
                                _this._has_to_reload = false;
                                _this._is_missing_image = false;
                            }
                            //this._width = this._image_item.width / this._fabric_item.scaleX;
                            //this._height = this._image_item.height / this._fabric_item.scaleY;
                        }).
                            fail(function (data) {
                            _this._fabric_item.dpi = -1; // force fitting the error image to the fabric.Image obj
                            _this._image_item.src = _this._missing_image;
                            _this._is_missing_image = true;
                            //this._image_item.width = 96;
                            //this._image_item.height = 96;
                            //if (!this._width)
                            //    this._width = 96;
                            //if (!this._height)
                            //    this._height = 96;
                            //error_message = "Error when loading image: " + data.responseText;
                            _super.prototype._onError.call(_this, data.responseText, "ImageItem");
                        });
                    }
                    this._updateToCanvas();
                    this._has_to_reload = false;
                    if (this._fabric_item.canvas)
                        this._fabric_item.canvas.renderAll();
                    //if (error_message)
                    //    throw error_message;
                };
                ;
                ;
                return ImageItem;
            }(Printing.Item));
            Printing.ImageItem = ImageItem;
        })(Printing = SDK.Printing || (SDK.Printing = {}));
    })(SDK = Neodynamic.SDK || (Neodynamic.SDK = {}));
})(Neodynamic || (Neodynamic = {}));
var Neodynamic;
(function (Neodynamic) {
    var SDK;
    (function (SDK) {
        var Printing;
        (function (Printing) {
            var RepeaterItem = /** @class */ (function (_super) {
                __extends(RepeaterItem, _super);
                function RepeaterItem() {
                    var _this = _super.call(this) || this;
                    //#region Private Properties 
                    _this._width = 96;
                    _this._height = 96;
                    _this._count = 0;
                    _this._rotation_angle = 0;
                    _this._color = '#00bfff';
                    var self = _this;
                    _this._guid = Neodynamic.Web.Utils.NamingUtils.newGuid();
                    var TextUtils = Neodynamic.Web.Utils.TextUtils;
                    _this._fabric_item = new fabric.RoundedRect({
                        //check the unittype
                        thermal_label_object: self,
                        width: 1,
                        height: 1,
                        top: self._y,
                        left: self._x,
                        angle: self._rotation_angle,
                        fill: self._color + '40',
                        stroke: self._color,
                        strokeWidth: 1
                    }).on('modified', function (e) {
                        self._updateFromCanvas();
                        self._fabric_item.setCoords();
                    });
                    return _this;
                }
                Object.defineProperty(RepeaterItem.prototype, "width", {
                    //#endregion
                    //#region Public Properties
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._width, this._unit_type);
                    },
                    set: function (value) {
                        this._width = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(RepeaterItem.prototype, "height", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._height, this._unit_type);
                    },
                    set: function (value) {
                        this._height = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(RepeaterItem.prototype, "count", {
                    get: function () { return this._count; },
                    set: function (value) {
                        this._count = (value < 0) ? 0 : value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(RepeaterItem.prototype, "rotation_angle", {
                    get: function () { return this._rotation_angle; },
                    set: function (value) {
                        this._rotation_angle = Math.round(value / 90) * 90;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                //#endregion
                RepeaterItem.prototype._updateFromCanvas = function (property) {
                    var MathUtils = Neodynamic.Web.Utils.MathUtils;
                    this._fabric_item.angle = Math.round(this._fabric_item.angle / 90) * 90;
                    this._rotation_angle = (this._fabric_item.angle >= 360) ? 360 - this._fabric_item.angle : this._fabric_item.angle;
                    this._width = this._fabric_item.width;
                    this._height = this._fabric_item.height;
                    this._width += this._fabric_item.strokeWidth;
                    this._height += this._fabric_item.strokeWidth;
                    if (this._fabric_item.angle == 0) {
                        this._x = this._fabric_item.left / this._fabric_item.scaleX;
                        this._y = this._fabric_item.top / this._fabric_item.scaleY;
                    }
                    else {
                        var boundRect = this._fabric_item.getBoundingRect();
                        this._x = boundRect.left / this._fabric_item.scaleX;
                        this._y = boundRect.top / this._fabric_item.scaleY;
                    }
                };
                RepeaterItem.prototype._updateToCanvas = function (property) {
                    var TextUtils = Neodynamic.Web.Utils.TextUtils;
                    this._fabric_item.selectable = this._fabric_item.evented = this._editable;
                    this._fabric_item.fill = TextUtils.isEmpty(this._color) ? '#00bfff40' : this._color + '40';
                    this._fabric_item.stroke = TextUtils.isEmpty(this._color) ? '#00bfff' : this._color;
                    this._fabric_item.lockMovementX = this._locked;
                    this._fabric_item.lockMovementY = this._locked;
                    this._fabric_item.lockScalingX = this._locked || !this.resizable;
                    this._fabric_item.lockScalingY = this._locked || !this.resizable;
                    this._fabric_item.lockRotation = this._locked;
                    this._fabric_item.strokeWidth = 1;
                    this._rotation_angle = Math.round(this._rotation_angle / 90) * 90;
                    this._rotation_angle = (this._rotation_angle >= 360) ? 360 - this._rotation_angle : this._rotation_angle;
                    this._fabric_item.angle = this._rotation_angle;
                    this._fabric_item.lineDash = [0, 2];
                    this._fabric_item.lineCap = 'round';
                    var MathUtils = Neodynamic.Web.Utils.MathUtils;
                    var rect = MathUtils.calcOuterRectOfRotatedRect(0, 0, this._width, this._height, this._fabric_item.angle);
                    if (this._rotation_angle == 0 || this._rotation_angle == 360) {
                        this._fabric_item.left = this._x * this._fabric_item.scaleX;
                        this._fabric_item.top = this._y * this._fabric_item.scaleY;
                    }
                    else {
                        if (this._rotation_angle > 0 && this._rotation_angle < 90) {
                            var beta = 180 - 90 - this._rotation_angle;
                            var offsetX = Math.cos(MathUtils.convertDegreesToRad(beta)) * this._height;
                            //var offsetY = Math.sin(MathUtils.convertDegreesToRad(beta)) * this._height;
                            this._fabric_item.left = (this._x + offsetX) * this._fabric_item.scaleX;
                            this._fabric_item.top = this._y * this._fabric_item.scaleY;
                        }
                        else if (this._rotation_angle == 90) {
                            this._fabric_item.left = (this._x + this._height) * this._fabric_item.scaleX;
                            this._fabric_item.top = this._y * this._fabric_item.scaleY;
                        }
                        if (this._rotation_angle > 90 && this._rotation_angle < 180) {
                            var beta = 270 - 90 - this._rotation_angle;
                            var offsetY = Math.cos(MathUtils.convertDegreesToRad(beta)) * this._height;
                            this._fabric_item.left = (this._x + rect[2]) * this._fabric_item.scaleX;
                            this._fabric_item.top = (this._y + offsetY) * this._fabric_item.scaleY;
                        }
                        else if (this._rotation_angle == 180) {
                            this._fabric_item.left = (this._x + this._width) * this._fabric_item.scaleX;
                            this._fabric_item.top = (this._y + this._height) * this._fabric_item.scaleY;
                        }
                        if (this._rotation_angle > 180 && this._rotation_angle < 270) {
                            var beta = this._rotation_angle - 180;
                            var offsetX = Math.cos(MathUtils.convertDegreesToRad(beta)) * this._width;
                            this._fabric_item.left = (this._x + offsetX) * this._fabric_item.scaleX;
                            this._fabric_item.top = (this._y + rect[3]) * this._fabric_item.scaleY;
                        }
                        else if (this._rotation_angle == 270) {
                            this._fabric_item.left = this._x * this._fabric_item.scaleX;
                            this._fabric_item.top = (this._y + this._width) * this._fabric_item.scaleY;
                        }
                        if (this._rotation_angle > 270 && this._rotation_angle < 360) {
                            var beta = 360 - this._rotation_angle;
                            var offsetY = Math.sin(MathUtils.convertDegreesToRad(beta)) * this._width;
                            this._fabric_item.left = this._x * this._fabric_item.scaleX;
                            this._fabric_item.top = (this._y + offsetY) * this._fabric_item.scaleY;
                        }
                    }
                    this._fabric_item.width = this._width - this._fabric_item.strokeWidth;
                    this._fabric_item.height = this._height - this._fabric_item.strokeWidth;
                    this._fabric_item.setCoords();
                };
                RepeaterItem.prototype.refresh = function () {
                    this._updateToCanvas();
                    if (this._fabric_item.canvas)
                        this._fabric_item.canvas.renderAll();
                };
                RepeaterItem.prototype._getProperties = function () {
                    return {
                        Type: "Repeater",
                        originX: 'left',
                        originY: 'top',
                        RotationAngle: this.rotation_angle,
                        Width: this.width,
                        Height: this.height,
                        Count: this.count,
                        Name: this.name,
                        X: this.x,
                        Y: this.y,
                        UnitType: this.unit_type,
                        DataField: this.data_field,
                        DataFieldFormatString: this.data_field_format_string,
                        PrintAsGraphic: this.print_as_graphic,
                        Comments: this.comments,
                        Tag: this.tag,
                        Locked: this.locked,
                        Editable: this.editable,
                        Expression: Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(this.expression),
                        UseCache: this.use_cache,
                        CacheItemId: this.cache_item_id,
                        Visible: this.visible,
                        GroupName: this.group_name,
                        Resizable: this.resizable
                    };
                };
                return RepeaterItem;
            }(Printing.Item));
            Printing.RepeaterItem = RepeaterItem;
        })(Printing = SDK.Printing || (SDK.Printing = {}));
    })(SDK = Neodynamic.SDK || (Neodynamic.SDK = {}));
})(Neodynamic || (Neodynamic = {}));
var Neodynamic;
(function (Neodynamic) {
    var SDK;
    (function (SDK) {
        var Printing;
        (function (Printing) {
            var TableColumn = /** @class */ (function () {
                function TableColumn() {
                    this._width = 0;
                    this._fill_color = Printing.Color.White;
                    this._fill_color_hex = '';
                }
                Object.defineProperty(TableColumn.prototype, "width", {
                    get: function () { return this._width; },
                    set: function (value) {
                        this._width = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(TableColumn.prototype, "fill_color", {
                    get: function () { return this._fill_color; },
                    set: function (value) {
                        this._fill_color = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(TableColumn.prototype, "fill_color_hex", {
                    get: function () { return this._fill_color_hex; },
                    set: function (value) {
                        this._fill_color_hex = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                TableColumn.prototype._getProperties = function () {
                    return {
                        Width: this.width,
                        FillColor: this.fill_color,
                        FillColorHex: this.fill_color_hex
                    };
                };
                ;
                return TableColumn;
            }());
            Printing.TableColumn = TableColumn;
        })(Printing = SDK.Printing || (SDK.Printing = {}));
    })(SDK = Neodynamic.SDK || (Neodynamic.SDK = {}));
})(Neodynamic || (Neodynamic = {}));
var Neodynamic;
(function (Neodynamic) {
    var SDK;
    (function (SDK) {
        var Printing;
        (function (Printing) {
            var ThermalLabelPage = /** @class */ (function () {
                function ThermalLabelPage() {
                    this._x = 0;
                    this._y = 0;
                    this._width = 0;
                    this._height = 0;
                }
                Object.defineProperty(ThermalLabelPage.prototype, "x", {
                    get: function () { return this._x; },
                    set: function (value) {
                        this._x = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(ThermalLabelPage.prototype, "y", {
                    get: function () { return this._y; },
                    set: function (value) {
                        this._y = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(ThermalLabelPage.prototype, "width", {
                    get: function () { return this._width; },
                    set: function (value) {
                        this._width = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(ThermalLabelPage.prototype, "height", {
                    get: function () { return this._height; },
                    set: function (value) {
                        this._height = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                ThermalLabelPage.prototype._getProperties = function () {
                    return {
                        X: this.x,
                        Y: this.y,
                        Height: this.height,
                        Width: this.width
                    };
                };
                ;
                return ThermalLabelPage;
            }());
            Printing.ThermalLabelPage = ThermalLabelPage;
        })(Printing = SDK.Printing || (SDK.Printing = {}));
    })(SDK = Neodynamic.SDK || (Neodynamic.SDK = {}));
})(Neodynamic || (Neodynamic = {}));
/// <reference path="shapeitem.ts" />
var Neodynamic;
(function (Neodynamic) {
    var SDK;
    (function (SDK) {
        var Printing;
        (function (Printing) {
            var LineShapeItem = /** @class */ (function (_super) {
                __extends(LineShapeItem, _super);
                //public _clone() {
                //    var clone = new Neodynamic.SDK.Printing.LineShapeItem();
                //    clone.orientation = this.orientation;
                //    clone._stroke_thickness = this._stroke_thickness;
                //    clone.stroke_color = this.stroke_color;
                //    clone._width = this._width;
                //    clone._height = this._height;
                //    clone.name = this.name;// + new Date().getTime();
                //    clone._x = this._x;
                //    clone._y = this._y;
                //    clone.unit_type = this.unit_type;
                //    clone.data_field = this.data_field;
                //    clone.data_field_format_string = this.data_field_format_string;
                //    clone.print_as_graphic = this.print_as_graphic;
                //    clone.comments = this.comments;
                //    clone.tag = this.tag;
                //    clone.locked = this.locked;
                //    clone.editable = this.editable;
                //    clone.stroke_color_hex = this.stroke_color_hex;
                //    clone.expression = this.expression;
                //    clone.use_cache = this.use_cache;
                //    clone.cache_item_id = this.cache_item_id;
                //    clone.visible = this.visible;
                //    clone._updateToCanvas();
                //    return clone;
                //}
                function LineShapeItem() {
                    var _this = _super.call(this) || this;
                    //#region Private Properties
                    _this._orientation = Printing.LineOrientation.Horizontal;
                    _this._stroke_thickness = 1;
                    //#endregion
                    _this._rotation_angle = 0;
                    var self = _this;
                    _this._guid = Neodynamic.Web.Utils.NamingUtils.newGuid();
                    var TextUtils = Neodynamic.Web.Utils.TextUtils;
                    _this._fabric_item = new fabric.Rect({
                        //check the unittype
                        thermal_label_object: self,
                        width: 1,
                        height: 1,
                        top: self._y,
                        left: self._x,
                        fill: TextUtils.isEmpty(self._stroke_color_hex) ? (self._stroke_color == Neodynamic.SDK.Printing.Color.Black ? 'black' : 'transparent') : self._stroke_color_hex,
                        strokeWidth: 0,
                        stroke: 'transparent',
                        angle: self._rotation_angle
                    }).on('modified', function (e) {
                        self._updateFromCanvas();
                        self._fabric_item.setCoords();
                        self._drawStrokeStyle();
                    });
                    return _this;
                }
                Object.defineProperty(LineShapeItem.prototype, "orientation", {
                    //#endregion
                    //#region Public Properties
                    get: function () { return this._orientation; },
                    set: function (value) {
                        this._orientation = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(LineShapeItem.prototype, "stroke_thickness", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._stroke_thickness, this._unit_type);
                    },
                    set: function (value) {
                        this._stroke_thickness = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                LineShapeItem.prototype._updateFromCanvas = function (property) {
                    var MathUtils = Neodynamic.Web.Utils.MathUtils;
                    this._rotation_angle = (this._fabric_item.angle == 360) ? 0 : this._fabric_item.angle;
                    this._orientation = this._getOrientation(this._rotation_angle);
                    this._stroke_thickness = this._fabric_item.height;
                    var boundRect = this._fabric_item.getBoundingRect();
                    this._width = boundRect.width / this._fabric_item.scaleX;
                    ;
                    this._height = boundRect.height / this._fabric_item.scaleY;
                    if (this._fabric_item.angle == 0) {
                        this._x = this._fabric_item.left / this._fabric_item.scaleX;
                        this._y = this._fabric_item.top / this._fabric_item.scaleY;
                    }
                    else {
                        this._x = boundRect.left / this._fabric_item.scaleX;
                        this._y = boundRect.top / this._fabric_item.scaleY;
                    }
                    //this._fabric_item.setControlsVisibility({ br: false, tl: false, bl: false, ml: true, mtr: true, mb: true, mr: true, mt: true, tr: false });
                };
                /*
                public _updateFromCanvas(property?) {
                    if (property == null) {
                        this._updateFromCanvas('left');
                        this._updateFromCanvas('top');
                        this._updateFromCanvas('width');
                        this._updateFromCanvas('height');
                        return;
                    }
                    switch (property) {
                        case "left": {
                            this._x = this._fabric_item.left;
                        } break;
                        case "top": {
                            this._y = this._fabric_item.top;
                        } break;
                        default: {
                            this["_" + property] = this._fabric_item[property];
                        } break;
                    }
                    this._orientation = this._getOrientation(this._fabric_item.x1, this._fabric_item.y1, this._fabric_item.x2, this._fabric_item.y2);
                    switch (this._orientation) {
                        case LineOrientation.DiagonalDown: {
                            this._fabric_item.setControlsVisibility({ br: true, tl: true, bl: false, ml: false, mtr: false, mb: false, mr: false, mt: false, tr: false });
                        } break;
                        case LineOrientation.DiagonalUp: {
                            this._fabric_item.setControlsVisibility({ br: false, tl: false, bl: true, ml: false, mtr: false, mb: false, mr: false, mt: false, tr: true });
                        } break;
                        case LineOrientation.Vertical: {
                            this._fabric_item.setControlsVisibility({ br: true, tl: true, bl: false, ml: false, mtr: false, mb: false, mr: false, mt: false, tr: false });
                        } break;
                        case LineOrientation.Horizontal: {
                            this._fabric_item.setControlsVisibility({ br: true, tl: true, bl: false, ml: false, mtr: false, mb: false, mr: false, mt: false, tr: false });
                        } break;
                    }
                }
                */
                LineShapeItem.prototype._drawStrokeStyle = function () {
                    if (this._stroke_thickness > 0 && this._stroke_style != Neodynamic.SDK.Printing.StrokeStyle.Solid) {
                        var patternW = 0;
                        var patternH = this._stroke_thickness;
                        var patternShapes = '';
                        var x = 0;
                        var y = 0;
                        var w = 0;
                        var h = 0;
                        var fill = '';
                        var dashArray = [];
                        if (this._stroke_style == Neodynamic.SDK.Printing.StrokeStyle.Dash) {
                            dashArray = this.getStrokeStylePattern();
                            w = -dashArray[0];
                            h = this._stroke_thickness;
                        }
                        else if (this._stroke_style == Neodynamic.SDK.Printing.StrokeStyle.Dot) {
                            dashArray.push(this._stroke_thickness);
                            dashArray.push(this._stroke_thickness);
                            dashArray.push(this._stroke_thickness);
                            x = -dashArray[0];
                        }
                        for (var i = 0; i < dashArray.length; i++) {
                            if (this._stroke_style == Neodynamic.SDK.Printing.StrokeStyle.Dash) {
                                x += dashArray[i] + w;
                                w = dashArray[i];
                                fill = (i % 2 == 0 ? this._fabric_item.fill : 'transparent');
                                patternShapes += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" style="fill:' + fill + ';" />';
                            }
                            else if (this._stroke_style == Neodynamic.SDK.Printing.StrokeStyle.Dot) {
                                x += dashArray[i];
                                y = dashArray[i] / 2;
                                w = dashArray[i] / 2;
                                h = dashArray[i] / 2;
                                fill = (i % 2 == 0 ? this._fabric_item.fill : 'transparent');
                                patternShapes += '<ellipse cx="' + x + '" cy="' + y + '" rx="' + w + '" ry="' + h + '" style="fill:' + fill + ';" />';
                            }
                        }
                        if (this._stroke_style == Neodynamic.SDK.Printing.StrokeStyle.Dash) {
                            patternW = x;
                        }
                        else if (this._stroke_style == Neodynamic.SDK.Printing.StrokeStyle.Dot) {
                            patternW = x;
                        }
                        var imgPattern = '<svg xmlns="http://www.w3.org/2000/svg" width="' + patternW + '" height="' + patternH + '">' + patternShapes + '</svg>';
                        var imgSrc = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(imgPattern);
                        var self = this;
                        var img = new Image();
                        img.onload = function () {
                            self._fabric_item.set('fill', new fabric.Pattern({
                                source: img,
                                repeat: 'repeat-x',
                                offsetX: 0,
                                offsetY: 0
                            }));
                            self._fabric_item.canvas.renderAll();
                        };
                        img.src = imgSrc;
                    }
                };
                LineShapeItem.prototype._updateToCanvas = function (property) {
                    /*
                    if (property == null) {
                        this._updateToCanvas("x");
                        this._updateToCanvas("y");
                        this._updateToCanvas("stroke_color");
                        this._updateToCanvas("stroke_thickness");
                        this._updateToCanvas("width");
                        this._updateToCanvas("height");
                        this._updateToCanvas("locked");
                        return;
                    }
                    switch (property) {
                        case "x": {
                            this._fabric_item.left = this._x;
                        } break;
                        case "y": {
                            this._fabric_item.top = this._y;
                        } break;
                        case "stroke_color": {
                            this._fabric_item.fill = this._stroke_color == Neodynamic.SDK.Printing.Color.Black ? 'black' : 'white';
                        } break;
                        case "stroke_thickness": {
                            this._fabric_item.height = this._stroke_thickness;
                        } break;
                        case "locked": {
                            function _l(object, lock) {
                                object.lockMovementX = lock;
                                object.lockMovementY = lock;
                                object.lockScalingX = lock;
                                object.lockScalingY = lock;
                                object.lockRotation = lock;
                            }
                            _l(this._fabric_item, this._locked);
                        } break;
                        default: {
                            this._fabric_item[property] = this["_" + property];
                        } break;
                    }
                    */
                    var TextUtils = Neodynamic.Web.Utils.TextUtils;
                    this._fabric_item.fill = TextUtils.isEmpty(this._stroke_color_hex) ? (this._stroke_color == Neodynamic.SDK.Printing.Color.Black ? 'black' : 'transparent') : this._stroke_color_hex;
                    this._fabric_item.height = this._stroke_thickness;
                    this._drawStrokeStyle();
                    if (this._orientation == Printing.LineOrientation.Horizontal) {
                        this._fabric_item.left = this._x * this._fabric_item.scaleX;
                        this._fabric_item.top = this._y * this._fabric_item.scaleY;
                        this._fabric_item.width = this._width;
                        this._fabric_item.angle = 0;
                    }
                    else if (this._orientation == Printing.LineOrientation.Vertical) {
                        this._fabric_item.left = this._x * this._fabric_item.scaleX + this._stroke_thickness;
                        this._fabric_item.top = this._y * this._fabric_item.scaleY;
                        this._fabric_item.width = this._height;
                        this._fabric_item.angle = 90;
                    }
                    else if (this._orientation == Printing.LineOrientation.DiagonalDown) {
                        this._fabric_item.angle = Math.atan(this._height / this._width) * 180 / Math.PI;
                        this._fabric_item.left = (this._x + (this._stroke_thickness / 2 * Math.cos((90 - this._fabric_item.angle) * Math.PI / 180))) * this._fabric_item.scaleX;
                        this._fabric_item.top = (this._y - (this._stroke_thickness / 2 * Math.sin((90 - this._fabric_item.angle) * Math.PI / 180))) * this._fabric_item.scaleY;
                        this._fabric_item.width = this._width / Math.cos(this._fabric_item.angle * Math.PI / 180);
                    }
                    else if (this._orientation == Printing.LineOrientation.DiagonalUp) {
                        this._fabric_item.angle = 360 - (Math.atan(this._height / this._width) * 180 / Math.PI);
                        //this._fabric_item.left = (this._x ) * this._fabric_item.scaleX;
                        //this._fabric_item.top = (this._y + this._height) * this._fabric_item.scaleY;
                        this._fabric_item.left = (this._x - (this._stroke_thickness / 2 * Math.cos((180 - 90 - (Math.atan(this._height / this._width) * 180 / Math.PI)) * Math.PI / 180))) * this._fabric_item.scaleX;
                        this._fabric_item.top = (this._y + this._height - (this._stroke_thickness / 2 * Math.sin((180 - 90 - (Math.atan(this._height / this._width) * 180 / Math.PI)) * Math.PI / 180))) * this._fabric_item.scaleY;
                        this._fabric_item.width = this._width / Math.cos(Math.atan(this._height / this._width));
                    }
                    this._fabric_item.lockMovementX = this._locked;
                    this._fabric_item.lockMovementY = this._locked;
                    this._fabric_item.lockScalingX = this._locked || !this.resizable;
                    this._fabric_item.lockScalingY = this._locked || !this.resizable;
                    this._fabric_item.lockRotation = this._locked;
                    this._fabric_item.selectable = this._fabric_item.evented = this._editable;
                    this._fabric_item.setCoords();
                };
                LineShapeItem.prototype.refresh = function () {
                    this._updateToCanvas();
                    //var coords = this._getCoords(this._y, this._x, this._height, this._width, this._orientation);
                    //this._fabric_item.set({ 'x1': coords[0], 'x2': coords[2], 'y1': coords[1], 'y2': coords[3] });
                    if (this._fabric_item.canvas)
                        this._fabric_item.canvas.renderAll();
                };
                LineShapeItem.prototype._getProperties = function () {
                    return {
                        Type: "Line",
                        Orientation: this.orientation,
                        StrokeThickness: this.stroke_thickness,
                        StrokeColor: this.stroke_color,
                        Width: this.width,
                        Height: this.height,
                        Name: this.name,
                        X: this.x,
                        Y: this.y,
                        UnitType: this.unit_type,
                        DataField: this.data_field,
                        DataFieldFormatString: this.data_field_format_string,
                        PrintAsGraphic: this.print_as_graphic,
                        Comments: this.comments,
                        Tag: this.tag,
                        Locked: this.locked,
                        Editable: this.editable,
                        StrokeColorHex: this.stroke_color_hex,
                        Expression: Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(this.expression),
                        UseCache: this.use_cache,
                        CacheItemId: this.cache_item_id,
                        Visible: this.visible,
                        StrokeStyle: this.stroke_style,
                        StrokeStylePattern: this.stroke_style_pattern,
                        GroupName: this.group_name,
                        Resizable: this.resizable
                    };
                };
                LineShapeItem.prototype._getOrientation = function (angle) {
                    if (angle == 0 || angle == 180)
                        return Printing.LineOrientation.Horizontal;
                    if (angle == 90 || angle == 270)
                        return Printing.LineOrientation.Vertical;
                    if (angle < 90 || (angle > 180 && angle < 270))
                        return Printing.LineOrientation.DiagonalDown;
                    if ((angle > 90 && angle < 180) || (angle > 270 && angle < 360))
                        return Printing.LineOrientation.DiagonalUp;
                };
                ;
                return LineShapeItem;
            }(Printing.ShapeItem));
            Printing.LineShapeItem = LineShapeItem;
        })(Printing = SDK.Printing || (SDK.Printing = {}));
    })(SDK = Neodynamic.SDK || (Neodynamic.SDK = {}));
})(Neodynamic || (Neodynamic = {}));
var Neodynamic;
(function (Neodynamic) {
    var SDK;
    (function (SDK) {
        var Printing;
        (function (Printing) {
            var MonochromeSettings = /** @class */ (function () {
                function MonochromeSettings() {
                    this._dither_method = Printing.DitherMethod.OtsuThreshold;
                    this._reverse_effect = false;
                    this._threshold = 50;
                }
                Object.defineProperty(MonochromeSettings.prototype, "dither_method", {
                    get: function () { return this._dither_method; },
                    set: function (value) {
                        this._dither_method = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MonochromeSettings.prototype, "reverse_effect", {
                    get: function () { return this._reverse_effect; },
                    set: function (value) {
                        this._reverse_effect = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MonochromeSettings.prototype, "threshold", {
                    get: function () { return this._threshold; },
                    set: function (value) {
                        if (value > 100 || value < 0)
                            throw RangeError();
                        this._threshold = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                return MonochromeSettings;
            }());
            Printing.MonochromeSettings = MonochromeSettings;
        })(Printing = SDK.Printing || (SDK.Printing = {}));
    })(SDK = Neodynamic.SDK || (Neodynamic.SDK = {}));
})(Neodynamic || (Neodynamic = {}));
var Neodynamic;
(function (Neodynamic) {
    var SDK;
    (function (SDK) {
        var Printing;
        (function (Printing) {
            var RectangleCornerRadius = /** @class */ (function () {
                function RectangleCornerRadius(top_left, top_right, bottom_right, bottom_left) {
                    this._bottom_left = 0;
                    this._bottom_right = 0;
                    this._top_left = 0;
                    this._top_right = 0;
                    if (top_left != null && top_right != null && bottom_left != null && bottom_right != null) {
                        this.bottom_left = bottom_left;
                        this.bottom_right = bottom_right;
                        this.top_left = top_left;
                        this.top_right = top_right;
                    }
                }
                Object.defineProperty(RectangleCornerRadius.prototype, "bottom_left", {
                    get: function () { return this._bottom_left; },
                    set: function (value) {
                        this._bottom_left = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RectangleCornerRadius.prototype, "bottom_right", {
                    get: function () { return this._bottom_right; },
                    set: function (value) {
                        this._bottom_right = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RectangleCornerRadius.prototype, "top_left", {
                    get: function () { return this._top_left; },
                    set: function (value) {
                        this._top_left = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RectangleCornerRadius.prototype, "top_right", {
                    get: function () { return this._top_right; },
                    set: function (value) {
                        this._top_right = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                RectangleCornerRadius.prototype.propertyChanged = function () { };
                ;
                return RectangleCornerRadius;
            }());
            Printing.RectangleCornerRadius = RectangleCornerRadius;
        })(Printing = SDK.Printing || (SDK.Printing = {}));
    })(SDK = Neodynamic.SDK || (Neodynamic.SDK = {}));
})(Neodynamic || (Neodynamic = {}));
var Neodynamic;
(function (Neodynamic) {
    var SDK;
    (function (SDK) {
        var Printing;
        (function (Printing) {
            var RectangleShapeItem = /** @class */ (function (_super) {
                __extends(RectangleShapeItem, _super);
                //public _clone() {
                //    var clone = new Neodynamic.SDK.Printing.RectangleShapeItem();
                //    clone._corner_radius.bottom_left = this._corner_radius.bottom_left;
                //    clone._corner_radius.bottom_right = this._corner_radius.bottom_right;
                //    clone._corner_radius.top_left = this._corner_radius.top_left;
                //    clone._corner_radius.top_right = this._corner_radius.top_right;
                //    clone.rotation_angle = this.rotation_angle;
                //    clone.fill_color = this.fill_color;
                //    clone._stroke_thickness = this._stroke_thickness;
                //    clone.stroke_color = this.stroke_color;
                //    clone._width = this._width;
                //    clone._height = this._height;
                //    clone.name = this.name;// + new Date().getTime();
                //    clone._x = this._x;
                //    clone._y = this._y;
                //    clone.unit_type = this.unit_type;
                //    clone.data_field = this.data_field;
                //    clone.data_field_format_string = this.data_field_format_string;
                //    clone.print_as_graphic = this.print_as_graphic;
                //    clone.comments = this.comments;
                //    clone.tag = this.tag;
                //    clone.locked = this.locked;
                //    clone.editable = this.editable;
                //    clone.stroke_color_hex = this.stroke_color_hex;
                //    clone.fill_color_hex = this.fill_color_hex;
                //    clone.expression = this.expression;
                //    clone.use_cache = this.use_cache;
                //    clone.cache_item_id = this.cache_item_id;
                //    clone.visible = this.visible;
                //    clone._updateToCanvas();
                //    return clone;
                //}
                function RectangleShapeItem() {
                    var _this = _super.call(this) || this;
                    //#region Private Properties 
                    _this._corner_radius = new Printing.RectangleCornerRadius();
                    _this._rotation_angle = 0;
                    var self = _this;
                    _this._guid = Neodynamic.Web.Utils.NamingUtils.newGuid();
                    var TextUtils = Neodynamic.Web.Utils.TextUtils;
                    _this._fabric_item = new fabric.RoundedRect({
                        //check the unittype
                        thermal_label_object: self,
                        width: 1,
                        rtl: self._corner_radius.top_left,
                        rtr: self._corner_radius.top_right,
                        rbl: self._corner_radius.bottom_left,
                        rbr: self._corner_radius.bottom_right,
                        height: 1,
                        top: self._y,
                        left: self._x,
                        angle: self._rotation_angle,
                        fill: TextUtils.isEmpty(self._fill_color_hex) ? (self._fill_color == Neodynamic.SDK.Printing.Color.Black ? 'black' : 'transparent') : self._fill_color_hex,
                        stroke: TextUtils.isEmpty(self._stroke_color_hex) ? (self._stroke_color == Neodynamic.SDK.Printing.Color.Black ? 'black' : 'transparent') : self._stroke_color_hex,
                        strokeWidth: 1 | self._stroke_thickness
                    }).on('modified', function (e) {
                        self._updateFromCanvas();
                        self._fabric_item.setCoords();
                    });
                    return _this;
                }
                Object.defineProperty(RectangleShapeItem.prototype, "corner_radius", {
                    //#endregion
                    //#region Public Properties
                    get: function () {
                        var toRet = new Printing.RectangleCornerRadius();
                        toRet.bottom_left = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._corner_radius.bottom_left, this._unit_type);
                        toRet.bottom_right = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._corner_radius.bottom_right, this._unit_type);
                        toRet.top_left = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._corner_radius.top_left, this._unit_type);
                        toRet.top_right = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._corner_radius.top_right, this._unit_type);
                        return toRet;
                    },
                    set: function (value) {
                        this._corner_radius.top_right = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value.top_right, this._unit_type);
                        this._corner_radius.top_left = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value.top_left, this._unit_type);
                        this._corner_radius.bottom_right = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value.bottom_right, this._unit_type);
                        this._corner_radius.bottom_left = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value.bottom_left, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(RectangleShapeItem.prototype, "rotation_angle", {
                    get: function () { return this._rotation_angle; },
                    set: function (value) {
                        if (value < 0 || value > 360)
                            throw new RangeError();
                        this._rotation_angle = (value == 360) ? 0 : value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                //#endregion
                RectangleShapeItem.prototype._updateFromCanvas = function (property) {
                    /*
                    if (property == null) {
                        this._updateFromCanvas('left');
                        this._updateFromCanvas('top');
                        this._updateFromCanvas('width');
                        this._updateFromCanvas('height');
                        this._updateFromCanvas('angle');
                        return;
                    }
                    switch (property) {
                        case "left": {
                            this._x = this._fabric_item.left;
                        } break;
                        case "top": {
                            this._y = this._fabric_item.top;
                        } break;
                        case "angle": {
                            this._rotation_angle = this._fabric_item.angle;
                        } break;
                        default: {
                            this["_" + property] = this._fabric_item[property];
                        } break;
                    }
                    */
                    var MathUtils = Neodynamic.Web.Utils.MathUtils;
                    this._rotation_angle = (this._fabric_item.angle == 360) ? 0 : this._fabric_item.angle;
                    this._width = this._fabric_item.width;
                    this._height = this._fabric_item.height;
                    if (this._stroke_color == Neodynamic.SDK.Printing.Color.Black) {
                        this._width += this._fabric_item.strokeWidth;
                        this._height += this._fabric_item.strokeWidth;
                    }
                    if (this._fabric_item.angle == 0) {
                        this._x = this._fabric_item.left / this._fabric_item.scaleX;
                        this._y = this._fabric_item.top / this._fabric_item.scaleY;
                    }
                    else {
                        var boundRect = this._fabric_item.getBoundingRect();
                        //console.log(boundRect.left / 96 / this._fabric_item.scaleX, boundRect.top / 96 / this._fabric_item.scaleY, boundRect.width / 96 / this._fabric_item.scaleX, boundRect.height / 96 / this._fabric_item.scaleY);
                        this._x = boundRect.left / this._fabric_item.scaleX;
                        this._y = boundRect.top / this._fabric_item.scaleY;
                        //console.log('RotRect: ', rect[0] / 96, rect[1] / 96, rect[2] / 96, rect[3] / 96);
                        //console.log('FabItem X, Y: ', this._fabric_item.left / 96 / this._fabric_item.scaleX, this._fabric_item.top / 96 / this._fabric_item.scaleY);
                        //console.log('FabItem W, H: ', this._fabric_item.width / 96, this._fabric_item.height / 96);
                    }
                };
                RectangleShapeItem.prototype._updateToCanvas = function (property) {
                    /*
                    if (property == null) {
                        this._updateToCanvas("x");
                        this._updateToCanvas("y");
                        this._updateToCanvas("fill_color");
                        this._updateToCanvas("stroke_color");
                        this._updateToCanvas("width");
                        this._updateToCanvas("height");
                        this._updateToCanvas("locked");
                        this._updateToCanvas("stroke_thickness");
                        this._updateToCanvas("rotation_angle");
                        this._updateToCanvas("corner_radius");
                        return;
                    }
                    switch (property) {
                        case "x": {
                            this._fabric_item.left = this._x;
                        } break;
                        case "y": {
                            this._fabric_item.top = this._y;
                        } break;
                        case "fill_color": {
                            this._fabric_item.fill = this._fill_color == Neodynamic.SDK.Printing.Color.Black ? 'black' : 'transparent';
                        } break;
                        case "stroke_color": {
                            this._fabric_item.stroke = this._stroke_color == Neodynamic.SDK.Printing.Color.Black ? 'black' : 'transparent';
                        } break;
                        case "locked": {
                            function _l(object, lock) {
                                object.lockMovementX = lock;
                                object.lockMovementY = lock;
                                object.lockScalingX = lock;
                                object.lockScalingY = lock;
                                object.lockRotation = lock;
                            }
                            _l(this._fabric_item, this._locked);
                        } break;
                        case "stroke_thickness": {
                            this._fabric_item.strokeWidth = this._stroke_thickness;
                        } break;
                        case "rotation_angle": {
                            this._fabric_item.angle = this._rotation_angle;
                        } break;
                        case "corner_radius": {
                            this._fabric_item.rtl = this._corner_radius.top_left;
                            this._fabric_item.rtr = this._corner_radius.top_right;
                            this._fabric_item.rbl = this._corner_radius.bottom_left;
                            this._fabric_item.rbr = this._corner_radius.bottom_right;
                        } break;
                        default: {
                            this._fabric_item[property] = this["_" + property];
                        } break;
                    }
                    this._fabric_item.setCoords();
        
                    */
                    var TextUtils = Neodynamic.Web.Utils.TextUtils;
                    this._fabric_item.selectable = this._fabric_item.evented = this._editable;
                    this._fabric_item.fill = TextUtils.isEmpty(this._fill_color_hex) ? (this._fill_color == Neodynamic.SDK.Printing.Color.Black ? 'black' : 'transparent') : this._fill_color_hex;
                    this._fabric_item.stroke = TextUtils.isEmpty(this._stroke_color_hex) ? (this._stroke_color == Neodynamic.SDK.Printing.Color.Black ? 'black' : 'transparent') : this._stroke_color_hex;
                    this._fabric_item.lockMovementX = this._locked;
                    this._fabric_item.lockMovementY = this._locked;
                    this._fabric_item.lockScalingX = this._locked || !this.resizable;
                    this._fabric_item.lockScalingY = this._locked || !this.resizable;
                    this._fabric_item.lockRotation = this._locked;
                    this._fabric_item.strokeWidth = this._stroke_thickness;
                    this._rotation_angle = (this._rotation_angle >= 360) ? 360 - this._rotation_angle : this._rotation_angle;
                    this._fabric_item.angle = this._rotation_angle;
                    this._fabric_item.rtl = this._corner_radius.top_left;
                    this._fabric_item.rtr = this._corner_radius.top_right;
                    this._fabric_item.rbl = this._corner_radius.bottom_left;
                    this._fabric_item.rbr = this._corner_radius.bottom_right;
                    if (this._stroke_thickness > 0) {
                        if (this._stroke_style == Neodynamic.SDK.Printing.StrokeStyle.Solid) {
                            this._fabric_item.lineDash = null;
                        }
                        else if (this._stroke_style == Neodynamic.SDK.Printing.StrokeStyle.Dash) {
                            this._fabric_item.lineDash = this.getStrokeStylePattern();
                            this._fabric_item.lineCap = 'butt';
                        }
                        else if (this._stroke_style == Neodynamic.SDK.Printing.StrokeStyle.Dot) {
                            this._fabric_item.lineDash = [0, this._stroke_thickness * 2];
                            this._fabric_item.lineCap = 'round';
                        }
                    }
                    var MathUtils = Neodynamic.Web.Utils.MathUtils;
                    var rect = MathUtils.calcOuterRectOfRotatedRect(0, 0, this._width, this._height, this._fabric_item.angle);
                    //var tlPoint = MathUtils.rotatedTopLeft(this._x, this._y, this._width, this._height, this._rotation_angle);
                    if (this._rotation_angle == 0 || this._rotation_angle == 360) {
                        this._fabric_item.left = this._x * this._fabric_item.scaleX;
                        this._fabric_item.top = this._y * this._fabric_item.scaleY;
                    }
                    else {
                        if (this._rotation_angle > 0 && this._rotation_angle < 90) {
                            var beta = 180 - 90 - this._rotation_angle;
                            var offsetX = Math.cos(MathUtils.convertDegreesToRad(beta)) * this._height;
                            //var offsetY = Math.sin(MathUtils.convertDegreesToRad(beta)) * this._height;
                            this._fabric_item.left = (this._x + offsetX) * this._fabric_item.scaleX;
                            this._fabric_item.top = this._y * this._fabric_item.scaleY;
                        }
                        else if (this._rotation_angle == 90) {
                            this._fabric_item.left = (this._x + this._height) * this._fabric_item.scaleX;
                            this._fabric_item.top = this._y * this._fabric_item.scaleY;
                        }
                        if (this._rotation_angle > 90 && this._rotation_angle < 180) {
                            var beta = 270 - 90 - this._rotation_angle;
                            var offsetY = Math.cos(MathUtils.convertDegreesToRad(beta)) * this._height;
                            this._fabric_item.left = (this._x + rect[2]) * this._fabric_item.scaleX;
                            this._fabric_item.top = (this._y + offsetY) * this._fabric_item.scaleY;
                        }
                        else if (this._rotation_angle == 180) {
                            this._fabric_item.left = (this._x + this._width) * this._fabric_item.scaleX;
                            this._fabric_item.top = (this._y + this._height) * this._fabric_item.scaleY;
                        }
                        if (this._rotation_angle > 180 && this._rotation_angle < 270) {
                            var beta = this._rotation_angle - 180;
                            var offsetX = Math.cos(MathUtils.convertDegreesToRad(beta)) * this._width;
                            this._fabric_item.left = (this._x + offsetX) * this._fabric_item.scaleX;
                            this._fabric_item.top = (this._y + rect[3]) * this._fabric_item.scaleY;
                        }
                        else if (this._rotation_angle == 270) {
                            this._fabric_item.left = this._x * this._fabric_item.scaleX;
                            this._fabric_item.top = (this._y + this._width) * this._fabric_item.scaleY;
                        }
                        if (this._rotation_angle > 270 && this._rotation_angle < 360) {
                            var beta = 360 - this._rotation_angle;
                            var offsetY = Math.sin(MathUtils.convertDegreesToRad(beta)) * this._width;
                            this._fabric_item.left = this._x * this._fabric_item.scaleX;
                            this._fabric_item.top = (this._y + offsetY) * this._fabric_item.scaleY;
                        }
                        //var rect = MathUtils.calcOuterRectOfRotatedRect(0, 0, this._width, this._height, this._fabric_item.angle);
                        //this._fabric_item.left = (this._x + ((rect[2] - this._width) / 2)) * this._fabric_item.scaleX;
                        //this._fabric_item.top = (this._y + ((rect[3] - this._height) / 2)) * this._fabric_item.scaleY;  
                        //this._fabric_item.left = tlPoint.left * this._fabric_item.scaleX;
                        //this._fabric_item.top = tlPoint.top * this._fabric_item.scaleY;
                    }
                    if (this._stroke_color == Neodynamic.SDK.Printing.Color.Black) {
                        this._fabric_item.width = this._width - this._stroke_thickness;
                        this._fabric_item.height = this._height - this._stroke_thickness;
                    }
                    else {
                        this._fabric_item.width = this._width;
                        this._fabric_item.height = this._height;
                    }
                    //console.log('FabItem X, Y: ', this._fabric_item.left / 96 / this._fabric_item.scaleX, this._fabric_item.top / 96 / this._fabric_item.scaleY);
                    //console.log('Rot Top Left X, Y: ', tlPoint.left / 96, tlPoint.top / 96);
                    //console.log(this._fabric_item.oCoords);
                    this._fabric_item.setCoords();
                };
                RectangleShapeItem.prototype.refresh = function () {
                    this._updateToCanvas();
                    if (this._fabric_item.canvas)
                        this._fabric_item.canvas.renderAll();
                };
                RectangleShapeItem.prototype._getProperties = function () {
                    return {
                        Type: "Rectangle",
                        originX: 'left',
                        originY: 'top',
                        RotationAngle: this.rotation_angle,
                        CornerRadius_BottomLeft: this.corner_radius.bottom_left,
                        CornerRadius_BottomRight: this.corner_radius.bottom_right,
                        CornerRadius_TopLeft: this.corner_radius.top_left,
                        CornerRadius_TopRight: this.corner_radius.top_right,
                        FillColor: this.fill_color,
                        StrokeThickness: this.stroke_thickness,
                        StrokeColor: this.stroke_color,
                        Width: this.width,
                        Height: this.height,
                        Name: this.name,
                        X: this.x,
                        Y: this.y,
                        UnitType: this.unit_type,
                        DataField: this.data_field,
                        DataFieldFormatString: this.data_field_format_string,
                        PrintAsGraphic: this.print_as_graphic,
                        Comments: this.comments,
                        Tag: this.tag,
                        Locked: this.locked,
                        Editable: this.editable,
                        FillColorHex: this.fill_color_hex,
                        StrokeColorHex: this.stroke_color_hex,
                        Expression: Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(this.expression),
                        UseCache: this.use_cache,
                        CacheItemId: this.cache_item_id,
                        Visible: this.visible,
                        StrokeStyle: this.stroke_style,
                        StrokeStylePattern: this.stroke_style_pattern,
                        GroupName: this.group_name,
                        Resizable: this.resizable
                    };
                };
                return RectangleShapeItem;
            }(Printing.ClosedShapeItem));
            Printing.RectangleShapeItem = RectangleShapeItem;
        })(Printing = SDK.Printing || (SDK.Printing = {}));
    })(SDK = Neodynamic.SDK || (Neodynamic.SDK = {}));
})(Neodynamic || (Neodynamic = {}));
var Neodynamic;
(function (Neodynamic) {
    var SDK;
    (function (SDK) {
        var Printing;
        (function (Printing) {
            var RFIDTagItem = /** @class */ (function (_super) {
                __extends(RFIDTagItem, _super);
                //public _clone() {
                //    var clone = new Neodynamic.SDK.Printing.RFIDTagItem();
                //    clone.epc_data_structure = this.epc_data_structure;
                //    clone.data_format = this.data_format;
                //    clone.data_to_encode = this.data_to_encode;
                //    clone.name = this.name;// + new Date().getTime();
                //    clone._x = this._x;
                //    clone._y = this._y;
                //    clone.unit_type = this.unit_type;
                //    clone.data_field = this.data_field;
                //    clone.data_field_format_string = this.data_field_format_string;
                //    clone.print_as_graphic = this.print_as_graphic;
                //    clone.comments = this.comments;
                //    clone.tag = this.tag;
                //    clone.locked = this.locked;
                //    clone.editable = this.editable;
                //    clone.expression = this.expression;
                //    clone.use_cache = this.use_cache;
                //    clone.cache_item_id = this.cache_item_id;
                //    clone.visible = this.visible;
                //    clone._updateToCanvas();
                //    return clone;
                //}
                function RFIDTagItem() {
                    var _this = _super.call(this) || this;
                    //#region Private Properties
                    _this._data_format = Printing.RFIDTagDataFormat.ASCII;
                    _this._data_to_encode = '';
                    _this._epc_data_structure = '';
                    _this._tag_type = Printing.RFIDTagType.Default;
                    _this._starting_block = -1;
                    _this._number_of_bytes = 0;
                    _this._memory_bank = '';
                    _this._access_password = '';
                    _this._kill_password = '';
                    //#endregion
                    _this._image = new Image();
                    var self = _this;
                    _this._guid = Neodynamic.Web.Utils.NamingUtils.newGuid();
                    _this._image.src = "data:image/gif;base64,R0lGODlhZABkAOYAAAAAAHh4eDY2NszMzBISEmZmZq2trVpaWufn56WlpQcHByQkJEZGRp2dne/v79/f32ZmZsPDw93d3ZKSkh4eHo+Pj0BAQGJiYtXV1bu7u////05OTqmpqXR0dLm5uS4uLgwMDFBQUBoaGoaGhsXFxeTk5BgYGDg4OFRUVA4ODm5ubrS0tO3t7dra2s/Pz0xMTFxcXEJCQpmZmaurq7+/vyoqKjAwMMnJyTw8PH5+fqGhoRQUFOLi4gAAALGxsQoKCl5eXuvr6yAgIEhISFhYWHJycigoKNPT02traxwcHNfX13x8fBAQEERERJWVlVJSUuPj43Z2diIiIhYWFsHBwcfHxzMzM729vaOjo/Hx8UpKStvb22BgYFZWVunp6XBwcCwsLD4+Pre3t5+fnzo6Oq+vr6enp9HR0WpqarOzs5mZmSYmJggICJOTk4mJiXp6egQEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEHABoALAAAAABkAGQAAAf/gBqCg4SFhoRIAIqLjI2Oj5CRkpOPh5aXGk4/lJydnp+LmKKDTqCmp6gAo6INqa6vkquXOo0hBbe4ubq7vL2+v8BGjLKHHI1RxMnKyxoqw8w+cIxfzNXWlhfPyh5sjEjX4OHZoco0IIwFhVks7O3u7/Dx8vP07g6E44rKESmMMIUkKPwYSLCgwYMIEypcWHBHlkH5VBG7QYARikJVKsLaKOnHPUERiQ3YwWhDIYocU0IC8VFDyFVHTDAaclKjypuLWELUhkmJCEYWHg5CuQgHh6NIkypdyrSpU6fOFOkEydPSFiGMyLTUMEDmojBbw4nV4CNny5eXHqxhJIAFIRc//xdZCDs2XAKzO8lZQlCDkQ0vhM7EVdREqCAeOhIrXsy4sePHkBU/EHRX6tmqhILYYAQGAaEjgwEwMKxBwlqcoHRQxktVbyEWAhgZgfI59GhCLaSgNsVhteW8+gw5OMFoweRBGEIPIa2EwiImQqJLn069uvXr1J0v6q2hMoCpLjFnscCIwhZCGLQrekE6/SIjx+uOcnBOEXfv4NEKysKAkQgMhCiB1SIbtKeeEBLIJwt92/n23WWuabABIzu4gNuAioRQyBFJLGICgAquwsIm9jmYH09PMMLEDYRcxcgThcC1CAEDhCjLiA12x1p4ehHBSAoRtIghABcRMsAUOQVpo/+IJAJw344vFcAICFcQIoFui3RxEkmKsJGBJQ6gccCYZJZp5ploltnAIDiWqONvrekzBCM/iGHlAowQseUicPhgSRA47AbAP4K06aSJEOrzYxmEPCDMIgcAZBMcCVjiBXGCplNok0/CyaOiiwBBCA99LULoIBHYBMCahwQRm6AAaKqBoZ0+CJwq6AzyQKmKiEqIOYxM8KcVU8Zg7LHIJqussv0oIiutiN6qASMXDDLnItUSkkF9irix1wcqklBXoM6yyWm0ceKK7SCvApDtINsykoMlPIBBYRXytfvsuW/amu606wpCLgBKECIGtwB0YMmu/tWY7yL75ohfouoq8i7/eYpYKMgKTQKAxsK8AiCCww+Xu6nEUA5D7SAYA6AxDQr4Y4lp/mmsoL7mouxpSCsL0rLDblhkSQtDUgBiiDif7ObE0vasQQyLOFzBjKQhpx4AQrSwpAZJz8ov0/86DbUiUi8iwiEcMrJGglt3DW2/J4bidBNRCzK1ImfHeHUNbLcNcc5Lpyx3wBr0pwiLGtwtcoyh1RCf3yZ7rbO/n1bs7iCGA4C44nkLcoNXinxA29bs/q30oXBTDLDFmC+yudmEvOAXYKSXHvnbYFe++uWCXAsAvonDPsiEihjhVu22xwo46rnzTLgWi4gbPN6EEA+AhsgnH3HgO6tMuOyKSM95//UEZq/98rXGDSrrgoAPgPjCC2L9C+YL4vbXgq/Pu4SLKDn+8IugX/3uNzn1We5d1vNf/Pi3HkPcpBAE5B7lnMc+BgJAgdQDYAML8UBCRJB5+TvgIEKwCCrYbYHzc6BKIGg6yUnQgLt7FwkVQYMTZlB+AVRhSlh4O/x1b3AVTBENbbg4DQJAgITo4PlOlz7VOQ0Fi6jh9IqIww0mURFMsIAWLYCVLG7RBlkEgBctsJmqfLCJTSMcFIc4xc5ZEImDkEshQmCBX9URAHUchAuYECFMKY+J6NKd07oQRSK6MYUcVMQdxegDGixSkdNapBAeQAtFbOGSlwRXDwvoRML5SP8RX2oj+awYR0hqMQQu8EEdt5jFSK6OCw6gxPZA+EP9veuTAAjl/6p4RB3mURAusMEvNaBFV8pRlugLJAX3d4BF6BKFOUwkHqc1SVo8cprYVAQskQnI1KWxgs1UhAcMOcpeSnORdaTj7u4oSUouQgnwjGc8PdPN5nkPnIuwkyiNCEdBHFMRFXCAhoDiSj3yMTiiwF0IYzgIGOSTnPzUYRixyMWWiZE8YyxjhCyh0FqKUBAOVcQKIMrLfu5uI0zi5Df3B4RFpIGkb9QhR1L6wk5WsKWK8NM+SypTlI6ioxO85/7yodNdxlSaM/2pD4MKxKEuglE7PeoVd6hUlYaNcPn/MABMEVm/QwAVhk6TkiK0GlWudvU1SwUr4cQKgBlstXxnFQ630HjVCrKVO0a1nkniqo65KlOo77rrWxWRgg8Y9rCITaxiF8vYxh42ZHQV5FoXYYbBwioVkV3mu9CwiEqV9bKuyCxgB5EIRXjWqBYFbWr+2tR3lRYAqonqGDpA29ra9ra4za1ud8tb2mrMnq0dRFRgC1O+LgO4thTuImJrVOMqA7kfbcYixlBc5xLDGB5lqCC+sAhWKc4EDyiBeMdL3vKa97zoTa9609uGhTqtCN0lomoFpdYKwlcRMpDvfFFT3/11YBH5neJ++WtT/wJYECMYMKwK/K4oLMIJgniAqwcmTOEKW/jCGM6whjfMYQyHsq77C8CDrVs7zQ5CxIpoA4lJZ2JBoBgAwlrxklqsgSUcWMY24mxwBWFjRaggAkAOspCHTOQiG/nISE6ykoPsvujmQMFQroTTnhzlKidXEFS2cpS1q4Esa1nBXHaABMZM5jKb+cxoTrOa18zmNqOZkDvGcfbYajkVyNl8w7WcEYDB5z77+c+A7sWj9PflQp+00Fo+NKKrrIFAAAA7C";
                    _this._image.onload = function () {
                        self._fabric_item.width = self._image.width;
                        self._fabric_item.height = self._image.height;
                        if (self._fabric_item.canvas)
                            self._fabric_item.canvas.renderAll();
                    };
                    _this._fabric_item = new fabric.Image(self._image, {
                        //check the unittype
                        thermal_label_object: self,
                        originX: 'left',
                        originY: 'top',
                        hasControls: false,
                        top: self._y,
                        left: self._x,
                        width: 100,
                        height: 100,
                        lockScalingX: true,
                        lockScalingY: true,
                        lockRotation: true
                    }).on('modified', function (e) {
                        self._updateFromCanvas();
                        self._fabric_item.setCoords();
                    });
                    return _this;
                }
                Object.defineProperty(RFIDTagItem.prototype, "data_format", {
                    //#region Public Properties
                    get: function () { return this._data_format; },
                    set: function (value) {
                        this._data_format = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RFIDTagItem.prototype, "data_to_encode", {
                    get: function () { return this._data_to_encode; },
                    set: function (value) {
                        if (this._readonly)
                            return;
                        this._data_to_encode = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RFIDTagItem.prototype, "epc_data_structure", {
                    get: function () { return this._epc_data_structure; },
                    set: function (value) {
                        this._epc_data_structure = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RFIDTagItem.prototype, "tag_type", {
                    get: function () { return this._tag_type; },
                    set: function (value) {
                        this._tag_type = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RFIDTagItem.prototype, "starting_block", {
                    get: function () { return this._starting_block; },
                    set: function (value) {
                        this._starting_block = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RFIDTagItem.prototype, "number_of_bytes", {
                    get: function () { return this._number_of_bytes; },
                    set: function (value) {
                        this._number_of_bytes = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RFIDTagItem.prototype, "memory_bank", {
                    get: function () { return this._memory_bank; },
                    set: function (value) {
                        this._memory_bank = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RFIDTagItem.prototype, "access_password", {
                    get: function () { return this._access_password; },
                    set: function (value) {
                        this._access_password = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RFIDTagItem.prototype, "kill_password", {
                    get: function () { return this._kill_password; },
                    set: function (value) {
                        this._kill_password = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                //#endregion
                RFIDTagItem.prototype._updateFromCanvas = function (property) {
                    if (property == null) {
                        this._updateFromCanvas('left');
                        this._updateFromCanvas('top');
                        return;
                    }
                    switch (property) {
                        case "left":
                            {
                                this._x = this._fabric_item.left;
                            }
                            break;
                        case "top":
                            {
                                this._y = this._fabric_item.top;
                            }
                            break;
                        default:
                            {
                                this["_" + property] = this._fabric_item[property];
                            }
                            break;
                    }
                };
                RFIDTagItem.prototype._updateToCanvas = function (property) {
                    if (property == null) {
                        this._updateToCanvas("x");
                        this._updateToCanvas("y");
                        this._updateToCanvas("locked");
                        return;
                    }
                    switch (property) {
                        case "x":
                            {
                                this._fabric_item.left = this._x;
                            }
                            break;
                        case "y":
                            {
                                this._fabric_item.top = this._y;
                            }
                            break;
                        case "locked":
                            {
                                this._fabric_item.lockMovementX = this._locked;
                                this._fabric_item.lockMovementY = this._locked;
                            }
                            break;
                        case "editable":
                            {
                                this._fabric_item.selectable = this._editable;
                            }
                            break;
                        default:
                            {
                                this._fabric_item[property] = this[property];
                            }
                            break;
                    }
                    this._fabric_item.setCoords();
                };
                RFIDTagItem.prototype.refresh = function () {
                    this._updateToCanvas();
                    if (this._fabric_item.canvas)
                        this._fabric_item.canvas.renderAll();
                };
                RFIDTagItem.prototype._getProperties = function () {
                    return {
                        Type: "RFID",
                        EPCDataStructure: this.epc_data_structure,
                        DataFormat: this.data_format,
                        DataToEncode: this.data_to_encode,
                        Name: this.name,
                        X: this.x,
                        Y: this.y,
                        UnitType: this.unit_type,
                        DataField: this.data_field,
                        DataFieldFormatString: this.data_field_format_string,
                        PrintAsGraphic: this.print_as_graphic,
                        Comments: this.comments,
                        Tag: this.tag,
                        Locked: this.locked,
                        Editable: this.editable,
                        Expression: Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(this.expression),
                        UseCache: this.use_cache,
                        CacheItemId: this.cache_item_id,
                        Visible: this.visible,
                        GroupName: this.group_name,
                        Resizable: this.resizable,
                        ReadOnly: this.read_only,
                        TagType: this.tag_type,
                        StartingBlock: this.starting_block,
                        NumberOfBytes: this.number_of_bytes,
                        MemoryBank: this.memory_bank,
                        AccessPassword: this.access_password,
                        KillPassword: this.kill_password
                    };
                };
                return RFIDTagItem;
            }(Printing.Item));
            Printing.RFIDTagItem = RFIDTagItem;
        })(Printing = SDK.Printing || (SDK.Printing = {}));
    })(SDK = Neodynamic.SDK || (Neodynamic.SDK = {}));
})(Neodynamic || (Neodynamic = {}));
var Neodynamic;
(function (Neodynamic) {
    var SDK;
    (function (SDK) {
        var Printing;
        (function (Printing) {
            var TextItem = /** @class */ (function (_super) {
                __extends(TextItem, _super);
                //public _clone() {
                //    var clone = new Neodynamic.SDK.Printing.TextItem();
                //    clone.name = this.name;// + new Date().getTime();
                //    clone.unit_type = this.unit_type;
                //    clone._x = this._x;
                //    clone._y = this._y;
                //    clone._border_thickness.bottom = this._border_thickness.bottom;
                //    clone._border_thickness.left = this._border_thickness.left;
                //    clone._border_thickness.right = this._border_thickness.right;
                //    clone._border_thickness.top = this._border_thickness.top;
                //    clone._text_padding.bottom = this._text_padding.bottom;
                //    clone._text_padding.left = this._text_padding.left;
                //    clone._text_padding.right = this._text_padding.right;
                //    clone._text_padding.top = this._text_padding.top;
                //    clone._corner_radius.bottom_left = this._corner_radius.bottom_left;
                //    clone._corner_radius.bottom_right = this._corner_radius.bottom_right;
                //    clone._corner_radius.top_left = this._corner_radius.top_left;
                //    clone._corner_radius.top_right = this._corner_radius.top_right;
                //    clone.font.bold = this.font.bold;
                //    clone.font.code_page = this.font.code_page;
                //    clone.font.custom_font_file = this.font.custom_font_file;
                //    clone.font.custom_font_file_family_name = this.font.custom_font_file_family_name;
                //    clone.font.is_bitmap_font = this.font.is_bitmap_font;
                //    clone.font.italic = this.font.italic;
                //    clone.font.name = this.font.name;
                //    clone.font.name_at_printer_storage = this.font.name_at_printer_storage;
                //    clone.font.size = this.font.size;
                //    clone.font.strikeout = this.font.strikeout;
                //    clone.font.threshold = this.font.threshold;
                //    clone.font.underline = this.font.underline;
                //    clone.font.unit = this.font.unit;
                //    clone.back_color = this.back_color;
                //    clone.border_color = this.border_color;
                //    clone.counter_step = this.counter_step;
                //    clone.counter_use_leading_zeros = this.counter_use_leading_zeros;
                //    clone.culture_name = this.culture_name;
                //    clone.font = this.font;
                //    clone.fore_color = this.fore_color;
                //    clone._height = this._height;
                //    clone.mask = this.mask;
                //    clone.right_to_left = this.right_to_left;
                //    clone.rotation_angle = this.rotation_angle;
                //    clone.sizing = this.sizing;
                //    clone.text = this.text;
                //    clone.max_length = this.max_length;
                //    clone.text_alignment = this.text_alignment;
                //    clone._width = this._width;
                //    clone.comments = this.comments;
                //    clone.data_field = this.data_field;
                //    clone.data_field_format_string = this.data_field_format_string;
                //    clone.print_as_graphic = this.print_as_graphic;
                //    clone.tag = this.tag;
                //    clone.locked = this.locked;
                //    clone.editable = this.editable;
                //    clone.hide_if_empty = this.hide_if_empty;
                //    clone.border_color_hex = this.border_color_hex;
                //    clone.back_color_hex = this.back_color_hex;
                //    clone.fore_color_hex = this.fore_color_hex;
                //    clone.input_mask_pattern = this.input_mask_pattern;
                //    clone.input_mask_prompt_char = this.input_mask_prompt_char;
                //    clone.expression = this.expression;
                //    clone.use_cache = this.use_cache;
                //    clone.cache_item_id = this.cache_item_id;
                //    clone.stroke_color_hex = this.stroke_color_hex;
                //    clone.stroke_thickness = this.stroke_thickness;
                //    clone.visible = this.visible;
                //    clone._updateToCanvas();
                //    return clone;
                //}
                function TextItem() {
                    var _this = _super.call(this) || this;
                    //#region Private Properties
                    _this._back_color = Printing.Color.White;
                    _this._border_color = Printing.Color.Black;
                    _this._border_thickness = new Printing.FrameThickness();
                    _this._corner_radius = new Printing.RectangleCornerRadius();
                    _this._counter_step = 0;
                    _this._counter_use_leading_zeros = false;
                    _this._culture_name = "en-US";
                    _this._font = new Printing.Font();
                    _this._fore_color = Printing.Color.Black;
                    _this._height = 48;
                    _this._mask = '';
                    _this._mask_increment = '';
                    _this._right_to_left = false;
                    _this._rotation_angle = 0;
                    _this._sizing = Printing.TextSizing.None;
                    _this._text = '';
                    _this._text_alignment = Printing.TextAlignment.Left;
                    _this._text_padding = new Printing.FrameThickness();
                    _this._width = 96;
                    _this._max_length = 0;
                    _this._hide_if_empty = false;
                    _this._back_color_hex = '';
                    _this._border_color_hex = '';
                    _this._fore_color_hex = '';
                    _this._input_mask_pattern = '';
                    _this._input_mask_prompt_char = '_';
                    _this._stroke_thickness = 0;
                    _this._stroke_color_hex = '';
                    _this._char_spacing = 0;
                    _this._line_spacing = 0;
                    _this._validation_regex = '';
                    _this._validation_error_message = '';
                    _this._multiline = true;
                    _this._text_vertical_alignment = Printing.TextVerticalAlignment.Top;
                    _this._min_font_size = 0;
                    _this._use_slashed_zero = false;
                    /*  Booleano si tiene que recargar la imagen    */
                    _this._has_to_reload = false;
                    /*  Imagen contenedora del BC   */
                    _this._image_item = new Image();
                    _this._is_in_edit_mode = false;
                    var self = _this;
                    _this._guid = Neodynamic.Web.Utils.NamingUtils.newGuid();
                    _this._image_item.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
                    _this._image_item.onload = function () {
                        //self._fabric_item.width = this.width;
                        //self._fabric_item.height = this.height;
                        //self._width = this.width;
                        //self._height = this.height;
                        //self._fabric_item.dpi = 96 * (self._fabric_item.scaleX || 1);
                        var curWidth = self._width;
                        var curHeight = self._height;
                        if (self._sizing == Printing.TextSizing.AutoSize) {
                            self._updateFromCanvas();
                            // reset auto size barcode image...
                            var txtAutoSizeW = self._image_item.width;
                            var txtAutoSizeH = self._image_item.height;
                            self._width = txtAutoSizeW;
                            self._height = txtAutoSizeH;
                            // reset X, Y depending on the barcode alignment
                            var diffX = 0;
                            var diffY = 0;
                            if (self.text_alignment == SDK.Printing.TextAlignment.Center
                                || self.text_alignment == SDK.Printing.TextAlignment.Justify) {
                                diffX = (curWidth - txtAutoSizeW) / 2;
                                diffY = 0;
                                if (self.rotation_angle == 90 || self.rotation_angle == 180)
                                    diffY = (curHeight - txtAutoSizeH);
                            }
                            else if (self.text_alignment == SDK.Printing.TextAlignment.Left) {
                                if (self.rotation_angle == 90) {
                                    diffY = (curHeight - txtAutoSizeH);
                                }
                                else if (self.rotation_angle == 180) {
                                    diffX = (curWidth - txtAutoSizeW);
                                    diffY = (curHeight - txtAutoSizeH);
                                }
                                else if (self.rotation_angle == 270) {
                                    diffX = (curWidth - txtAutoSizeW);
                                }
                            }
                            else if (self.text_alignment == SDK.Printing.TextAlignment.Right) {
                                if (self.rotation_angle == 90) {
                                    diffY = (curHeight - txtAutoSizeH);
                                    diffX = (curWidth - txtAutoSizeW);
                                }
                                else if (self.rotation_angle == 180) {
                                    diffY = (curHeight - txtAutoSizeH);
                                }
                                else if (self.rotation_angle == 270) {
                                    //diffY = (curBcHeight - bcAutoSizeH);
                                    //diffX = (curBcWidth - bcAutoSizeW);
                                }
                                else {
                                    diffX = (curWidth - txtAutoSizeW);
                                }
                            }
                            self._x += (self.rotation_angle == 0 || self.rotation_angle == 180) ? diffX : diffY;
                            self._y += (self.rotation_angle == 0 || self.rotation_angle == 180) ? diffY : diffX;
                            self._updateToCanvas();
                        }
                        if (self._fabric_item.canvas)
                            self._fabric_item.canvas.renderAll();
                    };
                    _this._fabric_item = new fabric.Image(self._image_item, {
                        //check the unittype
                        thermal_label_object: self,
                        originX: 'left',
                        originY: 'top',
                        top: self._y,
                        left: self._x,
                        width: 1,
                        height: 1,
                        stroke: '#dadada',
                        strokeWidth: 1,
                        angle: self._rotation_angle
                    }).on('modified', function (e) {
                        self._updateFromCanvas();
                        /*if (self._has_to_reload) {
                            self.refresh();
                        }*/
                    }).on('scaling', function () {
                        self._has_to_reload = true;
                    }).on('mouseup', function (e) {
                        self._updateFromCanvas();
                        if (self._has_to_reload) {
                            self.refresh();
                        }
                    }).on('object:dblclick', function (e) {
                        self._dblClick(e);
                    });
                    return _this;
                    //this._fabric_item._render = function (ctx) {
                    //    console.log('render');
                    //    console.log(ctx);
                    //    let cx = this.left + this.width / 2;
                    //    let cy = this.top + this.height / 2;
                    //    ctx.save();
                    //    ctx.translate(this.left, this.top);
                    //    ctx.rotate(self._fabric_item.angle);
                    //    ctx.drawImage(self._image_item, 0,0);
                    //    ctx.rotate(-self._fabric_item.angle);
                    //    ctx.translate(-this.left, -this.top);
                    //    ctx.restore();
                    //};
                }
                Object.defineProperty(TextItem.prototype, "back_color", {
                    //#endregion
                    //#region Public Properties
                    get: function () { return this._back_color; },
                    set: function (value) {
                        this._back_color = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TextItem.prototype, "border_color", {
                    get: function () { return this._border_color; },
                    set: function (value) {
                        this._border_color = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TextItem.prototype, "border_thickness", {
                    get: function () {
                        var toRet = new Printing.FrameThickness();
                        toRet.bottom = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._border_thickness.bottom, this._unit_type);
                        toRet.right = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._border_thickness.right, this._unit_type);
                        toRet.left = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._border_thickness.left, this._unit_type);
                        toRet.top = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._border_thickness.top, this._unit_type);
                        return toRet;
                    },
                    set: function (value) {
                        this._border_thickness.top = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value.top, this._unit_type);
                        this._border_thickness.left = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value.left, this._unit_type);
                        this._border_thickness.right = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value.right, this._unit_type);
                        this._border_thickness.bottom = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value.bottom, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(TextItem.prototype, "corner_radius", {
                    get: function () {
                        var toRet = new Printing.RectangleCornerRadius();
                        toRet.bottom_left = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._corner_radius.bottom_left, this._unit_type);
                        toRet.bottom_right = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._corner_radius.bottom_right, this._unit_type);
                        toRet.top_left = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._corner_radius.top_left, this._unit_type);
                        toRet.top_right = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._corner_radius.top_right, this._unit_type);
                        return toRet;
                    },
                    set: function (value) {
                        this._corner_radius.top_right = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value.top_right, this._unit_type);
                        this._corner_radius.top_left = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value.top_left, this._unit_type);
                        this._corner_radius.bottom_right = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value.bottom_right, this._unit_type);
                        this._corner_radius.bottom_left = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value.bottom_left, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(TextItem.prototype, "counter_step", {
                    get: function () { return this._counter_step; },
                    set: function (value) {
                        this._counter_step = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TextItem.prototype, "counter_use_leading_zeros", {
                    get: function () { return this._counter_use_leading_zeros; },
                    set: function (value) {
                        this._counter_use_leading_zeros = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TextItem.prototype, "culture_name", {
                    get: function () { return this._culture_name; },
                    set: function (value) {
                        this._culture_name = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TextItem.prototype, "font", {
                    get: function () { return this._font; },
                    set: function (value) {
                        this._font = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TextItem.prototype, "fore_color", {
                    get: function () { return this._fore_color; },
                    set: function (value) {
                        this._fore_color = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TextItem.prototype, "height", {
                    get: function () { return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._height, this._unit_type); },
                    set: function (value) {
                        this._height = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(TextItem.prototype, "mask", {
                    get: function () { return this._mask; },
                    set: function (value) {
                        this._mask = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TextItem.prototype, "mask_increment", {
                    get: function () { return this._mask_increment; },
                    set: function (value) {
                        this._mask_increment = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TextItem.prototype, "right_to_left", {
                    get: function () { return this._right_to_left; },
                    set: function (value) {
                        this._right_to_left = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TextItem.prototype, "rotation_angle", {
                    get: function () { return this._rotation_angle; },
                    set: function (value) {
                        if (value < 0 || value > 360)
                            throw new RangeError();
                        this._rotation_angle = (value == 360) ? 0 : value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TextItem.prototype, "sizing", {
                    get: function () { return this._sizing; },
                    set: function (value) {
                        this._sizing = value;
                        this._resizable = (value != Printing.TextSizing.AutoSize);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TextItem.prototype, "text", {
                    get: function () {
                        if (this._max_length > 0)
                            this._text = this._text.substring(0, this._max_length);
                        return this._text;
                    },
                    set: function (value) {
                        if (this._readonly)
                            return;
                        if (this._validation_regex && this._validation_regex.length > 0) {
                            var regex = new RegExp(this._validation_regex);
                            if (!regex.test(value))
                                throw new Error((this._validation_error_message && this._validation_error_message.length > 0) ? this._validation_error_message : 'The specified value is not valid.');
                        }
                        this._text = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TextItem.prototype, "text_alignment", {
                    get: function () { return this._text_alignment; },
                    set: function (value) {
                        this._text_alignment = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TextItem.prototype, "text_padding", {
                    get: function () {
                        var toRet = new Printing.FrameThickness();
                        toRet.bottom = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._text_padding.bottom, this._unit_type);
                        toRet.right = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._text_padding.right, this._unit_type);
                        toRet.left = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._text_padding.left, this._unit_type);
                        toRet.top = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._text_padding.top, this._unit_type);
                        return toRet;
                    },
                    set: function (value) {
                        this._text_padding.top = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value.top, this._unit_type);
                        this._text_padding.left = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value.left, this._unit_type);
                        this._text_padding.right = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value.right, this._unit_type);
                        this._text_padding.bottom = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value.bottom, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(TextItem.prototype, "width", {
                    get: function () { return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._width, this._unit_type); },
                    set: function (value) {
                        this._width = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(TextItem.prototype, "max_length", {
                    get: function () { return this._max_length; },
                    set: function (value) {
                        this._max_length = value;
                        if (value > 0)
                            this.text = this.text.substring(0, value);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TextItem.prototype, "hide_if_empty", {
                    get: function () { return this._hide_if_empty; },
                    set: function (value) {
                        this._hide_if_empty = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(TextItem.prototype, "back_color_hex", {
                    get: function () { return this._back_color_hex; },
                    set: function (value) {
                        this._back_color_hex = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(TextItem.prototype, "border_color_hex", {
                    get: function () { return this._border_color_hex; },
                    set: function (value) {
                        this._border_color_hex = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(TextItem.prototype, "fore_color_hex", {
                    get: function () { return this._fore_color_hex; },
                    set: function (value) {
                        this._fore_color_hex = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(TextItem.prototype, "input_mask_pattern", {
                    get: function () { return this._input_mask_pattern; },
                    set: function (value) {
                        this._input_mask_pattern = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(TextItem.prototype, "input_mask_prompt_char", {
                    get: function () { return this._input_mask_prompt_char; },
                    set: function (value) {
                        this._input_mask_prompt_char = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(TextItem.prototype, "stroke_color_hex", {
                    get: function () { return this._stroke_color_hex; },
                    set: function (value) {
                        this._stroke_color_hex = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(TextItem.prototype, "stroke_thickness", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._stroke_thickness, this._unit_type);
                    },
                    set: function (value) {
                        this._stroke_thickness = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(TextItem.prototype, "char_spacing", {
                    get: function () { return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._char_spacing, this._unit_type); },
                    set: function (value) {
                        this._char_spacing = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(TextItem.prototype, "line_spacing", {
                    get: function () { return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._line_spacing, this._unit_type); },
                    set: function (value) {
                        this._line_spacing = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(TextItem.prototype, "validation_regex", {
                    get: function () { return this._validation_regex; },
                    set: function (value) {
                        this._validation_regex = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(TextItem.prototype, "validation_error_message", {
                    get: function () { return this._validation_error_message; },
                    set: function (value) {
                        this._validation_error_message = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(TextItem.prototype, "multiline", {
                    get: function () { return this._multiline; },
                    set: function (value) {
                        this._multiline = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TextItem.prototype, "text_vertical_alignment", {
                    get: function () { return this._text_vertical_alignment; },
                    set: function (value) {
                        this._text_vertical_alignment = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TextItem.prototype, "min_font_size", {
                    get: function () { return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._min_font_size, this._unit_type); },
                    set: function (value) {
                        this._min_font_size = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(TextItem.prototype, "use_slashed_zero", {
                    get: function () { return this._use_slashed_zero; },
                    set: function (value) {
                        this._use_slashed_zero = value;
                        this.propertyChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                //#endregion
                TextItem.prototype._updateFromCanvas = function () {
                    /*
                    if (property == null) {
                        if (this._width != this._fabric_item.width || this._height != this._fabric_item.height)
                            this._has_to_reload = true;
                        this._updateFromCanvas('left');
                        this._updateFromCanvas('top');
                        this._updateFromCanvas('width');
                        this._updateFromCanvas('height');
                        this._updateFromCanvas('angle');
                        return;
                    }
                    switch (property) {
                        case "left": {
                            this._x = this._fabric_item.left;
                        } break;
                        case "top": {
                            this._y = this._fabric_item.top;
                        } break;
                        case "angle": {
                            this._rotation_angle = this._fabric_item.angle;
                        } break;
                        case "height": {
                            this._height = this._fabric_item.height;
                        } break;
                        case "width": {
                            this._width = this._fabric_item.width;
                        } break;
                        default: {
                            this["_" + property] = this._fabric_item[property];
                        } break;
                    }
                    */
                    if (this._width != this._fabric_item.width || this._height != this._fabric_item.height)
                        this._has_to_reload = true;
                    var MathUtils = Neodynamic.Web.Utils.MathUtils;
                    if (this._font.name.indexOf('NativePrinterFont') == 0) { //NativePrinterFonts only support 90, 180,270
                        this._fabric_item.angle = Math.round(this._fabric_item.angle / 90) * 90;
                    }
                    this._rotation_angle = (this._fabric_item.angle == 360) ? 0 : this._fabric_item.angle;
                    this._width = this._fabric_item.width;
                    this._height = this._fabric_item.height;
                    if (this._fabric_item.angle == 0) {
                        this._x = this._fabric_item.left / this._fabric_item.scaleX;
                        this._y = this._fabric_item.top / this._fabric_item.scaleY;
                    }
                    else {
                        var boundRect = this._fabric_item.getBoundingRect();
                        this._x = boundRect.left / this._fabric_item.scaleX;
                        this._y = boundRect.top / this._fabric_item.scaleY;
                    }
                };
                TextItem.prototype._updateToCanvas = function () {
                    /*
                    if (property == null) {
                        this._updateToCanvas("x");
                        this._updateToCanvas("y");
                        this._updateToCanvas("width");
                        this._updateToCanvas("height");
                        this._updateToCanvas("locked");
                        this._updateToCanvas("rotation_angle");
                        return;
                    }
                    switch (property) {
                        case "x": {
                            this._fabric_item.left = this._x;
                        } break;
                        case "y": {
                            this._fabric_item.top = this._y;
                        } break;
                        case "locked": {
                            function _l(object, lock) {
                                object.lockMovementX = lock;
                                object.lockMovementY = lock;
                                object.lockScalingX = lock;
                                object.lockScalingY = lock;
                                object.lockRotation = lock;
                            }
                            _l(this._fabric_item, this._locked);
                        } break;
                        case "rotation_angle": {
                            this._fabric_item.angle = this._rotation_angle;
                        } break;
                        case "width": {
                            this._fabric_item.width = this._width;
                        } break;
                        case "height": {
                            this._fabric_item.height = this._height;
                        } break;
                        default: {
                            this._fabric_item[property] = this[property];
                        } break;
                    }
                    this._fabric_item.setCoords();
                    */
                    this._fabric_item.selectable = this._fabric_item.evented = this._editable;
                    this._fabric_item.lockMovementX = this._locked;
                    this._fabric_item.lockMovementY = this._locked;
                    this._fabric_item.lockScalingX = this._locked || !this.resizable;
                    this._fabric_item.lockScalingY = this._locked || !this.resizable;
                    this._fabric_item.lockRotation = this._locked;
                    if (this._font.name.indexOf('NativePrinterFont') == 0) { //NativePrinterFonts only support 90, 180,270
                        this._rotation_angle = Math.round(this._rotation_angle / 90) * 90;
                    }
                    this._rotation_angle = (this._rotation_angle >= 360) ? 360 - this._rotation_angle : this._rotation_angle;
                    this._fabric_item.angle = this._rotation_angle;
                    var MathUtils = Neodynamic.Web.Utils.MathUtils;
                    var rect = MathUtils.calcOuterRectOfRotatedRect(0, 0, this._width, this._height, this._fabric_item.angle);
                    if (this._rotation_angle == 0 || this._rotation_angle == 360) {
                        this._fabric_item.left = this._x * this._fabric_item.scaleX;
                        this._fabric_item.top = this._y * this._fabric_item.scaleY;
                    }
                    else {
                        if (this._rotation_angle > 0 && this._rotation_angle < 90) {
                            var beta = 180 - 90 - this._rotation_angle;
                            var offsetX = Math.cos(MathUtils.convertDegreesToRad(beta)) * this._height;
                            //var offsetY = Math.sin(MathUtils.convertDegreesToRad(beta)) * this._height;
                            this._fabric_item.left = (this._x + offsetX) * this._fabric_item.scaleX;
                            this._fabric_item.top = this._y * this._fabric_item.scaleY;
                        }
                        else if (this._rotation_angle == 90) {
                            this._fabric_item.left = (this._x + this._height) * this._fabric_item.scaleX;
                            this._fabric_item.top = this._y * this._fabric_item.scaleY;
                        }
                        if (this._rotation_angle > 90 && this._rotation_angle < 180) {
                            var beta = 270 - 90 - this._rotation_angle;
                            var offsetY = Math.cos(MathUtils.convertDegreesToRad(beta)) * this._height;
                            this._fabric_item.left = (this._x + rect[2]) * this._fabric_item.scaleX;
                            this._fabric_item.top = (this._y + offsetY) * this._fabric_item.scaleY;
                        }
                        else if (this._rotation_angle == 180) {
                            this._fabric_item.left = (this._x + this._width) * this._fabric_item.scaleX;
                            this._fabric_item.top = (this._y + this._height) * this._fabric_item.scaleY;
                        }
                        if (this._rotation_angle > 180 && this._rotation_angle < 270) {
                            var beta = this._rotation_angle - 180;
                            var offsetX = Math.cos(MathUtils.convertDegreesToRad(beta)) * this._width;
                            this._fabric_item.left = (this._x + offsetX) * this._fabric_item.scaleX;
                            this._fabric_item.top = (this._y + rect[3]) * this._fabric_item.scaleY;
                        }
                        else if (this._rotation_angle == 270) {
                            this._fabric_item.left = this._x * this._fabric_item.scaleX;
                            this._fabric_item.top = (this._y + this._width) * this._fabric_item.scaleY;
                        }
                        if (this._rotation_angle > 270 && this._rotation_angle < 360) {
                            var beta = 360 - this._rotation_angle;
                            var offsetY = Math.sin(MathUtils.convertDegreesToRad(beta)) * this._width;
                            this._fabric_item.left = this._x * this._fabric_item.scaleX;
                            this._fabric_item.top = (this._y + offsetY) * this._fabric_item.scaleY;
                        }
                    }
                    this._fabric_item.width = this._width;
                    this._fabric_item.height = this._height;
                    this._fabric_item.setCoords();
                };
                TextItem.prototype.refresh = function () {
                    var _this = this;
                    //var error_message = "";
                    this._updateToCanvas();
                    var rootUrl = $(location).attr('protocol') + "//" + $(location).attr('host');
                    var TLE = Neodynamic.Web.Editor.ThermalLabelEditor;
                    if (TLE.websiteRootAbsoluteUrl)
                        rootUrl = TLE.websiteRootAbsoluteUrl;
                    this._fabric_item.dpi = 96 * (this._fabric_item.scaleX || 1);
                    $.ajax({
                        url: rootUrl + "/" + TLE.thermalLabelWebEditorControllerName + "?_=" + new Date().getTime(),
                        type: "POST",
                        data: { Action: "Render", Type: "Text", Properties: JSON.stringify(this._getProperties()) },
                        async: true
                    }).
                        done(function (data) {
                        if (data.startsWith("ERROR")) {
                            _this._fabric_item.dpi = -1; // force fitting the error image to the fabric.Image obj
                            _this._image_item.src = _this._missing_image;
                            _super.prototype._onError.call(_this, data, "TextItem");
                        }
                        else {
                            _this._image_item.src = data;
                            _this._has_to_reload = false;
                        }
                        if (_this._fabric_item.canvas) {
                            _this._fabric_item.canvas.renderAll();
                        }
                    }).
                        fail(function (data) {
                        _this._fabric_item.dpi = -1; // force fitting the error image to the fabric.Image obj
                        _this._image_item.src = _this._missing_image;
                        //error_message = "Error when loading image: " + data.responseText;  
                        _super.prototype._onError.call(_this, data.responseText, "TextItem");
                    });
                    //if (error_message)
                    //    throw error_message;
                };
                TextItem.prototype._getProperties = function () {
                    return {
                        Type: "Text",
                        UnitType: this.unit_type,
                        X: this.x,
                        Y: this.y,
                        //Dpi: 96,
                        Dpi: 96 * (this._fabric_item.scaleX || 1),
                        //Dpi: this._dpi,
                        BorderThickness_Bottom: this.border_thickness.bottom,
                        BorderThickness_Left: this.border_thickness.left,
                        BorderThickness_Right: this.border_thickness.right,
                        BorderThickness_Top: this.border_thickness.top,
                        TextPadding_Bottom: this.text_padding.bottom,
                        TextPadding_Left: this.text_padding.left,
                        TextPadding_Right: this.text_padding.right,
                        TextPadding_Top: this.text_padding.top,
                        CornerRadius_BottomLeft: this.corner_radius.bottom_left,
                        CornerRadius_BottomRight: this.corner_radius.bottom_right,
                        CornerRadius_TopLeft: this.corner_radius.top_left,
                        CornerRadius_TopRight: this.corner_radius.top_right,
                        Font_Bold: this.font.bold,
                        Font_CodePage: this.font.code_page,
                        Font_CustomFontFile: this.font.custom_font_file,
                        Font_CustomFontFileFamilyName: this.font.custom_font_file_family_name,
                        Font_IsBitmapFont: this.font.is_bitmap_font,
                        Font_Italic: this.font.italic,
                        Font_Name: this.font.name,
                        Font_NameAtPrinterStorage: this.font.name_at_printer_storage,
                        Font_Size: this.font.size,
                        Font_Strikeout: this.font.strikeout,
                        Font_Threshold: this.font.threshold,
                        Font_Underline: this.font.underline,
                        Font_Unit: this.font.unit,
                        BackColor: this.back_color,
                        BorderColor: this.border_color,
                        CounterStep: this.counter_step,
                        CounterUseLeadingZeros: this.counter_use_leading_zeros,
                        CultureName: this.culture_name,
                        Font: this.font,
                        ForeColor: this.fore_color,
                        Height: this.height,
                        Mask: this.mask,
                        MaxLength: this._max_length,
                        RightToLeft: this.right_to_left,
                        RotationAngle: this.rotation_angle,
                        Sizing: this.sizing,
                        Text: this.text,
                        TextAlignment: this.text_alignment,
                        Width: this.width,
                        Comments: this.comments,
                        DataField: this.data_field,
                        DataFieldFormatString: this.data_field_format_string,
                        Name: this.name,
                        PrintAsGraphic: this.print_as_graphic,
                        Tag: this.tag,
                        Locked: this.locked,
                        Editable: this.editable,
                        HideIfEmpty: this.hide_if_empty,
                        BorderColorHex: this.border_color_hex,
                        BackColorHex: this.back_color_hex,
                        ForeColorHex: this.fore_color_hex,
                        InputMaskPattern: this.input_mask_pattern,
                        InputMaskPromptChar: this.input_mask_prompt_char,
                        Expression: Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(this.expression),
                        UseCache: this.use_cache,
                        CacheItemId: this.cache_item_id,
                        StrokeThickness: this.stroke_thickness,
                        StrokeColorHex: this.stroke_color_hex,
                        Visible: this.visible,
                        CharSpacing: this.char_spacing,
                        LineSpacing: this.line_spacing,
                        GroupName: this.group_name,
                        Resizable: this.resizable,
                        ReadOnly: this.read_only,
                        ValidationRegEx: Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(this.validation_regex),
                        ValidationErrorMessage: Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(this.validation_error_message),
                        Multiline: this.multiline,
                        TextVerticalAlignment: this.text_vertical_alignment,
                        MinFontSize: this.min_font_size,
                        UseSlashedZero: this.use_slashed_zero
                    };
                };
                ;
                TextItem.prototype._dblClick = function (e) {
                    if (this.editable && this.read_only == false)
                        this.enterInEditMode();
                };
                ;
                TextItem.prototype.enterInEditMode = function () {
                    var _this = this;
                    this._is_in_edit_mode = true;
                    var canvasPos = $('#tlweCanvas').offset();
                    var zoomX = this._fabric_item.scaleX;
                    var zoomY = this._fabric_item.scaleY;
                    var x = zoomX * this._x + canvasPos.left;
                    var y = zoomY * this._y + canvasPos.top;
                    zoomX = (zoomX > 1 ? zoomX : 1);
                    zoomY = (zoomY > 1 ? zoomY : 1);
                    var editCtrl;
                    if (this.input_mask_pattern && this.input_mask_pattern.length > 0) {
                        editCtrl = $('<input type="text" >').focusout(function (i) { _this._onEditCtrlLostFocus(editCtrl); }).keyup(function (e) { if (e.which == 27)
                            _this._onEditCtrlLostFocus(editCtrl); });
                        var mask = this.input_mask_pattern;
                        var promptChar = this.input_mask_prompt_char;
                        editCtrl[0].addEventListener('input', function () {
                            Neodynamic.Web.Utils.MaskEditUtils.masking(editCtrl[0], mask, promptChar);
                        });
                        $(editCtrl).val(this.text);
                        Neodynamic.Web.Utils.MaskEditUtils.masking(editCtrl[0], mask, promptChar);
                    }
                    else {
                        editCtrl = $('<textarea maxlength="' + (this.max_length > 0 ? this.max_length : '') + '"></textarea>').focusout(function (i) { _this._onEditCtrlLostFocus(editCtrl); }).keyup(function (e) { if (e.which == 27)
                            _this._onEditCtrlLostFocus(editCtrl); });
                        $(editCtrl).text(this.text);
                    }
                    $(editCtrl).css("position", "absolute").css("width", this._width * zoomX).css("height", this._height * zoomY).
                        css("top", y).css("left", x).css("z-index", 90000).
                        css("font-size", Neodynamic.Web.Utils.UnitUtils.convertFontUnitToPixel(this.font.size, this.font.unit)).
                        css("font-family", this.font.name).
                        css("resize", "none").
                        css("overflow", "hidden");
                    $("body").append(editCtrl);
                    $(editCtrl).focus();
                };
                ;
                TextItem.prototype._onEditCtrlLostFocus = function (ctrl) {
                    var newText = (this.input_mask_pattern && this.input_mask_pattern.length > 0) ? Neodynamic.Web.Utils.MaskEditUtils.getMaskedData(ctrl[0], this.input_mask_prompt_char) : $(ctrl).val();
                    if (this.text != newText) {
                        this.text = newText;
                        this.refresh();
                    }
                    $(ctrl).remove();
                    this._is_in_edit_mode = false;
                };
                ;
                Object.defineProperty(TextItem.prototype, "is_in_edit_mode", {
                    get: function () { return this._is_in_edit_mode; },
                    enumerable: true,
                    configurable: true
                });
                return TextItem;
            }(Printing.Item));
            Printing.TextItem = TextItem;
        })(Printing = SDK.Printing || (SDK.Printing = {}));
    })(SDK = Neodynamic.SDK || (Neodynamic.SDK = {}));
})(Neodynamic || (Neodynamic = {}));
var Neodynamic;
(function (Neodynamic) {
    var SDK;
    (function (SDK) {
        var Printing;
        (function (Printing) {
            var ThermalLabel = /** @class */ (function () {
                function ThermalLabel() {
                    this._unit_type = Printing.UnitType.Inch;
                    this._width = 96;
                    this._height = 96;
                    this._gap_length = 0;
                    this.is_continuous = false;
                    this.items = [];
                    this._labels_horizontal_gap_length = 0;
                    this.labels_per_row = 1;
                    this._mark_length = 0;
                    this._offset_length = 0;
                    this.data_member = '';
                    this.data_source = null;
                    this.data_source_culture_info = '';
                    this.print_speed = '';
                    this.print_mirror = false;
                    this.cut_after_printing = false;
                    this.darkness = -1000;
                    this._sheet_labels_width = 0;
                    this._sheet_labels_height = 0;
                    this.sheet_labels_count = 0;
                    this._sheet_labels_margin = new Printing.FrameThickness();
                    this.expressions = [];
                    this.batch_cut = 1;
                    this.design_background_image = '';
                    this._margin = new Printing.FrameThickness();
                    this.use_default_media_type = false;
                    this.pages = [];
                    //public getCopy(): ThermalLabel {
                    //    var clone = new Neodynamic.SDK.Printing.ThermalLabel();
                    //    clone._unit_type = this._unit_type;
                    //    clone._width = this._width;
                    //    clone._height = this._height;
                    //    clone._gap_length = this._gap_length;
                    //    clone.is_continuous = this.is_continuous;
                    //    clone._labels_horizontal_gap_length = this._labels_horizontal_gap_length;
                    //    clone.labels_per_row = this.labels_per_row;
                    //    clone._mark_length = this._mark_length;
                    //    clone._offset_length = this._offset_length;
                    //    clone.data_member = this.data_member;
                    //    clone.data_source = this.data_source;
                    //    clone.data_source_culture_info = this.data_source_culture_info;
                    //    clone.print_speed = this.print_speed;
                    //    clone.print_mirror = this.print_mirror;
                    //    clone.cut_after_printing = this.cut_after_printing;
                    //    clone.darkness = this.darkness;
                    //    clone._sheet_labels_width = this._sheet_labels_width;
                    //    clone._sheet_labels_height = this._sheet_labels_height;
                    //    clone.sheet_labels_count = this.sheet_labels_count;
                    //    //clone._sheet_labels_margin = new FrameThickness();
                    //    clone._sheet_labels_margin.top = this._sheet_labels_margin.top;
                    //    clone._sheet_labels_margin.left = this._sheet_labels_margin.left;
                    //    clone._sheet_labels_margin.right = this._sheet_labels_margin.right;
                    //    clone._sheet_labels_margin.bottom = this._sheet_labels_margin.bottom;
                    //    //clone.items = [];
                    //    this.items.forEach(x => {
                    //        clone.items.push(x._clone());
                    //    });
                    //    //clone.expressions = [];
                    //    this.expressions.forEach(x => {
                    //        clone.expressions.push(x);
                    //    });
                    //    return clone;
                    //}
                }
                ThermalLabel.prototype._onUnitChange = function () { };
                ;
                Object.defineProperty(ThermalLabel.prototype, "width", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._width, this._unit_type);
                    },
                    set: function (value) {
                        this._width = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this._onUnitChange();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ThermalLabel.prototype, "height", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._height, this._unit_type);
                    },
                    set: function (value) {
                        this._height = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this._onUnitChange();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ThermalLabel.prototype, "unit_type", {
                    get: function () {
                        return this._unit_type;
                    },
                    set: function (value) {
                        this._unit_type = value;
                        this.items.forEach(function (x) {
                            x.unit_type = value;
                        });
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ThermalLabel.prototype, "gap_length", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._gap_length, this._unit_type);
                    },
                    set: function (value) {
                        this._gap_length = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this._onUnitChange();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ThermalLabel.prototype, "labels_horizontal_gap_length", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._labels_horizontal_gap_length, this._unit_type);
                    },
                    set: function (value) {
                        this._labels_horizontal_gap_length = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this._onUnitChange();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ThermalLabel.prototype, "mark_length", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._mark_length, this._unit_type);
                    },
                    set: function (value) {
                        this._mark_length = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this._onUnitChange();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ThermalLabel.prototype, "offset_length", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._offset_length, this._unit_type);
                    },
                    set: function (value) {
                        this._offset_length = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this._onUnitChange();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ThermalLabel.prototype, "sheet_labels_width", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._sheet_labels_width, this._unit_type);
                    },
                    set: function (value) {
                        this._sheet_labels_width = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this._onUnitChange();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ThermalLabel.prototype, "sheet_labels_height", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._sheet_labels_height, this._unit_type);
                    },
                    set: function (value) {
                        this._sheet_labels_height = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._unit_type);
                        this._onUnitChange();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ThermalLabel.prototype, "sheet_labels_margin", {
                    get: function () {
                        var toRet = new Printing.FrameThickness();
                        toRet.bottom = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._sheet_labels_margin.bottom, this._unit_type);
                        toRet.right = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._sheet_labels_margin.right, this._unit_type);
                        toRet.left = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._sheet_labels_margin.left, this._unit_type);
                        toRet.top = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._sheet_labels_margin.top, this._unit_type);
                        return toRet;
                    },
                    set: function (value) {
                        this._sheet_labels_margin.top = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value.top, this._unit_type);
                        this._sheet_labels_margin.left = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value.left, this._unit_type);
                        this._sheet_labels_margin.right = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value.right, this._unit_type);
                        this._sheet_labels_margin.bottom = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value.bottom, this._unit_type);
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(ThermalLabel.prototype, "margin", {
                    get: function () {
                        var toRet = new Printing.FrameThickness();
                        toRet.bottom = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._margin.bottom, this._unit_type);
                        toRet.right = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._margin.right, this._unit_type);
                        toRet.left = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._margin.left, this._unit_type);
                        toRet.top = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._margin.top, this._unit_type);
                        return toRet;
                    },
                    set: function (value) {
                        this._margin.top = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value.top, this._unit_type);
                        this._margin.left = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value.left, this._unit_type);
                        this._margin.right = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value.right, this._unit_type);
                        this._margin.bottom = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value.bottom, this._unit_type);
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                ThermalLabel.createFromXmlTemplate = function (xmlTemplate) {
                    var toRet = new ThermalLabel();
                    var items_list = [];
                    var exprs_list = [];
                    var pages_list = [];
                    var xml = $.parseXML(xmlTemplate); //Neodynamic.Web.Utils.XMLParser.XML2Json(xmlTemplate);
                    var thermal_label = xml.getElementsByTagName("ThermalLabel")[0];
                    /* Get ThermalLabel properties */
                    //Set UnitType FIRST!!!
                    for (var i = 0; i < thermal_label.attributes.length; i++) {
                        var attr = thermal_label.attributes[i];
                        if (attr.name == "UnitType")
                            toRet.unit_type = Printing.UnitType[attr.value];
                    }
                    //Set other properties next
                    for (var i = 0; i < thermal_label.attributes.length; i++) {
                        var attr = thermal_label.attributes[i];
                        if (attr.name == "GapLength")
                            toRet.gap_length = parseFloat(attr.value);
                        if (attr.name == "Height")
                            toRet.height = parseFloat(attr.value);
                        if (attr.name == "IsContinuous")
                            toRet.is_continuous = attr.value == "False" ? false : true;
                        if (attr.name == "LabelsHorizontalGapLength")
                            toRet.labels_horizontal_gap_length = parseFloat(attr.value);
                        if (attr.name == "LabelsPerRow")
                            toRet.labels_per_row = parseInt(attr.value);
                        if (attr.name == "MarkLength")
                            toRet.mark_length = parseFloat(attr.value);
                        if (attr.name == "OffsetLength")
                            toRet.offset_length = parseFloat(attr.value);
                        if (attr.name == "PrintSpeed")
                            toRet.print_speed = attr.value;
                        if (attr.name == "Width")
                            toRet.width = parseFloat(attr.value);
                        if (attr.name == "PrintMirror")
                            toRet.print_mirror = attr.value == "False" ? false : true;
                        if (attr.name == "CutAfterPrinting")
                            toRet.cut_after_printing = attr.value == "False" ? false : true;
                        if (attr.name == "Darkness")
                            toRet.darkness = parseFloat(attr.value);
                        if (attr.name == "SheetLabelsWidth")
                            toRet.sheet_labels_width = parseFloat(attr.value);
                        if (attr.name == "SheetLabelsHeight")
                            toRet.sheet_labels_height = parseFloat(attr.value);
                        if (attr.name == "SheetLabelsCount")
                            toRet.sheet_labels_count = parseFloat(attr.value);
                        if (attr.name == "SheetLabelsMargin") {
                            var margin = attr.value.split(',');
                            toRet.sheet_labels_margin = new Printing.FrameThickness(margin[0], margin.length == 1 ? margin[0] : margin[1], margin.length == 1 ? margin[0] : margin[2], margin.length == 1 ? margin[0] : margin[3]);
                        }
                        if (attr.name == "BatchCut")
                            toRet.batch_cut = parseInt(attr.value);
                        if (attr.name == "DesignBackgroundImage")
                            toRet.design_background_image = attr.value;
                        if (attr.name == "Margin") {
                            var margin = attr.value.split(',');
                            toRet.margin = new Printing.FrameThickness(margin[0], margin.length == 1 ? margin[0] : margin[1], margin.length == 1 ? margin[0] : margin[2], margin.length == 1 ? margin[0] : margin[3]);
                        }
                        if (attr.name == "UseDefaultMediaType")
                            toRet.use_default_media_type = attr.value == "False" ? false : true;
                    }
                    if (thermal_label.getElementsByTagName("Items")) {
                        var items = $(thermal_label.getElementsByTagName("Items")[0]).children();
                        for (var i = 0; i < items.length; i++) {
                            var xml_2_json = Neodynamic.Web.Utils.XMLParser.XML2Json(items[i]);
                            var parsed_item = Neodynamic.Web.Utils.TLParser.parseItem(xml_2_json, items[i].nodeName, toRet.unit_type);
                            items_list.push(parsed_item);
                            items_list[i].refresh();
                        }
                        toRet.items = items_list;
                    }
                    if (thermal_label.getElementsByTagName("Expressions")) {
                        var exprs = $(thermal_label.getElementsByTagName("Expressions")[0]).children();
                        for (var i = 0; i < exprs.length; i++) {
                            var xml_2_json = Neodynamic.Web.Utils.XMLParser.XML2Json(exprs[i]);
                            var parsed_expr = Neodynamic.Web.Utils.TLParser.parseExpression(xml_2_json);
                            if (parsed_expr)
                                exprs_list.push(parsed_expr);
                        }
                        toRet.expressions = exprs_list;
                    }
                    if (thermal_label.getElementsByTagName("Pages")) {
                        var pages = $(thermal_label.getElementsByTagName("Pages")[0]).children();
                        for (var i = 0; i < pages.length; i++) {
                            var xml_2_json = Neodynamic.Web.Utils.XMLParser.XML2Json(pages[i]);
                            var parsed_page = Neodynamic.Web.Utils.TLParser.parsePage(xml_2_json);
                            if (parsed_page)
                                pages_list.push(parsed_page);
                        }
                        toRet.pages = pages_list;
                    }
                    return toRet;
                };
                ;
                ThermalLabel.createFromJsonTemplate = function (jsonTemplate) {
                    var toRet = new ThermalLabel();
                    var items_list = [];
                    var exprs_list = [];
                    var pages_list = [];
                    var tlJsonObj = (typeof jsonTemplate == "string") ? JSON.parse(jsonTemplate) : jsonTemplate;
                    var tlj = Neodynamic.Web.Utils.TLParser.JsonConvertKeysToLowerCase(tlJsonObj);
                    var oldJsonFormat = (tlj["thermallabel"] != null);
                    if (oldJsonFormat) {
                        tlj = tlj["thermallabel"];
                    }
                    else {
                        if (!tlj["unittype"]) {
                            return toRet; //invalid json format
                        }
                    }
                    /* Get ThermalLabel properties */
                    //Set UnitType FIRST!!!
                    toRet.unit_type = Printing.UnitType[tlj["UnitType".toLowerCase()]];
                    //Set other properties next
                    if (tlj["GapLength".toLowerCase()])
                        toRet.gap_length = tlj["GapLength".toLowerCase()];
                    if (tlj["Height".toLowerCase()])
                        toRet.height = tlj["Height".toLowerCase()];
                    if (tlj["IsContinuous".toLowerCase()])
                        toRet.is_continuous = tlj["IsContinuous".toLowerCase()];
                    if (tlj["LabelsHorizontalGapLength".toLowerCase()])
                        toRet.labels_horizontal_gap_length = tlj["LabelsHorizontalGapLength".toLowerCase()];
                    if (tlj["LabelsPerRow".toLowerCase()])
                        toRet.labels_per_row = tlj["LabelsPerRow".toLowerCase()];
                    if (tlj["MarkLength".toLowerCase()])
                        toRet.mark_length = tlj["MarkLength".toLowerCase()];
                    if (tlj["OffsetLength".toLowerCase()])
                        toRet.offset_length = tlj["OffsetLength".toLowerCase()];
                    if (tlj["PrintSpeed".toLowerCase()])
                        toRet.print_speed = tlj["PrintSpeed".toLowerCase()];
                    if (tlj["Width".toLowerCase()])
                        toRet.width = tlj["Width".toLowerCase()];
                    if (tlj["PrintMirror".toLowerCase()])
                        toRet.print_mirror = tlj["PrintMirror".toLowerCase()];
                    if (tlj["CutAfterPrinting".toLowerCase()])
                        toRet.cut_after_printing = tlj["CutAfterPrinting".toLowerCase()];
                    if (tlj["Darkness".toLowerCase()])
                        toRet.darkness = tlj["Darkness".toLowerCase()];
                    if (tlj["SheetLabelsWidth".toLowerCase()])
                        toRet.sheet_labels_width = tlj["SheetLabelsWidth".toLowerCase()];
                    if (tlj["SheetLabelsHeight".toLowerCase()])
                        toRet.sheet_labels_height = tlj["SheetLabelsHeight".toLowerCase()];
                    if (tlj["SheetLabelsCount".toLowerCase()])
                        toRet.sheet_labels_count = tlj["SheetLabelsCount".toLowerCase()];
                    if (tlj["SheetLabelsMargin".toLowerCase()]) {
                        if (tlj["SheetLabelsMargin".toLowerCase()]["left"] != null) {
                            var co = tlj["SheetLabelsMargin".toLowerCase()];
                            toRet.sheet_labels_margin = new Printing.FrameThickness(co["left"], co["top"], co["right"], co["bottom"]);
                        }
                        else {
                            var margin = tlj["SheetLabelsMargin".toLowerCase()].split(',');
                            toRet.sheet_labels_margin = new Printing.FrameThickness(margin[0], margin.length == 1 ? margin[0] : margin[1], margin.length == 1 ? margin[0] : margin[2], margin.length == 1 ? margin[0] : margin[3]);
                        }
                    }
                    if (tlj["BatchCut".toLowerCase()])
                        toRet.batch_cut = tlj["BatchCut".toLowerCase()];
                    if (tlj["DesignBackgroundImage".toLowerCase()])
                        toRet.design_background_image = tlj["DesignBackgroundImage".toLowerCase()];
                    if (tlj["Margin".toLowerCase()]) {
                        if (tlj["Margin".toLowerCase()]["left"] != null) {
                            var co = tlj["Margin".toLowerCase()];
                            toRet.margin = new Printing.FrameThickness(co["left"], co["top"], co["right"], co["bottom"]);
                        }
                        else {
                            var margin = tlj["Margin".toLowerCase()].split(',');
                            toRet.margin = new Printing.FrameThickness(margin[0], margin.length == 1 ? margin[0] : margin[1], margin.length == 1 ? margin[0] : margin[2], margin.length == 1 ? margin[0] : margin[3]);
                        }
                    }
                    if (tlj["UseDefaultMediaType".toLowerCase()])
                        toRet.use_default_media_type = tlj["UseDefaultMediaType".toLowerCase()];
                    if (tlj["items"]) {
                        var items = tlj["items"];
                        for (var i = 0; i < items.length; i++) {
                            var parsed_item = Neodynamic.Web.Utils.TLParser.parseItem(items[i], oldJsonFormat ? items[i]["type"] : items[i]["typename"], toRet.unit_type);
                            parsed_item.label_margin_left = toRet.margin.left;
                            parsed_item.label_margin_top = toRet.margin.top;
                            items_list.push(parsed_item);
                            items_list[i].refresh();
                        }
                        toRet.items = items_list;
                    }
                    if (tlj["expressions"]) {
                        var exprs = tlj["expressions"];
                        for (var i = 0; i < exprs.length; i++) {
                            var parsed_expr = Neodynamic.Web.Utils.TLParser.parseExpression(exprs[i]);
                            if (parsed_expr)
                                exprs_list.push(parsed_expr);
                        }
                        toRet.expressions = exprs_list;
                    }
                    if (tlj["pages"]) {
                        var pages = tlj["pages"];
                        for (var i = 0; i < pages.length; i++) {
                            var parsed_page = Neodynamic.Web.Utils.TLParser.parsePage(pages[i]);
                            if (parsed_page)
                                pages_list.push(parsed_page);
                        }
                        toRet.pages = pages_list;
                    }
                    return toRet;
                };
                ;
                ThermalLabel.prototype._getProperties = function () {
                    var items = [];
                    for (var i = 0; i < this.items.length; i++) {
                        items.push(this.items[i]._getProperties());
                    }
                    var pages = [];
                    for (var i = 0; i < this.pages.length; i++) {
                        pages.push(this.pages[i]._getProperties());
                    }
                    return {
                        Width: this.width,
                        Height: this.height,
                        GapLength: this.gap_length,
                        IsContinuous: this.is_continuous,
                        LabelsHorizontalGapLength: this.labels_horizontal_gap_length,
                        LabelsPerRow: this.labels_per_row,
                        MarkLength: this.mark_length,
                        OffsetLength: this.offset_length,
                        DataMember: this.data_member,
                        DataSource: this.data_source,
                        DataSourceCultureInfo: this.data_source_culture_info,
                        PrintSpeed: this.print_speed,
                        UnitType: this.unit_type,
                        PrintMirror: this.print_mirror,
                        CutAfterPrinting: this.cut_after_printing,
                        Darkness: this.darkness,
                        SheetLabelsWidth: this.sheet_labels_width,
                        SheetLabelsHeight: this.sheet_labels_height,
                        SheetLabelsCount: this.sheet_labels_count,
                        SheetLabelsMargin_Bottom: this.sheet_labels_margin.bottom,
                        SheetLabelsMargin_Left: this.sheet_labels_margin.left,
                        SheetLabelsMargin_Right: this.sheet_labels_margin.right,
                        SheetLabelsMargin_Top: this.sheet_labels_margin.top,
                        Margin_Bottom: this.margin.bottom,
                        Margin_Left: this.margin.left,
                        Margin_Right: this.margin.right,
                        Margin_Top: this.margin.top,
                        BatchCut: this.batch_cut,
                        DesignBackgroundImage: this.design_background_image,
                        UseDefaultMediaType: this.use_default_media_type,
                        Items: items,
                        Expressions: this.expressions,
                        Pages: pages
                    };
                };
                ;
                return ThermalLabel;
            }());
            Printing.ThermalLabel = ThermalLabel;
        })(Printing = SDK.Printing || (SDK.Printing = {}));
    })(SDK = Neodynamic.SDK || (Neodynamic.SDK = {}));
})(Neodynamic || (Neodynamic = {}));
var Neodynamic;
(function (Neodynamic) {
    var Web;
    (function (Web) {
        var Editor;
        (function (Editor) {
            var EditorTool;
            (function (EditorTool) {
                EditorTool[EditorTool["Pointer"] = 0] = "Pointer";
                EditorTool[EditorTool["Rectangle"] = 1] = "Rectangle";
                EditorTool[EditorTool["Ellipse"] = 2] = "Ellipse";
                EditorTool[EditorTool["Line"] = 3] = "Line";
                EditorTool[EditorTool["Text"] = 4] = "Text";
                EditorTool[EditorTool["Barcode"] = 5] = "Barcode";
                EditorTool[EditorTool["Image"] = 6] = "Image";
                EditorTool[EditorTool["Literal"] = 7] = "Literal";
                EditorTool[EditorTool["RFIDTag"] = 8] = "RFIDTag";
                EditorTool[EditorTool["Table"] = 9] = "Table";
                EditorTool[EditorTool["Repeater"] = 10] = "Repeater";
            })(EditorTool = Editor.EditorTool || (Editor.EditorTool = {}));
            var GridType;
            (function (GridType) {
                GridType[GridType["Lines"] = 0] = "Lines";
                GridType[GridType["Dots"] = 1] = "Dots";
            })(GridType = Editor.GridType || (Editor.GridType = {}));
            ;
        })(Editor = Web.Editor || (Web.Editor = {}));
    })(Web = Neodynamic.Web || (Neodynamic.Web = {}));
})(Neodynamic || (Neodynamic = {}));
/// <reference path="../../sdk/printing/enums.ts" />
var Neodynamic;
(function (Neodynamic) {
    var Web;
    (function (Web) {
        var Utils;
        (function (Utils) {
            var UnitUtils = /** @class */ (function () {
                function UnitUtils() {
                }
                /*
                *   Convierte el valor en pixel a la unidad <unit>
                */
                UnitUtils.convertPixelToUnit = function (value, unit) {
                    var UnitType = Neodynamic.SDK.Printing.UnitType;
                    if (unit == UnitType.Cm) {
                        return this._PixelToInch(value) * 2.54;
                    }
                    else if (unit == UnitType.DotsPerInch) {
                        return value;
                    }
                    else if (unit == UnitType.Inch) {
                        return this._PixelToInch(value);
                    }
                    else if (unit == UnitType.Mils) {
                        return this._PixelToInch(value) * 1000;
                    }
                    else if (unit == UnitType.Mm) {
                        return this._PixelToInch(value) * 25.4;
                    }
                    else if (unit == UnitType.Pica) {
                        return this._PixelToInch(value) * 6;
                    }
                    else if (unit == UnitType.Point) {
                        return this._PixelToInch(value) * 72;
                    }
                    else if (unit == UnitType.Twip) {
                        return this._PixelToInch(value) * 1440;
                    }
                    else {
                        return 0;
                    }
                };
                /*
                *   Convierte el valor en la unidad <unit> a pixel
                */
                UnitUtils.convertUnitToPixel = function (value, unit) {
                    var UnitType = Neodynamic.SDK.Printing.UnitType;
                    if (unit == UnitType.Cm) {
                        return this._InchToPixel(value / 2.54);
                    }
                    else if (unit == UnitType.DotsPerInch) {
                        return value;
                    }
                    else if (unit == UnitType.Inch) {
                        return this._InchToPixel(value);
                    }
                    else if (unit == UnitType.Mils) {
                        return this._InchToPixel(value / 1000);
                    }
                    else if (unit == UnitType.Mm) {
                        return this._InchToPixel(value / 25.4);
                    }
                    else if (unit == UnitType.Pica) {
                        return this._InchToPixel(value / 6);
                    }
                    else if (unit == UnitType.Point) {
                        return this._InchToPixel(value / 72);
                    }
                    else if (unit == UnitType.Twip) {
                        return this._InchToPixel(value / 1440);
                    }
                    else {
                        return 0;
                    }
                };
                UnitUtils.convertPixelToFontUnit = function (value, unit) {
                    var UnitType = Neodynamic.SDK.Printing.FontUnit;
                    if (unit == UnitType.Inch) {
                        return this._PixelToInch(value);
                    }
                    else if (unit == UnitType.Millimeter) {
                        return this._PixelToInch(value) * 25.4;
                    }
                    else if (unit == UnitType.Point) {
                        return this._PixelToInch(value) * 72;
                    }
                    else if (unit == UnitType.Twip) {
                        return this._PixelToInch(value) * 1440;
                    }
                    else if (unit == UnitType.Pixel) {
                        return value;
                    }
                    else {
                        return 0;
                    }
                };
                UnitUtils.convertFontUnitToPixel = function (value, unit) {
                    var UnitType = Neodynamic.SDK.Printing.FontUnit;
                    if (unit == UnitType.Inch) {
                        return this._InchToPixel(value);
                    }
                    else if (unit == UnitType.Millimeter) {
                        return this._InchToPixel(value / 25.4);
                    }
                    else if (unit == UnitType.Point) {
                        return this._InchToPixel(value / 72);
                    }
                    else if (unit == UnitType.Twip) {
                        return this._InchToPixel(value / 1440);
                    }
                    else if (unit == UnitType.Pixel) {
                        return value;
                    }
                    else {
                        return 0;
                    }
                };
                UnitUtils._InchToPixel = function (value) {
                    return value * 96;
                };
                UnitUtils._PixelToInch = function (value) {
                    return value / 96;
                };
                return UnitUtils;
            }());
            Utils.UnitUtils = UnitUtils;
        })(Utils = Web.Utils || (Web.Utils = {}));
    })(Web = Neodynamic.Web || (Neodynamic.Web = {}));
})(Neodynamic || (Neodynamic = {}));
/// <reference path="../../sdk/printing/thermallabel.ts" />
/// <reference path="../utils/unitutils.ts" />
/// <reference path="editortool.ts" />
/// <reference path="../../sdk/printing/enums.ts" />
var Neodynamic;
(function (Neodynamic) {
    var Web;
    (function (Web) {
        var Editor;
        (function (Editor) {
            var ThermalLabelEditor = /** @class */ (function () {
                //#endregion
                function ThermalLabelEditor(container) {
                    //#region Private Properties
                    this._active_tool = Neodynamic.Web.Editor.EditorTool.Pointer;
                    /*  Referencia al objeto fabric del canvas  */
                    this._tlweCanvasFabric = '';
                    /*  Referencia al objeto fabric del background  */
                    this._tlweBackgroundCanvasFabric = '';
                    /*  Referencia al objeto canvas */
                    this._tlweCanvas = '';
                    /*  Referencia al objecto canvas background */
                    this._tlweBackgroundCanvas = '';
                    /*  Referencia al div contenedor maestro    */
                    this._master_container = '';
                    /*  Referencia a los objetos de fabric seleccionados    */
                    this._selected_objects = null;
                    /*  Esta dibujando una figura   */
                    /*  Esta dibujando una figura   */
                    this._is_drawing = false;
                    /*  Buffer de objetos del canvas    */
                    //TEST Se elimina el buffer de objetos del canvas y se usa directamente la referencia a ThermalLabel  
                    //private _canvas_items: any = [];
                    /*  Referencia al contenedor del editor */
                    this._container_div = '';
                    this._zoom = 1;
                    // ruler
                    this._ruler = '';
                    this._angle_snap = 5;
                    this._grid_size = 15;
                    this._show_grid = false;
                    this._snap_to_grid = false;
                    this._grid_type = Neodynamic.Web.Editor.GridType.Lines;
                    this._rfid_tag_image_file_name = '';
                    this._lockedIcon = null;
                    this._adorner_out_of_label_visible = true;
                    //private _tipCanvas: any = null;
                    //private _tipCtx: any = null;
                    this._itemToolTip = null;
                    this._itemToolTipOverCount = 0;
                    this._tlweStyle = null;
                    this._workspace_factor = 3;
                    this._workspaceOffsetX = 0;
                    this._workspaceOffsetY = 0;
                    this._undoRedo = false;
                    this._numOfFractionalDigits = 4;
                    this._clipboardBuffer = [];
                    this._objFromCut = false;
                    this._pasteCounter = 1;
                    // grouping logic
                    this._isGrouping = false;
                    this._itemsGuidsInGroup = [];
                    // Ruler based on https://github.com/MrFrankel/ruler
                    this.ruler = function (options) {
                        var _ruler = this;
                        _ruler.builder = function () {
                            var VERTICAL = 1, HORIZONTAL = 2, CUR_DELTA_X = 0, CUR_DELTA_Y = 0, CUR_SCALE = 1;
                            var options, rulerz = {}, theRulerDOM = document.createElement('div'), corners = [], defaultOptions = {
                                rulerHeight: 15,
                                fontFamily: 'arial',
                                fontSize: '8px',
                                strokeStyle: 'gray',
                                sides: ['top', 'left'],
                                cornerSides: ['TL'],
                                lineWidth: 1,
                                unit: 0,
                                zeroStartsAtX: 0,
                                zeroStartsAtY: 0
                            };
                            /*
                                Cm = 0,
                                Inch = 1,
                                Mm = 2,
                                DotsPerInch = 3,
                                Point = 4,
                                Pica = 5,
                                Mils = 6
                            */
                            var rotateRuler = function (curRuler, angle) {
                                var rotation = 'rotate(' + angle + 'deg)';
                                var origin = _ruler.utils.pixelize(Math.abs(parseInt(curRuler.canvas.style.left))) + ' 100%';
                                curRuler.canvas.style.webkitTransform = rotation;
                                curRuler.canvas.style.MozTransform = rotation;
                                curRuler.canvas.style.OTransform = rotation;
                                curRuler.canvas.style.msTransform = rotation;
                                curRuler.canvas.style.transform = rotation;
                                curRuler.canvas.style.webkitTransformOrigin = origin;
                                curRuler.canvas.style.MozTransformOrigin = origin;
                                curRuler.canvas.style.OTransformOrigin = origin;
                                curRuler.canvas.style.msTransformOrigin = origin;
                                curRuler.canvas.style.transformOrigin = origin;
                            };
                            var positionRuler = function (curRuler, alignment) {
                                curRuler.canvas.style.left = 0; //_ruler.utils.pixelize(-((curRuler.canvas.width / 2) - curRuler.canvas.height));
                                switch (alignment) {
                                    case 'top':
                                        curRuler.orgPos = parseInt(curRuler.canvas.style.left);
                                        break;
                                    case 'left':
                                        curRuler.canvas.style.top = 0; //_ruler.utils.pixelize(-curRuler.canvas.height - 1);
                                        curRuler.orgPos = parseInt(curRuler.canvas.style.top);
                                        rotateRuler(curRuler, 90);
                                        break;
                                }
                            };
                            var constructRuler = function (container, alignment) {
                                var canvas, dimension = alignment === 'left' || alignment === 'right' ? VERTICAL : HORIZONTAL, element = document.createElement('canvas');
                                $(element).css("position", "absolute").css("display", "block").css("background-color", _ruler.utils.getStyleValue("--rulers-background-color")).css("border", "1px solid rgba(206, 219, 236, .5)").css("filter", "blur(0)").css("-webkit-filter", "blur(0)").css("pointer-events", "all").css("z-index", "1000").css(dimension === VERTICAL ? "border-left" : "border-top", "none");
                                canvas = container.appendChild(element);
                                rulerz[alignment] = _ruler.rulerConstructor(canvas, options, dimension);
                                rulerz[alignment].drawRuler(1000, options.rulerHeight);
                                positionRuler(rulerz[alignment], alignment);
                            };
                            var constructCorner = (function () {
                                function cornerDraw(container, side) {
                                    var corner = document.createElement('div');
                                    $(corner).css("position", "absolute").css("background-color", _ruler.utils.getStyleValue("--rulers-corner-background-color")).css("pointer-events", "all").css("z-index", "1010");
                                    if (side.toUpperCase() == "TL")
                                        $(corner).css("top", "0").css("left", "0").css("border-bottom", "1px solid rgba(206, 219, 236, .5)").css("border-right", "1px solid rgba(206, 219, 236, .5)");
                                    else if (side.toUpperCase() == "TR")
                                        $(corner).css("top", "1px").css("right", "1px").css("border-bottom", "1px solid rgba(206, 219, 236, .5)").css("border-left", "1px solid rgba(206, 219, 236, .5)");
                                    else if (side.toUpperCase() == "BL")
                                        $(corner).css("bottom", "1px").css("left", "1px").css("border-top", "1px solid rgba(206, 219, 236, .5)").css("border-right", "1px solid rgba(206, 219, 236, .5)");
                                    else if (side.toUpperCase() == "BR")
                                        $(corner).css("bottom", "1px").css("right", "1px").css("border-top", "1px solid rgba(206, 219, 236, .5)").css("border-left", "1px solid rgba(206, 219, 236, .5)");
                                    //corner.title = 'Clear Guide lines';
                                    corner.style.width = _ruler.utils.pixelize(options.rulerHeight + 1);
                                    corner.style.height = _ruler.utils.pixelize(options.rulerHeight);
                                    return container.appendChild(corner);
                                }
                                return function (container, cornerSides) {
                                    cornerSides.forEach(function (side) {
                                        var corner = cornerDraw(container, side);
                                        corner.destroy = function () {
                                            corner.parentNode.removeChild(corner);
                                        };
                                        corners.push(corner);
                                    });
                                };
                            })();
                            var constructRulers = function (curOptions) {
                                $(theRulerDOM).css("position", "absolute").css("width", "100%").css("height", "100%").css("overflow", "hidden").css("pointer-events", "none");
                                options = _ruler.utils.extend(defaultOptions, curOptions);
                                theRulerDOM = options.container.appendChild(theRulerDOM);
                                options.sides.forEach(function (side) {
                                    constructRuler(theRulerDOM, side);
                                });
                                constructCorner(theRulerDOM, options.cornerSides);
                            };
                            var forEachRuler = function (cb) {
                                var index = 0;
                                for (var rul in rulerz) {
                                    if (rulerz.hasOwnProperty(rul)) {
                                        cb(rulerz[rul], index++);
                                    }
                                }
                            };
                            var setPos = function (values) {
                                options.zeroStartsAtX = values.x;
                                options.zeroStartsAtY = values.y;
                                var orgX = 0, orgY, deltaX = 0, deltaY = 0;
                                forEachRuler(function (curRul) {
                                    if (curRul.dimension === VERTICAL) {
                                        orgY = curRul.canvas.style.top;
                                        //curRul.canvas.style.top = _ruler.utils.pixelize(curRul.orgPos + (parseInt(values.y)));
                                        deltaY = parseInt(orgY) - parseInt(curRul.canvas.style.top);
                                    }
                                    else {
                                        orgX = curRul.canvas.style.left;
                                        //curRul.canvas.style.left = _ruler.utils.pixelize(curRul.orgPos + (parseInt(values.x)));
                                        deltaX = parseInt(orgX.toString()) - parseInt(curRul.canvas.style.left);
                                    }
                                });
                                CUR_DELTA_X = parseInt(values.x);
                                CUR_DELTA_Y = parseInt(values.y);
                            };
                            var setScale = function (newScale) {
                                var curPos, orgDelta, curScaleFac;
                                forEachRuler(function (rul) {
                                    rul.context.clearRect(0, 0, rul.canvas.width, rul.canvas.height);
                                    rul.context.beginPath();
                                    rul.setScale(newScale);
                                    rul.context.stroke();
                                    CUR_SCALE = newScale;
                                });
                            };
                            var setHighlightZoneX = function (size) {
                                forEachRuler(function (rul) {
                                    if (window.getComputedStyle(rul.canvas).getPropertyValue("border-top").indexOf("none") > -1) {
                                        rul.context.clearRect(0, 0, rul.canvas.width, rul.canvas.height);
                                        rul.context.beginPath();
                                        rul.setHighlightZoneX(size);
                                        rul.context.stroke();
                                    }
                                });
                            };
                            var setHighlightZoneY = function (size) {
                                forEachRuler(function (rul) {
                                    if (window.getComputedStyle(rul.canvas).getPropertyValue("border-left").indexOf("none") > -1) {
                                        rul.context.clearRect(0, 0, rul.canvas.width, rul.canvas.height);
                                        rul.context.beginPath();
                                        rul.setHighlightZoneY(size);
                                        rul.context.stroke();
                                    }
                                });
                            };
                            var toggleRulerVisibility = function (val) {
                                var state = val ? 'block' : 'none';
                                theRulerDOM.style.display = state;
                            };
                            var destroy = function () {
                                forEachRuler(function (ruler) {
                                    ruler.destroy();
                                });
                                corners.forEach(function (corner) {
                                    corner.destroy();
                                });
                                theRulerDOM.parentNode.removeChild(theRulerDOM);
                            };
                            return {
                                VERTICAL: VERTICAL,
                                HORIZONTAL: HORIZONTAL,
                                setPos: setPos,
                                setScale: setScale,
                                constructRulers: constructRulers,
                                toggleRulerVisibility: toggleRulerVisibility,
                                destroy: destroy,
                                setHighlightZoneX: setHighlightZoneX,
                                setHighlightZoneY: setHighlightZoneY
                            };
                        };
                        _ruler.rulerConstructor = function (_canvas, options, rulDimension) {
                            var canvas = _canvas, context = canvas.getContext('2d'), rulThickness = 0, rulLength = 0, rulScale = 1, dimension = rulDimension || 2, orgPos = 0, hightlightZoneX = { pos: 0, size: 0 }, hightlightZoneY = { pos: 0, size: 0 };
                            var getLength = function () {
                                return rulLength;
                            };
                            var getThickness = function () {
                                return rulThickness;
                            };
                            var getScale = function () {
                                return rulScale;
                            };
                            var setScale = function (newScale) {
                                rulScale = parseFloat(newScale);
                                drawPoints();
                                return rulScale;
                            };
                            var setHighlightZoneX = function (size) {
                                hightlightZoneX = size;
                                drawPoints();
                            };
                            var setHighlightZoneY = function (size) {
                                hightlightZoneY = size;
                                drawPoints();
                            };
                            var drawRuler = function (_rulerLength, _rulerThickness, _rulerScale) {
                                rulLength = canvas.width = _rulerLength * 4;
                                rulThickness = canvas.height = _rulerThickness;
                                rulScale = _rulerScale || rulScale;
                                context.strokeStyle = options.strokeStyle;
                                context.font = options.fontSize + ' ' + options.fontFamily;
                                context.lineWidth = options.lineWidth;
                                context.beginPath();
                                drawPoints();
                                context.stroke();
                            };
                            var drawPoints = function () {
                                /* units
                                    Cm = 0,
                                    Inch = 1,
                                    Mm = 2,
                                    DotsPerInch = 3,
                                    Point = 4,
                                    Pica = 5,
                                    Mils = 6
                                */
                                var pointLength = 0, label = '', delta = 0, draw = false, lineLengthMax = 0, lineLengthMed = rulThickness * 1 / 4, lineLengthMin = rulThickness / 2;
                                var VERTICAL = 1, HORIZONTAL = 2;
                                var unit = options.unit;
                                var rulerOrientation = (dimension || 2) === VERTICAL ? VERTICAL : HORIZONTAL;
                                var zeroStartsAt = rulerOrientation === VERTICAL ? options.zeroStartsAtY : options.zeroStartsAtX;
                                zeroStartsAt += rulerOrientation === VERTICAL ? -1 : 15;
                                var x = zeroStartsAt;
                                var drawTags = true;
                                var rangeLength = (rulLength - zeroStartsAt) / rulScale;
                                var rangeLengthInUnit = Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit((rangeLength + zeroStartsAt), unit) * rulScale;
                                var drawTagAtMod = 4;
                                var rangeStepInUnit = 0.25; //for INCH and CM use 4/10 for steps
                                if (unit == Neodynamic.SDK.Printing.UnitType.Mm)
                                    rangeStepInUnit = 2.5; //for MM use 2.5 for steps
                                else if (unit == Neodynamic.SDK.Printing.UnitType.Mils)
                                    rangeStepInUnit = 250; //for Mils use 250 for steps
                                else if (unit == Neodynamic.SDK.Printing.UnitType.DotsPerInch)
                                    rangeStepInUnit = 24; //for dots use 24 for steps
                                else if (unit == Neodynamic.SDK.Printing.UnitType.Point)
                                    rangeStepInUnit = 18; //for points use 18 for steps
                                else if (unit == Neodynamic.SDK.Printing.UnitType.Pica)
                                    rangeStepInUnit = 1.5; //for pica use 1.5 for steps
                                else if (unit == Neodynamic.SDK.Printing.UnitType.Twip)
                                    rangeStepInUnit = 360; //for Twips use 360 for steps
                                //if the zoom is too small then increase the steps
                                var m = 2;
                                while (Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(rangeStepInUnit, unit) * rulScale < 20) {
                                    rangeStepInUnit *= m;
                                    m++;
                                }
                                var rangeStepInUnitFactor = rangeStepInUnit;
                                rangeStepInUnit *= rulScale;
                                if (hightlightZoneX.size > 0 || hightlightZoneY.size > 0) { // highlight the current selection if any
                                    var offsetX = zeroStartsAt;
                                    var len = 0;
                                    var pos = 0;
                                    if (hightlightZoneX.size > 0) {
                                        len = hightlightZoneX.size;
                                        pos = hightlightZoneX.pos;
                                    }
                                    if (hightlightZoneY.size > 0) {
                                        len = hightlightZoneY.size;
                                        pos = hightlightZoneY.pos;
                                    }
                                    context.fillStyle = _ruler.utils.getStyleValue("--rulers-selection-background-color");
                                    context.fillRect(offsetX + pos, 0, len, 15);
                                }
                                context.fillStyle = _ruler.utils.getStyleValue("--rulers-text-color");
                                // draw zero point
                                pointLength = lineLengthMax;
                                context.moveTo(x, rulThickness + 0.5);
                                context.lineTo(x, pointLength + 0.5);
                                context.fillText("0", x + 1.0, (rulThickness / 2) - 1);
                                var count = 1;
                                for (var i = rangeStepInUnit; i <= rangeLengthInUnit; i += rangeStepInUnit) {
                                    //Draw positive ruler value...
                                    //reset new x pos
                                    x = zeroStartsAt + Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(i, unit);
                                    //create ruler line
                                    pointLength = (count % drawTagAtMod == 0 ? lineLengthMax : lineLengthMin);
                                    context.moveTo(x, rulThickness + 0.5);
                                    context.lineTo(x, pointLength + 0.5);
                                    //create ruler tag? only for markers
                                    //draw tags if can be visible based on zoom level
                                    if (count % drawTagAtMod == 0 && drawTags) {
                                        context.fillText((count * rangeStepInUnitFactor).toString(), x + 1.0, (rulThickness / 2) - 1);
                                    }
                                    //--------------------------------
                                    //Draw negative ruler value...
                                    //reset new x pos
                                    x = zeroStartsAt - Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(i, unit);
                                    if (x >= 0) {
                                        //create ruler line
                                        pointLength = (count % drawTagAtMod == 0 ? lineLengthMax : lineLengthMin);
                                        context.moveTo(x, rulThickness + 0.5);
                                        context.lineTo(x, pointLength + 0.5);
                                        //create ruler tag? only for markers
                                        //draw tags if can be visible based on zoom level
                                        if (count % drawTagAtMod == 0 && drawTags) {
                                            context.fillText((-count * rangeStepInUnitFactor).toString(), x + 1.0, (rulThickness / 2) - 1);
                                        }
                                    }
                                    //--------------------------------
                                    count++;
                                }
                                /*
            
                                var deltaLabelStep = 50;
                                var deltaMedStep = 25;
                                var deltaMinStep = 5;
                                var unitToPx = 50;
                                if (unit == 0 || unit == 2) { // cm , mm
                                    unitToPx = 38.0;
                                } else if (unit == 1) { // inch
                                    unitToPx = 96.0;
                                } else if (unit == 4) { // point
                                    unitToPx = 72.0;
                                } else if (unit == 5) { // pica
                                    unitToPx = 96.0;
                                } else if (unit == 6) { // mils
                                    unitToPx = 96.0;
                                }
            
                                var deltaMinStepF = unitToPx / 4.0 * rulScale;
            
                                deltaMinStep = Math.round(deltaMinStepF);
                                //deltaMinStep = deltaMinStep - deltaMinStep % 2;
                                deltaMedStep = deltaMinStep * 2;
                                deltaLabelStep = deltaMinStep * 4;
                                                    
                                if (hightlightZoneX.size > 0 || hightlightZoneY.size > 0) { // highlight the current selection if any
            
                                    var offsetX = 0;
                                    for (var pos = 0; pos <= rulLength; pos += 1) {
                                        delta = ((rulLength / 2) - pos);
                                        if (delta == 0) {
                                            offsetX = pos;
                                            break;
                                        }
                                    }
            
                                    var len = 0;
                                    var pos = 0;
                                    if (hightlightZoneX.size > 0) {
                                        len = hightlightZoneX.size;
                                        pos = hightlightZoneX.pos;
                                    }
                                    if (hightlightZoneY.size > 0) {
                                        len = hightlightZoneY.size;
                                        pos = hightlightZoneY.pos;
                                    }
            
                                    context.fillStyle = _ruler.utils.getStyleValue("--rulers-selection-background-color");
                                    context.fillRect(offsetX + pos, 0, len, 15);
                                }
            
                                context.fillStyle = _ruler.utils.getStyleValue("--rulers-text-color");
            
                                for (var pos = 0; pos <= rulLength; pos += 1) {
                                    delta = ((rulLength / 2) - pos);
                                    draw = false;
                                    label = '';
            
                                    if (delta % deltaLabelStep === 0) {
                                        pointLength = lineLengthMax;
                                        if (unit == 2) // mm
                                            label = Math.round((delta / deltaLabelStep) * -10).toString();
                                        else if (unit == 3 || unit == 4) // dpi , point
                                            label = Math.round(unitToPx * (delta / deltaLabelStep) * -1).toString();
                                        else if (unit == 5) // pica
                                            label = Math.round(6 * (delta / deltaLabelStep) * -1).toString();
                                        else if (unit == 6) // mils
                                            label = Math.round(1000 * (delta / deltaLabelStep) * -1).toString();
                                        else
                                            label = Math.round((delta / deltaLabelStep) * -1).toString();
            
                                        draw = true;
                                    }
                                    else if (delta % deltaMedStep === 0) {
                                        pointLength = lineLengthMed;
                                        draw = true;
                                    }
                                    else if (delta % deltaMinStep === 0) {
                                        pointLength = lineLengthMin;
                                        draw = true;
                                    }
                                    if (draw) {
            
                                        //var p = (pos / deltaMinStep) * deltaMinStepF;
            
                                        context.moveTo(pos + 0.5, rulThickness + 0.5);
                                        context.lineTo(pos + 0.5, pointLength + 0.5);
                                        if (label.length > 0)
                                            context.fillText(label, pos + 1.5, (rulThickness / 2) - 1);
                                    }
                                }
            
                                */
                            };
                            return {
                                getLength: getLength,
                                getThickness: getThickness,
                                getScale: getScale,
                                setScale: setScale,
                                dimension: dimension,
                                orgPos: orgPos,
                                canvas: canvas,
                                context: context,
                                drawRuler: drawRuler,
                                drawPoints: drawPoints,
                                setHighlightZoneX: setHighlightZoneX,
                                setHighlightZoneY: setHighlightZoneY
                            };
                        };
                        _ruler.utils = {
                            extend: function extend() {
                                for (var i = 1; i < arguments.length; i++)
                                    for (var key in arguments[i])
                                        if (arguments[i].hasOwnProperty(key))
                                            arguments[0][key] = arguments[i][key];
                                return arguments[0];
                            },
                            pixelize: function (val) {
                                return val + 'px';
                            },
                            prependChild: function (container, element) {
                                return container.insertBefore(element, container.firstChild);
                            },
                            addClasss: function (element, classNames) {
                                if (!(classNames instanceof Array)) {
                                    classNames = [classNames];
                                }
                                classNames.forEach(function (name) {
                                    element.className += ' ' + name;
                                });
                                return element;
                            },
                            removeClasss: function (element, classNames) {
                                var curCalsss = element.className;
                                if (!(classNames instanceof Array)) {
                                    classNames = [classNames];
                                }
                                classNames.forEach(function (name) {
                                    curCalsss = curCalsss.replace(name, '');
                                });
                                element.className = curCalsss;
                                return element;
                            },
                            getStyleValue: function (styleName) {
                                return getComputedStyle($("#thermalLabelWebEditor")[0], null).getPropertyValue(styleName);
                            }
                        };
                        this.api = this.builder();
                        this.api.constructRulers(options);
                    };
                    this._container_div = container;
                    this._undoManager = new Editor.UndoManager();
                    // support for high dpi images
                    fabric.Image.prototype._render = function (ctx) {
                        var _dpi = 96;
                        if (this.dpi)
                            _dpi = this.dpi;
                        try {
                            if (_dpi == -1 || (this.thermal_label_object instanceof Neodynamic.SDK.Printing.ImageItem && this.thermal_label_object._is_missing_image)) // fit to current fabric.Image size
                                ctx.drawImage(this._element, 0, 0, this._element.width, this._element.height, -this.width / 2, -this.height / 2, this.width, this.height);
                            else
                                ctx.drawImage(this._element, 0, 0, this._element.width, this._element.height, -this.width / 2, -this.height / 2, this._element.width * 96 / _dpi, this._element.height * 96 / _dpi);
                        }
                        catch (_a) {
                        }
                    };
                    // create div for styling/css
                    this._tlweStyle = document.createElement("div");
                    this._tlweStyle.setAttribute("id", "thermalLabelWebEditor");
                    $(container).append(this._tlweStyle);
                    /* Crear clase para dibujar rectangulos redondeados en fabric */
                    this._createRoundedRectClass();
                    /* Crear clase para dibujar barcodes en fabric */
                    this._createBarcodeClass();
                }
                Object.defineProperty(ThermalLabelEditor.prototype, "_grid_zoomed_size", {
                    get: function () {
                        return this._grid_size * this._zoom;
                    },
                    enumerable: true,
                    configurable: true
                });
                //#endregion
                ThermalLabelEditor.prototype._b64Encode = function (s) {
                    return btoa(encodeURIComponent(s).replace(/%([0-9A-F]{2})/g, function (match, p1) {
                        return String.fromCharCode(parseInt('0x' + p1));
                    }));
                };
                Object.defineProperty(ThermalLabelEditor.prototype, "num_of_fractional_digits", {
                    //#region Public Properties      
                    get: function () { return this._numOfFractionalDigits; },
                    set: function (value) { this._numOfFractionalDigits = value; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ThermalLabelEditor.prototype, "rfid_tag_image_file_name", {
                    get: function () {
                        return this._rfid_tag_image_file_name;
                    },
                    set: function (value) {
                        this._rfid_tag_image_file_name = value;
                        if (this._tlweCanvasFabric) {
                            this._tlweCanvasFabric.forEachObject(function (x) {
                                if (x.thermal_label_object instanceof Neodynamic.SDK.Printing.RFIDTagItem) {
                                    x.thermal_label_object._image.src = value;
                                }
                            });
                            this._tlweCanvasFabric.renderAll();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ThermalLabelEditor.prototype, "active_tool", {
                    get: function () { return this._active_tool; },
                    set: function (value) {
                        this._active_tool = value;
                        if (value == Neodynamic.Web.Editor.EditorTool.Pointer)
                            this._tlweCanvasFabric.forEachObject(function (o) {
                                o.selectable = true;
                            });
                        this._tlweCanvasFabric.forEachObject(function (o) {
                            o.selectable = false;
                        });
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ThermalLabelEditor.prototype, "active_tool_item", {
                    get: function () { return this._active_tool_item; },
                    set: function (value) { this._active_tool_item = value; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ThermalLabelEditor.prototype, "angle_snap", {
                    get: function () { return this._angle_snap; },
                    set: function (value) { this._angle_snap = value; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ThermalLabelEditor.prototype, "grid_size", {
                    get: function () {
                        return Neodynamic.Web.Utils.UnitUtils.convertPixelToUnit(this._grid_size, this._tl.unit_type);
                    },
                    set: function (value) {
                        this._grid_size = Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(value, this._tl.unit_type);
                        if (value && this.show_grid)
                            this._buildGrids(this._grid_zoomed_size, this.getStyleValue('--grid-color'));
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ThermalLabelEditor.prototype, "show_grid", {
                    get: function () { return this._show_grid; },
                    set: function (value) {
                        this._show_grid = value;
                        if (value)
                            this._buildGrids(this._grid_zoomed_size, this.getStyleValue('--grid-color'));
                        else
                            this._clearGrids();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ThermalLabelEditor.prototype, "snap_to_grid", {
                    get: function () { return this._snap_to_grid; },
                    set: function (value) { this._snap_to_grid = value; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ThermalLabelEditor.prototype, "grid_type", {
                    get: function () { return this._grid_type; },
                    set: function (value) {
                        this._grid_type = value;
                        if (value)
                            this._buildGrids(this._grid_zoomed_size, this.getStyleValue('--grid-color'));
                        else
                            this._clearGrids();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ThermalLabelEditor.prototype, "adorner_out_of_label_visible", {
                    get: function () { return this._adorner_out_of_label_visible; },
                    set: function (value) {
                        this._adorner_out_of_label_visible = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ThermalLabelEditor.prototype, "undoRedo", {
                    get: function () { return this._undoRedo; },
                    set: function (value) { this._undoRedo = value; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ThermalLabelEditor.prototype, "zoom", {
                    get: function () {
                        return this._zoom * 100;
                    },
                    set: function (value) {
                        this.hideItemTooltip();
                        value = Math.round(value);
                        if (value < 10 || value > 1000)
                            return;
                        value /= 100;
                        var prevCanvasScale = this._zoom;
                        this._tlweCanvasFabric.setWidth(this._tlweCanvasFabric.width / prevCanvasScale * value);
                        this._tlweCanvasFabric.setHeight(this._tlweCanvasFabric.height / prevCanvasScale * value);
                        this._tlweBackgroundCanvasFabric.setWidth(this._tlweCanvasFabric.width);
                        this._tlweBackgroundCanvasFabric.setHeight(this._tlweCanvasFabric.height);
                        var renderAll = false;
                        this._tlweCanvasFabric.forEachObject(function (obj) {
                            if (obj.scaleX != value) {
                                obj.scaleX = obj.scaleY = value;
                                obj.left = (obj.left / prevCanvasScale) * value;
                                obj.top = (obj.top / prevCanvasScale) * value;
                                obj.setCoords();
                                if (obj instanceof fabric.Image) {
                                    //obj.thermal_label_object._updateFromCanvas();
                                    if (obj.thermal_label_object.refresh)
                                        obj.thermal_label_object.refresh();
                                }
                            }
                        });
                        if (renderAll) {
                            this._tlweCanvasFabric.calcOffset();
                            this._tlweCanvasFabric.renderAll();
                        }
                        this._zoom = value;
                        this._setCanvasBackground();
                        if (this.show_grid)
                            this._buildGrids(this._grid_zoomed_size, this.getStyleValue('--grid-color'));
                        this._centerCanvas();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                ThermalLabelEditor.prototype._updateSelectionRuler = function () {
                    var selX = { pos: 0, size: 0 };
                    var selY = { pos: 0, size: 0 };
                    if (this._selected_objects && this._selected_objects.target) {
                        var UnitUtils = Neodynamic.Web.Utils.UnitUtils;
                        var r = this._selected_objects.target.getBoundingRect();
                        selX.pos = (this._tl.margin ? UnitUtils.convertUnitToPixel(this._tl.margin.left * this._zoom, this._tl.unit_type) : 0) + r.left;
                        selX.size = r.width;
                        selY.pos = (this._tl.margin ? UnitUtils.convertUnitToPixel(this._tl.margin.top * this._zoom, this._tl.unit_type) : 0) + r.top;
                        selY.size = r.height;
                    }
                    this._ruler.api.setHighlightZoneX(selX);
                    this._ruler.api.setHighlightZoneY(selY);
                };
                Object.defineProperty(ThermalLabelEditor.prototype, "current_selection", {
                    get: function () {
                        //Multiseleccion desactivada por problemas de compatibilidad al dibujar los controles
                        if (this._selected_objects) {
                            /*  Seleccion multiple (objects no es nulo)   */
                            //var to_ret = [];                
                            //if (this._selected_objects.target.objects) {                                                   
                            //    for (var obj in this._selected_objects.target.objects) {
                            //        //to_ret.push(this._canvas_items[this._selected_objects.target.objects[obj].guid]);
                            //        to_ret.push(this._selected_objects.target.objects[obj].thermal_label_object);
                            //    }
                            //    return to_ret;
                            //}
                            ///*  Es una seleccion simple */
                            //else {
                            // to_ret = this._canvas_items[this._selected_objects.target.guid];
                            //to_ret = this._selected_objects.target.thermal_label_object;
                            //}
                            return this._selected_objects.target.thermal_label_object; // to_ret;
                        }
                        return null;
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(ThermalLabelEditor.prototype, "get_thermal_label", {
                    get: function () {
                        return this._tl;
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                /**
                 * Draws a rounded rectangle using the current state of the canvas.
                 * If you omit the last three params, it will draw a rectangle
                 * outline with a 5 pixel border radius
                 * @param {CanvasRenderingContext2D} ctx
                 * @param {Number} x The top left x coordinate
                 * @param {Number} y The top left y coordinate
                 * @param {Number} width The width of the rectangle
                 * @param {Number} height The height of the rectangle
                 * @param {Number} [radius = 5] The corner radius; It can also be an object
                 *                 to specify different radii for corners
                 * @param {Number} [radius.tl = 0] Top left
                 * @param {Number} [radius.tr = 0] Top right
                 * @param {Number} [radius.br = 0] Bottom right
                 * @param {Number} [radius.bl = 0] Bottom left
                 * @param {Boolean} [fill = false] Whether to fill the rectangle.
                 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
                 */
                ThermalLabelEditor.prototype._drawRoundedRect = function (ctx, x, y, width, height, radius, fill, stroke, strokeDash) {
                    if (typeof stroke === 'undefined') {
                        stroke = true;
                    }
                    if (typeof radius === 'undefined') {
                        radius = 0;
                    }
                    if (typeof radius === 'number') {
                        radius = { tl: radius, tr: radius, br: radius, bl: radius };
                    }
                    else {
                        var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
                        for (var side in defaultRadius) {
                            radius[side] = radius[side] || defaultRadius[side];
                        }
                    }
                    ctx.beginPath();
                    ctx.moveTo(x + radius.tl, y);
                    ctx.lineTo(x + width - radius.tr, y);
                    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
                    ctx.lineTo(x + width, y + height - radius.br);
                    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
                    ctx.lineTo(x + radius.bl, y + height);
                    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
                    ctx.lineTo(x, y + radius.tl);
                    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
                    ctx.closePath();
                    if (fill) {
                        ctx.fill();
                    }
                    if (stroke) {
                        if (strokeDash && strokeDash.lineCap)
                            ctx.lineCap = strokeDash.lineCap;
                        if (strokeDash && strokeDash.lineDash)
                            ctx.setLineDash(strokeDash.lineDash);
                        ctx.stroke();
                    }
                };
                ThermalLabelEditor.prototype._createRoundedRectClass = function () {
                    var self = this;
                    fabric.RoundedRect = fabric.util.createClass(fabric.Rect, {
                        rtl: 0,
                        rtr: 0,
                        rbl: 0,
                        rbr: 0,
                        lineCap: 'butt',
                        lineDash: [],
                        initialize: function (options) {
                            options = options || {};
                            this.callSuper('initialize', options);
                        },
                        _render: function (ctx, noTransform) {
                            var min = Math.min(this.height, this.width) / 2;
                            var tl = this.rtl ? Math.min(this.rtl, min) : 0;
                            var tr = this.rtr ? Math.min(this.rtr, min) : 0;
                            var bl = this.rbl ? Math.min(this.rbl, min) : 0;
                            var br = this.rbr ? Math.min(this.rbr, min) : 0;
                            self._drawRoundedRect(ctx, noTransform ? this.left : -this.width / 2, noTransform ? this.top : -this.height / 2, this.width, this.height, { tl: tl, tr: tr, br: br, bl: bl }, true, true, { lineCap: this.lineCap, lineDash: this.lineDash });
                            //// optimize 1x1 case (used in spray brush)
                            //if (this.width === 1 && this.height === 1) {
                            //    ctx.fillRect(0, 0, 1, 1);
                            //    return;
                            //}
                            //var rtl = this.rtl ? Math.min(this.rtl, this.width / 2) : 0,
                            //    rtr = this.rtr ? Math.min(this.rtr, this.width / 2) : 0,
                            //    rbl = this.rbl ? Math.min(this.rbl, this.height / 2) : 0,
                            //    rbr = this.rbr ? Math.min(this.rbr, this.height / 2) : 0,
                            //    w = this.width,
                            //    h = this.height,
                            //    x = noTransform ? this.left : -this.width / 2,
                            //    y = noTransform ? this.top : -this.height / 2,
                            //    isRounded = rtl !== 0 || rtr !== 0 || rbr !== 0 || rbr !== 0,
                            //    k = 1 - 0.5522847498 /* "magic number" for bezier approximations of arcs (http://itc.ktu.lt/itc354/Riskus354.pdf) */;
                            //ctx.beginPath();
                            ////1. Move to top left (plus top left rounded corner)
                            //ctx.moveTo(x + rtl, y);
                            ////2. Draw line to top right (minus top right rounded corner)
                            //ctx.lineTo(x + w - rtr, y);
                            ////3. Draw top right curve
                            //isRounded && ctx.bezierCurveTo(x + w - k * rtr, y, x + w, y + k * rtr, x + w, y + rtr);
                            ////4. Draw line to bottom right 
                            //ctx.lineTo(x + w, y + h - rbr);
                            ////5. Draw bottom right curve
                            //isRounded && ctx.bezierCurveTo(x + w, y + h - k * rbr, x + w - k * rbr, y + h, x + w - rbr, y + h);
                            ////6. Draw line to bottom left        
                            //ctx.lineTo(x + rbl, y + h);
                            ////7. Draw bottom left curve
                            //isRounded && ctx.bezierCurveTo(x + k * rbl, y + h, x, y + h - k * rbl, x, y + h - rbl);
                            ////8. Draw line to top left
                            //ctx.lineTo(x, y + rtl);
                            ////9. Draw top left curve
                            //isRounded && ctx.bezierCurveTo(x, y + k * rtl, x + k * rtl, y, x + rtl, y);
                            //ctx.closePath();
                            //this._renderFill(ctx);
                            //this._renderStroke(ctx);
                        }
                    });
                };
                ThermalLabelEditor.prototype._createBarcodeClass = function () {
                    fabric.Barcode = fabric.util.createClass(fabric.Image, {
                        type: 'barcode',
                        initialize: function (text, options) {
                            this.callSuper('initialize', text, options);
                            this.set({
                                width: 20,
                                height: 20
                            });
                        },
                    });
                    //fabric.Barcode = fabric.util.createClass(fabric.Image, fabric.Observable, {
                    //    type: 'barcode',
                    //    initialize: function (text, options) {
                    //        this.callSuper('initialize', text, options);
                    //        this.set({
                    //            width: 20,
                    //            height: 20
                    //        });
                    //    },
                    //});
                };
                ThermalLabelEditor.prototype._drawFabricControls = function () {
                    var self = this;
                    var handlerFillStyle = this.getStyleValue('--adorner-handler-background-color');
                    var frameBorderColor = this.getStyleValue('--adorner-frame-border-color');
                    fabric.Object.prototype.drawControls = function (ctx) {
                        if (!this.hasControls) {
                            return this;
                        }
                        var os = (function () {
                            var ua = navigator.userAgent.toLowerCase();
                            return {
                                isWindows: /(windows|win32|win64)/.test(ua),
                                isLinux: /(linux)/.test(ua),
                                isIntelMac: /(intel mac)/.test(ua),
                                isAndroid: /(android)/.test(ua)
                            };
                        }());
                        if (os.isAndroid)
                            this.cornerSize = 16;
                        else
                            this.cornerSize = 8;
                        var isLineItem = (this.thermal_label_object && this.thermal_label_object instanceof Neodynamic.SDK.Printing.LineShapeItem);
                        var isResizable = (this.thermal_label_object && this.thermal_label_object.resizable);
                        var isLocked = (this.thermal_label_object && this.thermal_label_object.locked);
                        //var locked_image = new Image();
                        //locked_image.src = "data:image/gif;base64,R0lGODlhDAAMAJEAAP8A//////9/JwAAACH5BAEHAAAALAAAAAAMAAwAAAIghINpi+KCFgiuQUZTDpO+n3wi5FUlCZ6WmY6ta2oyUgAAOw==";
                        //var data_field_image = new Image();
                        //data_field_image.src = "data:image/gif;base64,R0lGODlhDAAMAJEAACGk5P8A/////wAAACH5BAEHAAEALAAAAAAMAAwAAAIhTISJdgIP14EUCONctPgp31XgJHKT5pnap5YqGl2YkhgFADs=";
                        //var expression_image = new Image();
                        //expression_image.src = "data:image/gif;base64,R0lGODlhDAAMAJEAAAAAAP8A/////wAAACH5BAEHAAEALAAAAAAMAAwAAAIhjIVpi+CAmHgvNndhnlRX/lXQ6GEm1qSjBX4SFS1BohgFADs=";
                        var wh = this._calculateCurrentDimensions(true), width = wh.x, height = wh.y, left = -(width / 2), top = -(height / 2), scaleOffset = this.cornerSize / 2;
                        ctx.save();
                        ctx.lineWidth = 1;
                        //ctx.globalAlpha = this.isMoving ? 0 : 1;
                        //ctx.strokeStyle = ctx.fillStyle = this.cornerColor;
                        ctx.strokeStyle = 'rgba(0,0,0,1)';
                        if (isLocked)
                            ctx.fillStyle = frameBorderColor;
                        else
                            ctx.fillStyle = (isResizable || isLocked) ? handlerFillStyle : frameBorderColor;
                        var that = this;
                        function _drawAdornerHandles(control, ctx, left, top) {
                            if (!that.isControlVisible(control)) {
                                return;
                            }
                            var size = that.cornerSize;
                            ctx.fillRect(left, top, size, size);
                            ctx.strokeRect(left, top, size, size);
                        }
                        if (!isLineItem) {
                            // top-left
                            _drawAdornerHandles('tl', ctx, left - scaleOffset, top - scaleOffset);
                            // top-right
                            _drawAdornerHandles('tr', ctx, left + width - scaleOffset, top - scaleOffset);
                            // bottom-left
                            _drawAdornerHandles('bl', ctx, left - scaleOffset, top + height - scaleOffset);
                            // bottom-right
                            _drawAdornerHandles('br', ctx, left + width - scaleOffset, top + height - scaleOffset);
                        }
                        if (!this.get('lockUniScaling')) {
                            // middle-top
                            _drawAdornerHandles('mt', ctx, left + width / 2 - scaleOffset, top - scaleOffset);
                            //this._drawControl('mt', ctx, 'strokeRect', left + width / 2 - scaleOffset, top - scaleOffset);
                            // middle-bottom
                            _drawAdornerHandles('mb', ctx, left + width / 2 - scaleOffset, top + height - scaleOffset);
                            //this._drawControl('mb', ctx, 'strokeRect', left + width / 2 - scaleOffset, top + height - scaleOffset);
                            // middle-right
                            _drawAdornerHandles('mr', ctx, left + width - scaleOffset, top + height / 2 - scaleOffset);
                            //this._drawControl('mr', ctx, 'strokeRect', left + width - scaleOffset, top + height / 2 - scaleOffset);
                            // middle-left
                            _drawAdornerHandles('ml', ctx, left - scaleOffset, top + height / 2 - scaleOffset);
                            //this._drawControl('ml', ctx, 'strokeRect', left - scaleOffset, top + height / 2 - scaleOffset);
                        }
                        // middle-top-rotate
                        if (this.hasRotatingPoint) {
                            //this._drawControl('mtr', ctx, 'fillRect', left + width / 2 - scaleOffset,
                            //    top - this.rotatingPointOffset - scaleOffset);
                            //this._drawControl('mtr', ctx, 'strokeRect', left + width / 2 - scaleOffset,
                            //    top - this.rotatingPointOffset - scaleOffset);
                            ctx.beginPath();
                            ctx.arc(left + width / 2 - scaleOffset + this.cornerSize / 2, top - this.rotatingPointOffset - scaleOffset + this.cornerSize / 2, this.cornerSize / 2, 0, 2 * Math.PI, false);
                            ctx['fill']();
                            ctx['stroke']();
                        }
                        //if (this.thermal_label_object)
                        //{
                        //    var offset_x = 12;
                        //    var offset_y = 2;
                        //    if (this.thermal_label_object.locked)
                        //        ctx.drawImage(locked_image, width / 2 - offset_x, -height / 2 + offset_y);
                        //}
                        //if (this.thermal_label_object && this.thermal_label_object.data_field)
                        //{                    
                        //    var offset = 2;
                        //    ctx.drawImage(data_field_image, - width / 2 + offset, -height / 2 + offset);
                        //}
                        //if (this.thermal_label_object && this.thermal_label_object.expression) {
                        //    var offset = 2;
                        //    if (this.thermal_label_object && this.thermal_label_object.data_field) {
                        //        ctx.drawImage(expression_image, - width / 2 + offset + 12, -height / 2 + offset);
                        //    } else {
                        //        ctx.drawImage(expression_image, - width / 2 + offset, -height / 2 + offset);
                        //    }
                        //}
                        if (this.thermal_label_object) {
                            ctx.font = "9pt Courier New";
                            var str_height = "\u25c4 " + this.thermal_label_object.height.toFixed(self.num_of_fractional_digits) + " \u25ba";
                            var str_width = "\u25c4 " + this.thermal_label_object.width.toFixed(self.num_of_fractional_digits) + " \u25ba";
                            //var str_loc = "X: " + this.thermal_label_object.x.toFixed(4) + " | Y: " + this.thermal_label_object.y.toFixed(4);
                            // width
                            ctx.fillStyle = "black";
                            ctx.fillText(str_width, left + width / 2 - (ctx.measureText(str_width).width / 2), top - scaleOffset - 4);
                            // loc
                            //ctx.fillText(str_loc, left + width / 2 - (ctx.measureText(str_loc).width / 2), (top + height) + scaleOffset + 8);
                            // height
                            ctx.rotate(-Math.PI / 2);
                            ctx.fillStyle = "black";
                            ctx.fillText(str_height, top + (height / 2) - ctx.measureText(str_width).width / 2, left - scaleOffset - 4);
                        }
                        ctx.restore();
                        return this;
                    };
                    fabric.Object.prototype.drawBorders = function (ctx) {
                        var isLineItem = (this.thermal_label_object && this.thermal_label_object instanceof Neodynamic.SDK.Printing.LineShapeItem);
                        if (!this.hasBorders || isLineItem) {
                            return this;
                        }
                        ctx.save();
                        ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
                        ctx.strokeStyle = frameBorderColor;
                        ctx.lineWidth = this.borderScaleFactor;
                        if (ctx.setLineDash)
                            ctx.setLineDash([4, 3]);
                        var wh = this._calculateCurrentDimensions(true), width = wh.x, height = wh.y;
                        if (this.group) {
                            width = width * this.group.scaleX;
                            height = height * this.group.scaleY;
                        }
                        //ctx.strokeRect(
                        //  ~~(-(width / 2)) - 0.5, // offset needed to make lines look sharper
                        //  ~~(-(height / 2)) - 0.5,
                        //  ~~(width) + 1, // double offset needed to make lines look sharper
                        //  ~~(height) + 1
                        //);
                        ctx.strokeRect(~~(-(width / 2)), // offset needed to make lines look sharper
                        ~~(-(height / 2)), ~~(width), // double offset needed to make lines look sharper
                        ~~(height));
                        /*if (this.hasRotatingPoint && this.isControlVisible('mtr') && !this.get('lockRotation') && this.hasControls) {
                            var rotateHeight = -height / 2;
                    
                            ctx.beginPath();
                            ctx.moveTo(0, rotateHeight);
                            ctx.lineTo(0, rotateHeight - this.rotatingPointOffset);
                            ctx.closePath();
                            ctx.stroke();
                        }*/
                        ctx.restore();
                        return this;
                    };
                };
                /*
                *   Inicializa el editor
                */
                ThermalLabelEditor.prototype.enableEditor = function () {
                    var self = this;
                    fabric.util.object.extend(fabric.Object.prototype, {
                        drawIcons: function (ctx) {
                            //idea from https://stackoverflow.com/questions/51233082/draw-border-on-fabric-textbox-when-its-not-selected and http://jsfiddle.net/4d3rL5ok/2/
                            var bw = this.width, bh = this.height, bx = -bw / 2, bt = -bh / 2, br = bx + bw, bb = bt + bh;
                            //ctx.beginPath();
                            //ctx.moveTo(bx, by);
                            //ctx.lineTo(bx + bw, by);
                            //ctx.lineTo(bx + bw, by + bh);
                            //ctx.lineTo(bx, by + bh);
                            //ctx.lineTo(bx, by);
                            //ctx.closePath();
                            //var stroke = ctx.strokeStyle;
                            //ctx.strokeStyle = '#ff0000';
                            //ctx.stroke();
                            //ctx.strokeStyle = stroke;
                            // draw group border
                            var selObj = self._tlweCanvasFabric.getActiveObject();
                            var selGroupName = null;
                            var objIsInTempGroup = false;
                            if (this.thermal_label_object)
                                objIsInTempGroup = self._isItemInGrouping(this.thermal_label_object._guid);
                            if (objIsInTempGroup || (selObj && selObj.thermal_label_object && selObj.thermal_label_object.group_name && selObj.thermal_label_object.group_name.trim() != '')) {
                                selGroupName = selObj.thermal_label_object.group_name;
                                if (selGroupName == this.thermal_label_object.group_name
                                    || objIsInTempGroup) {
                                    ctx.save();
                                    ctx.scale(1 / this.scaleX, 1 / this.scaleY);
                                    ctx.beginPath();
                                    ctx.lineWidth = "1";
                                    ctx.strokeStyle = self.getStyleValue("--adorner-handler-background-color");
                                    ctx.rect(bx * this.scaleX, bt * this.scaleY, bw * this.scaleX, bh * this.scaleY);
                                    ctx.stroke();
                                    ctx.restore();
                                    selGroupName = true;
                                }
                            }
                            // draw design time border
                            if (!selGroupName &&
                                this.thermal_label_object &&
                                (this.thermal_label_object instanceof Neodynamic.SDK.Printing.TextItem ||
                                    this.thermal_label_object instanceof Neodynamic.SDK.Printing.BarcodeItem ||
                                    this.thermal_label_object instanceof Neodynamic.SDK.Printing.ImageItem ||
                                    this.thermal_label_object instanceof Neodynamic.SDK.Printing.TableShapeItem)) {
                                ctx.save();
                                ctx.scale(1 / this.scaleX, 1 / this.scaleY);
                                ctx.beginPath();
                                ctx.lineWidth = "1";
                                ctx.strokeStyle = self.getStyleValue("--item-design-time-border-color");
                                ctx.rect(bx * this.scaleX, bt * this.scaleY, bw * this.scaleX, bh * this.scaleY);
                                ctx.stroke();
                                ctx.restore();
                            }
                            // draw repeater adorner
                            if (!selGroupName &&
                                this.thermal_label_object &&
                                this.thermal_label_object instanceof Neodynamic.SDK.Printing.RepeaterItem) {
                                ctx.save();
                                var triSize = 10;
                                var triPad = 2;
                                var triX = br + triPad;
                                var triY = bt;
                                var n = parseInt(bh) / (triSize + triPad);
                                if (n == 0)
                                    n = 1;
                                for (var i = 0; i < n; i++) {
                                    ctx.beginPath();
                                    ctx.moveTo(triX, triY + ((triSize + triPad) * i));
                                    ctx.lineTo(triX + triSize, triY + ((triSize + triPad) * i));
                                    ctx.lineTo(triX + triSize / 2, triY + ((triSize + triPad) * i) + triSize);
                                    ctx.closePath();
                                    ctx.fillStyle = self.getStyleValue("--repeater-item-color");
                                    ctx.fill();
                                }
                                var txt = this.thermal_label_object.count > 0 ? this.thermal_label_object.count.toString() : 'n';
                                ctx.font = "bold " + (triSize + triPad).toString() + "px courier";
                                ctx.fillText(txt, triX + triSize + triPad, triY + triSize);
                                ctx.restore();
                            }
                            // draw out of label border if any
                            if (self._adorner_out_of_label_visible && this.thermal_label_object) {
                                var rect = this.thermal_label_object._fabric_item.getBoundingRect();
                                if (rect.left < 0 ||
                                    rect.top < 0 ||
                                    rect.left + rect.width > this.thermal_label_object._fabric_item.canvas.getWidth() ||
                                    rect.top + rect.height > this.thermal_label_object._fabric_item.canvas.getHeight()) {
                                    ctx.save();
                                    ctx.scale(1 / this.scaleX, 1 / this.scaleY);
                                    ctx.beginPath();
                                    ctx.lineWidth = "1";
                                    ctx.setLineDash([3, 3]);
                                    ctx.strokeStyle = self.getStyleValue("--adorner-out-of-label-border-color");
                                    ctx.rect(bx * this.scaleX, bt * this.scaleY, bw * this.scaleX, bh * this.scaleY);
                                    ctx.stroke();
                                    ctx.restore();
                                }
                            }
                            if (this.thermal_label_object &&
                                (this.thermal_label_object.locked ||
                                    this.thermal_label_object.data_field ||
                                    this.thermal_label_object.expression ||
                                    this.thermal_label_object.comments ||
                                    !this.thermal_label_object.editable ||
                                    !this.thermal_label_object.visible ||
                                    this.thermal_label_object.read_only ||
                                    (this.thermal_label_object.print_as_resident_element && this.thermal_label_object.print_as_resident_element == true))) {
                                ctx.save();
                                ctx.scale(1 / this.scaleX, 1 / this.scaleY);
                                var icon_size = 12;
                                var icon_offset = 1;
                                if (this.thermal_label_object.editable == false) {
                                    ctx.drawImage(document.getElementById("tleNoEditIcon"), br * this.scaleX - (icon_offset * icon_size), bt * this.scaleY);
                                    icon_offset += 1;
                                }
                                if (this.thermal_label_object.locked) {
                                    ctx.drawImage(document.getElementById("tleLockedIcon"), (br * this.scaleX - (icon_offset * icon_size)), bt * this.scaleY);
                                    icon_offset += 1;
                                }
                                if (this.thermal_label_object.data_field) {
                                    ctx.drawImage(document.getElementById("tleDbIcon"), br * this.scaleX - (icon_offset * icon_size), bt * this.scaleY);
                                    icon_offset += 1;
                                }
                                if (this.thermal_label_object.expression) {
                                    ctx.drawImage(document.getElementById("tleExprIcon"), br * this.scaleX - (icon_offset * icon_size), bt * this.scaleY);
                                    icon_offset += 1;
                                }
                                if (this.thermal_label_object.comments) {
                                    ctx.drawImage(document.getElementById("tleCommentsIcon"), br * this.scaleX - (icon_offset * icon_size), bt * this.scaleY);
                                    icon_offset += 1;
                                }
                                if (!this.thermal_label_object.visible) {
                                    ctx.drawImage(document.getElementById("tleNotVisibleIcon"), br * this.scaleX - (icon_offset * icon_size), bt * this.scaleY);
                                    icon_offset += 1;
                                }
                                if (this.thermal_label_object.print_as_resident_element) {
                                    //console.log(this.thermal_label_object._printAsResidentElementValidationResult); 
                                    if (this.thermal_label_object._printAsResidentElementValidationResult.printAsResidentElement == null ||
                                        this.thermal_label_object._printAsResidentElementValidationResult.printAsResidentElement == true) {
                                        ctx.drawImage(document.getElementById("tlePrintAsResidentElementIcon"), br * this.scaleX - (1 * icon_size), bb * this.scaleY - (1 * icon_size));
                                    }
                                    else {
                                        ctx.drawImage(document.getElementById("tlePrintAsResidentElementErrorIcon"), br * this.scaleX - (1 * icon_size), bb * this.scaleY - (1 * icon_size));
                                    }
                                    //icon_offset += 1;
                                }
                                ctx.restore();
                            }
                        }
                    });
                    var ellipseRender = fabric.Ellipse.prototype._render;
                    fabric.Ellipse.prototype._render = function (ctx) {
                        ellipseRender.call(this, ctx);
                        this.drawIcons(ctx);
                    };
                    var rectRender = fabric.Rect.prototype._render;
                    fabric.Rect.prototype._render = function (ctx) {
                        rectRender.call(this, ctx);
                        this.drawIcons(ctx);
                    };
                    var roundedRectRender = fabric.RoundedRect.prototype._render;
                    fabric.RoundedRect.prototype._render = function (ctx) {
                        roundedRectRender.call(this, ctx);
                        this.drawIcons(ctx);
                    };
                    var imageRender = fabric.Image.prototype._render;
                    fabric.Image.prototype._render = function (ctx) {
                        imageRender.call(this, ctx);
                        this.drawIcons(ctx);
                    };
                    //(fabric as any).TLEllipseItem = fabric.util.createClass(fabric.Ellipse, {
                    //    type: 'tlItem',
                    //    initialize: function (element, options) {
                    //        options || (options = {});
                    //        this.callSuper('initialize', element, options);
                    //    },
                    //    _render: function (ctx) {
                    //        this.callSuper('_render', ctx);
                    //        //
                    //        const bb = this.getBoundingRect();
                    //        ctx.strokeStyle = '#ff0000';
                    //        ctx.strokeRect(
                    //            bb.left + 0.5,
                    //            bb.top + 0.5,
                    //            bb.width,
                    //            bb.height
                    //        );
                    //    }
                    //});
                    //fabric.util.object.extend(fabric.Object.prototype, {
                    //    drawIcons: function () {
                    //        if (this.thermal_label_object &&
                    //            (this.thermal_label_object.locked ||
                    //                this.thermal_label_object.data_field ||
                    //                this.thermal_label_object.expression ||
                    //                !this.thermal_label_object.editable))
                    //        {
                    //            const ctx = this.canvas.getContext("2d");
                    //            const bb = this.getBoundingRect();
                    //            //this.setCoords();
                    //            ctx.save();
                    //            if (this.thermal_label_object.locked) {
                    //                var locked_image = new Image();
                    //                locked_image.src = "data:image/gif;base64,R0lGODlhDAAMAJEAAP8A//////9/JwAAACH5BAEHAAAALAAAAAAMAAwAAAIghINpi+KCFgiuQUZTDpO+n3wi5FUlCZ6WmY6ta2oyUgAAOw==";
                    //                var offset_x = 12;
                    //                var offset_y = 2;
                    //                var x = bb.left + bb.width - offset_x;
                    //                var y = bb.top - bb.height / 2 + offset_y;
                    //                if (this.angle != 0 && this.angle != 360) {
                    //                    ctx.translate(x + 6, y + 6);
                    //                    ctx.rotate(this.angle * Math.PI / 180);
                    //                }
                    //                ctx.drawImage(locked_image, x, y);
                    //            }
                    //            if (this.thermal_label_object.data_field) {
                    //                ctx.strokeStyle = '#ff0000';
                    //                ctx.strokeRect(
                    //                    bb.left + 0.5,
                    //                    bb.top + 0.5,
                    //                    bb.width,
                    //                    bb.height
                    //                );
                    //                var db_image = new Image();
                    //                db_image.src = "data:image/gif;base64,R0lGODlhDAAMAJEAACGk5P8A/////wAAACH5BAEHAAEALAAAAAAMAAwAAAIhTISJdgIP14EUCONctPgp31XgJHKT5pnap5YqGl2YkhgFADs=";
                    //                var offset_x = 12;
                    //                var offset_y = 2;
                    //                var __x = bb.left + bb.width / 2;
                    //                var __y = bb.top + bb.height / 2;
                    //                if (this.angle != 0 && this.angle != 360) {
                    //                    ctx.rotate(this.angle * Math.PI / 180);
                    //                    ctx.translate(__x, __y);
                    //                }
                    //                ctx.drawImage(db_image, __x, __y);
                    //            }
                    //            ctx.restore();
                    //        }       
                    //    }
                    //}); 
                    /* Agrega propiedad para referir al ShapeItem */
                    fabric.Object.prototype.orientation = '';
                    fabric.Object.prototype.rotatingPointOffset = 25;
                    //fabric.Object.prototype.cornerSize = 8;
                    /* Override para dibujar los controles */
                    this._drawFabricControls();
                    /* Crea un div contenedor maestro */
                    this._master_container = document.createElement("div");
                    $(this._master_container).
                        css("image-rendering", "-moz-crisp-edges").
                        css("image-rendering", "optimizeSpeed").
                        css("-ms-interpolation-mode", "nearest-neighbor").
                        css("image-rendering", "-o-crisp-edges").
                        css("image-rendering", "-webkit-optimize-contrast").
                        css("image-rendering", "pixelated");
                    $(this._container_div).append(this._master_container);
                    //add item icons
                    var lockedIcon = new Image();
                    lockedIcon.src = "data:image/gif;base64,R0lGODlhDAAMAJEAAP8A//////9/JwAAACH5BAEHAAAALAAAAAAMAAwAAAIghINpi+KCFgiuQUZTDpO+n3wi5FUlCZ6WmY6ta2oyUgAAOw==";
                    lockedIcon.id = "tleLockedIcon";
                    lockedIcon.style.display = "none";
                    $(this._container_div).append(lockedIcon);
                    var dbIcon = new Image();
                    dbIcon.src = "data:image/gif;base64,R0lGODlhDAAMAJEAACGk5P8A/////wAAACH5BAEHAAEALAAAAAAMAAwAAAIhTISJdgIP14EUCONctPgp31XgJHKT5pnap5YqGl2YkhgFADs=";
                    dbIcon.id = "tleDbIcon";
                    dbIcon.style.display = "none";
                    $(this._container_div).append(dbIcon);
                    var exprIcon = new Image();
                    exprIcon.src = "data:image/gif;base64,R0lGODlhDAAMAJEAAKBAwP////8A/wAAACH5BAEHAAIALAAAAAAMAAwAAAIelINpi+CAWHgvNlovTBlj7W2ZxoXW9AUSFS1CohgFADs=";
                    exprIcon.id = "tleExprIcon";
                    exprIcon.style.display = "none";
                    $(this._container_div).append(exprIcon);
                    var noEditIcon = new Image();
                    noEditIcon.src = "data:image/gif;base64,R0lGODlhDAAMAJEAAO0cJP////8A/wAAACH5BAEHAAIALAAAAAAMAAwAAAIglINpi+CAWHgvNlovzi6lPkFeqG1iuFloJlHRIozBUgAAOw==";
                    noEditIcon.id = "tleNoEditIcon";
                    noEditIcon.style.display = "none";
                    $(this._container_div).append(noEditIcon);
                    var notVisibleIcon = new Image();
                    notVisibleIcon.src = "data:image/gif;base64,R0lGODlhDAAMAJEAAH9/f////8PDwwAAACH5BAAHAP8ALAAAAAAMAAwAQAIehI8XIdsczJvOuAsthRHsKWEgwG1WeYUoo4lLAhsFADs=";
                    notVisibleIcon.id = "tleNotVisibleIcon";
                    notVisibleIcon.style.display = "none";
                    $(this._container_div).append(notVisibleIcon);
                    var commentsIcon = new Image();
                    commentsIcon.src = "data:image/gif;base64,R0lGODlhDAAMALMAAP///////f///v7ZAP3ZAP/JD//JEP/JDv/JDX9/f4B/fn9/fv///wAAAAAAAAAAACH5BAEHAAwALAAAAAAMAAwAAAQzEMhJ5yk4Z4mG/17BgaAIdEk6qGZHhuOXJkN73KQJ3IfHAoxAAFcCBgOIpBJhZAieUGgEADs=";
                    commentsIcon.id = "tleCommentsIcon";
                    commentsIcon.style.display = "none";
                    $(this._container_div).append(commentsIcon);
                    var readOnlyIcon = new Image();
                    readOnlyIcon.src = "data:image/gif;base64,R0lGODlhDAAMAJEAAIgAFf////8A/wAAACH5BAEHAAIALAAAAAAMAAwAAAIglH+BusDhEpgvQtoUZFlwuSHG5UQSFnqTqWrYMgafWAAAOw==";
                    readOnlyIcon.id = "tleReadOnlyIcon";
                    readOnlyIcon.style.display = "none";
                    $(this._container_div).append(readOnlyIcon);
                    var printAsResidentElementIcon = new Image();
                    printAsResidentElementIcon.src = "data:image/gif;base64,R0lGODlhDAAMAKIAAFB4rwD///8A/////39/fwAAAAAAAAAAACH5BAEHAAIALAAAAAAMAAwAAAMqKDLcrAvIKUcEIdA6ZN4AA1LiyElEqp4A4RDVMrgNDc2vddOMCy0qlS4BADs=";
                    printAsResidentElementIcon.id = "tlePrintAsResidentElementIcon";
                    printAsResidentElementIcon.style.display = "none";
                    $(this._container_div).append(printAsResidentElementIcon);
                    var printAsResidentElementErrorIcon = new Image();
                    printAsResidentElementErrorIcon.src = "data:image/gif;base64,R0lGODlhDAAMAKIAAP8AAP8A/////39/f//MAAAAAAAAAAAAACH5BAEHAAEALAAAAAAMAAwAAAMqGCHcrAvIKUUEhNAqZN4AA1LiyElDqp7A4AzVIrgNDc2vddOMCy0qlS4BADs=";
                    printAsResidentElementErrorIcon.id = "tlePrintAsResidentElementErrorIcon";
                    printAsResidentElementErrorIcon.style.display = "none";
                    $(this._container_div).append(printAsResidentElementErrorIcon);
                    //var locked_image = new Image();
                    //locked_image.src = "data:image/gif;base64,R0lGODlhDAAMAJEAAP8A//////9/JwAAACH5BAEHAAAALAAAAAAMAAwAAAIghINpi+KCFgiuQUZTDpO+n3wi5FUlCZ6WmY6ta2oyUgAAOw==";
                    //var data_field_image = new Image();
                    //data_field_image.src = "data:image/gif;base64,R0lGODlhDAAMAJEAACGk5P8A/////wAAACH5BAEHAAEALAAAAAAMAAwAAAIhTISJdgIP14EUCONctPgp31XgJHKT5pnap5YqGl2YkhgFADs=";
                    //var expression_image = new Image();
                    //expression_image.src = "data:image/gif;base64,R0lGODlhDAAMAJEAAAAAAP8A/////wAAACH5BAEHAAEALAAAAAAMAAwAAAIhjIVpi+CAmHgvNndhnlRX/lXQ6GEm1qSjBX4SFS1BohgFADs=";
                };
                ;
                ThermalLabelEditor.prototype.getStyleValue = function (styleName) {
                    return getComputedStyle($("#thermalLabelWebEditor")[0], null).getPropertyValue(styleName);
                };
                ThermalLabelEditor.prototype.hideItemTooltip = function () {
                    $(this._itemToolTip).css("visibility", "hidden");
                };
                ThermalLabelEditor.prototype.updateItemTooltip = function (x, y) {
                    $(this._itemToolTip).css("left", x + "px").css("top", y + "px").css("visibility", "visible");
                };
                /*
                *   Carga un objeto ThermalLabel y lo muestra en editor
                */
                ThermalLabelEditor.prototype.loadThermalLabel = function (tl) {
                    var self = this;
                    var UnitUtils = Neodynamic.Web.Utils.UnitUtils;
                    this._tl = tl;
                    if (!this._undoRedo) {
                        this._undoManager.clear();
                        this._undoManager.saveState(tl);
                    }
                    this._undoRedo = false;
                    //reset zoom to avoid issues
                    var curZoom = this.zoom;
                    this._zoom = 1;
                    this._tlweCanvas = document.createElement("canvas");
                    this._tlweCanvas.setAttribute("id", "tlweCanvas");
                    this._tlweBackgroundCanvas = document.createElement("canvas");
                    this._tlweBackgroundCanvas.setAttribute("id", "tlweBackCanvas");
                    //this._tipCanvas = document.createElement("canvas");
                    //this._tipCanvas.setAttribute("id", "tip");
                    this._itemToolTip = document.createElement("div");
                    this._itemToolTip.setAttribute("id", "itemToolTip");
                    $(this._itemToolTip).css("padding", "4px 8px").css("font-size", "9pt").css("border-radius", "4px 4px 4px 0px").css("position", "absolute").css("z-index", 101).css("visibility", "hidden").css('background-color', this.getStyleValue("--item-tooltip-background-color")).css('color', this.getStyleValue("--item-tooltip-color")).css('border', "1px solid " + this.getStyleValue("--item-tooltip-border-color"));
                    /*  Limpia el contenedor y agrega los canvas    */
                    $(this._master_container).html('').append(self._tlweCanvas).append(self._tlweBackgroundCanvas).append(self._itemToolTip); //.append(self._tipCanvas);
                    $(this._master_container).css("position", "relative").css("background-color", this.getStyleValue("--workspace-background-color")).css("width", "100%").css("height", "100%").
                        css("overflow", "scroll");
                    // add ruler
                    this._ruler = new this.ruler({
                        container: this._master_container,
                        rulerHeight: 15,
                        fontFamily: 'arial',
                        fontSize: '8px',
                        strokeStyle: 'black',
                        lineWidth: 1,
                        unit: tl.unit_type
                    });
                    //$(self._tlweCanvas).css('border-style', 'solid').css('border-width', 1).css('border-color', this.getStyleValue("--label-document-frame-border-color")).                css('border-radius', this.getStyleValue("--label-document-frame-corner-radius"));
                    var lw = Math.round(UnitUtils.convertUnitToPixel(tl.width, tl.unit_type));
                    var lh = Math.round(UnitUtils.convertUnitToPixel(tl.height, tl.unit_type));
                    var lwb = lw;
                    var lhb = lh;
                    if (this._tl.margin &&
                        (this._tl.margin.left > 0 ||
                            this._tl.margin.top > 0 ||
                            this._tl.margin.bottom > 0 ||
                            this._tl.margin.right > 0)) {
                        lw -= UnitUtils.convertUnitToPixel((this._tl.margin.left + this._tl.margin.right), this._tl.unit_type);
                        lh -= UnitUtils.convertUnitToPixel((this._tl.margin.top + this._tl.margin.bottom), this._tl.unit_type);
                    }
                    var lw_f = lw * self._workspace_factor;
                    var lh_f = lh * self._workspace_factor;
                    this._workspaceOffsetX = (lw_f - lw) / 2;
                    this._workspaceOffsetY = (lh_f - lh) / 2;
                    self._tlweCanvas.getContext('2d').canvas.width = lw;
                    self._tlweCanvas.getContext('2d').canvas.height = lh;
                    self._tlweBackgroundCanvas.getContext('2d').canvas.width = lwb;
                    self._tlweBackgroundCanvas.getContext('2d').canvas.height = lhb;
                    //this._tipCtx = this._tipCanvas.getContext("2d");
                    this._tlweCanvasFabric = new fabric.CanvasEx(this._tlweCanvas, { controlsAboveOverlay: true, selection: false }).
                        on('object:modified', function (object) { self._canvasObjectModified(object); }).
                        on('object:moving', function (object) { self.hideItemTooltip(); self._canvasObjectMoving(object); }).
                        on('object:scaling', function (object) { self.hideItemTooltip(); self._canvasObjectScaling(object); }).
                        on('object:rotating', function (object) { self.hideItemTooltip(); self._canvasObjectRotating(object); }).
                        //on('selection:created', function (object) { self._canvasObjectSelected(object); }).
                        //on('selection:updated', function (object) { self._canvasObjectSelected(object); }).
                        on('object:selected', function (object) { self.hideItemTooltip(); self._canvasObjectSelected(object); }).
                        on('selection:cleared', function (object) { self.hideItemTooltip(); self._canvasSelectionCleared(object); }).
                        on('mouse:down', function (object) { self._canvasMouseDown(object); }).
                        on('mouse:move', function (object) { self._canvasMouseMove(object); }).
                        on('mouse:up', function (object) { self._canvasMouseUp(object); }).
                        on('mouse:over', function (e) {
                        // show tooltip
                        self._itemToolTipOverCount++;
                        var offsetX = self._tlweCanvas.offsetParent.offsetLeft;
                        var offsetY = self._tlweCanvas.offsetParent.offsetTop;
                        var itemTypeName = e.target.thermal_label_object.constructor.name.replace("Item", "").replace("Shape", "");
                        var info = "";
                        if (e.target.thermal_label_object.name) {
                            info += "<strong>" + e.target.thermal_label_object.name + "</strong>";
                        }
                        if (info.length > 0)
                            info += " ";
                        info += "[" + itemTypeName + "]";
                        if (itemTypeName == "Barcode") {
                            info += " <em>" + Neodynamic.SDK.Printing.BarcodeSymbology[e.target.thermal_label_object.symbology] + "</em>";
                        }
                        $(self._itemToolTip).html("<span>" + info + "</span>");
                        self.updateItemTooltip(offsetX + e.target.left, offsetY + e.target.top - 26);
                        //self._tipCtx.font = 'normal 10px Arial';
                        //self._tipCanvas.style.left = (offsetX + e.target.left) + "px";
                        //self._tipCanvas.style.top = (offsetY + e.target.top - 20) + "px";
                        //self._tipCanvas.style.width = self._tipCtx.measureText(tooltipText).width + "px";
                        //self._tipCanvas.style.height = "20px";
                        //self._tipCtx.clearRect(0, 0, self._tipCanvas.width, self._tipCanvas.height);
                        //self._tipCtx.fillText(tooltipText, 5, 25);
                        //console.log('over');
                    }).
                        on('mouse:out', function (e) {
                        //e.target.set('fill', 'green');
                        //self._tlweCanvasFabric.renderAll();
                        //self._tipCanvas.style.left = "-1000px";
                        if (!e.target || self._itemToolTipOverCount == 1) {
                            self.hideItemTooltip();
                        }
                        self._itemToolTipOverCount = 0;
                        //console.log('out');
                    });
                    //.
                    //    on('after:render', function () {
                    //        //this is the fabric canvas
                    //        this.forEachObject(function (obj) {
                    //            obj.drawIcons();
                    //        })
                    //    });
                    this._setCanvasBackground();
                    this._centerCanvas();
                    this._tlweCanvas.getContext('2d').imageSmoothingEnabled = false;
                    for (var i = 0; i < tl.items.length; i++) {
                        if (tl.items[i] instanceof Neodynamic.SDK.Printing.LiteralItem) {
                            tl.items[i]._fabric_item.width = 100;
                            tl.items[i]._fabric_item.height = 100;
                        }
                        self._tlweCanvasFabric.add(tl.items[i]._fabric_item);
                        tl.items[i].onError = self._onError.bind(self);
                    }
                    //Set RFID custom image to any RFIDTagItem
                    self._tlweCanvasFabric.forEachObject(function (x) {
                        if (x.thermal_label_object instanceof Neodynamic.SDK.Printing.RFIDTagItem) {
                            x.thermal_label_object._image.src = self._rfid_tag_image_file_name;
                        }
                        else if (x.thermal_label_object instanceof Neodynamic.SDK.Printing.RepeaterItem) {
                            x.thermal_label_object._color = self.getStyleValue("--repeater-item-color");
                        }
                    });
                    self._tlweCanvasFabric.renderAll();
                    if (this.show_grid) {
                        this._buildGrids(this._grid_zoomed_size, this.getStyleValue('--grid-color'));
                    }
                    this.zoom = curZoom;
                    // clear rulers
                    this._selected_objects = null;
                    this._ruler.api.setHighlightZoneX({ pos: 0, size: 0 });
                    this._ruler.api.setHighlightZoneY({ pos: 0, size: 0 });
                    this.selectionChanged();
                };
                /*
                *   @private
                *   Centra los canvas en el div
                */
                ThermalLabelEditor.prototype._centerCanvas = function () {
                    var self = this;
                    var UnitUtils = Neodynamic.Web.Utils.UnitUtils;
                    var l = Math.abs($(self._container_div).width() / 2 - self._tlweBackgroundCanvasFabric.width / 2);
                    var t = Math.abs($(self._container_div).height() / 2 - self._tlweBackgroundCanvasFabric.height / 2);
                    var ml = UnitUtils.convertUnitToPixel(self._tl.margin.left, self._tl.unit_type) * self._zoom;
                    var mt = UnitUtils.convertUnitToPixel(self._tl.margin.top, self._tl.unit_type) * self._zoom;
                    $(self._container_div + " .canvas-container").
                        css("position", "absolute").css("top", t + mt).
                        css("left", l + ml).css("z-index", 100);
                    $(this._tlweBackgroundCanvas).css("position", "absolute").css("top", t).
                        css("left", l).css("z-index", 0);
                    var offsetRuler = 15;
                    self._ruler.api.setPos({ x: l - offsetRuler, y: t - offsetRuler });
                    self._ruler.api.setScale(self._zoom);
                    self._updateSelectionRuler();
                };
                ;
                /*
                *   @private
                *   Evento fabric mouse:down
                */
                ThermalLabelEditor.prototype._canvasMouseDown = function (options) {
                    var self = this;
                    var pointer = this._tlweCanvasFabric.getPointer(options.e);
                    var EditorTool = Neodynamic.Web.Editor.EditorTool;
                    var UnitUtils = Neodynamic.Web.Utils.UnitUtils;
                    if (this.active_tool == EditorTool.Pointer) {
                        return;
                    }
                    else if (this.active_tool == EditorTool.RFIDTag) {
                        this.active_tool_item._image.src = this.rfid_tag_image_file_name;
                    }
                    else if (this.active_tool == EditorTool.Repeater) {
                        this.active_tool_item._color = this.getStyleValue("--repeater-item-color");
                    }
                    this.active_tool_item.unit_type = this._tl.unit_type;
                    this.active_tool_item._fabric_item.set({
                        top: this._snap_to_grid ? Math.round(pointer.y / this._grid_zoomed_size) * this._grid_zoomed_size : pointer.y,
                        left: this._snap_to_grid ? Math.round(pointer.x / this._grid_zoomed_size) * this._grid_zoomed_size : pointer.x
                    });
                    /*
                    switch (this.active_tool) {
                        case EditorTool.Pointer: return;
                        case EditorTool.Rectangle: {
                            this.active_tool_item.unit_type = this._tl.unit_type;
                            this.active_tool_item._fabric_item.set({
                                top: self.snap_to_grid ? Math.round(pointer.y / this._grid_zoomed_size) * this._grid_zoomed_size : pointer.y,
                                left: self.snap_to_grid ? Math.round(pointer.x / this._grid_zoomed_size) * this._grid_zoomed_size : pointer.x
                            });
                        } break;
                        case EditorTool.Ellipse: {
                            this.active_tool_item.unit_type = this._tl.unit_type;
                            this.active_tool_item._fabric_item.set({
                                top: self.snap_to_grid ? Math.round(pointer.y / this._grid_zoomed_size) * this._grid_zoomed_size : pointer.y,
                                left: self.snap_to_grid ? Math.round(pointer.x / this._grid_zoomed_size) * this._grid_zoomed_size : pointer.x
                            });
                        } break;
                        case EditorTool.Line: {
                            this.active_tool_item.unit_type = this._tl.unit_type;
                            this.active_tool_item._fabric_item.set({
                                y1: self.snap_to_grid ? Math.round(pointer.y / this._grid_zoomed_size) * this._grid_zoomed_size : pointer.y,
                                x1: self.snap_to_grid ? Math.round(pointer.x / this._grid_zoomed_size) * this._grid_zoomed_size : pointer.x
                            });
                        } break;
                        case EditorTool.Text: {
                            this.active_tool_item.unit_type = this._tl.unit_type;
                            this.active_tool_item._fabric_item.set({
                                top: self.snap_to_grid ? Math.round(pointer.y / this._grid_zoomed_size) * this._grid_zoomed_size : pointer.y,
                                left: self.snap_to_grid ? Math.round(pointer.x / this._grid_zoomed_size) * this._grid_zoomed_size : pointer.x
                            });
                        } break;
                        case EditorTool.Barcode: {
                            this.active_tool_item.unit_type = this._tl.unit_type;
                            this.active_tool_item._fabric_item.set({
                                top: self.snap_to_grid ? Math.round(pointer.y / this._grid_zoomed_size) * this._grid_zoomed_size : pointer.y,
                                left: self.snap_to_grid ? Math.round(pointer.x / this._grid_zoomed_size) * this._grid_zoomed_size : pointer.x
                            });
                        } break;
                        case EditorTool.Image: {
                            this.active_tool_item.unit_type = this._tl.unit_type;
                            this.active_tool_item._fabric_item.set({
                                top: self.snap_to_grid ? Math.round(pointer.y / this._grid_zoomed_size) * this._grid_zoomed_size : pointer.y,
                                left: self.snap_to_grid ? Math.round(pointer.x / this._grid_zoomed_size) * this._grid_zoomed_size : pointer.x
                            });
                        } break;
                        case EditorTool.Literal: { } break;
                        case EditorTool.RFIDTag: {
                            var rfid = <Neodynamic.SDK.Printing.RFIDTagItem>this.active_tool_item;
                            rfid.unit_type = this._tl.unit_type;
                            rfid._image.src = this.rfid_tag_image_file_name;
                            rfid._fabric_item.set({
                                top: self.snap_to_grid ? Math.round(pointer.y / this._grid_zoomed_size) * this._grid_zoomed_size : pointer.y,
                                left: self.snap_to_grid ? Math.round(pointer.x / this._grid_zoomed_size) * this._grid_zoomed_size : pointer.x
                            });
        
                        } break;
                        default: return;
                    }
                    */
                    this._is_drawing = true;
                    this._tlweCanvasFabric.add(this.active_tool_item._fabric_item);
                    //TEST Se elimina el buffer de objetos del canvas y se usa directamente la referencia a ThermalLabel  
                    this.active_tool_item.onError = this._onError.bind(this);
                    this._tl.items.push(this.active_tool_item);
                };
                ;
                /*
                *   @private
                *   Evento fabric mouse:move
                */
                ThermalLabelEditor.prototype._canvasMouseMove = function (options) {
                    var self = this;
                    /*  Chequear si esta dibujando  */
                    if (!this._is_drawing)
                        return;
                    var pointer = this._tlweCanvasFabric.getPointer(options.e);
                    var EditorTool = Neodynamic.Web.Editor.EditorTool;
                    var UnitUtils = Neodynamic.Web.Utils.UnitUtils;
                    switch (this.active_tool) {
                        case EditorTool.Pointer: return;
                        case EditorTool.Rectangle:
                        case EditorTool.Literal:
                        case EditorTool.Repeater:
                            {
                                this.active_tool_item._fabric_item.set({
                                    height: Math.abs(this.active_tool_item._fabric_item.top - pointer.y),
                                    width: Math.abs(this.active_tool_item._fabric_item.left - pointer.x)
                                });
                            }
                            break;
                        case EditorTool.Ellipse:
                            {
                                this.active_tool_item._fabric_item.set({
                                    height: Math.abs(self.active_tool_item._fabric_item.top - pointer.y),
                                    width: Math.abs(self.active_tool_item._fabric_item.left - pointer.x),
                                    rx: Math.abs((self.active_tool_item._fabric_item.left - pointer.x) / 2),
                                    ry: Math.abs((self.active_tool_item._fabric_item.top - pointer.y) / 2)
                                });
                            }
                            break;
                        case EditorTool.Line:
                            {
                                //this.active_tool_item._fabric_item.set({
                                //    y2: Math.abs(pointer.y),
                                //    x2: Math.abs(pointer.x)
                                //});
                                this.active_tool_item._fabric_item.set({
                                    height: Math.abs(this.active_tool_item._fabric_item.top - pointer.y),
                                    width: Math.abs(this.active_tool_item._fabric_item.left - pointer.x)
                                });
                            }
                            break;
                        case EditorTool.Text:
                        case EditorTool.Barcode:
                        case EditorTool.Image:
                        case EditorTool.Table:
                            {
                                this.active_tool_item._fabric_item.set({
                                    height: Math.abs(this.active_tool_item._fabric_item.top - pointer.y),
                                    width: Math.abs(this.active_tool_item._fabric_item.left - pointer.x)
                                });
                            }
                            break;
                        case EditorTool.RFIDTag:
                            { }
                            break;
                        default: return;
                    }
                    this.active_tool_item._fabric_item.setCoords();
                    this._tlweCanvasFabric.renderAll();
                };
                ;
                /*
                *   @private
                *   Evento fabric mouse:up
                */
                ThermalLabelEditor.prototype._canvasMouseUp = function (options) {
                    var EditorTool = Neodynamic.Web.Editor.EditorTool;
                    if (this.active_tool != EditorTool.Pointer) {
                        var o = this.active_tool_item._fabric_item;
                        this.active_tool = EditorTool.Pointer;
                        if (this._is_drawing) {
                            if (o.height < 10)
                                o.height = 10;
                            if (o.width < 10)
                                o.width = 10;
                        }
                        this._tlweCanvasFabric.forEachObject(function (o) {
                            o.selectable = true;
                        });
                        o.scaleX = o.scaleY = this._zoom;
                        switch (o.type) {
                            case 'circle':
                                {
                                    o.radius = Math.abs(o.radius / this._zoom);
                                }
                                break;
                            case 'ellipse':
                                {
                                    o.ry = Math.abs(o.ry / this._zoom);
                                    o.rx = Math.abs(o.rx / this._zoom);
                                }
                                break;
                        }
                        var zoomedWidth = o.width / this._zoom;
                        var zoomedHeight = o.height / this._zoom;
                        o.width = this._snap_to_grid ? Math.round(zoomedWidth / this._grid_size) * this._grid_size : zoomedWidth;
                        if (o.thermal_label_object instanceof Neodynamic.SDK.Printing.LineShapeItem == false) {
                            o.height = this._snap_to_grid ? Math.round(zoomedHeight / this._grid_size) * this._grid_size : zoomedHeight;
                        }
                        switch (o.type) {
                            case 'rect':
                                {
                                    if (o.thermal_label_object instanceof Neodynamic.SDK.Printing.LineShapeItem == false) {
                                        o.width -= o.strokeWidth;
                                        o.height -= o.strokeWidth;
                                    }
                                }
                                break;
                            case 'circle':
                                {
                                    o.width -= o.strokeWidth;
                                    o.height -= o.strokeWidth;
                                    o.radius = o.width / 2;
                                }
                                break;
                            case 'ellipse':
                                {
                                    o.width -= o.strokeWidth;
                                    o.height -= o.strokeWidth;
                                    o.ry = o.height / 2;
                                    o.rx = o.width / 2;
                                }
                                break;
                        }
                        o.setCoords();
                        if (this.angle_snap)
                            o.angle = Math.round(o.angle / this.angle_snap) * this.angle_snap;
                        //TEST Se elimina el buffer de objetos del canvas y se usa directamente la referencia a ThermalLabel  
                        //this._canvas_items[this.active_tool_item._guid]._updateFromCanvas();                
                        this._tl.items[this._tl.items.indexOf(this.active_tool_item)]._updateFromCanvas();
                        //this.active_tool_item._updateFromCanvas();
                        //this._tl.items[this.active_tool_item._guid]._updateFromCanvas();
                        this._tlweCanvasFabric.setActiveObject(this.active_tool_item._fabric_item);
                        this._tlweCanvasFabric.renderAll();
                        //disparar evento newItemCreated
                        this.newItemCreated();
                        this._is_drawing = false;
                        this.saveCurrentLabelCanvasState();
                    }
                };
                ;
                /*
                *   @private
                *   Evento fabric object:modified
                */
                ThermalLabelEditor.prototype._canvasObjectModified = function (options) {
                    //this._canvas.renderAll();
                    /*  Refrescar valores del objeto de fabric al objeto ShapeItem  */
                    /*this._canvas_items[options.target.guid]._updateFromCanvas();*/
                    //console.log('object:modified');
                    if (this._snap_to_grid) {
                        options.target.left = Math.round(options.target.left / this._grid_zoomed_size) * this._grid_zoomed_size;
                        options.target.top = Math.round(options.target.top / this._grid_zoomed_size) * this._grid_zoomed_size;
                        if (options.target.thermal_label_object instanceof Neodynamic.SDK.Printing.LineShapeItem == false) {
                            options.target.height = Math.round(options.target.height / this._grid_size) * this._grid_size;
                        }
                        options.target.width = Math.round(options.target.width / this._grid_size) * this._grid_size;
                        //options.target.scaleX = options.target.scaleY = canvasScale;
                        switch (options.target.type) {
                            case 'rect':
                                {
                                    if (options.target.thermal_label_object instanceof Neodynamic.SDK.Printing.LineShapeItem == false) {
                                        options.target.width -= options.target.strokeWidth;
                                        options.target.height -= options.target.strokeWidth;
                                    }
                                }
                                break;
                            case 'ellipse':
                                {
                                    options.target.width -= options.target.strokeWidth;
                                    options.target.height -= options.target.strokeWidth;
                                    options.target.ry = options.target.height / 2;
                                    options.target.rx = options.target.width / 2;
                                }
                                break;
                        }
                    }
                    //options.target.dirty = true;
                    options.target.setCoords();
                    if (this.angle_snap && this.angle_snap > 0)
                        options.target.angle = Math.round(options.target.angle / this.angle_snap) * this.angle_snap;
                    this._selObjLT.x = options.target.oCoords.tl.x;
                    this._selObjLT.y = options.target.oCoords.tl.y;
                    // if current obj is part of a group, then change the rest of the group 
                    if (options.target.thermal_label_object && options.target.thermal_label_object.group_name && options.target.thermal_label_object.group_name.trim() != '') {
                        var self = this;
                        var gn = options.target.thermal_label_object.group_name.trim();
                        this._tlweCanvasFabric.getObjects().map(function (obj) {
                            if (obj.thermal_label_object &&
                                gn != '' &&
                                obj.thermal_label_object.group_name == gn &&
                                obj.thermal_label_object._guid != options.target.thermal_label_object._guid &&
                                obj.thermal_label_object.editable &&
                                !obj.thermal_label_object.locked &&
                                obj.thermal_label_object.visible) {
                                if (this._snap_to_grid) {
                                    obj.setLeft(Math.round(obj.left / self._grid_zoomed_size) * self._grid_zoomed_size);
                                    obj.setTop(Math.round(obj.top / self._grid_zoomed_size) * self._grid_zoomed_size);
                                    if (obj.thermal_label_object instanceof Neodynamic.SDK.Printing.LineShapeItem == false) {
                                        obj.setHeight(Math.round(obj.height / self._grid_size) * self._grid_size);
                                    }
                                    obj.setWidth(Math.round(obj.width / self._grid_size) * self._grid_size);
                                    //options.target.scaleX = options.target.scaleY = canvasScale;
                                    switch (obj.type) {
                                        case 'rect':
                                            {
                                                if (obj.thermal_label_object instanceof Neodynamic.SDK.Printing.LineShapeItem == false) {
                                                    obj.width -= obj.strokeWidth;
                                                    obj.height -= obj.strokeWidth;
                                                }
                                            }
                                            break;
                                        case 'ellipse':
                                            {
                                                obj.width -= obj.strokeWidth;
                                                obj.height -= obj.strokeWidth;
                                                obj.ry = obj.height / 2;
                                                obj.rx = obj.width / 2;
                                            }
                                            break;
                                    }
                                }
                                obj.setCoords();
                                if (self.angle_snap && self.angle_snap > 0)
                                    obj.angle = Math.round(obj.angle / self.angle_snap) * self.angle_snap;
                                if (obj.type == 'image') {
                                    obj.thermal_label_object._updateFromCanvas();
                                    obj.thermal_label_object.refresh();
                                }
                            }
                        });
                    }
                    this._tlweCanvasFabric.renderAll();
                    this.saveCurrentLabelCanvasState();
                    this._updateSelectionRuler();
                };
                ;
                /*
                *   @private
                *   Evento fabric object:rotating
                */
                ThermalLabelEditor.prototype._canvasObjectRotating = function (options) {
                    var self = this;
                    // if current obj is part of a group, then change the rest of the group 
                    // based on the changes made on the current obj
                    if (options.target.thermal_label_object && options.target.thermal_label_object.group_name && options.target.thermal_label_object.group_name.trim() != '') {
                        var da = options.target.angle - (options.target.thermal_label_object._rotation_angle != null ? options.target.thermal_label_object._rotation_angle : 0);
                        var gn = options.target.thermal_label_object.group_name.trim();
                        this._tlweCanvasFabric.getObjects().map(function (obj) {
                            if (obj.thermal_label_object &&
                                gn != '' &&
                                obj.thermal_label_object.group_name == gn &&
                                obj.thermal_label_object._guid != options.target.thermal_label_object._guid &&
                                obj.thermal_label_object.editable &&
                                !obj.thermal_label_object.locked &&
                                obj.thermal_label_object.visible &&
                                obj.thermal_label_object._rotation_angle != null) {
                                if (da != 0) {
                                    var objAngle = obj.thermal_label_object._rotation_angle;
                                    var newAngle = objAngle + da;
                                    if (self.angle_snap && self.angle_snap > 0)
                                        newAngle = Math.round(newAngle / self.angle_snap) * self.angle_snap;
                                    if (newAngle >= 360)
                                        newAngle = newAngle - 360;
                                    if (newAngle < 0)
                                        newAngle = 360 + newAngle;
                                    obj.setAngle(newAngle);
                                    obj.setCoords();
                                }
                            }
                        });
                    }
                    this._tlweCanvasFabric.renderAll();
                    //this._updateSelectionRuler();
                };
                ;
                /*
                *   @private
                *   Evento fabric object:moving
                */
                ThermalLabelEditor.prototype._canvasObjectMoving = function (options) {
                    //console.log('object:moving');
                    // if current obj is part of a group, then change the rest of the group 
                    // based on the changes made on the current obj
                    if (options.target.thermal_label_object && options.target.thermal_label_object.group_name && options.target.thermal_label_object.group_name.trim() != '') {
                        //options.target.setCoords();
                        //var boundRect = Neodynamic.Web.Utils.MathUtils.getBoundingRect(options.target.oCoords);
                        //var dl = (boundRect.left) - Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(options.target.thermal_label_object.x, options.target.thermal_label_object._unit_type);//options.target.originalState.left;
                        //var dt = (boundRect.top) - Neodynamic.Web.Utils.UnitUtils.convertUnitToPixel(options.target.thermal_label_object.y, options.target.thermal_label_object._unit_type);//options.target.originalState.top;
                        var dl = options.e.movementX;
                        var dt = options.e.movementY;
                        var gn = options.target.thermal_label_object.group_name.trim();
                        this._tlweCanvasFabric.getObjects().map(function (obj) {
                            if (obj.thermal_label_object &&
                                gn != '' &&
                                obj.thermal_label_object.group_name == gn &&
                                obj.thermal_label_object._guid != options.target.thermal_label_object._guid &&
                                obj.thermal_label_object.editable &&
                                !obj.thermal_label_object.locked &&
                                obj.thermal_label_object.visible) {
                                obj.setTop(obj.top + dt);
                                obj.setLeft(obj.left + dl);
                                switch (obj.type) {
                                    case 'ellipse':
                                        {
                                            obj.ry = obj.height / 2;
                                            obj.rx = obj.width / 2;
                                        }
                                        break;
                                }
                                obj.setCoords();
                            }
                        });
                    }
                    this._tlweCanvasFabric.renderAll();
                    //this._updateSelectionRuler();
                };
                ;
                /*
                *   @private
                *   Evento fabric object:scaling
                */
                ThermalLabelEditor.prototype._canvasObjectScaling = function (options) {
                    //console.log('object:scaling');
                    //var data = {
                    //    'o_t': options.target.originalState.top,
                    //    't': options.target.top,
                    //    'o_l': options.target.originalState.left,
                    //    'l': options.target.left,
                    //    'o_w': options.target.originalState.width,
                    //    'w': options.target.width,
                    //    'o_h': options.target.originalState.height,
                    //    'h': options.target.height,
                    //    'o_a': options.target.originalState.angle,
                    //    'a': options.target.angle
                    //};
                    //console.log(data);
                    var offsetX = options.target.left - this._selObjLT.x;
                    var offsetY = options.target.top - this._selObjLT.y;
                    //console.log({ 'offX': offsetX, 'offY': offsetY });
                    this._selObjLT.x = options.target.left;
                    this._selObjLT.y = options.target.top;
                    var scaleInfo = {
                        'corner': options.target.__corner,
                        'scaleX': options.target.scaleX,
                        'scaleY': options.target.scaleY,
                        'dX': offsetX,
                        'dY': offsetY
                    };
                    //console.log(scaleInfo);
                    //return;            
                    //var objLeft = this.snap_to_grid ? Math.round(options.target.left / this.grid_size) * this.grid_size : options.target.left;
                    //var objTop = this.snap_to_grid ? Math.round(options.target.top / this.grid_size) * this.grid_size : options.target.top;
                    //var objHeight = this.snap_to_grid ? Math.round(options.target.height / this.grid_size) * this.grid_size : options.target.height;
                    //var objWidth = this.snap_to_grid ? Math.round(options.target.width / this.grid_size) * this.grid_size : options.target.width;
                    options.target.top = options.target.top;
                    options.target.left = options.target.left;
                    options.target.height = Math.abs(options.target.height * options.target.scaleY / this._zoom);
                    options.target.width = Math.abs(options.target.width * options.target.scaleX / this._zoom);
                    options.target.scaleX = options.target.scaleY = this._zoom;
                    options.target.hasToReload = true;
                    switch (options.target.type) {
                        case 'ellipse':
                            {
                                options.target.ry = options.target.height / 2;
                                options.target.rx = options.target.width / 2;
                            }
                            break;
                    }
                    //options.target.dirty = true;
                    // if current obj is part of a group, then change the rest of the group
                    if (options.target.thermal_label_object && options.target.thermal_label_object.group_name && options.target.thermal_label_object.group_name.trim() != '') {
                        var self = this;
                        var gn = options.target.thermal_label_object.group_name;
                        this._tlweCanvasFabric.getObjects().map(function (obj) {
                            if (obj.thermal_label_object &&
                                obj.thermal_label_object.group_name == gn &&
                                obj.thermal_label_object._guid != options.target.thermal_label_object._guid &&
                                obj.thermal_label_object.editable &&
                                !obj.thermal_label_object.locked &&
                                obj.thermal_label_object.visible) {
                                if (scaleInfo.corner != 'ml' && scaleInfo.corner != 'mr')
                                    obj.height = Math.abs(obj.height * scaleInfo.scaleY / self._zoom);
                                if (scaleInfo.corner != 'mt' && scaleInfo.corner != 'mb')
                                    obj.width = Math.abs(obj.width * scaleInfo.scaleX / self._zoom);
                                if (scaleInfo.corner == 'tl' || scaleInfo.corner == 'ml' || scaleInfo.corner == 'bl') {
                                    obj.left += scaleInfo.dX;
                                }
                                if (scaleInfo.corner == 'tl' || scaleInfo.corner == 'mt' || scaleInfo.corner == 'tr') {
                                    obj.top += scaleInfo.dY;
                                }
                                obj.scaleX = obj.scaleY = self._zoom;
                                obj.hasToReload = true;
                                switch (obj.type) {
                                    case 'ellipse':
                                        {
                                            obj.ry = obj.height / 2;
                                            obj.rx = obj.width / 2;
                                        }
                                        break;
                                }
                                obj.setCoords();
                            }
                        });
                    }
                    this._tlweCanvasFabric.renderAll();
                    //this._updateSelectionRuler();
                };
                ;
                /*
                *   @private
                *   Evento fabric object:selected
                */
                ThermalLabelEditor.prototype._canvasObjectSelected = function (options) {
                    /* Guarda en un buffer los elementos que estan seleccionados */
                    this._selObjLT = new fabric.Point(options.target.oCoords.tl.x, options.target.oCoords.tl.y);
                    this._selected_objects = options;
                    this._selected_objects.target.thermal_label_object.propertyChanged = this.selectionItemPropertyChanged;
                    if (this._selected_objects.target.thermal_label_object)
                        this._updateGroup(this._selected_objects.target.thermal_label_object._guid);
                    this._updateSelectionRuler();
                    this.selectionChanged();
                };
                ;
                /*
                *   @private
                *   Evento fabric selection:cleared
                */
                ThermalLabelEditor.prototype._canvasSelectionCleared = function (options) {
                    /*  Limpia el buffer de elementos seleccionados */
                    this._selected_objects = null;
                    this._ruler.api.setHighlightZoneX({ pos: 0, size: 0 });
                    this._ruler.api.setHighlightZoneY({ pos: 0, size: 0 });
                    this.selectionChanged();
                };
                ;
                ThermalLabelEditor.prototype._setCanvasBackground = function () {
                    var UnitUtils = Neodynamic.Web.Utils.UnitUtils;
                    var self = this;
                    $(self._tlweBackgroundCanvas).css('border-style', 'solid').css('border-width', 1).css('border-color', this.getStyleValue("--label-document-frame-border-color")).
                        css('border-radius', this.getStyleValue("--label-document-frame-corner-radius")).css('background-repeat', 'no-repeat').css('background-position', 'center');
                    this._tlweBackgroundCanvasFabric = new fabric.StaticCanvas(self._tlweBackgroundCanvas, { backgroundColor: self.getStyleValue("--label-document-frame-background-color") });
                    //$(self._tlweCanvas).css('background-color', this.getStyleValue("--label-document-frame-background-color")).css('border-style', 'solid').css('border-width', 1).css('border-color', this.getStyleValue("--label-document-frame-border-color")).
                    //    css('border-radius', this.getStyleValue("--label-document-frame-corner-radius")).css('background-repeat', 'no-repeat').css('background-position', 'center');
                    var designBgImgSrc = self.getStyleValue("--label-document-frame-background-image").replace(/"/g, '');
                    if (this._tl.design_background_image && this._tl.design_background_image.length > 0) {
                        designBgImgSrc = this._tl.design_background_image;
                    }
                    if (designBgImgSrc && designBgImgSrc.length > 0 && designBgImgSrc.trim() != "none") {
                        var designBgImg = new Image();
                        designBgImg.onload = function () {
                            var f_img = new fabric.Image(designBgImg, {});
                            self._tlweBackgroundCanvasFabric.setBackgroundImage(f_img);
                            self._tlweBackgroundCanvasFabric.renderAll();
                        };
                        designBgImg.src = ((this._tl.design_background_image && this._tl.design_background_image.length > 0) ? "data:image/png;base64," : "") + designBgImgSrc;
                    }
                    else if (this._tl.pages && this._tl.pages.length > 0) {
                        for (var i = 0; i < this._tl.pages.length; i++) {
                            var tlp = this._tl.pages[i];
                            var rectPage = new fabric.RoundedRect();
                            rectPage.left = UnitUtils.convertUnitToPixel(tlp.x * this._zoom, this._tl.unit_type);
                            rectPage.top = UnitUtils.convertUnitToPixel(tlp.y * this._zoom, this._tl.unit_type);
                            rectPage.width = UnitUtils.convertUnitToPixel(tlp.width * this._zoom, this._tl.unit_type);
                            rectPage.height = UnitUtils.convertUnitToPixel(tlp.height * this._zoom, this._tl.unit_type);
                            rectPage.fill = this._tlweBackgroundCanvasFabric.backgroundColor;
                            rectPage.stroke = this.getStyleValue("--label-document-frame-border-color");
                            rectPage.StrokeWidth = 1;
                            rectPage.rtl = rectPage.rtr = rectPage.rbl = rectPage.rbr = parseFloat(this.getStyleValue("--label-document-frame-corner-radius"));
                            rectPage.selectable = false;
                            this._tlweBackgroundCanvasFabric.add(rectPage);
                        }
                        $(self._tlweBackgroundCanvas).css('border-width', 0);
                        this._tlweBackgroundCanvasFabric.setBackgroundColor('transparent');
                    }
                    else if (this._tl.margin &&
                        (this._tl.margin.left > 0 ||
                            this._tl.margin.top > 0 ||
                            this._tl.margin.bottom > 0 ||
                            this._tl.margin.right > 0)) {
                        var marginPage = new fabric.RoundedRect();
                        marginPage.left = 0;
                        marginPage.top = 0;
                        marginPage.width = UnitUtils.convertUnitToPixel(this._tl.width * this._zoom, this._tl.unit_type);
                        marginPage.height = UnitUtils.convertUnitToPixel(this._tl.height * this._zoom, this._tl.unit_type);
                        marginPage.fill = this.getStyleValue("--label-document-margin-color");
                        marginPage.stroke = this.getStyleValue("--label-document-frame-border-color");
                        marginPage.StrokeWidth = 1;
                        marginPage.rtl = marginPage.rtr = marginPage.rbl = marginPage.rbr = parseFloat(this.getStyleValue("--label-document-frame-corner-radius"));
                        marginPage.selectable = false;
                        this._tlweBackgroundCanvasFabric.add(marginPage);
                        var workPage = new fabric.RoundedRect();
                        workPage.left = UnitUtils.convertUnitToPixel(this._tl.margin.left * this._zoom, this._tl.unit_type);
                        workPage.top = UnitUtils.convertUnitToPixel(this._tl.margin.top * this._zoom, this._tl.unit_type);
                        workPage.width = UnitUtils.convertUnitToPixel((this._tl.width - this._tl.margin.left - this._tl.margin.right) * this._zoom, this._tl.unit_type);
                        workPage.height = UnitUtils.convertUnitToPixel((this._tl.height - this._tl.margin.top - this._tl.margin.bottom) * this._zoom, this._tl.unit_type);
                        workPage.fill = this._tlweBackgroundCanvasFabric.backgroundColor;
                        workPage.stroke = this.getStyleValue("--label-document-frame-border-color");
                        workPage.StrokeWidth = 1;
                        workPage.rtl = workPage.rtr = workPage.rbl = workPage.rbr = parseFloat(this.getStyleValue("--label-document-frame-corner-radius"));
                        workPage.selectable = false;
                        this._tlweBackgroundCanvasFabric.add(workPage);
                        $(self._tlweBackgroundCanvas).css('border-width', 0);
                        this._tlweBackgroundCanvasFabric.setBackgroundColor('transparent');
                    }
                    this._tlweBackgroundCanvasFabric.renderAll();
                };
                ;
                /*
                *   @private
                *   Construye el grid de fondo
                */
                ThermalLabelEditor.prototype._buildGrids = function (size, color) {
                    this._setCanvasBackground();
                    var _strokeDashArray = [];
                    if (this._grid_type == Neodynamic.Web.Editor.GridType.Dots)
                        _strokeDashArray = [1, size - 1];
                    /* Verticales */
                    for (var i = 0; i < (this._tlweBackgroundCanvas.width / size); i++) {
                        this._tlweBackgroundCanvasFabric.add(new fabric.Line([i * size, 0, i * size, this._tlweBackgroundCanvas.height], { stroke: this.getStyleValue('--grid-color'), selectable: false, strokeDashArray: _strokeDashArray }));
                    }
                    /* Horizontales */
                    for (var i = 0; i < (this._tlweBackgroundCanvas.height / size); i++) {
                        this._tlweBackgroundCanvasFabric.add(new fabric.Line([0, i * size, this._tlweBackgroundCanvas.width, i * size], { stroke: this.getStyleValue('--grid-color'), selectable: false, strokeDashArray: _strokeDashArray }));
                    }
                };
                ;
                ThermalLabelEditor.prototype._clearGrids = function () {
                    this._setCanvasBackground();
                    //this._tlweBackgroundCanvasFabric.clear();
                    //this._tlweBackgroundCanvasFabric.backgroundColor = this.getStyleValue("--label-document-frame-background-color");
                    //this._tlweBackgroundCanvasFabric.renderAll();
                };
                ;
                /*
                *   Bloquea el movimiento/escalamiento/rotacion de los elementos seleccionados
                */
                ThermalLabelEditor.prototype.lockSelectedItems = function () {
                    if (this._selected_objects == null)
                        return;
                    var _l = function (p) {
                        p.lockMovementX = true;
                        p.lockMovementY = true;
                        p.lockScalingX = true;
                        p.lockScalingY = true;
                        p.lockRotation = true;
                    };
                    if (this._selected_objects.target.thermal_label_object && this._selected_objects.target.thermal_label_object.group_name && this._selected_objects.target.thermal_label_object.group_name.trim() != '') {
                        var gn = this._selected_objects.target.thermal_label_object.group_name;
                        var self = this;
                        this._tlweCanvasFabric.getObjects().map(function (obj) {
                            if (obj.thermal_label_object &&
                                obj.thermal_label_object.group_name == gn &&
                                obj.thermal_label_object.editable &&
                                obj.thermal_label_object.visible) {
                                _l(obj);
                                obj.thermal_label_object.locked = true;
                            }
                        });
                    }
                    else {
                        _l(this._selected_objects.target);
                    }
                    this._tlweCanvasFabric.renderAll();
                    this.selectionChanged();
                    this.saveCurrentLabelCanvasState();
                };
                ;
                /*
                *   Desbloquea el movimiento/escalamiento/rotacion de los elementos seleccionados
                */
                ThermalLabelEditor.prototype.unlockSelectedItems = function () {
                    if (this._selected_objects == null)
                        return;
                    var _u = function (p) {
                        p.lockMovementX = false;
                        p.lockMovementY = false;
                        p.lockScalingX = false;
                        p.lockScalingY = false;
                        p.lockRotation = false;
                    };
                    if (this._selected_objects.target.thermal_label_object && this._selected_objects.target.thermal_label_object.group_name && this._selected_objects.target.thermal_label_object.group_name.trim() != '') {
                        var gn = this._selected_objects.target.thermal_label_object.group_name;
                        var self = this;
                        this._tlweCanvasFabric.getObjects().map(function (obj) {
                            if (obj.thermal_label_object &&
                                obj.thermal_label_object.group_name == gn &&
                                obj.thermal_label_object.editable &&
                                obj.thermal_label_object.visible) {
                                _u(obj);
                                obj.thermal_label_object.locked = false;
                            }
                        });
                    }
                    else {
                        _u(this._selected_objects.target);
                    }
                    this._tlweCanvasFabric.renderAll();
                    this.selectionChanged();
                    this.saveCurrentLabelCanvasState();
                };
                ;
                /*
                *   Adelanta el objeto seleccionado
                */
                ThermalLabelEditor.prototype.bringForward = function () {
                    if (this._selected_objects == null)
                        return;
                    if (this._selected_objects.target.thermal_label_object && this._selected_objects.target.thermal_label_object.group_name && this._selected_objects.target.thermal_label_object.group_name.trim() != '') {
                        var gn = this._selected_objects.target.thermal_label_object.group_name;
                        var self = this;
                        this._tlweCanvasFabric.getObjects().map(function (obj) {
                            if (obj.thermal_label_object &&
                                obj.thermal_label_object.group_name == gn &&
                                obj.thermal_label_object.editable &&
                                obj.thermal_label_object.visible) {
                                obj.bringForward(self._tlweCanvasFabric);
                                var element_idx = self._tl.items.indexOf(obj.thermal_label_object);
                                if (element_idx != self._tl.items.length - 1)
                                    self._tl.items[element_idx + 1] = self._tl.items.splice(element_idx, 1, self._tl.items[element_idx + 1])[0];
                            }
                        });
                    }
                    else {
                        this._selected_objects.target.bringForward(this._tlweCanvasFabric);
                        var element_idx = this._tl.items.indexOf(this.current_selection);
                        if (element_idx != this._tl.items.length - 1)
                            this._tl.items[element_idx + 1] = this._tl.items.splice(element_idx, 1, this._tl.items[element_idx + 1])[0];
                    }
                    this._tlweCanvasFabric.renderAll();
                    this.saveCurrentLabelCanvasState();
                };
                ;
                /*
                *   Trae al frente el objecto seleccionado
                */
                ThermalLabelEditor.prototype.bringToFront = function () {
                    if (this._selected_objects == null)
                        return;
                    if (this._selected_objects.target.thermal_label_object && this._selected_objects.target.thermal_label_object.group_name && this._selected_objects.target.thermal_label_object.group_name.trim() != '') {
                        var gn = this._selected_objects.target.thermal_label_object.group_name;
                        var self = this;
                        this._tlweCanvasFabric.getObjects().map(function (obj) {
                            if (obj.thermal_label_object &&
                                obj.thermal_label_object.group_name == gn &&
                                obj.thermal_label_object.editable &&
                                obj.thermal_label_object.visible) {
                                obj.bringToFront(self._tlweCanvasFabric);
                                var element_idx = self._tl.items.indexOf(obj.thermal_label_object);
                                self._tl.items.push(self._tl.items.splice(element_idx, 1)[0]);
                            }
                        });
                    }
                    else {
                        this._selected_objects.target.bringToFront(this._tlweCanvasFabric);
                        var element_idx = this._tl.items.indexOf(this.current_selection);
                        this._tl.items.push(this._tl.items.splice(element_idx, 1)[0]);
                    }
                    this._tlweCanvasFabric.renderAll();
                    this.saveCurrentLabelCanvasState();
                };
                ;
                /*
                *   Envia atras el objeto seleccionado
                */
                ThermalLabelEditor.prototype.sendBackward = function () {
                    if (this._selected_objects == null)
                        return;
                    if (this._selected_objects.target.thermal_label_object && this._selected_objects.target.thermal_label_object.group_name && this._selected_objects.target.thermal_label_object.group_name.trim() != '') {
                        var gn = this._selected_objects.target.thermal_label_object.group_name;
                        var self = this;
                        this._tlweCanvasFabric.getObjects().map(function (obj) {
                            if (obj.thermal_label_object &&
                                obj.thermal_label_object.group_name == gn &&
                                obj.thermal_label_object.editable &&
                                obj.thermal_label_object.visible) {
                                obj.sendBackwards(self._tlweCanvasFabric);
                                var element_idx = self._tl.items.indexOf(obj.thermal_label_object);
                                if (element_idx != 0)
                                    self._tl.items[element_idx - 1] = self._tl.items.splice(element_idx, 1, self._tl.items[element_idx - 1])[0];
                            }
                        });
                    }
                    else {
                        this._selected_objects.target.sendBackwards(this._tlweCanvasFabric);
                        var element_idx = this._tl.items.indexOf(this.current_selection);
                        if (element_idx != 0)
                            this._tl.items[element_idx - 1] = this._tl.items.splice(element_idx, 1, this._tl.items[element_idx - 1])[0];
                    }
                    this._tlweCanvasFabric.renderAll();
                    this.saveCurrentLabelCanvasState();
                };
                ;
                /*
                *   Envia al fondo el objeto seleccionado
                */
                ThermalLabelEditor.prototype.sendToBack = function () {
                    if (this._selected_objects == null)
                        return;
                    if (this._selected_objects.target.thermal_label_object && this._selected_objects.target.thermal_label_object.group_name && this._selected_objects.target.thermal_label_object.group_name.trim() != '') {
                        var gn = this._selected_objects.target.thermal_label_object.group_name;
                        var self = this;
                        this._tlweCanvasFabric.getObjects().map(function (obj) {
                            if (obj.thermal_label_object &&
                                obj.thermal_label_object.group_name == gn &&
                                obj.thermal_label_object.editable &&
                                obj.thermal_label_object.visible) {
                                obj.sendToBack(self._tlweCanvasFabric);
                                var element_idx = self._tl.items.indexOf(obj.thermal_label_object);
                                self._tl.items.unshift(self._tl.items.splice(element_idx, 1)[0]);
                            }
                        });
                    }
                    else {
                        this._selected_objects.target.sendToBack(this._tlweCanvasFabric);
                        var element_idx = this._tl.items.indexOf(this.current_selection);
                        this._tl.items.unshift(this._tl.items.splice(element_idx, 1)[0]);
                    }
                    this._tlweCanvasFabric.renderAll();
                    this.saveCurrentLabelCanvasState();
                };
                ;
                /*
                *   Actualiza las propiedades del objecto seleccionado y refresca el canvas
                */
                ThermalLabelEditor.prototype.updateSelectionItemsProperties = function () {
                    if (this.current_selection)
                        this.current_selection.refresh();
                };
                ;
                /*
                *   Elimina los items seleccionados
                 */
                ThermalLabelEditor.prototype.deleteSelectedItems = function () {
                    if (!this.current_selection)
                        return;
                    var cancel = !this.currentSelectionBeforeDelete();
                    if (!cancel) {
                        var object = this._tlweCanvasFabric.getActiveObject();
                        var gn = object.thermal_label_object.group_name.trim();
                        this._tl.items.splice(this._tl.items.indexOf(object.thermal_label_object), 1);
                        object.remove();
                        var self = this;
                        this._tlweCanvasFabric.getObjects().map(function (obj) {
                            if (obj.thermal_label_object &&
                                gn != '' &&
                                obj.thermal_label_object.group_name == gn &&
                                obj.thermal_label_object.editable &&
                                obj.thermal_label_object.visible) {
                                self._tl.items.splice(self._tl.items.indexOf(obj.thermal_label_object), 1);
                                obj.remove();
                            }
                        });
                        this._tlweCanvasFabric.renderAll();
                        this.currentSelectionAfterDelete();
                        this.saveCurrentLabelCanvasState();
                    }
                };
                ;
                /*
                *   Elimina todos los items
                */
                ThermalLabelEditor.prototype.deleteAll = function () {
                    //Eliminar todos los elementos desde fabric
                    this._tlweCanvasFabric.clear();
                    //Eliminar todos los elementos desde TLE
                    //TEST Se elimina el buffer de objetos del canvas y se usa directamente la referencia a ThermalLabel  
                    //this._canvas_items = [];
                    this._tl.items = [];
                    this._tlweCanvasFabric.renderAll();
                    this.saveCurrentLabelCanvasState();
                };
                ;
                ThermalLabelEditor.prototype.addItem = function (item) {
                    var UnitUtils = Neodynamic.Web.Utils.UnitUtils;
                    var curUnit = this._tl.unit_type;
                    var w = 1;
                    if (item.width)
                        w = UnitUtils.convertUnitToPixel(item.width, curUnit);
                    var h = 1;
                    if (item.height)
                        h = UnitUtils.convertUnitToPixel(item.height, curUnit);
                    if (item instanceof Neodynamic.SDK.Printing.RFIDTagItem && this._rfid_tag_image_file_name) {
                        w = 200;
                        h = 200;
                    }
                    item._fabric_item.set({
                        top: UnitUtils.convertUnitToPixel(item.y, curUnit),
                        left: UnitUtils.convertUnitToPixel(item.x, curUnit),
                        width: w,
                        height: h
                    });
                    item.unit_type = this._tl.unit_type;
                    this._tlweCanvasFabric.add(item._fabric_item);
                    this._tlweCanvasFabric.setActiveObject(item._fabric_item);
                    item.onError = this._onError.bind(this);
                    this._tl.items.push(item);
                    item._fabric_item.scaleX =
                        item._fabric_item.scaleY = this._zoom;
                    item._fabric_item.setCoords();
                    //item._updateFromCanvas();
                    item.refresh();
                    //this._tlweCanvasFabric.renderAll();
                    this.saveCurrentLabelCanvasState();
                };
                ;
                /*
                *   Guarda el documento
                */
                ThermalLabelEditor.prototype.save = function (file_name, custom_url, format) {
                    /*
                    *   Si el programador no especifica una URL para otro Handler, usar el predeterminado
                    */
                    if (!custom_url) {
                        if (ThermalLabelEditor.websiteRootAbsoluteUrl)
                            custom_url = ThermalLabelEditor.websiteRootAbsoluteUrl + "/" + ThermalLabelEditor.thermalLabelWebEditorControllerName + "?_=" + new Date().getTime();
                        else
                            custom_url = $(location).attr('protocol') + "//" + $(location).attr('host') + "/" + ThermalLabelEditor.thermalLabelWebEditorControllerName + "?_=" + new Date().getTime();
                    }
                    var templateFormat = format ? format : 'xml';
                    var form = $("<form action='" + custom_url + "' method='post'></form>");
                    form.append("<input name='Action' value='Save' />");
                    form.append("<input name='OutFormat' value='" + templateFormat + "' />");
                    form.append("<input name='DataBase64' value='" + this._b64Encode(JSON.stringify(this._tl._getProperties())) + "' />");
                    if (file_name)
                        form.append("<input name='FileName' value='" + file_name + "' />");
                    //In firefox, the form has to be in the body at the moment of submit
                    $("body").append(form);
                    form.submit();
                    form.remove();
                };
                ThermalLabelEditor.prototype.print = function (custom_url, data_source_format, data_source) {
                    //1. Save label to the server cache (By default Application cache) and get the LabelID
                    //2. Get the LabelID and pass it to the TLClientPrint
                    var _this = this;
                    var rootUrl = $(location).attr('protocol') + "//" + $(location).attr('host');
                    if (ThermalLabelEditor.websiteRootAbsoluteUrl)
                        rootUrl = ThermalLabelEditor.websiteRootAbsoluteUrl;
                    if (!custom_url) {
                        custom_url = rootUrl + "/" + ThermalLabelEditor.thermalLabelWebEditorControllerName + "?_=" + new Date().getTime();
                    }
                    var ds = null;
                    if (data_source_format && data_source) {
                        ds = data_source_format + ":" + this._b64Encode(data_source);
                    }
                    $.ajax({
                        url: custom_url,
                        type: "POST",
                        data: { Action: "Print", Data: JSON.stringify(this._tl._getProperties()), DataSource: ds },
                        async: false
                    }).
                        done(function (data) {
                        var tlweURL = rootUrl + "/" + ThermalLabelEditor.thermalLabelWebEditorControllerName + "?webPrintJob=t&LabelID=" + data;
                        if (custom_url) {
                            tlweURL = custom_url + (custom_url.indexOf('?') > 0 ? "&" : "?") + "webPrintJob=t&LabelID=" + data;
                        }
                        //This code is for launching TLClientPrint at the client machine
                        var e_id = 'id_' + new Date().getTime();
                        if (window['chrome']) {
                            $('body').append('<a id="' + e_id + '"></a>');
                            $('#' + e_id).attr('href', 'tlprint:' + tlweURL);
                            var a = $('a#' + e_id)[0];
                            var evObj = document.createEvent('MouseEvents');
                            evObj.initEvent('click', true, true);
                            a.dispatchEvent(evObj);
                        }
                        else {
                            $('body').append('<iframe name="' + e_id + '" id="' + e_id + '" width="1" height="1" style="visibility:hidden;position:absolute" />');
                            $('#' + e_id).attr('src', 'tlprint:' + tlweURL);
                        }
                        setTimeout(function () { $('#' + e_id).remove(); }, 5000);
                        //END CODE
                    }).
                        fail(function (data) {
                        _this._onError("print: " + data.responseText, "ThermalLabelEditor");
                    });
                };
                ThermalLabelEditor.prototype._getLabelTemplate = function (custom_url, format, callback) {
                    var _this = this;
                    /*
                    *   Si el programador no especifica una URL para otro Handler, usar el predeterminado
                    */
                    if (!custom_url) {
                        if (ThermalLabelEditor.websiteRootAbsoluteUrl)
                            custom_url = ThermalLabelEditor.websiteRootAbsoluteUrl + "/" + ThermalLabelEditor.thermalLabelWebEditorControllerName + "?_=" + new Date().getTime();
                        else
                            custom_url = $(location).attr('protocol') + "//" + $(location).attr('host') + "/" + ThermalLabelEditor.thermalLabelWebEditorControllerName + "?_=" + new Date().getTime();
                    }
                    var templateFormat = format ? format : 'xml';
                    var action = templateFormat == 'xml' ? 'getXmlTemplate' : 'getJsonTemplate';
                    var labelTemplate;
                    $.ajax({
                        url: custom_url,
                        type: "POST",
                        data: { Action: "GetLabelTemplate", OutFormat: templateFormat, Data: JSON.stringify(this._tl._getProperties()) },
                        async: (callback ? true : false)
                    }).done(function (data) {
                        if (callback) {
                            callback(data);
                        }
                        else {
                            labelTemplate = data;
                        }
                    }).
                        fail(function (data) {
                        _this._onError(action + ": " + data.responseText, "ThermalLabelEditor");
                    });
                    if (!callback)
                        return labelTemplate;
                };
                ThermalLabelEditor.prototype.getXmlTemplate = function (custom_url, callback) {
                    return this._getLabelTemplate(custom_url, 'xml', callback);
                };
                ThermalLabelEditor.prototype.getJsonTemplate = function (custom_url, callback) {
                    return this._getLabelTemplate(custom_url, 'json', callback);
                };
                ThermalLabelEditor.prototype.getSupportedExpressions = function (custom_url, callback) {
                    var _this = this;
                    /*
                    *   Si el programador no especifica una URL para otro Handler, usar el predeterminado
                    */
                    if (!custom_url) {
                        if (ThermalLabelEditor.websiteRootAbsoluteUrl)
                            custom_url = ThermalLabelEditor.websiteRootAbsoluteUrl + "/" + ThermalLabelEditor.thermalLabelWebEditorControllerName + "?_=" + new Date().getTime();
                        else
                            custom_url = $(location).attr('protocol') + "//" + $(location).attr('host') + "/" + ThermalLabelEditor.thermalLabelWebEditorControllerName + "?_=" + new Date().getTime();
                    }
                    var supportedExpressions;
                    $.ajax({
                        url: custom_url,
                        type: "POST",
                        data: { Action: "Expressions" },
                        async: (callback ? true : false)
                    }).done(function (data) {
                        if (callback) {
                            callback(JSON.parse(data));
                        }
                        else {
                            supportedExpressions = JSON.parse(data);
                        }
                    }).
                        fail(function (data) {
                        _this._onError("getSupportedExpressions: " + data.responseText, "ThermalLabelEditor");
                    });
                    if (!callback)
                        return supportedExpressions;
                };
                ThermalLabelEditor.prototype.getLabelPreview = function (xml_label_template, custom_url, out_format, data_source_format, data_source, callback) {
                    var _this = this;
                    /*
                    *   Si el programador no especifica una URL para otro Handler, usar el predeterminado
                    */
                    if (!custom_url) {
                        if (ThermalLabelEditor.websiteRootAbsoluteUrl)
                            custom_url = ThermalLabelEditor.websiteRootAbsoluteUrl + "/" + ThermalLabelEditor.thermalLabelWebEditorControllerName + "?_=" + new Date().getTime();
                        else
                            custom_url = $(location).attr('protocol') + "//" + $(location).attr('host') + "/" + ThermalLabelEditor.thermalLabelWebEditorControllerName + "?_=" + new Date().getTime();
                    }
                    var ds = null;
                    if (data_source_format && data_source) {
                        ds = data_source_format + ":" + this._b64Encode(data_source);
                    }
                    var labelPreview;
                    $.ajax({
                        url: custom_url,
                        type: "POST",
                        data: { Action: "GetLabelPreview", Data: (xml_label_template ? '' : JSON.stringify(this._tl._getProperties())), XmlTemplate: (xml_label_template ? encodeURIComponent(xml_label_template) : ''), OutFormat: out_format, DataSource: ds },
                        async: (callback ? true : false)
                    }).done(function (data) {
                        if (callback) {
                            callback(data);
                        }
                        else {
                            labelPreview = data;
                        }
                    }).
                        fail(function (data) {
                        _this._onError("getLabelPreview: " + data.responseText, "ThermalLabelEditor");
                    });
                    if (!callback)
                        return labelPreview;
                };
                ThermalLabelEditor.prototype.getLabelThumbnail = function (size, xml_label_template, custom_url, callback) {
                    var _this = this;
                    /*
                    *   Si el programador no especifica una URL para otro Handler, usar el predeterminado
                    */
                    if (!custom_url) {
                        if (ThermalLabelEditor.websiteRootAbsoluteUrl)
                            custom_url = ThermalLabelEditor.websiteRootAbsoluteUrl + "/" + ThermalLabelEditor.thermalLabelWebEditorControllerName + "?_=" + new Date().getTime();
                        else
                            custom_url = $(location).attr('protocol') + "//" + $(location).attr('host') + "/" + ThermalLabelEditor.thermalLabelWebEditorControllerName + "?_=" + new Date().getTime();
                    }
                    var labelThumbnail;
                    $.ajax({
                        url: custom_url,
                        type: "POST",
                        data: { Action: "GetLabelThumbnail", Data: (xml_label_template ? '' : JSON.stringify(this._tl._getProperties())), Size: size, XmlTemplate: (xml_label_template ? encodeURIComponent(xml_label_template) : '') },
                        async: (callback ? true : false)
                    }).done(function (data) {
                        if (callback) {
                            callback(data);
                        }
                        else {
                            labelThumbnail = data;
                        }
                    }).
                        fail(function (data) {
                        _this._onError("getLabelThumbnail: " + data.responseText, "ThermalLabelEditor");
                    });
                    if (!callback)
                        return labelThumbnail;
                };
                ThermalLabelEditor.prototype.getPrinterCommands = function (xml_label_template, custom_url, print_language, print_orientation, copies, replicates, dpi, data_source_format, data_source, callback) {
                    var _this = this;
                    /*
                    *   Si el programador no especifica una URL para otro Handler, usar el predeterminado
                    */
                    if (!custom_url) {
                        if (ThermalLabelEditor.websiteRootAbsoluteUrl)
                            custom_url = ThermalLabelEditor.websiteRootAbsoluteUrl + "/" + ThermalLabelEditor.thermalLabelWebEditorControllerName + "?_=" + new Date().getTime();
                        else
                            custom_url = $(location).attr('protocol') + "//" + $(location).attr('host') + "/" + ThermalLabelEditor.thermalLabelWebEditorControllerName + "?_=" + new Date().getTime();
                    }
                    var ds = null;
                    if (data_source_format && data_source) {
                        ds = data_source_format + ":" + this._b64Encode(data_source);
                    }
                    var labelCommands;
                    $.ajax({
                        url: custom_url,
                        type: "POST",
                        data: { Action: "GetPrinterCommands", Data: (xml_label_template ? '' : JSON.stringify(this._tl._getProperties())), XmlTemplate: (xml_label_template ? encodeURIComponent(xml_label_template) : ''), PrintOrientation: print_orientation, DataSource: ds, Copies: copies, Replicates: replicates, Dpi: dpi, PrinterLang: print_language },
                        async: (callback ? true : false)
                    }).done(function (data) {
                        if (callback) {
                            callback(data);
                        }
                        else {
                            labelCommands = data;
                        }
                    }).
                        fail(function (data) {
                        _this._onError("getPrinterCommands: " + data.responseText, "ThermalLabelEditor");
                    });
                    if (!callback)
                        return labelCommands;
                };
                ThermalLabelEditor.prototype.getLabelAsPdf = function (xml_label_template, custom_url, pdfMetadata, dpi, data_source_format, data_source, callback) {
                    var _this = this;
                    /*
                    *   Si el programador no especifica una URL para otro Handler, usar el predeterminado
                    */
                    if (!custom_url) {
                        if (ThermalLabelEditor.websiteRootAbsoluteUrl)
                            custom_url = ThermalLabelEditor.websiteRootAbsoluteUrl + "/" + ThermalLabelEditor.thermalLabelWebEditorControllerName + "?_=" + new Date().getTime();
                        else
                            custom_url = $(location).attr('protocol') + "//" + $(location).attr('host') + "/" + ThermalLabelEditor.thermalLabelWebEditorControllerName + "?_=" + new Date().getTime();
                    }
                    var ds = null;
                    if (data_source_format && data_source) {
                        ds = data_source_format + ":" + this._b64Encode(data_source);
                    }
                    var pdfData = new Neodynamic.SDK.Printing.PdfMetadata();
                    if (pdfMetadata)
                        pdfData = pdfMetadata;
                    var labelPreview;
                    $.ajax({
                        url: custom_url,
                        type: "POST",
                        data: { Action: "GetLabelAsPdf", Data: (xml_label_template ? '' : JSON.stringify(this._tl._getProperties())), XmlTemplate: (xml_label_template ? encodeURIComponent(xml_label_template) : ''), DataSource: ds, Dpi: dpi, PdfAuthor: pdfData.author, PdfProducer: pdfData.producer, PdfCreator: pdfData.creator, PdfSubject: pdfData.subject, PdfTitle: pdfData.title, PdfUseVectorDrawing: pdfData.use_vector_drawing },
                        async: (callback ? true : false)
                    }).done(function (data) {
                        if (callback) {
                            callback(data);
                        }
                        else {
                            labelPreview = data;
                        }
                    }).
                        fail(function (data) {
                        _this._onError("getLabelAsPdf: " + data.responseText, "ThermalLabelEditor");
                    });
                    if (!callback)
                        return labelPreview;
                };
                ThermalLabelEditor.prototype.clipboardCopy = function () {
                    if (this.current_selection) {
                        this._clipboardBuffer = [];
                        if (this.current_selection.group_name && this.current_selection.group_name.trim() != '') {
                            var self = this;
                            this.getItemsInGroup(this.current_selection.group_name).map(function (obj) {
                                self._clipboardBuffer.push(obj);
                            });
                        }
                        else {
                            this._clipboardBuffer.push(this.current_selection);
                        }
                        this._objFromCut = false;
                    }
                    this._pasteCounter = 1;
                };
                ThermalLabelEditor.prototype.clipboardCut = function () {
                    if (this.current_selection) {
                        this._clipboardBuffer = [];
                        if (this.current_selection.group_name && this.current_selection.group_name.trim() != '') {
                            var self = this;
                            this.getItemsInGroup(this.current_selection.group_name).map(function (obj) {
                                self._clipboardBuffer.push(obj);
                            });
                        }
                        else {
                            this._clipboardBuffer.push(this.current_selection);
                        }
                        this.deleteSelectedItems();
                        this._pasteCounter = 0;
                        this._objFromCut = true;
                        this.saveCurrentLabelCanvasState();
                    }
                };
                ThermalLabelEditor.prototype.clipboardPaste = function () {
                    if (this._clipboardBuffer && this._clipboardBuffer.length > 0) {
                        var groups = {};
                        for (var i = 0; i < this._clipboardBuffer.length; i++) {
                            //clone obj
                            var itm = this._objFromCut ? this._clipboardBuffer[i] : Neodynamic.Web.Utils.Cloner.cloneItem(this._clipboardBuffer[i]);
                            if (!this._objFromCut) {
                                // if item is part of a group, create a new one
                                if (itm.group_name && itm.group_name.trim() != '') {
                                    if (!groups[itm.group_name]) {
                                        groups[itm.group_name] = 'G' + Date.now();
                                    }
                                    itm.group_name = groups[itm.group_name];
                                }
                                itm._updateToCanvas();
                            }
                            //move item a bit
                            var UnitUtils = Neodynamic.Web.Utils.UnitUtils;
                            var curUnit = this._tl.unit_type;
                            itm.x += UnitUtils.convertPixelToUnit(10 * this._pasteCounter, curUnit);
                            itm.y += UnitUtils.convertPixelToUnit(10 * this._pasteCounter, curUnit);
                            //add new item to label
                            itm.onError = this._onError.bind(this);
                            this.addItem(itm);
                            this.newItemCreated();
                            if (this._objFromCut) {
                                this._clipboardBuffer = [];
                                this._objFromCut = false;
                            }
                            if (itm instanceof Neodynamic.SDK.Printing.RFIDTagItem) {
                                itm._image.src = this._rfid_tag_image_file_name;
                                this._tlweCanvasFabric.renderAll();
                            }
                            else if (itm instanceof Neodynamic.SDK.Printing.RepeaterItem) {
                                itm._color = this.getStyleValue("--repeater-item-color");
                                this._tlweCanvasFabric.renderAll();
                            }
                        }
                        this._pasteCounter++;
                        this.saveCurrentLabelCanvasState();
                    }
                };
                ThermalLabelEditor.prototype.moveSelectedItems = function (deltaX, deltaY) {
                    var gn = this.current_selection.group_name.trim();
                    if (gn && gn.length > 0) {
                        var f = false;
                        this._tlweCanvasFabric.getObjects().map(function (obj) {
                            if (obj.thermal_label_object &&
                                gn != '' &&
                                obj.thermal_label_object.group_name == gn &&
                                obj.thermal_label_object.editable &&
                                obj.thermal_label_object.visible) {
                                obj.thermal_label_object.x += deltaX;
                                obj.thermal_label_object.y += deltaY;
                                if (obj.thermal_label_object._updateToCanvas) {
                                    obj.thermal_label_object._updateToCanvas();
                                    if (obj.thermal_label_object._fabric_item.canvas) {
                                        obj.thermal_label_object._fabric_item.canvas.renderAll();
                                    }
                                    f = true;
                                }
                            }
                        });
                        if (f)
                            this.saveCurrentLabelCanvasState();
                    }
                    else {
                        this.current_selection.x += deltaX;
                        this.current_selection.y += deltaY;
                        if (this.current_selection._updateToCanvas) {
                            this.current_selection._updateToCanvas();
                            if (this.current_selection._fabric_item.canvas) {
                                this.current_selection._fabric_item.canvas.renderAll();
                            }
                            this.saveCurrentLabelCanvasState();
                        }
                    }
                };
                Object.defineProperty(ThermalLabelEditor.prototype, "can_undo", {
                    get: function () {
                        return this._undoManager.canUndo;
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(ThermalLabelEditor.prototype, "can_redo", {
                    get: function () {
                        return this._undoManager.canRedo;
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ThermalLabelEditor.prototype.undo = function () {
                    if (this._undoManager.canUndo) {
                        this._updateLabelCanvasState(this._undoManager.undo());
                        if (this._tl.items) {
                            this._tl.items.forEach(function (x) {
                                x.refresh();
                            });
                        }
                    }
                };
                ;
                ThermalLabelEditor.prototype.redo = function () {
                    if (this._undoManager.canRedo) {
                        this._updateLabelCanvasState(this._undoManager.redo());
                        if (this._tl.items) {
                            this._tl.items.forEach(function (x) {
                                x.refresh();
                            });
                        }
                    }
                };
                ;
                ThermalLabelEditor.prototype._updateLabelCanvasState = function (state) {
                    if (state) {
                        this._undoRedo = true;
                        this.loadThermalLabel(state);
                        //notify user about the selection change NOTE: Already invoked from loadThermalLabel above
                        //this.selectionChanged();
                        //notify user about the change in the undo/redo state
                        this.undoStateChanged();
                    }
                };
                ThermalLabelEditor.prototype._getCurrentLabelCanvasState = function () {
                    return this.get_thermal_label;
                };
                ThermalLabelEditor.prototype.saveCurrentLabelCanvasState = function () {
                    //let tlClone = this._getCurrentLabelCanvasState().getCopy();
                    if (this._tl.items) {
                        this._tl.items.forEach(function (x) {
                            x._updateFromCanvas();
                        });
                    }
                    //console.log("ORIG: " + this._getCurrentLabelCanvasState().items[5].x);
                    this._undoManager.saveState(this._getCurrentLabelCanvasState());
                    //notify user about the change in the undo/redo state
                    this.undoStateChanged();
                };
                ThermalLabelEditor.prototype.startGroup = function () {
                    this._isGrouping = true;
                    this._itemsGuidsInGroup = [];
                    if (this.current_selection && this.current_selection._guid)
                        this._updateGroup(this.current_selection._guid);
                };
                ThermalLabelEditor.prototype.cancelGroup = function () {
                    this._isGrouping = false;
                    this._itemsGuidsInGroup = [];
                };
                ThermalLabelEditor.prototype._updateGroup = function (itemGuid) {
                    if (this._isGrouping) {
                        for (var i = 0; i < this._itemsGuidsInGroup.length; i++) {
                            if (this._itemsGuidsInGroup[i] == itemGuid)
                                return;
                        }
                        this._itemsGuidsInGroup.push(itemGuid);
                        this._tlweCanvasFabric.renderAll();
                    }
                };
                ThermalLabelEditor.prototype._isItemInGrouping = function (guid) {
                    for (var i = 0; i < this._itemsGuidsInGroup.length; i++) {
                        if (guid == this._itemsGuidsInGroup[i])
                            return true;
                    }
                    return false;
                };
                Object.defineProperty(ThermalLabelEditor.prototype, "items_in_started_group", {
                    get: function () {
                        return this._itemsGuidsInGroup ? this._itemsGuidsInGroup.length : 0;
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(ThermalLabelEditor.prototype, "group_started", {
                    get: function () {
                        return this._isGrouping;
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ThermalLabelEditor.prototype.createGroup = function () {
                    if (this._isGrouping && this._itemsGuidsInGroup && this._itemsGuidsInGroup.length > 0) {
                        var gn = 'G' + Date.now();
                        var self = this;
                        for (var i = 0; i < this._itemsGuidsInGroup.length; i++) {
                            this._tlweCanvasFabric.getObjects().map(function (obj) {
                                if (obj.thermal_label_object &&
                                    obj.thermal_label_object._guid == self._itemsGuidsInGroup[i]) {
                                    obj.thermal_label_object.group_name = gn;
                                }
                            });
                        }
                        this._isGrouping = false;
                        this._itemsGuidsInGroup = [];
                        this._tlweCanvasFabric.renderAll();
                        this.saveCurrentLabelCanvasState();
                    }
                };
                ThermalLabelEditor.prototype.unGroup = function () {
                    if (!this._isGrouping && this.current_selection) {
                        var self = this;
                        var gn = this.current_selection.group_name.trim();
                        this._tlweCanvasFabric.getObjects().map(function (obj) {
                            if (obj.thermal_label_object &&
                                gn != '' &&
                                obj.thermal_label_object.group_name == gn) {
                                obj.thermal_label_object.group_name = '';
                            }
                        });
                        this._isGrouping = false;
                        this._itemsGuidsInGroup = [];
                        this._tlweCanvasFabric.renderAll();
                        this.saveCurrentLabelCanvasState();
                    }
                };
                ThermalLabelEditor.prototype.getItemsInGroup = function (groupName, cloneItems) {
                    var group = [];
                    if (groupName && groupName.length > 0) {
                        this._tlweCanvasFabric.getObjects().map(function (obj) {
                            if (obj.thermal_label_object &&
                                obj.thermal_label_object.group_name == groupName &&
                                obj.thermal_label_object.editable &&
                                obj.thermal_label_object.visible) {
                                group.push((cloneItems && cloneItems == true) ? Neodynamic.Web.Utils.Cloner.cloneItem(obj.thermal_label_object) : obj.thermal_label_object);
                            }
                        });
                    }
                    return group;
                };
                // end grouping logic
                //events
                ThermalLabelEditor.prototype.newItemCreated = function () {
                };
                ThermalLabelEditor.prototype.currentSelectionBeforeDelete = function () {
                    var cancel = false;
                    return cancel;
                };
                ThermalLabelEditor.prototype.currentSelectionAfterDelete = function () {
                };
                ThermalLabelEditor.prototype.selectionChanged = function () {
                };
                ThermalLabelEditor.prototype.selectionItemPropertyChanged = function () {
                };
                ThermalLabelEditor.prototype.undoStateChanged = function () {
                };
                ThermalLabelEditor.prototype.onError = function (errMsg, className) { };
                ThermalLabelEditor.prototype._onError = function (errMsg, className) { this.onError(errMsg, className); };
                ThermalLabelEditor.websiteRootAbsoluteUrl = '';
                ThermalLabelEditor.thermalLabelWebEditorControllerName = '';
                return ThermalLabelEditor;
            }());
            Editor.ThermalLabelEditor = ThermalLabelEditor;
        })(Editor = Web.Editor || (Web.Editor = {}));
    })(Web = Neodynamic.Web || (Neodynamic.Web = {}));
})(Neodynamic || (Neodynamic = {}));
/// <reference path="../../sdk/printing/thermallabel.ts" />
var Neodynamic;
(function (Neodynamic) {
    var Web;
    (function (Web) {
        var Utils;
        (function (Utils) {
            var Cloner = /** @class */ (function () {
                function Cloner() {
                }
                Cloner.cloneThermalLabel = function (tl) {
                    var clone = new Neodynamic.SDK.Printing.ThermalLabel();
                    clone.unit_type = tl.unit_type;
                    clone.width = tl.width;
                    clone.height = tl.height;
                    clone.gap_length = tl.gap_length;
                    clone.is_continuous = tl.is_continuous;
                    clone.labels_horizontal_gap_length = tl.labels_horizontal_gap_length;
                    clone.labels_per_row = tl.labels_per_row;
                    clone.mark_length = tl.mark_length;
                    clone.offset_length = tl.offset_length;
                    clone.data_member = tl.data_member;
                    clone.data_source = tl.data_source;
                    clone.data_source_culture_info = tl.data_source_culture_info;
                    clone.print_speed = tl.print_speed;
                    clone.print_mirror = tl.print_mirror;
                    clone.cut_after_printing = tl.cut_after_printing;
                    clone.darkness = tl.darkness;
                    clone.sheet_labels_width = tl.sheet_labels_width;
                    clone.sheet_labels_height = tl.sheet_labels_height;
                    clone.sheet_labels_count = tl.sheet_labels_count;
                    clone.sheet_labels_margin = new Neodynamic.SDK.Printing.FrameThickness(tl.sheet_labels_margin.left, tl.sheet_labels_margin.top, tl.sheet_labels_margin.right, tl.sheet_labels_margin.bottom);
                    clone.design_background_image = tl.design_background_image;
                    clone.margin = new Neodynamic.SDK.Printing.FrameThickness(tl.margin.left, tl.margin.top, tl.margin.right, tl.margin.bottom);
                    clone.use_default_media_type = tl.use_default_media_type;
                    //clone.items = [];
                    tl.items.forEach(function (x) {
                        clone.items.push(Neodynamic.Web.Utils.Cloner.cloneItem(x));
                    });
                    //clone.expressions = [];
                    tl.expressions.forEach(function (x) {
                        clone.expressions.push(x);
                    });
                    //clone.pages = [];
                    tl.pages.forEach(function (x) {
                        clone.pages.push(Neodynamic.Web.Utils.Cloner.clonePage(x));
                    });
                    return clone;
                };
                Cloner.cloneItem = function (itm) {
                    var clone;
                    if (itm instanceof Neodynamic.SDK.Printing.EllipseShapeItem) {
                        clone = new Neodynamic.SDK.Printing.EllipseShapeItem();
                        clone.unit_type = itm.unit_type;
                        clone.rotation_angle = itm.rotation_angle;
                        clone.fill_color = itm.fill_color;
                        clone.stroke_thickness = itm.stroke_thickness;
                        clone.stroke_color = itm.stroke_color;
                        clone.width = itm.width;
                        clone.height = itm.height;
                        clone.name = itm.name; // + new Date().getTime();
                        clone.x = itm.x;
                        clone.y = itm.y;
                        //console.log(clone.x);
                        clone.data_field = itm.data_field;
                        clone.data_field_format_string = itm.data_field_format_string;
                        clone.print_as_graphic = itm.print_as_graphic;
                        clone.comments = itm.comments;
                        clone.tag = itm.tag;
                        clone.locked = itm.locked;
                        clone.editable = itm.editable;
                        clone.stroke_color_hex = itm.stroke_color_hex;
                        clone.fill_color_hex = itm.fill_color_hex;
                        clone.expression = itm.expression;
                        clone.use_cache = itm.use_cache;
                        clone.cache_item_id = itm.cache_item_id;
                        clone.visible = itm.visible;
                        clone.stroke_style = itm.stroke_style;
                        clone.stroke_style_pattern = itm.stroke_style_pattern;
                        clone.group_name = itm.group_name;
                        clone.resizable = itm.resizable;
                        //clone._updateToCanvas();
                    }
                    else if (itm instanceof Neodynamic.SDK.Printing.ImageItem) {
                        clone = new Neodynamic.SDK.Printing.ImageItem();
                        clone.unit_type = itm.unit_type;
                        clone.monochrome_settings.dither_method = itm.monochrome_settings.dither_method;
                        clone.monochrome_settings.reverse_effect = itm.monochrome_settings.reverse_effect;
                        clone.monochrome_settings.threshold = itm.monochrome_settings.threshold;
                        clone.source_base64 = itm.source_base64;
                        clone.lock_aspect_ratio = itm.lock_aspect_ratio;
                        clone.flip = itm.flip;
                        clone.rotation_angle = itm.rotation_angle;
                        clone.is_grayscale_or_black_white = itm.is_grayscale_or_black_white;
                        clone.height = itm.height;
                        clone.width = itm.width;
                        clone.name = itm.name; // + new Date().getTime();
                        clone.x = itm.x;
                        clone.y = itm.y;
                        clone.comments = itm.comments;
                        clone.data_field = itm.data_field;
                        clone.data_field_format_string = itm.data_field_format_string;
                        clone.source_dpi = itm.source_dpi;
                        clone.convert_to_monochrome = itm.convert_to_monochrome;
                        clone.expression = itm.expression;
                        clone.source_file = itm.source_file;
                        clone.use_cache = itm.use_cache;
                        clone.cache_item_id = itm.cache_item_id;
                        clone.visible = itm.visible;
                        clone.group_name = itm.group_name;
                        clone.read_only = itm.read_only;
                        //clone._updateToCanvas();
                    }
                    else if (itm instanceof Neodynamic.SDK.Printing.LineShapeItem) {
                        clone = new Neodynamic.SDK.Printing.LineShapeItem();
                        clone.unit_type = itm.unit_type;
                        clone._rotation_angle = itm._rotation_angle;
                        clone.orientation = itm.orientation;
                        clone.stroke_thickness = itm.stroke_thickness;
                        clone.stroke_color = itm.stroke_color;
                        clone.width = itm.width;
                        clone.height = itm.height;
                        clone.name = itm.name; // + new Date().getTime();
                        clone.x = itm.x;
                        clone.y = itm.y;
                        clone.data_field = itm.data_field;
                        clone.data_field_format_string = itm.data_field_format_string;
                        clone.print_as_graphic = itm.print_as_graphic;
                        clone.comments = itm.comments;
                        clone.tag = itm.tag;
                        clone.locked = itm.locked;
                        clone.editable = itm.editable;
                        clone.stroke_color_hex = itm.stroke_color_hex;
                        clone.expression = itm.expression;
                        clone.use_cache = itm.use_cache;
                        clone.cache_item_id = itm.cache_item_id;
                        clone.visible = itm.visible;
                        clone.stroke_style = itm.stroke_style;
                        clone.stroke_style_pattern = itm.stroke_style_pattern;
                        clone.group_name = itm.group_name;
                        clone.resizable = itm.resizable;
                        //clone._updateToCanvas();
                    }
                    else if (itm instanceof Neodynamic.SDK.Printing.RectangleShapeItem) {
                        clone = new Neodynamic.SDK.Printing.RectangleShapeItem();
                        clone.unit_type = itm.unit_type;
                        clone.corner_radius = new Neodynamic.SDK.Printing.RectangleCornerRadius(itm.corner_radius.top_left, itm.corner_radius.top_right, itm.corner_radius.bottom_right, itm.corner_radius.bottom_left);
                        clone.rotation_angle = itm.rotation_angle;
                        clone.fill_color = itm.fill_color;
                        clone.stroke_thickness = itm.stroke_thickness;
                        clone.stroke_color = itm.stroke_color;
                        clone.width = itm.width;
                        clone.height = itm.height;
                        clone.name = itm.name; // + new Date().getTime();
                        clone.x = itm.x;
                        clone.y = itm.y;
                        clone.data_field = itm.data_field;
                        clone.data_field_format_string = itm.data_field_format_string;
                        clone.print_as_graphic = itm.print_as_graphic;
                        clone.comments = itm.comments;
                        clone.tag = itm.tag;
                        clone.locked = itm.locked;
                        clone.editable = itm.editable;
                        clone.stroke_color_hex = itm.stroke_color_hex;
                        clone.fill_color_hex = itm.fill_color_hex;
                        clone.expression = itm.expression;
                        clone.use_cache = itm.use_cache;
                        clone.cache_item_id = itm.cache_item_id;
                        clone.visible = itm.visible;
                        clone.stroke_style = itm.stroke_style;
                        clone.stroke_style_pattern = itm.stroke_style_pattern;
                        clone.group_name = itm.group_name;
                        clone.resizable = itm.resizable;
                        //clone._updateToCanvas();
                    }
                    else if (itm instanceof Neodynamic.SDK.Printing.RFIDTagItem) {
                        clone = new Neodynamic.SDK.Printing.RFIDTagItem();
                        clone.unit_type = itm.unit_type;
                        clone.epc_data_structure = itm.epc_data_structure;
                        clone.data_format = itm.data_format;
                        clone.data_to_encode = itm.data_to_encode;
                        clone.name = itm.name; // + new Date().getTime();
                        clone.x = itm.x;
                        clone.y = itm.y;
                        clone.data_field = itm.data_field;
                        clone.data_field_format_string = itm.data_field_format_string;
                        clone.print_as_graphic = itm.print_as_graphic;
                        clone.comments = itm.comments;
                        clone.tag = itm.tag;
                        clone.locked = itm.locked;
                        clone.editable = itm.editable;
                        clone.expression = itm.expression;
                        clone.use_cache = itm.use_cache;
                        clone.cache_item_id = itm.cache_item_id;
                        clone.visible = itm.visible;
                        clone.group_name = itm.group_name;
                        clone.resizable = itm.resizable;
                        clone.read_only = itm.read_only;
                        //clone._updateToCanvas();
                    }
                    else if (itm instanceof Neodynamic.SDK.Printing.TextItem) {
                        clone = new Neodynamic.SDK.Printing.TextItem();
                        clone.unit_type = itm.unit_type;
                        clone.name = itm.name; // + new Date().getTime();
                        clone.x = itm.x;
                        clone.y = itm.y;
                        clone.border_thickness = new Neodynamic.SDK.Printing.FrameThickness(itm.border_thickness.left, itm.border_thickness.top, itm.border_thickness.right, itm.border_thickness.bottom);
                        clone.text_padding = new Neodynamic.SDK.Printing.FrameThickness(itm.text_padding.left, itm.text_padding.top, itm.text_padding.right, itm.text_padding.bottom);
                        clone.corner_radius = new Neodynamic.SDK.Printing.RectangleCornerRadius(itm.corner_radius.top_left, itm.corner_radius.top_right, itm.corner_radius.bottom_right, itm.corner_radius.bottom_left);
                        clone.font.bold = itm.font.bold;
                        clone.font.code_page = itm.font.code_page;
                        clone.font.custom_font_file = itm.font.custom_font_file;
                        clone.font.custom_font_file_family_name = itm.font.custom_font_file_family_name;
                        clone.font.is_bitmap_font = itm.font.is_bitmap_font;
                        clone.font.italic = itm.font.italic;
                        clone.font.name = itm.font.name;
                        clone.font.name_at_printer_storage = itm.font.name_at_printer_storage;
                        clone.font.size = itm.font.size;
                        clone.font.strikeout = itm.font.strikeout;
                        clone.font.threshold = itm.font.threshold;
                        clone.font.underline = itm.font.underline;
                        clone.font.unit = itm.font.unit;
                        clone.back_color = itm.back_color;
                        clone.border_color = itm.border_color;
                        clone.counter_step = itm.counter_step;
                        clone.counter_use_leading_zeros = itm.counter_use_leading_zeros;
                        clone.culture_name = itm.culture_name;
                        clone.font = itm.font;
                        clone.fore_color = itm.fore_color;
                        clone.height = itm.height;
                        clone.mask = itm.mask;
                        clone.right_to_left = itm.right_to_left;
                        clone.rotation_angle = itm.rotation_angle;
                        clone.sizing = itm.sizing;
                        clone.text = itm.text;
                        clone.max_length = itm.max_length;
                        clone.text_alignment = itm.text_alignment;
                        clone.width = itm.width;
                        clone.comments = itm.comments;
                        clone.data_field = itm.data_field;
                        clone.data_field_format_string = itm.data_field_format_string;
                        clone.print_as_graphic = itm.print_as_graphic;
                        clone.tag = itm.tag;
                        clone.locked = itm.locked;
                        clone.editable = itm.editable;
                        clone.hide_if_empty = itm.hide_if_empty;
                        clone.border_color_hex = itm.border_color_hex;
                        clone.back_color_hex = itm.back_color_hex;
                        clone.fore_color_hex = itm.fore_color_hex;
                        clone.input_mask_pattern = itm.input_mask_pattern;
                        clone.input_mask_prompt_char = itm.input_mask_prompt_char;
                        clone.expression = itm.expression;
                        clone.use_cache = itm.use_cache;
                        clone.cache_item_id = itm.cache_item_id;
                        clone.stroke_color_hex = itm.stroke_color_hex;
                        clone.stroke_thickness = itm.stroke_thickness;
                        clone.char_spacing = itm.char_spacing;
                        clone.line_spacing = itm.line_spacing;
                        clone.visible = itm.visible;
                        clone.group_name = itm.group_name;
                        clone.resizable = itm.resizable;
                        clone.read_only = itm.read_only;
                        clone.validation_regex = itm.validation_regex;
                        clone.validation_error_message = itm.validation_error_message;
                        clone.multiline = itm.multiline;
                        clone.text_vertical_alignment = itm.text_vertical_alignment;
                        clone.min_font_size = itm.min_font_size;
                        clone.use_slashed_zero = itm.use_slashed_zero;
                        //clone._updateToCanvas();
                    }
                    else if (itm instanceof Neodynamic.SDK.Printing.BarcodeItem) {
                        clone = new Neodynamic.SDK.Printing.BarcodeItem();
                        clone.name = itm.name; // + new Date().getTime();
                        clone.unit_type = itm.unit_type;
                        clone.x = itm.x;
                        clone.y = itm.y;
                        clone.width = itm.width;
                        clone.height = itm.height;
                        clone.corner_radius = new Neodynamic.SDK.Printing.RectangleCornerRadius(itm.corner_radius.top_left, itm.corner_radius.top_right, itm.corner_radius.bottom_right, itm.corner_radius.bottom_left);
                        clone.border_thickness = new Neodynamic.SDK.Printing.FrameThickness(itm.border_thickness.left, itm.border_thickness.top, itm.border_thickness.right, itm.border_thickness.bottom);
                        clone.barcode_padding = new Neodynamic.SDK.Printing.FrameThickness(itm.barcode_padding.left, itm.barcode_padding.top, itm.barcode_padding.right, itm.barcode_padding.bottom);
                        clone.quiet_zone = new Neodynamic.SDK.Printing.FrameThickness(itm.quiet_zone.left, itm.quiet_zone.top, itm.quiet_zone.right, itm.quiet_zone.bottom);
                        clone.text_font.bold = itm.text_font.bold;
                        clone.text_font.code_page = itm.text_font.code_page;
                        clone.text_font.custom_font_file = itm.text_font.custom_font_file;
                        clone.text_font.custom_font_file_family_name = itm.text_font.custom_font_file_family_name;
                        clone.text_font.is_bitmap_font = itm.text_font.is_bitmap_font;
                        clone.text_font.italic = itm.text_font.italic;
                        clone.text_font.name = itm.text_font.name;
                        clone.text_font.name_at_printer_storage = itm.text_font.name_at_printer_storage;
                        clone.text_font.size = itm.text_font.size;
                        clone.text_font.strikeout = itm.text_font.strikeout;
                        clone.text_font.threshold = itm.text_font.threshold;
                        clone.text_font.underline = itm.text_font.underline;
                        clone.text_font.unit = itm.text_font.unit;
                        clone.font.bold = itm.font.bold;
                        clone.font.code_page = itm.font.code_page;
                        clone.font.custom_font_file = itm.font.custom_font_file;
                        clone.font.custom_font_file_family_name = itm.font.custom_font_file_family_name;
                        clone.font.is_bitmap_font = itm.font.is_bitmap_font;
                        clone.font.italic = itm.font.italic;
                        clone.font.name = itm.font.name;
                        clone.font.name_at_printer_storage = itm.font.name_at_printer_storage;
                        clone.font.size = itm.font.size;
                        clone.font.strikeout = itm.font.strikeout;
                        clone.font.threshold = itm.font.threshold;
                        clone.font.underline = itm.font.underline;
                        clone.font.unit = itm.font.unit;
                        clone.add_checksum = itm.add_checksum;
                        clone.aztec_code_byte_encoding_name = itm.aztec_code_byte_encoding_name;
                        clone.aztec_code_error_correction = itm.aztec_code_error_correction;
                        clone.aztec_code_format = itm.aztec_code_format;
                        clone.aztec_code_module_size = itm.aztec_code_module_size;
                        clone.aztec_code_process_tilde = itm.aztec_code_process_tilde;
                        clone.aztec_code_rune = itm.aztec_code_rune;
                        clone.back_color = itm.back_color;
                        clone.barcode_alignment = itm.barcode_alignment;
                        clone.bar_color = itm.bar_color;
                        clone.bar_height = itm.bar_height;
                        clone.bar_ratio = itm.bar_ratio;
                        clone.bar_width = itm.bar_width;
                        clone.bar_width_adjustment = itm.bar_width_adjustment;
                        clone.bearer_bar_style = itm.bearer_bar_style;
                        clone.bearer_bar_thickness = itm.bearer_bar_thickness;
                        clone.border_color = itm.border_color;
                        clone.codabar_start_char = itm.codabar_start_char;
                        clone.codabar_stop_char = itm.codabar_stop_char;
                        clone.code = itm.code;
                        clone.code128_charset = itm.code128_charset;
                        clone.code16k_mode = itm.code16k_mode;
                        clone.code39_full_ascii_mode = itm.code39_full_ascii_mode;
                        clone.code93_full_ascii_mode = itm.code93_full_ascii_mode;
                        clone.code_alignment = itm.code_alignment;
                        clone.code_format_pattern = itm.code_format_pattern;
                        clone.corner_radius = itm.corner_radius;
                        clone.counter_step = itm.counter_step;
                        clone.counter_using_leading_zeros = itm.counter_using_leading_zeros;
                        clone.data_matrix_byte_encoding_name = itm.data_matrix_byte_encoding_name;
                        clone.data_matrix_encoding = itm.data_matrix_encoding;
                        clone.data_matrix_file_id = itm.data_matrix_file_id;
                        clone.data_matrix_format = itm.data_matrix_format;
                        clone.data_matrix_module_size = itm.data_matrix_module_size;
                        clone.data_matrix_process_tilde = itm.data_matrix_process_tilde;
                        clone.data_matrix_symbol_count = itm.data_matrix_symbol_count;
                        clone.data_matrix_symbol_index = itm.data_matrix_symbol_index;
                        clone.display_checksum = itm.display_checksum;
                        clone.display_code = itm.display_code;
                        clone.display_start_stop_char = itm.display_start_stop_char;
                        clone.ean_upc_display_light_margin_indicator = itm.ean_upc_display_light_margin_indicator;
                        clone.ean_upc_guard_bar = itm.ean_upc_guard_bar;
                        clone.ean_upc_guard_bar_height = itm.ean_upc_guard_bar_height;
                        clone.ean_upc_magnification_factor = itm.ean_upc_magnification_factor;
                        clone.ean_upc_supplement = itm.ean_upc_supplement;
                        clone.ean_upc_supplement_code = itm.ean_upc_supplement_code;
                        clone.ean_upc_supplement_separation = itm.ean_upc_supplement_separation;
                        clone.ean_upc_supplement_top_margin = itm.ean_upc_supplement_top_margin;
                        clone.error_behavior = itm.error_behavior;
                        clone.font = itm.font;
                        clone.fore_color = itm.fore_color;
                        clone.han_xin_code_byte_encoding_name = itm.han_xin_code_byte_encoding_name;
                        clone.han_xin_code_encoding = itm.han_xin_code_encoding;
                        clone.han_xin_code_error_correction_level = itm.han_xin_code_error_correction_level;
                        clone.han_xin_code_module_size = itm.han_xin_code_module_size;
                        clone.han_xin_code_process_tilde = itm.han_xin_code_process_tilde;
                        clone.han_xin_code_version = itm.han_xin_code_version;
                        clone.hibc_format_human_readable_text = itm.hibc_format_human_readable_text;
                        clone.hibc_use_iso_iec_15434_encoding = itm.hibc_use_iso_iec_15434_encoding;
                        clone.hide_if_empty = itm.hide_if_empty;
                        clone.human_readable_text = itm.human_readable_text;
                        clone.isbt_128_data_structure = itm.isbt_128_data_structure;
                        clone.itf14_left_h_mark = itm.itf14_left_h_mark;
                        clone.itf14_right_h_mark = itm.itf14_right_h_mark;
                        clone.mask = itm.mask;
                        clone.mask_increment = itm.mask_increment;
                        clone.maxi_code_mode = itm.maxi_code_mode;
                        clone.maxi_code_process_tilde = itm.maxi_code_process_tilde;
                        clone.maxi_code_symbol_count = itm.maxi_code_symbol_count;
                        clone.maxi_code_symbol_index = itm.maxi_code_symbol_index;
                        clone.micropdf417_version = itm.micropdf417_version;
                        clone.microqr_code_version = itm.microqr_code_version;
                        clone.msi_checksum = itm.msi_checksum;
                        clone.pdf417_aspect_ratio = itm.pdf417_aspect_ratio;
                        clone.pdf417_byte_encoding_name = itm.pdf417_byte_encoding_name;
                        clone.pdf417_columns = itm.pdf417_columns;
                        clone.pdf417_compaction_type = itm.pdf417_compaction_type;
                        clone.pdf417_error_correction_level = itm.pdf417_error_correction_level;
                        clone.pdf417_file_id = itm.pdf417_file_id;
                        clone.pdf417_rows = itm.pdf417_rows;
                        clone.pdf417_segment_count = itm.pdf417_segment_count;
                        clone.pdf417_segment_index = itm.pdf417_segment_index;
                        clone.pdf417_truncated = itm.pdf417_truncated;
                        clone.pdf417_process_tilde = itm.pdf417_process_tilde;
                        clone.pharmacode_bars_spacing = itm.pharmacode_bars_spacing;
                        clone.pharmacode_thick_bar_width = itm.pharmacode_thick_bar_width;
                        clone.pharmacode_thin_bar_width = itm.pharmacode_thin_bar_width;
                        clone.planet_height_short_bar = itm.planet_height_short_bar;
                        clone.planet_height_tall_bar = itm.planet_height_tall_bar;
                        clone.postal_4_state_add_start_stop_char = itm.postal_4_state_add_start_stop_char;
                        clone.postal_4_state_bars_spacing = itm.postal_4_state_bars_spacing;
                        clone.postal_4_state_tracker_bar_height = itm.postal_4_state_tracker_bar_height;
                        clone.postal_4_state_tracker_bar_width = itm.postal_4_state_tracker_bar_width;
                        clone.postnet_height_short_bar = itm.postnet_height_short_bar;
                        clone.postnet_height_tall_bar = itm.postnet_height_tall_bar;
                        clone.qr_code_byte_encoding_name = itm.qr_code_byte_encoding_name;
                        clone.qr_code_encoding = itm.qr_code_encoding;
                        clone.qr_code_error_correction_level = itm.qr_code_error_correction_level;
                        clone.qr_code_module_size = itm.qr_code_module_size;
                        clone.qr_code_process_tilde = itm.qr_code_process_tilde;
                        clone.qr_code_version = itm.qr_code_version;
                        clone.rotation_angle = itm.rotation_angle;
                        clone.segments_per_row = itm.segments_per_row;
                        clone.sizing = itm.sizing;
                        clone.symbology = itm.symbology;
                        clone.telepen_encoding = itm.telepen_encoding;
                        clone.text = itm.text;
                        clone.text_alignment = itm.text_alignment;
                        clone.text_font = itm.text_font;
                        clone.text_fore_color = itm.text_fore_color;
                        clone.text_format_pattern = itm.text_format_pattern;
                        clone.upce_system = itm.upce_system;
                        clone.use_quiet_zone_for_text = itm.use_quiet_zone_for_text;
                        clone.usps_fim_pattern = itm.usps_fim_pattern;
                        clone.usps_horizontal_bars_count = itm.usps_horizontal_bars_count;
                        clone.comments = itm.comments;
                        clone.data_field = itm.data_field;
                        clone.data_field_format_string = itm.data_field_format_string;
                        clone.print_as_graphic = itm.print_as_graphic;
                        clone.tag = itm.tag;
                        clone.locked = itm.locked;
                        clone.gs1_data_strict_validation = itm.gs1_data_strict_validation;
                        clone.maxi_code_draw_pixel_based_symbol = itm.maxi_code_draw_pixel_based_symbol;
                        clone.dot_code_columns = itm.dot_code_columns;
                        clone.dot_code_module_size = itm.dot_code_module_size;
                        clone.dot_code_module_size = itm.dot_code_module_size;
                        clone.dot_code_process_tilde = itm.dot_code_process_tilde;
                        clone.dot_code_rows = itm.dot_code_rows;
                        clone.dot_code_aspect_ratio = itm.dot_code_aspect_ratio;
                        clone.dot_code_module_shape = itm.dot_code_module_shape;
                        clone.data_matrix_include_rect_formats_in_auto_mode = itm.data_matrix_include_rect_formats_in_auto_mode;
                        clone.editable = itm.editable;
                        clone.border_color_hex = itm.border_color_hex;
                        clone.back_color_hex = itm.back_color_hex;
                        clone.bar_color_hex = itm.bar_color_hex;
                        clone.fore_color_hex = itm.fore_color_hex;
                        clone.text_fore_color_hex = itm.text_fore_color_hex;
                        clone.expression = itm.expression;
                        clone.use_cache = itm.use_cache;
                        clone.cache_item_id = itm.cache_item_id;
                        clone.visible = itm.visible;
                        clone.code11_two_digits_checksum = itm.code11_two_digits_checksum;
                        clone.tlc39_micro_pdf417_bar_width = itm.tlc39_micro_pdf417_bar_width;
                        clone.tlc39_micro_pdf417_row_bar_height = itm.tlc39_micro_pdf417_row_bar_height;
                        clone.right_to_left = itm.right_to_left;
                        clone.rect_microqr_code_version = itm.rect_microqr_code_version;
                        clone.print_as_resident_element = itm.print_as_resident_element;
                        clone.qr_code_mask = itm.qr_code_mask;
                        clone.group_name = itm.group_name;
                        clone.resizable = itm.resizable;
                        clone.read_only = itm.read_only;
                        clone.code_encoding = itm.code_encoding;
                        //clone._updateToCanvas();
                    }
                    else if (itm instanceof Neodynamic.SDK.Printing.RepeaterItem) {
                        clone = new Neodynamic.SDK.Printing.RepeaterItem();
                        clone.unit_type = itm.unit_type;
                        clone.rotation_angle = itm.rotation_angle;
                        clone.count = itm.count;
                        clone.width = itm.width;
                        clone.height = itm.height;
                        clone.name = itm.name; // + new Date().getTime();
                        clone.x = itm.x;
                        clone.y = itm.y;
                        clone.data_field = itm.data_field;
                        clone.data_field_format_string = itm.data_field_format_string;
                        clone.print_as_graphic = itm.print_as_graphic;
                        clone.comments = itm.comments;
                        clone.tag = itm.tag;
                        clone.locked = itm.locked;
                        clone.editable = itm.editable;
                        clone.expression = itm.expression;
                        clone.use_cache = itm.use_cache;
                        clone.cache_item_id = itm.cache_item_id;
                        clone.visible = itm.visible;
                        clone.group_name = itm.group_name;
                        clone.resizable = itm.resizable;
                        //clone._updateToCanvas();
                    }
                    else if (itm instanceof Neodynamic.SDK.Printing.TableShapeItem) {
                        clone = new Neodynamic.SDK.Printing.TableShapeItem();
                        clone.unit_type = itm.unit_type;
                        clone.corner_radius = new Neodynamic.SDK.Printing.RectangleCornerRadius(itm.corner_radius.top_left, itm.corner_radius.top_right, itm.corner_radius.bottom_right, itm.corner_radius.bottom_left);
                        clone.rotation_angle = itm.rotation_angle;
                        clone.fill_color = itm.fill_color;
                        clone.stroke_thickness = itm.stroke_thickness;
                        clone.stroke_color = itm.stroke_color;
                        clone.width = itm.width;
                        clone.height = itm.height;
                        clone.name = itm.name; // + new Date().getTime();
                        clone.x = itm.x;
                        clone.y = itm.y;
                        clone.columns_line_visible = itm.columns_line_visible;
                        clone.rows_line_visible = itm.rows_line_visible;
                        itm.columns.forEach(function (x) {
                            clone.columns.push(Neodynamic.Web.Utils.Cloner.cloneTableColumn(x));
                        });
                        itm.rows.forEach(function (x) {
                            clone.rows.push(Neodynamic.Web.Utils.Cloner.cloneTableRow(x));
                        });
                        clone.data_field = itm.data_field;
                        clone.data_field_format_string = itm.data_field_format_string;
                        clone.print_as_graphic = itm.print_as_graphic;
                        clone.comments = itm.comments;
                        clone.tag = itm.tag;
                        clone.locked = itm.locked;
                        clone.editable = itm.editable;
                        clone.stroke_color_hex = itm.stroke_color_hex;
                        clone.fill_color_hex = itm.fill_color_hex;
                        clone.expression = itm.expression;
                        clone.use_cache = itm.use_cache;
                        clone.cache_item_id = itm.cache_item_id;
                        clone.visible = itm.visible;
                        clone.stroke_style = itm.stroke_style;
                        clone.stroke_style_pattern = itm.stroke_style_pattern;
                        clone.group_name = itm.group_name;
                        clone.resizable = itm.resizable;
                        //clone._updateToCanvas();
                    }
                    else if (itm instanceof Neodynamic.SDK.Printing.LiteralItem) {
                        clone = new Neodynamic.SDK.Printing.LiteralItem();
                        clone.unit_type = itm.unit_type;
                        clone.text = itm.text;
                        clone.name = itm.name; // + new Date().getTime();
                        clone.x = itm.x;
                        clone.y = itm.y;
                        clone.data_field = itm.data_field;
                        clone.data_field_format_string = itm.data_field_format_string;
                        clone.print_as_graphic = itm.print_as_graphic;
                        clone.comments = itm.comments;
                        clone.tag = itm.tag;
                        clone.locked = itm.locked;
                        clone.editable = itm.editable;
                        clone.expression = itm.expression;
                        clone.use_cache = itm.use_cache;
                        clone.cache_item_id = itm.cache_item_id;
                        clone.visible = itm.visible;
                        clone.group_name = itm.group_name;
                        clone.resizable = itm.resizable;
                        clone.read_only = itm.read_only;
                        //clone._updateToCanvas();
                    }
                    return clone;
                };
                Cloner.clonePage = function (page) {
                    var clone = new Neodynamic.SDK.Printing.ThermalLabelPage();
                    clone.x = page.x;
                    clone.y = page.y;
                    clone.width = page.width;
                    clone.height = page.height;
                    return clone;
                };
                Cloner.cloneTableColumn = function (column) {
                    var clone = new Neodynamic.SDK.Printing.TableColumn();
                    clone.width = column.width;
                    clone.fill_color = column.fill_color;
                    clone.fill_color_hex = column.fill_color_hex;
                    return clone;
                };
                Cloner.cloneTableRow = function (row) {
                    var clone = new Neodynamic.SDK.Printing.TableRow();
                    clone.height = row.height;
                    clone.fill_color = row.fill_color;
                    clone.fill_color_hex = row.fill_color_hex;
                    return clone;
                };
                return Cloner;
            }());
            Utils.Cloner = Cloner;
        })(Utils = Web.Utils || (Web.Utils = {}));
    })(Web = Neodynamic.Web || (Neodynamic.Web = {}));
})(Neodynamic || (Neodynamic = {}));
/// <reference path="../../sdk/printing/thermallabel.ts" />
/// <reference path="../../web/utils/cloner.ts" />
var Neodynamic;
(function (Neodynamic) {
    var Web;
    (function (Web) {
        var Editor;
        (function (Editor) {
            var UndoManager = /** @class */ (function () {
                function UndoManager() {
                    //It holds the different states of the Label Canvas
                    this._states = [];
                    //It holds the index of the current state of the Label Canvas in the Editor
                    this._currentStateIndex = -1;
                }
                //public get _states() { return this._states1; }
                //public set _states(value){
                //    this._states1 = value;
                //}
                //public get _currentStateIndex() { return this._currentStateIndex1; }
                //public set _currentStateIndex(value) {
                //    this._currentStateIndex1 = value;
                //}
                //Clears states
                UndoManager.prototype.clear = function () {
                    this._states = [];
                    this._currentStateIndex = -1;
                };
                Object.defineProperty(UndoManager.prototype, "canUndo", {
                    //Gets whether an undo can be performed
                    get: function () {
                        return (this._currentStateIndex > 0);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(UndoManager.prototype, "canRedo", {
                    //Gets whether a redo can be performed
                    get: function () {
                        return (this._currentStateIndex < this._states.length - 1);
                    },
                    enumerable: true,
                    configurable: true
                });
                //It saves the specified Label canvas state into the States buffer
                UndoManager.prototype.saveState = function (s) {
                    var l = this._states.length;
                    //First of all, we need to check if the current state
                    //is not the last one. If not, then ALL states after it
                    //must be removed from the buffer and won't be available anymore
                    if (this._currentStateIndex >= 0 && this._currentStateIndex < l - 1) {
                        //remove newest states starting from current state...
                        this._states.splice(this._currentStateIndex + 1, l - this._currentStateIndex - 1);
                    }
                    //Store new state...
                    this._states.push(Neodynamic.Web.Utils.Cloner.cloneThermalLabel(s));
                    //update state index
                    this._currentStateIndex = this._states.length - 1;
                };
                //It performs the Undo 
                UndoManager.prototype.undo = function () {
                    if (!this.canUndo)
                        return null;
                    this._currentStateIndex -= 1;
                    //console.log(this._currentStateIndex);
                    return Neodynamic.Web.Utils.Cloner.cloneThermalLabel(this._states[this._currentStateIndex]);
                };
                //It performs the Redo 
                UndoManager.prototype.redo = function () {
                    if (!this.canRedo)
                        return null;
                    this._currentStateIndex += 1;
                    //console.log(this._currentStateIndex);
                    return Neodynamic.Web.Utils.Cloner.cloneThermalLabel(this._states[this._currentStateIndex]);
                };
                return UndoManager;
            }());
            Editor.UndoManager = UndoManager;
        })(Editor = Web.Editor || (Web.Editor = {}));
    })(Web = Neodynamic.Web || (Neodynamic.Web = {}));
})(Neodynamic || (Neodynamic = {}));
var Neodynamic;
(function (Neodynamic) {
    var Web;
    (function (Web) {
        var Utils;
        (function (Utils) {
            var MathUtils = /** @class */ (function () {
                function MathUtils() {
                }
                MathUtils.convertRadToDegrees = function (rad) {
                    return rad * 180 / Math.PI;
                };
                MathUtils.convertDegreesToRad = function (degrees) {
                    return degrees * Math.PI / 180;
                };
                MathUtils.calcOuterRectOfRotatedRect = function (x, y, w, h, angle) {
                    var m_PosX = x + w / 2;
                    var m_PosY = y + h / 2;
                    var m_HalfSizeX = w / 2;
                    var m_HalfSizeY = h / 2;
                    // corner_1 is right-top corner of unrotated rectangle, relative to m_Pos.
                    // corner_2 is right-bottom corner of unrotated rectangle, relative to m_Pos.
                    var corner_1_x = m_HalfSizeX;
                    var corner_2_x = m_HalfSizeX;
                    var corner_1_y = -m_HalfSizeY;
                    var corner_2_y = m_HalfSizeY;
                    var angleInRad = MathUtils.convertDegreesToRad(angle);
                    var sin_o = Math.sin(angleInRad);
                    var cos_o = Math.cos(angleInRad);
                    // xformed_corner_1, xformed_corner_2 are points corner_1, corner_2 rotated by angle m_Orientation.
                    var xformed_corner_1_x = corner_1_x * cos_o - corner_1_y * sin_o;
                    var xformed_corner_1_y = corner_1_x * sin_o + corner_1_y * cos_o;
                    var xformed_corner_2_x = corner_2_x * cos_o - corner_2_y * sin_o;
                    var xformed_corner_2_y = corner_2_x * sin_o + corner_2_y * cos_o;
                    // ex, ey are extents (half-sizes) of the final AABB.
                    var ex = Math.max(Math.abs(xformed_corner_1_x), Math.abs(xformed_corner_2_x));
                    var ey = Math.max(Math.abs(xformed_corner_1_y), Math.abs(xformed_corner_2_y));
                    var aabb_min_x = m_PosX - ex;
                    var aabb_max_x = m_PosX + ex;
                    var aabb_min_y = m_PosY - ey;
                    var aabb_max_y = m_PosY + ey;
                    var result = [];
                    result[0] = aabb_min_x; //X
                    result[1] = aabb_min_y; //Y
                    result[2] = aabb_max_x - aabb_min_x; //Width
                    result[3] = aabb_max_y - aabb_min_y; //Height
                    return result;
                };
                MathUtils.rotatedTopLeft = function (x, y, width, height, rotationAngle) {
                    // get the center of the rectangle (==rotation point)
                    var cx = x + width / 2;
                    var cy = y + height / 2;
                    // calc the angle of the unrotated TL corner vs the center point
                    var dx = x - cx;
                    var dy = y - cy;
                    var originalTopLeftAngle = Math.atan2(dy, dx);
                    // Add the unrotatedTL + rotationAngle to get total rotation
                    var rotatedTopLeftAngle = originalTopLeftAngle + rotationAngle;
                    // calc the radius of the rectangle (==diagonalLength/2)
                    var radius = Math.sqrt(width * width + height * height) / 2;
                    // calc the rotated top & left corner
                    var rx = cx + radius * Math.cos(rotatedTopLeftAngle);
                    var ry = cy + radius * Math.sin(rotatedTopLeftAngle);
                    // return the results
                    return ({ left: rx, top: ry });
                };
                return MathUtils;
            }());
            Utils.MathUtils = MathUtils;
        })(Utils = Web.Utils || (Web.Utils = {}));
    })(Web = Neodynamic.Web || (Neodynamic.Web = {}));
})(Neodynamic || (Neodynamic = {}));
var Neodynamic;
(function (Neodynamic) {
    var Web;
    (function (Web) {
        var Utils;
        (function (Utils) {
            var NamingUtils = /** @class */ (function () {
                function NamingUtils() {
                }
                NamingUtils.convertXMLUCS2ToChar = function (text) {
                    return text.replace(/_x(([A-F]|[a-f]|[0-9]){4})_/g, function (x, x1) {
                        return String.fromCharCode(parseInt(x1, 16));
                    }); //  .replace(/\"/g, '_x0022_').replace(/&#34;/g, '_x0022_')
                    // .replace(/</g, '_x003c_').replace(/&#60;/g, '_x003c_')
                    // .replace(/>/g, '_x003e_').replace(/&#62;/g, '_x003e_')
                    // .replace(/&/g, '_x0026_').replace(/&#38;/g, '_x0026_');
                };
                /*
                *   Genera un nuevo GUID
                */
                NamingUtils.newGuid = function () {
                    function s4() {
                        return Math.floor((1 + Math.random()) * 0x10000)
                            .toString(16)
                            .substring(1);
                    }
                    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                        s4() + '-' + s4() + s4() + s4();
                };
                return NamingUtils;
            }());
            Utils.NamingUtils = NamingUtils;
        })(Utils = Web.Utils || (Web.Utils = {}));
    })(Web = Neodynamic.Web || (Neodynamic.Web = {}));
})(Neodynamic || (Neodynamic = {}));
var Neodynamic;
(function (Neodynamic) {
    var Web;
    (function (Web) {
        var Utils;
        (function (Utils_1) {
            var XMLParser = /** @class */ (function () {
                function XMLParser() {
                }
                XMLParser.XML2Json = function (xml) {
                    var Utils = Neodynamic.Web.Utils.XMLParser;
                    return new Utils.JXONTree(xml);
                };
                XMLParser.XMLString2Json = function (stringValue) {
                    var Utils = Neodynamic.Web.Utils.XMLParser;
                    return new Utils.JXONTree($.parseXML(stringValue));
                };
                ;
                XMLParser.parseText = function (sValue) {
                    if (/^\s*$/.test(sValue)) {
                        return null;
                    }
                    if (/^(?:true|false)$/i.test(sValue)) {
                        return sValue.toLowerCase() === "true";
                    }
                    if (isFinite(sValue)) {
                        return parseFloat(sValue);
                    }
                    if (isFinite(Date.parse(sValue))) {
                        return new Date(sValue);
                    }
                    return sValue;
                };
                XMLParser.isLiteralProp = function (propName) {
                    return (propName === "Name" ||
                        propName === "DataField" ||
                        propName === "DataFieldFormatString" ||
                        propName === "CacheItemId" ||
                        propName === "Comments" ||
                        propName === "Tag" ||
                        propName === "Expression" ||
                        propName === "StrokeColorHex" ||
                        propName === "FillColorHex" ||
                        propName === "Source" ||
                        propName === "CultureName" ||
                        propName === "Mask" ||
                        propName === "MaskIncrement" ||
                        propName === "Text" ||
                        propName === "BorderColorHex" ||
                        propName === "ForeColorHex" ||
                        propName === "InputMaskPattern" ||
                        propName === "InputMaskPromptChar" ||
                        propName === "AztecCodeByteEncodingName" ||
                        propName === "DataMatrixByteEncodingName" ||
                        propName === "DataMatrixFileId" ||
                        propName === "EanUpcSupplementCode" ||
                        propName === "HumanReadableText" ||
                        propName === "Pdf417ByteEncodingName" ||
                        propName === "Pdf417FileId" ||
                        propName === "QRCodeByteEncodingName" ||
                        propName === "CodeFormatPattern" ||
                        propName === "TextFormatPattern" ||
                        propName === "HanXinCodeByteEncodingName" ||
                        propName === "BackColorHex" ||
                        propName === "TextForeColorHex" ||
                        propName === "Code");
                };
                XMLParser.JXONTree = function (oXMLParent) {
                    var Utils = Neodynamic.Web.Utils.XMLParser;
                    if (oXMLParent && oXMLParent.hasChildNodes()) {
                        var sCollectedTxt = "";
                        for (var oNode, sProp, vContent, nItem = 0; nItem < oXMLParent.childNodes.length; nItem++) {
                            oNode = oXMLParent.childNodes.item(nItem);
                            if ((oNode.nodeType - 1 | 1) === 3) {
                                sCollectedTxt += oNode.nodeType === 3 ? oNode.nodeValue.trim() : oNode.nodeValue;
                            }
                            else if (oNode.nodeType === 1 && !oNode.prefix) {
                                sProp = oNode.nodeName.toLowerCase();
                                vContent = new Utils.JXONTree(oNode);
                                if (this.hasOwnProperty(sProp)) {
                                    if (this[sProp].constructor !== Array) {
                                        this[sProp] = [this[sProp]];
                                    }
                                    this[sProp].push(vContent);
                                }
                                else {
                                    this[sProp] = vContent;
                                }
                            }
                        }
                        if (sCollectedTxt) {
                            this.keyValue = this.parseText(sCollectedTxt);
                        }
                    }
                    if (oXMLParent && oXMLParent.hasAttributes && /*this.oParentNode.hasAttributes && */ oXMLParent.hasAttributes()) {
                        var oAttrib;
                        for (var nAttrib = 0; nAttrib < oXMLParent.attributes.length; nAttrib++) {
                            oAttrib = oXMLParent.attributes.item(nAttrib);
                            this[oAttrib.name.toLowerCase()] = Utils.isLiteralProp(oAttrib.name) ? oAttrib.value : Utils.parseText(oAttrib.value.trim());
                        }
                    }
                    /* Object.freeze(this); */
                };
                return XMLParser;
            }());
            Utils_1.XMLParser = XMLParser;
            var TLParser = /** @class */ (function () {
                function TLParser() {
                }
                TLParser.parseFontObject = function (json) {
                    var nf = new Neodynamic.SDK.Printing.Font();
                    if (json.name != null) {
                        nf.name = json.name;
                        nf.size = json.size;
                        nf.unit = Neodynamic.SDK.Printing.FontUnit[json.unit];
                        nf.custom_font_file = json.customfontfile;
                        nf.custom_font_file_family_name = json.customfontfilefamilyname;
                        nf.bold = json.bold;
                        nf.italic = json.italic;
                        nf.underline = json.underline;
                        nf.strikeout = json.strikeout;
                        nf.is_bitmap_font = json.isbitmapfont;
                        nf.threshold = json.threshold;
                        nf.name_at_printer_storage = json.nameatprinterstorage;
                        nf.code_page = Neodynamic.SDK.Printing.CodePage[(json.codepage)];
                    }
                    else {
                        json = json.split(',');
                        if (!(json.length == 7 || json.length == 11 || json.length == 8 || json.length == 12 || json.length == 9 || json.length == 13))
                            throw "Invalid Font";
                        nf.name = json[0];
                        nf.size = parseFloat(json[1]);
                        if (json.length >= 11) {
                            nf.unit = Neodynamic.SDK.Printing.FontUnit[json[6]];
                            nf.custom_font_file = json[7];
                            nf.custom_font_file_family_name = json[8];
                            nf.bold = json[2] == "True" ? true : false;
                            nf.italic = json[3] == "True" ? true : false;
                            nf.underline = json[4] == "True" ? true : false;
                            nf.strikeout = json[5] == "True" ? true : false;
                            nf.is_bitmap_font = json[9] == "True" ? true : false;
                            nf.threshold = json[10];
                        }
                        else if (json.length == 7 || json.length == 8 || json.length == 9) {
                            nf.unit = nf.unit = Neodynamic.SDK.Printing.FontUnit[json[2]];
                            nf.custom_font_file = json[3];
                            nf.custom_font_file_family_name = json[4];
                            nf.is_bitmap_font = json[5] == "True" ? true : false;
                            nf.threshold = json[6];
                        }
                        if (json.length == 12 || json.length == 8) {
                            nf.name_at_printer_storage = (json.length == 8 ? json[7] : json[11]);
                        }
                        if (json.length == 13 || json.length == 9) {
                            nf.name_at_printer_storage = (json.length == 9 ? json[7] : json[11]);
                            nf.code_page = Neodynamic.SDK.Printing.CodePage[(json.length == 9 ? json[8] : json[12])];
                        }
                    }
                    return nf;
                };
                TLParser.parseItem = function (json, type, unitType) {
                    var e;
                    if (type == "RectangleShapeItem") {
                        e = new Neodynamic.SDK.Printing.RectangleShapeItem();
                        e.unit_type = unitType; // unit MUST BE set FIRST!!!
                        if (json.comments != null)
                            e.comments = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.comments);
                        if (json.cornerradius != null) {
                            if (typeof (json.cornerradius) == "number")
                                e.corner_radius = new Neodynamic.SDK.Printing.RectangleCornerRadius(json.cornerradius, json.cornerradius, json.cornerradius, json.cornerradius);
                            else if (json.cornerradius.topleft != null)
                                e.corner_radius = new Neodynamic.SDK.Printing.RectangleCornerRadius(json.cornerradius.topleft, json.cornerradius.topright, json.cornerradius.bottomright, json.cornerradius.bottomleft);
                            else {
                                var cr_parsed = json.cornerradius.split(',');
                                e.corner_radius = new Neodynamic.SDK.Printing.RectangleCornerRadius(cr_parsed[0], cr_parsed[1], cr_parsed[2], cr_parsed[3]);
                            }
                        }
                        if (json.datafield != null)
                            e.data_field = json.datafield;
                        if (json.datafieldformatstring != null)
                            e.data_field_format_string = json.datafieldformatstring;
                        if (json.fillcolor != null)
                            e.fill_color = Neodynamic.SDK.Printing.Color[json.fillcolor];
                        if (json.height != null)
                            e.height = json.height;
                        if (json.locked != null)
                            e.locked = json.locked;
                        if (json.name != null)
                            e.name = json.name;
                        if (json.printasgraphic != null)
                            e.print_as_graphic = json.printasgraphic;
                        if (json.rotationangle != null)
                            e.rotation_angle = json.rotationangle;
                        if (json.strokecolor != null)
                            e.stroke_color = (Neodynamic.SDK.Printing.Color)[json.strokecolor];
                        if (json.strokethickness != null)
                            e.stroke_thickness = json.strokethickness;
                        if (json.tag != null)
                            e.tag = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.tag);
                        if (json.width != null)
                            e.width = json.width;
                        if (json.x != null)
                            e.x = json.x;
                        if (json.y != null)
                            e.y = json.y;
                        if (json.editable != null)
                            e.editable = json.editable;
                        if (json.fillcolorhex != null)
                            e.fill_color_hex = json.fillcolorhex;
                        if (json.strokecolorhex != null)
                            e.stroke_color_hex = json.strokecolorhex;
                        if (json.expression != null)
                            e.expression = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.expression);
                        if (json.usecache != null)
                            e.use_cache = json.usecache;
                        if (json.cacheitemid != null)
                            e.cache_item_id = json.cacheitemid;
                        if (json.visible != null)
                            e.visible = json.visible;
                        if (json.strokestyle != null)
                            e.stroke_style = (Neodynamic.SDK.Printing.StrokeStyle)[json.strokestyle];
                        if (json.strokestylepattern != null)
                            e.stroke_style_pattern = json.strokestylepattern;
                        if (json.groupname != null)
                            e.group_name = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.groupname);
                        if (json.resizable != null)
                            e.resizable = json.resizable;
                        if (json.readonly != null)
                            e.read_only = json.readonly;
                        return e;
                    }
                    else if (type == "EllipseShapeItem") {
                        e = new Neodynamic.SDK.Printing.EllipseShapeItem();
                        e.unit_type = unitType; // unit MUST BE set FIRST!!!
                        if (json.width != null)
                            e.width = json.width;
                        if (json.x != null)
                            e.x = json.x;
                        if (json.y != null)
                            e.y = json.y;
                        if (json.comments != null)
                            e.comments = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.comments);
                        if (json.datafield != null)
                            e.data_field = json.datafield;
                        if (json.datafieldformatstring != null)
                            e.data_field_format_string = json.datafieldformatstring;
                        if (json.fillcolor != null)
                            e.fill_color = Neodynamic.SDK.Printing.Color[json.fillcolor];
                        if (json.height != null)
                            e.height = json.height;
                        if (json.locked != null)
                            e.locked = json.locked;
                        if (json.name != null)
                            e.name = json.name;
                        if (json.printasgraphic != null)
                            e.print_as_graphic = json.printasgraphic;
                        if (json.rotationangle != null)
                            e.rotation_angle = json.rotationangle;
                        if (json.strokecolor != null)
                            e.stroke_color = Neodynamic.SDK.Printing.Color[json.strokecolor];
                        if (json.strokethickness != null)
                            e.stroke_thickness = json.strokethickness;
                        if (json.tag != null)
                            e.tag = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.tag);
                        if (json.editable != null)
                            e.editable = json.editable;
                        if (json.fillcolorhex != null)
                            e.fill_color_hex = json.fillcolorhex;
                        if (json.strokecolorhex != null)
                            e.stroke_color_hex = json.strokecolorhex;
                        if (json.expression != null)
                            e.expression = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.expression);
                        if (json.usecache != null)
                            e.use_cache = json.usecache;
                        if (json.cacheitemid != null)
                            e.cache_item_id = json.cacheitemid;
                        if (json.visible != null)
                            e.visible = json.visible;
                        if (json.strokestyle != null)
                            e.stroke_style = (Neodynamic.SDK.Printing.StrokeStyle)[json.strokestyle];
                        if (json.strokestylepattern != null)
                            e.stroke_style_pattern = json.strokestylepattern;
                        if (json.groupname != null)
                            e.group_name = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.groupname);
                        if (json.resizable != null)
                            e.resizable = json.resizable;
                        return e;
                    }
                    else if (type == "BarcodeItem") {
                        e = new Neodynamic.SDK.Printing.BarcodeItem();
                        e.unit_type = unitType; // unit MUST BE set FIRST!!!
                        if (json.comments != null)
                            e.comments = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.comments);
                        if (json.datafield != null)
                            e.data_field = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.datafield);
                        if (json.datafieldformatstring != null)
                            e.data_field_format_string = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.datafieldformatstring);
                        if (json.name != null)
                            e.name = json.name;
                        if (json.printasgraphic != null)
                            e.print_as_graphic = json.printasgraphic;
                        if (json.tag != null)
                            e.tag = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.tag);
                        if (json.x != null)
                            e.x = json.x;
                        if (json.y != null)
                            e.y = json.y;
                        if (json.locked != null)
                            e.locked = json.locked;
                        if (json.addchecksum != null)
                            e.add_checksum = json.addchecksum;
                        if (json.azteccodebyteencodingname != null)
                            e.aztec_code_byte_encoding_name = json.azteccodebyteencodingname;
                        if (json.azteccodeerrorcorrection != null)
                            e.aztec_code_error_correction = json.azteccodeerrorcorrection;
                        if (json.azteccodeformat != null)
                            e.aztec_code_format = Neodynamic.SDK.Printing.AztecCodeFormat[json.azteccodeformat];
                        if (json.azteccodemodulesize != null)
                            e.aztec_code_module_size = json.azteccodemodulesize;
                        if (json.azteccodeprocesstilde != null)
                            e.aztec_code_process_tilde = json.azteccodeprocesstilde;
                        if (json.azteccoderune != null)
                            e.aztec_code_rune = json.azteccoderune;
                        if (json.backcolor != null)
                            e.back_color = Neodynamic.SDK.Printing.Color[json.backcolor];
                        if (json.barcodealignment != null)
                            e.barcode_alignment = Neodynamic.SDK.Printing.BarcodeAlignment[json.barcodealignment];
                        if (json.barcodepadding != null) {
                            if (typeof (json.barcodepadding) == "number")
                                e.barcode_padding = new Neodynamic.SDK.Printing.FrameThickness(json.barcodepadding, json.barcodepadding, json.barcodepadding, json.barcodepadding);
                            else if (json.barcodepadding.left != null)
                                e.barcode_padding = new Neodynamic.SDK.Printing.FrameThickness(json.barcodepadding.left, json.barcodepadding.top, json.barcodepadding.right, json.barcodepadding.bottom);
                            else {
                                var bp_parsed = json.barcodepadding.split(",");
                                e.barcode_padding = new Neodynamic.SDK.Printing.FrameThickness(bp_parsed[0], bp_parsed[1], bp_parsed[2], bp_parsed[3]);
                            }
                        }
                        if (json.barcolor != null)
                            e.bar_color = Neodynamic.SDK.Printing.Color[json.barcolor];
                        if (json.barheight != null)
                            e.bar_height = json.barheight;
                        if (json.barratio != null)
                            e.bar_ratio = json.barratio;
                        if (json.barwidth != null)
                            e.bar_width = json.barwidth;
                        if (json.barwidthadjustment != null)
                            e.bar_width_adjustment = json.barwidthadjustment;
                        if (json.bearerbarstyle != null)
                            e.bearer_bar_style = Neodynamic.SDK.Printing.BearerBarStyle[json.bearerbarstyle];
                        if (json.bearerbarthickness != null)
                            e.bearer_bar_thickness = json.bearerbarthickness;
                        if (json.bordercolor != null)
                            e.border_color = Neodynamic.SDK.Printing.Color[json.bordercolor];
                        if (json.borderthickness != null) {
                            if (typeof (json.borderthickness) == "number")
                                e.border_thickness = new Neodynamic.SDK.Printing.FrameThickness(json.borderthickness, json.borderthickness, json.borderthickness, json.borderthickness);
                            else if (json.borderthickness.left != null)
                                e.border_thickness = new Neodynamic.SDK.Printing.FrameThickness(json.borderthickness.left, json.borderthickness.top, json.borderthickness.right, json.borderthickness.bottom);
                            else {
                                var cr_parsed = json.cornerradius.split(',');
                                e.border_thickness = new Neodynamic.SDK.Printing.FrameThickness(cr_parsed[0], cr_parsed[1], cr_parsed[2], cr_parsed[3]);
                            }
                        }
                        if (json.codabarstartchar != null)
                            e.codabar_start_char = Neodynamic.SDK.Printing.CodabarStartStopChar[json.codabarstartchar];
                        if (json.codabarstopchar != null)
                            e.codabar_stop_char = Neodynamic.SDK.Printing.CodabarStartStopChar[json.codabarstopchar];
                        if (json.code != null)
                            e.code = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.code);
                        if (json.code128charset != null)
                            e.code128_charset = Neodynamic.SDK.Printing.Code128[json.code128charset];
                        if (json.code16kmode != null)
                            e.code16k_mode = Neodynamic.SDK.Printing.Code16K[json.code16kmode];
                        if (json.code39fullasciimode != null)
                            e.code39_full_ascii_mode = json.code39fullasciimode;
                        if (json.code93fullasciimode != null)
                            e.code93_full_ascii_mode = json.code93fullasciimode;
                        if (json.codealignment != null)
                            e.code_alignment = Neodynamic.SDK.Printing.BarcodeTextAlignment[json.codealignment];
                        if (json.codeformatpattern != null)
                            e.code_format_pattern = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.codeformatpattern);
                        if (json.cornerradius != null) {
                            if (typeof (json.cornerradius) == "number")
                                e.corner_radius = new Neodynamic.SDK.Printing.RectangleCornerRadius(json.cornerradius, json.cornerradius, json.cornerradius, json.cornerradius);
                            else if (json.cornerradius.topleft != null)
                                e.corner_radius = new Neodynamic.SDK.Printing.RectangleCornerRadius(json.cornerradius.topleft, json.cornerradius.topright, json.cornerradius.bottomright, json.cornerradius.bottomleft);
                            else {
                                var cr_parsed = json.cornerradius.split(',');
                                e.corner_radius = new Neodynamic.SDK.Printing.RectangleCornerRadius(cr_parsed[0], cr_parsed[1], cr_parsed[2], cr_parsed[3]);
                            }
                        }
                        if (json.counterstep != null)
                            e.counter_step = json.counterstep;
                        if (json.counterusingleadingzeros != null)
                            e.counter_using_leading_zeros = json.counterusingleadingzeros;
                        if (json.datamatrixbyteencodingname != null)
                            e.data_matrix_byte_encoding_name = json.datamatrixbyteencodingname;
                        if (json.datamatrixenconding != null)
                            e.data_matrix_enconding = Neodynamic.SDK.Printing.DataMatrixEncoding[json.datamatrixenconding];
                        if (json.datamatrixfileid != null)
                            e.data_matrix_file_id = json.datamatrixfileid;
                        if (json.datamatrixformat != null)
                            e.data_matrix_format = (Neodynamic.SDK.Printing.DataMatrixFormat)[json.datamatrixformat];
                        if (json.datamatrixmodulesize != null)
                            e.data_matrix_module_size = json.datamatrixmodulesize;
                        if (json.datamatrixprocesstilde != null)
                            e.data_matrix_process_tilde = json.datamatrixprocesstilde;
                        if (json.datamatrixsymbolcount != null)
                            e.data_matrix_symbol_count = json.datamatrixsymbolcount;
                        if (json.datamatrixsymbolindex != null)
                            e.data_matrix_symbol_index = json.datamatrixsymbolindex;
                        if (json.displaychecksum != null)
                            e.display_checksum = json.displaychecksum;
                        if (json.displaycode != null)
                            e.display_code = json.displaycode;
                        if (json.displaystartstopchar != null)
                            e.display_start_stop_char = json.displaystartstopchar;
                        if (json.eanupcdisplaylightmarginindicator != null)
                            e.ean_upc_display_light_margin_indicator = json.eanupcdisplaylightmarginindicator;
                        if (json.eanupcguardbar != null)
                            e.ean_upc_guard_bar = json.eanupcguardbar;
                        if (json.eanupcguardbarheight != null)
                            e.ean_upc_guard_bar_height = json.eanupcguardbarheight;
                        if (json.eanupcmagnificationfactor != null)
                            e.ean_upc_magnification_factor = json.eanupcmagnificationfactor;
                        if (json.eanupcsupplement != null)
                            e.ean_upc_supplement = Neodynamic.SDK.Printing.Supplement[json.eanupcsupplement];
                        if (json.eanupcsupplementcode != null)
                            e.ean_upc_supplement_code = json.eanupcsupplementcode;
                        if (json.eanupcsupplementseparation != null)
                            e.ean_upc_supplement_separation = json.eanupcsupplementseparation;
                        if (json.eanupcsupplementtopmargin != null)
                            e.ean_upc_supplement_top_margin = json.eanupcsupplementtopmargin;
                        if (json.errorbehavior != null)
                            e.error_behavior = Neodynamic.SDK.Printing.BarcodeErrorBehavior[json.errorbehavior];
                        if (json.font != null) {
                            e.font = Neodynamic.Web.Utils.TLParser.parseFontObject(json.font);
                        }
                        if (json.forecolor != null)
                            e.fore_color = Neodynamic.SDK.Printing.Color[json.forecolor];
                        if (json.hanxincodebyteencodingname != null)
                            e.han_xin_code_byte_encoding_name = json.hanxincodebyteencodingname;
                        if (json.hanxincodeencoding != null)
                            e.han_xin_code_encoding = Neodynamic.SDK.Printing.HanXinCodeEncoding[json.hanxincodeencoding];
                        if (json.hanxincodeerrorcorrectionlevel != null)
                            e.han_xin_code_error_correction_level = Neodynamic.SDK.Printing.HanXinCodeErrorCorrectionLevel[json.hanxincodeerrorcorrectionlevel];
                        if (json.hanxincodemodulesize != null)
                            e.han_xin_code_module_size = json.hanxincodemodulesize;
                        if (json.hanxincodeprocesstilde != null)
                            e.han_xin_code_process_tilde = json.hanxincodeprocesstilde;
                        if (json.hanxincodeversion != null)
                            e.han_xin_code_version = Neodynamic.SDK.Printing.HanXinCodeVersion[json.hanxincodeversion];
                        if (json.height != null)
                            e.height = json.height;
                        if (json.hibcformathumanreadabletext != null)
                            e.hibc_format_human_readable_text = json.hibcformathumanreadabletext;
                        if (json.hibcuseisoiec15434encoding != null)
                            e.hibc_use_iso_iec_15434_encoding = json.hibcuseisoiec15434encoding;
                        if (json.hideifempty != null)
                            e.hide_if_empty = json.hideifempty;
                        if (json.humanreadabletext != null)
                            e.human_readable_text = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.humanreadabletext);
                        if (json.isbt128datastructure != null)
                            e.isbt_128_data_structure = Neodynamic.SDK.Printing.Isbt128DataStructure[json.isbt128datastructure];
                        if (json.itf14lefthmark != null)
                            e.itf14_left_h_mark = Neodynamic.SDK.Printing.ItfHmark[json.itf14lefthmark];
                        if (json.itf14righthmark != null)
                            e.itf14_right_h_mark = Neodynamic.SDK.Printing.ItfHmark[json.itf14righthmark];
                        if (json.mask != null)
                            e.mask = json.mask;
                        if (json.maskincrement != null)
                            e.mask_increment = json.maskincrement;
                        if (json.maxicodemode != null)
                            e.maxi_code_mode = Neodynamic.SDK.Printing.MaxiCodeModes[json.maxicodemode];
                        if (json.maxicodeprocesstilde != null)
                            e.maxi_code_process_tilde = json.maxicodeprocesstilde;
                        if (json.maxicodesymbolcount != null)
                            e.maxi_code_symbol_count = json.maxicodesymbolcount;
                        if (json.maxicodesymbolindex != null)
                            e.maxi_code_symbol_index = json.maxicodesymbolindex;
                        if (json.micropdf417version != null)
                            e.micropdf417_version = Neodynamic.SDK.Printing.MicroPdf417Version[json.micropdf417version];
                        if (json.microqrcodeversion != null)
                            e.microqr_code_version = Neodynamic.SDK.Printing.MicroQRCodeVersion[json.microqrcodeversion];
                        if (json.msichecksum != null)
                            e.msi_checksum = Neodynamic.SDK.Printing.MsiChecksum[json.msichecksum];
                        if (json.pdf417aspectratio != null)
                            e.pdf417_aspect_ratio = json.pdf417aspectratio;
                        if (json.pdf417byteencodingname != null)
                            e.pdf417_byte_encoding_name = json.pdf417byteencodingname;
                        if (json.pdf417columns != null)
                            e.pdf417_columns = json.pdf417columns;
                        if (json.pdf417compactiontype != null)
                            e.pdf417_compaction_type = Neodynamic.SDK.Printing.Pdf417CompactionType[json.pdf417compactiontype];
                        if (json.pdf417errorcorrectionlevel != null)
                            e.pdf417_error_correction_level = Neodynamic.SDK.Printing.Pdf417ErrorCorrection[json.pdf417errorcorrectionlevel];
                        if (json.pdf417fileid != null)
                            e.pdf417_file_id = json.pdf417fileid;
                        if (json.pdf417rows != null)
                            e.pdf417_rows = json.pdf417rows;
                        if (json.pdf417segmentcount != null)
                            e.pdf417_segment_count = json.pdf417segmentcount;
                        if (json.pdf417segmentindex != null)
                            e.pdf417_segment_index = json.pdf417segmentindex;
                        if (json.pdf417truncated != null)
                            e.pdf417_truncated = json.pdf417truncated;
                        if (json.pdf417processtilde != null)
                            e.pdf417_process_tilde = json.pdf417processtilde;
                        if (json.pharmacodebarsspacing != null)
                            e.pharmacode_bars_spacing = json.pharmacodebarsspacing;
                        if (json.pharmacodethickbarwidth != null)
                            e.pharmacode_thick_bar_width = json.pharmacodethickbarwidth;
                        if (json.pharmacodethinbarwidth != null)
                            e.pharmacode_thin_bar_width = json.pharmacodethinbarwidth;
                        if (json.planetheightshortbar != null)
                            e.planet_height_short_bar = json.planetheightshortbar;
                        if (json.planetheighttallbar != null)
                            e.planet_height_tall_bar = json.planetheighttallbar;
                        if (json.postal4stateaddstartstopchar != null)
                            e.postal_4_state_add_start_stop_char = json.postal4stateaddstartstopchar;
                        if (json.postal4statebarsspacing != null)
                            e.postal_4_state_bars_spacing = json.postal4statebarsspacing;
                        if (json.postal4statetrackerbarheight != null)
                            e.postal_4_state_tracker_bar_height = json.postal4statetrackerbarheight;
                        if (json.postal4statetrackerbarwidth != null)
                            e.postal_4_state_tracker_bar_width = json.postal4statetrackerbarwidth;
                        if (json.postnetheightshortbar != null)
                            e.postnet_height_short_bar = json.postnetheightshortbar;
                        if (json.postnetheighttallbar != null)
                            e.postnet_height_tall_bar = json.postnetheighttallbar;
                        if (json.qrcodebyteencodingname != null)
                            e.qr_code_byte_encoding_name = json.qrcodebyteencodingname;
                        if (json.qrcodeencoding != null)
                            e.qr_code_encoding = Neodynamic.SDK.Printing.QRCodeEncoding[json.qrcodeencoding];
                        if (json.qrcodeerrorcorrectionlevel != null)
                            e.qr_code_error_correction_level = Neodynamic.SDK.Printing.QRCodeErrorCorrectionLevel[json.qrcodeerrorcorrectionlevel];
                        if (json.qrcodemodulesize != null)
                            e.qr_code_module_size = json.qrcodemodulesize;
                        if (json.qrcodeprocesstilde != null)
                            e.qr_code_process_tilde = json.qrcodeprocesstilde;
                        if (json.qrcodeversion != null)
                            e.qr_code_version = Neodynamic.SDK.Printing.QRCodeVersion[json.qrcodeversion];
                        if (json.quietzone != null) {
                            if (typeof (json.quietzone) == "number")
                                e.quiet_zone = new Neodynamic.SDK.Printing.FrameThickness(json.quietzone, json.quietzone, json.quietzone, json.quietzone);
                            else if (json.quietzone.left != null)
                                e.quiet_zone = new Neodynamic.SDK.Printing.FrameThickness(json.quietzone.left, json.quietzone.top, json.quietzone.right, json.quietzone.bottom);
                            else {
                                var qz_parsed = json.quietzone.split(',');
                                e.quiet_zone = new Neodynamic.SDK.Printing.FrameThickness(qz_parsed[0], qz_parsed[1], qz_parsed[2], qz_parsed[3]);
                            }
                        }
                        if (json.rotationangle != null)
                            e.rotation_angle = json.rotationangle;
                        if (json.segmentsperrow != null)
                            e.segments_per_row = json.segmentsperrow;
                        if (json.sizing != null)
                            e.sizing = Neodynamic.SDK.Printing.BarcodeSizing[json.sizing];
                        if (json.symbology != null)
                            e.symbology = Neodynamic.SDK.Printing.BarcodeSymbology[json.symbology];
                        if (json.telepenencoding != null)
                            e.telepen_encoding = Neodynamic.SDK.Printing.TelepenEncoding[json.telepenencoding];
                        if (json.text != null)
                            e.text = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.text);
                        if (json.textalignment != null)
                            e.text_alignment = Neodynamic.SDK.Printing.BarcodeTextAlignment[json.textalignment];
                        if (json.textfont != null) {
                            e.text_font = Neodynamic.Web.Utils.TLParser.parseFontObject(json.textfont);
                        }
                        if (json.textforecolor != null)
                            e.text_fore_color = Neodynamic.SDK.Printing.Color[json.textforecolor];
                        if (json.textformatpattern != null)
                            e.text_format_pattern = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.textformatpattern);
                        if (json.upcesystem != null)
                            e.upce_system = Neodynamic.SDK.Printing.UpcE[json.upcesystem];
                        if (json.usequietzonefortext != null)
                            e.use_quiet_zone_for_text = json.usequietzonefortext;
                        if (json.uspsfimpattern != null)
                            e.usps_fim_pattern = Neodynamic.SDK.Printing.FIM[json.uspsfimpattern];
                        if (json.uspshorizontalbarscount != null)
                            e.usps_horizontal_bars_count = json.uspshorizontalbarscount;
                        if (json.width != null)
                            e.width = json.width;
                        if (json.gs1datastrictvalidation != null)
                            e.gs1_data_strict_validation = json.gs1datastrictvalidation;
                        if (json.maxicodedrawpixelbasedsymbol != null)
                            e.maxi_code_draw_pixel_based_symbol = json.maxicodedrawpixelbasedsymbol;
                        if (json.dotcodecolumns != null)
                            e.dot_code_columns = json.dotcodecolumns;
                        if (json.dotcodemodulesize != null)
                            e.dot_code_module_size = json.dotcodemodulesize;
                        if (json.dotcodeprocesstilde != null)
                            e.dot_code_process_tilde = json.dotcodeprocesstilde;
                        if (json.dotcoderows != null)
                            e.dot_code_rows = json.dotcoderows;
                        if (json.dotcodeaspectratio != null)
                            e.dot_code_aspect_ratio = json.dotcodeaspectratio;
                        if (json.dotcodemoduleshape != null)
                            e.dot_code_module_shape = Neodynamic.SDK.Printing.DotCodeModuleShape[json.dotcodemoduleshape];
                        if (json.datamatrixincluderectformatsinautomode != null)
                            e.data_matrix_include_rect_formats_in_auto_mode = json.datamatrixincluderectformatsinautomode;
                        if (json.editable != null)
                            e.editable = json.editable;
                        if (json.barcolorhex != null)
                            e.bar_color_hex = json.barcolorhex;
                        if (json.bordercolorhex != null)
                            e.border_color_hex = json.bordercolorhex;
                        if (json.backcolorhex != null)
                            e.back_color_hex = json.backcolorhex;
                        if (json.forecolorhex != null)
                            e.fore_color_hex = json.forecolorhex;
                        if (json.textforecolorhex != null)
                            e.text_fore_color_hex = json.textforecolorhex;
                        if (json.expression != null)
                            e.expression = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.expression);
                        if (json.usecache != null)
                            e.use_cache = json.usecache;
                        if (json.cacheitemid != null)
                            e.cache_item_id = json.cacheitemid;
                        if (json.visible != null)
                            e.visible = json.visible;
                        if (json.code11twodigitschecksum != null)
                            e.code11_two_digits_checksum = json.code11twodigitschecksum;
                        if (json.tlc39micropdf417barwidth != null)
                            e.tlc39_micro_pdf417_bar_width = json.tlc39micropdf417barwidth;
                        if (json.tlc39micropdf417rowbarheight != null)
                            e.tlc39_micro_pdf417_row_bar_height = json.tlc39micropdf417rowbarheight;
                        if (json.righttoleft != null)
                            e.right_to_left = json.righttoleft;
                        if (json.rectmicroqrcodeversion != null)
                            e.rect_microqr_code_version = Neodynamic.SDK.Printing.RectMicroQRCodeVersion[json.rectmicroqrcodeversion];
                        if (json.printasresidentelement != null)
                            e.print_as_resident_element = json.printasresidentelement;
                        if (json.qrcodemask != null)
                            e.qr_code_mask = Neodynamic.SDK.Printing.QRCodeMask[json.qrcodemask];
                        if (json.groupname != null)
                            e.group_name = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.groupname);
                        if (json.resizable != null)
                            e.resizable = json.resizable;
                        if (json.readonly != null)
                            e.read_only = json.readonly;
                        if (json.codeencoding != null)
                            e.code_encoding = Neodynamic.SDK.Printing.CodeEncoding[json.codeencoding];
                        return e;
                    }
                    else if (type == "ImageItem") {
                        e = new Neodynamic.SDK.Printing.ImageItem();
                        e.unit_type = unitType; // unit MUST BE set FIRST!!!
                        if (json.monochromesettings != null) {
                            var mcs = new Neodynamic.SDK.Printing.MonochromeSettings();
                            if (json.monochromesettings.dithermethod != null) {
                                mcs.dither_method = Neodynamic.SDK.Printing.DitherMethod[json.monochromesettings.dithermethod];
                                mcs.threshold = json.monochromesettings.threshold;
                                mcs.reverse_effect = json.monochromesettings.reverseeffect;
                            }
                            else {
                                var cutted_mcs = json.monochromesettings.split(',');
                                mcs.dither_method = Neodynamic.SDK.Printing.DitherMethod[cutted_mcs[0]];
                                mcs.threshold = parseInt(cutted_mcs[1]);
                                mcs.reverse_effect = cutted_mcs[2] == "True" ? true : false;
                            }
                            e.monochrome_settings = mcs;
                        }
                        if (json.source != null) {
                            if (json.source == "Base64")
                                e.source_base64 = json.sourcedata;
                            else if (json.source == "File")
                                e.source_file = json.sourcedata;
                        }
                        else if (json.sourcefile != null) {
                            e.source_file = json.sourcefile;
                            e.source_base64 = json.sourcebase64;
                        }
                        if (json.hideifnotfound != null)
                            e.hide_if_not_found = json.hideifnotfound;
                        if (json.isgrayscaleorblackwhite != null)
                            e.is_grayscale_or_black_white = json.isgrayscaleorblackwhite;
                        if (json.lockaspectratio != null)
                            e.lock_aspect_ratio = (Neodynamic.SDK.Printing.LockAspectRatio)[json.lockaspectratio];
                        if (json.width != null)
                            e.width = json.width;
                        if (json.x != null)
                            e.x = json.x;
                        if (json.y != null)
                            e.y = json.y;
                        if (json.comments != null)
                            e.comments = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.comments);
                        if (json.datafield != null)
                            e.data_field = json.datafield;
                        if (json.datafieldformatstring != null)
                            e.data_field_format_string = json.datafieldformatstring;
                        if (json.height != null)
                            e.height = json.height;
                        if (json.locked != null)
                            e.locked = json.locked;
                        if (json.name != null)
                            e.name = json.name;
                        if (json.printasgraphic != null)
                            e.print_as_graphic = json.printasgraphic;
                        if (json.rotationangle != null)
                            e.rotation_angle = json.rotationangle;
                        if (json.tag != null)
                            e.tag = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.tag);
                        if (json.nameatprinterstorage != null)
                            e.name_at_printer_storage = json.nameatprinterstorage;
                        if (json.sourcedpi != null)
                            e.source_dpi = json.sourcedpi;
                        if (json.editable != null)
                            e.editable = json.editable;
                        if (json.converttomonochrome != null)
                            e.convert_to_monochrome = json.converttomonochrome;
                        if (json.expression != null)
                            e.expression = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.expression);
                        if (json.usecache != null)
                            e.use_cache = json.usecache;
                        if (json.cacheitemid != null)
                            e.cache_item_id = json.cacheitemid;
                        if (json.visible != null)
                            e.visible = json.visible;
                        if (json.groupname != null)
                            e.group_name = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.groupname);
                        if (json.resizable != null)
                            e.resizable = json.resizable;
                        if (json.readonly != null)
                            e.read_only = json.readonly;
                        return e;
                    }
                    else if (type == "LineShapeItem") {
                        e = new Neodynamic.SDK.Printing.LineShapeItem();
                        e.unit_type = unitType; // unit MUST BE set FIRST!!!
                        if (json.comments != null)
                            e.comments = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.comments);
                        if (json.datafield != null)
                            e.data_field = json.datafield;
                        if (json.datafieldformatstring != null)
                            e.data_field_format_string = json.datafieldformatstring;
                        if (json.locked != null)
                            e.locked = json.locked;
                        if (json.name != null)
                            e.name = json.name;
                        if (json.printasgraphic != null)
                            e.print_as_graphic = json.printasgraphic;
                        if (json.strokecolor != null)
                            e.stroke_color = (Neodynamic.SDK.Printing.Color)[json.strokecolor];
                        if (json.strokethickness != null)
                            e.stroke_thickness = json.strokethickness;
                        if (json.tag != null)
                            e.tag = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.tag);
                        if (json.orientation != null)
                            e.orientation = (Neodynamic.SDK.Printing.LineOrientation)[json.orientation];
                        if (json.x != null)
                            e.x = json.x;
                        if (json.y != null)
                            e.y = json.y;
                        if (json.height != null)
                            e.height = json.height;
                        if (json.width != null)
                            e.width = json.width;
                        if (json.editable != null)
                            e.editable = json.editable;
                        if (json.strokecolorhex != null)
                            e.stroke_color_hex = json.strokecolorhex;
                        if (json.expression != null)
                            e.expression = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.expression);
                        if (json.usecache != null)
                            e.use_cache = json.usecache;
                        if (json.cacheitemid != null)
                            e.cache_item_id = json.cacheitemid;
                        if (json.visible != null)
                            e.visible = json.visible;
                        if (json.strokestyle != null)
                            e.stroke_style = (Neodynamic.SDK.Printing.StrokeStyle)[json.strokestyle];
                        if (json.strokestylepattern != null)
                            e.stroke_style_pattern = json.strokestylepattern;
                        if (json.groupname != null)
                            e.group_name = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.groupname);
                        if (json.resizable != null)
                            e.resizable = json.resizable;
                        return e;
                    }
                    else if (type == "TextItem") {
                        e = new Neodynamic.SDK.Printing.TextItem();
                        e.unit_type = unitType; // unit MUST BE set FIRST!!!
                        if (json.comments != null)
                            e.comments = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.comments);
                        if (json.cornerradius != null) {
                            if (typeof (json.cornerradius) == "number")
                                e.corner_radius = new Neodynamic.SDK.Printing.RectangleCornerRadius(json.cornerradius, json.cornerradius, json.cornerradius, json.cornerradius);
                            else if (json.cornerradius.topleft != null)
                                e.corner_radius = new Neodynamic.SDK.Printing.RectangleCornerRadius(json.cornerradius.topleft, json.cornerradius.topright, json.cornerradius.bottomright, json.cornerradius.bottomleft);
                            else {
                                var cr_parsed = json.cornerradius.split(',');
                                e.corner_radius = new Neodynamic.SDK.Printing.RectangleCornerRadius(cr_parsed[0], cr_parsed[1], cr_parsed[2], cr_parsed[3]);
                            }
                        }
                        if (json.datafield != null)
                            e.data_field = json.datafield;
                        if (json.datafieldformatstring != null)
                            e.data_field_format_string = json.datafieldformatstring;
                        if (json.height != null)
                            e.height = json.height;
                        if (json.locked != null)
                            e.locked = json.locked;
                        if (json.name != null)
                            e.name = json.name;
                        if (json.printasgraphic != null)
                            e.print_as_graphic = json.printasgraphic;
                        if (json.rotationangle != null)
                            e.rotation_angle = json.rotationangle;
                        if (json.backcolor != null)
                            e.back_color = (Neodynamic.SDK.Printing.Color)[json.backcolor];
                        if (json.bordercolor != null)
                            e.border_color = (Neodynamic.SDK.Printing.Color)[json.bordercolor];
                        if (json.borderthickness != null) {
                            if (typeof (json.borderthickness) == "number")
                                e.border_thickness = new Neodynamic.SDK.Printing.FrameThickness(json.borderthickness, json.borderthickness, json.borderthickness, json.borderthickness);
                            else if (json.borderthickness.left != null)
                                e.border_thickness = new Neodynamic.SDK.Printing.FrameThickness(json.borderthickness.left, json.borderthickness.top, json.borderthickness.right, json.borderthickness.bottom);
                            else {
                                var bt_parsed = json.borderthickness.split(',');
                                e.border_thickness = new Neodynamic.SDK.Printing.FrameThickness(bt_parsed[0], bt_parsed[1], bt_parsed[2], bt_parsed[3]);
                            }
                        }
                        if (json.counterstep != null)
                            e.counter_step = json.counterstep;
                        if (json.counteruseleadingzeros != null)
                            e.counter_use_leading_zeros = json.counteruseleadingzeros;
                        if (json.culturename != null)
                            e.culture_name = json.culturename;
                        if (json.forecolor != null)
                            e.fore_color = (Neodynamic.SDK.Printing.Color)[json.forecolor];
                        if (json.mask != null)
                            e.mask = json.mask;
                        if (json.maskincrement != null)
                            e.mask_increment = json.maskincrement;
                        if (json.righttoleft != null)
                            e.right_to_left = json.righttoleft;
                        if (json.sizing != null)
                            e.sizing = (Neodynamic.SDK.Printing.TextSizing)[json.sizing];
                        if (json.font != null)
                            e.font = Neodynamic.Web.Utils.TLParser.parseFontObject(json.font);
                        if (json.text != null)
                            e.text = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.text);
                        if (json.textalignment != null)
                            e.text_alignment = (Neodynamic.SDK.Printing.TextAlignment)[json.textalignment];
                        if (json.textpadding != null) {
                            if (typeof (json.textpadding) == "number")
                                e.text_padding = new Neodynamic.SDK.Printing.FrameThickness(json.textpadding, json.textpadding, json.textpadding, json.textpadding);
                            else if (json.textpadding.left != null)
                                e.text_padding = new Neodynamic.SDK.Printing.FrameThickness(json.textpadding.left, json.textpadding.top, json.textpadding.right, json.textpadding.bottom);
                            else {
                                var tp_parsed = json.textpadding.split(',');
                                e.text_padding = new Neodynamic.SDK.Printing.FrameThickness(tp_parsed[0], tp_parsed[1], tp_parsed[2], tp_parsed[3]);
                            }
                        }
                        if (json.maxlength != null)
                            e.max_length = json.maxlength;
                        if (json.tag != null)
                            e.tag = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.tag);
                        if (json.width != null)
                            e.width = json.width;
                        if (json.x != null)
                            e.x = json.x;
                        if (json.y != null)
                            e.y = json.y;
                        if (json.editable != null)
                            e.editable = json.editable;
                        if (json.bordercolorhex != null)
                            e.border_color_hex = json.bordercolorhex;
                        if (json.backcolorhex != null)
                            e.back_color_hex = json.backcolorhex;
                        if (json.forecolorhex != null)
                            e.fore_color_hex = json.forecolorhex;
                        if (json.expression != null)
                            e.expression = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.expression);
                        if (json.inputmaskpattern != null)
                            e.input_mask_pattern = json.inputmaskpattern;
                        if (json.inputmaskpromptchar != null)
                            e.input_mask_prompt_char = json.inputmaskpromptchar;
                        if (json.usecache != null)
                            e.use_cache = json.usecache;
                        if (json.cacheitemid != null)
                            e.cache_item_id = json.cacheitemid;
                        if (json.visible != null)
                            e.visible = json.visible;
                        if (json.strokethickness != null)
                            e.stroke_thickness = json.strokethickness;
                        if (json.strokecolorhex != null)
                            e.stroke_color_hex = json.strokecolorhex;
                        if (json.charspacing != null)
                            e.char_spacing = json.charspacing;
                        if (json.linespacing != null)
                            e.line_spacing = json.linespacing;
                        if (json.hideifempty != null)
                            e.hide_if_empty = json.hideifempty;
                        if (json.groupname != null)
                            e.group_name = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.groupname);
                        if (json.resizable != null)
                            e.resizable = json.resizable;
                        if (json.readonly != null)
                            e.read_only = json.readonly;
                        if (json.validationregex != null)
                            e.validation_regex = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.validationregex);
                        if (json.validationerrormessage != null)
                            e.validation_error_message = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.validationerrormessage);
                        if (json.textverticalalignment != null)
                            e.text_vertical_alignment = (Neodynamic.SDK.Printing.TextVerticalAlignment)[json.textverticalalignment];
                        if (json.multiline != null)
                            e.multiline = json.multiline;
                        if (json.minfontsize != null)
                            e.min_font_size = json.minfontsize;
                        if (json.useslashedzero != null)
                            e.use_slashed_zero = json.useslashedzero;
                        return e;
                    }
                    else if (type == "RFIDTagItem") {
                        e = new Neodynamic.SDK.Printing.RFIDTagItem();
                        e.unit_type = unitType; // unit MUST BE set FIRST!!!
                        if (json.comments != null)
                            e.comments = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.comments);
                        if (json.datafield != null)
                            e.data_field = json.datafield;
                        if (json.datafieldformatstring != null)
                            e.data_field_format_string = json.datafieldformatstring;
                        if (json.name != null)
                            e.name = json.name;
                        if (json.printasgraphic != null)
                            e.print_as_graphic = json.printasgraphic;
                        if (json.tag != null)
                            e.tag = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.tag);
                        if (json.x != null)
                            e.x = json.x;
                        if (json.y != null)
                            e.y = json.y;
                        if (json.locked != null)
                            e.locked = json.locked;
                        if (json.dataformat != null)
                            e.data_format = (Neodynamic.SDK.Printing.RFIDTagDataFormat)[json.dataformat];
                        if (json.datatoencode != null)
                            e.data_to_encode = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.datatoencode);
                        if (json.epcdatastructure != null)
                            e.epc_data_structure = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.epcdatastructure);
                        if (json.editable != null)
                            e.editable = json.editable;
                        if (json.expression != null)
                            e.expression = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.expression);
                        if (json.usecache != null)
                            e.use_cache = json.usecache;
                        if (json.cacheitemid != null)
                            e.cache_item_id = json.cacheitemid;
                        if (json.visible != null)
                            e.visible = json.visible;
                        if (json.groupname != null)
                            e.group_name = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.groupname);
                        if (json.resizable != null)
                            e.resizable = json.resizable;
                        if (json.readonly != null)
                            e.read_only = json.readonly;
                        if (json.tagtype != null)
                            e.tag_type = (Neodynamic.SDK.Printing.RFIDTagType)[json.tagtype];
                        if (json.startingblock != null)
                            e.starting_block = json.startingblock;
                        if (json.numberofbytes != null)
                            e.number_of_bytes = json.numberofbytes;
                        if (json.memorybank != null)
                            e.memory_bank = json.memorybank;
                        if (json.accesspassword != null)
                            e.access_password = json.accesspassword;
                        if (json.killpassword != null)
                            e.kill_password = json.killpassword;
                        return e;
                    }
                    else if (type == "RepeaterItem") {
                        e = new Neodynamic.SDK.Printing.RepeaterItem();
                        e.unit_type = unitType; // unit MUST BE set FIRST!!!
                        if (json.comments != null)
                            e.comments = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.comments);
                        if (json.datafield != null)
                            e.data_field = json.datafield;
                        if (json.datafieldformatstring != null)
                            e.data_field_format_string = json.datafieldformatstring;
                        if (json.height != null)
                            e.height = json.height;
                        if (json.locked != null)
                            e.locked = json.locked;
                        if (json.name != null)
                            e.name = json.name;
                        if (json.printasgraphic != null)
                            e.print_as_graphic = json.printasgraphic;
                        if (json.rotationangle != null)
                            e.rotation_angle = json.rotationangle;
                        if (json.count != null)
                            e.count = json.count;
                        if (json.tag != null)
                            e.tag = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.tag);
                        if (json.width != null)
                            e.width = json.width;
                        if (json.x != null)
                            e.x = json.x;
                        if (json.y != null)
                            e.y = json.y;
                        if (json.editable != null)
                            e.editable = json.editable;
                        if (json.expression != null)
                            e.expression = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.expression);
                        if (json.usecache != null)
                            e.use_cache = json.usecache;
                        if (json.cacheitemid != null)
                            e.cache_item_id = json.cacheitemid;
                        if (json.visible != null)
                            e.visible = json.visible;
                        if (json.groupname != null)
                            e.group_name = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.groupname);
                        if (json.resizable != null)
                            e.resizable = json.resizable;
                        if (json.readonly != null)
                            e.read_only = json.readonly;
                        return e;
                    }
                    else if (type == "TableShapeItem") {
                        e = new Neodynamic.SDK.Printing.TableShapeItem();
                        e.unit_type = unitType; // unit MUST BE set FIRST!!!
                        if (json.comments != null)
                            e.comments = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.comments);
                        if (json.cornerradius != null) {
                            if (typeof (json.cornerradius) == "number")
                                e.corner_radius = new Neodynamic.SDK.Printing.RectangleCornerRadius(json.cornerradius, json.cornerradius, json.cornerradius, json.cornerradius);
                            else if (json.cornerradius.topleft != null)
                                e.corner_radius = new Neodynamic.SDK.Printing.RectangleCornerRadius(json.cornerradius.topleft, json.cornerradius.topright, json.cornerradius.bottomright, json.cornerradius.bottomleft);
                            else {
                                var cr_parsed = json.cornerradius.split(',');
                                e.corner_radius = new Neodynamic.SDK.Printing.RectangleCornerRadius(cr_parsed[0], cr_parsed[1], cr_parsed[2], cr_parsed[3]);
                            }
                        }
                        if (json.datafield != null)
                            e.data_field = json.datafield;
                        if (json.datafieldformatstring != null)
                            e.data_field_format_string = json.datafieldformatstring;
                        if (json.fillcolor != null)
                            e.fill_color = Neodynamic.SDK.Printing.Color[json.fillcolor];
                        if (json.height != null)
                            e.height = json.height;
                        if (json.locked != null)
                            e.locked = json.locked;
                        if (json.name != null)
                            e.name = json.name;
                        if (json.printasgraphic != null)
                            e.print_as_graphic = json.printasgraphic;
                        if (json.rotationangle != null)
                            e.rotation_angle = json.rotationangle;
                        if (json.strokecolor != null)
                            e.stroke_color = (Neodynamic.SDK.Printing.Color)[json.strokecolor];
                        if (json.strokethickness != null)
                            e.stroke_thickness = json.strokethickness;
                        if (json.tag != null)
                            e.tag = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.tag);
                        if (json.width != null)
                            e.width = json.width;
                        if (json.x != null)
                            e.x = json.x;
                        if (json.y != null)
                            e.y = json.y;
                        if (json.editable != null)
                            e.editable = json.editable;
                        if (json.fillcolorhex != null)
                            e.fill_color_hex = json.fillcolorhex;
                        if (json.strokecolorhex != null)
                            e.stroke_color_hex = json.strokecolorhex;
                        if (json.columnslinevisible != null)
                            e.columns_line_visible = json.columnslinevisible;
                        if (json.rowslinevisible != null)
                            e.rows_line_visible = json.rowslinevisible;
                        if (json.columns || json.columns.column) {
                            var columns = json.columns.column ? json.columns.column : json.columns;
                            for (var i = 0; i < columns.length; i++) {
                                var parsed_col = Neodynamic.Web.Utils.TLParser.parseTableColumn(columns[i]);
                                if (parsed_col)
                                    e.columns.push(parsed_col);
                            }
                        }
                        if (json.rows || json.rows.row) {
                            var rows = json.rows.row ? json.rows.row : json.rows;
                            for (var i = 0; i < rows.length; i++) {
                                var parsed_row = Neodynamic.Web.Utils.TLParser.parseTableRow(rows[i]);
                                if (parsed_row)
                                    e.rows.push(parsed_row);
                            }
                        }
                        if (json.expression != null)
                            e.expression = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.expression);
                        if (json.usecache != null)
                            e.use_cache = json.usecache;
                        if (json.cacheitemid != null)
                            e.cache_item_id = json.cacheitemid;
                        if (json.visible != null)
                            e.visible = json.visible;
                        if (json.strokestyle != null)
                            e.stroke_style = (Neodynamic.SDK.Printing.StrokeStyle)[json.strokestyle];
                        if (json.strokestylepattern != null)
                            e.stroke_style_pattern = json.strokestylepattern;
                        if (json.groupname != null)
                            e.group_name = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.groupname);
                        if (json.resizable != null)
                            e.resizable = json.resizable;
                        if (json.readonly != null)
                            e.read_only = json.readonly;
                        return e;
                    }
                    else if (type == "LiteralItem") {
                        e = new Neodynamic.SDK.Printing.LiteralItem();
                        e.unit_type = unitType; // unit MUST BE set FIRST!!!
                        if (json.comments != null)
                            e.comments = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.comments);
                        if (json.datafield != null)
                            e.data_field = json.datafield;
                        if (json.datafieldformatstring != null)
                            e.data_field_format_string = json.datafieldformatstring;
                        if (json.name != null)
                            e.name = json.name;
                        if (json.printasgraphic != null)
                            e.print_as_graphic = json.printasgraphic;
                        if (json.tag != null)
                            e.tag = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.tag);
                        if (json.x != null)
                            e.x = json.x;
                        if (json.y != null)
                            e.y = json.y;
                        if (json.locked != null)
                            e.locked = json.locked;
                        if (json.text != null)
                            e.text = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.text);
                        if (json.editable != null)
                            e.editable = json.editable;
                        if (json.expression != null)
                            e.expression = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.expression);
                        if (json.usecache != null)
                            e.use_cache = json.usecache;
                        if (json.cacheitemid != null)
                            e.cache_item_id = json.cacheitemid;
                        if (json.visible != null)
                            e.visible = json.visible;
                        if (json.groupname != null)
                            e.group_name = Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.groupname);
                        if (json.resizable != null)
                            e.resizable = json.resizable;
                        if (json.readonly != null)
                            e.read_only = json.readonly;
                        return e;
                    }
                    throw "Object not supported";
                };
                TLParser.parseExpression = function (json) {
                    if (json.code)
                        return Neodynamic.Web.Utils.NamingUtils.convertXMLUCS2ToChar(json.code);
                    return json;
                };
                TLParser.parsePage = function (json) {
                    var e = new Neodynamic.SDK.Printing.ThermalLabelPage();
                    if (json.width != null)
                        e.width = json.width;
                    if (json.height != null)
                        e.height = json.height;
                    if (json.x != null)
                        e.x = json.x;
                    if (json.y != null)
                        e.y = json.y;
                    return e;
                };
                TLParser.parseTableColumn = function (json) {
                    var e = new Neodynamic.SDK.Printing.TableColumn();
                    if (json.width != null)
                        e.width = json.width;
                    if (json.fillcolor != null)
                        e.fill_color = Neodynamic.SDK.Printing.Color[json.fillcolor];
                    if (json.fillcolorhex != null)
                        e.fill_color_hex = json.fillcolorhex;
                    return e;
                };
                TLParser.parseTableRow = function (json) {
                    var e = new Neodynamic.SDK.Printing.TableRow();
                    if (json.height != null)
                        e.height = json.height;
                    if (json.fillcolor != null)
                        e.fill_color = Neodynamic.SDK.Printing.Color[json.fillcolor];
                    if (json.fillcolorhex != null)
                        e.fill_color_hex = json.fillcolorhex;
                    return e;
                };
                // https://stackoverflow.com/a/36280878
                TLParser.JsonConvertKeysToLowerCase = function (obj) {
                    var output = {};
                    for (var i in obj) {
                        if (Object.prototype.toString.apply(obj[i]) === '[object Object]') {
                            output[i.toLowerCase()] = TLParser.JsonConvertKeysToLowerCase(obj[i]);
                        }
                        else if (Object.prototype.toString.apply(obj[i]) === '[object Array]' && i != 'expressions') {
                            output[i.toLowerCase()] = [];
                            for (var j = 0; j < obj[i].length; j++) {
                                output[i.toLowerCase()].push(TLParser.JsonConvertKeysToLowerCase(obj[i][j]));
                            }
                        }
                        else {
                            output[i.toLowerCase()] = obj[i];
                        }
                    }
                    return output;
                };
                ;
                return TLParser;
            }());
            Utils_1.TLParser = TLParser;
        })(Utils = Web.Utils || (Web.Utils = {}));
    })(Web = Neodynamic.Web || (Neodynamic.Web = {}));
})(Neodynamic || (Neodynamic = {}));
var Neodynamic;
(function (Neodynamic) {
    var Web;
    (function (Web) {
        var Utils;
        (function (Utils) {
            var MaskEditUtils = /** @class */ (function () {
                function MaskEditUtils() {
                }
                //public static getCaretPosition = function (ctrl) {
                //    var caretPos = 0;
                //    if (ctrl.selectionStart || ctrl.selectionStart === 0) {// Standard.
                //        caretPos = ctrl.selectionStart;
                //    }
                //    else if ((document as any).selection) {// Legacy IE
                //        ctrl.focus();
                //        var Sel = (document as any).selection.createRange();
                //        Sel.moveStart('character', -ctrl.value.length);
                //        caretPos = Sel.text.length;
                //    }
                //    return caretPos;
                //};
                MaskEditUtils.setCaretPosition = function (ctrl, pos) {
                    if (ctrl.setSelectionRange) {
                        ctrl.focus();
                        ctrl.setSelectionRange(pos, pos);
                    }
                    else if (ctrl.createTextRange) {
                        var range = ctrl.createTextRange();
                        range.collapse(true);
                        range.moveEnd('character', pos);
                        range.moveStart('character', pos);
                        range.select();
                    }
                };
                MaskEditUtils.getMaskElements = function () {
                    var maskElements = [];
                    maskElements['0'] = /[0-9]/;
                    maskElements['9'] = /[0-9 ]/;
                    maskElements['#'] = /[0-9 ] +-]/;
                    maskElements['L'] = /[a-zA-Z]/;
                    maskElements['?'] = /[a-zA-Z ]/;
                    maskElements['&'] = /[^\x7f ]+/;
                    maskElements['C'] = /[^\x7f]+/;
                    maskElements['A'] = /[0-9a-zA-Z]/;
                    maskElements['a'] = /[0-9a-zA-Z ]/;
                    return maskElements;
                };
                MaskEditUtils.masking = function (inputCtrl, mask, promptChar) {
                    //let cPos = MaskEditUtils.getCaretPosition(inputCtrl);
                    var pchar = promptChar ? promptChar : '_';
                    var value = inputCtrl.value;
                    var map = MaskEditUtils.getMaskElements();
                    var r = [];
                    for (var i = 0; i < mask.length; i++) {
                        var char = mask.charAt(i);
                        if (map[char]) {
                            r.push(pchar);
                        }
                        else if (char !== '>' && char !== '<' && char !== '|' && char !== '\\') {
                            r.push(char);
                        }
                        else if (char === '\\') {
                            if (i + 1 < mask.length && map[mask.charAt(i + 1)]) {
                                r.push(mask.charAt(i + 1));
                                i++;
                            }
                            else {
                                r.push(char);
                            }
                        }
                    }
                    if (value.length > 0) {
                        var ucase = false;
                        var lcase = false;
                        var literal = false;
                        var j = 0;
                        for (var i = 0; i < mask.length; i++) {
                            var char = mask.charAt(i);
                            if (char === '>') {
                                ucase = true;
                                lcase = false;
                                continue;
                            }
                            else if (char === '<') {
                                ucase = false;
                                lcase = true;
                                continue;
                            }
                            else if (char === '|') {
                                ucase = false;
                                lcase = false;
                                continue;
                            }
                            else if (char === '\\') {
                                if (i + 1 < mask.length && map[mask.charAt(i + 1)]) {
                                    literal = true;
                                    continue;
                                }
                                else {
                                    literal = false;
                                }
                            }
                            if (j < value.length) {
                                var charVal = value.charAt(j);
                                if (map[char] && !literal) {
                                    if (map[char].test(charVal)) {
                                        if (ucase)
                                            r[j] = charVal.toUpperCase();
                                        else if (lcase)
                                            r[j] = charVal.toLowerCase();
                                        else
                                            r[j] = charVal;
                                    }
                                    else {
                                        if (charVal !== pchar && charVal !== ' ') {
                                            break;
                                        }
                                    }
                                    j++;
                                }
                                else {
                                    if (literal)
                                        literal = false;
                                    if (char === charVal) {
                                        if (ucase)
                                            r[j] = charVal.toUpperCase();
                                        else if (lcase)
                                            r[j] = charVal.toLowerCase();
                                        else
                                            r[j] = charVal;
                                    }
                                    else {
                                        if (charVal !== pchar && charVal !== ' ') {
                                            break;
                                        }
                                    }
                                    j++;
                                }
                            }
                        }
                    }
                    inputCtrl.value = r.join('');
                    var cPos = inputCtrl.value.indexOf(pchar);
                    if (cPos < 0)
                        cPos = inputCtrl.value.length;
                    MaskEditUtils.setCaretPosition(inputCtrl, cPos);
                };
                MaskEditUtils.getMaskedData = function (inputCtrl, promptChar) {
                    var val = inputCtrl.value;
                    if (val && val.indexOf(promptChar) < 0)
                        return val;
                    else
                        return '';
                };
                return MaskEditUtils;
            }());
            Utils.MaskEditUtils = MaskEditUtils;
        })(Utils = Web.Utils || (Web.Utils = {}));
    })(Web = Neodynamic.Web || (Neodynamic.Web = {}));
})(Neodynamic || (Neodynamic = {}));
var Neodynamic;
(function (Neodynamic) {
    var Web;
    (function (Web) {
        var Utils;
        (function (Utils) {
            var TextUtils = /** @class */ (function () {
                function TextUtils() {
                }
                TextUtils.isEmpty = function (value) {
                    return (!value || 0 === value.length);
                };
                return TextUtils;
            }());
            Utils.TextUtils = TextUtils;
        })(Utils = Web.Utils || (Web.Utils = {}));
    })(Web = Neodynamic.Web || (Neodynamic.Web = {}));
})(Neodynamic || (Neodynamic = {}));
/// <reference path="../../sdk/printing/enums.ts" />
var Neodynamic;
(function (Neodynamic) {
    var Web;
    (function (Web) {
        var Utils;
        (function (Utils) {
            var BarcodeItemUtils = /** @class */ (function () {
                function BarcodeItemUtils() {
                }
                BarcodeItemUtils.getRelatedProperties = function (symbology) {
                    var props = [];
                    //Add general properties
                    props.push("name");
                    props.push("x");
                    props.push("y");
                    props.push("data_field");
                    props.push("data_field_format_string");
                    props.push("cache_item_id");
                    props.push("use_cache");
                    props.push("print_as_graphic");
                    props.push("comments");
                    props.push("tag");
                    props.push("back_color");
                    props.push("bar_color");
                    props.push("barcode_alignment");
                    props.push("barcode_padding");
                    props.push("border_color");
                    props.push("border_thickness");
                    props.push("code_alignment");
                    props.push("corner_radius");
                    props.push("counter_step");
                    props.push("counter_use_leading_zeros");
                    props.push("display_code");
                    props.push("font");
                    props.push("fore_color");
                    props.push("height");
                    props.push("human_readable_text");
                    props.push("mask");
                    props.push("mask_increment");
                    props.push("quiet_zone");
                    props.push("rotation_angle");
                    props.push("sizing");
                    props.push("text");
                    props.push("text_alignment");
                    props.push("text_font");
                    props.push("text_fore_color");
                    props.push("use_quiet_zone_for_text");
                    props.push("width");
                    props.push("hide_if_empty");
                    props.push("code_format_pattern");
                    props.push("text_format_pattern");
                    props.push("error_behavior");
                    props.push("locked");
                    props.push("editable");
                    props.push("back_color_hex");
                    props.push("bar_color_hex");
                    props.push("fore_color_hex");
                    props.push("text_fore_color_hex");
                    props.push("border_color_hex");
                    props.push("expression");
                    props.push("code");
                    props.push("code_encoding");
                    props.push("visible");
                    props.push("right_to_left");
                    props.push("print_as_resident_element");
                    //Add specific properties
                    switch (symbology) {
                        case Neodynamic.SDK.Printing.BarcodeSymbology.AustraliaPost:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.RoyalTpgPostKix:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.SingaporePost:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.RoyalMail:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.UspsOneCode4CB:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.UspsIntelligentMail:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.JapanPost:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Mailmark4StateC:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Mailmark4StateL:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.DAFT:
                            props.push("postal_4_state_tracker_bar_height");
                            props.push("postal_4_state_tracker_bar_width");
                            props.push("postal_4_state_bars_spacing");
                            if (symbology == Neodynamic.SDK.Printing.BarcodeSymbology.RoyalMail || symbology == Neodynamic.SDK.Printing.BarcodeSymbology.SingaporePost) {
                                props.push("postal_4_state_add_start_stop_char");
                                props.push("add_checksum");
                                props.push("display_checksum");
                            }
                            props.push("bar_width_adjustment");
                            break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Codabar:
                            props.push("bar_height");
                            props.push("bar_width");
                            props.push("bar_ratio");
                            props.push("codabar_start_char");
                            props.push("codabar_stop_char");
                            props.push("add_checksum");
                            props.push("display_checksum");
                            props.push("display_start_stop_char");
                            props.push("bar_width_adjustment");
                            break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Code11:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Industrial2of5:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Interleaved2of5:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Msi:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Itf14:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Opc:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Pzn:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.UspsSackLabel:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.UspsTrayLabel:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.ItalianPost25:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Matrix2of5:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.EanUpcAddOn2:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.EanUpcAddOn5:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.IATA2of5:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Dun14Itf:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.DataLogic2of5:
                            //case Neodynamic.SDK.Printing.BarcodeSymbology.ChannelCode:
                            props.push("bar_height");
                            props.push("bar_width");
                            props.push("bar_ratio");
                            if (symbology != Neodynamic.SDK.Printing.BarcodeSymbology.Itf14 && symbology != Neodynamic.SDK.Printing.BarcodeSymbology.Opc && symbology != Neodynamic.SDK.Printing.BarcodeSymbology.UspsSackLabel && symbology != Neodynamic.SDK.Printing.BarcodeSymbology.UspsTrayLabel && symbology != Neodynamic.SDK.Printing.BarcodeSymbology.ItalianPost25 && symbology != Neodynamic.SDK.Printing.BarcodeSymbology.Dun14Itf && symbology != Neodynamic.SDK.Printing.BarcodeSymbology.DataLogic2of5) // && symbology != Neodynamic.SDK.Printing.BarcodeSymbology.ChannelCode)
                             {
                                props.push("add_checksum");
                                props.push("display_checksum");
                            }
                            if (symbology == Neodynamic.SDK.Printing.BarcodeSymbology.Itf14 ||
                                symbology == Neodynamic.SDK.Printing.BarcodeSymbology.Dun14Itf) {
                                props.push("itf14_left_h_mark");
                                props.push("itf14_right_h_mark");
                            }
                            if (symbology == Neodynamic.SDK.Printing.BarcodeSymbology.Msi) {
                                props.push("msi_checksum");
                            }
                            //if (symbology == Neodynamic.SDK.Printing.BarcodeSymbology.ChannelCode)
                            //{
                            //    props.push(pnlChannelCode");
                            //    props.push(pnlBarRatio.Visible = false;
                            //}
                            if (symbology == Neodynamic.SDK.Printing.BarcodeSymbology.Code11) {
                                props.push("code11_two_digits_checksum");
                            }
                            props.push("bar_width_adjustment");
                            break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Code128:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.UspsPicCode128:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.AustraliaPostDomesticEParcelBarcode:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.DeutschePostBzl:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.DPDCode:
                            props.push("bar_height");
                            props.push("bar_width");
                            if (symbology == Neodynamic.SDK.Printing.BarcodeSymbology.Code128 ||
                                symbology == Neodynamic.SDK.Printing.BarcodeSymbology.DPDCode) {
                                props.push("code128_char_set");
                            }
                            props.push("bar_width_adjustment");
                            break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Code16k:
                            props.push("bar_height");
                            props.push("bar_width");
                            props.push("code16_k_mode");
                            break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Code39:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Code93:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.HibcLic39:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.HibcPas39:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.DanishPostal39:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.FrenchPostal39AR:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.DhlAwb:
                            props.push("bar_height");
                            props.push("bar_width");
                            if (symbology != Neodynamic.SDK.Printing.BarcodeSymbology.Code93) {
                                props.push("bar_ratio");
                                props.push("code39_full_ascii_mode");
                            }
                            else {
                                props.push("code93_full_ascii_mode");
                            }
                            if (symbology != Neodynamic.SDK.Printing.BarcodeSymbology.HibcLic39 && symbology != Neodynamic.SDK.Printing.BarcodeSymbology.HibcPas39) {
                                if (symbology != Neodynamic.SDK.Printing.BarcodeSymbology.DanishPostal39 && symbology != Neodynamic.SDK.Printing.BarcodeSymbology.FrenchPostal39AR) {
                                    props.push("add_checksum");
                                }
                                props.push("display_checksum");
                                props.push("display_start_stop_char");
                            }
                            else {
                                props.push("hibc_format_human_readable_text");
                            }
                            props.push("bar_width_adjustment");
                            break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.DataMatrix:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataMatrix:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Ppn:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.IFAsecurPharm:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.HibcLicDataMatrix:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.HibcPasDataMatrix:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Isbt128DataMatrix:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.DeutschePostResponsePlusPostMatrix:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.MailmarkCMDM:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.DINSpecDataMatrix:
                            //case Neodynamic.SDK.Printing.BarcodeSymbology.Pharmacode2D:
                            props.push("data_matrix_module_size");
                            if (symbology != Neodynamic.SDK.Printing.BarcodeSymbology.MailmarkCMDM)
                                props.push("data_matrix_encoding");
                            props.push("data_matrix_format");
                            if (symbology == Neodynamic.SDK.Printing.BarcodeSymbology.DataMatrix || symbology == Neodynamic.SDK.Printing.BarcodeSymbology.DeutschePostResponsePlusPostMatrix || Neodynamic.SDK.Printing.BarcodeSymbology.DINSpecDataMatrix)
                                props.push("data_matrix_process_tilde");
                            if (symbology == Neodynamic.SDK.Printing.BarcodeSymbology.HibcPasDataMatrix ||
                                symbology == Neodynamic.SDK.Printing.BarcodeSymbology.HibcLicDataMatrix) {
                                props.push("hibc_format_human_readable_text");
                                props.push("hibc_use_iso_iec_15434_encoding");
                            }
                            if (symbology == Neodynamic.SDK.Printing.BarcodeSymbology.Isbt128DataMatrix)
                                props.push("isbt_128_data_structure");
                            if (symbology == Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataMatrix)
                                props.push("gs1_data_strict_validation");
                            //if (symbology == Neodynamic.SDK.Printing.BarcodeSymbology.Pharmacode2D)
                            //{
                            //    props.push(pnlPh2DColorFields.Visible = props.push(pnlPh2DTriggerMark.Visible = props.push(gbPh2DCF1to4.Visible = props.push(gbPh2DCF5to8");
                            //}
                            props.push("data_matrix_include_rect_formats_in_auto_mode");
                            break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.DeutschePostIdentcode:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.DeutschePostLeitcode:
                            props.push("bar_height");
                            props.push("bar_width");
                            props.push("bar_ratio");
                            props.push("bar_width_adjustment");
                            break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.NumlyNumber:
                            props.push("bar_width");
                            props.push("bar_width_adjustment");
                            break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Scc14:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Sscc18:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.UccEan128:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.SwissPostParcel:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.UspsPicUccEan128:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.FedExGround96:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.VicsBol:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.VicsScacPro:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1128:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.UspsIntelligentMailContainerBarcode:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1128CCA:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1128CCB:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1128CCC:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.UccEan128CCA:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.UccEan128CCB:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.UccEan128CCC:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Ean14:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Dun14Ean:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.UspsIntelligentMailPackageBarcode:
                            props.push("bar_height");
                            props.push("bar_width");
                            props.push("bar_width_adjustment");
                            var strSymb = Neodynamic.SDK.Printing.BarcodeSymbology[symbology];
                            if (strSymb.indexOf("CCA", strSymb.length - "CCA".length) >= 0 ||
                                strSymb.indexOf("CCB", strSymb.length - "CCB".length) >= 0 ||
                                strSymb.indexOf("CCC", strSymb.length - "CCC".length) >= 0) {
                                props.push("bar_ratio");
                            }
                            props.push("gs1_data_strict_validation");
                            break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Pdf417:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.CompactPdf417:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.MacroPdf417:
                            props.push("bar_width");
                            props.push("bar_ratio");
                            props.push("pdf417_columns");
                            props.push("pdf417_rows");
                            props.push("pdf417_error_correction_level");
                            props.push("pdf417_compaction_type");
                            if (symbology != Neodynamic.SDK.Printing.BarcodeSymbology.CompactPdf417)
                                props.push("pdf_417_truncated");
                            props.push("pdf_417_aspect_ratio");
                            if (symbology == Neodynamic.SDK.Printing.BarcodeSymbology.MacroPdf417) {
                                props.push("pdf417_file_id");
                                props.push("pdf417_segment_count");
                                props.push("pdf417_segment_index");
                            }
                            props.push("pdf417_process_tilde");
                            break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.MicroPdf417:
                            props.push("micropdf417_version");
                            props.push("bar_width");
                            props.push("bar_ratio");
                            props.push("pdf417_compaction_type");
                            props.push("pdf417_file_id");
                            props.push("pdf417_segment_count");
                            props.push("pdf417_segment_index");
                            props.push("pdf417_process_tilde");
                            break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Planet:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Postnet:
                            props.push("bar_width");
                            props.push("bar_ratio");
                            props.push("add_checksum");
                            props.push("display_checksum");
                            if (symbology == Neodynamic.SDK.Printing.BarcodeSymbology.Planet) {
                                props.push("planet_height_tall_bar");
                                props.push("planet_height_short_bar");
                            }
                            else {
                                props.push("postnet_height_tall_bar");
                                props.push("postnet_height_short_bar");
                            }
                            props.push("bar_width_adjustment");
                            break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Ean13:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Ean8:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Ean99:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.EanVelocity:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Isbn:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Ismn:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Issn:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Jan13:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Jan8:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.UpcA:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.UpcE:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Ean13CCA:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Ean13CCB:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Ean8CCA:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Ean8CCB:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.UpcACCA:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.UpcACCB:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.UpcECCA:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.UpcECCB:
                            props.push("bar_height");
                            props.push("bar_width");
                            props.push("ean_upc_display_light_margin_indicator");
                            props.push("ean_upc_guard_bar");
                            props.push("ean_upc_guard_bar_height");
                            props.push("ean_upc_supplement");
                            props.push("ean_upc_supplement_code");
                            props.push("ean_upc_supplement_separation");
                            props.push("ean_upc_supplement_top_margin");
                            if (symbology == Neodynamic.SDK.Printing.BarcodeSymbology.UpcE ||
                                symbology == Neodynamic.SDK.Printing.BarcodeSymbology.UpcECCA ||
                                symbology == Neodynamic.SDK.Printing.BarcodeSymbology.UpcECCB)
                                props.push("upce_system");
                            var strSymb = Neodynamic.SDK.Printing.BarcodeSymbology[symbology];
                            if (strSymb.indexOf("CCA", strSymb.length - "CCA".length) >= 0 ||
                                strSymb.indexOf("CCB", strSymb.length - "CCB".length) >= 0) {
                                props.push("bar_ratio");
                                props.push("gs1_data_strict_validation");
                            }
                            props.push("bar_width_adjustment");
                            props.push("ean_upc_magnification_factor");
                            break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.QRCode:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.MicroQRCode:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1QRCode:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.HibcLicQRCode:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.HibcPasQRCode:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.SwissQRCode:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.EPCQRCode:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.DINSpecQRCode:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.RectMicroQRCode:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1RectMicroQRCode:
                            props.push("qr_code_module_size");
                            props.push("qr_code_error_correction_level");
                            props.push("qr_code_encoding");
                            props.push("qr_code_byte_encoding_name");
                            props.push("qr_code_mask");
                            if (symbology == Neodynamic.SDK.Printing.BarcodeSymbology.MicroQRCode) {
                                props.push("microqr_code_version");
                            }
                            else if (symbology == Neodynamic.SDK.Printing.BarcodeSymbology.RectMicroQRCode ||
                                symbology == Neodynamic.SDK.Printing.BarcodeSymbology.GS1RectMicroQRCode) {
                                props.push("rect_microqr_code_version");
                            }
                            else {
                                props.push("qr_code_version");
                            }
                            if (symbology == Neodynamic.SDK.Printing.BarcodeSymbology.GS1QRCode || symbology == Neodynamic.SDK.Printing.BarcodeSymbology.MicroQRCode || symbology == Neodynamic.SDK.Printing.BarcodeSymbology.SwissQRCode || symbology == Neodynamic.SDK.Printing.BarcodeSymbology.EPCQRCode || symbology == Neodynamic.SDK.Printing.BarcodeSymbology.DINSpecQRCode || symbology == Neodynamic.SDK.Printing.BarcodeSymbology.RectMicroQRCode || symbology == Neodynamic.SDK.Printing.BarcodeSymbology.GS1RectMicroQRCode)
                                props.push("qr_code_process_tilde");
                            if (symbology == Neodynamic.SDK.Printing.BarcodeSymbology.HibcPasQRCode ||
                                symbology == Neodynamic.SDK.Printing.BarcodeSymbology.HibcLicQRCode) {
                                props.push("hibc_format_human_readable_text");
                                props.push("hibc_use_iso_iec_15434_encoding");
                            }
                            if (symbology == Neodynamic.SDK.Printing.BarcodeSymbology.GS1QRCode || symbology == Neodynamic.SDK.Printing.BarcodeSymbology.GS1RectMicroQRCode)
                                props.push("gs1_data_strict_validation");
                            break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.UspsFim:
                            props.push("bar_height");
                            props.push("bar_width");
                            props.push("usps_fim_pattern");
                            for (var i = 0; i < props.length; i++) {
                                if (props[i] === "code" || props[i] === "display_code") {
                                    props.splice(i, 1);
                                }
                            }
                            break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.UspsHorizontalBars:
                            props.push("bar_height");
                            props.push("bar_width");
                            props.push("usps_horizontal_bars_count");
                            for (var i = 0; i < props.length; i++) {
                                if (props[i] === "code" || props[i] === "display_code") {
                                    props.splice(i, 1);
                                }
                            }
                            break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Telepen:
                            props.push("bar_height");
                            props.push("bar_width");
                            props.push("telepen_encoding");
                            props.push("bar_width_adjustment");
                            break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Pharmacode:
                            props.push("pharmacode_bars_spacing");
                            props.push("pharmacode_thick_bar_width");
                            props.push("pharmacode_thin_bar_width");
                            break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Semacode:
                            props.push("data_matrix_module_size");
                            break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Code32:
                            props.push("bar_height");
                            props.push("bar_width");
                            props.push("bar_ratio");
                            props.push("bar_width_adjustment");
                            break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.AztecCode:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.HibcPasAztecCode:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.HibcLicAztecCode:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1AztecCode:
                            props.push("aztec_code_module_size");
                            props.push("aztec_code_error_correction");
                            props.push("aztec_code_format");
                            if (symbology == Neodynamic.SDK.Printing.BarcodeSymbology.AztecCode || symbology == Neodynamic.SDK.Printing.BarcodeSymbology.GS1AztecCode)
                                props.push("aztec_code_process_tilde");
                            if (symbology == Neodynamic.SDK.Printing.BarcodeSymbology.HibcPasAztecCode ||
                                symbology == Neodynamic.SDK.Printing.BarcodeSymbology.HibcLicAztecCode) {
                                props.push("hibc_format_human_readable_text");
                                props.push("hibc_use_iso_iec_15434_encoding");
                            }
                            if (symbology == Neodynamic.SDK.Printing.BarcodeSymbology.GS1AztecCode)
                                props.push("gs1_data_strict_validation");
                            break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Isbt128:
                            props.push("bar_height");
                            props.push("bar_width");
                            props.push("isbt_128_data_structure");
                            props.push("bar_width_adjustment");
                            break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.HibcLic128:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.HibcPas128:
                            props.push("bar_height");
                            props.push("bar_width");
                            props.push("code128_char_set");
                            props.push("hibc_format_human_readable_text");
                            props.push("bar_width_adjustment");
                            break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.MaxiCode:
                            props.push("maxi_code_mode");
                            props.push("maxi_code_symbol_count");
                            props.push("maxi_code_symbol_index");
                            props.push("maxi_code_process_tilde");
                            props.push("maxi_code_draw_pixel_based_symbol");
                            break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBarOmnidirectional:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBar14:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Rss14:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBarTruncated:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBar14Truncated:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Rss14Truncated:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBarStacked:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBar14Stacked:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Rss14Stacked:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBarStackedOmnidirectional:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBar14StackedOmnidirectional:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Rss14StackedOmnidirectional:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBarLimited:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.RssLimited:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBarExpanded:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.RssExpanded:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBarExpandedStacked:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.RssExpandedStacked:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBar14CCA:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBar14CCB:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBar14StackedCCA:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBar14StackedCCB:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBar14StackedOmnidirectionalCCA:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBar14StackedOmnidirectionalCCB:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBar14TruncatedCCA:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBar14TruncatedCCB:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBarExpandedCCA:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBarExpandedCCB:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBarExpandedStackedCCA:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBarExpandedStackedCCB:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBarLimitedCCA:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBarLimitedCCB:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBarOmnidirectionalCCA:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBarOmnidirectionalCCB:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBarStackedCCA:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBarStackedCCB:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBarStackedOmnidirectionalCCA:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBarStackedOmnidirectionalCCB:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBarTruncatedCCA:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBarTruncatedCCB:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Rss14CCA:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Rss14CCB:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Rss14StackedCCA:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Rss14StackedCCB:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Rss14StackedOmnidirectionalCCA:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Rss14StackedOmnidirectionalCCB:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Rss14TruncatedCCA:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Rss14TruncatedCCB:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.RssExpandedCCA:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.RssExpandedCCB:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.RssExpandedStackedCCA:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.RssExpandedStackedCCB:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.RssLimitedCCA:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.RssLimitedCCB:
                            props.push("bar_width");
                            props.push("bar_width_adjustment");
                            if (symbology != Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBarStacked &&
                                symbology != Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBar14Stacked &&
                                symbology != Neodynamic.SDK.Printing.BarcodeSymbology.Rss14Stacked &&
                                symbology != Neodynamic.SDK.Printing.BarcodeSymbology.Rss14StackedCCA &&
                                symbology != Neodynamic.SDK.Printing.BarcodeSymbology.Rss14StackedCCB &&
                                symbology != Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBarStackedCCA &&
                                symbology != Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBarStackedCCB &&
                                symbology != Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBar14StackedCCA &&
                                symbology != Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBar14StackedCCB) {
                                props.push("bar_height");
                            }
                            if (symbology == Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBarExpandedStacked ||
                                symbology == Neodynamic.SDK.Printing.BarcodeSymbology.RssExpandedStacked ||
                                symbology == Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBarExpandedStackedCCA ||
                                symbology == Neodynamic.SDK.Printing.BarcodeSymbology.GS1DataBarExpandedStackedCCB ||
                                symbology == Neodynamic.SDK.Printing.BarcodeSymbology.RssExpandedStackedCCA ||
                                symbology == Neodynamic.SDK.Printing.BarcodeSymbology.RssExpandedStackedCCB) {
                                props.push("segments_per_row");
                            }
                            var strSymb = Neodynamic.SDK.Printing.BarcodeSymbology[symbology];
                            if (strSymb.indexOf("CCA", strSymb.length - "CCA".length) >= 0 ||
                                strSymb.indexOf("CCB", strSymb.length - "CCB".length) >= 0) {
                                props.push("bar_ratio");
                            }
                            props.push("gs1_data_strict_validation");
                            break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.KodakPatchCode:
                            props.push("bar_height");
                            props.push("bar_width");
                            props.push("bar_ratio");
                            props.push("bar_width_adjustment");
                            break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.HanXinCode:
                            props.push("han_xin_code_module_size");
                            props.push("han_xin_code_byte_encoding_name");
                            props.push("han_xin_code_error_correction_level");
                            props.push("han_xin_code_encoding");
                            props.push("han_xin_code_version");
                            props.push("han_xin_code_process_tilde");
                            break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.KoreaPost:
                            props.push("bar_height");
                            props.push("bar_width");
                            props.push("bar_width_adjustment");
                            break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.DotCode:
                            props.push("dot_code_module_size");
                            props.push("dot_code_process_tilde");
                            props.push("gs1_data_strict_validation");
                            props.push("dot_code_columns");
                            props.push("dot_code_rows");
                            props.push("dot_code_aspect_ratio");
                            props.push("dot_code_module_shape");
                            break;
                        //case Neodynamic.SDK.Printing.BarcodeSymbology.JABCode:
                        //    props.push(txtModuleSize");
                        //    props.push(pnlJABColors");
                        //    props.push(pnlJABSymbCount");
                        //    props.push(pnlJABSymbECC");
                        //    props.push(pnlJABSymbPosition");
                        //    props.push(pnlJABSymbVersion");
                        //    break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Plessey:
                            props.push("bar_height");
                            props.push("bar_width");
                            props.push("bar_ratio");
                            props.push("bar_width_adjustment");
                            break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Code49:
                            props.push("bar_height");
                            props.push("bar_width");
                            props.push("bar_ratio");
                            props.push("bar_width_adjustment");
                            break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.CodablockF:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.HibcLicCodablockF:
                        case Neodynamic.SDK.Printing.BarcodeSymbology.HibcPasCodablockF:
                            props.push("bar_height");
                            props.push("bar_width");
                            props.push("bar_ratio");
                            props.push("bar_width_adjustment");
                            if (symbology == Neodynamic.SDK.Printing.BarcodeSymbology.HibcLicCodablockF || symbology == Neodynamic.SDK.Printing.BarcodeSymbology.HibcPasCodablockF) {
                                props.push("hibc_format_human_readable_text");
                            }
                            break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.Tlc39:
                            props.push("bar_height");
                            props.push("bar_width");
                            props.push("bar_ratio");
                            props.push("bar_width_adjustment");
                            props.push("tlc39_micro_pdf417_bar_width");
                            props.push("tlc39_micro_pdf417_row_bar_height");
                            break;
                        case Neodynamic.SDK.Printing.BarcodeSymbology.TriOptic:
                            props.push("bar_height");
                            props.push("bar_width");
                            props.push("bar_ratio");
                            props.push("bar_width_adjustment");
                            break;
                    }
                    if (symbology == Neodynamic.SDK.Printing.BarcodeSymbology.Code128 ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.UspsPicCode128 ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.Industrial2of5 ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.Interleaved2of5 ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.UccEan128 ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.GS1128 ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.DeutschePostLeitcode ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.DeutschePostIdentcode ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.SwissPostParcel ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.Opc ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.Itf14 ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.UspsSackLabel ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.UspsTrayLabel ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.Matrix2of5 ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.Scc14 ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.Sscc18 ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.VicsBol ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.VicsScacPro ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.ItalianPost25 ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.Isbt128 ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.UspsPicUccEan128 ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.FedExGround96 ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.Code93 ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.Code39 ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.HibcLic39 ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.HibcPas39 ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.DanishPostal39 ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.FrenchPostal39AR ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.HibcLic128 ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.HibcPas128 ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.IATA2of5 ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.AustraliaPostDomesticEParcelBarcode ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.UspsIntelligentMailContainerBarcode ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.Ean14 ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.Dun14Ean ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.Dun14Itf ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.DeutschePostBzl ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.DataLogic2of5 ||
                        symbology == Neodynamic.SDK.Printing.BarcodeSymbology.DPDCode) {
                        props.push("bearer_bar_style");
                        props.push("bearer_bar_thickness");
                    }
                    return props;
                };
                return BarcodeItemUtils;
            }());
            Utils.BarcodeItemUtils = BarcodeItemUtils;
        })(Utils = Web.Utils || (Web.Utils = {}));
    })(Web = Neodynamic.Web || (Neodynamic.Web = {}));
})(Neodynamic || (Neodynamic = {}));
//# sourceMappingURL=ThermalLabelWebEditor-14.0.0.0.js.map