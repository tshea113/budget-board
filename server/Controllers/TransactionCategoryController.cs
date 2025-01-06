using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using BudgetBoard.Models;
using BudgetBoard.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BudgetBoard.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TransactionCategoryController(UserDataContext context, ILogger<TransactionCategoryController> logger) : ControllerBase
{
    private readonly ILogger<TransactionCategoryController> _logger = logger;
    private readonly UserDataContext _userDataContext = context;

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Get()
    {
        try
        {
            var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
            if (user == null) return Unauthorized("You are not authorized to access this content.");

            return Ok(user.TransactionCategories.Select(c => new CategoryResponse(c)));
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Add([FromBody] AddCategoryRequest category)
    {
        try
        {
            var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
            if (user == null) return Unauthorized("You are not authorized to access this content.");

            if (user.TransactionCategories.Any(c => c.Value == category.Value))
            {
                return BadRequest("Category already exists.");
            }

            var newCategory = new Category
            {
                Value = category.Value,
                Parent = category.Parent,
                UserID = user.Id
            };

            user.TransactionCategories.Add(newCategory);
            await _userDataContext.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpDelete]
    [Authorize]
    public async Task<IActionResult> Delete(Guid guid)
    {
        try
        {
            var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
            if (user == null) return Unauthorized("You are not authorized to access this content.");

            var category = user.TransactionCategories.Single(a => a.ID == guid);
            if (category == null) return NotFound();

            if (user.TransactionCategories.Any(c => c.Parent == category.Value))
            {
                return BadRequest("Category has subcategories, you must delete the subcategories first.");
            }

            // We want to preserve the category in the database if it is in use. 
            var transactionsForUser = user.Accounts.SelectMany(a => a.Transactions);
            if (
                transactionsForUser.Any(
                    t => (t.Category ?? string.Empty).Equals(category.Value,
                        StringComparison.OrdinalIgnoreCase) ||
                    (t.Subcategory ?? string.Empty).Equals(category.Value,
                        StringComparison.OrdinalIgnoreCase)) ||
                user.Budgets.Any(b => b.Category == category.Value))
            {
                category.Deleted = true;
            }
            else
            {
                _userDataContext.Entry(category).State = EntityState.Deleted;
            }

            await _userDataContext.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpPost]
    [Authorize]
    [Route("[action]")]
    public async Task<IActionResult> Restore(Guid guid)
    {
        try
        {
            var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
            if (user == null) return Unauthorized("You are not authorized to access this content.");

            var category = user.TransactionCategories.Single(a => a.ID == guid);
            if (category == null) return NotFound();

            category.Deleted = false;

            await _userDataContext.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    private async Task<ApplicationUser?> GetCurrentUser(string id)
    {
        try
        {
            var users = await _userDataContext.Users
                .Include(u => u.TransactionCategories)
                .Include(u => u.Accounts)
                    .ThenInclude(a => a.Transactions)
                .Include(u => u.Budgets)
                .AsSplitQuery()
                .ToListAsync();
            var user = users.Single(u => u.Id == new Guid(id));

            return user;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            return null;
        }
    }
}
