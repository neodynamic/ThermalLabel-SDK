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
                context.Response.StatusCode = 400;
                context.Response.ContentType = "text/plain";
                context.Response.Write(ex.Message);
            }

            
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}