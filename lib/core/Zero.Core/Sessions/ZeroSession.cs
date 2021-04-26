using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
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
        public Token Token { get; set; }
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
            try
            {
                var context = accessor.HttpContext;
                if (context == null) return;
                Sid = context.User.FindFirst("sub")?.Value;
                if (int.TryParse(Sid, out var sub))
                    Id = sub;
                if (int.TryParse(context.User.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Nbf)?.Value,
                    out var nbf))
                    Nbf = nbf;
                if (int.TryParse(context.User.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Exp)?.Value,
                    out var exp))
                    Exp = exp;

                var token = context.Request?.Headers["Authorization"].FirstOrDefault()?.Split(' ');
                if (token != null && token.Length > 1)
                {
                    Token = new Token
                    {
                        Id = sub,
                        Type = token[0],
                        AccessToken = token[1]
                    };
                }

                Issuer = context.User.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Iss)?.Value;
                Audiences = context.User.Claims.Where(x => x.Type == JwtRegisteredClaimNames.Aud).Select(x => x.Value);
                ClientId = context.User.Claims.FirstOrDefault(x => x.Type == "client_id")?.Value;
                Name = context.User.Claims.FirstOrDefault(x => x.Type == "name")?.Value;
                Scopes = context.User.Claims.Where(x => x.Type == "scope").Select(x => x.Value);

                MailAddress = context.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
                FirstName = context.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.GivenName)?.Value;
                LastName = context.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Surname)?.Value;
                Gender = context.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Gender)?.Value;
                BirthDate = context.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.DateOfBirth)?.Value;
                Country = context.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Country)?.Value;
            }
            catch (Exception ex)
            {
                throw new Exception("Token cannot be read", ex);
            }
        }
    }
}