using Microsoft.Extensions.Logging;
using Moq;
using Order.Api.Application.IntegrationEvents.EventHandlers;
using Order.Api.Application.IntegrationEvents.Events;
using Order.Api.Domain;
using System;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using Zero.Core.Repositories;
using Zero.Core.UnitOfWork;

namespace Order.Test.Application
{
    public class RemoveProductStockErrorIntegrationEventHandlerTest
    {

        private Mock<IRepository<Api.Domain.Order>> _orderRepositoryMock;
        private Mock<IRepository<OrderItem>> _orderItemRepositoryMock;
        private Mock<ILogger<RemoveProductStockErrorIntegrationEventHandler>> _loggerMock;
        private Mock<IUnitOfWork> _uowMock;
        private RemoveProductStockErrorIntegrationEventHandler _errorIntegrationEventHandler;

        public RemoveProductStockErrorIntegrationEventHandlerTest()
        {
            _orderRepositoryMock = new Mock<IRepository<Api.Domain.Order>>();
            _orderItemRepositoryMock = new Mock<IRepository<OrderItem>>();
            _loggerMock = new Mock<ILogger<RemoveProductStockErrorIntegrationEventHandler>>();
            _uowMock = new Mock<IUnitOfWork>();

            _errorIntegrationEventHandler = new RemoveProductStockErrorIntegrationEventHandler(
                _orderRepositoryMock.Object, _orderItemRepositoryMock.Object, _loggerMock.Object, _uowMock.Object);
        }

        [Fact]
        public void remove_product_stock_successfully()
        {
            _orderItemRepositoryMock.Setup(repository =>
                repository.DeleteAsync(It.IsAny<Expression<Func<OrderItem, bool>>>()));

            _orderRepositoryMock.Setup(repository =>
                repository.DeleteAsync(It.IsAny<Expression<Func<Api.Domain.Order, bool>>>()));

            _uowMock.Setup(uow => uow.SaveAsync(CancellationToken.None)).Returns(Task.FromResult(true));

            var result = _errorIntegrationEventHandler.Handle(new RemoveProductStockErrorIntegrationEvent(1));

            Assert.Equal(result, Task.CompletedTask);

            _orderItemRepositoryMock.Verify(repository =>
                repository.DeleteAsync(It.IsAny<Expression<Func<OrderItem, bool>>>()),Times.Once);

            _orderRepositoryMock.Verify(repository =>
                repository.DeleteAsync(It.IsAny<Expression<Func<Api.Domain.Order, bool>>>()), Times.Once);

            _uowMock.Verify(uow => uow.SaveAsync(CancellationToken.None), Times.Once);
        }
    }
}