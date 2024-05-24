﻿using BudgetBoard.Database.Data;
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
    public async Task<IActionResult> Add([FromBody] NewGoal newGoal)
    {
        try
        {
            var user = await GetCurrentUser(User.Claims.Single(c => c.Type == "id").Value);

            if (user == null)
            {
                return NotFound();
            }

            float runningBalance = 0.0f;
            var accounts = new List<Account>();
            foreach (var accountId in newGoal.AccountIds)
            {
                var account = user.Accounts.FirstOrDefault((a) => a.ID == new Guid(accountId));
                runningBalance += account?.CurrentBalance ?? 0;
                if (account != null) accounts.Add(account);
            }

            var goal = new Goal
            {
                Name = newGoal.Name,
                CompleteDate = DateTime.Now.ToUniversalTime(), // TODO: User should assign
                Amount = newGoal.Amount,
                InitialAmount = runningBalance,
                Accounts = accounts,
                UserID = user.ID,
            };

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
