using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using BudgetBoard.Service.Interfaces;
using BudgetBoard.Service.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BudgetBoard.Service;

public class TransactionService(ILogger<ITransactionService> logger, UserDataContext userDataContext) : ITransactionService
{
    private readonly ILogger<ITransactionService> _logger = logger;
    private readonly UserDataContext _userDataContext = userDataContext;

    public async Task CreateTransactionAsync(Guid userGuid, ITransactionCreateRequest transaction)
    {
        var userData = await GetCurrentUserAsync(userGuid.ToString());
        var account = userData.Accounts.FirstOrDefault(a => a.ID == transaction.AccountID);
        if (account == null)
        {
            _logger.LogError("Attempt to add transaction to account that does not exist.");
            throw new Exception("The account you are trying to add a transaction to does not exist.");
        }

        var newTransaction = new Transaction
        {
            SyncID = transaction.SyncID,
            Amount = transaction.Amount,
            Date = transaction.Date,
            Category = transaction.Category,
            Subcategory = transaction.Subcategory,
            MerchantName = transaction.MerchantName,
            Source = transaction.Source ?? TransactionSource.Manual.Value,
            AccountID = transaction.AccountID
        };

        account.Transactions.Add(newTransaction);
        await _userDataContext.SaveChangesAsync();
    }

    public async Task<IEnumerable<ITransactionResponse>> ReadTransactionsAsync(Guid userGuid, int? year, int? month, bool getHidden, Guid guid = default)
    {
        var userData = await GetCurrentUserAsync(userGuid.ToString());
        var transactions = userData.Accounts
                .SelectMany(t => t.Transactions)
                .Where(t => getHidden || !(t.Account?.HideTransactions ?? false));

        if (year != null)
        {
            transactions = transactions.Where(t => t.Date.Year == year);
        }

        if (month != null)
        {
            transactions = transactions.Where(t => t.Date.Month == month);
        }

        if (guid != default)
        {
            var transaction = transactions.FirstOrDefault(t => t.ID == guid);
            if (transaction == null)
            {
                _logger.LogError("Attempt to access transaction that does not exist.");
                throw new Exception("The transaction you are trying to access does not exist.");
            }

            return [new TransactionResponse(transaction)];
        }

        return transactions.Select(t => new TransactionResponse(t));
    }

    public async Task UpdateTransactionAsync(Guid userGuid, ITransactionUpdateRequest editedTransaction)
    {
        var userData = await GetCurrentUserAsync(userGuid.ToString());
        var transaction = userData.Accounts
            .SelectMany(t => t.Transactions)
            .FirstOrDefault(t => t.ID == editedTransaction.ID);
        if (transaction == null)
        {
            _logger.LogError("Attempt to edit transaction that does not exist.");
            throw new Exception("The transaction you are trying to edit does not exist.");
        }

        transaction.Amount = editedTransaction.Amount;
        transaction.Date = editedTransaction.Date;
        transaction.Category = editedTransaction.Category;
        transaction.Subcategory = editedTransaction.Subcategory;
        transaction.MerchantName = editedTransaction.MerchantName;

        await _userDataContext.SaveChangesAsync();
    }

    public async Task DeleteTransactionAsync(Guid userGuid, Guid guid)
    {
        var userData = await GetCurrentUserAsync(userGuid.ToString());
        var transaction = userData.Accounts
            .SelectMany(t => t.Transactions)
            .FirstOrDefault(t => t.ID == guid);
        if (transaction == null)
        {
            _logger.LogError("Attempt to delete transaction that does not exist.");
            throw new Exception("The transaction you are trying to delete does not exist.");
        }

        transaction.Deleted = DateTime.Now.ToUniversalTime();
        await _userDataContext.SaveChangesAsync();
    }

    public async Task RestoreTransactionAsync(Guid userGuid, Guid guid)
    {
        var userData = await GetCurrentUserAsync(userGuid.ToString());
        var transaction = userData.Accounts
            .SelectMany(t => t.Transactions)
            .FirstOrDefault(t => t.ID == guid);
        if (transaction == null)
        {
            _logger.LogError("Attempt to restore transaction that does not exist.");
            throw new Exception("The transaction you are trying to restore does not exist.");
        }

        transaction.Deleted = null;
        await _userDataContext.SaveChangesAsync();
    }

    private async Task<IApplicationUser> GetCurrentUserAsync(string id)
    {
        List<ApplicationUser> users;
        ApplicationUser? foundUser;
        try
        {
            users = await _userDataContext.ApplicationUsers
                .Include(u => u.Accounts)
                .ThenInclude(a => a.Transactions)
                .AsSplitQuery()
                .ToListAsync();
            foundUser = users.FirstOrDefault(u => u.Id == new Guid(id));
        }
        catch (Exception ex)
        {
            _logger.LogError("An error occurred while retrieving the user data: {ExceptionMessage}", ex.Message);
            throw new Exception("An error occurred while retrieving the user data.");
        }

        if (foundUser == null)
        {
            _logger.LogError("Attempt to create an account for an invalid user.");
            throw new Exception("Provided user not found.");
        }

        return foundUser;
    }
}
