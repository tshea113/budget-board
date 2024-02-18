using System.Text.Json.Serialization;

namespace BudgetBoard.Models.SimpleFinDetails;

public class AccountSet
{
    public required string[] Errors { get; set; }
    public required Account[] Accounts { get; set; }
}

public class Account
{
    public required Organization Org { get; set; }
    public required string Id { get; set; }
    public required string Name { get; set; }
    public required string Currency { get; set; }
    public required string Balance { get; set; }
    [JsonPropertyName("available-balance")]
    public string? AvailableBalance { get; set; }
    [JsonPropertyName("balance-date")]
    public required int BalanceDate { get; set; }
    public Transaction[]? Transactions { get; set; }

}

public class Transaction
{
    public required string Id { get; set; }
    public required int Posted { get; set; }
    public required string Amount { get; set; }
    public required string Description { get; set; }
    [JsonPropertyName("transacted_at")]
    public int TransactedAt { get; set; }
    public bool Pending { get; set; }
}

public class Organization
{
    public string? Domain { get; set; }
    [JsonPropertyName("sfin-url")]
    public required string SfinUrl { get; set; }
    public string? Name { get; set; }
}
