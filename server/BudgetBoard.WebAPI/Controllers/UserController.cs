using BudgetBoard.Database.Data;
using BudgetBoard.Service.Interfaces;
using BudgetBoard.Service.Models;
using BudgetBoard.WebAPI.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BudgetBoard.WebAPI.Controllers;

public class ApplicationUserConstants
{
    public const string UserType = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
}

[Route("api/[controller]")]
[ApiController]
public class ApplicationUserController(ILogger<ApplicationUserController> logger, UserDataContext context, IApplicationUserService applicationUserService, ISimpleFinService simpleFinService) : ControllerBase
{
    private readonly ILogger<ApplicationUserController> _logger = logger;
    private readonly UserDataContext _userDataContext = context;
    private readonly IApplicationUserService _applicationUserService = applicationUserService;
    private readonly ISimpleFinService _simpleFinService = simpleFinService;

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Read()
    {
        try
        {
            return Ok(await _applicationUserService.ReadUserAsync(User));
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpPut]
    [Authorize]
    public async Task<IActionResult> Update([FromBody] IApplicationUserUpdateRequest newUser)
    {
        try
        {
            var userData = await _applicationUserService.ReadUserAsync(User);
            await _applicationUserService.UpdateApplicationUserAsync(userData, newUser);
            return Ok();
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpGet]
    [Route("[action]")]
    public IActionResult IsSignedIn() => Ok(HttpContext.User?.Identity?.IsAuthenticated ?? false);
}
