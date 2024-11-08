using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;

namespace BudgetBoard.Utils;
public static class TransactionHandler
{
    public static List<Transaction> GetTransactions(ApplicationUser userData) =>
        userData.Accounts.SelectMany(t => t.Transactions).ToList();

    public static async Task AddTransactionAsync(ApplicationUser userData, UserDataContext userDataContext, Transaction transaction)
    {
        Account? account = userDataContext.Accounts.Find(transaction.AccountID);
        if (account == null) return;

        account.Transactions.Add(transaction);
        await userDataContext.SaveChangesAsync();
    }
}
