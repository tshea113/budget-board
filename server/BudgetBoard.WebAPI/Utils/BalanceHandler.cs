using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;

namespace BudgetBoard.WebAPI.Utils;

public static class BalanceHandler
{
    public static async Task AddBalanceAsync(ApplicationUser userData, UserDataContext userDataContext, Balance balance)
    {
        Account? account = userDataContext.Accounts.Find(balance.AccountID);
        if (account == null) return;

        account.Balances.Add(balance);
        await userDataContext.SaveChangesAsync();
    }
}
