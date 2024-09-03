using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using BudgetBoard.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BudgetBoard.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly UserDataContext _userDataContext;
    private UserManager<ApplicationUser> _userManager;

    public AccountController(UserDataContext context, UserManager<ApplicationUser> userManager)
    {
        _userDataContext = context;
        _userManager = userManager;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Get()
    {
        var user = await GetCurrentUser(_userManager.GetUserId(User) ?? string.Empty);

        if (user == null)
        {
            return NotFound();
        }

        return Ok(user.Accounts.Select(a => new AccountResponse(a)));
    }

    [HttpGet("{guid}")]
    [Authorize]
    public async Task<IActionResult> Get(Guid guid)
    {
        var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);

        if (user == null)
        {
            return NotFound();
        }

        var account = user.Accounts.First(a => a.ID == guid);

        return Ok(new AccountResponse(account));
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Add([FromBody] Account account)
    {
        try
        {
            var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);

            if (user == null)
            {
                return NotFound();
            }

            user.Accounts.Add(account);
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
    public async Task<IActionResult> Delete(Guid guid, bool deleteTransactions = false)
    {
        try
        {
            var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);

            if (user == null)
            {
                return NotFound();
            }

            var account = user.Accounts.Single(a => a.ID == guid);

            if (account == null) return NotFound();

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
            return BadRequest(ex.Message);
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

            if (user == null)
            {
                return NotFound();
            }

            var account = user.Accounts.Single(a => a.ID == guid);

            if (account == null) return NotFound();

            account.Deleted = null;

            await _userDataContext.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut]
    [Authorize]
    public async Task<IActionResult> Edit([FromBody] Account newAccount)
    {
        try
        {
            var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);

            if (user == null)
            {
                return NotFound();
            }

            Account? account = user.Accounts.Single(a => a.ID == newAccount.ID);
            if (account == null)
            {
                return NotFound();
            }

            account.Name = newAccount.Name;
            account.Institution = newAccount.Institution;
            account.Type = newAccount.Type;
            account.Subtype = newAccount.Subtype;
            account.HideTransactions = newAccount.HideTransactions;
            account.HideAccount = newAccount.HideAccount;

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
                .Include(u => u.Accounts)
                .ThenInclude(a => a.Transactions)
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
