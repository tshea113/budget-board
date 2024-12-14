using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using BudgetBoard.Models;
using BudgetBoard.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BudgetBoard.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly ILogger<AccountController> _logger;

    private readonly UserDataContext _userDataContext;
    private UserManager<ApplicationUser> _userManager;

    public AccountController(UserDataContext context, UserManager<ApplicationUser> userManager, ILogger<AccountController> logger)
    {
        _userDataContext = context;
        _userManager = userManager;
        _logger = logger;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Get()
    {
        try
        {
            var user = await GetCurrentUser(_userManager.GetUserId(User) ?? string.Empty);
            if (user == null) return Unauthorized("You are not authorized to access this content.");

            return Ok(user.Accounts.Select(a => new AccountResponse(a)));
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpGet("{guid}")]
    [Authorize]
    public async Task<IActionResult> Get(Guid guid)
    {
        try
        {
            var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
            if (user == null) return Unauthorized("You are not authorized to access this content.");

            var account = user.Accounts.First(a => a.ID == guid);
            if (account == null) return NotFound();

            return Ok(new AccountResponse(account));
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Add([FromBody] Account account)
    {
        try
        {
            var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
            if (user == null) return Unauthorized("You are not authorized to access this content.");

            user.Accounts.Add(account);
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
    public async Task<IActionResult> Delete(Guid guid, bool deleteTransactions = false)
    {
        try
        {
            var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
            if (user == null) return Unauthorized("You are not authorized to access this content.");

            var account = user.Accounts.Single(a => a.ID == guid);
            if (account == null) return Unauthorized("You are not authorized to access this content.");

            account.Deleted = DateTime.Now.ToUniversalTime();

            if (deleteTransactions)
            {
                foreach (var transaction in account.Transactions)
                {
                    transaction.Deleted = DateTime.Now.ToUniversalTime();
                }
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

            var account = user.Accounts.Single(a => a.ID == guid);
            if (account == null) return Unauthorized("You are not authorized to access this content.");

            account.Deleted = null;

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
    public async Task<IActionResult> Edit([FromBody] AccountEditRequest editedAccount)
    {
        try
        {
            var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
            if (user == null) return Unauthorized("You are not authorized to access this content.");

            Account? account = user.Accounts.Single(a => a.ID == editedAccount.ID);
            if (account == null) return Unauthorized("You are not authorized to access this content.");

            account.Name = editedAccount.Name;
            account.Type = editedAccount.Type;
            account.Subtype = editedAccount.Subtype;
            account.HideTransactions = editedAccount.HideTransactions;
            account.HideAccount = editedAccount.HideAccount;

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
    [Route("[action]")]
    public async Task<IActionResult> SetIndices([FromBody] List<AccountIndexRequest> accounts)
    {
        try
        {
            var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
            if (user == null) return Unauthorized("You are not authorized to access this content.");

            foreach (var account in accounts)
            {
                var acc = user.Accounts.Single(a => a.ID == account.ID);
                if (acc == null) return Unauthorized("You are not authorized to access this content.");

                acc.Index = account.Index;
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
                .Include(u => u.Accounts)
                .ThenInclude(a => a.Transactions)
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
