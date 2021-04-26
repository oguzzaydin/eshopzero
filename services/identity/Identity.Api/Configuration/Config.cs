using IdentityModel;
using IdentityServer4.Models;
using System.Collections.Generic;

namespace Identity.Api.Configuration
{
    public static class Config
    {
        public static IEnumerable<IdentityResource> IdentityResources =>
           new IdentityResource[]
           {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile()
           };

        public static IEnumerable<ApiResource> ApiResources =>
            new ApiResource[]
            {
                new()
                {
                    Name = "gateway",
                    DisplayName = "Gateway",
                    Scopes = {"order", "product", "gateway"},
                    UserClaims =
                    {
                        JwtClaimTypes.Subject,
                        JwtClaimTypes.Email,
                        JwtClaimTypes.Name,
                        JwtClaimTypes.GivenName,
                        JwtClaimTypes.Id
                    }
                },
                new()
                {
                    Name = "order",
                    DisplayName = "Order Service",
                    Scopes = {"order"},
                    UserClaims =
                    {
                        JwtClaimTypes.Subject,
                        JwtClaimTypes.Email,
                        JwtClaimTypes.Name,
                        JwtClaimTypes.GivenName,
                        JwtClaimTypes.Id
                    }
                },
                new()
                {
                    Name = "product",
                    DisplayName = "Product Service",
                    Scopes = {"product"},
                    UserClaims =
                    {
                        JwtClaimTypes.Subject,
                        JwtClaimTypes.Email,
                        JwtClaimTypes.Name,
                        JwtClaimTypes.GivenName,
                        JwtClaimTypes.Id
                    }
                }
            };

        public static IEnumerable<ApiScope> GetApiScopes() =>
            new ApiScope[]
            {
                new("order", "Order Service"),
                new("product", "Product Service"),
                new("gateway", "Gateway"),
            };
        
        public static IEnumerable<Client> GetClients(Dictionary<string, string> clientsUrl)
        {
            return new List<Client>
            {
                new()
                {
                    ClientId = "orderswaggerui",
                    ClientName = "Order Swagger UI",

                    RedirectUris = { $"{clientsUrl["OrderApi"]}/swagger/oauth2-redirect.html" },
                    PostLogoutRedirectUris = { $"{clientsUrl["OrderApi"]}/swagger/" },

                    AllowAccessTokensViaBrowser = true,
                    AllowedGrantTypes = GrantTypes.Implicit,

                    AllowedScopes =
                    {
                        "order"
                    }
                },
                new()
                {
                    ClientId = "productswaggerui",
                    ClientName = "Product Swagger UI",

                    RedirectUris = { $"{clientsUrl["ProductApi"]}/swagger/oauth2-redirect.html" },
                    PostLogoutRedirectUris = { $"{clientsUrl["ProductApi"]}/swagger/" },

                    AllowAccessTokensViaBrowser = true,
                    AllowedGrantTypes = GrantTypes.Implicit,

                    AllowedScopes =
                    {
                        "product"
                    }
                },
                new()
                {
                    ClientId = "gateway",
                    ClientName = "Gateway Swagger UI",

                    RedirectUris = { $"{clientsUrl["Gateway"]}/swagger/oauth2-redirect.html" },
                    PostLogoutRedirectUris = { $"{clientsUrl["Gateway"]}/swagger/" },

                    AllowAccessTokensViaBrowser = true,
                    AllowedGrantTypes = GrantTypes.Implicit,

                    AllowedScopes =
                    {
                        "gateway",
                        "order",
                        "product"
                    }
                }
            };
        }
    }
}