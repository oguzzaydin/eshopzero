using Order.Api.Domain.Events;
using System.Collections.Generic;
using System.Linq;
using Zero.Core.Audition;
using Zero.Core.Domain;

namespace Order.Api.Domain
{
    public class Order : CreationAuditedEntityBase<int>, IAggregateRoot
    {
        public int UserId { get; protected set; }

        public List<OrderItem> Items { get; protected set; } = new();

        protected Order()
        {

        }

        public Order(int userId)
        {
            UserId = userId;
            AddEvent(new CreateOrderDomainEvent(this));
        }

        public void AddOrderItem(int productId, int quantity)
        {
            var existingOrderForProduct = Items.Any(o => o.ProductId == productId);
            
            if (existingOrderForProduct) return;
            
            var orderItem = new OrderItem(productId, quantity);
            Items.Add(orderItem);
        }
    }
}