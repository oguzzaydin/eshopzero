using System.Collections.Generic;
using System.Threading.Tasks;

namespace Product.Api.Application.Queries
{
    public interface IProductQuery
    {
        Task<ProductModel> GetProductAsync(int id);
        Task<IEnumerable<ProductModel>> GetProductsAsync();
    }
}