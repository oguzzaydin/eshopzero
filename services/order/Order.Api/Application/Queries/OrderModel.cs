using System.Collections.Generic;
using Order.Api.Application.Commands;

namespace Order.Api.Application.Queries
{
    public record OrderModel
    {
        public int Id { get; set; }
        public string MailAddress { get; set; }
        public List<OrderItemModel> OrderItems { get; set; }
    }
}