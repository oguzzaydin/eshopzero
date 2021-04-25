using Microsoft.EntityFrameworkCore;
using Product.Api.Domain;

namespace Product.Api.Infrastructure
{
    public class ProductDbContext : DbContext
    {
        #region .ctor

        public ProductDbContext(DbContextOptions<ProductDbContext> options) : base(options)
        {
        }

        #endregion

        public DbSet<Domain.Product> Product { get; set; }
        public DbSet<ProductType> ProductType { get; set; }
    }
}