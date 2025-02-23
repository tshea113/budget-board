using BudgetBoard.Database.Models;
using BudgetBoard.Service.Interfaces;
using BudgetBoard.WebAPI.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BudgetBoard.WebAPI.Controllers;

[Route("api/[controller]/[action]")]
[ApiController]
public class SimpleFinController(ILogger<SimpleFinController> logger, UserManager<ApplicationUser> userManager, ISimpleFinService simpleFinService) : ControllerBase
{
    private readonly ILogger<SimpleFinController> _logger = logger;
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly ISimpleFinService _simpleFinService = simpleFinService;

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Sync()
    {
        try
        {
            return Ok(await _simpleFinService.SyncAsync(new Guid(_userManager.GetUserId(User) ?? string.Empty)));
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpPut]
    [Authorize]
    public async Task<IActionResult> UpdateAccessToken(string setupToken)
    {
        try
        {
            await _simpleFinService.UpdateAccessTokenFromSetupToken(new Guid(_userManager.GetUserId(User) ?? string.Empty), setupToken);
            return Ok();
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }
}
