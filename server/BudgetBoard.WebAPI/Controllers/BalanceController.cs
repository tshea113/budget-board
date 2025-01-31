using BudgetBoard.Service.Interfaces;
using BudgetBoard.Service.Models;
using BudgetBoard.WebAPI.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BudgetBoard.WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BalanceController(ILogger<BalanceController> logger, IBalanceService balanceService) : ControllerBase
{
    private readonly ILogger<BalanceController> _logger = logger;
    private readonly IBalanceService _balanceService = balanceService;

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] BalanceCreateRequest balance)
    {
        try
        {
            var userData = await _balanceService.GetUserData(User);
            await _balanceService.CreateBalancesAsync(userData, balance);
            return Ok();
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Read(Guid accountId)
    {
        try
        {
            var userData = await _balanceService.GetUserData(User);
            return Ok(_balanceService.ReadBalancesAsync(userData, accountId));
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpPut]
    [Authorize]
    public async Task<IActionResult> Update([FromBody] BalanceUpdateRequest updatedBalance)
    {
        try
        {
            var userData = await _balanceService.GetUserData(User);
            await _balanceService.UpdateBalanceAsync(userData, updatedBalance);
            return Ok();
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpDelete]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            var userData = await _balanceService.GetUserData(User);
            await _balanceService.DeleteBalanceAsync(userData, id);
            return Ok();
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }
}
