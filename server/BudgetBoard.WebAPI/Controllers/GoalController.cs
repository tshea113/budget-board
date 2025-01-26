using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using BudgetBoard.WebAPI.Models;
using BudgetBoard.WebAPI.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BudgetBoard.WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class GoalController : ControllerBase
{
    private readonly ILogger<GoalController> _logger;

    private readonly UserDataContext _userDataContext;

    public GoalController(UserDataContext context, ILogger<GoalController> logger)
    {
        _userDataContext = context;
        _logger = logger;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Get(bool includeInterest = false)
    {
        try
        {
            var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
            if (user == null) return Unauthorized("You are not authorized to access this content.");

            var goalsResponse = new List<GoalResponse>();

            var goals = user.Goals.ToList();
            foreach (var goal in goals)
            {
                var goalResponse = new GoalResponse(goal)
                {
                    CompleteDate = GoalHelper.EstimateGoalCompleteDate(goal, includeInterest),
                    // Have to manually set this, since we override the CompleteDate in the constructor.
                    IsCompleteDateEditable = goal.CompleteDate != null,
                    MonthlyContribution = GoalHelper.EstimateGoalMonthlyContribution(goal, includeInterest),
                    // Have to manually set this, since we override the MonthlyContribution in the constructor.
                    IsMonthlyContributionEditable = goal.MonthlyContribution != null,
                    // This is a very shakey calculation, so only include it if requested.
                    // For now, we will just apply this to loans.
                    // The interest rate is estimated by month, so need to calculate the APR.
                    EstimatedInterestRate = (includeInterest && goal.Amount == 0) ? GoalHelper.EstimateInterestRate(goal) * 12 : null
                };

                goalsResponse.Add(goalResponse);
            }

            return Ok(goalsResponse);
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Add([FromBody] GoalRequest newGoal)
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

            if (!newGoal.InitialAmount.HasValue)
            {
                // The frontend will set the initial balance if we don't want to include existing balances
                // in the goal.
                goal.InitialAmount = runningBalance;
            }
            else
            {
                goal.InitialAmount = newGoal.InitialAmount!.Value;
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
    public async Task<IActionResult> Edit([FromBody] GoalResponse editedGoal)
    {
        try
        {
            var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
            if (user == null) return Unauthorized("You are not authorized to access this content.");

            Goal? goal = await _userDataContext.Goals.FindAsync(editedGoal.ID);
            if (goal == null) return NotFound();

            goal.Name = editedGoal.Name;
            goal.Amount = editedGoal.Amount;
            goal.CompleteDate = editedGoal.IsCompleteDateEditable ? editedGoal.CompleteDate : goal.CompleteDate;
            goal.MonthlyContribution = editedGoal.IsMonthlyContributionEditable ? editedGoal.MonthlyContribution : goal.MonthlyContribution;

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
