using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using BudgetBoard.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BudgetBoard.Controllers;

[Route("api/[controller]")]
[ApiController]
public class GoalController : ControllerBase
{
    private readonly UserDataContext _userDataContext;

    public GoalController(UserDataContext context)
    {
        _userDataContext = context;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Get()
    {
        var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);

        if (user == null)
        {
            return NotFound();
        }

        return Ok(user.Goals.Select(g => new GoalResponse(g)));
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Add([FromBody] NewGoal newGoal)
    {
        try
        {
            var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);

            if (user == null)
            {
                return NotFound();
            }

            float runningBalance = 0.0f;
            var accounts = new List<Account>();
            foreach (var accountId in newGoal.AccountIds)
            {
                var account = user.Accounts.FirstOrDefault((a) => a.ID == new Guid(accountId));
                if (account != null)
                {
                    runningBalance += account.CurrentBalance;
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
            _userDataContext.SaveChanges();

            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete]
    [Authorize]
    public async Task<IActionResult> Delete(Guid guid)
    {
        try
        {
            var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);

            if (user == null)
            {
                return NotFound();
            }

            var goal = user.Goals.Single(g => g.ID == guid);

            if (goal == null) return NotFound();

            _userDataContext.Entry(goal).State = EntityState.Deleted;
            await _userDataContext.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
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
                .AsSplitQuery()
                .ToListAsync();
            var user = users.Single(u => u.Id == new Guid(id));

            return user;
        }
        catch (Exception)
        {
            return null;
        }
    }
}
