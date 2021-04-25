using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;

namespace Gateway
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults((webBuilder) =>
                {
                    webBuilder.ConfigureAppConfiguration((hostingContext, config) =>
                    {
                        config
                            .SetBasePath(hostingContext.HostingEnvironment.ContentRootPath)
                            .AddJsonFile("appsettings.json", true, true)
                            .AddJsonFile($"appsettings.{hostingContext.HostingEnvironment.EnvironmentName}.json", true, true)
                            .AddJsonFile("ocelot.json")
                            .AddJsonFile($"configuration.{hostingContext.HostingEnvironment.EnvironmentName}.json")
                            .AddEnvironmentVariables();
                    }).ConfigureLogging((hostingContext, loggingbuilder) =>
                    {
                        loggingbuilder.AddConfiguration(hostingContext.Configuration.GetSection("Logging"));
                        loggingbuilder.AddConsole();
                        loggingbuilder.AddDebug();
                    }).UseSerilog((builderContext, config) =>
                    {
                        config
                            .MinimumLevel.Information()
                            .Enrich.FromLogContext()
                            .WriteTo.Console();
                    }).UseStartup<Startup>();
                });

    }
}
