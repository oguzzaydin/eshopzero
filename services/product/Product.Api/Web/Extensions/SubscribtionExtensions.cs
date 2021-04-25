using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Product.Api.Application.IntegrationEvents.EventHandlers;
using Product.Api.Application.IntegrationEvents.Events;
using Zero.EventBus.Abstractions;

namespace Product.Api.Web.Extensions
{
    public static class SubscribtionExtensions
    {
        public static void UseSubscribes(this IApplicationBuilder builder)
        {
            var bus = builder.ApplicationServices.GetService<IEventBus>();

            bus.Subscribe<RemoveProductStockIntegrationEvent, RemoveProductStockIntegrationEventHandler>();
        }
    }
}
