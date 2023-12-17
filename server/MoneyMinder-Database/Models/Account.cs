namespace MoneyMinder.Database.Models;

public enum Type
{
    Depository,
    Credit,
    Loan,
    Investment,
    Other
}

public enum Subtype
{
    Checking,
    Savings,
    MoneyMarket,
    CD,
    Treasury,
    Sweep,
    CreditCard
}

public class Account
{
    public int ID { get; set; }
    public required string Name { get; set; }
    public required string Institution { get; set; }
    public Type Type { get; set; }
    public Subtype Subtype { get; set; }
    public ICollection<Transaction>? Transactions { get; set; }
}
