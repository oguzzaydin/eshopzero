using System;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using System.Text.Json.Serialization;
using Autofac;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Versioning;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Product.Api.Application.Behaviors;
using Product.Api.Infrastructure;
using Product.Api.Web.Filters;
using Zero.Core.Repositories;
using Zero.Core.Repositories.EntityFramework;
using Zero.Core.Sessions;
using Zero.Core.UnitOfWork;
using Zero.EventBus.Abstractions;

namespace Product.Api.Web.Extensions
{
    public static class RegisterExtensions
    {
        private static Assembly CurrentAssembly => Assembly.Load("Product.Api");

        public static IServiceCollection AddCustomControllers(this IServiceCollection services)
        {
            services.AddControllers(options =>
            {
                options.Filters.Add(typeof(HttpGlobalExceptionFilter));
                options.MaxIAsyncEnumerableBufferLimit = 100000;
            })
                .AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()))
                .AddNewtonsoftJson(options =>
                {
                    options.SerializerSettings.Converters.Add(new StringEnumConverter());
                    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                });

            services.AddCors(options =>
            {
                options.AddPolicy("Development",
                    builder => builder
                        .SetIsOriginAllowed((host) => true)
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials());

                options.AddPolicy("Production",
                    builder => builder
                        .SetIsOriginAllowed((host) => true)
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials());
            });

            return services;
        }

        public static IServiceCollection AddMediator(this IServiceCollection services)
        {
            services.AddMediatR(CurrentAssembly);
            return services;
        }

        public static void AddMediator(this ContainerBuilder builder)
        {
            builder.RegisterGeneric(typeof(LoggingBehavior<,>)).As(typeof(IPipelineBehavior<,>));
            builder.RegisterGeneric(typeof(ValidatorBehavior<,>)).As(typeof(IPipelineBehavior<,>));
            builder.RegisterAssemblyTypes(CurrentAssembly).AsClosedTypesOf(typeof(IIntegrationEventHandler<>)).InstancePerDependency();
            builder.RegisterAssemblyTypes(CurrentAssembly).AsClosedTypesOf(typeof(IRequestHandler<,>)).InstancePerDependency();
            builder.RegisterAssemblyTypes(CurrentAssembly).AsClosedTypesOf(typeof(INotificationHandler<>)).InstancePerDependency();
        }

        public static IServiceCollection AddData(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<ProductDbContext>(opt =>
            {
                opt.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
                opt.UseNpgsql(configuration["ConnectionString"], b =>
                    {
                        b.MigrationsAssembly(CurrentAssembly.FullName);
                        b.EnableRetryOnFailure(maxRetryCount: 15, maxRetryDelay: TimeSpan.FromSeconds(30), null);
                    })
                    .UseLowerCaseNamingConvention()
                    .LogTo(Console.WriteLine, new[] { DbLoggerCategory.Database.Command.Name }, LogLevel.Information,
                        DbContextLoggerOptions.SingleLine | DbContextLoggerOptions.UtcTime);
            });

            services.AddScoped<DbContext>(x => x.GetService<ProductDbContext>());

            return services;
        }

        public static ContainerBuilder AddServices(this ContainerBuilder builder)
        {
            builder.RegisterAssemblyTypes(CurrentAssembly)
                .Where(t => t.Name.EndsWith("Service") || t.Name.EndsWith("Query"))
                .AsImplementedInterfaces()
                .InstancePerLifetimeScope();

            return builder;
        }

        public static void AddRepositories(this ContainerBuilder builder)
        {
            builder.RegisterAssemblyTypes(CurrentAssembly)
                .Where(t => t.Name.EndsWith("Repository"))
                .AsImplementedInterfaces()
                .InstancePerLifetimeScope();
            builder.RegisterGeneric(typeof(EntityFrameworkRepository<,>)).As(typeof(IRepository<,>)).InstancePerLifetimeScope();
            builder.RegisterGeneric(typeof(EntityFrameworkRepository<>)).As(typeof(IRepository<>)).InstancePerLifetimeScope();
        }

        public static void AddValidators(this ContainerBuilder builder)
        {
            builder.RegisterAssemblyTypes(CurrentAssembly)
                .Where(t => t.IsClosedTypeOf(typeof(IValidator<>)))
                .AsImplementedInterfaces();
        }

        public static IServiceCollection AddCustomHealtCheck(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddHealthChecks()
                .AddCheck("self", () => HealthCheckResult.Healthy())
                .AddNpgSql(configuration["ConnectionString"],
                    name: "productDB-check",
                    tags: new[] { "OrderDB" })
                .AddRabbitMQ(
                    $"amqp://{configuration["EventBusConnection"]}",
                    name: "product-rabbitmqbus-check",
                    tags: new[] { "rabbitmqbus" })
                .AddRedis(configuration["RedisConnection"], 
                    name: "redis-check", 
                    tags: new[] { "redis" });

            return services;
        }
        public static IServiceCollection AddCustomAuthentications(this IServiceCollection services, IConfiguration configuration)
        {
            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Remove("sub");

            var identityUrl = configuration.GetValue<string>("IdentityUrl");

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

            }).AddJwtBearer("Bearer", options =>
            {
                options.Authority = identityUrl;
                options.RequireHttpsMetadata = false;
                options.Audience = "product";

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateAudience = false
                };
            });

            return services;
        }

        public static IServiceCollection AddCustomApiVersioning(this IServiceCollection services)
        {
            services.AddApiVersioning(config =>
            {
                config.ApiVersionReader = new UrlSegmentApiVersionReader();
                config.AssumeDefaultVersionWhenUnspecified = true;
                config.ReportApiVersions = true;
                config.DefaultApiVersion = new ApiVersion(1, 0);
            });

            return services;
        }

        public static IServiceCollection AddStart(this IServiceCollection services)
        {
            services.AddScoped<ISession, ZeroSession>();
            services.AddScoped<IUnitOfWork, ProductUow>();

            return services;
        }
    }
}