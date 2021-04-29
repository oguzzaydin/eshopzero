using Order.Api.Domain;
using Xunit;

namespace Order.Test.Domain
{
    public class OrderITemTest
    {
        [Fact]
        public void create_order_item_successfully()
        {
            var orderItem = new OrderItem(1, 1);

            Assert.Equal(orderItem.ProductId, 1);
            Assert.Equal(orderItem.Quantity, 1);
        }
    }
}