using System.Collections;
using System.Collections.Generic;
using Product.Api.Domain;

namespace Product.Api.Infrastructure.Seed
{
    public static class Config
    {
        public static IEnumerable<ProductType> ProductTypes =>
            new ProductType[]
            {

            };

        public static IEnumerable<Domain.Product> Products =>
            new Domain.Product[]
            {

            };
    }
}