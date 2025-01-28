using BudgetBoard.Service.Interfaces;
using BudgetBoard.Service.Models;
using BudgetBoard.WebAPI.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BudgetBoard.WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class GoalController(ILogger<GoalController> logger, IGoalService goalService) : ControllerBase
{
    private readonly ILogger<GoalController> _logger = logger;
    private readonly IGoalService _goalService = goalService;

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] GoalCreateRequest newGoal)
    {
        try
        {
            await _goalService.CreateGoalAsync(User, newGoal);
            return Ok();
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Read(bool includeInterest = false)
    {
        try
        {
            return Ok(await _goalService.ReadGoalsAsync(User, includeInterest));
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpPut]
    [Authorize]
    public async Task<IActionResult> Update([FromBody] GoalUpdateRequest editedGoal)
    {
        try
        {
            await _goalService.UpdateGoalAsync(User, editedGoal);
            return Ok();
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpDelete]
    [Authorize]
    public async Task<IActionResult> Delete(Guid guid)
    {
        try
        {
            await _goalService.DeleteGoalAsync(User, guid);
            return Ok();
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }
}
