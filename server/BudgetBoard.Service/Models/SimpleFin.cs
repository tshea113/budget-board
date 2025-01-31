using System.Text.Json.Serialization;

namespace BudgetBoard.Service.Models;

public interface ISimpleFinData
{
    string Auth { get; }
    string BaseUrl { get; }
}
public class SimpleFinData() : ISimpleFinData
{
    public string Auth { get; } = string.Empty;
    public string BaseUrl { get; } = string.Empty;

    public SimpleFinData(string auth, string baseUrl) : this()
    {
        Auth = auth;
        BaseUrl = baseUrl;
    }
}

public interface ISimpleFinOrganization
{
    string? Domain { get; set; }
    string SimpleFinUrl { get; set; }
    string? Name { get; set; }
}
public class SimpleFinOrganization() : ISimpleFinOrganization
{
    public string? Domain { get; set; }
    [JsonPropertyName("sfin-url")]
    public string SimpleFinUrl { get; set; } = string.Empty;
    public string? Name { get; set; }
}

public interface ISimpleFinTransaction
{
    string Id { get; set; }
    int Posted { get; set; }
    string Amount { get; set; }
    string Description { get; set; }
    int TransactedAt { get; set; }
    bool Pending { get; set; }
}
public class SimpleFinTransaction() : ISimpleFinTransaction
{
    public string Id { get; set; } = string.Empty;
    public int Posted { get; set; }
    public string Amount { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    [JsonPropertyName("transacted_at")]
    public int TransactedAt { get; set; }
    public bool Pending { get; set; }
}

public interface ISimpleFinAccount
{
    ISimpleFinOrganization Org { get; set; }
    string Id { get; set; }
    string Name { get; set; }
    string Currency { get; set; }
    string Balance { get; set; }
    string? AvailableBalance { get; set; }
    int BalanceDate { get; set; }
    IEnumerable<ISimpleFinTransaction> Transactions { get; set; }
}
public class SimpleFinAccount : ISimpleFinAccount
{
    public ISimpleFinOrganization Org { get; set; }
    public string Id { get; set; }
    public string Name { get; set; }
    public string Currency { get; set; }
    public string Balance { get; set; }
    [JsonPropertyName("available-balance")]
    public string? AvailableBalance { get; set; }
    [JsonPropertyName("balance-date")]
    public int BalanceDate { get; set; }
    public IEnumerable<ISimpleFinTransaction> Transactions { get; set; }

    [JsonConstructor]
    public SimpleFinAccount()
    {
        Org = new SimpleFinOrganization();
        Id = string.Empty;
        Name = string.Empty;
        Currency = string.Empty;
        Balance = string.Empty;
        AvailableBalance = string.Empty;
        BalanceDate = 0;
        Transactions = [];
    }
}

public interface ISimpleFinAccountData
{
    IEnumerable<string> Errors { get; set; }
    IEnumerable<ISimpleFinAccount> Accounts { get; set; }
}
public class SimpleFinAccountData : ISimpleFinAccountData
{
    public IEnumerable<string> Errors { get; set; }
    public IEnumerable<ISimpleFinAccount> Accounts { get; set; }

    [JsonConstructor]
    public SimpleFinAccountData()
    {
        Errors = [];
        Accounts = [];
    }
}
