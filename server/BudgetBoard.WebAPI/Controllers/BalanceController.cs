using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using BudgetBoard.WebAPI.Models;
using BudgetBoard.WebAPI.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BudgetBoard.WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BalanceController(UserDataContext context, UserManager<ApplicationUser> userManager, ILogger<BalanceController> logger) : ControllerBase
{
    private readonly ILogger<BalanceController> _logger = logger;

    private readonly UserDataContext _userDataContext = context;
    private readonly UserManager<ApplicationUser> _userManager = userManager;

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Get(Guid accountId)
    {
        try
        {
            var user = await GetCurrentUser(_userManager.GetUserId(User) ?? string.Empty);
            if (user == null) return Unauthorized("You are not authorized to access this content.");

            var account = user.Accounts.FirstOrDefault(a => a.ID == accountId);
            if (account == null)
            {
                return NotFound("Account not found.");
            }

            return Ok(account.Balances.Select(b => new BalanceResponse(b)));
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
