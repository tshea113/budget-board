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
                await _budgetService.CreateBudgetAsync(User, budgets);
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
                return Ok(await _budgetService.ReadBudgetsAsync(User, date));
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
                await _budgetService.UpdateBudgetAsync(User, editBudget);
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
                await _budgetService.DeleteBudgetAsync(User, guid);
                return Ok();
            }
            catch (Exception ex)
            {
                return Helpers.BuildErrorResponse(_logger, ex.Message);
            }
        }
    }
}
