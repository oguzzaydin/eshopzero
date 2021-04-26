using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Gateway.Extensions;
using Gateway.Models;
using Microsoft.Extensions.Configuration;
using Zero.Core.Sessions;

namespace Gateway.Services
{
    public class ProductService : IProductService
    {
        private readonly HttpClient _httpClient;

        public ProductService(HttpClient httpClient, IConfiguration configuration, ISession session)
        {
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
            httpClient.BaseAddress = new Uri(configuration["ProductApiClient"]);
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(session.Token.Type, session.Token.AccessToken);
        }

        public async Task<ProductModel> GetProduct(int productId)
        {
            var response = await _httpClient.GetAsync($"api/v1/products/{productId}");
            return await response.ResultAsync<ProductModel>();
        }
    }
}