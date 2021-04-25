using System.Collections.Generic;
using Zero.EventBus.Events;

namespace Order.Api.Application.IntegrationEvents.Events
{
    public record RemoveProductStockIntegrationEvent : IntegrationEvent
    {
        public List<OrderItemIntegrationEventModel> OrderItems { get; }

        public RemoveProductStockIntegrationEvent(List<OrderItemIntegrationEventModel> orderItems)
        {
            OrderItems = orderItems;
        }
    }

    public record OrderItemIntegrationEventModel(int ProductId, int Quantity);
}