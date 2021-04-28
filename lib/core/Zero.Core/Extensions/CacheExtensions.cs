using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;

namespace Zero.Core.Extensions
{
    public static class CacheExtensions
    {
        public static TModel Get<TModel>(this IDistributedCache cache, string key)
        {
            var data = cache.GetString(key);
            return data != null ? JsonConvert.DeserializeObject<TModel>(data) : default;
        }
        public static async Task<TModel> GetAsync<TModel>(this IDistributedCache cache, string key)
        {
            var data = await cache.GetStringAsync(key);
            return data != null ? JsonConvert.DeserializeObject<TModel>(data) : default;
        }
        // ReSharper disable once MethodOverloadWithOptionalParameter
        public static async Task<T> GetAsync<T>(this IDistributedCache cache, string key, Func<Task<T>> action = null, int timeOut = 60)
        {
            try
            {
                var cacheResult = await cache.GetAsync<T>(key);
                if (cacheResult != null)
                    return cacheResult;

                if (action == null)
                    return default(T);
                var result = await action.Invoke();
                if (result != null)
                    await cache.SetStringAsync(key, JsonConvert.SerializeObject(result));
                return result;
            }
            catch (Exception)
            {
                // ignored
            }

            return default(T);
        }

        public static async Task UpdateAsync<TModel>(this IDistributedCache cache, string key, TModel model)
        {
            var cacheResult = cache.Get<TModel>(key);
            if (cacheResult != null)
            {
                await cache.RemoveAsync(key);
                await cache.SetStringAsync(key, JsonConvert.SerializeObject(model));
            }
        }

    }
}