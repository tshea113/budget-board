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
        var user = GetCurrentUser(User.Claims.Single(c => c.Type == "id").Value);
        if (user == null)
        {
            return NotFound();
        }
        var response = await _simpleFinHandler.GetAccountData(user.AccessToken);

        _simpleFinHandler.SyncAccounts(user, response!.Accounts);

        return Ok(response?.Accounts);

    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> UpdateToken(string newToken)
    {
        var user = GetCurrentUser(User.Claims.Single(c => c.Type == "id").Value);

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

    private User? GetCurrentUser(string uid)
    {
        try
        {
            var users = _userDataContext.Users.Include(user => user.Accounts).ToList();
            var user = users.Single(u => u.Uid == uid);

            return user;
        }
        catch (Exception)
        {
            return null;
        }
    }
}
