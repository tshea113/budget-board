using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoneyMinder.Database.Data;
using MoneyMinder.Database.Models;

namespace MoneyMinder.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TransactionController : ControllerBase
{
    private readonly UserDataContext _userDataContext;

    public TransactionController(UserDataContext context)
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

        var transactions = user.Accounts.SelectMany(t => t.Transactions).ToList();

        return Ok(transactions);

    }

    [HttpGet("{guid}")]
    [Authorize]
    public async Task<IActionResult> Get(Guid guid)
    {
        try
        {
            User? user = await GetCurrentUser(User.Claims.Single(c => c.Type == "id").Value);

            if (user == null)
            {
                return NotFound();
            }

            Transaction transaction = user.Accounts
                .SelectMany(a => a.Transactions)
                .Single(t => t.ID == guid);

            return Ok(transaction);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Add([FromBody] Transaction transaction)
    {
        try
        {
            User? user = await GetCurrentUser(User.Claims.Single(c => c.Type == "id").Value);

            if (user == null)
            {
                return NotFound();
            }

            Account? account = await _userDataContext.Accounts.FindAsync(transaction.AccountID);
            if (account == null)
            {
                return NotFound();
            }

            account.Transactions.Add(transaction);
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
                .Include(u => u.Accounts)
                .ThenInclude(a => a.Transactions)
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
