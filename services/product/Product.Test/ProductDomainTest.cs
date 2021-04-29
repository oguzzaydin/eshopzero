using Product.Api.Domain;
using Xunit;

namespace Product.Test
{
    public class ProductTest
    {
        [Fact]
        public void create_product_successfully()
        {
            var product = new Api.Domain.Product("laptop", "description", 100, "http://image.com", 1, 10);

            Assert.Equal(product.Name, "laptop");
            Assert.Equal(product.Description, "description");
            Assert.Equal(product.Price, 100);
            Assert.Equal(product.PictureUrl, "http://image.com");
            Assert.Equal(product.ProductTypeId, 1);
            Assert.Equal(product.AvailableStock, 10);
        }

        [Fact]
        public void remove_product_stock_successfully()
        {
            var product = new Api.Domain.Product("laptop", "description", 100, "http://image.com", 1, 10);
            product.RemoveStock(10);

            Assert.Equal(product.AvailableStock, 0);
        }

        [Fact]
        public void create_product_type_successfully()
        {
            var productType = new ProductType("type");
            Assert.Equal(productType.Name, "type");
        }
    }
}