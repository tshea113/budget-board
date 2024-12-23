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
public class GoalController : ControllerBase
{
    private readonly ILogger<CategoryController> _logger;

    private readonly UserDataContext _userDataContext;

    public GoalController(UserDataContext context, ILogger<CategoryController> logger)
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

            return Ok(user.Goals.Select(g => new GoalResponse(g)));
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Add([FromBody] NewGoal newGoal)
    {
        try
        {
            var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
            if (user == null) return Unauthorized("You are not authorized to access this content.");

            decimal runningBalance = 0.0M;
            var accounts = new List<Account>();
            foreach (var accountId in newGoal.AccountIds)
            {
                var account = user.Accounts.FirstOrDefault((a) => a.ID == new Guid(accountId));
                if (account != null)
                {
                    runningBalance += account.Balances.OrderByDescending(b => b.DateTime).FirstOrDefault()?.Amount ?? 0;
                    accounts.Add(account);
                }

            }

            var goal = new Goal
            {
                Name = newGoal.Name,
                CompleteDate = newGoal.CompleteDate,
                Amount = newGoal.Amount,
                MonthlyContribution = newGoal.MonthlyContribution,
                Accounts = accounts,
                UserID = user.Id,
            };

            if (newGoal.InitialAmount == null)
            {
                // The frontend will set the initial balance if we don't want to include existing balances
                // in the goal.
                goal.InitialAmount = runningBalance;
            }
            else
            {
                goal.InitialAmount = newGoal.InitialAmount;
            }

            user.Goals.Add(goal);
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
    public async Task<IActionResult> Edit([FromBody] Goal newGoal)
    {
        try
        {
            var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
            if (user == null) return Unauthorized("You are not authorized to access this content.");

            Goal? goal = await _userDataContext.Goals.FindAsync(newGoal.ID);
            if (goal == null) return NotFound();

            goal.Name = newGoal.Name;
            goal.Amount = newGoal.Amount;
            goal.CompleteDate = newGoal.CompleteDate;
            goal.MonthlyContribution = newGoal.MonthlyContribution;

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

            var goal = user.Goals.Single(g => g.ID == guid);
            if (goal == null) return NotFound();

            _userDataContext.Entry(goal).State = EntityState.Deleted;
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
                .Include(u => u.Goals)
                .ThenInclude((g) => g.Accounts)
                .ThenInclude((a) => a.Transactions)
                .Include(u => u.Accounts)
                .ThenInclude(a => a.Balances)
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
