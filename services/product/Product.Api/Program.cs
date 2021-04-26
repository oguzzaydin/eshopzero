using System;
using System.IO;
using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Product.Api;
using Product.Api.Infrastructure;
using Product.Api.Infrastructure.Seed;
using Product.Api.Web.Extensions;
using Serilog;

var configuration = GetConfiguration();

Log.Logger = CreateSerilogLogger();

try
{
    Log.Information("Configuring web host ({ApplicationContext})...", Program.AppName);

    var host = CreateHostBuilder(args);

    Log.Information("Applying migrations ({ApplicationContext})...", Program.AppName);
    host.MigrateDbContext<ProductDbContext>((context, services) =>
    {
        new ProductDbContextSeed()
            .SeedAsync(context, configuration)
            .Wait();
    });

    Log.Information("Starting web host ({ApplicationContext})...", Program.AppName);

    host.Run();

    return 0;
}
catch (Exception ex)
{
    Log.Fatal(ex, "Program terminated unexpectedly ({ApplicationContext})!", Program.AppName);
    return 1;
}
finally
{
    Log.CloseAndFlush();
}

IWebHost CreateHostBuilder(string[] args) =>
    WebHost.CreateDefaultBuilder(args)
        .UseConfiguration(configuration)
        .CaptureStartupErrors(false)
        .ConfigureAppConfiguration(x => x.AddConfiguration(configuration))
        .ConfigureLogging(logging =>
        {
            logging.AddJsonConsole(options =>
            {
                options.JsonWriterOptions = new JsonWriterOptions { Indented = true };
            });
        })
        .ConfigureKestrel(options =>
        {
            var httpPort = GetDefinedPort(configuration);
            options.Listen(IPAddress.Any, httpPort, listenOptions =>
            {
                listenOptions.Protocols = HttpProtocols.Http1AndHttp2;
            });
        })
        .UseContentRoot(Directory.GetCurrentDirectory())
        .UseStartup<Startup>()
        .UseSerilog()
        .Build();

Serilog.ILogger CreateSerilogLogger()
{
    var seqServerUrl = configuration["Serilog:SeqServerUrl"];
    return new LoggerConfiguration()
        .MinimumLevel.Verbose()
        .Enrich.WithProperty("ApplicationContext", Program.AppName)
        .Enrich.FromLogContext()
        .WriteTo.Console()
        .WriteTo.Http(seqServerUrl)
        .WriteTo.Seq(seqServerUrl)
        .ReadFrom.Configuration(configuration)
        .CreateLogger();
}

IConfiguration GetConfiguration()
{
    var builder = new ConfigurationBuilder()
        .SetBasePath(Directory.GetCurrentDirectory())
        .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
        .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")}.json", optional: true)
        .AddEnvironmentVariables();

    return builder.Build();
}

int GetDefinedPort(IConfiguration config)
{
    var port = config.GetValue("PORT", 80);
    return port;
}

namespace Product.Api
{
    public static class Program
    {
        public static readonly string Namespace = typeof(Startup).Namespace;
        public static readonly string AppName = Namespace.Substring(Namespace.LastIndexOf('.', Namespace.LastIndexOf('.') - 1) + 1);
    }
}