using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Order.Api.Application.Commands;
using Zero.Core.Repositories;
using Zero.Core.Sessions;

namespace Order.Api.Application.Queries
{
    public class OrderQuery : IOrderQuery
    {
        private readonly IRepository<Domain.Order> _orderRepository;
        private readonly ISession _session;

        public OrderQuery(IRepository<Domain.Order> orderRepository, ISession session)
        {
            _orderRepository = orderRepository ?? throw new ArgumentNullException(nameof(orderRepository));
            _session = session ?? throw new ArgumentNullException(nameof(session));
        }

        public async Task<IEnumerable<OrderModel>> GetOrdersAsync() =>
            await _orderRepository.Queryable(x => x.UserId == _session.Id).Include(x => x.Items)
                .Select(order => new OrderModel
                {
                    Id = order.Id,
                    MailAddress = _session.MailAddress,
                    OrderItems = order.Items.Select(item => new OrderItemModel
                    {
                        ProductId = item.ProductId,
                        Quantity = item.Quantity
                    }).ToList()
                }).ToListAsync();
    }
}