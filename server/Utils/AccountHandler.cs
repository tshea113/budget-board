using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;

namespace BudgetBoard.Utils;

public static class AccountHandler
{
    public static Account? GetAccount(ApplicationUser userData, string simpleFinId) =>
        userData.Accounts.FirstOrDefault(a => a.SyncID == simpleFinId);

    public static async Task AddAccountAsync(ApplicationUser userData, UserDataContext userDataContext, Account account)
    {
        userData.Accounts.Add(account);
        await userDataContext.SaveChangesAsync();
    }

    public static async Task<bool> UpdateAccountAsync(ApplicationUser userData, UserDataContext userDataContext, Account newAccount)
    {
        Account? account = userData.Accounts.Single(a => a.ID == newAccount.ID);
        if (account == null) return false;

        account.Name = newAccount.Name;
        account.Institution = newAccount.Institution;
        account.Type = newAccount.Type;
        account.Subtype = newAccount.Subtype;
        account.CurrentBalance = newAccount.CurrentBalance;
        account.BalanceDate = newAccount.BalanceDate;

        await userDataContext.SaveChangesAsync();
        return true;
    }
}
