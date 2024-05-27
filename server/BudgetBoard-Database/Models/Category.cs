namespace BudgetBoard.Database.Models;

public class Category
{
    public Guid ID { get; set; }
    public required string Label { get; set; }
    public required string Value { get; set; }
    public required string Parent { get; set; }
    public required Guid UserID { get; set; }
    public User? User { get; set; } = null!;
}
