using Microsoft.Extensions.Logging;
using Order.Api.Application.IntegrationEvents.Events;
using Order.Api.Domain;
using System;
using System.Threading.Tasks;
using Zero.Core.Repositories;
using Zero.Core.UnitOfWork;
using Zero.EventBus.Abstractions;

namespace Order.Api.Application.IntegrationEvents.EventHandlers
{
    public class RemoveProductStockErrorIntegrationEventHandler : IIntegrationEventHandler<RemoveProductStockErrorIntegrationEvent>
    {
        #region .ctor

        private readonly IRepository<Domain.Order> _orderRepository;
        private readonly IRepository<OrderItem> _orderItemRepository;
        private readonly ILogger<RemoveProductStockErrorIntegrationEventHandler> _logger;
        private readonly IUnitOfWork _uow;

        public RemoveProductStockErrorIntegrationEventHandler(IRepository<Domain.Order> orderRepository, IRepository<OrderItem> orderItemRepository, ILogger<RemoveProductStockErrorIntegrationEventHandler> logger, IUnitOfWork uow)
        {
            _orderRepository = orderRepository ?? throw new ArgumentNullException(nameof(orderRepository));
            _orderItemRepository = orderItemRepository ?? throw new ArgumentNullException(nameof(orderItemRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _uow = uow ?? throw new ArgumentNullException(nameof(uow));
        }

        #endregion

        public async Task Handle(RemoveProductStockErrorIntegrationEvent @event)
        {
            _logger.LogInformation("----- Handling integration event: {IntegrationEventId} at {AppName} - ({@IntegrationEvent})", @event.Id, Program.AppName, @event);

            await _orderItemRepository.DeleteAsync(x => x.Order.Id == @event.OrderId);
            await _orderRepository.DeleteAsync(x => x.Id == @event.OrderId);
            await _uow.SaveAsync();
        }
    }
}