using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using BudgetBoard.Service.Interfaces;
using BudgetBoard.Service.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace BudgetBoard.Service;

public class TransactionService(ILogger<ITransactionService> logger, UserDataContext userDataContext, UserManager<ApplicationUser> userManager) : ITransactionService
{
    private readonly ILogger<ITransactionService> _logger = logger;
    private readonly UserDataContext _userDataContext = userDataContext;
    private readonly UserManager<ApplicationUser> _userManager = userManager;

    public async Task<IApplicationUser> GetUserData(ClaimsPrincipal user)
    {
        var userData = await GetCurrentUserAsync(_userManager.GetUserId(user) ?? string.Empty);
        if (userData == null)
        {
            _logger.LogError("Attempt to access authorized content by unauthorized user.");
            throw new Exception("You are not authorized to access this content.");
        }

        return userData;
    }
    public async Task CreateTransactionAsync(IApplicationUser userData, ITransactionCreateRequest transaction)
    {
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

    public IEnumerable<ITransactionResponse> ReadTransactionsAsync(IApplicationUser userData, int? year, int? month, bool getHidden, Guid guid = default)
    {
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

    public async Task UpdateTransactionAsync(IApplicationUser userData, ITransactionUpdateRequest editedTransaction)
    {
        var transaction = userData.Accounts
            .SelectMany(t => t.Transactions)
            .First(t => t.ID == editedTransaction.ID);
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

    public async Task DeleteTransactionAsync(IApplicationUser userData, Guid guid)
    {
        var transaction = userData.Accounts
            .SelectMany(t => t.Transactions)
            .First(t => t.ID == guid);
        if (transaction == null)
        {
            _logger.LogError("Attempt to delete transaction that does not exist.");
            throw new Exception("The transaction you are trying to delete does not exist.");
        }

        transaction.Deleted = DateTime.Now.ToUniversalTime();
        await _userDataContext.SaveChangesAsync();
    }

    public async Task RestoreTransactionAsync(IApplicationUser userData, Guid guid)
    {
        var transaction = userData.Accounts
            .SelectMany(t => t.Transactions)
            .First(t => t.ID == guid);
        if (transaction == null)
        {
            _logger.LogError("Attempt to restore transaction that does not exist.");
            throw new Exception("The transaction you are trying to restore does not exist.");
        }

        transaction.Deleted = null;
        await _userDataContext.SaveChangesAsync();
    }

    private async Task<ApplicationUser?> GetCurrentUserAsync(string id)
    {
        try
        {
            var users = await _userDataContext.ApplicationUsers
                .Include(u => u.Accounts)
                .ThenInclude(a => a.Transactions)
                .AsSplitQuery()
                .ToListAsync();
            return users.Single(u => u.Id == new Guid(id));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            return null;
        }
    }
}
