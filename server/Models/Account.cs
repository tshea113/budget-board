using BudgetBoard.Database.Models;

namespace BudgetBoard.Models;

public class AccountResponse
{
    public Guid ID { get; set; }
    public string? SyncID { get; set; }
    public string Name { get; set; } = string.Empty;
    public Guid? InstitutionID { get; set; }
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
        InstitutionID = account.InstitutionID;
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

public class AccountIndexRequest
{
    public Guid ID { get; set; }
    public int Index { get; set; }
}
