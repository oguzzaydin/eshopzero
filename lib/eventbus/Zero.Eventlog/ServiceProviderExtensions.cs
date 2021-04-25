using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Zero.EventBus.Abstractions;

namespace Zero.Eventlog
{
    public static class EventLogExtensions
    {
        public static void AddEventLog(this IServiceCollection services, IConfiguration configuration, string assembly)
        {
            services.AddDbContext<EventLogContext, EventLogContext>(options =>
            {
                options.UseNpgsql(configuration["ConnectionString"], b =>
                    {
                        b.MigrationsAssembly(assembly);
                        b.EnableRetryOnFailure(maxRetryCount: 15, maxRetryDelay: TimeSpan.FromSeconds(30), null);
                    })
                    .UseLowerCaseNamingConvention()
                    .LogTo(Console.WriteLine, new[] { DbLoggerCategory.Database.Command.Name }, LogLevel.Information,
                        DbContextLoggerOptions.SingleLine | DbContextLoggerOptions.UtcTime);
            }, ServiceLifetime.Transient);
            services.AddTransient<IEventLogService, EventLogService>();
        }

        public static void UseEventLog(this IApplicationBuilder app)
        {
            var logService = app.ApplicationServices.GetRequiredService<IEventLogService>();
            var bus = app.ApplicationServices.GetRequiredService<IEventBus>();

            bus.Started += (sender, e) =>
            {
                logService.CreateEventLogAsync(e);
            };
            bus.Published += (sender, e) =>
            {
                logService.MarkEventAsPublishedAsync(e.Id);
            };
        }
    }
}