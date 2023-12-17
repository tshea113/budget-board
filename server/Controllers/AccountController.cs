using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MoneyMinder.Database.Data;

namespace MoneyMinder.Controllers;

[Route("api/[controller]/[action]")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly UserDataContext _userDataContext;

    public AccountController(UserDataContext context)
    {
        _userDataContext = context;
    }

    [HttpGet]
    [Authorize]
    public IActionResult GetAllAccounts()
    {
        try
        {
            string uid = User.Claims.Single(c => c.Type == "id").Value;
            return Ok(_userDataContext.Users.Single(u => u.Uid == uid));
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
