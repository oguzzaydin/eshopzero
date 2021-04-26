using System.Collections.Generic;
using Zero.EventBus.Events;

namespace Order.Api.Application.IntegrationEvents.Events
{
    public record RemoveProductStockIntegrationEvent : IntegrationEvent
    {
        public int UserId { get; }
        public List<OrderItemIntegrationEventModel> OrderItems { get; }

        public RemoveProductStockIntegrationEvent(List<OrderItemIntegrationEventModel> orderItems, int userId)
        {
            OrderItems = orderItems;
            UserId = userId;
        }
    }

    public record OrderItemIntegrationEventModel(int ProductId, int Quantity);
}