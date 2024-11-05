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

    private readonly ILogger<SimpleFinController> _logger;

    private readonly UserDataContext _userDataContext;
    private SimpleFinHandler _simpleFinHandler;

    public SimpleFinController(UserDataContext context, IHttpClientFactory clientFactory, ILogger<SimpleFinController> logger)
    {
        _userDataContext = context;
        _simpleFinHandler = new SimpleFinHandler(_userDataContext, clientFactory);
        _logger = logger;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Sync()
    {
        try
        {
            var user = GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
            if (user == null) return Unauthorized("You are not authorized to access this content.");

            if (user.AccessToken == string.Empty)
            {
                return BadRequest("Access token has not been configured.");
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
            if (simpleFinData == null) return NotFound();

            await _simpleFinHandler.SyncAccountsAsync(user, simpleFinData.Accounts);
            await _simpleFinHandler.SyncTransactionsAsync(user, simpleFinData.Accounts);

            await UserHandler.UpdateLastSyncAsync(user, _userDataContext);

            return Ok(simpleFinData.Errors);
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> UpdateToken(string newToken)
    {
        try
        {
            var user = GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
            if (user == null) return Unauthorized("You are not authorized to access this content.");

            try
            {
                var response = await _simpleFinHandler.GetAccessToken(newToken);
                if (response.IsSuccessStatusCode)
                {
                    user.AccessToken = await response.Content.ReadAsStringAsync();
                    await _userDataContext.SaveChangesAsync();
                    return Ok();
                }
                else
                {
                    return BadRequest("There was an error validating the setup token.");
                }
            }
            catch (FormatException fe)
            {
                _logger.LogError(fe.Message);
                return BadRequest("Not a valid SimpleFin Token.");
            }
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
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
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            return null;
        }
    }
}
