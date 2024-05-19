namespace BudgetBoard.Database.Models;

public class Goal
{
    public Guid ID { get; set; }
    public required string Name { get; set; }
    public required DateTime CompleteDate { get; set; }
    public required float Amount { get; set; }
    public required Guid UserID { get; set; }
    public User? User { get; set; } = null!;
}
