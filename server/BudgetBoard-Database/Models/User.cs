namespace BudgetBoard.Database.Models;
public class User
{
    public Guid ID { get; set; }
    public required string Uid { get; set; }
    public string AccessToken { get; set; } = string.Empty;
    public ICollection<Account> Accounts { get; set; } = new List<Account>();
}

public class ResponseUser
{
    public Guid ID { get; set; }
    public string Uid { get; set; }
    public bool AccessToken { get; set; } = false;
    public ICollection<Account> Accounts { get; set; } = new List<Account>();

    public ResponseUser(User user)
    {
        ID = user.ID;
        Uid = user.Uid;
        AccessToken = (user.AccessToken != string.Empty);
        Accounts = new List<Account>(user.Accounts);
    }
}