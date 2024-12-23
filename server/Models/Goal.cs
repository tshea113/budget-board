using BudgetBoard.Database.Models;
using System.Text.Json.Serialization;

namespace BudgetBoard.Models;

public class GoalRequest
{
    public required string Name { get; set; }
    public DateTime? CompleteDate { get; set; }
    public required decimal Amount { get; set; }
    public decimal? InitialAmount { get; set; }
    public decimal? MonthlyContribution { get; set; }
    public required ICollection<string> AccountIds { get; set; }

    [JsonConstructor]
    public GoalRequest()
    {
        Name = string.Empty;
        CompleteDate = null;
        Amount = 0.0M;
        InitialAmount = null;
        MonthlyContribution = null;
        AccountIds = [];

    }
}

public class GoalResponse
{
    public Guid ID { get; set; }
    public string Name { get; set; }
    public DateTime? CompleteDate { get; set; }
    public decimal Amount { get; set; }
    public decimal? InitialAmount { get; set; }
    public decimal? MonthlyContribution { get; set; }
    public ICollection<AccountResponse> Accounts { get; set; }
    public Guid UserID { get; set; }

    [JsonConstructor]
    public GoalResponse()
    {
        ID = Guid.NewGuid();
        Name = string.Empty;
        CompleteDate = null;
        Amount = 0.0M;
        InitialAmount = null;
        MonthlyContribution = null;
        Accounts = [];
        UserID = Guid.NewGuid();
    }

    public GoalResponse(Goal goal)
    {
        ID = goal.ID;
        Name = goal.Name;
        CompleteDate = goal.CompleteDate;
        Amount = goal.Amount;
        InitialAmount = goal.InitialAmount;
        MonthlyContribution = goal.MonthlyContribution;
        Accounts = goal.Accounts.Select(a => new AccountResponse(a)).ToList();
        UserID = goal.UserID;
    }
}
