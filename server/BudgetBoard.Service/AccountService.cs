using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace BudgetBoard.Service;

public class AccountService(ILogger<AccountService> logger, UserDataContext userDataContext, UserManager<ApplicationUser> userManager)
{
    private readonly ILogger<AccountService> _logger = logger;
    private readonly UserDataContext _userDataContext = userDataContext;
    private readonly UserManager<ApplicationUser> _userManager = userManager;

    public async Task<ICollection<Account>> GetAccounts(ClaimsPrincipal user, Guid guid = default)
    {
        var userData = await GetCurrentUser(_userManager.GetUserId(user) ?? string.Empty);
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

            return [account];
        }

        return userData.Accounts;
    }

    private async Task<ApplicationUser?> GetCurrentUser(string id)
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
