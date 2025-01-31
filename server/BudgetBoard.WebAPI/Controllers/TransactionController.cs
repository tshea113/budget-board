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

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] TransactionCreateRequest transaction)
    {
        try
        {
            var userData = await _transactionService.GetUserData(User);
            await _transactionService.CreateTransactionAsync(userData, transaction);
            return Ok();
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Read(int? year, int? month, bool getHidden = false)
    {

        try
        {
            var userData = await _transactionService.GetUserData(User);
            return Ok(_transactionService.ReadTransactionsAsync(userData, year, month, getHidden));
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpGet("{guid}")]
    [Authorize]
    public async Task<IActionResult> Read(Guid guid)
    {
        try
        {
            var userData = await _transactionService.GetUserData(User);
            return Ok(_transactionService.ReadTransactionsAsync(userData, null, null, false, guid));
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpPut]
    [Authorize]
    public async Task<IActionResult> Update([FromBody] TransactionUpdateRequest newTransaction)
    {
        try
        {
            var userData = await _transactionService.GetUserData(User);
            await _transactionService.UpdateTransactionAsync(userData, newTransaction);
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
            var userData = await _transactionService.GetUserData(User);
            await _transactionService.DeleteTransactionAsync(userData, guid);
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
            var userData = await _transactionService.GetUserData(User);
            await _transactionService.RestoreTransactionAsync(userData, guid);
            return Ok();
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }
}
