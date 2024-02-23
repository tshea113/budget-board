using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BudgetBoard.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly UserDataContext _userDataContext;
    private readonly IHttpClientFactory _clientFactory;

    public UserController(UserDataContext context, IHttpClientFactory clientFactory)
    {
        _userDataContext = context;
        _clientFactory = clientFactory;
    }

    private IActionResult CreateUser(string uid)
    {
        var newUser = new User
        {
            Uid = uid,
        };

        _userDataContext.Users.Add(newUser);
        _userDataContext.SaveChanges();

        return Ok();
    }

    [HttpGet]
    [Authorize]
    public IActionResult GetUser()
    {
        var uid = User.Claims.Single(c => c.Type == "id").Value;
        var user = GetCurrentUser(User.Claims.Single(c => c.Type == "id").Value);

        if (user == null)
        {
            // Push the new user to the db
            CreateUser(uid);

            // We need to throw an error if the user isn't pushed to the db correctly
            try
            {
                user = _userDataContext.Users.Single(x => x.Uid == uid);
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
    public async Task<IActionResult> EditUser([FromBody] User newUser)
    {
        var user = GetCurrentUser(User.Claims.Single(c => c.Type == "id").Value);

        if (user == null)
        {
            return NotFound();
        }

        var response = default(HttpResponseMessage);
        try
        {
            response = await GetAccessToken(newUser.AccessToken);
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
    private async Task<HttpResponseMessage> GetAccessToken(string setupToken)
    {
        byte[] data = Convert.FromBase64String(setupToken);
        string decodedString = System.Text.Encoding.UTF8.GetString(data);

        var request = new HttpRequestMessage(
            HttpMethod.Post,
            decodedString);
        var client = _clientFactory.CreateClient();
        var response = await client.SendAsync(request);

        return response;
    }

    private User? GetCurrentUser(string uid)
    {
        try
        {
            var user = _userDataContext.Users.Single(u => u.Uid == uid);

            return user;
        }
        catch (Exception)
        {
            return null;
        }
    }
}
