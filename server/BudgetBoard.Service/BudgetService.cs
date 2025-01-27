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

    public async Task CreateBudgetsAsync(ClaimsPrincipal user, IEnumerable<IBudgetCreateRequest> budgets)
    {
        var userData = await GetCurrentUserAsync(_userManager.GetUserId(user) ?? string.Empty);
        if (userData == null)
        {
            _logger.LogError("Attempt to access authorized content by unauthorized user.");
            throw new Exception("You are not authorized to access this content.");
        }

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

    public async Task<IEnumerable<IBudgetResponse>> ReadBudgetsAsync(ClaimsPrincipal user, DateTime date)
    {
        var userData = await GetCurrentUserAsync(_userManager.GetUserId(user) ?? string.Empty);
        if (userData == null)
        {
            _logger.LogError("Attempt to access authorized content by unauthorized user.");
            throw new Exception("You are not authorized to access this content.");
        }

        var budgets = userData.Budgets
        .Where(b => b.Date.Month == date.Month && b.Date.Year == date.Year);

        return budgets.Select(b => new BudgetResponse(b));
    }

    public async Task UpdateBudgetAsync(ClaimsPrincipal user, IBudgetUpdateRequest updatedBudget)
    {
        var userData = await GetCurrentUserAsync(_userManager.GetUserId(user) ?? string.Empty);
        if (userData == null)
        {
            _logger.LogError("Attempt to access authorized content by unauthorized user.");
            throw new Exception("You are not authorized to access this content.");
        }

        var budget = userData.Budgets.SingleOrDefault(b => b.ID == updatedBudget.ID);
        if (budget == null)
        {
            _logger.LogError("Attempt to update budget that does not exist.");
            throw new Exception("The budget you are trying to update does not exist.");
        }

        budget.Limit = updatedBudget.Limit;

        await _userDataContext.SaveChangesAsync();
    }

    public async Task DeleteBudgetAsync(ClaimsPrincipal user, Guid guid)
    {
        var userData = await GetCurrentUserAsync(_userManager.GetUserId(user) ?? string.Empty);
        if (userData == null)
        {
            _logger.LogError("Attempt to access authorized content by unauthorized user.");
            throw new Exception("You are not authorized to access this content.");
        }

        var budgetID = new Guid();
        if (!Guid.TryParse(guid.ToString(), out budgetID))
        {
            _logger.LogError("Attempt to delete budget with invalid ID.");
            throw new Exception("The budget ID you are trying to delete is invalid.");
        }

        var budget = userData.Budgets.SingleOrDefault(b => b.ID == budgetID);
        if (budget == null)
        {
            _logger.LogError("Attempt to update budget that does not exist.");
            throw new Exception("The budget you are trying to update does not exist.");
        }

        _userDataContext.Entry(budget).State = EntityState.Deleted;
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
