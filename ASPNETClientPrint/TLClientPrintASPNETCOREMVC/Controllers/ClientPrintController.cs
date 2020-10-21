using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Neodynamic.SDK.Printing;

namespace TLClientPrintASPNETCOREMVC.Controllers
{
    public class ClientPrintController : Controller
    {
        private IWebHostEnvironment _env;
        private HttpContext _ctx;

        public ClientPrintController(IWebHostEnvironment env, IHttpContextAccessor ctx)
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

        [HttpGet]
        public void GetWebPrintJob()
        {
            try
            {
                //Create a WebPrintJob obj 
                WebPrintJob webPj = new WebPrintJob();

                //set a ThermalLabel obj 
                webPj.ThermalLabel = GenerateBasicThermalLabel();

                //display print dialog to the client  
                webPj.ShowPrintDialog = true;

                //set http response data
                //Serialize WebPrintJob and send it back to the client
                //so it can be processed by the TLClientPrint utility
                _ctx.Response.ContentType = "text/plain";
                _ctx.Response.Body.Write(Encoding.UTF8.GetBytes(webPj.ToString()));

            }
            catch (Exception ex)
            {
                _ctx.Response.StatusCode = 400;
                _ctx.Response.ContentType = "text/plain";
                _ctx.Response.Body.Write(Encoding.UTF8.GetBytes(ex.Message)); //await _ctx.Response.WriteAsync(ex.Message);
            }
        }

        private ThermalLabel GenerateBasicThermalLabel()
        {
            //Define a ThermalLabel object and set unit to inch and label size
            ThermalLabel tLabel = new ThermalLabel(Neodynamic.SDK.Printing.UnitType.Inch, 4, 3);
            tLabel.GapLength = 0.2;

            //Define a TextItem object
            TextItem txtItem = new TextItem(0.2, 0.2, 2.5, 0.5, "Thermal Label Test");

            //Define a BarcodeItem object
            BarcodeItem bcItem = new BarcodeItem(0.2, 1, 2, 1, BarcodeSymbology.Code128, "ABC 12345");
            //Set bars height to .75inch
            bcItem.BarHeight = 0.75;
            //Set bars width to 0.0104inch
            bcItem.BarWidth = 0.0104;

            //Add items to ThermalLabel object...
            tLabel.Items.Add(txtItem);
            tLabel.Items.Add(bcItem);


            return tLabel;
        }
    }
}
