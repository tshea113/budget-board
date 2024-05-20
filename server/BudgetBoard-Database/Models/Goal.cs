namespace BudgetBoard.Database.Models;

public class Goal
{
    public Guid ID { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CompleteDate { get; set; } = DateTime.Now;
    public float Amount { get; set; } = 0.0f;
    public float InitialAmount { get; set; } = 0.0f;
    public ICollection<Account> Accounts { get; set; } = new List<Account>();
    public required Guid UserID { get; set; }
    public User? User { get; set; } = null!;
}
