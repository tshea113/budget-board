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
    private readonly ILogger<UserController> _logger;

    private readonly UserDataContext _userDataContext;
    private SimpleFinHandler _simpleFinHandler;

    public UserController(UserDataContext context, IHttpClientFactory clientFactory, ILogger<UserController> logger)
    {
        _userDataContext = context;
        _simpleFinHandler = new SimpleFinHandler(_userDataContext, clientFactory);
        _logger = logger;
    }

    [HttpGet]
    [Authorize]
    public IActionResult GetUser()
    {
        try
        {
            var user = GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
            if (user == null) return Unauthorized("You are not authorized to access this content.");

            return Ok(new UserResponse(user));
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpPut]
    [Authorize]
    public async Task<IActionResult> EditUser([FromBody] ApplicationUser newUser)
    {
        try
        {
            var user = GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
            if (user == null) return Unauthorized("You are not authorized to access this content.");

            var response = await _simpleFinHandler.GetAccessToken(newUser.AccessToken);
            if (response.IsSuccessStatusCode)
            {
                user.AccessToken = await response.Content.ReadAsStringAsync();
                await _userDataContext.SaveChangesAsync();
            }
            else
            {
                return BadRequest("There was an error validating the setup token.");
            }

            return Ok();
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpGet]
    [Route("[action]")]
    public IActionResult IsSignedIn()
    {
        if (HttpContext.User?.Identity?.IsAuthenticated ?? false)
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
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            return null;
        }
    }
}
