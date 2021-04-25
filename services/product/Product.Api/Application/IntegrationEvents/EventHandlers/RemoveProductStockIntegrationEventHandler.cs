using Microsoft.Extensions.Logging;
using Product.Api.Application.IntegrationEvents.Events;
using System;
using System.Linq;
using System.Threading.Tasks;
using Product.Api.Domain.Exceptions;
using Zero.Core.Repositories;
using Zero.Core.UnitOfWork;
using Zero.EventBus.Abstractions;

namespace Product.Api.Application.IntegrationEvents.EventHandlers
{
    public class RemoveProductStockIntegrationEventHandler : IIntegrationEventHandler<RemoveProductStockIntegrationEvent>
    {
        #region .ctor

        private readonly ILogger<RemoveProductStockIntegrationEventHandler> _logger;
        private readonly IRepository<Domain.Product> _productRepository;
        private readonly IUnitOfWork _uow;

        public RemoveProductStockIntegrationEventHandler(ILogger<RemoveProductStockIntegrationEventHandler> logger, IRepository<Domain.Product> productRepository, IUnitOfWork uow)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _productRepository = productRepository ?? throw new ArgumentNullException(nameof(productRepository));
            _uow = uow ?? throw new ArgumentNullException(nameof(uow)); ;
        }

        #endregion

        public async Task Handle(RemoveProductStockIntegrationEvent @event)
        {
            _logger.LogInformation("----- Handling integration event: {IntegrationEventId} - ({@IntegrationEvent})", @event.Id, @event);

            foreach (var item in @event.OrderItems)
            {
                var product = await _productRepository.GetAsync(item.ProductId) ?? throw  new ProductDomainException("product was not found");
                product.RemoveStock(item.Quantity);
                await _productRepository.UpdateAsync(product);
            }

            await _uow.SaveAsync();
        }
    }
}