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
public class TransactionCategoryController(ILogger<TransactionCategoryController> logger, UserManager<ApplicationUser> userManager, ITransactionCategoryService transactionCategoryService) : ControllerBase
{
    private readonly ILogger<TransactionCategoryController> _logger = logger;
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly ITransactionCategoryService _transactionCategoryService = transactionCategoryService;

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CategoryCreateRequest category)
    {
        try
        {
            await _transactionCategoryService.CreateTransactionCategoryAsync(new Guid(_userManager.GetUserId(User) ?? string.Empty), category);
            return Ok();
        }
        catch (BudgetBoardServiceException bbex)
        {
            var errorObjectResult = new ObjectResult(bbex.Message)
            {
                StatusCode = StatusCodes.Status500InternalServerError
            };
            return errorObjectResult;
        }
        catch
        {
            var errorObjectResult = new ObjectResult("There was an internal server error.")
            {
                StatusCode = StatusCodes.Status500InternalServerError
            };
            return errorObjectResult;
        }
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Read()
    {
        try
        {
            return Ok(await _transactionCategoryService.ReadTransactionCategoriesAsync(new Guid(_userManager.GetUserId(User) ?? string.Empty)));
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
            await _transactionCategoryService.UpdateTransactionCategoryAsync(new Guid(_userManager.GetUserId(User) ?? string.Empty), category);
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
            await _transactionCategoryService.DeleteTransactionCategoryAsync(new Guid(_userManager.GetUserId(User) ?? string.Empty), guid);
            return Ok();
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }
}
