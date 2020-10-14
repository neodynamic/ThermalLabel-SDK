using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Neodynamic.Web.ThermalLabelEditor;

namespace TLWebEditorASPNETCOREMVCDemo.Controllers
{
    public class ThermalLabelWebEditorHandlerController : Controller
    {
        private IWebHostEnvironment _env;
        private HttpContext _ctx;

        public ThermalLabelWebEditorHandlerController(IWebHostEnvironment env, IHttpContextAccessor ctx)
        {
            _env = env;
            _ctx = ctx.HttpContext;

            // Allow synchronous I/O on a per-endpoint basis
            var syncIOFeature = _ctx.Features.Get<IHttpBodyControlFeature>();
            if (syncIOFeature != null)
            {
                syncIOFeature.AllowSynchronousIO = true;
            }
        }

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
                ThermalLabelWebEditor.WebsiteRootPhysicalPath = _env.WebRootPath;

                //Pass data processing to ThermalLabelWebEditor
                var httpRequestData = new System.Collections.Specialized.NameValueCollection();
                if (_ctx.Request.Method == "POST")
                {
                    foreach (var entry in _ctx.Request.Form)
                    {
                        httpRequestData.Add(entry.Key, entry.Value);
                    }
                }
                else
                {
                    foreach (var entry in _ctx.Request.Query)
                    {
                        httpRequestData.Add(entry.Key, entry.Value);
                    }
                }


                var httpResponse = ThermalLabelWebEditor.ProcessRequest(httpRequestData);


                //set http response data
                if (string.IsNullOrEmpty(httpResponse.HeaderName) == false)
                {
                    _ctx.Response.Headers.Add(httpResponse.HeaderName, httpResponse.HeaderValue);
                }
                _ctx.Response.ContentType = httpResponse.ContentType;
                _ctx.Response.Body.Write(Encoding.UTF8.GetBytes(httpResponse.Content)); //await _ctx.Response.WriteAsync(httpResponse.Content);



            }
            catch (Exception ex)
            {
                _ctx.Response.StatusCode = 400;
                _ctx.Response.ContentType = "text/plain";
                _ctx.Response.Body.Write(Encoding.UTF8.GetBytes(ex.Message)); //await _ctx.Response.WriteAsync(ex.Message);
            }
        }
    }
}
