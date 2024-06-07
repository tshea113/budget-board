namespace BudgetBoard.Database.Models;
public class Budget
{
    public Guid ID { get; set; }
    public required DateTime Date { get; set; }
    public required string Category { get; set; }
    public float Limit { get; set; } = 0.0f;
    public required Guid UserID { get; set; }
    public ApplicationUser? User { get; set; } = null!;
}
