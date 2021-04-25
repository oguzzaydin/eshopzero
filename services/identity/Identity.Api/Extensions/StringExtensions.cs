namespace Identity.Api.Extensions
{
    public static class StringExtensions
    {
        public static string Plural(this string word)
        {
            return $"{word}s";
        }
    }
}