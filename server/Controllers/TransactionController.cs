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
        var user = await GetCurrentUser(User.Claims.Single(c => c.Type == "id").Value);

        if (user == null)
        {
            return NotFound();
        }

        Transaction? transaction = await _userDataContext.Transactions.FindAsync(guid);
        if (transaction == null)
        {
            return NotFound();
        }

        if (user.Accounts.Single(a => a.ID == transaction.AccountID) == null)
        {
            return BadRequest();
        }

        _userDataContext.Entry(transaction).State = EntityState.Deleted;
        await _userDataContext.SaveChangesAsync();

        return Ok();
    }

    [HttpPut]
    [Authorize]
    public async Task<IActionResult> Edit([FromBody] Transaction newTransaction)
    {
        var user = await GetCurrentUser(User.Claims.Single(c => c.Type == "id").Value);

        if (user == null)
        {
            return NotFound();
        }

        Transaction? transaction = await _userDataContext.Transactions.FindAsync(newTransaction.ID);
        if (transaction == null)
        {
            return NotFound();
        }

        if (user.Accounts.Single(a => a.ID == transaction.AccountID) == null)
        {
            return BadRequest();
        }

        transaction.Amount = newTransaction.Amount;
        transaction.Date = newTransaction.Date;
        transaction.Category = newTransaction.Category;
        transaction.SubCategory = newTransaction.SubCategory;
        transaction.MerchantName = newTransaction.MerchantName;
        transaction.Pending = newTransaction.Pending;
        transaction.Source = newTransaction.Source;

        await _userDataContext.SaveChangesAsync();

        return Ok();
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
