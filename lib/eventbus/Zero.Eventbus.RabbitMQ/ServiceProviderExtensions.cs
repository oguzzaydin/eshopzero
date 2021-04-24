using Autofac;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using Zero.EventBus;
using Zero.EventBus.Abstractions;

namespace Zero.Eventbus.RabbitMQ
{
    public static class EventBusExtensions
    {
        public static void AddEventBus(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSingleton<IRabbitMqPersistentConnection>(sp =>
            {
                configuration = sp.GetRequiredService<IConfiguration>();
                var logger = sp.GetRequiredService<ILogger<DefaultRabbitMqPersistentConnection>>();


                var factory = new ConnectionFactory
                {
                    HostName = configuration["EventBus:Connection"],
                    DispatchConsumersAsync = true
                };

                if (!string.IsNullOrEmpty(configuration["EventBus:Username"]))
                    factory.UserName = configuration["EventBus:Username"];

                if (!string.IsNullOrEmpty(configuration["EventBus:Password"]))
                    factory.Password = configuration["EventBus:Password"];

                var retryCount = 5;
                if (!string.IsNullOrEmpty(configuration["EventBus:RetryCount"]))
                    retryCount = int.Parse(configuration["EventBus:RetryCount"]);

                return new DefaultRabbitMqPersistentConnection(factory, logger, retryCount);
            });
            services.AddSingleton<IEventBusSubscriptionsManager, InMemoryEventBusSubscriptionsManager>();
            services.AddSingleton<IEventBus, RabbitMqEventBus>(sp =>
            {
                var subscriptionClientName = configuration["EventBus:ClientName"];
                var rabbitMqPersistentConnection = sp.GetRequiredService<IRabbitMqPersistentConnection>();
                var iLifetimeScope = sp.GetRequiredService<ILifetimeScope>();
                var logger = sp.GetRequiredService<ILogger<RabbitMqEventBus>>();
                var eventBusSubcriptionsManager = sp.GetRequiredService<IEventBusSubscriptionsManager>();

                var retryCount = 5;
                if (!string.IsNullOrEmpty(configuration["RetryCount"]))
                    retryCount = int.Parse(configuration["RetryCount"]);

                return new RabbitMqEventBus(rabbitMqPersistentConnection, logger, iLifetimeScope, eventBusSubcriptionsManager, subscriptionClientName, retryCount);
            });
        }
    }
}