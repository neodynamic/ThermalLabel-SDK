# ThermalLabel SDK - .NET Samples

This repo contains **Visual Studio (2019+)** sample projects for **ASP.NET (CORE, Legacy WebForms & MVC), Windows Forms, and WPF** platforms using the [**ThermalLabel SDK & Visual Label Editors**](https://www.neodynamic.com/products/printing/thermal-label/sdk-vb-net-csharp/).

## Overview about each sample folder

- **ASPNETClientPrint**: **ASP.NET CORE MVC & Razor** samples showing how to print **ThermalLabel** objects generated from the website to the **Client Printers** by using **TLClientPrint** utility. 

- **LabelsGallery**: it contains different barcode **label templates in XML format**. Used by **Visual Label Editor** sample projects.

- **TLClientPrint.Plugin.CustomPrintDialog**: it contains a sample project to create a Custom Print Dialog to be integrated with TLClientPrint utility.

- **TLSDKSamplesCS**: a **Windows Forms** project that uses the [**ThermalLabel SDK**](https://www.neodynamic.com/products/printing/thermal-label/sdk-vb-net-csharp/) to create labels in pure .NET code that can be printed, preview, exported to image formats or PDF, or exported to XML template format.

- **TLSDKSamplesWPFCS**: a **WPF** project that uses the [**ThermalLabel SDK**](https://www.neodynamic.com/products/printing/thermal-label/sdk-vb-net-csharp/) to create labels in pure .NET code that can be printed, preview, exported to image formats or PDF, or exported to XML template format.

- **TLWebEditorASPNETCOREMVCDemo**: an **ASP.NET CORE MVC** project that uses the [**ThermalLabel Visual Web Editor Add-on**](https://www.neodynamic.com/products/printing/thermal-label/web-editor) to allow end-users to design barcode labels. It also shows how to print, preview, and export the designed labels.
  
- **TLWebEditorASPNETCORERazorDemo**: an **ASP.NET CORE Razor** project that uses the [**ThermalLabel Visual Web Editor Add-on**](https://www.neodynamic.com/products/printing/thermal-label/web-editor) to allow end-users to design barcode labels. It also shows how to print, preview, and export the designed labels.
 
- **TLWebEditorLegacyMVCDemo**: an **ASP.NET MVC (Legacy .NET Framework)** project that uses the [**ThermalLabel Visual Web Editor Add-on**](https://www.neodynamic.com/products/printing/thermal-label/web-editor) to allow end-users to design barcode labels. It also shows how to print, preview, and export the designed labels.

- **TLWebEditorWebFormsDemo**: an **ASP.NET WebForms (Legacy .NET Framework)** project that uses the [**ThermalLabel Visual Web Editor Add-on**](https://www.neodynamic.com/products/printing/thermal-label/web-editor) to allow end-users to design barcode labels. It also shows how to print, preview, and export the designed labels.

- **TLWindowsEditorWinFormsDemo**: a **Windows Forms (Legacy .NET Framework)** project that uses the [**ThermalLabel Visual Windows Editor Add-on**](https://www.neodynamic.com/products/printing/thermal-label/editor) to allow end-users to design barcode labels. It also shows how to print, preview, and export the designed labels.

- **TLWindowsEditorWinFormsNetCoreDemo**: a **Windows Forms (.NET CORE)** project that uses the [**ThermalLabel Visual Windows Editor Add-on**](https://www.neodynamic.com/products/printing/thermal-label/editor) to allow end-users to design barcode labels. It also shows how to print, preview, and export the designed labels.

- **TLWindowsEditorWPFDemo**: a **WPF (Legacy .NET Framework)** project that uses the [**ThermalLabel Visual Windows Editor Add-on**](https://www.neodynamic.com/products/printing/thermal-label/editor) to allow end-users to design barcode labels. It also shows how to print, preview, and export the designed labels.

- **TLWindowsEditorWPFNetCoreDemo**: a **WPF (.NET CORE)** project that uses the [**ThermalLabel Visual Windows Editor Add-on**](https://www.neodynamic.com/products/printing/thermal-label/editor) to allow end-users to design barcode labels. It also shows how to print, preview, and export the designed labels.

## Notes about ASP.NET CORE Samples under Linux

- Add the following package references in the sample project:
```
<ItemGroup>
    <PackageReference Include="Neodynamic.SDK.ThermalLabel" Version="14.0.25.217" />
    <PackageReference Include="SkiaSharp" Version="2.88.8" />
    <PackageReference Include="SkiaSharp.NativeAssets.Linux.NoDependencies" Version="2.88.8" />
    <PackageReference Include="SkiaSharp.HarfBuzz" Version="2.88.8" />
    <PackageReference Include="HarfBuzzSharp.NativeAssets.Linux" Version="7.3.0.2" />
    <PackageReference Include="System.Text.Encoding.CodePages" Version="4.7.1" />
</ItemGroup>
```


## Licensing

[**ThermalLabel SDK & Visual Label Editors**](https://www.neodynamic.com/products/printing/thermal-label/sdk-vb-net-csharp/) are Commercial products. Licensing model and prices are available [here](https://www.neodynamic.com/products/printing/thermal-label/sdk-vb-net-csharp/buy)

## Support

Tech questions are handled by [Neodynamic Dev Team](https://neodynamic/support)
