using BudgetBoard.Database.Models;
using System.Text.Json.Serialization;

namespace BudgetBoard.Service.Models;

public interface IBalanceCreateRequest
{
    decimal Amount { get; set; }
    DateTime DateTime { get; set; }
    Guid AccountID { get; set; }
}

public class BalanceCreateRequest : IBalanceCreateRequest
{
    public decimal Amount { get; set; }
    public DateTime DateTime { get; set; }
    public Guid AccountID { get; set; }

    [JsonConstructor]
    public BalanceCreateRequest()
    {
        Amount = 0;
        DateTime = DateTime.MinValue;
        AccountID = Guid.NewGuid();
    }
}

public interface IBalanceUpdateRequest
{
    Guid ID { get; set; }
    decimal Amount { get; set; }
    DateTime DateTime { get; set; }
    Guid AccountID { get; set; }
}

public class BalanceUpdateRequest : IBalanceUpdateRequest
{
    public Guid ID { get; set; }
    public decimal Amount { get; set; }
    public DateTime DateTime { get; set; }
    public Guid AccountID { get; set; }

    [JsonConstructor]
    public BalanceUpdateRequest()
    {
        ID = Guid.NewGuid();
        Amount = 0;
        DateTime = DateTime.MinValue;
        AccountID = Guid.NewGuid();
    }
}

public interface IBalanceResponse
{
    Guid ID { get; set; }
    decimal Amount { get; set; }
    DateTime DateTime { get; set; }
    Guid AccountID { get; set; }
}

public class BalanceResponse : IBalanceResponse
{
    public Guid ID { get; set; }
    public decimal Amount { get; set; }
    public DateTime DateTime { get; set; }
    public Guid AccountID { get; set; }

    [JsonConstructor]
    public BalanceResponse()
    {
        ID = Guid.NewGuid();
        Amount = 0;
        DateTime = DateTime.MinValue;
        AccountID = Guid.NewGuid();
    }

    public BalanceResponse(Balance balance)
    {
        ID = balance.ID;
        Amount = balance.Amount;
        DateTime = balance.DateTime;
        AccountID = balance.AccountID;
    }
}
