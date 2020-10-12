<?xml version="1.0" encoding="utf-8"?>
<ThermalLabel Version="9.0" Width="4" Height="2.5" GapLength="0" MarkLength="0" OffsetLength="0" UnitType="Inch" LabelsPerRow="1" LabelsHorizontalGapLength="0" IsContinuous="False" PrintSpeed="" PrintMirror="False" CutAfterPrinting="False">
  <Items>
    <RectangleShapeItem Locked="True" Width="4" Height="2.5" StrokeThickness="0.03" />
    <RectangleShapeItem X="3.2917" Y="2.0209" Width="0.6875" Height="0.4584" FillColor="Black" />
    <TextItem X="3.401" Y="2.1979" Expression="Left(GetVoicePickCode(Right([Items!GTIN], Len([Items!GTIN]) - 5) + Right([Items!Lot], Len([Items!Lot]) - 5)), 2)" Width="0.3229" Height="0.2812" Text="_x0030_0" Font="ZPL Font 0,10,Point,,,False,90,,CP850" ForeColor="White" />
    <TextItem X="3.5886" Y="2.062" Expression="Right(GetVoicePickCode(Right([Items!GTIN], Len([Items!GTIN]) - 5) + Right([Items!Lot], Len([Items!Lot]) - 5)), 2)  " Width="0.5208" Height="0.427" Text="_x0030_0" Font="ZPL Font 0,20,Point,,,False,90,,CP850" ForeColor="White" />
    <TextItem Name="GTIN" X="0.1459" Y="1.9087" Width="1.5105" Height="0.2396" Text="_x0028_01_x0029__x0020_10850510002011" Font="ZPL Font 0,12,Point,,,False,90,,CP850" />
    <TextItem Name="Lot" X="0.1355" Y="2.1796" Width="1.5209" Height="0.2396" Text="_x0028_10_x0029__x0020_46587443HG234" Font="ZPL Font 0,12,Point,,,False,90,,CP850" />
    <TextItem X="0.2813" Y="0.1978" Width="1.4792" Height="0.6251" Text="RED_x0020_SEEDLESS_x000D__x000A_WATERMELON" Font="ZPL Font 0,16,Point,,,False,90,,CP850" TextAlignment="Center" />
    <BarcodeItem X="0.0938" Y="1.0729" Expression="&quot;(01)&quot; + Right([Items!GTIN], Len([Items!GTIN]) - 5) + &quot;(10)&quot; + Right([Items!Lot], Len([Items!Lot]) - 5)" Width="3.7917" Height="0.8021" Symbology="GS1128" Code="_x0031_23456789" AddChecksum="False" BarcodeAlignment="MiddleCenter" Font="NativePrinterFontA,5,Point,,,False,90,,CP850" Sizing="FitProportional" TextFont="NativePrinterFontA,10,Point,,,False,90,,CP850" MaxiCodeDrawPixelBasedSymbol="True" DotCodeAspectRatio="" />
    <LineShapeItem X="2.0012" Y="0.0208" Width="0.03" Height="0.9271" StrokeThickness="0.03" Orientation="Vertical" />
    <TextItem X="2.2721" Y="0.1982" Width="1.4792" Height="0.6251" Text="_x0032_4_x0022__x0020_BIN_x000D__x000A_36_x0020_COUNT" Font="ZPL Font 0,16,Point,,,False,90,,CP850" TextAlignment="Center" />
    <LineShapeItem X="0.0212" Y="0.9212" Width="3.9688" Height="0.03" StrokeThickness="0.03" />
  </Items>
</ThermalLabel>