using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
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
        var user = await GetCurrentUser(User.Claims.Single(c => c.Type == "id").Value);

        if (user == null)
        {
            return NotFound();
        }

        return Ok(user.Goals);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Add([FromBody] Goal goal)
    {
        try
        {
            var user = await GetCurrentUser(User.Claims.Single(c => c.Type == "id").Value);

            if (user == null)
            {
                return NotFound();
            }

            float runningBalance = 0.0f;
            foreach (var account in goal.Accounts)
            {
                if (user.Accounts.Contains(account))
                {
                    runningBalance += account.CurrentBalance;
                }
            }

            goal.InitialAmount = runningBalance;

            user.Goals.Add(goal);

            var category = new Category
            {
                ID = new Guid(),
                Label = goal.Name,
                Value = goal.Name.ToLower(),
                Parent = "goals",
                UserID = user.ID,
            };

            user.Categories.Add(category);
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
            var user = await GetCurrentUser(User.Claims.Single(c => c.Type == "id").Value);

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

    private async Task<User?> GetCurrentUser(string uid)
    {
        try
        {
            var users = await _userDataContext.Users
                .Include(u => u.Goals)
                .Include(u => u.Accounts)
                .ToListAsync();
            var user = users.Single(u => u.Uid == uid);

            return user;
        }
        catch (Exception)
        {
            return null;
        }
    }
}
