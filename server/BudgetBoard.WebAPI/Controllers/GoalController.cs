using BudgetBoard.Database.Models;
using BudgetBoard.Service.Interfaces;
using BudgetBoard.Service.Models;
using BudgetBoard.WebAPI.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BudgetBoard.WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class GoalController(ILogger<GoalController> logger, UserManager<ApplicationUser> userManager, IGoalService goalService) : ControllerBase
{
    private readonly ILogger<GoalController> _logger = logger;
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly IGoalService _goalService = goalService;

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] GoalCreateRequest newGoal)
    {
        try
        {
            await _goalService.CreateGoalAsync(new Guid(_userManager.GetUserId(User) ?? string.Empty), newGoal);
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
            return Ok(await _goalService.ReadGoalsAsync(new Guid(_userManager.GetUserId(User) ?? string.Empty), includeInterest));
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
            await _goalService.UpdateGoalAsync(new Guid(_userManager.GetUserId(User) ?? string.Empty), editedGoal);
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
            await _goalService.DeleteGoalAsync(new Guid(_userManager.GetUserId(User) ?? string.Empty), guid);
            return Ok();
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }
}
