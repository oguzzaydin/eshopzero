using System;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.IdentityModel.Tokens;

namespace Gateway.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddCustomAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Remove("sub");

            var identityUrl = configuration.GetValue<string>("IdentityUrl");
            var authenticationProviderKey = "IdentityApiKey";

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(authenticationProviderKey,options =>
            {
                options.Authority = identityUrl;
                options.RequireHttpsMetadata = false;
                options.Audience = "gateway";
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidAudiences = new[] { "order", "product", "gateway" }
                };
            }).AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.Audience = "gateway";
                options.Authority = identityUrl;
            });

            return services;
        }

        public static void AddCustomHealthCheck(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddHealthChecks()
                .AddCheck("self", () => HealthCheckResult.Healthy())
                .AddUrlGroup(new Uri(configuration["OrderUrlHC"]), name: "orderapi-check", tags: new[] { "orderapi" })
                .AddUrlGroup(new Uri(configuration["IdentityUrlHC"]), name: "identityapi-check", tags: new[] { "identityapi" })
                .AddUrlGroup(new Uri(configuration["ProductUrlHC"]), name: "productapi-check", tags: new[] { "productapi" });

            services.AddHealthChecksUI(setupSettings: setup =>
            {
                setup.AddHealthCheckEndpoint("Order Api Healthcheck", configuration["OrderUrlHC"]);
                setup.AddHealthCheckEndpoint("Product Api Healthcheck", configuration["ProductUrlHC"]);
                setup.AddHealthCheckEndpoint("Identity Healthcheck", configuration["IdentityUrlHC"]);
                setup.DisableDatabaseMigrations();
            }).AddInMemoryStorage();
        }
    }
}