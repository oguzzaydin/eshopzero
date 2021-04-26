using System.Collections.Generic;

namespace Zero.Core.Sessions
{
    public interface ISession
    {
        int Id { get; }
        string Sid { get; }
        int Nbf { get; }
        int Exp { get; }
        string Issuer { get; }
        IEnumerable<string> Audiences { get; }
        string ClientId { get; }
        string Name { get; }
        Token Token { get; }
        IEnumerable<string> Scopes { get; }
        string FirstName { get; }
        string LastName { get; }
        string MailAddress { get; }
        string Gender { get; }
        string BirthDate { get; }
        string Country { get; }
    }
}