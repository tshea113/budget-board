using BudgetBoard.Database.Models;
using System.Text.Json.Serialization;

namespace BudgetBoard.Models;

public class AddBudgetRequest
{
    public DateTime Date { get; set; }
    public string Category { get; set; }
    public decimal Limit { get; set; }

    [JsonConstructor]
    public AddBudgetRequest()
    {
        Date = DateTime.MinValue;
        Category = string.Empty;
        Limit = 0;
    }
}

public class BudgetResponse
{
    public Guid ID { get; set; }
    public DateTime Date { get; set; }
    public string Category { get; set; }
    public decimal Limit { get; set; }
    public Guid UserID { get; set; }

    [JsonConstructor]
    public BudgetResponse()
    {
        ID = Guid.NewGuid();
        Date = DateTime.MinValue;
        Category = string.Empty;
        Limit = 0;
        UserID = Guid.NewGuid();
    }

    public BudgetResponse(Budget budget)
    {
        ID = budget.ID;
        Date = budget.Date;
        Category = budget.Category;
        Limit = budget.Limit;
        UserID = budget.UserID;
    }
}
