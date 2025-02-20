using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using Neodynamic.Web.ThermalLabelEditor;

namespace TLWebEditorMVCDemo.Controllers
{
    public class ThermalLabelWebEditorHandlerController : Controller
    {
        public void ProcessRequest()
        {
            try
            {
                //Set license info for Web Editor and SDK
                ThermalLabelWebEditor.LicenseOwnerForEditor = "LICENSE OWNER FOR WEB EDITOR HERE";
                ThermalLabelWebEditor.LicenseKeyForEditor = "LICENSE KEY FOR WEB EDITOR HERE";
                ThermalLabelWebEditor.LicenseOwnerForSDK = "LICENSE OWNER FOR SDK HERE";
                ThermalLabelWebEditor.LicenseKeyForSDK = "LICENSE KEY FOR SDK HERE";

                //Set physical path of this website root folder
                ThermalLabelWebEditor.WebsiteRootPhysicalPath = System.Web.HttpContext.Current.Server.MapPath("~/");
                
                //Pass data processing to ThermalLabelWebEditor
                ThermalLabelWebEditorHttpResponse httpResponse = ThermalLabelWebEditor.ProcessRequest(System.Web.HttpContext.Current.Request.HttpMethod == "POST" ? System.Web.HttpContext.Current.Request.Form : System.Web.HttpContext.Current.Request.QueryString);

                //set http response data
                System.Web.HttpContext.Current.Response.ContentType = httpResponse.ContentType;
                System.Web.HttpContext.Current.Response.Write(httpResponse.Content);
                if (string.IsNullOrEmpty(httpResponse.HeaderName) == false)
                {
                    System.Web.HttpContext.Current.Response.Headers.Add(httpResponse.HeaderName, httpResponse.HeaderValue);
                }
            }
            catch (Exception ex)
            {
                System.Web.HttpContext.Current.Response.StatusCode = 400;
                System.Web.HttpContext.Current.Response.ContentType = "text/plain";
                System.Web.HttpContext.Current.Response.Write(ex.Message);
            }

        }
    }
}