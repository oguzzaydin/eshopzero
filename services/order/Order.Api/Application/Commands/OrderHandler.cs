using MediatR;
using Microsoft.Extensions.Logging;
using Order.Api.Application.IntegrationEvents.Events;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Zero.Core.Repositories;
using Zero.Core.Sessions;
using Zero.Core.UnitOfWork;
using Zero.EventBus.Abstractions;

namespace Order.Api.Application.Commands
{
    public class OrderHandler : IRequestHandler<CreateOrderCommand, bool>
    {
        #region .ctor

        private readonly ILogger<OrderHandler> _logger;
        private readonly ISession _session;
        private readonly IRepository<Domain.Order> _orderRepository;
        private readonly IUnitOfWork _uow;
        private readonly IEventBus _eventBus;

        public OrderHandler(ILogger<OrderHandler> logger, ISession session, IRepository<Domain.Order> orderRepository, IUnitOfWork uow, IEventBus eventBus)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _session = session ?? throw new ArgumentNullException(nameof(session));
            _orderRepository = orderRepository ?? throw new ArgumentNullException(nameof(orderRepository));
            _uow = uow ?? throw new ArgumentNullException(nameof(uow));
            _eventBus = eventBus ?? throw new ArgumentNullException(nameof(eventBus)); ;
        }

        #endregion

        public async Task<bool> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
        {
            var order = new Domain.Order(_session.Id);

            request.Items?.ForEach(item =>
            {
                order.AddOrderItem(item.ProductId, item.Quantity);
            });

            _logger.LogInformation("----- Creating Order - Order: {@Order}", order);

            await _orderRepository.InsertAsync(order);

            var items = order.Items.Select(x => new OrderItemIntegrationEventModel(x.ProductId, x.Quantity)).ToList();
            var removeProductStockEvent = new RemoveProductStockIntegrationEvent(items, order.UserId);
            _eventBus.Publish(removeProductStockEvent);

            return await _uow.SaveAsync(cancellationToken);
        }
    }
}