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
public class CategoryController : ControllerBase
{
    private readonly ILogger<CategoryController> _logger;

    private readonly UserDataContext _userDataContext;

    public CategoryController(UserDataContext context, ILogger<CategoryController> logger)
    {
        _userDataContext = context;
        _logger = logger;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Get()
    {
        try
        {
            var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
            if (user == null) return Unauthorized("You are not authorized to access this content.");

            return Ok(user.Categories.Select(c => new CategoryResponse(c)));
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

            if (user.Categories.Any(c => c.Value == category.Value))
            {
                return BadRequest("Category already exists.");
            }

            var newCategory = new Category
            {
                Value = category.Value,
                Parent = category.Parent,
                UserID = user.Id
            };

            user.Categories.Add(newCategory);
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

            var category = user.Categories.Single(a => a.ID == guid);
            if (category == null) return NotFound();

            // We want to preserve the category in the database if it is in use. 
            var transactionsForUser = user.Accounts.SelectMany(a => a.Transactions);
            if (
                transactionsForUser.Any(
                    t => t.Category == category.Value ||
                    t.Subcategory == category.Value) ||
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

    private async Task<ApplicationUser?> GetCurrentUser(string id)
    {
        try
        {
            var users = await _userDataContext.Users
                .Include(u => u.Categories)
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
