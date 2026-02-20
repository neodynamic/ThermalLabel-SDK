using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Neodynamic.Web.ThermalLabelEditor;

namespace TLWebEditorWebFormsDemo
{
    /// <summary>
    /// Summary description for ThermalLabelWebEditorHandler
    /// </summary>
    public class ThermalLabelWebEditorHandler : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            try
            {

                ////Try to add the custom font                
                //var font1 = new Neodynamic.SDK.Printing.Font();
                //font1.Name = "Arial Unicode MS";
                //font1.CustomFontFile = Convert.ToBase64String(System.IO.File.ReadAllBytes(@"C:\Windows\Fonts\ARIALUNI.TTF"));
                //Neodynamic.SDK.Printing.FontManager.Add(font1);


                //Set license info for Web Editor and SDK
                ThermalLabelWebEditor.LicenseOwnerForEditor = "LICENSE OWNER FOR WEB EDITOR HERE";
                ThermalLabelWebEditor.LicenseKeyForEditor = "LICENSE KEY FOR WEB EDITOR HERE";
                ThermalLabelWebEditor.LicenseOwnerForSDK = "LICENSE OWNER FOR SDK HERE";
                ThermalLabelWebEditor.LicenseKeyForSDK = "LICENSE KEY FOR SDK HERE";

                //Set physical path of this website root folder
                ThermalLabelWebEditor.WebsiteRootPhysicalPath = context.Server.MapPath("~/");


                //Pass data processing to ThermalLabelWebEditor
                ThermalLabelWebEditorHttpResponse httpResponse = ThermalLabelWebEditor.ProcessRequest(context.Request.HttpMethod == "POST" ? context.Request.Form : context.Request.QueryString);


                //set http response data
                context.Response.ContentType = httpResponse.ContentType;
                context.Response.Write(httpResponse.Content);
                if (string.IsNullOrEmpty(httpResponse.HeaderName) == false)
                {
                    context.Response.Headers.Add(httpResponse.HeaderName, httpResponse.HeaderValue);
                }

            }
            catch (Exception ex)
            {
                //context.Response.StatusCode = 400;
                context.Response.ContentType = "text/plain";
                context.Response.Write(ex.Message);
            }


        }


        //public void ProcessRequest(HttpContext context)
        //{
        //    try
        //    {

        //        //Set license info for Web Editor and SDK
        //        ThermalLabelWebEditor.LicenseOwnerForEditor = "LICENSE OWNER FOR WEB EDITOR HERE";
        //        ThermalLabelWebEditor.LicenseKeyForEditor = "LICENSE KEY FOR WEB EDITOR HERE";
        //        ThermalLabelWebEditor.LicenseOwnerForSDK = "LICENSE OWNER FOR SDK HERE";
        //        ThermalLabelWebEditor.LicenseKeyForSDK = "LICENSE KEY FOR SDK HERE";

        //        //Set physical path of this website root folder
        //        ThermalLabelWebEditor.WebsiteRootPhysicalPath = context.Server.MapPath("~/");

        //        // Need to detect if the call is from the TLClientPrint which will request a webPrintJob
        //        if (context.Request.HttpMethod == "GET"
        //            && context.Request.QueryString["webPrintJob"] != null
        //            && context.Request.QueryString["labelID"] != null)
        //        {
        //            /*
        //            //get label ID
        //            string labelID = context.Request.QueryString["labelID"];

        //            //read label from temp TempLabels folder
        //            string pathSlash = string.IsNullOrEmpty(ThermalLabelWebEditor.WebsiteRootPhysicalPath) ? "\\" : (ThermalLabelWebEditor.WebsiteRootPhysicalPath.Contains("/") ? "/" : "\\");
        //            string filePath = ThermalLabelWebEditor.WebsiteRootPhysicalPath + pathSlash + "TempLabels" + pathSlash + labelID;
        //            string xmlLabelTemplate = System.IO.File.ReadAllText(filePath);

        //            var tl = Neodynamic.SDK.Printing.ThermalLabel.CreateFromXmlTemplate(xmlLabelTemplate);
        //            // check if any TextItem is referencing to "Fresh Fruit" font
        //            for (int i = 0; i < tl.Items.Count; i++)
        //            {
        //                if (tl.Items[i] is Neodynamic.SDK.Printing.TextItem)
        //                {
        //                    if (((Neodynamic.SDK.Printing.TextItem)tl.Items[i]).Font.Name == "Fresh Fruit")
        //                    {
        //                        // set the custom font file prop with the base64 string of the ttf font
        //                        ((Neodynamic.SDK.Printing.TextItem)tl.Items[i]).Font.CustomFontFile = Convert.ToBase64String(System.IO.File.ReadAllBytes(@"C:\temp\Fresh Fruit.ttf"));
        //                    } 
        //                    else if (((Neodynamic.SDK.Printing.TextItem)tl.Items[i]).Font.Name == "HakusyuInsoutai_kk")
        //                    {
        //                        // set the custom font file prop with the base64 string of the ttf font
        //                        ((Neodynamic.SDK.Printing.TextItem)tl.Items[i]).Font.CustomFontFile = Convert.ToBase64String(System.IO.File.ReadAllBytes(@"C:\temp\CodeAndPage2\selffonts\HakusyuInsoutai_kk.ttf"));
        //                    }
        //                }
        //            }
        //            // resave label template with the new settings
        //            System.IO.File.WriteAllText(filePath, tl.GetXmlTemplate());
        //            */

        ////get label ID
        //string labelID = context.Request.QueryString["labelID"];

        //            //read label from temp TempLabels folder
        //            string pathSlash = string.IsNullOrEmpty(ThermalLabelWebEditor.WebsiteRootPhysicalPath) ? "\\" : (ThermalLabelWebEditor.WebsiteRootPhysicalPath.Contains("/") ? "/" : "\\");
        //            string filePath = ThermalLabelWebEditor.WebsiteRootPhysicalPath + pathSlash + "TempLabels" + pathSlash + labelID;
        //            string xmlLabelTemplate = System.IO.File.ReadAllText(filePath);
        //            System.IO.File.Delete(filePath);

        //            // load label template
        //            var tl = Neodynamic.SDK.Printing.ThermalLabel.CreateFromXmlTemplate(xmlLabelTemplate);

        //            //Create a WebPrintJob obj
        //            Neodynamic.SDK.Printing.WebPrintJob webPj = new Neodynamic.SDK.Printing.WebPrintJob();

        //            //get lic info
        //            webPj.LicenseOwner = "LICENSE OWNER FOR SDK";
        //            webPj.LicenseKey = "LICENSE KEY FOR SDK";

        //            //EXPORT LABEL TO RAW PRINTER COMMANDS OR IMAGES
        //            using (var pj = new Neodynamic.SDK.Printing.PrintJob())
        //            {
        //                pj.Dpi = 203;

        //                /*
        //                // IF RAW COMMANDS....
        //                pj.ProgrammingLanguage = Neodynamic.SDK.Printing.ProgrammingLanguage.ZPL;
        //                webPj.RawPrinterCommands = pj.GetBinaryNativePrinterCommands(tl);
        //                */

        //                // IF IMAGES....
        //                using (System.IO.MemoryStream ms = new System.IO.MemoryStream())
        //                {
        //                    Neodynamic.SDK.Printing.ImageSettings imgSettings = new Neodynamic.SDK.Printing.ImageSettings();
        //                    imgSettings.ImageFormat = Neodynamic.SDK.Printing.ImageFormat.Png;

        //                    pj.ExportToImage(tl, ms, imgSettings, pj.Dpi);

        //                    webPj.PrintFiles = ms.ToArray();
        //                }

        //            }

        //            //display print dialog to the client  
        //            webPj.ShowPrintDialog = true;
        //            //webPj.PrinterSettings = new Neodynamic.SDK.Printing.PrinterSettings() { UseDefaultPrinter = true };

        //            //Serialize WebPrintJob and send it back to the client
        //            //so it can be processed by the TLClientPrint utility
        //            context.Response.ContentType = "text/plain";
        //            context.Response.Write(webPj.ToString());



        //        }
        //        else
        //        {
        //            // For any other task, always try to add the custom font
        //            var font1 = new Neodynamic.SDK.Printing.Font();
        //            font1.Name = "Fresh Fruit";
        //            font1.CustomFontFile = Convert.ToBase64String(System.IO.File.ReadAllBytes(@"C:\temp\Fresh Fruit.ttf"));
        //            Neodynamic.SDK.Printing.FontManager.Add(font1);

        //            var font2 = new Neodynamic.SDK.Printing.Font();
        //            font2.Name = "HakusyuInsoutai_kk";
        //            font2.CustomFontFile = Convert.ToBase64String(System.IO.File.ReadAllBytes(@"C:\temp\CodeAndPage2\selffonts\HakusyuInsoutai_kk.ttf"));
        //            Neodynamic.SDK.Printing.FontManager.Add(font2);

        //            //Pass data processing to ThermalLabelWebEditor
        //            ThermalLabelWebEditorHttpResponse httpResponse = ThermalLabelWebEditor.ProcessRequest(context.Request.HttpMethod == "POST" ? context.Request.Form : context.Request.QueryString);
        //            //set http response data
        //            context.Response.ContentType = httpResponse.ContentType;
        //            context.Response.Write(httpResponse.Content);
        //            if (string.IsNullOrEmpty(httpResponse.HeaderName) == false)
        //            {
        //                context.Response.Headers.Add(httpResponse.HeaderName, httpResponse.HeaderValue);
        //            }

        //        }





        //    }
        //    catch (Exception ex)
        //    {
        //        //context.Response.StatusCode = 400;
        //        context.Response.ContentType = "text/plain";
        //        context.Response.Write(ex.Message);
        //    }


        //}

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}