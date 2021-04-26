using Newtonsoft.Json;

namespace Zero.Core.Sessions
{
    public class Token
    {
        public int Id { get; set; }
        [JsonProperty("access_token")]
        public string AccessToken { get; set; }
        [JsonProperty("refresh_token")]
        public string RefreshToken { get; set; }
        [JsonProperty("expires_in")]
        public int ExpireIn { get; set; }
        [JsonProperty("token_type")]
        public string Type { get; set; }
    }
}