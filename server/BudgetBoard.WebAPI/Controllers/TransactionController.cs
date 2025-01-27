using BudgetBoard.Service.Interfaces;
using BudgetBoard.Service.Models;
using BudgetBoard.WebAPI.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BudgetBoard.WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TransactionController(ILogger<TransactionController> logger, ITransactionService transactionService) : ControllerBase
{
    private readonly ILogger<TransactionController> _logger = logger;
    private readonly ITransactionService _transactionService = transactionService;

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Get(int? year, int? month, bool getHidden = false)
    {

        try
        {
            return Ok(await _transactionService.GetTransactionsAsync(User, year, month, getHidden));
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpGet("{guid}")]
    [Authorize]
    public async Task<IActionResult> Get(Guid guid)
    {
        try
        {
            return Ok(await _transactionService.GetTransactionsAsync(User, null, null, false, guid));
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Add([FromBody] TransactionAddRequest transaction)
    {
        try
        {
            await _transactionService.AddTransactionAsync(User, transaction);
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
            await _transactionService.DeleteTransactionAsync(User, guid);
            return Ok();
        }

        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpPost]
    [Authorize]
    [Route("[action]")]
    public async Task<IActionResult> Restore(Guid guid)
    {
        try
        {
            await _transactionService.RestoreTransactionAsync(User, guid);
            return Ok();
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpPut]
    [Authorize]
    public async Task<IActionResult> Edit([FromBody] TransactionEditRequest newTransaction)
    {
        try
        {
            await _transactionService.EditTransactionAsync(User, newTransaction);
            return Ok();
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }
}
