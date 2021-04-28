using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Product.Api.Application.Hubs;
using Product.Api.Application.IntegrationEvents.Events;
using Product.Api.Domain.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;
using Product.Api.Application.Queries;
using Zero.Core.Extensions;
using Zero.Core.Repositories;
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
        private readonly IDistributedCache _cache;

        public RemoveProductStockIntegrationEventHandler(ILogger<RemoveProductStockIntegrationEventHandler> logger, IHubContext<ProductHub, IProductHub> productHub, IRepository<Domain.Product> productRepository, IUnitOfWork uow, IDistributedCache cache)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _productHub = productHub ?? throw new ArgumentNullException(nameof(productHub));
            _productRepository = productRepository ?? throw new ArgumentNullException(nameof(productRepository));
            _uow = uow ?? throw new ArgumentNullException(nameof(uow));
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
        }

        #endregion

        public async Task Handle(RemoveProductStockIntegrationEvent @event)
        {
            _logger.LogInformation("----- Handling integration event: {IntegrationEventId} at {AppName} - ({@IntegrationEvent})", @event.Id, Program.AppName, @event);

            var products = await _cache.GetAsync<List<ProductModel>>(ProductCacheKey.Product);

            try
            {
                foreach (var item in @event.OrderItems)
                {
                    var product = await _productRepository.GetAsync(item.ProductId) ?? throw new ProductDomainException("product was not found");
                    product.RemoveStock(item.Quantity);
                    await _productRepository.UpdateAsync(product);
                    var cacheProduct = products.FirstOrDefault(p => p.Id == product.Id);
                    if (cacheProduct is not null) cacheProduct.AvailableStock = product.AvailableStock;
                }

                await _uow.SaveAsync();
                await _cache.UpdateAsync(ProductCacheKey.Product, products);
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