using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;

namespace BudgetBoard.Utils;

public class AccountHandler
{
    public AccountHandler() { }

    public static Account? GetAccount(User userData, string simpleFinId)
    {
        Account? account = userData.Accounts.FirstOrDefault(a => a.SyncID == simpleFinId);

        return account;
    }

    public static void AddAccount(User userData, UserDataContext userDataContext, Account account)
    {
        userData.Accounts.Add(account);
        userDataContext.SaveChanges();
    }

    public static void UpdateAccount(User userData, UserDataContext userDataContext, Account newAccount)
    {
        Account? account = userData.Accounts.Single(a => a.ID == newAccount.ID);
        if (account == null)
        {
            return;
        }

        account.Name = newAccount.Name;
        account.Institution = newAccount.Institution;
        account.Type = newAccount.Type;
        account.Subtype = newAccount.Subtype;
        account.CurrentBalance = newAccount.CurrentBalance;

        userDataContext.SaveChanges();
    }
}
