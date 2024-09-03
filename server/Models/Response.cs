using BudgetBoard.Database.Models;
using System.ComponentModel.DataAnnotations;

namespace BudgetBoard.Models
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
    public class AccountResponse
    {
        public Guid ID { get; set; }
        public string? SyncID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Institution { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Subtype { get; set; } = string.Empty;
        public float CurrentBalance { get; set; } = 0.0f;
        public DateTime? BalanceDate { get; set; } = null;
        public bool HideTransactions { get; set; } = false;
        public bool HideAccount { get; set; } = false;
        public DateTime? Deleted { get; set; } = null;
        public Guid UserID { get; set; }

        public AccountResponse(Account account)
        {
            ID = account.ID;
            Name = account.Name;
            Institution = account.Institution;
            Type = account.Type;
            Subtype = account.Subtype;
            CurrentBalance = account.CurrentBalance;
            BalanceDate = account.BalanceDate;
            HideTransactions = account.HideTransactions;
            HideAccount = account.HideAccount;
            Deleted = account.Deleted;
            UserID = account.UserID;
        }
    }
    public class TransactionResponse
    {
        public Guid ID { get; set; }
        public string? SyncID { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        [DisplayFormat(NullDisplayText = "No Category")]
        public string? Category { get; set; }
        [DisplayFormat(NullDisplayText = "No Subcategory")]
        public string? Subcategory { get; set; }
        [DisplayFormat(NullDisplayText = "No Merchant")]
        public string? MerchantName { get; set; }
        public bool Pending { get; set; } = false;
        public DateTime? Deleted { get; set; } = null;
        public string Source { get; set; }
        public Guid AccountID { get; set; }

        public TransactionResponse(Transaction transaction)
        {
            ID = transaction.ID;
            SyncID = transaction.SyncID;
            Amount = transaction.Amount;
            Date = transaction.Date;
            Category = transaction.Category;
            Subcategory = transaction.Subcategory;
            MerchantName = transaction.MerchantName;
            Pending = transaction.Pending;
            Deleted = transaction.Deleted;
            Source = transaction.Source;
            AccountID = transaction.AccountID;
        }
    }

    public class CategoryResponse
    {
        public Guid ID { get; set; }
        public string Label { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string Parent { get; set; } = string.Empty;
        public Guid UserID { get; set; }

        public CategoryResponse(Category category)
        {
            ID = category.ID;
            Label = category.Label;
            Value = category.Value;
            Parent = category.Parent;
            UserID = category.UserID;
        }
    }

    public class BudgetResponse
    {
        public Guid ID { get; set; }
        public DateTime Date { get; set; }
        public string Category { get; set; } = string.Empty;
        public float Limit { get; set; } = 0.0f;
        public Guid UserID { get; set; }

        public BudgetResponse(Budget budget)
        {
            ID = budget.ID;
            Date = budget.Date;
            Category = budget.Category;
            Limit = budget.Limit;
            UserID = budget.UserID;
        }
    }

    public class GoalResponse
    {
        public Guid ID { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime? CompleteDate { get; set; }
        public float Amount { get; set; } = 0.0f;
        public float? InitialAmount { get; set; }
        public float? MonthlyContribution { get; set; }
        public ICollection<AccountResponse> Accounts { get; set; } = new List<AccountResponse>();
        public Guid UserID { get; set; }

        public GoalResponse(Goal goal)
        {
            ID = goal.ID;
            Name = goal.Name;
            CompleteDate = goal.CompleteDate;
            Amount = goal.Amount;
            InitialAmount = goal.InitialAmount;
            MonthlyContribution = goal.MonthlyContribution;
            Accounts = goal.Accounts.Select(a => new AccountResponse(a)).ToList();
            UserID = goal.UserID;
        }
    }
}
