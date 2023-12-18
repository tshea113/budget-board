using System.ComponentModel.DataAnnotations;

namespace MoneyMinder.Database.Models;

public class Transaction
{
    public Guid ID { get; set; }
    public Guid AccountID { get; set; }
    public int Amount { get; set; }
    public DateTime Date { get; set; }
    [DisplayFormat(NullDisplayText = "No Category")]
    public string? Category { get; set; }
    [DisplayFormat(NullDisplayText = "No Merchant")]
    public string? MerchantName { get; set; }
    public bool Pending { get; set; }
    public required string Source { get; set; }
}
