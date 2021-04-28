using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Product.Api.Application.Hubs
{
    public interface IProductHub
    {
        Task ProductStockChanged(object message);
        Task ProductStockChangedError(object message);
    }

    [Authorize]
    public class ProductHub : Hub<IProductHub>
    {
        public override async Task OnConnectedAsync()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, Context?.User?.FindFirst("sub")?.Value);
            await base.OnConnectedAsync();
        }
        public override async Task OnDisconnectedAsync(Exception ex)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, Context?.User?.FindFirst("sub")?.Value);
            await base.OnDisconnectedAsync(ex);
        }
    }
}