using BudgetBoard.Database.Models;

namespace BudgetBoard.WebAPI.Models
{
    public class UserResponse
    {
        public Guid ID { get; set; }
        public bool AccessToken { get; set; } = false;
        public DateTime LastSync { get; set; } = DateTime.MinValue;
        public ICollection<Account> Accounts { get; set; } = new List<Account>();
        public ICollection<Budget> Budgets { get; set; } = new List<Budget>();
        public ICollection<Goal> Goals { get; set; } = new List<Goal>();

        public UserResponse(ApplicationUser user)
        {
            ID = user.Id;
            AccessToken = (user.AccessToken != string.Empty);
            LastSync = user.LastSync;
        }
    }
}
