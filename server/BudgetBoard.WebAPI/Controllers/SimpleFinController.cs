using BudgetBoard.Service.Interfaces;
using BudgetBoard.WebAPI.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BudgetBoard.WebAPI.Controllers;

[Route("api/[controller]/[action]")]
[ApiController]
public class SimpleFinController(ILogger<SimpleFinController> logger, ISimpleFinService simpleFinService) : ControllerBase
{
    private readonly ILogger<SimpleFinController> _logger = logger;
    private readonly ISimpleFinService _simpleFinService = simpleFinService;

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Sync()
    {
        try
        {
            return Ok(await _simpleFinService.SyncAsync(User));
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
            await _simpleFinService.UpdateTokenAsync(User, newToken);
            return Ok();
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }
}
