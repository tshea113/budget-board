namespace MoneyMinder.Models
{
    public class UserDetails
    {
        public UserDetails()
        {
            Uid = string.Empty;
        }

        public UserDetails(string uid)
        {
            Uid = uid;
        }

        public string Uid { get; set; }
    }
}