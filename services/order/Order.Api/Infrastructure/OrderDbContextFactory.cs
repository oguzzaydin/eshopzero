using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Order.Api.Infrastructure
{
    public class OrderDbContextFactory : IDesignTimeDbContextFactory<OrderDbContext>
    {
        public OrderDbContext CreateDbContext(string[] args)
        {
            var config = new ConfigurationBuilder()
                .SetBasePath(Path.Combine(Directory.GetCurrentDirectory()))
                .AddJsonFile("appsettings.json")
                .AddEnvironmentVariables()
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<OrderDbContext>();

            optionsBuilder.UseNpgsql(config["ConnectionString"], npgsqlOptionsAction: o =>
            {
                o.MigrationsAssembly("Order.Api");
            }).UseLowerCaseNamingConvention();

            return new OrderDbContext(optionsBuilder.Options);
        }
    }
}