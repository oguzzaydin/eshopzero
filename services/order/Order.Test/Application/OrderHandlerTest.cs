using Microsoft.Extensions.Logging;
using Moq;
using Order.Api.Application.Commands;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Order.Api.Application.IntegrationEvents.Events;
using Xunit;
using Zero.Core.Repositories;
using Zero.Core.Sessions;
using Zero.Core.UnitOfWork;
using Zero.EventBus.Abstractions;

namespace Order.Test.Application
{
    public class OrderHandlerTest
    {
        #region .setup

        private Mock<ILogger<OrderHandler>> _loggerMock;
        private Mock<ISession> _sessionMock;
        private Mock<IRepository<Api.Domain.Order>> _orderRepositoryMock;
        private Mock<IUnitOfWork> _uowMock;
        private Mock<IEventBus> _eventBusMock;
        private OrderHandler _orderHandler;

        public OrderHandlerTest()
        {
            _loggerMock = new Mock<ILogger<OrderHandler>>();
            _sessionMock = new Mock<ISession>();
            _orderRepositoryMock = new Mock<IRepository<Api.Domain.Order>>();
            _uowMock = new Mock<IUnitOfWork>();
            _eventBusMock = new Mock<IEventBus>();
            _orderHandler = new OrderHandler(_loggerMock.Object, _sessionMock.Object, _orderRepositoryMock.Object,
                _uowMock.Object, _eventBusMock.Object);
        }

        #endregion

        [Fact]
        public void create_order_successfully()
        {
            var orderItem = new OrderItemModel
            {
                ProductId = 1,
                Quantity = 10
            };

            List<OrderItemModel> orderItems = new()
            {
                orderItem
            };

            var createOrderCommand = new CreateOrderCommand {Items = orderItems};

            _sessionMock.Setup(session => session.Id).Returns(1);
            _orderRepositoryMock.Setup(orderRepository => orderRepository.InsertAsync(It.IsAny<Api.Domain.Order>())).Returns(Task.FromResult(new Api.Domain.Order(1)));
            _uowMock.Setup(uow => uow.SaveAsync(CancellationToken.None)).Returns(Task.FromResult(true));
            _eventBusMock.Setup(eventBus => eventBus.Publish(It.IsAny<RemoveProductStockIntegrationEvent>()));

            var result = _orderHandler.Handle(createOrderCommand, CancellationToken.None).Result;
            Assert.True(result);
            Assert.Equal(result, true);

            _sessionMock.Verify(session => session.Id, Times.Once);
            _orderRepositoryMock.Verify(x => x.InsertAsync(It.IsAny<Api.Domain.Order>()), Times.Once);
            _uowMock.Verify(uow => uow.SaveAsync(CancellationToken.None), Times.Once);
            _eventBusMock.Verify(eventBus => eventBus.Publish(It.IsAny<RemoveProductStockIntegrationEvent>()), Times.Once);
        }
    }
}