using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using BudgetBoard.Service.Interfaces;
using BudgetBoard.Service.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace BudgetBoard.Service;

public class TransactionCategoryService(ILogger<ITransactionCategoryService> logger, UserDataContext userDataContext, UserManager<ApplicationUser> userManager) : ITransactionCategoryService
{
    private readonly ILogger<ITransactionCategoryService> _logger = logger;
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
    public async Task CreateTransactionCategoryAsync(IApplicationUser userData, ICategoryCreateRequest request)
    {
        var newCategory = new Category
        {
            Value = request.Value,
            Parent = request.Parent,
            UserID = userData.Id
        };

        userData.TransactionCategories.Add(newCategory);
        await _userDataContext.SaveChangesAsync();
    }

    public IEnumerable<ICategoryResponse> ReadTransactionCategoriesAsync(IApplicationUser userData, Guid guid = default)
    {
        if (guid != default)
        {
            var transactionCategory = userData.TransactionCategories.FirstOrDefault(t => t.ID == guid);
            if (transactionCategory == null)
            {
                _logger.LogError("Attempt to access transaction that does not exist.");
                throw new Exception("The transaction you are trying to access does not exist.");
            }

            return [new CategoryResponse(transactionCategory)];
        }

        return userData.TransactionCategories.Select(c => new CategoryResponse(c));
    }

    public async Task UpdateTransactionCategoryAsync(IApplicationUser userData, ICategoryUpdateRequest updatedCategory)
    {
        var transactionCategory = userData.TransactionCategories.FirstOrDefault(t => t.ID == updatedCategory.ID);
        if (transactionCategory == null)
        {
            _logger.LogError("Attempt to access transaction category that does not exist.");
            throw new Exception("The transaction category you are trying to access does not exist.");
        }

        transactionCategory.Value = updatedCategory.Value;
        transactionCategory.Parent = updatedCategory.Parent;

        await _userDataContext.SaveChangesAsync();
    }

    public async Task DeleteTransactionCategoryAsync(IApplicationUser userData, Guid guid)
    {
        var transactionCategory = userData.TransactionCategories.FirstOrDefault(t => t.ID == guid);
        if (transactionCategory == null)
        {
            _logger.LogError("Attempt to access transaction category that does not exist.");
            throw new Exception("The transaction category you are trying to access does not exist.");
        }

        // We want to preserve the category in the database if it is in use. 
        var transactionsForUser = userData.Accounts.SelectMany(a => a.Transactions);
        if (
            transactionsForUser.Any(
                t => (t.Category ?? string.Empty).Equals(transactionCategory.Value,
                    StringComparison.OrdinalIgnoreCase) ||
                (t.Subcategory ?? string.Empty).Equals(transactionCategory.Value,
                    StringComparison.OrdinalIgnoreCase))
            )
        {
            _logger.LogError("Attempt to delete transaction category that is in use by transaction(s).");
            throw new Exception("Category is in use by transaction(s) and cannot be deleted.");
        }
        else if (userData.Budgets.Any(b => b.Category == transactionCategory.Value))
        {
            _logger.LogError("Attempt to delete transaction category that is in use by budget(s).");
            throw new Exception("Category is in use by budget(s) and cannot be deleted.");
        }
        else
        {
            userData.TransactionCategories.Remove(transactionCategory);
            await _userDataContext.SaveChangesAsync();
        }
    }

    private async Task<ApplicationUser?> GetCurrentUserAsync(string id)
    {
        try
        {
            var users = await _userDataContext.ApplicationUsers
                .Include(u => u.TransactionCategories)
                .Include(u => u.Accounts)
                    .ThenInclude(a => a.Transactions)
                .Include(u => u.Budgets)
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
