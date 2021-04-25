using Microsoft.Extensions.Configuration;
using System.Linq;
using System.Threading.Tasks;

namespace Product.Api.Infrastructure.Seed
{
    public class ProductDbContextSeed
    {
        public async Task SeedAsync(ProductDbContext context, IConfiguration configuration)
        {
            if (!context.ProductType.Any())
            {
                foreach (var type in Config.ProductTypes)
                {
                    await context.ProductType.AddAsync(type);
                }
                await context.SaveChangesAsync();
            }

            if (!context.Product.Any())
            {
                foreach (var product in Config.Products)
                {
                    await context.Product.AddAsync(product);
                }
                await context.SaveChangesAsync();
            }
            
        }
    }
}