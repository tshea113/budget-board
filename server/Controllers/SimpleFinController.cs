using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using BudgetBoard.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BudgetBoard.Controllers;

[Route("api/[controller]/[action]")]
[ApiController]
public class SimpleFinController : Controller
{
    private const long UnixMonth = 2629743;
    private const long UnixWeek = 604800;

    private readonly UserDataContext _userDataContext;
    private SimpleFinHandler _simpleFinHandler;

    public SimpleFinController(UserDataContext context, IHttpClientFactory clientFactory)
    {
        _userDataContext = context;
        _simpleFinHandler = new SimpleFinHandler(_userDataContext, clientFactory);
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Sync()
    {
        var user = GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
        if (user == null)
        {
            return NotFound();
        }

        long startDate;
        if (user.LastSync == DateTime.MinValue)
        {
            // If we haven't synced before, sync the full 90 days of history
            startDate = ((DateTimeOffset)DateTime.UtcNow).ToUnixTimeSeconds() - (UnixMonth * 3);
        }
        else
        {
            var oneMonthAgo = ((DateTimeOffset)DateTime.UtcNow).ToUnixTimeSeconds() - UnixMonth;
            var lastSyncWithBuffer = ((DateTimeOffset)user.LastSync).ToUnixTimeSeconds() - UnixWeek;

            startDate = Math.Min(oneMonthAgo, lastSyncWithBuffer);
        }

        var simpleFinData = await _simpleFinHandler.GetAccountData(user.AccessToken, startDate);

        if (simpleFinData == null)
        {
            return NotFound();
        }

        _simpleFinHandler.SyncAccounts(user, simpleFinData.Accounts);
        _simpleFinHandler.SyncTransactions(user, simpleFinData.Accounts);

        UserHandler.UpdateLastSync(user, _userDataContext);

        return Ok(simpleFinData.Errors);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> UpdateToken(string newToken)
    {
        var user = GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);

        if (user == null)
        {
            return NotFound();
        }

        var response = default(HttpResponseMessage);
        try
        {
            response = await _simpleFinHandler.GetAccessToken(newToken);
            if (response.IsSuccessStatusCode)
            {
                user.AccessToken = await response.Content.ReadAsStringAsync();
            }
            else
            {
                return BadRequest("There was an error validating the setup token.");
            }
        }
        catch
        {
            return BadRequest("There was an error accessing SimpleFin.");
        }

        await _userDataContext.SaveChangesAsync();

        return Ok();

    }

    private ApplicationUser? GetCurrentUser(string id)
    {
        try
        {
            var users = _userDataContext.Users
                .Include(user => user.Accounts)
                .ThenInclude(a => a.Transactions)
                .AsSplitQuery()
                .ToList();
            var user = users.Single(u => u.Id == new Guid(id));

            return user;
        }
        catch (Exception)
        {
            return null;
        }
    }
}
