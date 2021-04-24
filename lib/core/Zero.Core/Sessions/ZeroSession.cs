using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using Microsoft.AspNetCore.Http;

namespace Zero.Core.Sessions
{
    public class ZeroSession : ISession
    {
        public int Id { get; }
        public string Sid { get; }
        public int Nbf { get; }
        public int Exp { get; }
        public string Issuer { get; }
        public IEnumerable<string> Audiences { get; }
        public string ClientId { get; }
        public string Name { get; }
        public IEnumerable<string> Scopes { get; }
        public string FirstName { get; }
        public string LastName { get; }
        public string MailAddress { get; }
        public string Gender { get; }
        public string BirthDate { get; }
        public string Country { get; }

        public ZeroSession(IHttpContextAccessor accessor)
        {
            var context = accessor.HttpContext;
            if (context == null) return;

            var uniqueName = context.User.Identity?.Name;
            var jti = context.User.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti)?.Value;
            var audience = context.User.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Aud)?.Value;

            if (!string.IsNullOrEmpty(uniqueName) && int.TryParse(jti, out var id))
            {
                Id = id;
                Audiences = new List<string> { audience };
                Sid = uniqueName;
            }
        }
    }
}