using Zero.EventBus.Events;

namespace Order.Api.Application.IntegrationEvents.Events
{
    public record RemoveProductStockErrorIntegrationEvent : IntegrationEvent
    {
        public int OrderId { get; }

        public RemoveProductStockErrorIntegrationEvent(int orderId)
        {
            OrderId = orderId;
        }
    }
}