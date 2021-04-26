using System.Collections.Generic;
using System.Threading.Tasks;

namespace Order.Api.Application.Queries
{
    public interface IOrderQuery
    {
        Task<IEnumerable<OrderModel>> GetOrdersAsync();
    }
}