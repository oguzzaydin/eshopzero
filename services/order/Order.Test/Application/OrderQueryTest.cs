using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Castle.DynamicProxy.Generators.Emitters.SimpleAST;
using Moq;
using Order.Api.Application.Queries;
using Xunit;
using Zero.Core.Repositories;
using Zero.Core.Sessions;

namespace Order.Test.Application
{
    public class OrderQueryTest
    {
        #region .setup

        private Mock<IRepository<Api.Domain.Order>> _orderRepositoryMock;
        private Mock<ISession> _sessionMock;
        private OrderQuery orderQuery;

        public OrderQueryTest()
        {
            _orderRepositoryMock = new Mock<IRepository<Api.Domain.Order>>();
            _sessionMock = new Mock<ISession>();

            orderQuery = new OrderQuery(_orderRepositoryMock.Object, _sessionMock.Object);
        }

        #endregion

        [Fact]
        public void get_orders_successfully()
        {
            var orders = new List<Api.Domain.Order>
            {
                new(1),
                new(2),
            };

            _sessionMock.Setup(session => session.Id).Returns(1);
            _orderRepositoryMock
                .Setup(repository => repository.Queryable(It.IsAny<Expression<Func<Api.Domain.Order, bool>>>()))
                .Returns(orders.AsQueryable());

            var _ = orderQuery.GetOrdersAsync().Result;

            _orderRepositoryMock
                .Verify(repository => repository.Queryable(It.IsAny<Expression<Func<Api.Domain.Order, bool>>>()), Times.Once);
            _sessionMock.Verify(session => session.Id, Times.Once);

        }

    }
}