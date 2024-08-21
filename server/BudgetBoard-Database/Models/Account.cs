namespace BudgetBoard.Database.Models;

public class Account
{
    public Guid ID { get; set; }
    public string? SyncID { get; set; }
    public required string Name { get; set; }
    public required string Institution { get; set; }
    public string Type { get; set; } = "";
    public string Subtype { get; set; } = "";
    public float CurrentBalance { get; set; } = 0.0f;
    public DateTime? BalanceDate { get; set; } = null;
    public bool HideTransactions { get; set; } = false;
    public bool HideAccount { get; set; } = false;
    public DateTime? Deleted { get; set; } = null;
    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    public ICollection<Goal> Goals { get; set; } = new List<Goal>();
    public required Guid UserID { get; set; }
    public ApplicationUser? User { get; set; } = null!;
}
