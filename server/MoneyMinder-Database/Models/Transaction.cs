using System.ComponentModel.DataAnnotations;

namespace MoneyMinder.Database.Models;

public class Transaction
{
    public Guid ID { get; set; }
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    [DisplayFormat(NullDisplayText = "No Category")]
    public string? Category { get; set; }
    [DisplayFormat(NullDisplayText = "No Merchant")]
    public string? MerchantName { get; set; }
    public bool Pending { get; set; }
    public required string Source { get; set; }

    public required Guid AccountID { get; set; }
    public Account? Account { get; set; } = null!;
}
