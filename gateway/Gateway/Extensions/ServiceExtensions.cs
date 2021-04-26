using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Gateway.Extensions
{
    public static class ServiceExtensions
    {
        public static async Task<TModel> ResultAsync<TModel>(this HttpResponseMessage response)
        {
            response.EnsureSuccessStatusCode();
            var responseJson = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<TModel>(responseJson);
        }
    }
}