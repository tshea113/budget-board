namespace BudgetBoard.Database.Models;

public class Goal
{
    public Guid ID { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime? CompleteDate { get; set; } = null;
    public decimal Amount { get; set; } = 0.0M;
    public decimal InitialAmount { get; set; } = 0.0M;
    public decimal? MonthlyContribution { get; set; } = null;
    public DateTime? Completed { get; set; } = null;
    public ICollection<Account> Accounts { get; set; } = [];
    public required Guid UserID { get; set; }
    public ApplicationUser? User { get; set; } = null;
}
