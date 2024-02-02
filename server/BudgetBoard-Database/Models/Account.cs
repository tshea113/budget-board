namespace BudgetBoard.Database.Models;

public class Account
{
    public Guid ID { get; set; }
    public required string Name { get; set; }
    public required string Institution { get; set; }
    public string Type { get; set; } = "";
    public string Subtype { get; set; } = "";
    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();

    public required Guid UserID { get; set; }
    public User? User { get; set; } = null!;
}
