declare namespace Neodynamic.SDK.Printing {
    class Item {
        protected _comments: string;
        protected _data_field: string;
        protected _data_field_format_string: string;
        protected _dpi: number;
        protected _name: string;
        protected _print_as_graphic: boolean;
        protected _tag: string;
        protected _unit_type: UnitType;
        protected _x: number;
        protected _y: number;
        protected _locked: boolean;
        protected _editable: boolean;
        protected _expression: string;
        protected _use_cache: boolean;
        protected _cache_item_id: string;
        protected _visible: boolean;
        protected _group_name: string;
        protected _resizable: boolean;
        protected _readonly: boolean;
        _fabric_item: any;
        _guid: string;
        get x(): number;
        set x(value: number);
        get y(): number;
        set y(value: number);
        get locked(): boolean;
        set locked(value: boolean);
        get editable(): boolean;
        set editable(value: boolean);
        get comments(): string;
        set comments(value: string);
        get data_field(): string;
        set data_field(value: string);
        get data_field_format_string(): string;
        set data_field_format_string(value: string);
        get name(): string;
        set name(value: string);
        get print_as_graphic(): boolean;
        set print_as_graphic(value: boolean);
        get unit_type(): UnitType;
        set unit_type(value: UnitType);
        get tag(): string;
        set tag(value: string);
        get expression(): string;
        set expression(value: string);
        get use_cache(): boolean;
        set use_cache(value: boolean);
        get cache_item_id(): string;
        set cache_item_id(value: string);
        get visible(): boolean;
        set visible(value: boolean);
        get group_name(): string;
        set group_name(value: string);
        get resizable(): boolean;
        set resizable(value: boolean);
        get read_only(): boolean;
        set read_only(value: boolean);
        _updateFromCanvas(property?: any): void;
        _updateToCanvas(property?: any): void;
        _getProperties(): void;
        propertyChanged(): void;
        refresh(): void;
        onError(errMsg: string, className: string): void;
        protected _onError(errMsg: string, className: string): void;
        protected _missing_image: string;
    }
}
declare namespace Neodynamic.SDK.Printing {
    class BarcodeItem extends Item {
        private _add_checksum;
        private _aztec_code_byte_encoding_name;
        private _aztec_code_error_correction;
        private _aztec_code_format;
        private _aztec_code_module_size;
        private _aztec_code_process_tilde;
        private _aztec_code_rune;
        private _back_color;
        private _barcode_alignment;
        private _barcode_padding;
        private _bar_color;
        private _bar_height;
        private _bar_ratio;
        private _bar_width;
        private _bar_width_adjustment;
        private _bearer_bar_style;
        private _bearer_bar_thickness;
        private _border_color;
        private _border_thickness;
        private _codabar_start_char;
        private _codabar_stop_char;
        private _code;
        private _code128_charset;
        private _code16k_mode;
        private _code39_full_ascii_mode;
        private _code93_full_ascii_mode;
        private _code_alignment;
        private _code_format_pattern;
        private _corner_radius;
        private _counter_step;
        private _counter_using_leading_zeros;
        private _data_matrix_byte_encoding_name;
        private _data_matrix_encoding;
        private _data_matrix_file_id;
        private _data_matrix_format;
        private _data_matrix_module_size;
        private _data_matrix_process_tilde;
        private _data_matrix_symbol_count;
        private _data_matrix_symbol_index;
        private _display_checksum;
        private _display_code;
        private _display_start_stop_char;
        private _ean_upc_display_light_margin_indicator;
        private _ean_upc_guard_bar;
        private _ean_upc_guard_bar_height;
        private _ean_upc_magnification_factor;
        private _ean_upc_supplement;
        private _ean_upc_supplement_code;
        private _ean_upc_supplement_separation;
        private _ean_upc_supplement_top_margin;
        private _error_behavior;
        private _font;
        private _fore_color;
        private _han_xin_code_byte_encoding_name;
        private _han_xin_code_encoding;
        private _han_xin_code_error_correction_level;
        private _han_xin_code_module_size;
        private _han_xin_code_process_tilde;
        private _han_xin_code_version;
        private _height;
        private _hibc_format_human_readable_text;
        private _hibc_use_iso_iec_15434_encoding;
        private _hide_if_empty;
        private _human_readable_text;
        private _isbt_128_data_structure;
        private _itf14_left_h_mark;
        private _itf14_right_h_mark;
        private _mask;
        private _mask_increment;
        private _maxi_code_mode;
        private _maxi_code_process_tilde;
        private _maxi_code_symbol_count;
        private _maxi_code_symbol_index;
        private _micropdf417_version;
        private _microqr_code_version;
        private _msi_checksum;
        private _pdf417_aspect_ratio;
        private _pdf417_byte_encoding_name;
        private _pdf417_columns;
        private _pdf417_compaction_type;
        private _pdf417_error_correction_level;
        private _pdf417_file_id;
        private _pdf417_rows;
        private _pdf417_segment_count;
        private _pdf417_segment_index;
        private _pdf417_truncated;
        private _pharmacode_bars_spacing;
        private _pharmacode_thick_bar_width;
        private _pharmacode_thin_bar_width;
        private _planet_height_short_bar;
        private _planet_height_tall_bar;
        private _postal_4_state_add_start_stop_char;
        private _postal_4_state_bars_spacing;
        private _postal_4_state_tracker_bar_height;
        private _postal_4_state_tracker_bar_width;
        private _postnet_height_short_bar;
        private _postnet_height_tall_bar;
        private _qr_code_byte_encoding_name;
        private _qr_code_encoding;
        private _qr_code_error_correction_level;
        private _qr_code_module_size;
        private _qr_code_process_tilde;
        private _qr_code_version;
        private _quiet_zone;
        private _rotation_angle;
        private _segments_per_row;
        private _sizing;
        private _symbology;
        private _telepen_encoding;
        private _text;
        private _text_alignment;
        private _text_font;
        private _text_fore_color;
        private _text_format_pattern;
        private _upce_system;
        private _use_quiet_zone_for_text;
        private _usps_fim_pattern;
        private _usps_horizontal_bars_count;
        private _width;
        private _gs1_data_strict_validation;
        private _maxi_code_draw_pixel_based_symbol;
        private _dot_code_columns;
        private _dot_code_module_size;
        private _dot_code_process_tilde;
        private _dot_code_rows;
        private _dot_code_aspect_ratio;
        private _dot_code_module_shape;
        private _data_matrix_include_rect_formats_in_auto_mode;
        private _back_color_hex;
        private _border_color_hex;
        private _bar_color_hex;
        private _fore_color_hex;
        private _text_fore_color_hex;
        private _code11_two_digits_checksum;
        private _tlc39_micro_pdf417_bar_width;
        private _tlc39_micro_pdf417_row_bar_height;
        private _right_to_left;
        private _rect_microqr_code_version;
        private _has_to_reload;
        private _image_item;
        get add_checksum(): boolean;
        set add_checksum(value: boolean);
        get aztec_code_byte_encoding_name(): string;
        set aztec_code_byte_encoding_name(value: string);
        get aztec_code_error_correction(): number;
        set aztec_code_error_correction(value: number);
        get aztec_code_format(): AztecCodeFormat;
        set aztec_code_format(value: AztecCodeFormat);
        get aztec_code_module_size(): any;
        set aztec_code_module_size(value: any);
        get aztec_code_process_tilde(): boolean;
        set aztec_code_process_tilde(value: boolean);
        get aztec_code_rune(): number;
        set aztec_code_rune(value: number);
        get back_color(): Color;
        set back_color(value: Color);
        get barcode_alignment(): BarcodeAlignment;
        set barcode_alignment(value: BarcodeAlignment);
        get barcode_padding(): FrameThickness;
        set barcode_padding(value: FrameThickness);
        get bar_color(): Color;
        set bar_color(value: Color);
        get bar_height(): any;
        set bar_height(value: any);
        get bar_ratio(): number;
        set bar_ratio(value: number);
        get bar_width(): any;
        set bar_width(value: any);
        get bar_width_adjustment(): number;
        set bar_width_adjustment(value: number);
        get bearer_bar_style(): BearerBarStyle;
        set bearer_bar_style(value: BearerBarStyle);
        get bearer_bar_thickness(): any;
        set bearer_bar_thickness(value: any);
        get border_color(): Color;
        set border_color(value: Color);
        get border_thickness(): FrameThickness;
        set border_thickness(value: FrameThickness);
        get codabar_start_char(): CodabarStartStopChar;
        set codabar_start_char(value: CodabarStartStopChar);
        get codabar_stop_char(): CodabarStartStopChar;
        set codabar_stop_char(value: CodabarStartStopChar);
        get code(): string;
        set code(value: string);
        get code128_charset(): Code128;
        set code128_charset(value: Code128);
        get code16k_mode(): Code16K;
        set code16k_mode(value: Code16K);
        get code39_full_ascii_mode(): boolean;
        set code39_full_ascii_mode(value: boolean);
        get code93_full_ascii_mode(): boolean;
        set code93_full_ascii_mode(value: boolean);
        get code_alignment(): BarcodeTextAlignment;
        set code_alignment(value: BarcodeTextAlignment);
        get code_format_pattern(): string;
        set code_format_pattern(value: string);
        get corner_radius(): RectangleCornerRadius;
        set corner_radius(value: RectangleCornerRadius);
        get counter_step(): number;
        set counter_step(value: number);
        get counter_using_leading_zeros(): boolean;
        set counter_using_leading_zeros(value: boolean);
        get data_matrix_byte_encoding_name(): string;
        set data_matrix_byte_encoding_name(value: string);
        get data_matrix_encoding(): DataMatrixEncoding;
        set data_matrix_encoding(value: DataMatrixEncoding);
        get data_matrix_file_id(): string;
        set data_matrix_file_id(value: string);
        get data_matrix_format(): DataMatrixFormat;
        set data_matrix_format(value: DataMatrixFormat);
        get data_matrix_module_size(): any;
        set data_matrix_module_size(value: any);
        get data_matrix_process_tilde(): boolean;
        set data_matrix_process_tilde(value: boolean);
        get data_matrix_symbol_count(): number;
        set data_matrix_symbol_count(value: number);
        get data_matrix_symbol_index(): number;
        set data_matrix_symbol_index(value: number);
        get display_checksum(): boolean;
        set display_checksum(value: boolean);
        get display_code(): boolean;
        set display_code(value: boolean);
        get display_start_stop_char(): boolean;
        set display_start_stop_char(value: boolean);
        get ean_upc_display_light_margin_indicator(): boolean;
        set ean_upc_display_light_margin_indicator(value: boolean);
        get ean_upc_guard_bar(): boolean;
        set ean_upc_guard_bar(value: boolean);
        get ean_upc_guard_bar_height(): any;
        set ean_upc_guard_bar_height(value: any);
        get ean_upc_magnification_factor(): number;
        set ean_upc_magnification_factor(value: number);
        get ean_upc_supplement(): Supplement;
        set ean_upc_supplement(value: Supplement);
        get ean_upc_supplement_code(): string;
        set ean_upc_supplement_code(value: string);
        get ean_upc_supplement_separation(): any;
        set ean_upc_supplement_separation(value: any);
        get ean_upc_supplement_top_margin(): any;
        set ean_upc_supplement_top_margin(value: any);
        get error_behavior(): BarcodeErrorBehavior;
        set error_behavior(value: BarcodeErrorBehavior);
        get font(): Font;
        set font(value: Font);
        get fore_color(): Color;
        set fore_color(value: Color);
        get han_xin_code_byte_encoding_name(): string;
        set han_xin_code_byte_encoding_name(value: string);
        get han_xin_code_encoding(): HanXinCodeEncoding;
        set han_xin_code_encoding(value: HanXinCodeEncoding);
        get han_xin_code_error_correction_level(): HanXinCodeErrorCorrectionLevel;
        set han_xin_code_error_correction_level(value: HanXinCodeErrorCorrectionLevel);
        get han_xin_code_module_size(): any;
        set han_xin_code_module_size(value: any);
        get han_xin_code_process_tilde(): boolean;
        set han_xin_code_process_tilde(value: boolean);
        get han_xin_code_version(): HanXinCodeVersion;
        set han_xin_code_version(value: HanXinCodeVersion);
        get height(): any;
        set height(value: any);
        get hibc_format_human_readable_text(): boolean;
        set hibc_format_human_readable_text(value: boolean);
        get hibc_use_iso_iec_15434_encoding(): boolean;
        set hibc_use_iso_iec_15434_encoding(value: boolean);
        get hide_if_empty(): boolean;
        set hide_if_empty(value: boolean);
        get human_readable_text(): string;
        set human_readable_text(value: string);
        get isbt_128_data_structure(): Isbt128DataStructure;
        set isbt_128_data_structure(value: Isbt128DataStructure);
        get itf14_left_h_mark(): ItfHmark;
        set itf14_left_h_mark(value: ItfHmark);
        get itf14_right_h_mark(): ItfHmark;
        set itf14_right_h_mark(value: ItfHmark);
        get mask(): string;
        set mask(value: string);
        get mask_increment(): string;
        set mask_increment(value: string);
        get maxi_code_mode(): MaxiCodeModes;
        set maxi_code_mode(value: MaxiCodeModes);
        get maxi_code_process_tilde(): boolean;
        set maxi_code_process_tilde(value: boolean);
        get maxi_code_symbol_count(): number;
        set maxi_code_symbol_count(value: number);
        get maxi_code_symbol_index(): number;
        set maxi_code_symbol_index(value: number);
        get micropdf417_version(): MicroPdf417Version;
        set micropdf417_version(value: MicroPdf417Version);
        get microqr_code_version(): MicroQRCodeVersion;
        set microqr_code_version(value: MicroQRCodeVersion);
        get msi_checksum(): MsiChecksum;
        set msi_checksum(value: MsiChecksum);
        get pdf417_aspect_ratio(): number;
        set pdf417_aspect_ratio(value: number);
        get pdf417_byte_encoding_name(): string;
        set pdf417_byte_encoding_name(value: string);
        get pdf417_columns(): number;
        set pdf417_columns(value: number);
        get pdf417_compaction_type(): Pdf417CompactionType;
        set pdf417_compaction_type(value: Pdf417CompactionType);
        get pdf417_error_correction_level(): Pdf417ErrorCorrection;
        set pdf417_error_correction_level(value: Pdf417ErrorCorrection);
        get pdf417_file_id(): string;
        set pdf417_file_id(value: string);
        get pdf417_rows(): number;
        set pdf417_rows(value: number);
        get pdf417_segment_count(): number;
        set pdf417_segment_count(value: number);
        get pdf417_segment_index(): number;
        set pdf417_segment_index(value: number);
        get pdf417_truncated(): boolean;
        set pdf417_truncated(value: boolean);
        get pharmacode_bars_spacing(): any;
        set pharmacode_bars_spacing(value: any);
        get pharmacode_thick_bar_width(): any;
        set pharmacode_thick_bar_width(value: any);
        get pharmacode_thin_bar_width(): any;
        set pharmacode_thin_bar_width(value: any);
        get planet_height_short_bar(): any;
        set planet_height_short_bar(value: any);
        get planet_height_tall_bar(): any;
        set planet_height_tall_bar(value: any);
        get postal_4_state_add_start_stop_char(): boolean;
        set postal_4_state_add_start_stop_char(value: boolean);
        get postal_4_state_bars_spacing(): any;
        set postal_4_state_bars_spacing(value: any);
        get postal_4_state_tracker_bar_height(): any;
        set postal_4_state_tracker_bar_height(value: any);
        get postal_4_state_tracker_bar_width(): any;
        set postal_4_state_tracker_bar_width(value: any);
        get postnet_height_short_bar(): any;
        set postnet_height_short_bar(value: any);
        get postnet_height_tall_bar(): any;
        set postnet_height_tall_bar(value: any);
        get qr_code_byte_encoding_name(): string;
        set qr_code_byte_encoding_name(value: string);
        get qr_code_encoding(): QRCodeEncoding;
        set qr_code_encoding(value: QRCodeEncoding);
        get qr_code_error_correction_level(): QRCodeErrorCorrectionLevel;
        set qr_code_error_correction_level(value: QRCodeErrorCorrectionLevel);
        get qr_code_module_size(): any;
        set qr_code_module_size(value: any);
        get qr_code_process_tilde(): boolean;
        set qr_code_process_tilde(value: boolean);
        get qr_code_version(): QRCodeVersion;
        set qr_code_version(value: QRCodeVersion);
        get quiet_zone(): FrameThickness;
        set quiet_zone(value: FrameThickness);
        get rotation_angle(): number;
        set rotation_angle(value: number);
        get segments_per_row(): number;
        set segments_per_row(value: number);
        get sizing(): BarcodeSizing;
        set sizing(value: BarcodeSizing);
        get symbology(): BarcodeSymbology;
        set symbology(value: BarcodeSymbology);
        get telepen_encoding(): TelepenEncoding;
        set telepen_encoding(value: TelepenEncoding);
        get text(): string;
        set text(value: string);
        get text_alignment(): BarcodeTextAlignment;
        set text_alignment(value: BarcodeTextAlignment);
        get text_font(): Font;
        set text_font(value: Font);
        get text_fore_color(): Color;
        set text_fore_color(value: Color);
        get text_format_pattern(): string;
        set text_format_pattern(value: string);
        get upce_system(): UpcE;
        set upce_system(value: UpcE);
        get use_quiet_zone_for_text(): boolean;
        set use_quiet_zone_for_text(value: boolean);
        get usps_fim_pattern(): FIM;
        set usps_fim_pattern(value: FIM);
        get usps_horizontal_bars_count(): number;
        set usps_horizontal_bars_count(value: number);
        get width(): any;
        set width(value: any);
        get gs1_data_strict_validation(): boolean;
        set gs1_data_strict_validation(value: boolean);
        get maxi_code_draw_pixel_based_symbol(): boolean;
        set maxi_code_draw_pixel_based_symbol(value: boolean);
        get dot_code_columns(): number;
        set dot_code_columns(value: number);
        get dot_code_module_size(): any;
        set dot_code_module_size(value: any);
        get dot_code_process_tilde(): boolean;
        set dot_code_process_tilde(value: boolean);
        get dot_code_rows(): number;
        set dot_code_rows(value: number);
        get dot_code_aspect_ratio(): string;
        set dot_code_aspect_ratio(value: string);
        get dot_code_module_shape(): DotCodeModuleShape;
        set dot_code_module_shape(value: DotCodeModuleShape);
        get data_matrix_include_rect_formats_in_auto_mode(): boolean;
        set data_matrix_include_rect_formats_in_auto_mode(value: boolean);
        get back_color_hex(): string;
        set back_color_hex(value: string);
        get bar_color_hex(): string;
        set bar_color_hex(value: string);
        get border_color_hex(): string;
        set border_color_hex(value: string);
        get fore_color_hex(): string;
        set fore_color_hex(value: string);
        get text_fore_color_hex(): string;
        set text_fore_color_hex(value: string);
        get code11_two_digits_checksum(): boolean;
        set code11_two_digits_checksum(value: boolean);
        get tlc39_micro_pdf417_bar_width(): any;
        set tlc39_micro_pdf417_bar_width(value: any);
        get tlc39_micro_pdf417_row_bar_height(): any;
        set tlc39_micro_pdf417_row_bar_height(value: any);
        get right_to_left(): boolean;
        set right_to_left(value: boolean);
        get rect_microqr_code_version(): RectMicroQRCodeVersion;
        set rect_microqr_code_version(value: RectMicroQRCodeVersion);
        _getProperties(): {
            Type: string;
            UnitType: UnitType;
            X: number;
            Y: number;
            Width: any;
            Height: any;
            Dpi: number;
            CornerRadius_BottomLeft: number;
            CornerRadius_BottomRight: number;
            CornerRadius_TopLeft: number;
            CornerRadius_TopRight: number;
            BorderThickness_Bottom: number;
            BorderThickness_Left: number;
            BorderThickness_Right: number;
            BorderThickness_Top: number;
            BarcodePadding_Bottom: number;
            BarcodePadding_Left: number;
            BarcodePadding_Right: number;
            BarcodePadding_Top: number;
            QuietZone_Bottom: number;
            QuietZone_Left: number;
            QuietZone_Right: number;
            QuietZone_Top: number;
            TextFont_Bold: boolean;
            TextFont_CodePage: CodePage;
            TextFont_CustomFontFile: string;
            TextFont_CustomFontFileFamilyName: string;
            TextFont_IsBitmapFont: boolean;
            TextFont_Italic: boolean;
            TextFont_Name: string;
            TextFont_NameAtPrinterStorage: string;
            TextFont_Size: number;
            TextFont_Strikeout: boolean;
            TextFont_Threshold: number;
            TextFont_Underline: boolean;
            TextFont_Unit: FontUnit;
            Font_Bold: boolean;
            Font_CodePage: CodePage;
            Font_CustomFontFile: string;
            Font_CustomFontFileFamilyName: string;
            Font_IsBitmapFont: boolean;
            Font_Italic: boolean;
            Font_Name: string;
            Font_NameAtPrinterStorage: string;
            Font_Size: number;
            Font_Strikeout: boolean;
            Font_Threshold: number;
            Font_Underline: boolean;
            Font_Unit: FontUnit;
            AddChecksum: boolean;
            AztecCodeByteEncodingName: string;
            AztecCodeErrorCorrection: number;
            AztecCodeFormat: AztecCodeFormat;
            AztecCodeModuleSize: any;
            AztecCodeProcessTilde: boolean;
            AztecCodeRune: number;
            BackColor: Color;
            BarcodeAlignment: BarcodeAlignment;
            BarColor: Color;
            BarHeight: any;
            BarRatio: number;
            BarWidth: any;
            BarWidthAdjustment: number;
            BearerBarStyle: BearerBarStyle;
            BearerBarThickness: any;
            BorderColor: Color;
            CodabarStartChar: CodabarStartStopChar;
            CodabarStopChar: CodabarStartStopChar;
            Code: string;
            Code128CharSet: Code128;
            Code16kMode: Code16K;
            Code39FullAsciiMode: boolean;
            Code93FullAsciiMode: boolean;
            CodeAlignment: BarcodeTextAlignment;
            CodeFormatPattern: string;
            CornerRadius: RectangleCornerRadius;
            CounterStep: number;
            CounterUseLeadingZeros: boolean;
            DataMatrixByteEncodingName: string;
            DataMatrixEncoding: DataMatrixEncoding;
            DataMatrixFileId: string;
            DataMatrixFormat: DataMatrixFormat;
            DataMatrixModuleSize: any;
            DataMatrixProcessTilde: boolean;
            DataMatrixSymbolCount: number;
            DataMatrixSymbolIndex: number;
            DisplayChecksum: boolean;
            DisplayCode: boolean;
            DisplayStartStopChar: boolean;
            EanUpcDisplayLightMarginIndicator: boolean;
            EanUpcGuardBar: boolean;
            EanUpcGuardBarHeight: any;
            EanUpcMagnificationFactor: number;
            EanUpcSupplement: Supplement;
            EanUpcSupplementCode: string;
            EanUpcSupplementSeparation: any;
            EanUpcSupplementTopMargin: any;
            ErrorBehavior: BarcodeErrorBehavior;
            Font: Font;
            ForeColor: Color;
            HanXinCodeByteEncodingName: string;
            HanXinCodeEncoding: HanXinCodeEncoding;
            HanXinCodeErrorCorrectionLevel: HanXinCodeErrorCorrectionLevel;
            HanXinCodeModuleSize: any;
            HanXinCodeProcessTilde: boolean;
            HanXinCodeVersion: HanXinCodeVersion;
            HibcFormatHumanReadableText: boolean;
            HibcUseIsoIec15434Encoding: boolean;
            HideIfEmpty: boolean;
            HumanReadableText: string;
            Isbt128DataStructure: Isbt128DataStructure;
            Itf14LeftHMark: ItfHmark;
            Itf14RightHMark: ItfHmark;
            Mask: string;
            MaskIncrement: string;
            MaxiCodeMode: MaxiCodeModes;
            MaxiCodeProcessTilde: boolean;
            MaxiCodeSymbolCount: number;
            MaxiCodeSymbolIndex: number;
            MicroPdf417Version: MicroPdf417Version;
            MicroQRCodeVersion: MicroQRCodeVersion;
            MsiChecksum: MsiChecksum;
            Pdf417AspectRatio: number;
            Pdf417ByteEncodingName: string;
            Pdf417Columns: number;
            Pdf417CompactionType: Pdf417CompactionType;
            Pdf417ErrorCorrectionLevel: Pdf417ErrorCorrection;
            Pdf417FileId: string;
            Pdf417Rows: number;
            Pdf417SegmentCount: number;
            Pdf417SegmentIndex: number;
            Pdf417Truncated: boolean;
            PharmacodeBarsSpacing: any;
            PharmacodeThickBarWidth: any;
            PharmacodeThinBarWidth: any;
            PlanetHeightShortBar: any;
            PlanetHeightTallBar: any;
            Postal4StateAddStartStopChar: boolean;
            Postal4StateBarsSpacing: any;
            Postal4StateTrackerBarHeight: any;
            Postal4StateTrackerBarWidth: any;
            PostnetHeightShortBar: any;
            PostnetHeightTallBar: any;
            QRCodeByteEncodingName: string;
            QRCodeEncoding: QRCodeEncoding;
            QRCodeErrorCorrectionLevel: QRCodeErrorCorrectionLevel;
            QRCodeModuleSize: any;
            QRCodeProcessTilde: boolean;
            QRCodeVersion: QRCodeVersion;
            RotationAngle: number;
            SegmentsPerRow: number;
            Sizing: BarcodeSizing;
            Symbology: BarcodeSymbology;
            TelepenEncoding: TelepenEncoding;
            Text: string;
            TextAlignment: BarcodeTextAlignment;
            TextFont: Font;
            TextForeColor: Color;
            TextFormatPattern: string;
            UpcESystem: UpcE;
            UseQuietZoneForText: boolean;
            UspsFimPattern: FIM;
            UspsHorizontalBarsCount: number;
            Comments: string;
            DataField: string;
            DataFieldFormatString: string;
            Name: string;
            PrintAsGraphic: boolean;
            Tag: string;
            Locked: boolean;
            GS1DataStrictValidation: boolean;
            MaxiCodeDrawPixelBasedSymbol: boolean;
            DotCodeColumns: number;
            DotCodeModuleSize: any;
            DotCodeProcessTilde: boolean;
            DotCodeRows: number;
            DotCodeAspectRatio: string;
            DotCodeModuleShape: DotCodeModuleShape;
            DataMatrixIncludeRectFormatsInAutoMode: boolean;
            Editable: boolean;
            BorderColorHex: string;
            BackColorHex: string;
            BarColorHex: string;
            ForeColorHex: string;
            TextForeColorHex: string;
            Expression: string;
            UseCache: boolean;
            CacheItemId: string;
            Visible: boolean;
            Code11TwoDigitsChecksum: boolean;
            Tlc39MicroPdf417BarWidth: any;
            Tlc39MicroPdf417RowBarHeight: any;
            RightToLeft: boolean;
            RectMicroQRCodeVersion: RectMicroQRCodeVersion;
            GroupName: string;
            Resizable: boolean;
            ReadOnly: boolean;
        };
        _updateFromCanvas(): void;
        _updateToCanvas(): void;
        refresh(): void;
        constructor();
    }
}
declare namespace Neodynamic.SDK.Printing {
    class ShapeItem extends Item {
        protected _width: number;
        protected _height: number;
        protected _stroke_color: Color;
        protected _stroke_thickness: number;
        protected _stroke_color_hex: string;
        get width(): number;
        set width(value: number);
        get height(): number;
        set height(value: number);
        get stroke_color(): Color;
        set stroke_color(value: Color);
        get stroke_thickness(): any;
        set stroke_thickness(value: any);
        get stroke_color_hex(): string;
        set stroke_color_hex(value: string);
        protected _stroke_style: StrokeStyle;
        get stroke_style(): StrokeStyle;
        set stroke_style(value: StrokeStyle);
        protected _stroke_style_pattern: string;
        get stroke_style_pattern(): string;
        set stroke_style_pattern(value: string);
        getStrokeStylePattern(): any[];
    }
}
declare namespace Neodynamic.SDK.Printing {
    class ClosedShapeItem extends ShapeItem {
        protected _fill_color: Color;
        protected _fill_color_hex: string;
        get fill_color(): Color;
        set fill_color(value: Color);
        get fill_color_hex(): string;
        set fill_color_hex(value: string);
    }
}
declare namespace Neodynamic.SDK.Printing {
    class EllipseShapeItem extends ClosedShapeItem {
        protected _rotation_angle: number;
        get rotation_angle(): number;
        set rotation_angle(value: number);
        _updateFromCanvas(property?: any): void;
        _updateToCanvas(property?: any): void;
        refresh(): void;
        _getProperties(): {
            Type: string;
            RotationAngle: number;
            FillColor: Color;
            StrokeThickness: any;
            StrokeColor: Color;
            Width: number;
            Height: number;
            Name: string;
            X: number;
            Y: number;
            UnitType: UnitType;
            DataField: string;
            DataFieldFormatString: string;
            PrintAsGraphic: boolean;
            Comments: string;
            Tag: string;
            Locked: boolean;
            Editable: boolean;
            FillColorHex: string;
            StrokeColorHex: string;
            Expression: string;
            UseCache: boolean;
            CacheItemId: string;
            Visible: boolean;
            StrokeStyle: StrokeStyle;
            StrokeStylePattern: string;
            GroupName: string;
            Resizable: boolean;
        };
        constructor();
    }
}
declare namespace Neodynamic.SDK.Printing {
    enum UnitType {
        Cm = 0,
        Inch = 1,
        Mm = 2,
        DotsPerInch = 3,
        Point = 4,
        Pica = 5,
        Mils = 6
    }
    enum RFIDTagDataFormat {
        ASCII = 0,
        Hexadecimal = 1,
        EPC = 2
    }
    enum LockAspectRatio {
        Fit = 3,
        HeightBased = 2,
        None = 0,
        WidthBased = 1
    }
    enum LineOrientation {
        Horizontal = 0,
        Vertical = 1,
        DiagonalUp = 2,
        DiagonalDown = 3
    }
    enum Flip {
        None = 0,
        X = 1,
        XY = 3,
        Y = 2
    }
    enum AztecCodeFormat {
        Auto = 0,
        C15X15Compact = 1,
        C19X19 = 2,
        C19X19Compact = 3,
        C23X23 = 4,
        C23X23Compact = 5,
        C27X27 = 6,
        C27X27Compact = 7,
        C31X31 = 8,
        C37X37 = 9,
        C41X41 = 10,
        C45X45 = 11,
        C49X49 = 12,
        C53X53 = 13,
        C57X57 = 14,
        C61X61 = 15,
        C67X67 = 16,
        C71X71 = 17,
        C75X75 = 18,
        C79X79 = 19,
        C83X83 = 20,
        C87X87 = 21,
        C91X91 = 22,
        C95X95 = 23,
        C101X101 = 24,
        C105X105 = 25,
        C109X109 = 26,
        C113X113 = 27,
        C117X117 = 28,
        C121X121 = 29,
        C125X125 = 30,
        C131X131 = 31,
        C135X135 = 32,
        C139X139 = 33,
        C143X143 = 34,
        C147X147 = 35,
        C151X151 = 36
    }
    enum Color {
        Black = 0,
        White = 1
    }
    enum BarcodeAlignment {
        TopLeft = 1,
        TopCenter = 2,
        TopRight = 4,
        MiddleLeft = 16,
        MiddleCenter = 32,
        MiddleRight = 64,
        BottomLeft = 256,
        BottomCenter = 512,
        BottomRight = 1024
    }
    enum BearerBarStyle {
        None = 0,
        Frame = 1,
        HorizontalRules = 2
    }
    enum CodabarStartStopChar {
        A = 0,
        B = 1,
        C = 2,
        D = 3
    }
    enum Code128 {
        Auto = 0,
        A = 1,
        B = 2,
        C = 3
    }
    enum Code16K {
        Mode0 = 0,
        Mode1 = 1,
        Mode2 = 2
    }
    enum BarcodeTextAlignment {
        AboveCenter = 0,
        AboveLeft = 1,
        AboveRight = 2,
        AboveJustify = 3,
        BelowCenter = 4,
        BelowLeft = 5,
        BelowRight = 6,
        BelowJustify = 7
    }
    enum DataMatrixEncoding {
        Auto = 0,
        Ascii = 1,
        C40 = 2,
        Text = 3,
        Base256 = 4
    }
    enum DataMatrixFormat {
        Auto = 0,
        AutoDMRE = 1,
        C10X10 = 2,
        C12X12 = 3,
        C8X18 = 4,
        C14X14 = 5,
        C8X32 = 6,
        C16X16 = 7,
        C12X26 = 8,
        C18X18 = 9,
        C20X20 = 10,
        C12X36 = 11,
        C22X22 = 12,
        C16X36 = 13,
        C24X24 = 14,
        C26X26 = 15,
        C16X48 = 16,
        C32X32 = 17,
        C36X36 = 18,
        C40X40 = 19,
        C44X44 = 20,
        C48X48 = 21,
        C52X52 = 22,
        C64X64 = 23,
        C72X72 = 24,
        C80X80 = 25,
        C88X88 = 26,
        C96X96 = 27,
        C104X104 = 28,
        C120X120 = 29,
        C132X132 = 30,
        C144X144 = 31,
        DMRE8X48 = 32,
        DMRE8X64 = 33,
        DMRE12X64 = 34,
        DMRE24X32 = 35,
        DMRE26X32 = 36,
        DMRE24X36 = 37,
        DMRE16X64 = 38,
        DMRE26X40 = 39,
        DMRE24X48 = 40,
        DMRE26X48 = 41,
        DMRE24X64 = 42,
        DMRE26X64 = 43
    }
    enum Supplement {
        None = 0,
        Digits2 = 1,
        Digits5 = 2
    }
    enum BarcodeErrorBehavior {
        BlankImage = 0,
        ThrowException = 2
    }
    enum HanXinCodeEncoding {
        Auto = 0,
        Numeric = 1,
        Text = 2,
        BinaryByte = 3,
        ChineseReg1 = 4,
        ChineseReg2 = 5,
        GB18030Bytes2 = 6,
        GB18030Bytes4 = 7
    }
    enum HanXinCodeErrorCorrectionLevel {
        L1 = 0,
        L2 = 1,
        L3 = 2,
        L4 = 3
    }
    enum HanXinCodeVersion {
        Auto = 0,
        V01 = 1,
        V02 = 2,
        V03 = 3,
        V04 = 4,
        V05 = 5,
        V06 = 6,
        V07 = 7,
        V08 = 8,
        V09 = 9,
        V10 = 10,
        V11 = 11,
        V12 = 12,
        V13 = 13,
        V14 = 14,
        V15 = 15,
        V16 = 16,
        V17 = 17,
        V18 = 18,
        V19 = 19,
        V20 = 20,
        V21 = 21,
        V22 = 22,
        V23 = 23,
        V24 = 24,
        V25 = 25,
        V26 = 26,
        V27 = 27,
        V28 = 28,
        V29 = 29,
        V30 = 30,
        V31 = 31,
        V32 = 32,
        V33 = 33,
        V34 = 34,
        V35 = 35,
        V36 = 36,
        V37 = 37,
        V38 = 38,
        V39 = 39,
        V40 = 40,
        V41 = 41,
        V42 = 42,
        V43 = 43,
        V44 = 44,
        V45 = 45,
        V46 = 46,
        V47 = 47,
        V48 = 48,
        V49 = 49,
        V50 = 50,
        V51 = 51,
        V52 = 52,
        V53 = 53,
        V54 = 54,
        V55 = 55,
        V56 = 56,
        V57 = 57,
        V58 = 58,
        V59 = 59,
        V60 = 60,
        V61 = 61,
        V62 = 62,
        V63 = 63,
        V64 = 64,
        V65 = 65,
        V66 = 66,
        V67 = 67,
        V68 = 68,
        V69 = 69,
        V70 = 70,
        V71 = 71,
        V72 = 72,
        V73 = 73,
        V74 = 74,
        V75 = 75,
        V76 = 76,
        V77 = 77,
        V78 = 78,
        V79 = 79,
        V80 = 80,
        V81 = 81,
        V82 = 82,
        V83 = 83,
        V84 = 84
    }
    enum Isbt128DataStructure {
        DS001 = 0,
        DS002 = 1,
        DS003 = 2,
        DS004 = 3,
        DS005 = 4,
        DS006 = 5,
        DS007 = 6,
        DS008 = 7,
        DS009 = 8,
        DS010 = 9,
        DS011 = 10,
        DS012 = 11,
        DS013 = 12,
        DS014 = 13,
        DS015 = 14,
        DS016 = 15,
        DS017 = 16,
        DS018 = 17,
        DS019 = 18,
        DS020 = 19,
        DS021 = 20,
        DS022 = 21,
        DS023 = 22,
        DS024 = 23,
        DS025 = 24,
        DS026 = 25,
        DS027 = 26,
        DS028 = 27,
        DS029 = 28,
        DS030 = 29,
        DS031 = 30,
        DS032 = 31,
        DS033 = 32,
        DS034 = 33
    }
    enum ItfHmark {
        None = 0,
        Mark1 = 1,
        Mark2 = 2,
        Mark3 = 3,
        Mark4 = 4,
        Mark5 = 5,
        Mark6 = 6,
        Mark7 = 7
    }
    enum MaxiCodeModes {
        Mode2 = 2,
        Mode3 = 3,
        Mode4 = 4,
        Mode5 = 5,
        Mode6 = 6
    }
    enum MicroPdf417Version {
        Auto = 0,
        V1X11 = 1,
        V1X14 = 2,
        V1X17 = 3,
        V1X20 = 4,
        V1X24 = 5,
        V1X28 = 6,
        V2X8 = 7,
        V2X11 = 8,
        V2X14 = 9,
        V2X17 = 10,
        V2X20 = 11,
        V2X23 = 12,
        V2X26 = 13,
        V3X6 = 14,
        V3X8 = 15,
        V3X10 = 16,
        V3X12 = 17,
        V3X15 = 18,
        V3X20 = 19,
        V3X26 = 20,
        V3X32 = 21,
        V3X38 = 22,
        V3X44 = 23,
        V4X4 = 24,
        V4X6 = 25,
        V4X8 = 26,
        V4X10 = 27,
        V4X12 = 28,
        V4X15 = 29,
        V4X20 = 30,
        V4X26 = 31,
        V4X32 = 32,
        V4X38 = 33,
        V4X44 = 34
    }
    enum MicroQRCodeVersion {
        Auto = 0,
        M1 = 1,
        M2 = 2,
        M3 = 3,
        M4 = 4
    }
    enum MsiChecksum {
        OneMod10 = 0,
        TwoMod10 = 1,
        Mod11AndMod10 = 2
    }
    enum Pdf417CompactionType {
        Auto = 0,
        Binary = 1,
        Text = 2,
        Numeric = 3
    }
    enum Pdf417ErrorCorrection {
        Level0 = 0,
        Level1 = 1,
        Level2 = 2,
        Level3 = 3,
        Level4 = 4,
        Level5 = 5,
        Level6 = 6,
        Level7 = 7,
        Level8 = 8
    }
    enum QRCodeEncoding {
        Auto = 0,
        Numeric = 1,
        AlphaNumeric = 2,
        Kanji = 3,
        Byte = 4
    }
    enum QRCodeErrorCorrectionLevel {
        L = 0,
        M = 1,
        Q = 2,
        H = 3
    }
    enum QRCodeVersion {
        Auto = 0,
        V01 = 1,
        V02 = 2,
        V03 = 3,
        V04 = 4,
        V05 = 5,
        V06 = 6,
        V07 = 7,
        V08 = 8,
        V09 = 9,
        V10 = 10,
        V11 = 11,
        V12 = 12,
        V13 = 13,
        V14 = 14,
        V15 = 15,
        V16 = 16,
        V17 = 17,
        V18 = 18,
        V19 = 19,
        V20 = 20,
        V21 = 21,
        V22 = 22,
        V23 = 23,
        V24 = 24,
        V25 = 25,
        V26 = 26,
        V27 = 27,
        V28 = 28,
        V29 = 29,
        V30 = 30,
        V31 = 31,
        V32 = 32,
        V33 = 33,
        V34 = 34,
        V35 = 35,
        V36 = 36,
        V37 = 37,
        V38 = 38,
        V39 = 39,
        V40 = 40
    }
    enum BarcodeSizing {
        None = 0,
        Fill = 1,
        FitProportional = 2
    }
    enum BarcodeSymbology {
        Codabar = 0,
        Code11 = 1,
        Code16k = 2,
        Code39 = 3,
        Code93 = 4,
        Code128 = 5,
        DataMatrix = 6,
        Ean8 = 7,
        Ean13 = 8,
        Industrial2of5 = 9,
        Interleaved2of5 = 10,
        Isbn = 11,
        Msi = 12,
        Pdf417 = 13,
        Planet = 14,
        Postnet = 15,
        UccEan128 = 16,
        UpcA = 17,
        UpcE = 18,
        UspsOneCode4CB = 19,
        RoyalMail = 20,
        AustraliaPost = 21,
        RoyalTpgPostKix = 22,
        Sscc18 = 23,
        Pzn = 24,
        DeutschePostLeitcode = 25,
        DeutschePostIdentcode = 26,
        UspsTrayLabel = 27,
        UspsSackLabel = 28,
        EanVelocity = 29,
        SingaporePost = 30,
        Jan8 = 31,
        Jan13 = 32,
        SwissPostParcel = 33,
        Opc = 34,
        Ean99 = 35,
        Itf14 = 36,
        Scc14 = 37,
        Issn = 38,
        Ismn = 39,
        NumlyNumber = 40,
        QRCode = 41,
        UspsFim = 42,
        UspsHorizontalBars = 43,
        Telepen = 44,
        Pharmacode = 45,
        Semacode = 46,
        Code32 = 47,
        UspsPicUccEan128 = 48,
        FedExGround96 = 49,
        AztecCode = 50,
        CompactPdf417 = 51,
        MacroPdf417 = 52,
        MicroPdf417 = 53,
        VicsBol = 54,
        VicsScacPro = 55,
        ItalianPost25 = 56,
        Isbt128 = 57,
        HibcLic39 = 58,
        HibcLic128 = 59,
        HibcPas39 = 60,
        HibcPas128 = 61,
        UspsIntelligentMail = 62,
        EanUpcAddOn2 = 63,
        EanUpcAddOn5 = 64,
        UspsPicCode128 = 65,
        GS1DataBarOmnidirectional = 66,
        GS1DataBar14 = 67,
        Rss14 = 68,
        GS1DataBarTruncated = 69,
        GS1DataBar14Truncated = 70,
        Rss14Truncated = 71,
        GS1DataBarStacked = 72,
        GS1DataBar14Stacked = 73,
        Rss14Stacked = 74,
        GS1DataBarStackedOmnidirectional = 75,
        GS1DataBar14StackedOmnidirectional = 76,
        Rss14StackedOmnidirectional = 77,
        GS1DataBarLimited = 78,
        RssLimited = 80,
        GS1DataBarExpanded = 81,
        RssExpanded = 82,
        GS1DataBarExpandedStacked = 83,
        RssExpandedStacked = 84,
        GS1128 = 85,
        MaxiCode = 86,
        MicroQRCode = 87,
        Matrix2of5 = 88,
        DanishPostal39 = 89,
        FrenchPostal39AR = 90,
        IATA2of5 = 91,
        AustraliaPostDomesticEParcelBarcode = 92,
        UspsIntelligentMailContainerBarcode = 93,
        KodakPatchCode = 94,
        GS1DataMatrix = 95,
        Ean13CCA = 96,
        Ean13CCB = 97,
        Ean8CCA = 98,
        Ean8CCB = 99,
        UpcACCA = 100,
        UpcACCB = 101,
        UpcECCA = 102,
        UpcECCB = 103,
        UccEan128CCA = 104,
        UccEan128CCB = 105,
        UccEan128CCC = 106,
        GS1128CCA = 107,
        GS1128CCB = 108,
        GS1128CCC = 109,
        GS1DataBarOmnidirectionalCCA = 110,
        GS1DataBar14CCA = 111,
        Rss14CCA = 112,
        GS1DataBarOmnidirectionalCCB = 113,
        GS1DataBar14CCB = 114,
        Rss14CCB = 115,
        GS1DataBarTruncatedCCA = 116,
        GS1DataBar14TruncatedCCA = 117,
        Rss14TruncatedCCA = 118,
        GS1DataBarTruncatedCCB = 119,
        GS1DataBar14TruncatedCCB = 120,
        Rss14TruncatedCCB = 121,
        GS1DataBarLimitedCCA = 122,
        RssLimitedCCA = 123,
        GS1DataBarLimitedCCB = 124,
        RssLimitedCCB = 125,
        GS1DataBarStackedCCA = 126,
        GS1DataBar14StackedCCA = 127,
        Rss14StackedCCA = 128,
        GS1DataBarStackedCCB = 129,
        GS1DataBar14StackedCCB = 130,
        Rss14StackedCCB = 131,
        GS1DataBarStackedOmnidirectionalCCA = 132,
        GS1DataBar14StackedOmnidirectionalCCA = 133,
        Rss14StackedOmnidirectionalCCA = 134,
        GS1DataBarStackedOmnidirectionalCCB = 135,
        GS1DataBar14StackedOmnidirectionalCCB = 136,
        Rss14StackedOmnidirectionalCCB = 137,
        GS1DataBarExpandedCCA = 138,
        RssExpandedCCA = 139,
        GS1DataBarExpandedCCB = 140,
        RssExpandedCCB = 141,
        GS1DataBarExpandedStackedCCA = 142,
        RssExpandedStackedCCA = 143,
        GS1DataBarExpandedStackedCCB = 144,
        RssExpandedStackedCCB = 145,
        Ean14 = 146,
        Dun14Itf = 147,
        Dun14Ean = 148,
        GS1QRCode = 149,
        Ppn = 150,
        IFAsecurPharm = 151,
        DhlAwb = 152,
        HibcLicDataMatrix = 153,
        HibcLicQRCode = 154,
        HibcLicAztecCode = 155,
        HibcPasDataMatrix = 156,
        HibcPasQRCode = 157,
        HibcPasAztecCode = 158,
        Isbt128DataMatrix = 159,
        DeutschePostResponsePlusPostMatrix = 160,
        DeutschePostBzl = 161,
        UspsIntelligentMailPackageBarcode = 162,
        HanXinCode = 163,
        JapanPost = 164,
        KoreaPost = 165,
        DataLogic2of5 = 166,
        MailmarkCMDM = 167,
        Mailmark4StateC = 168,
        Mailmark4StateL = 169,
        DotCode = 170,
        GS1AztecCode = 172,
        SwissQRCode = 173,
        Plessey = 174,
        EPCQRCode = 175,
        Code49 = 176,
        CodablockF = 177,
        Tlc39 = 178,
        HibcLicCodablockF = 179,
        HibcPasCodablockF = 180,
        TriOptic = 181,
        DINSpecQRCode = 182,
        DINSpecDataMatrix = 183,
        RectMicroQRCode = 184,
        GS1RectMicroQRCode = 185,
        DPDCode = 186,
        DAFT = 187
    }
    enum TelepenEncoding {
        Ascii = 0,
        Numeric = 1
    }
    enum UpcE {
        System0 = 0,
        System1 = 1
    }
    enum FIM {
        A = 0,
        B = 1,
        C = 2,
        D = 3
    }
    enum FontUnit {
        Inch = 0,
        Millimeter = 1,
        Pixel = 2,
        Point = 3
    }
    enum TextSizing {
        None = 0,
        Stretch = 1,
        FontSizeScaling = 2,
        ParagraphScaling = 3,
        Arc = 4,
        Vertical = 5
    }
    enum TextAlignment {
        Left = 0,
        Center = 1,
        Right = 2,
        Justify = 3
    }
    enum CodePage {
        CP850 = 0,
        CP1250 = 1,
        CP1251 = 2,
        CP1252 = 3,
        CP1253 = 4,
        CP1254 = 5,
        CP1255 = 6,
        UTF8 = 7
    }
    enum DitherMethod {
        Threshold = 0,
        PatternDiffusion = 1,
        FloydSteinberg = 2,
        OtsuThreshold = 3
    }
    enum DotCodeModuleShape {
        Circle = 0,
        Square = 1
    }
    enum RectMicroQRCodeVersion {
        Auto = 0,
        R7x43 = 1,
        R7x59 = 2,
        R7x77 = 3,
        R7x99 = 4,
        R7x139 = 5,
        R9x43 = 6,
        R9x59 = 7,
        R9x77 = 8,
        R9x99 = 9,
        R9x139 = 10,
        R11x27 = 11,
        R11x43 = 12,
        R11x59 = 13,
        R11x77 = 14,
        R11x99 = 15,
        R11x139 = 16,
        R13x27 = 17,
        R13x43 = 18,
        R13x59 = 19,
        R13x77 = 20,
        R13x99 = 21,
        R13x139 = 22,
        R15x43 = 23,
        R15x59 = 24,
        R15x77 = 25,
        R15x99 = 26,
        R15x139 = 27,
        R17x43 = 28,
        R17x59 = 29,
        R17x77 = 30,
        R17x99 = 31,
        R17x139 = 32
    }
    enum StrokeStyle {
        Solid = 0,
        Dash = 1,
        Dot = 2
    }
}
declare namespace Neodynamic.SDK.Printing {
    class Font {
        private _bold;
        private _code_page;
        private _custom_font_file;
        private _custom_font_file_family_name;
        private _is_bitmap_font;
        private _italic;
        private _name;
        private _name_at_printer_storage;
        private _size;
        private _strikeout;
        private _threshold;
        private _underline;
        private _unit;
        get bold(): boolean;
        set bold(value: boolean);
        get code_page(): CodePage;
        set code_page(value: CodePage);
        get custom_font_file(): string;
        set custom_font_file(value: string);
        get custom_font_file_family_name(): string;
        set custom_font_file_family_name(value: string);
        get is_bitmap_font(): boolean;
        set is_bitmap_font(value: boolean);
        get italic(): boolean;
        set italic(value: boolean);
        get name(): string;
        set name(value: string);
        get name_at_printer_storage(): string;
        set name_at_printer_storage(value: string);
        get size(): number;
        set size(value: number);
        get strikeout(): boolean;
        set strikeout(value: boolean);
        get threshold(): number;
        set threshold(value: number);
        get underline(): boolean;
        set underline(value: boolean);
        get unit(): FontUnit;
        set unit(value: FontUnit);
        constructor();
        propertyChanged(): void;
    }
}
declare namespace Neodynamic.SDK.Printing {
    class FrameThickness {
        private _bottom;
        private _left;
        private _right;
        private _top;
        get bottom(): number;
        set bottom(value: number);
        get left(): number;
        set left(value: number);
        get right(): number;
        set right(value: number);
        get top(): number;
        set top(value: number);
        constructor(left?: any, top?: any, right?: any, bottom?: any);
        propertyChanged(): void;
    }
}
declare namespace Neodynamic.SDK.Printing {
    class ImageItem extends Item {
        private _height;
        private _width;
        private _flip;
        private _hide_if_not_found;
        private _is_grayscale_or_black_white;
        private _lock_aspect_ratio;
        private _monochrome_settings;
        private _rotation_angle;
        private _source_base64;
        private _name_at_printer_storage;
        private _source_dpi;
        private _convert_to_monochrome;
        private _source_file;
        private _httpPattern;
        private _has_to_reload;
        private _image_item;
        private _original_image_item;
        get height(): any;
        set height(value: any);
        get width(): any;
        set width(value: any);
        get flip(): Flip;
        set flip(value: Flip);
        get hide_if_not_found(): boolean;
        set hide_if_not_found(value: boolean);
        get is_grayscale_or_black_white(): boolean;
        set is_grayscale_or_black_white(value: boolean);
        get lock_aspect_ratio(): LockAspectRatio;
        set lock_aspect_ratio(value: LockAspectRatio);
        get monochrome_settings(): MonochromeSettings;
        set monochrome_settings(value: MonochromeSettings);
        get rotation_angle(): number;
        set rotation_angle(value: number);
        get source_base64(): string;
        set source_base64(value: string);
        get name_at_printer_storage(): string;
        set name_at_printer_storage(value: string);
        get source_dpi(): number;
        set source_dpi(value: number);
        get convert_to_monochrome(): boolean;
        set convert_to_monochrome(value: boolean);
        get source_file(): string;
        set source_file(value: string);
        _getProperties(): {
            Type: string;
            Dpi: number;
            MonochromeSettings_DitherMethod: DitherMethod;
            MonochromeSettings_ReverseEffect: boolean;
            MonochromeSettings_Threshold: number;
            SourceBase64: string;
            LockAspectRatio: LockAspectRatio;
            Flip: Flip;
            RotationAngle: number;
            IsGrayscaleOrBlackWhite: boolean;
            Height: any;
            Width: any;
            UnitType: UnitType;
            X: number;
            Y: number;
            Comments: string;
            DataField: string;
            DataFieldFormatString: string;
            Name: string;
            PrintAsGraphic: boolean;
            Tag: string;
            Locked: boolean;
            Editable: boolean;
            NameAtPrinterStorage: string;
            SourceDpi: number;
            ConvertToMonochrome: boolean;
            Expression: string;
            SourceFile: string;
            UseCache: boolean;
            CacheItemId: string;
            Visible: boolean;
            GroupName: string;
            Resizable: boolean;
            ReadOnly: boolean;
        };
        _updateFromCanvas(): void;
        _updateToCanvas(): void;
        private _is_missing_image;
        refresh(): void;
        constructor();
    }
}
declare namespace Neodynamic.SDK.Printing {
    class ThermalLabelPage {
        protected _x: number;
        protected _y: number;
        protected _width: number;
        protected _height: number;
        get x(): number;
        set x(value: number);
        get y(): number;
        set y(value: number);
        get width(): number;
        set width(value: number);
        get height(): number;
        set height(value: number);
        _getProperties(): {
            X: number;
            Y: number;
            Height: number;
            Width: number;
        };
    }
}
declare namespace Neodynamic.SDK.Printing {
    class LineShapeItem extends ShapeItem {
        private _orientation;
        protected _stroke_thickness: number;
        get orientation(): LineOrientation;
        set orientation(value: LineOrientation);
        get stroke_thickness(): any;
        set stroke_thickness(value: any);
        protected _rotation_angle: number;
        _updateFromCanvas(property?: any): void;
        private _drawStrokeStyle;
        _updateToCanvas(property?: any): void;
        refresh(): void;
        _getProperties(): {
            Type: string;
            Orientation: LineOrientation;
            StrokeThickness: any;
            StrokeColor: Color;
            Width: number;
            Height: number;
            Name: string;
            X: number;
            Y: number;
            UnitType: UnitType;
            DataField: string;
            DataFieldFormatString: string;
            PrintAsGraphic: boolean;
            Comments: string;
            Tag: string;
            Locked: boolean;
            Editable: boolean;
            StrokeColorHex: string;
            Expression: string;
            UseCache: boolean;
            CacheItemId: string;
            Visible: boolean;
            StrokeStyle: StrokeStyle;
            StrokeStylePattern: string;
            GroupName: string;
            Resizable: boolean;
        };
        constructor();
        private _getOrientation;
    }
}
declare namespace Neodynamic.SDK.Printing {
    class MonochromeSettings {
        private _dither_method;
        private _reverse_effect;
        private _threshold;
        get dither_method(): DitherMethod;
        set dither_method(value: DitherMethod);
        get reverse_effect(): boolean;
        set reverse_effect(value: boolean);
        get threshold(): number;
        set threshold(value: number);
    }
}
declare namespace Neodynamic.SDK.Printing {
    class RectangleCornerRadius {
        private _bottom_left;
        private _bottom_right;
        private _top_left;
        private _top_right;
        get bottom_left(): number;
        set bottom_left(value: number);
        get bottom_right(): number;
        set bottom_right(value: number);
        get top_left(): number;
        set top_left(value: number);
        get top_right(): number;
        set top_right(value: number);
        constructor(top_left?: any, top_right?: any, bottom_right?: any, bottom_left?: any);
        propertyChanged(): void;
    }
}
declare namespace Neodynamic.SDK.Printing {
    class RectangleShapeItem extends ClosedShapeItem {
        protected _corner_radius: RectangleCornerRadius;
        protected _rotation_angle: number;
        get corner_radius(): RectangleCornerRadius;
        set corner_radius(value: RectangleCornerRadius);
        get rotation_angle(): number;
        set rotation_angle(value: number);
        _updateFromCanvas(property?: any): void;
        _updateToCanvas(property?: any): void;
        refresh(): void;
        _getProperties(): {
            Type: string;
            originX: string;
            originY: string;
            RotationAngle: number;
            CornerRadius_BottomLeft: number;
            CornerRadius_BottomRight: number;
            CornerRadius_TopLeft: number;
            CornerRadius_TopRight: number;
            FillColor: Color;
            StrokeThickness: any;
            StrokeColor: Color;
            Width: number;
            Height: number;
            Name: string;
            X: number;
            Y: number;
            UnitType: UnitType;
            DataField: string;
            DataFieldFormatString: string;
            PrintAsGraphic: boolean;
            Comments: string;
            Tag: string;
            Locked: boolean;
            Editable: boolean;
            FillColorHex: string;
            StrokeColorHex: string;
            Expression: string;
            UseCache: boolean;
            CacheItemId: string;
            Visible: boolean;
            StrokeStyle: StrokeStyle;
            StrokeStylePattern: string;
            GroupName: string;
            Resizable: boolean;
        };
        constructor();
    }
}
declare namespace Neodynamic.SDK.Printing {
    class RFIDTagItem extends Item {
        private _data_format;
        private _data_to_encode;
        private _epc_data_structure;
        _image: HTMLImageElement;
        get data_format(): RFIDTagDataFormat;
        set data_format(value: RFIDTagDataFormat);
        get data_to_encode(): string;
        set data_to_encode(value: string);
        get epc_data_structure(): string;
        set epc_data_structure(value: string);
        _updateFromCanvas(property?: any): void;
        _updateToCanvas(property?: any): void;
        refresh(): void;
        _getProperties(): {
            Type: string;
            EPCDataStructure: string;
            DataFormat: RFIDTagDataFormat;
            DataToEncode: string;
            Name: string;
            X: number;
            Y: number;
            UnitType: UnitType;
            DataField: string;
            DataFieldFormatString: string;
            PrintAsGraphic: boolean;
            Comments: string;
            Tag: string;
            Locked: boolean;
            Editable: boolean;
            Expression: string;
            UseCache: boolean;
            CacheItemId: string;
            Visible: boolean;
            GroupName: string;
            Resizable: boolean;
            ReadOnly: boolean;
        };
        constructor();
    }
}
declare namespace Neodynamic.SDK.Printing {
    class TextItem extends Item {
        private _back_color;
        private _border_color;
        private _border_thickness;
        private _corner_radius;
        private _counter_step;
        private _counter_use_leading_zeros;
        private _culture_name;
        private _font;
        private _fore_color;
        private _height;
        private _mask;
        private _mask_increment;
        private _right_to_left;
        private _rotation_angle;
        private _sizing;
        private _text;
        private _text_alignment;
        private _text_padding;
        private _width;
        private _max_length;
        private _hide_if_empty;
        private _back_color_hex;
        private _border_color_hex;
        private _fore_color_hex;
        private _input_mask_pattern;
        private _input_mask_prompt_char;
        private _stroke_thickness;
        private _stroke_color_hex;
        private _char_spacing;
        private _line_spacing;
        private _validation_regex;
        private _validation_error_message;
        private _has_to_reload;
        private _image_item;
        get back_color(): Color;
        set back_color(value: Color);
        get border_color(): Color;
        set border_color(value: Color);
        get border_thickness(): FrameThickness;
        set border_thickness(value: FrameThickness);
        get corner_radius(): RectangleCornerRadius;
        set corner_radius(value: RectangleCornerRadius);
        get counter_step(): number;
        set counter_step(value: number);
        get counter_use_leading_zeros(): boolean;
        set counter_use_leading_zeros(value: boolean);
        get culture_name(): string;
        set culture_name(value: string);
        get font(): Font;
        set font(value: Font);
        get fore_color(): Color;
        set fore_color(value: Color);
        get height(): any;
        set height(value: any);
        get mask(): string;
        set mask(value: string);
        get mask_increment(): string;
        set mask_increment(value: string);
        get right_to_left(): boolean;
        set right_to_left(value: boolean);
        get rotation_angle(): number;
        set rotation_angle(value: number);
        get sizing(): TextSizing;
        set sizing(value: TextSizing);
        get text(): string;
        set text(value: string);
        get text_alignment(): TextAlignment;
        set text_alignment(value: TextAlignment);
        get text_padding(): FrameThickness;
        set text_padding(value: FrameThickness);
        get width(): any;
        set width(value: any);
        get max_length(): number;
        set max_length(value: number);
        get hide_if_empty(): boolean;
        set hide_if_empty(value: boolean);
        get back_color_hex(): string;
        set back_color_hex(value: string);
        get border_color_hex(): string;
        set border_color_hex(value: string);
        get fore_color_hex(): string;
        set fore_color_hex(value: string);
        get input_mask_pattern(): string;
        set input_mask_pattern(value: string);
        get input_mask_prompt_char(): string;
        set input_mask_prompt_char(value: string);
        get stroke_color_hex(): string;
        set stroke_color_hex(value: string);
        get stroke_thickness(): any;
        set stroke_thickness(value: any);
        get char_spacing(): any;
        set char_spacing(value: any);
        get line_spacing(): any;
        set line_spacing(value: any);
        get validation_regex(): string;
        set validation_regex(value: string);
        get validation_error_message(): string;
        set validation_error_message(value: string);
        _updateFromCanvas(): void;
        _updateToCanvas(): void;
        refresh(): void;
        _getProperties(): {
            Type: string;
            UnitType: UnitType;
            X: number;
            Y: number;
            Dpi: number;
            BorderThickness_Bottom: number;
            BorderThickness_Left: number;
            BorderThickness_Right: number;
            BorderThickness_Top: number;
            TextPadding_Bottom: number;
            TextPadding_Left: number;
            TextPadding_Right: number;
            TextPadding_Top: number;
            CornerRadius_BottomLeft: number;
            CornerRadius_BottomRight: number;
            CornerRadius_TopLeft: number;
            CornerRadius_TopRight: number;
            Font_Bold: boolean;
            Font_CodePage: CodePage;
            Font_CustomFontFile: string;
            Font_CustomFontFileFamilyName: string;
            Font_IsBitmapFont: boolean;
            Font_Italic: boolean;
            Font_Name: string;
            Font_NameAtPrinterStorage: string;
            Font_Size: number;
            Font_Strikeout: boolean;
            Font_Threshold: number;
            Font_Underline: boolean;
            Font_Unit: FontUnit;
            BackColor: Color;
            BorderColor: Color;
            CounterStep: number;
            CounterUseLeadingZeros: boolean;
            CultureName: string;
            Font: Font;
            ForeColor: Color;
            Height: any;
            Mask: string;
            MaxLength: number;
            RightToLeft: boolean;
            RotationAngle: number;
            Sizing: TextSizing;
            Text: string;
            TextAlignment: TextAlignment;
            Width: any;
            Comments: string;
            DataField: string;
            DataFieldFormatString: string;
            Name: string;
            PrintAsGraphic: boolean;
            Tag: string;
            Locked: boolean;
            Editable: boolean;
            HideIfEmpty: boolean;
            BorderColorHex: string;
            BackColorHex: string;
            ForeColorHex: string;
            InputMaskPattern: string;
            InputMaskPromptChar: string;
            Expression: string;
            UseCache: boolean;
            CacheItemId: string;
            StrokeThickness: any;
            StrokeColorHex: string;
            Visible: boolean;
            CharSpacing: any;
            LineSpacing: any;
            GroupName: string;
            Resizable: boolean;
            ReadOnly: boolean;
            ValidationRegEx: string;
            ValidationErrorMessage: string;
        };
        constructor();
        private _dblClick;
        enterInEditMode(): void;
        private _onEditCtrlLostFocus;
        private _is_in_edit_mode;
        get is_in_edit_mode(): boolean;
    }
}
declare namespace Neodynamic.SDK.Printing {
    class ThermalLabel {
        private _unit_type;
        private _width;
        private _height;
        private _gap_length;
        is_continuous: boolean;
        items: Item[];
        private _labels_horizontal_gap_length;
        labels_per_row: number;
        private _mark_length;
        private _offset_length;
        data_member: string;
        data_source: object;
        data_source_culture_info: string;
        print_speed: string;
        print_mirror: boolean;
        cut_after_printing: boolean;
        darkness: number;
        private _sheet_labels_width;
        private _sheet_labels_height;
        sheet_labels_count: number;
        private _sheet_labels_margin;
        expressions: string[];
        batch_cut: number;
        design_background_image: string;
        pages: ThermalLabelPage[];
        _onUnitChange(): void;
        get width(): number;
        set width(value: number);
        get height(): number;
        set height(value: number);
        get unit_type(): UnitType;
        set unit_type(value: UnitType);
        get gap_length(): number;
        set gap_length(value: number);
        get labels_horizontal_gap_length(): number;
        set labels_horizontal_gap_length(value: number);
        get mark_length(): number;
        set mark_length(value: number);
        get offset_length(): number;
        set offset_length(value: number);
        get sheet_labels_width(): number;
        set sheet_labels_width(value: number);
        get sheet_labels_height(): number;
        set sheet_labels_height(value: number);
        get sheet_labels_margin(): FrameThickness;
        set sheet_labels_margin(value: FrameThickness);
        static createFromXmlTemplate(xmlTemplate: any): ThermalLabel;
        static createFromJsonTemplate(jsonTemplate: any): ThermalLabel;
        _getProperties(): {
            Width: number;
            Height: number;
            GapLength: number;
            IsContinuous: boolean;
            LabelsHorizontalGapLength: number;
            LabelsPerRow: number;
            MarkLength: number;
            OffsetLength: number;
            DataMember: string;
            DataSource: object;
            DataSourceCultureInfo: string;
            PrintSpeed: string;
            UnitType: UnitType;
            PrintMirror: boolean;
            CutAfterPrinting: boolean;
            Darkness: number;
            SheetLabelsWidth: number;
            SheetLabelsHeight: number;
            SheetLabelsCount: number;
            SheetLabelsMargin_Bottom: number;
            SheetLabelsMargin_Left: number;
            SheetLabelsMargin_Right: number;
            SheetLabelsMargin_Top: number;
            BatchCut: number;
            DesignBackgroundImage: string;
            Items: any[];
            Expressions: string[];
            Pages: any[];
        };
    }
}
declare namespace Neodynamic.Web.Editor {
    enum EditorTool {
        Pointer = 0,
        Rectangle = 1,
        Ellipse = 2,
        Line = 3,
        Text = 4,
        Barcode = 5,
        Image = 6,
        Literal = 7,
        RFIDTag = 8
    }
}
declare namespace Neodynamic.Web.Utils {
    class UnitUtils {
        static convertPixelToUnit: (value: any, unit: any) => any;
        static convertUnitToPixel: (value: number, unit: SDK.Printing.UnitType) => any;
        static convertPixelToFontUnit: (value: any, unit: any) => any;
        static convertFontUnitToPixel: (value: any, unit: any) => any;
        static _InchToPixel: (value: any) => number;
        static _PixelToInch: (value: any) => number;
    }
}
declare namespace Neodynamic.Web.Editor {
    class ThermalLabelEditor {
        static websiteRootAbsoluteUrl: string;
        static thermalLabelWebEditorControllerName: string;
        private _active_tool;
        private _tlweCanvasFabric;
        private _tlweBackgroundCanvasFabric;
        private _tlweCanvas;
        private _tlweBackgroundCanvas;
        private _master_container;
        private _selected_objects;
        private _is_drawing;
        private _container_div;
        private _tl;
        private _zoom;
        private _active_tool_item;
        private _angle_snap;
        private _grid_size;
        private get _grid_zoomed_size();
        private _show_grid;
        private _snap_to_grid;
        private _rfid_tag_image_file_name;
        private _lockedIcon;
        private _adorner_out_of_label_visible;
        private _itemToolTip;
        private _itemToolTipOverCount;
        private _tlweStyle;
        private _workspace_factor;
        private _workspaceOffsetX;
        private _workspaceOffsetY;
        private _selObjLT;
        private _undoManager;
        private _undoRedo;
        private _b64Encode;
        get rfid_tag_image_file_name(): string;
        set rfid_tag_image_file_name(value: string);
        get active_tool(): EditorTool;
        set active_tool(value: EditorTool);
        get active_tool_item(): SDK.Printing.Item;
        set active_tool_item(value: SDK.Printing.Item);
        get angle_snap(): number;
        set angle_snap(value: number);
        get grid_size(): any;
        set grid_size(value: any);
        get show_grid(): boolean;
        set show_grid(value: boolean);
        get snap_to_grid(): boolean;
        set snap_to_grid(value: boolean);
        get adorner_out_of_label_visible(): boolean;
        set adorner_out_of_label_visible(value: boolean);
        get undoRedo(): boolean;
        set undoRedo(value: boolean);
        get zoom(): number;
        set zoom(value: number);
        get current_selection(): any;
        get get_thermal_label(): SDK.Printing.ThermalLabel;
        constructor(container: string);
        private _drawRoundedRect;
        private _createRoundedRectClass;
        private _createBarcodeClass;
        private _drawFabricControls;
        enableEditor(): void;
        private getStyleValue;
        hideItemTooltip(): void;
        private updateItemTooltip;
        loadThermalLabel(tl: Neodynamic.SDK.Printing.ThermalLabel): void;
        private _centerCanvas;
        private _canvasMouseDown;
        private _canvasMouseMove;
        private _canvasMouseUp;
        private _canvasObjectModified;
        private _canvasObjectRotating;
        private _canvasObjectMoving;
        private _canvasObjectScaling;
        private _canvasObjectSelected;
        private _canvasSelectionCleared;
        private _setCanvasBackground;
        private _buildGrids;
        private _clearGrids;
        lockSelectedItems(): void;
        unlockSelectedItems(): void;
        bringForward(): void;
        bringToFront(): void;
        sendBackward(): void;
        sendToBack(): void;
        updateSelectionItemsProperties(): void;
        deleteSelectedItems(): void;
        deleteAll(): void;
        addItem(item: any): void;
        save(file_name?: string, custom_url?: string, format?: string): void;
        print(custom_url?: string, data_source_format?: string, data_source?: string): void;
        private _getLabelTemplate;
        getXmlTemplate(custom_url?: string, callback?: any): any;
        getJsonTemplate(custom_url?: string, callback?: any): any;
        getSupportedExpressions(custom_url?: string, callback?: any): any;
        getLabelPreview(xml_label_template?: string, custom_url?: string, out_format?: string, data_source_format?: string, data_source?: string, callback?: any): any;
        getLabelThumbnail(size: number, xml_label_template?: string, custom_url?: string, callback?: any): any;
        private _clipboardBuffer;
        private _objFromCut;
        clipboardCopy(): void;
        clipboardCut(): void;
        private _pasteCounter;
        clipboardPaste(): void;
        moveSelectedItems(deltaX: number, deltaY: number): void;
        get can_undo(): boolean;
        get can_redo(): boolean;
        undo(): void;
        redo(): void;
        private _updateLabelCanvasState;
        private _getCurrentLabelCanvasState;
        saveCurrentLabelCanvasState(): void;
        private _isGrouping;
        private _itemsGuidsInGroup;
        startGroup(): void;
        cancelGroup(): void;
        private _updateGroup;
        private _isItemInGrouping;
        get items_in_started_group(): any;
        get group_started(): boolean;
        createGroup(): void;
        unGroup(): void;
        getItemsInGroup(groupName: string, cloneItems?: boolean): any[];
        newItemCreated(): void;
        currentSelectionBeforeDelete(): boolean;
        currentSelectionAfterDelete(): void;
        selectionChanged(): void;
        selectionItemPropertyChanged(): void;
        undoStateChanged(): void;
        onError(errMsg: string, className: string): void;
        private _onError;
    }
}
declare namespace Neodynamic.Web.Utils {
    class Cloner {
        static cloneThermalLabel(tl: Neodynamic.SDK.Printing.ThermalLabel): Neodynamic.SDK.Printing.ThermalLabel;
        static cloneItem(itm: Neodynamic.SDK.Printing.Item): Neodynamic.SDK.Printing.Item;
        static clonePage(page: Neodynamic.SDK.Printing.ThermalLabelPage): Neodynamic.SDK.Printing.ThermalLabelPage;
    }
}
declare namespace Neodynamic.Web.Editor {
    class UndoManager {
        private _states;
        private _currentStateIndex;
        clear(): void;
        get canUndo(): boolean;
        get canRedo(): boolean;
        saveState(s: Neodynamic.SDK.Printing.ThermalLabel): void;
        undo(): Neodynamic.SDK.Printing.ThermalLabel;
        redo(): Neodynamic.SDK.Printing.ThermalLabel;
    }
}
declare namespace Neodynamic.Web.Utils {
    class MathUtils {
        static convertRadToDegrees: (rad: any) => number;
        static convertDegreesToRad: (degrees: any) => number;
        static calcOuterRectOfRotatedRect: (x: any, y: any, w: any, h: any, angle: any) => any[];
        static rotatedTopLeft: (x: any, y: any, width: any, height: any, rotationAngle: any) => {
            left: any;
            top: any;
        };
    }
}
declare namespace Neodynamic.Web.Utils {
    class NamingUtils {
        static newGuid: () => string;
        static convertXMLUCS2ToChar(text: string): string;
    }
}
declare namespace Neodynamic.Web.Utils {
    class XMLParser {
        protected static parseText: (sValue: any) => any;
        protected static isLiteralProp: (propName: any) => boolean;
        protected static JXONTree: (oXMLParent: any) => void;
        static XML2Json(xml: any): any;
        static XMLString2Json(stringValue: string): any;
    }
    class TLParser {
        static parseFontObject(json: any): SDK.Printing.Font;
        static parseItem(json: any, type: any, unitType: any): any;
        static parseExpression(json: any): any;
        static parsePage(json: any): SDK.Printing.ThermalLabelPage;
        static JsonConvertKeysToLowerCase(obj: any): {};
    }
}
declare namespace Neodynamic.Web.Utils {
    class MaskEditUtils {
        static setCaretPosition: (ctrl: any, pos: any) => void;
        private static getMaskElements;
        static masking: (inputCtrl: any, mask: any, promptChar: any) => void;
        static getMaskedData: (inputCtrl: any, promptChar: any) => any;
    }
}
declare namespace Neodynamic.Web.Utils {
    class TextUtils {
        static isEmpty: (value: any) => boolean;
    }
}
declare namespace Neodynamic.Web.Utils {
    class BarcodeItemUtils {
        static getRelatedProperties: (symbology: SDK.Printing.BarcodeSymbology) => any[];
    }
}
