using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Product.Api.Application.Hubs;
using Product.Api.Application.IntegrationEvents.Events;
using Product.Api.Domain.Exceptions;
using System;
using System.Threading.Tasks;
using Zero.Core.Repositories;
using Zero.Core.Sessions;
using Zero.Core.UnitOfWork;
using Zero.EventBus.Abstractions;

namespace Product.Api.Application.IntegrationEvents.EventHandlers
{
    public class RemoveProductStockIntegrationEventHandler : IIntegrationEventHandler<RemoveProductStockIntegrationEvent>
    {
        #region .ctor

        private readonly ILogger<RemoveProductStockIntegrationEventHandler> _logger;
        private readonly IHubContext<ProductHub, IProductHub> _productHub;
        private readonly IRepository<Domain.Product> _productRepository;
        private readonly IUnitOfWork _uow;

        public RemoveProductStockIntegrationEventHandler(ILogger<RemoveProductStockIntegrationEventHandler> logger, ISession session, IHubContext<ProductHub, IProductHub> productHub, IRepository<Domain.Product> productRepository, IUnitOfWork uow)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _productHub = productHub ?? throw new ArgumentNullException(nameof(productHub));
            _productRepository = productRepository ?? throw new ArgumentNullException(nameof(productRepository));
            _uow = uow ?? throw new ArgumentNullException(nameof(uow)); ;
        }

        #endregion

        public async Task Handle(RemoveProductStockIntegrationEvent @event)
        {
            _logger.LogInformation("----- Handling integration event: {IntegrationEventId} at {AppName} - ({@IntegrationEvent})", @event.Id, Program.AppName, @event);

            try
            {
                foreach (var item in @event.OrderItems)
                {
                    var product = await _productRepository.GetAsync(item.ProductId) ?? throw new ProductDomainException("product was not found");
                    product.RemoveStock(item.Quantity);
                    await _productRepository.UpdateAsync(product);
                }

                await _uow.SaveAsync();

                await _productHub.Clients.Group(@event.UserId.ToString()).ProductStockChanged(@event.OrderItems);
            }
            catch (Exception ex)
            {
                _logger.LogError("----- Error occured integration event: {IntegrationEventId} at {AppName} - ({@IntegrationEvent})", @event.Id, Program.AppName, @event);
                await _productHub.Clients.Group(@event.UserId.ToString()).ProductStockChangedError(ex.Message);
            }

        }
    }
}