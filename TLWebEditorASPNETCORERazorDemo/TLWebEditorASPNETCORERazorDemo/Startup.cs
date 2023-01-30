using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Neodynamic.Web.ThermalLabelEditor;

namespace TLWebEditorASPNETCORERazorDemo
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

                this.WebRootPath = env.WebRootPath;
                endpoints.MapPost("/ThermalLabelWebEditorProcessRequest", ThermalLabelWebEditorProcessRequest);
                endpoints.MapGet("/ThermalLabelWebEditorProcessRequest", ThermalLabelWebEditorProcessRequest);

            });
        }

        private string WebRootPath = "";

        public async Task ThermalLabelWebEditorProcessRequest(HttpContext context)
        {
            try
            {
                //Set license info for Web Editor and SDK
                ThermalLabelWebEditor.LicenseOwnerForEditor = "LICENSE OWNER FOR WEB EDITOR HERE";
                ThermalLabelWebEditor.LicenseKeyForEditor = "LICENSE KEY FOR WEB EDITOR HERE";
                ThermalLabelWebEditor.LicenseOwnerForSDK = "LICENSE OWNER FOR SDK HERE";
                ThermalLabelWebEditor.LicenseKeyForSDK = "LICENSE KEY FOR SDK HERE";
                
                //Set physical path of this website root folder
                ThermalLabelWebEditor.WebsiteRootPhysicalPath = this.WebRootPath;


                //Pass data processing to ThermalLabelWebEditor
                var reqData = new NameValueCollection();

                try
                {
                    if (context.Request.Form != null)
                    {
                        foreach (var entry in context.Request.Form)
                            reqData.Add(entry.Key, entry.Value.ToString());
                    }
                }
                catch
                {
                    if (context.Request.Query != null)
                    {
                        foreach (var entry in context.Request.Query)
                            reqData.Add(entry.Key, entry.Value.ToString());
                    }
                }
                

                ThermalLabelWebEditorHttpResponse httpResponse = ThermalLabelWebEditor.ProcessRequest(reqData);


                //set http response data
                if (string.IsNullOrEmpty(httpResponse.HeaderName) == false)
                {
                    context.Response.Headers.Add(httpResponse.HeaderName, httpResponse.HeaderValue);
                }
                if (httpResponse.Content != null)
                {
                    context.Response.ContentType = httpResponse.ContentType;
                    await context.Response.WriteAsync(httpResponse.Content);
                }
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = 400;
                context.Response.ContentType = "text/plain";
                await context.Response.WriteAsync(ex.Message);
            }

        }

    }
}
