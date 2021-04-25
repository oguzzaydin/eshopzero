using Identity.Api;
using Identity.Api.Data;
using Identity.Api.Data.Seed;
using Identity.Api.Extensions;
using IdentityServer4.EntityFramework.DbContexts;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Serilog;
using System;
using System.IO;

var configuration = GetConfiguration();

Log.Logger = CreateSerilogLogger();

try
{
    Log.Information("Configuring web host ({ApplicationContext})...", Program.AppName);
    var host = BuildWebHost(configuration, args);

    Log.Information("Applying migrations ({ApplicationContext})...", Program.AppName);
    host.MigrateDbContext<PersistedGrantDbContext>((_, __) => { })
        .MigrateDbContext<ApplicationDbContext>((context, services) =>
        {
            var env = services.GetService<IHostEnvironment>();
            var logger = services.GetService<ILogger<ApplicationDbContextSeed>>();
            var settings = services.GetService<IOptions<AppSettings>>();

            new ApplicationDbContextSeed()
                .SeedAsync(context, env, logger, settings)
                .Wait();
        })
        .MigrateDbContext<ConfigurationDbContext>((context, services) =>
        {
            new ConfigurationDbContextSeed()
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

IHost BuildWebHost(IConfiguration configuration, string[] args) =>
   Host.CreateDefaultBuilder(args)
       .ConfigureWebHostDefaults(webBuilder =>
       {
           webBuilder.UseStartup<Startup>();
           webBuilder.ConfigureAppConfiguration(x => x.AddConfiguration(configuration));
           webBuilder.UseSerilog();
           webBuilder.CaptureStartupErrors(false);
           webBuilder.UseContentRoot(Directory.GetCurrentDirectory());
       }).Build();

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
        .AddEnvironmentVariables();

    return builder.Build();
}

public static class Program
{
    public static readonly string Namespace = typeof(Startup).Namespace;
    public static readonly string AppName = Namespace.Substring(Namespace.LastIndexOf('.', Namespace.LastIndexOf('.') - 1) + 1);
}