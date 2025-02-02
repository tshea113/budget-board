using BudgetBoard.Database.Models;
using System.Text.Json.Serialization;

namespace BudgetBoard.Service.Models;

public interface IBudgetCreateRequest
{
    DateTime Date { get; set; }
    string Category { get; set; }
    decimal Limit { get; set; }
}
public class BudgetCreateRequest : IBudgetCreateRequest
{
    public DateTime Date { get; set; }
    public string Category { get; set; }
    public decimal Limit { get; set; }

    [JsonConstructor]
    public BudgetCreateRequest()
    {
        Date = DateTime.MinValue;
        Category = string.Empty;
        Limit = 0;
    }
}

public interface IBudgetUpdateRequest
{
    Guid ID { get; set; }
    decimal Limit { get; set; }
}
public class BudgetUpdateRequest : IBudgetUpdateRequest
{
    public Guid ID { get; set; }
    public decimal Limit { get; set; }

    [JsonConstructor]
    public BudgetUpdateRequest()
    {
        ID = Guid.NewGuid();
        Limit = 0;
    }
}

public interface IBudgetResponse
{
    Guid ID { get; set; }
    DateTime Date { get; set; }
    string Category { get; set; }
    decimal Limit { get; set; }
    Guid UserID { get; set; }
}
public class BudgetResponse : IBudgetResponse
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
