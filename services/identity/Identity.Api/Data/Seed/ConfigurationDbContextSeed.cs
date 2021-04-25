using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Identity.Api.Configuration;
using IdentityServer4.EntityFramework.DbContexts;
using IdentityServer4.EntityFramework.Entities;
using IdentityServer4.EntityFramework.Mappers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Identity.Api.Data.Seed
{
    public class ConfigurationDbContextSeed
    {
        public async Task SeedAsync(ConfigurationDbContext context,IConfiguration configuration)
        {
           
            //callbacks urls from config:
            var clientUrls = new Dictionary<string, string>();
           
            clientUrls.Add("OrderApi", configuration.GetValue<string>("OrderApiClient"));
            clientUrls.Add("ProductApi", configuration.GetValue<string>("ProductApiClient"));
            clientUrls.Add("Gateway", configuration.GetValue<string>("GatewayClient"));

            if (!context.Clients.Any())
            {
                foreach (var client in Config.GetClients(clientUrls))
                {
                    await context.Clients.AddAsync(client.ToEntity());
                }
                await context.SaveChangesAsync();
            }

            // Checking always for old redirects to fix existing deployments
            // to use new swagger-ui redirect uri as of v3.0.0
            // There should be no problem for new ones
            // ref: https://github.com/dotnet-architecture/eShopOnContainers/issues/586
            else
            {
                List<ClientRedirectUri> oldRedirects = (await context.Clients.Include(c => c.RedirectUris).ToListAsync())
                    .SelectMany(c => c.RedirectUris)
                    .Where(ru => ru.RedirectUri.EndsWith("/o2c.html"))
                    .ToList();

                if (oldRedirects.Any())
                {
                    foreach (var ru in oldRedirects)
                    {
                        ru.RedirectUri = ru.RedirectUri.Replace("/o2c.html", "/oauth2-redirect.html");
                        context.Update(ru.Client);
                    }
                    await context.SaveChangesAsync();
                }
            }

            if (!context.IdentityResources.Any())
            {
                foreach (var resource in Config.IdentityResources)
                {
                    await context.IdentityResources.AddAsync(resource.ToEntity());
                }
                await context.SaveChangesAsync();
            }

            if (!context.ApiResources.Any())
            {
                foreach (var api in Config.ApiResources)
                {
                    await context.ApiResources.AddAsync(api.ToEntity());
                }

                await context.SaveChangesAsync();
            }

            if (!context.ApiScopes.Any())
            {
                foreach (var apiScope in Config.GetApiScopes())
                {
                    await context.ApiScopes.AddAsync(apiScope.ToEntity());
                }

                await context.SaveChangesAsync();
            }
        }
    }
}
