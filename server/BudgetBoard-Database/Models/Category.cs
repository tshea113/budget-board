namespace BudgetBoard.Database.Models;

public class Category
{
    public Guid ID { get; set; }
    public required string Value { get; set; }
    public required string Parent { get; set; }
    public bool Deleted { get; set; } = false;
    public required Guid UserID { get; set; }
    public ApplicationUser? User { get; set; } = null!;
}
