using System.Collections.Generic;
using Zero.EventBus.Events;

namespace Product.Api.Application.IntegrationEvents.Events
{
    public record RemoveProductStockIntegrationEvent : IntegrationEvent
    {
        public int UserId { get; }
        public int OrderId { get; }
        public List<OrderItemIntegrationEventModel> OrderItems { get; }

        public RemoveProductStockIntegrationEvent(List<OrderItemIntegrationEventModel> orderItems, int userId, int orderId)
        {
            OrderItems = orderItems;
            UserId = userId;
            OrderId = orderId;
        }
    }

    public record OrderItemIntegrationEventModel(int ProductId, int Quantity);
}