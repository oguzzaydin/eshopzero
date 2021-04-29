using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;
using Moq;
using Product.Api.Application.Queries;
using Xunit;
using Xunit.Abstractions;
using Zero.Core.Extensions;
using Zero.Core.Repositories;

namespace Product.Test
{
    public class ProductQueryTest
    {
        #region .setup

        private Mock<IRepository<Api.Domain.Product>> _productRepositoryMock;
        private Mock<IDistributedCache> _cacheMock;
        private ProductQuery _productQuery;

        public ProductQueryTest()
        {
            _productRepositoryMock = new Mock<IRepository<Api.Domain.Product>>();
            _cacheMock = new Mock<IDistributedCache>();
            _productQuery = new ProductQuery(_productRepositoryMock.Object, _cacheMock.Object);
        }

        #endregion

        [Fact]
        public void get_product_successfully()
        {
            var products = new List<Api.Domain.Product>
            {
                new ("laptop", "description", 100, "http://image.com", 1, 10)
            };
            _productRepositoryMock.Setup(repository =>
                repository.Queryable(It.IsAny<Expression<Func<Api.Domain.Product, bool>>>()))
                .Returns(products.AsQueryable());

            var _ = _productQuery.GetProductAsync(1);

            _productRepositoryMock.Verify(repository =>
                repository.Queryable(It.IsAny<Expression<Func<Api.Domain.Product, bool>>>()), Times.Once);
        }

        [Fact]
        public void get_products_successfully()
        {
            var products = new List<Api.Domain.Product>
            {
                new ("laptop", "description", 100, "http://image.com", 1, 10)
            };

            _productRepositoryMock.Setup(repository => repository.Queryable())
                .Returns(products.AsQueryable());

            var _ = _productQuery.GetProductsAsync();

            _productRepositoryMock.Verify(repository => repository.Queryable(), Times.Once);

        }
    }
}