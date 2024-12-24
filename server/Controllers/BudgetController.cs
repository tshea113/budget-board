using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using BudgetBoard.Models;
using BudgetBoard.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BudgetBoard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BudgetController : ControllerBase
    {
        private readonly ILogger<BudgetController> _logger;

        private readonly UserDataContext _userDataContext;

        public BudgetController(UserDataContext context, ILogger<BudgetController> logger)
        {
            _userDataContext = context;
            _logger = logger;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> Get(DateTime date)
        {
            try
            {
                var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
                if (user == null) return Unauthorized("You are not authorized to access this content.");

                var budgets = user.Budgets
                    .Where(b => b.Date.Month == date.Month && b.Date.Year == date.Year);

                return Ok(budgets.Select(b => new BudgetResponse(b)));
            }
            catch (Exception ex)
            {
                return Helpers.BuildErrorResponse(_logger, ex.Message);
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Add([FromBody] AddBudgetRequest budget)
        {
            try
            {
                var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
                if (user == null) return Unauthorized("You are not authorized to access this content.");

                // Do not allow duplicate categories in a given month
                if (user.Budgets.Any((b) =>
                    b.Date.Month == budget.Date.Month
                    && b.Date.Year == budget.Date.Year
                    && b.Category == budget.Category))
                {
                    return BadRequest("Budget category already exists for this month!");
                }

                Budget newBudget = new()
                {
                    Date = budget.Date,
                    Category = budget.Category,
                    Limit = budget.Limit,
                    UserID = user.Id
                };

                user.Budgets.Add(newBudget);
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
        [ActionName("AddMultiple")]
        [Route("[action]")]
        public async Task<IActionResult> Add([FromBody] AddBudgetRequest[] budgets)
        {
            try
            {
                var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
                if (user == null) return Unauthorized("You are not authorized to access this content.");

                foreach (AddBudgetRequest budget in budgets)
                {
                    // Do not allow duplicate categories in a given month
                    if (user.Budgets.Any((b) =>
                        b.Date.Month == budget.Date.Month
                        && b.Date.Year == budget.Date.Year
                        && b.Category == budget.Category))
                    {
                        continue;
                    }

                    Budget newBudget = new()
                    {
                        Date = budget.Date,
                        Category = budget.Category,
                        Limit = budget.Limit,
                        UserID = user.Id
                    };

                    user.Budgets.Add(newBudget);
                }

                await _userDataContext.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                return Helpers.BuildErrorResponse(_logger, ex.Message);
            }
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> Edit([FromBody] BudgetResponse editBudget)
        {
            try
            {
                var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
                if (user == null) return Unauthorized("You are not authorized to access this content.");

                Budget? budget = await _userDataContext.Budgets.FindAsync(editBudget.ID);
                if (budget == null) return NotFound();

                budget.Limit = editBudget.Limit;

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
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
                if (user == null) return Unauthorized("You are not authorized to access this content.");

                Budget? budget = await _userDataContext.Budgets.FindAsync(id);
                if (budget == null) return NotFound();

                _userDataContext.Entry(budget).State = EntityState.Deleted;
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
                    .Include(u => u.Budgets)
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
}
