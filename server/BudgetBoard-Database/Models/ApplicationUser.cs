using Microsoft.AspNetCore.Identity;

namespace BudgetBoard.Database.Models;
public class ApplicationUser : IdentityUser<Guid>
{
    public string Uid { get; set; } = string.Empty;
    public string AccessToken { get; set; } = string.Empty;
    public DateTime LastSync { get; set; } = DateTime.MinValue;
    public ICollection<Account> Accounts { get; set; } = new List<Account>();
    public ICollection<Budget> Budgets { get; set; } = new List<Budget>();
    public ICollection<Goal> Goals { get; set; } = new List<Goal>();
    public ICollection<Category> Categories { get; set; } = new List<Category>();
}