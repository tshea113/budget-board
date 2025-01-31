using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using BudgetBoard.Service.Interfaces;
using BudgetBoard.Service.Types;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace BudgetBoard.Service;

public class AccountService(ILogger<IAccountService> logger, UserDataContext userDataContext, UserManager<ApplicationUser> userManager) : IAccountService
{
    private readonly ILogger<IAccountService> _logger = logger;
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

    public async Task CreateAccountAsync(IApplicationUser userData, IAccountCreateRequest account)
    {
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

    public IEnumerable<IAccountResponse> ReadAccountsAsync(IApplicationUser userData, Guid guid = default)
    {
        if (guid != default)
        {
            var account = userData.Accounts.FirstOrDefault(a => a.ID == guid);
            if (account == null)
            {
                _logger.LogError("Attempt to access account that does not exist.");
                throw new Exception("The account you are trying to access does not exist.");
            }

            return [new AccountResponse(account)];
        }

        return userData.Accounts.Select(a => new AccountResponse(a));
    }

    public async Task UpdateAccountAsync(IApplicationUser userData, IAccountUpdateRequest editedAccount)
    {
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

    public async Task DeleteAccountAsync(IApplicationUser userData, Guid guid, bool deleteTransactions = false)
    {
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

    public async Task RestoreAccountAsync(IApplicationUser userData, Guid guid)
    {
        var account = userData.Accounts.FirstOrDefault(a => a.ID == guid);
        if (account == null)
        {
            _logger.LogError("Attempt to restore account that does not exist.");
            throw new Exception("The account you are trying to restore does not exist.");
        }

        account.Deleted = null;
        await _userDataContext.SaveChangesAsync();
    }

    public async Task OrderAccountsAsync(IApplicationUser userData, IEnumerable<IAccountIndexRequest> orderedAccounts)
    {
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
            return users.Single(u => u.Id == new Guid(id));
        }
        catch (Exception ex)
        {
            _logger.LogError("An error occurred while retrieving the user data: {ExceptionMessage}", ex.Message);
            return null;
        }
    }
}
