using Microsoft.EntityFrameworkCore;
using Order.Api.Domain;

namespace Order.Api.Infrastructure
{
    public class OrderDbContext : DbContext
    {
        #region .ctor
        public OrderDbContext(DbContextOptions<OrderDbContext> options) : base(options)
        {
        }

        #endregion

        public DbSet<Domain.Order> Order { get; set; }
        public DbSet<OrderItem> Type { get; set; }
    }
}