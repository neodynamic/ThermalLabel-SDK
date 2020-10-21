using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Neodynamic.SDK.Printing;

namespace TLClientPrintASPNETCORERazor
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddRazorPages();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();

                endpoints.MapGet("/GetWebPrintJob", GetWebPrintJob);
            });
        }

        public async Task GetWebPrintJob(HttpContext context)
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
                context.Response.ContentType = "text/plain";
                await context.Response.WriteAsync(webPj.ToString());

            }
            catch (Exception ex)
            {
                context.Response.StatusCode = 400;
                context.Response.ContentType = "text/plain";
                await context.Response.WriteAsync(ex.Message);
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
