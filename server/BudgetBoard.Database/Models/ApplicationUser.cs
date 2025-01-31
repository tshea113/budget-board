using Microsoft.AspNetCore.Identity;

namespace BudgetBoard.Database.Models;
public interface IApplicationUser
{
    Guid Id { get; set; }
    string Uid { get; set; }
    string AccessToken { get; set; }
    DateTime LastSync { get; set; }
    ICollection<Account> Accounts { get; set; }
    ICollection<Budget> Budgets { get; set; }
    ICollection<Goal> Goals { get; set; }
    ICollection<Category> TransactionCategories { get; set; }
    ICollection<Institution> Institutions { get; set; }
}
public class ApplicationUser : IdentityUser<Guid>, IApplicationUser
{
    public string Uid { get; set; } = string.Empty;
    public string AccessToken { get; set; } = string.Empty;
    public DateTime LastSync { get; set; } = DateTime.MinValue;
    public ICollection<Account> Accounts { get; set; } = [];
    public ICollection<Budget> Budgets { get; set; } = [];
    public ICollection<Goal> Goals { get; set; } = [];
    public ICollection<Category> TransactionCategories { get; set; } = [];
    public ICollection<Institution> Institutions { get; set; } = [];
}