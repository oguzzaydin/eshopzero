using MediatR;

namespace Order.Api.Domain.Events
{
    public class CreateOrderDomainEvent : INotification
    {
        public Order Order { get; }

        public CreateOrderDomainEvent(Order order)
        {
            Order = order;
        }
    }
}