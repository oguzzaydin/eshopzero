using System.Collections.Generic;
using Zero.Core.Audition;
using Zero.Core.Domain;

namespace Order.Api.Domain
{
    public class Order : CreationAuditedEntityBase<int>, IAggregateRoot
    {
        public int UserId { get; protected set; }

        public List<OrderItem> Items { get; protected set; }

        protected Order()
        {
            
        }

        public Order(int userId)
        {
            UserId = userId;
        }
    }
}