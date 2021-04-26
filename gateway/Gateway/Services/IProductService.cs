using System.Threading.Tasks;
using Gateway.Models;

namespace Gateway.Services
{
    public interface IProductService
    {
        Task<ProductModel> GetProduct(int productId);
    }
}