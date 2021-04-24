using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Zero.EventBus.Abstractions;

namespace Zero.Eventlog
{
    public static class EventLogExtensions
    {
        public static void AddEventLog(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<EventLogContext, EventLogContext>(options =>
            {
                //options.UseMySql(configuration.GetSection("ConnectionStrings")["Default"],
                //    b =>
                //    {
                //        //b.MigrationsAssembly("Broker.Infrastructure");
                //        //b.EnableRetryOnFailure(maxRetryCount: 15, maxRetryDelay: TimeSpan.FromSeconds(30), errorNumbersToAdd: null);
                //    });
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