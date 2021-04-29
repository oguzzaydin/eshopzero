using System.Linq;
using Moq;
using Xunit;

namespace Order.Test.Domain
{
    public class OrderDomainTest
    {
        [Fact]
        public void create_order_successfully()
        {
            var order = new Api.Domain.Order(1);

            Assert.Equal(order.UserId, 1);
        }

        [Fact]
        public void add_order_item_successfully()
        {
            var order = new Api.Domain.Order(1);

            order.AddOrderItem(1, 1);

            Assert.Equal(order.Items.First().ProductId, 1);
            Assert.Equal(order.Items.First().Quantity, 1);
        }
    }
}