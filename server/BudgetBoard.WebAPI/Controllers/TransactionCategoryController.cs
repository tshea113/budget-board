using BudgetBoard.Service.Interfaces;
using BudgetBoard.Service.Models;
using BudgetBoard.WebAPI.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BudgetBoard.WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TransactionCategoryController(ILogger<TransactionCategoryController> logger, ITransactionCategoryService transactionCategoryService) : ControllerBase
{
    private readonly ILogger<TransactionCategoryController> _logger = logger;
    private readonly ITransactionCategoryService _transactionCategoryService = transactionCategoryService;

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CategoryCreateRequest category)
    {
        try
        {
            await _transactionCategoryService.CreateTransactionCategoryAsync(User, category);
            return Ok();
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Read()
    {
        try
        {
            return Ok(await _transactionCategoryService.ReadTransactionCategoriesAsync(User));
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpPut]
    [Authorize]
    public async Task<IActionResult> Update([FromBody] CategoryUpdateRequest category)
    {
        try
        {
            await _transactionCategoryService.UpdateTransactionCategoryAsync(User, category);
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
            await _transactionCategoryService.DeleteTransactionCategoryAsync(User, guid);
            return Ok();
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }
}
