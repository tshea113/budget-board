using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using BudgetBoard.Models;
using BudgetBoard.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BudgetBoard.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TransactionController : ControllerBase
{
    private readonly ILogger<TransactionController> _logger;

    private readonly UserDataContext _userDataContext;

    public TransactionController(UserDataContext context, ILogger<TransactionController> logger)
    {
        _userDataContext = context;
        _logger = logger;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Get(bool getHidden = false, DateTime? date = null)
    {

        try
        {
            var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
            if (user == null) return Unauthorized("You are not authorized to access this content.");

            var transactions = user.Accounts
                .SelectMany(t => t.Transactions)
                .Where(t => getHidden || !(t.Account?.HideTransactions ?? false));

            if (date != null)
            {
                transactions = transactions.Where(t => t.Date.Month == date?.Month && t.Date.Year == date?.Year);
            }

            return Ok(transactions.Select(t => new TransactionResponse(t)));
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
            ApplicationUser? user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
            if (user == null) return Unauthorized("You are not authorized to access this content.");

            Transaction transaction = user.Accounts
                .SelectMany(a => a.Transactions)
                .First(t => t.ID == guid);
            if (transaction == null) return NotFound();

            return Ok(new TransactionResponse(transaction));
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Add([FromBody] Transaction transaction)
    {
        try
        {
            ApplicationUser? user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
            if (user == null) return Unauthorized("You are not authorized to access this content.");

            Account? account = await _userDataContext.Accounts.FindAsync(transaction.AccountID);
            if (account == null) return NotFound();

            account.Transactions.Add(transaction);
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
    public async Task<IActionResult> Delete(Guid guid)
    {
        try
        {
            var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
            if (user == null) return Unauthorized("You are not authorized to access this content.");

            var transaction = user.Accounts
            .SelectMany(t => t.Transactions)
            .First(t => t.ID == guid);
            if (transaction == null) return NotFound();

            transaction.Deleted = DateTime.Now.ToUniversalTime();
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

            var transaction = user.Accounts
            .SelectMany(t => t.Transactions)
            .First(t => t.ID == guid);
            if (transaction == null) return NotFound();

            transaction.Deleted = null;

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
    public async Task<IActionResult> Edit([FromBody] Transaction newTransaction)
    {
        try
        {
            var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
            if (user == null) return Unauthorized("You are not authorized to access this content.");

            Transaction? transaction = await _userDataContext.Transactions.FindAsync(newTransaction.ID);
            if (transaction == null) return NotFound();

            if (user.Accounts.Single(a => a.ID == transaction.AccountID) == null) return BadRequest();

            transaction.Amount = newTransaction.Amount;
            transaction.Date = newTransaction.Date;
            transaction.Category = newTransaction.Category;
            transaction.Subcategory = newTransaction.Subcategory;
            transaction.MerchantName = newTransaction.MerchantName;
            transaction.Pending = newTransaction.Pending;
            transaction.Source = newTransaction.Source;

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
