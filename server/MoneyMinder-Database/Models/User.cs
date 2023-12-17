namespace MoneyMinder.Database.Models;
public class User
{
    public int ID { get; set; }
    public required string Uid { get; set; }
    public ICollection<Account>? Accounts { get; set; }
}