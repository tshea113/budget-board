using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using BudgetBoard.Service.Interfaces;
using BudgetBoard.Service.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace BudgetBoard.Service;

public class BudgetService(ILogger<IBudgetService> logger, UserDataContext userDataContext, UserManager<ApplicationUser> userManager) : IBudgetService
{
    private readonly ILogger<IBudgetService> _logger = logger;
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
    public async Task CreateBudgetsAsync(IApplicationUser userData, IEnumerable<IBudgetCreateRequest> budgets)
    {
        foreach (var budget in budgets)
        {
            // Do not allow duplicate categories in a given month
            if (userData.Budgets.Any((b) =>
            b.Date.Month == budget.Date.Month
            && b.Date.Year == budget.Date.Year
            && b.Category.Equals(budget.Category, StringComparison.CurrentCultureIgnoreCase)))
            {
                _logger.LogError("Attempt to create duplicate budget category.");
                throw new Exception("Budget category already exists for this month!");
            }

            Budget newBudget = new()
            {
                Date = budget.Date,
                Category = budget.Category,
                Limit = budget.Limit,
                UserID = userData.Id
            };

            userData.Budgets.Add(newBudget);
        }

        await _userDataContext.SaveChangesAsync();
    }

    public IEnumerable<IBudgetResponse> ReadBudgetsAsync(IApplicationUser userData, DateTime date)
    {
        var budgets = userData.Budgets
        .Where(b => b.Date.Month == date.Month && b.Date.Year == date.Year);

        return budgets.Select(b => new BudgetResponse(b));
    }

    public async Task UpdateBudgetAsync(IApplicationUser userData, IBudgetUpdateRequest updatedBudget)
    {
        var budget = userData.Budgets.SingleOrDefault(b => b.ID == updatedBudget.ID);
        if (budget == null)
        {
            _logger.LogError("Attempt to update budget that does not exist.");
            throw new Exception("The budget you are trying to update does not exist.");
        }

        budget.Limit = updatedBudget.Limit;

        await _userDataContext.SaveChangesAsync();
    }

    public async Task DeleteBudgetAsync(IApplicationUser userData, Guid guid)
    {
        var budget = userData.Budgets.SingleOrDefault(b => b.ID == guid);
        if (budget == null)
        {
            _logger.LogError("Attempt to update budget that does not exist.");
            throw new Exception("The budget you are trying to update does not exist.");
        }

        _userDataContext.Budgets.Remove(budget);
        await _userDataContext.SaveChangesAsync();
    }

    private async Task<ApplicationUser?> GetCurrentUserAsync(string id)
    {
        try
        {
            var users = await _userDataContext.Users
                .Include(u => u.Budgets)
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
