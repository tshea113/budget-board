using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using BudgetBoard.Service.Interfaces;
using BudgetBoard.Service.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace BudgetBoard.Service;

public class BalanceService(ILogger<IBalanceService> logger, UserDataContext userDataContext, UserManager<ApplicationUser> userManager) : IBalanceService
{
    private readonly ILogger<IBalanceService> _logger = logger;
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

    public async Task CreateBalancesAsync(IApplicationUser userData, IBalanceCreateRequest balance)
    {
        var account = userData.Accounts.FirstOrDefault(a => a.ID == balance.AccountID);
        if (account == null)
        {
            _logger.LogError("Attempt to add balance to account that does not exist.");
            throw new Exception("The account you are trying to add a balance to does not exist.");
        }

        Balance newBalance = new()
        {
            DateTime = balance.DateTime,
            Amount = balance.Amount,
            AccountID = balance.AccountID,
        };

        account.Balances.Add(newBalance);
        await _userDataContext.SaveChangesAsync();
    }

    public IEnumerable<IBalanceResponse> ReadBalancesAsync(IApplicationUser userData, Guid accountId)
    {
        var account = userData.Accounts.FirstOrDefault(a => a.ID == accountId);
        if (account == null)
        {
            _logger.LogError("Attempt to read balance from account that does not exist.");
            throw new Exception("The account you are trying to read a balance from does not exist.");
        }

        return account.Balances.Select(b => new BalanceResponse(b));
    }

    public async Task UpdateBalanceAsync(IApplicationUser userData, IBalanceUpdateRequest updatedBalance)
    {
        var balance = userData.Accounts.SelectMany(a => a.Balances).FirstOrDefault(b => b.ID == updatedBalance.ID);
        if (balance == null)
        {
            _logger.LogError("Attempt to update balance that does not exist.");
            throw new Exception("The balance you are trying to update does not exist.");
        }

        balance.DateTime = updatedBalance.DateTime;
        balance.Amount = updatedBalance.Amount;

        await _userDataContext.SaveChangesAsync();
    }

    public async Task DeleteBalanceAsync(IApplicationUser userData, Guid balanceId)
    {
        var balance = userData.Accounts.SelectMany(a => a.Balances).FirstOrDefault(b => b.ID == balanceId);
        if (balance == null)
        {
            _logger.LogError("Attempt to delete balance that does not exist.");
            throw new Exception("The balance you are trying to delete does not exist.");
        }

        _userDataContext.Balances.Remove(balance);
        await _userDataContext.SaveChangesAsync();
    }

    private async Task<ApplicationUser?> GetCurrentUserAsync(string id)
    {
        try
        {
            var users = await _userDataContext.ApplicationUsers
                .Include(u => u.Accounts)
                .ThenInclude(a => a.Balances)
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
