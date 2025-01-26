using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using BudgetBoard.Service.Interfaces;
using BudgetBoard.Service.Types;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace BudgetBoard.Service;

public class AccountService(ILogger<AccountService> logger, UserDataContext userDataContext, UserManager<ApplicationUser> userManager) : IAccountService
{
    private readonly ILogger<AccountService> _logger = logger;
    private readonly UserDataContext _userDataContext = userDataContext;
    private readonly UserManager<ApplicationUser> _userManager = userManager;

    public async Task<IEnumerable<AccountResponse>> GetAccountsAsync(ClaimsPrincipal user, Guid guid = default)
    {
        var userData = await GetCurrentUserAsync(_userManager.GetUserId(user) ?? string.Empty);
        if (userData == null)
        {
            _logger.LogError("Attempt to access authorized content by unauthorized user.");
            throw new Exception("You are not authorized to access this content.");
        }

        if (guid != default)
        {
            var accountId = new Guid();
            if (!Guid.TryParse(guid.ToString(), out accountId))
            {
                _logger.LogError("Attempt to access account with invalid ID.");
                throw new Exception("The account ID you are trying to access is invalid.");
            }

            var account = userData.Accounts.FirstOrDefault(a => a.ID == accountId);
            if (account == null)
            {
                _logger.LogError("Attempt to access account that does not exist.");
                throw new Exception("The account you are trying to access does not exist.");
            }

            return [new AccountResponse(account)];
        }

        return userData.Accounts.Select(a => new AccountResponse(a));
    }

    public async Task AddAccountAsync(ClaimsPrincipal user, AccountAddRequest account)
    {
        var userData = await GetCurrentUserAsync(_userManager.GetUserId(user) ?? string.Empty);
        if (userData == null)
        {
            _logger.LogError("Attempt to access authorized content by unauthorized user.");
            throw new Exception("You are not authorized to access this content.");
        }

        var newAccount = new Account
        {
            SyncID = account.SyncID,
            Name = account.Name,
            InstitutionID = account.InstitutionID,
            Type = account.Type,
            Subtype = account.Subtype,
            HideTransactions = account.HideTransactions,
            HideAccount = account.HideAccount,
            UserID = userData.Id
        };

        userData.Accounts.Add(newAccount);
        await _userDataContext.SaveChangesAsync();
    }

    public async Task DeleteAccountAsync(ClaimsPrincipal user, Guid guid, bool deleteTransactions = false)
    {
        var userData = await GetCurrentUserAsync(_userManager.GetUserId(user) ?? string.Empty);
        if (userData == null)
        {
            _logger.LogError("Attempt to access authorized content by unauthorized user.");
            throw new Exception("You are not authorized to access this content.");
        }

        var account = userData.Accounts.FirstOrDefault(a => a.ID == guid);
        if (account == null)
        {
            _logger.LogError("Attempt to delete account that does not exist.");
            throw new Exception("The account you are trying to delete does not exist.");
        }

        account.Deleted = DateTime.Now.ToUniversalTime();

        if (deleteTransactions)
        {
            foreach (var transaction in account.Transactions)
            {
                transaction.Deleted = DateTime.Now.ToUniversalTime();
            }
        }

        await _userDataContext.SaveChangesAsync();
    }

    public async Task RestoreAccountAsync(ClaimsPrincipal user, Guid guid)
    {
        var userData = await GetCurrentUserAsync(_userManager.GetUserId(user) ?? string.Empty);
        if (userData == null)
        {
            _logger.LogError("Attempt to access authorized content by unauthorized user.");
            throw new Exception("You are not authorized to access this content.");
        }

        var account = userData.Accounts.FirstOrDefault(a => a.ID == guid);
        if (account == null)
        {
            _logger.LogError("Attempt to restore account that does not exist.");
            throw new Exception("The account you are trying to restore does not exist.");
        }

        account.Deleted = null;
        await _userDataContext.SaveChangesAsync();
    }

    public async Task EditAccountAsync(ClaimsPrincipal user, AccountEditRequest editedAccount)
    {
        var userData = await GetCurrentUserAsync(_userManager.GetUserId(user) ?? string.Empty);
        if (userData == null)
        {
            _logger.LogError("Attempt to access authorized content by unauthorized user.");
            throw new Exception("You are not authorized to access this content.");
        }

        var account = userData.Accounts.FirstOrDefault(a => a.ID == editedAccount.ID);
        if (account == null)
        {
            _logger.LogError("Attempt to edit account that does not exist.");
            throw new Exception("The account you are trying to edit does not exist.");
        }

        account.Name = editedAccount.Name;
        account.Type = editedAccount.Type;
        account.Subtype = editedAccount.Subtype;
        account.HideTransactions = editedAccount.HideTransactions;
        account.HideAccount = editedAccount.HideAccount;

        await _userDataContext.SaveChangesAsync();
    }

    public async Task SetIndicesAsync(ClaimsPrincipal user, IEnumerable<AccountIndexRequest> orderedAccounts)
    {
        var userData = await GetCurrentUserAsync(_userManager.GetUserId(user) ?? string.Empty);
        if (userData == null)
        {
            _logger.LogError("Attempt to access authorized content by unauthorized user.");
            throw new Exception("You are not authorized to access this content.");
        }

        foreach (var orderedAccount in orderedAccounts)
        {
            var account = userData.Accounts.FirstOrDefault(a => a.ID == orderedAccount.ID);
            if (account == null)
            {
                _logger.LogError("Attempt to set index for account that does not exist.");
                throw new Exception("The account you are trying to set the index for does not exist.");
            }

            account.Index = orderedAccount.Index;
        }

        await _userDataContext.SaveChangesAsync();
    }

    private async Task<ApplicationUser?> GetCurrentUserAsync(string id)
    {
        try
        {
            var users = await _userDataContext.Users
                .Include(u => u.Accounts)
                .ThenInclude(a => a.Transactions)
                .Include(u => u.Accounts)
                .ThenInclude(a => a.Balances)
                .AsSplitQuery()
                .ToListAsync();
            var user = users.Single(u => u.Id == new Guid(id));

            return user;
        }
        catch (Exception ex)
        {
            _logger.LogError("An error occurred while retrieving the user data: {ExceptionMessage}", ex.Message);
            return null;
        }
    }
}
