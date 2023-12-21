using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoneyMinder.Database.Data;
using MoneyMinder.Database.Models;

namespace MoneyMinder.Controllers;

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
        try
        {
            string uid = User.Claims.Single(c => c.Type == "id").Value;
            var users = await _userDataContext.Users.Include(user => user.Accounts).ToListAsync();
            var user = users.First(u => u.Uid == uid);

            return Ok(user.Accounts);
        }
        catch (InvalidOperationException invalidEx)
        {
            return NotFound(invalidEx.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("{guid}")]
    [Authorize]
    public async Task<IActionResult> Get(Guid guid)
    {
        try
        {
            string uid = User.Claims.Single(c => c.Type == "id").Value;
            var users = await _userDataContext.Users.Include(user => user.Accounts).ToListAsync();
            var user = users.First(u => u.Uid == uid);

            var accounts = user.Accounts.First<Account>(a => a.ID == guid);

            return Ok(accounts);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost]
    [Authorize]
    public IActionResult Add([FromBody] Account account)
    {
        try
        {
            string uid = User.Claims.Single(c => c.Type == "id").Value;
            User? user = _userDataContext.Users.Single(u => u.Uid == uid);
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

    [HttpDelete("{guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid guid)
    {
        Account? account = await _userDataContext.Accounts.FindAsync(guid);
        if (account == null)
        {
            return NotFound();
        }

        try
        {
            _userDataContext.Accounts.Remove(account);
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
        Account? account = await _userDataContext.Accounts.FindAsync(newAccount.ID);
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
}
