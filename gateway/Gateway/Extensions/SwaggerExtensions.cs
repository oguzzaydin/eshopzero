using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using Gateway.Filters;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Ocelot.Configuration.File;

namespace Gateway.Extensions
{
    public static class SwaggerExtensions
    {
        public static void AddSelfSwagger(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Gateway",
                    Version = "1",
                    Description = "Gateway"
                });

                options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.OAuth2,
                    Flows = new OpenApiOAuthFlows
                    {
                        Implicit = new OpenApiOAuthFlow
                        {
                            AuthorizationUrl = new Uri($"{configuration.GetValue<string>("IdentityUrlExternal")}/connect/authorize"),
                            TokenUrl = new Uri($"{configuration.GetValue<string>("IdentityUrlExternal")}/connect/token"),
                            Scopes = new Dictionary<string, string>()
                            {
                                { "gateway", "Gateway" }
                            }
                        }
                    }
                });
                options.OperationFilter<AuthorizeCheckOperationFilter>();
            });
        }

        public static void UseSwaggerForOcelot(this IApplicationBuilder app, IConfiguration configuration, string pathBase)
        {
            app.UseSwagger();
            var httpClient = new HttpClient();
            app.UseSwaggerUI(s =>
            {
                s.SwaggerEndpoint($"{ (!string.IsNullOrEmpty(pathBase) ? pathBase : string.Empty) }/swagger/v1/swagger.json", "Gateway");
                s.OAuthAppName("Gateway Swagger UI");
                s.OAuthClientSecret(string.Empty);
                s.OAuthRealm(string.Empty);

                s.RoutePrefix = "swagger";
                s.DocumentTitle = "EshopZero Api Gateway";

                foreach (var apiRoute in configuration.Get<FileConfiguration>().Routes)
                {
                    var address = apiRoute.DownstreamHostAndPorts.First();
                    var url = $"{apiRoute.DownstreamScheme}://{address.Host}:{address.Port}/swagger/v1/swagger.json";
                    var downstreamPathTemplate = apiRoute.DownstreamPathTemplate.Replace("{everything}", "");
                    var upstreamPathTemplate = apiRoute.UpstreamPathTemplate.Replace("{everything}", "");
                    var serviceName = address.Host.Trim('-');
                    var jsonEndpoint = $"/{serviceName}/swagger.json";
                    app.Map(jsonEndpoint, b =>
                    {
                        b.Run(async x =>
                        {
                            var content = httpClient.GetStringAsync(url).GetAwaiter().GetResult();
                            var docs = JsonConvert.DeserializeObject<OpenApiDocument>(content);
                            var downStreamVersion = downstreamPathTemplate.Replace("{version}", docs.Info.Version);
                            var upstreamVersion = upstreamPathTemplate.Replace("{version}", docs.Info.Version);
                            content = content.Replace(downStreamVersion, upstreamVersion);
                            content = content.Replace("servers", null);
                            await x.Response.WriteAsync(content);
                        });
                    });
                    string[] serviceNameS = serviceName.Split('-', '/').Where(k => !string.IsNullOrWhiteSpace(k)).ToArray();
                    serviceName = string.Join(" ", serviceNameS.Select((k) => char.ToUpper(k[0]) + k.Substring(1)));
                    s.SwaggerEndpoint(jsonEndpoint, serviceName);
                    s.OAuthClientId("gateway");
                    s.DisplayOperationId();
                }
            });
        }
    }
}