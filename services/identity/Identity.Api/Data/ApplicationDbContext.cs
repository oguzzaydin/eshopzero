using Identity.Api.Entities;
using Identity.Api.Extensions;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Identity.Api.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, Role, int, UserClaim, UserRole, UserLogin, RoleClaim, UserToken>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            ConfigureIdentityContext(builder);
        }

        private void ConfigureIdentityContext(ModelBuilder builder)
        {
            builder.Entity<Role>(o => o.ToTable(nameof(Role).Plural()));
            builder.Entity<RoleClaim>().ToTable(nameof(RoleClaim).Plural());
            builder.Entity<UserRole>().ToTable(nameof(UserRole).Plural());
            builder.Entity<ApplicationUser>().ToTable("Users");
            builder.Entity<UserLogin>().ToTable(nameof(UserLogin).Plural());
            builder.Entity<UserClaim>().ToTable(nameof(UserClaim).Plural());
            builder.Entity<UserToken>().ToTable(nameof(UserToken).Plural());
        }
    }
}
