using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;

namespace BudgetBoard.Utils;
public class TransactionHandler
{
    public TransactionHandler() { }

    public static List<Transaction> GetTransactions(User userData)
    {
        return userData.Accounts.SelectMany(t => t.Transactions).ToList();
    }

    public static void AddTransaction(User userData, UserDataContext userDataContext, Transaction transaction)
    {
        Account? account = userDataContext.Accounts.Find(transaction.AccountID);
        if (account == null)
        {
            return;
        }

        account.Transactions.Add(transaction);
        userDataContext.SaveChanges();
    }
}
