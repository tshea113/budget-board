namespace BudgetBoard.Database.Models;
public class User
{
    public Guid ID { get; set; }
    public required string Uid { get; set; }
    public string AccessToken { get; set; } = string.Empty;
    public DateTime LastSync { get; set; } = DateTime.MinValue;
    public ICollection<Account> Accounts { get; set; } = new List<Account>();
    public ICollection<Budget> Budgets { get; set; } = new List<Budget>();
    public ICollection<Goal> Goals { get; set; } = new List<Goal>();
    public ICollection<Category> Categories { get; set; } = new List<Category>();
}

public class ResponseUser
{
    public Guid ID { get; set; }
    public string Uid { get; set; }
    public bool AccessToken { get; set; } = false;
    public DateTime LastSync { get; set; } = DateTime.MinValue;
    public ICollection<Account> Accounts { get; set; } = new List<Account>();
    public ICollection<Budget> Budgets { get; set; } = new List<Budget>();
    public ICollection<Goal> Goals { get; set; } = new List<Goal>();

    public ResponseUser(User user)
    {
        ID = user.ID;
        Uid = user.Uid;
        AccessToken = (user.AccessToken != string.Empty);
        LastSync = user.LastSync;
        Accounts = new List<Account>(user.Accounts);
    }
}