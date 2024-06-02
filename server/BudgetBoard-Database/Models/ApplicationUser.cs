using Microsoft.AspNetCore.Identity;

namespace BudgetBoard.Database.Models;
public class ApplicationUser : IdentityUser<Guid>
{
    public string Uid { get; set; } = string.Empty;
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
    public bool AccessToken { get; set; } = false;
    public DateTime LastSync { get; set; } = DateTime.MinValue;
    public ICollection<Account> Accounts { get; set; } = new List<Account>();
    public ICollection<Budget> Budgets { get; set; } = new List<Budget>();
    public ICollection<Goal> Goals { get; set; } = new List<Goal>();

    public ResponseUser(ApplicationUser user)
    {
        ID = user.Id;
        AccessToken = (user.AccessToken != string.Empty);
        LastSync = user.LastSync;
        Accounts = new List<Account>(user.Accounts);
    }
}