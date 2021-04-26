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
            await Groups.AddToGroupAsync(Context.ConnectionId, Context.UserIdentifier ?? string.Empty);
            await base.OnConnectedAsync();
        }
        public override async Task OnDisconnectedAsync(Exception ex)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, Context.UserIdentifier ?? string.Empty);
            await base.OnDisconnectedAsync(ex);
        }
    }
}