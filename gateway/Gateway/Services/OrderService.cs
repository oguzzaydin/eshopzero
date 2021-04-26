using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Gateway.Extensions;
using Gateway.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Zero.Core.Sessions;

namespace Gateway.Services
{
    public class OrderService : IOrderService
    {
        private readonly HttpClient _httpClient;

        public OrderService(HttpClient httpClient, IConfiguration configuration, ISession session)
        {
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
            httpClient.BaseAddress = new Uri(configuration["OrderApiClient"]);
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(session.Token.Type, session.Token.AccessToken);
        }
        public async Task<IEnumerable<OrderModel>> GetOrders()
        {
            var response = await _httpClient.GetAsync($"api/v1/orders");
            return await response.ResultAsync<IEnumerable<OrderModel>>();
        }
    }
}