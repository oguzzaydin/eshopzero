using System.Collections.Generic;
using MediatR;

namespace Order.Api.Application.Commands
{
    public class CreateOrderCommand : IRequest<bool>
    {
        public List<OrderItemModel> Items { get; set; }
    }

    public class OrderItemModel
    {
        public int ProductId { get;  set; }
        public int Quantity { get;  set; }
    }
}