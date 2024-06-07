using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
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

    /*    private IActionResult CreateUser(string uid)
        {
            var newUser = new ApplicationUser
            {
                Uid = uid,
            };

            _userDataContext.Users.Add(newUser);
            _userDataContext.SaveChanges();

            return Ok();
        }*/

    [HttpGet]
    [Authorize]
    public IActionResult GetUser()
    {
        var id = User.Claims.Single(c => c.Type == UserConstants.UserType).Value;
        var user = GetCurrentUser(id);

        if (user == null)
        {
            // Push the new user to the db
            /*CreateUser(uid);*/

            // We need to throw an error if the user isn't pushed to the db correctly
            try
            {
                user = _userDataContext.Users.Single(x => x.Id == new Guid(id));
                ResponseUser response = new ResponseUser(user);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        else
        {
            ResponseUser response = new ResponseUser(user);
            return Ok(response);
        }
    }

    [HttpPut]
    [Authorize]
    public async Task<IActionResult> EditUser([FromBody] ApplicationUser newUser)
    {
        var user = GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);

        if (user == null)
        {
            return NotFound();
        }

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
            return BadRequest("There was an error accessing SimpleFin.");
        }

        await _userDataContext.SaveChangesAsync();

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
