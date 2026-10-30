// =====================================================================
// PrintDialogs.js
// Print method chooser + advanced client printing via JSPrintManager
//
//  - #print-dialog       : lets the user pick the printing method
//      * Standard  -> UIEditor.doPrinting()  (TLClientPrint, Windows only)
//      * Advanced  -> #jspm-print-dialog      (JSPrintManager, any OS)
//  - #jspm-print-dialog  : JSPM printer settings + print job
//
// Requires (load order): jquery, bootstrap, ThermalLabelWebEditor,
// TemplatesGallery (progress icon), SampleLabelEditorUI (UIEditor/tleditor),
// JSPrintManager.js, then this file.
//
// JSPrintManager: https://www.neodynamic.com/products/printing/js-print-manager
// =====================================================================

var PrintDialogs = (function () {

    var STORAGE_KEY = 'tlwe.printMethod';

    // Printer language <select> values -> Neodynamic.SDK.Printing.ProgrammingLanguage names
    var LANG_MAP = { zpl: 'ZPL', epl: 'EPL', fingerprint: 'Fingerprint', escpos: 'ESCPOS', pcl: 'PCL', dp: 'DirectProtocol' };
   
    // Active tab (href) -> settings prefix used by the dialog ids
    var TAB_PREFIX = {
        '#tabInstalledPrinter': 'inst',
        '#tabNetworkPrinter': 'net',
        '#tabSerialPrinter': 'ser',
        '#tabParallelPrinter': 'par'
    };

    var jspmStarted = false;
    var busy = false;

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------

    function isWindows() {
        return /(windows|win32|win64)/i.test(navigator.userAgent);
    }

    function jspmAvailable() {
        return typeof window.JSPM !== 'undefined' && JSPM.JSPrintManager;
    }

    function readSavedMethod() {
        try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
    }

    function saveMethod(m) {
        try { localStorage.setItem(STORAGE_KEY, m); } catch (e) { /* storage unavailable */ }
    }

    function base64ToBytes(b64) {
        var bin = atob(String(b64).replace(/\s/g, ''));
        var bytes = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return bytes;
    }

    function fillSelect($select, values) {
        $select.empty();
        $.each(values || [], function (_, v) {
            $select.append($('<option>').val(v).text(v)); // .text() = no HTML injection from printer names
        });
    }

    function showJspmError(msg) {
        $('#jspmError').text(msg).show();
    }

    function setBusy(on) {
        busy = on;
        $('#btnStartPrint').prop('disabled', on)
            .find('.fa').toggleClass('fa-print', !on).toggleClass('fa-spinner fa-spin', on);
    }

    // ------------------------------------------------------------------
    // Step 1: method chooser (#print-dialog)
    // ------------------------------------------------------------------

    function selectMethod(method) {
        $('#print-method-options .print-option').each(function () {
            var on = $(this).data('method') === method;
            $(this).toggleClass('active', on).attr('aria-checked', on ? 'true' : 'false');
        });
        $('#btnPrintMethodContinue').prop('disabled', !method);
    }

    function selectedMethod() {
        return $('#print-method-options .print-option.active').data('method') || null;
    }

    function open() {
        if (!tleditor.get_thermal_label) {
            UIEditor.showErrorMsg('There is no label to print. Create or open a label first.');
            return;
        }

        var win = isWindows();
        var $std = $('#print-method-options .print-option[data-method="standard"]');
        $std.prop('disabled', !win).toggleClass('disabled', !win);
        $('#printStdNotSupported').toggle(!win);

        var method = readSavedMethod();
        if (!win || (method !== 'standard' && method !== 'jspm')) method = win ? 'standard' : 'jspm';
        selectMethod(method);

        $('#print-dialog').modal('show');
    }

    function continueWithMethod() {
        var method = selectedMethod();
        if (!method) return;
        saveMethod(method);

        if (method === 'standard') {
            $('#print-dialog').modal('hide');
            UIEditor.doPrinting();
            return;
        }

        // Advanced: open the JSPM dialog once the chooser is fully hidden
        // (Bootstrap 3 does not support stacked modals well)
        $('#print-dialog').one('hidden.bs.modal', function () {
            openJspmDialog();
        }).modal('hide');
    }

    // ------------------------------------------------------------------
    // Step 2: JSPrintManager dialog (#jspm-print-dialog)
    // ------------------------------------------------------------------

    function openJspmDialog() {
        $('#jspmError').hide();
        setBusy(false);

        if (!jspmAvailable()) {
            $('#jspmConnecting, #printSettings').hide();
            $('#btnStartPrint').hide();
            $('#jspmInfo').show();
            $('#jspmInfoReason').text('JSPrintManager.js script is not loaded in this page.');
            $('#jspm-print-dialog').modal('show');
            return;
        }

        $('#jspm-print-dialog').modal('show');

        if (!jspmStarted) {
            startJspm();
        } else {
            updateJspmStatus();
        }
    }

    function startJspm() {
        jspmStarted = true;
        $('#printSettings, #jspmInfo').hide();
        $('#btnStartPrint').hide();
        $('#jspmConnecting').show();

        JSPM.JSPrintManager.auto_reconnect = true;
        JSPM.JSPrintManager.start();
        JSPM.JSPrintManager.WS.onStatusChanged = function () {
            if (updateJspmStatus()) loadClientDevices();
        };
    }

    // Returns true when the WebSocket is open and ready
    function updateJspmStatus() {
        var st = JSPM.JSPrintManager.websocket_status;
        $('#jspmConnecting').hide();

        if (st === JSPM.WSStatus.Open) {
            $('#jspmInfo').hide();
            $('#printSettings').show();
            $('#btnStartPrint').show();
            return true;
        }

        $('#printSettings').hide();
        $('#btnStartPrint').hide();

        if (st === JSPM.WSStatus.WaitingForUserResponse) {
            $('#jspmConnecting').show().find('em').text('Waiting for your permission in the JSPrintManager app...');
            return false;
        }

        $('#jspmInfo').show();
        $('#jspmInfoReason').text(st === JSPM.WSStatus.Blocked
            ? 'JSPrintManager has blocked this website. Allow it from the JSPrintManager app settings.'
            : 'JSPrintManager Client App is not installed or not running on this machine.');
        return false;
    }

    function loadClientDevices() {
        $('#instPrintersWait, #serPortsWait').show();
        $('#instPrinters, #serPorts').hide();

        JSPM.JSPrintManager.getPrinters().then(function (printers) {
            fillSelect($('#instPrinterName'), printers);
            $('#instPrintersWait').hide();
            $('#instPrinters').show();
        });

        JSPM.JSPrintManager.getSerialPorts().then(function (ports) {
            fillSelect($('#serPrinterPort'), ports);
            $('#serPortsWait').hide();
            $('#serPorts').show();
        }).catch(function () {
            $('#serPortsWait').hide();
            $('#serPorts').show();
        });
    }

    // Collects and validates the settings; returns null (and shows an error) when invalid
    function readSettings() {
        var tab = $('#selPrinterType li.active a').attr('href');
        var prefix = TAB_PREFIX[tab] || 'inst';

        var copies = parseInt($('#printCopies').val(), 10);
        if (!(copies >= 1 && copies <= 100)) {
            showJspmError('Copies must be a number between 1 and 100.');
            return null;
        }

        var s = {
            prefix: prefix,
            copies: copies,
            orientation: $('#printOrientation').val(),
            asGraphic: prefix === 'inst' && $("input[name='printOutputs']:checked").val() === 'graphic',
            lang: LANG_MAP[$('#' + prefix + 'PrinterLang').val()] || 'ZPL',
            dpi: parseInt($('#' + prefix + 'PrinterDpi').val(), 10) || 203
        };

        if (prefix === 'inst' && !$('#instPrinterName').val()) {
            showJspmError('Select a printer.'); return null;
        }
        if (prefix === 'net' && (!$.trim($('#netPrinterIP').val()) || !(parseInt($('#netPrinterPort').val(), 10) > 0))) {
            showJspmError('Enter the printer IP address and port.'); return null;
        }
        if (prefix === 'ser' && !$('#serPrinterPort').val()) {
            showJspmError('No serial port available.'); return null;
        }
        if (prefix === 'par' && !$.trim($('#parPrinterPort').val())) {
            showJspmError('Enter the parallel port name.'); return null;
        }
        return s;
    }

    function buildClientPrinter(prefix) {
        switch (prefix) {
            case 'net':
                return new JSPM.NetworkPrinter(parseInt($('#netPrinterPort').val(), 10), $.trim($('#netPrinterIP').val()), null);
            case 'par':
                return new JSPM.ParallelPortPrinter($.trim($('#parPrinterPort').val()));
            case 'ser':
                return new JSPM.SerialPortPrinter(
                    $('#serPrinterPort').val(),
                    parseInt($('#serPrinterBaudRate').val(), 10) || 9600,
                    JSPM.Serial.Parity[$('#serPrinterParity').val()],
                    JSPM.Serial.StopBits[$('#serPrinterStopBits').val()],
                    JSPM.Serial.DataBits[$('#serPrinterDataBits').val()],
                    JSPM.Serial.Handshake[$('#serPrinterFlowControl').val()]);
            default:
                return new JSPM.InstalledPrinter($('#instPrinterName').val());
        }
    }

    function sendJob(s, content) {
        var cpj = new JSPM.ClientPrintJob();
        cpj.clientPrinter = buildClientPrinter(s.prefix);

        if (s.asGraphic) {
            // PDF rendered by the handler (base64) -> printed by the OS driver
            cpj.files.push(new JSPM.PrintFilePDF(content, JSPM.FileSourceType.Base64, 'label.pdf', s.copies));
        } else {
            // Raw printer commands (copies are already embedded by the handler)
            cpj.binaryPrinterCommands = base64ToBytes(content);
        }

        cpj.sendToClient();
        setBusy(false);
        $('#jspm-print-dialog').modal('hide');
    }

    function print() {
        if (busy || !tleditor.get_thermal_label) return;
        $('#jspmError').hide();

        var s = readSettings();
        if (!s) return;

        var ds = UIEditor.getDataSource();
        setBusy(true);

        var onDone = function (content) {
            if (!content) { setBusy(false); showJspmError('The label could not be converted.'); return; }
            try {
                sendJob(s, content);
            } catch (e) {
                setBusy(false);
                showJspmError('Print job error: ' + (e && e.message ? e.message : e));
            }
        };

        if (s.asGraphic) {
            var pdfMeta = new Neodynamic.SDK.Printing.PdfMetadata();
            pdfMeta.use_vector_drawing = false;
            // getLabelAsPdf(xmlTemplate, handlerUrl, pdfMetadata, dpi, dsFormat, dataSource, callback)
            tleditor.getLabelAsPdf(null, null, pdfMeta, 300, ds.dataSourceFormat, ds.dataSource, onDone);
        } else {
            // getPrinterCommands(xmlTemplate, handlerUrl, printerLang, orientation, copies, replicates, dpi, dsFormat, dataSource, callback)
            tleditor.getPrinterCommands(null, null, s.lang, s.orientation, s.copies, 0, s.dpi,
                ds.dataSourceFormat, ds.dataSource, onDone);
        }
    }

    // ------------------------------------------------------------------
    // Wiring
    // ------------------------------------------------------------------

    function init() {
        var icon = (window.gallery && gallery.getProgressIcon) ? gallery.getProgressIcon() : '';
        $('#imgInstPrintersWait, #imgSerPortsWait, #imgJspmConnecting').attr('src', icon);

        $('#print-method-options').on('click', '.print-option:not(.disabled)', function () {
            selectMethod($(this).data('method'));
        });
        $('#print-method-options').on('dblclick', '.print-option:not(.disabled)', function () {
            selectMethod($(this).data('method'));
            continueWithMethod();
        });
        $('#btnPrintMethodContinue').on('click', continueWithMethod);

        $('#btnStartPrint').on('click', print);
        // Handler/AJAX failures are reported by tleditor.onError (#error-dialog) and the
        // conversion callback never runs, so release the Print button when that happens
        $('#error-dialog').on('show.bs.modal', function () { if (busy) setBusy(false); });
        $('#btnJspmBack').on('click', function () {
            $('#jspm-print-dialog').one('hidden.bs.modal', open).modal('hide');
        });
        $('#btnJspmRetry').on('click', function () {
            if (!jspmAvailable()) return;
            $('#jspmInfo').hide();
            $('#jspmConnecting').show().find('em').text('Connecting to JSPrintManager...');
            JSPM.JSPrintManager.start();
            JSPM.JSPrintManager.WS.onStatusChanged = function () {
                if (updateJspmStatus()) loadClientDevices();
            };
        });

        // "Print as graphic" ignores language/DPI
        $("input[name='printOutputs']").on('change', function () {
            var graphic = $("input[name='printOutputs']:checked").val() === 'graphic';
            $('#instPrinterLang, #instPrinterDpi').prop('disabled', graphic);
        });
    }

    $(init);

    return { open: open, openAdvanced: openJspmDialog };
})();
