namespace MoneyMinder.Models
{
    public class SessionDetails
    {
        public SessionDetails()
        {
            AccessToken = string.Empty;
            RefreshToken = string.Empty;
        }

        public SessionDetails(string accessToken, string refreshToken)
        {
            AccessToken = accessToken;
            RefreshToken = refreshToken;
        }

        public string AccessToken { get; set; }

        public string RefreshToken { get; set; }
    }
}