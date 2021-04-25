using System;
using Zero.Core.Audition;

namespace Order.Api.Domain
{
    public class OrderItem : CreationAuditedEntityBase<int>
    {
        public int ProductId { get; protected set; }
        public int Quantity { get; protected set; }
        public Order Order { get; protected set; }

        protected OrderItem()
        {
        }

        public OrderItem(int productId, int quantity)
        {
            ProductId = productId;
            Quantity = quantity;
        }
    }
}