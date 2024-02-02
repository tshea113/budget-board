namespace BudgetBoard.Database.Models;
public class User
{
    public Guid ID { get; set; }
    public required string Uid { get; set; }
    public ICollection<Account> Accounts { get; set; } = new List<Account>();
}