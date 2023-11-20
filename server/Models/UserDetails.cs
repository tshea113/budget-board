namespace MoneyMinder.Models
{
    public class UserDetails
    {
        public UserDetails()
        {
            Email = string.Empty;
            Password = string.Empty;
        }

        public UserDetails(string email, string password)
        {
            Email = email;
            Password = password;
        }

        public string Email { get; set; }
        public string Password { get; set; }
    }
}