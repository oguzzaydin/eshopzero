﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Zero.Core.Extensions;
using Zero.Core.Repositories;

namespace Product.Api.Application.Queries
{
    public class ProductQuery : IProductQuery
    {
        private readonly IRepository<Domain.Product> _productRepository;
        private readonly IDistributedCache _cache;

        public ProductQuery(IRepository<Domain.Product> productRepository, IDistributedCache cache)
        {
            _productRepository = productRepository ?? throw new ArgumentNullException(nameof(productRepository));
            _cache = cache ?? throw new ArgumentNullException(nameof(cache)); 
        }

        public async Task<ProductModel> GetProductAsync(int id)
        {
            var product =  await _productRepository.Queryable(x => x.Id == id)
                .Include(x => x.ProductType)
                .FirstOrDefaultAsync();

            return MapToProductModel(product);
        }

        public async Task<IEnumerable<ProductModel>> GetProductsAsync()
        {
            return await _cache.GetAsync(ProductCacheKey.Product, async () =>
            {
                var products = await _productRepository.Queryable().Include(x => x.ProductType).OrderByDescending(x => x.Id).ToListAsync();
                return products.Select(MapToProductModel);
            });

        }

        private ProductModel MapToProductModel(Domain.Product product)
        {
            return new()
            {
                Id = product.Id,
                Name = product.Name,
                ProductType = new ProductTypeModel
                {
                    Id = product.ProductTypeId,
                    Name = product.ProductType.Name,
                },
                AvailableStock = product.AvailableStock,
                Description = product.Description,
                PictureUrl = product.PictureUrl,
                Price = product.Price
            };
        }
    }
}