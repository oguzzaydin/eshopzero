using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using Gateway.Models;

namespace Gateway.Services
{
    public interface IOrderService
    {
        Task<IEnumerable<OrderModel>> GetOrders();
    }
}