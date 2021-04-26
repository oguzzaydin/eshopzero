using Autofac;
using Autofac.Extensions.DependencyInjection;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.IO.Compression;
using Product.Api.Application.Hubs;
using Product.Api.Web.Extensions;
using Zero.Eventbus.RabbitMQ;
using Zero.Eventlog;

namespace Product.Api
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        public Startup(IWebHostEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            services
                .AddOpenApis(Configuration)
                .AddMediator()
                .AddResponseCompression(options =>
                {
                    options.Providers.Add<GzipCompressionProvider>();
                })
                .AddHttpContextAccessor()
                .AddOptions()
                .AddEventBus(Configuration)
                .AddCustomApiVersioning()
                .AddCustomControllers()
                .AddCustomHealtCheck(Configuration)
                .AddCustomAuthentications(Configuration)
                .AddData(Configuration)
                .AddStart()
                .AddEventLog(Configuration, "Product.Api")
                .AddSignalR(o => o.EnableDetailedErrors = true);

            services.Configure<GzipCompressionProviderOptions>(options =>
            {
                options.Level = CompressionLevel.Fastest;
            });

            var container = new ContainerBuilder();
            ConfigureContainer(container);
            container.Populate(services);
            return new AutofacServiceProvider(container.Build());
        }

        public void ConfigureContainer(ContainerBuilder builder)
        {
            builder.AddMediator();
            builder.AddServices();
            builder.AddRepositories();
            builder.AddValidators();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory)
        {

            var pathBase = Configuration["PATH_BASE"];
            if (!string.IsNullOrEmpty(pathBase))
            {
                loggerFactory.CreateLogger<Startup>().LogDebug("Using PATH BASE '{pathBase}'", pathBase);
                app.UsePathBase(pathBase);
            }

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseOpenApis(Configuration);
            }
            app.UseSubscribes();
            app.UseEventLog();
            app.UseApiVersioning();
            app.UseResponseCompression();

            app.UseCors(env.EnvironmentName);

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapDefaultControllerRoute();
                endpoints.MapControllers();
                endpoints.MapHub<ProductHub>("/hub");
                endpoints.MapHealthChecks("/hc", new HealthCheckOptions
                {
                    Predicate = _ => true,
                    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
                });
                endpoints.MapHealthChecks("/liveness", new HealthCheckOptions
                {
                    Predicate = r => r.Name.Contains("self")
                });
            });
        }
    }
}
