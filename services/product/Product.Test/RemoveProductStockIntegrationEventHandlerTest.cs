using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Moq;
using Product.Api.Application.Hubs;
using Product.Api.Application.IntegrationEvents.EventHandlers;
using Product.Api.Application.IntegrationEvents.Events;
using Product.Api.Application.Queries;
using Xunit;
using Zero.Core.Extensions;
using Zero.Core.Repositories;
using Zero.Core.UnitOfWork;
using Zero.EventBus.Abstractions;

namespace Product.Test
{
    public class RemoveProductStockIntegrationEventHandlerTest
    {
        #region .setup

        private Mock<ILogger<RemoveProductStockIntegrationEventHandler>> _loggerMock;
        private Mock<IHubContext<ProductHub, IProductHub>> _productHubMock;
        private Mock<IRepository<Api.Domain.Product>> _productRepositoryMock;
        private Mock<IUnitOfWork> _uowMock;
        private Mock<IDistributedCache> _cacheMock;
        private Mock<IEventBus> _busMock;
        private RemoveProductStockIntegrationEventHandler _removeProductStockIntegrationEventHandler;

        public RemoveProductStockIntegrationEventHandlerTest()
        {
            _loggerMock = new Mock<ILogger<RemoveProductStockIntegrationEventHandler>>();
            _productRepositoryMock = new Mock<IRepository<Api.Domain.Product>>();
            _productRepositoryMock = new Mock<IRepository<Api.Domain.Product>>();
            _uowMock = new Mock<IUnitOfWork>();
            _cacheMock = new Mock<IDistributedCache>();
            _busMock = new Mock<IEventBus>();

            _removeProductStockIntegrationEventHandler = new RemoveProductStockIntegrationEventHandler(
                _loggerMock.Object, _productHubMock.Object, _productRepositoryMock.Object, _uowMock.Object,
                _cacheMock.Object, _busMock.Object);
        }

        #endregion

        [Fact]
        public void remove_product_stock_integration_event_handler_successfully()
        {
            var products = new List<ProductModel>
            {
                new()
                {
                    AvailableStock = 10,
                    Description = "test",
                    Id = 1,
                    Name = "test",
                    PictureUrl = "test",
                    Price = 1
                }
            };

            Api.Domain.Product product = new("laptop", "description", 100, "http://image.com", 1, 10);

            var orderItems = new List<OrderItemIntegrationEventModel>
            {
                new(1, 1)
            };

            _cacheMock.Setup(cache => cache.GetAsync<List<ProductModel>>(It.IsAny<string>()))
                .Returns(Task.FromResult(products));
            _productRepositoryMock.Setup(repository => repository.GetAsync(It.IsAny<int>()))
                .Returns(Task.FromResult(product));
            _productRepositoryMock.Setup(repository => repository.UpdateAsync(It.IsAny<Api.Domain.Product>()))
                .Returns(Task.FromResult(product));
            _uowMock.Setup(uow => uow.SaveAsync(CancellationToken.None)).Returns(Task.FromResult(true));

            _cacheMock.Setup(cache => cache.UpdateAsync(It.IsAny<string>(), It.IsAny<ProductModel>()));

            var result = _removeProductStockIntegrationEventHandler.Handle(new RemoveProductStockIntegrationEvent(orderItems, 1, 1));
            Assert.Equal(result, Task.CompletedTask);

            _cacheMock.Verify(cache => cache.GetAsync<List<ProductModel>>(It.IsAny<string>()), Times.Once);
            _productRepositoryMock.Verify(repository => repository.GetAsync(It.IsAny<int>()), Times.Once);
            _productRepositoryMock.Verify(repository => repository.UpdateAsync(It.IsAny<Api.Domain.Product>()), Times.Once);
            _uowMock.Verify(uow => uow.SaveAsync(CancellationToken.None), Times.Once);
            _cacheMock.Verify(cache => cache.UpdateAsync(It.IsAny<string>(), It.IsAny<ProductModel>()), Times.Once);

        }

    }
}