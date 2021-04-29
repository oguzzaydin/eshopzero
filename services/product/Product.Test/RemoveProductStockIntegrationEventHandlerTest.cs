using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Moq;
using Product.Api.Application.Hubs;
using Product.Api.Application.IntegrationEvents.EventHandlers;
using Product.Api.Application.IntegrationEvents.Events;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
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
            _productHubMock = new Mock<IHubContext<ProductHub, IProductHub>>();
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
            Api.Domain.Product product = new("laptop", "description", 100, "http://image.com", 1, 10);

            var orderItems = new List<OrderItemIntegrationEventModel>
            {
                new(1, 1)
            };

            _productRepositoryMock.Setup(repository => repository.GetAsync(It.IsAny<int>()))
                .Returns(Task.FromResult(product));
            _productRepositoryMock.Setup(repository => repository.UpdateAsync(It.IsAny<Api.Domain.Product>()))
                .Returns(Task.FromResult(product));
            _uowMock.Setup(uow => uow.SaveAsync(CancellationToken.None)).Returns(Task.FromResult(true));


            var _ = _removeProductStockIntegrationEventHandler.Handle(new RemoveProductStockIntegrationEvent(orderItems, 1, 1));

            _productRepositoryMock.Verify(repository => repository.GetAsync(It.IsAny<int>()), Times.Once);
            _productRepositoryMock.Verify(repository => repository.UpdateAsync(It.IsAny<Api.Domain.Product>()), Times.Once);
        }

    }
}