using BudgetBoard.Service.Interfaces;
using BudgetBoard.Service.Models;
using BudgetBoard.WebAPI.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BudgetBoard.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BudgetController(ILogger<BudgetController> logger, IBudgetService budgetService) : ControllerBase
    {
        private readonly ILogger<BudgetController> _logger = logger;
        private readonly IBudgetService _budgetService = budgetService;

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] BudgetCreateRequest[] budgets)
        {
            try
            {
                var userData = await _budgetService.GetUserData(User);
                await _budgetService.CreateBudgetsAsync(userData, budgets);
                return Ok();
            }
            catch (Exception ex)
            {
                return Helpers.BuildErrorResponse(_logger, ex.Message);
            }
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> Read(DateTime date)
        {
            try
            {
                var userData = await _budgetService.GetUserData(User);
                return Ok(_budgetService.ReadBudgetsAsync(userData, date));
            }
            catch (Exception ex)
            {
                return Helpers.BuildErrorResponse(_logger, ex.Message);
            }
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> Update([FromBody] IBudgetUpdateRequest editBudget)
        {
            try
            {
                var userData = await _budgetService.GetUserData(User);
                await _budgetService.UpdateBudgetAsync(userData, editBudget);
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
                var userData = await _budgetService.GetUserData(User);
                await _budgetService.DeleteBudgetAsync(userData, guid);
                return Ok();
            }
            catch (Exception ex)
            {
                return Helpers.BuildErrorResponse(_logger, ex.Message);
            }
        }
    }
}
