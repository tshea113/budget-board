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

    public class BalanceResponse
    {
        public Guid ID { get; set; }
        public decimal Amount { get; set; }
        public DateTime DateTime { get; set; }
        public Guid AccountID { get; set; }

        public BalanceResponse(Balance balance)
        {
            ID = balance.ID;
            Amount = balance.Amount;
            DateTime = balance.DateTime;
            AccountID = balance.AccountID;
        }
    }
}
