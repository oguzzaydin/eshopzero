using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Zero.Eventlog;

namespace Order.Api.Infrastructure
{
    public class IntegrationEventLogContextFactory : IDesignTimeDbContextFactory<EventLogContext>
    {
        public EventLogContext CreateDbContext(string[] args)
        {
            var config = new ConfigurationBuilder()
                .SetBasePath(Path.Combine(Directory.GetCurrentDirectory()))
                .AddJsonFile("appsettings.json")
                .AddEnvironmentVariables()
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<EventLogContext>();

            optionsBuilder.UseNpgsql(config["ConnectionString"], npgsqlOptionsAction: o =>
            {
                o.MigrationsAssembly("Order.Api");
            }).UseLowerCaseNamingConvention();

            return new EventLogContext(optionsBuilder.Options);
        }
    }
}