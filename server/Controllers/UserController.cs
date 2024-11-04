using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using BudgetBoard.Models;
using BudgetBoard.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BudgetBoard.Controllers;

public class UserConstants
{
    public const string UserType = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
}

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly UserDataContext _userDataContext;
    private SimpleFinHandler _simpleFinHandler;

    public UserController(UserDataContext context, IHttpClientFactory clientFactory)
    {
        _userDataContext = context;
        _simpleFinHandler = new SimpleFinHandler(_userDataContext, clientFactory);
    }

    [HttpGet]
    [Authorize]
    public IActionResult GetUser()
    {
        var user = GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);

        if (user == null) return Unauthorized("You are not authorized to access this content.");

        return Ok(new UserResponse(user));
    }

    [HttpPut]
    [Authorize]
    public async Task<IActionResult> EditUser([FromBody] ApplicationUser newUser)
    {
        var user = GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);

        if (user == null) return Unauthorized("You are not authorized to access this content.");

        var response = default(HttpResponseMessage);
        try
        {
            response = await _simpleFinHandler.GetAccessToken(newUser.AccessToken);
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
            return BadRequest("There was an error connecting to SimpleFin.");
        }

        try
        {
            await _userDataContext.SaveChangesAsync();
        }
        catch
        {
            return BadRequest("There was an error connecting to the database.");
        }


        return Ok();

    }

    [HttpGet]
    [Route("[action]")]
    public IActionResult IsSignedIn()
    {
        if (HttpContext.User.Identity?.IsAuthenticated ?? false)
        {
            return Ok(true);
        }
        else
        {
            return Ok(false);
        }
    }

    private ApplicationUser? GetCurrentUser(string id)
    {
        try
        {
            var user = _userDataContext.Users.Single(u => u.Id == new Guid(id));

            return user;
        }
        catch (Exception)
        {
            return null;
        }
    }
}
