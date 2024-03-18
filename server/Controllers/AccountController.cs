using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BudgetBoard.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly UserDataContext _userDataContext;

    public AccountController(UserDataContext context)
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

        return Ok(user.Accounts);
    }

    [HttpGet("{guid}")]
    [Authorize]
    public async Task<IActionResult> Get(Guid guid)
    {
        var user = await GetCurrentUser(User.Claims.Single(c => c.Type == "id").Value);

        if (user == null)
        {
            return NotFound();
        }

        var account = user.Accounts.First<Account>(a => a.ID == guid);

        return Ok(account);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Add([FromBody] Account account)
    {
        try
        {
            var user = await GetCurrentUser(User.Claims.Single(c => c.Type == "id").Value);

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
    public async Task<IActionResult> Delete(Guid guid)
    {
        try
        {
            var user = await GetCurrentUser(User.Claims.Single(c => c.Type == "id").Value);

            if (user == null)
            {
                return NotFound();
            }

            Account? account = await _userDataContext.Accounts.FindAsync(guid);
            if (account == null)
            {
                return NotFound();
            }

            user.Accounts.Remove(account);
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
            var user = await GetCurrentUser(User.Claims.Single(c => c.Type == "id").Value);

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
            var users = await _userDataContext.Users.Include(user => user.Accounts).ToListAsync();
            var user = users.Single(u => u.Uid == uid);

            return user;
        }
        catch (Exception)
        {
            return null;
        }
    }
}
