using BudgetBoard.Service.Interfaces;
using BudgetBoard.Service.Types;
using BudgetBoard.WebAPI.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BudgetBoard.WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountController(ILogger<AccountController> logger, IAccountService accountService) : ControllerBase
{
    private readonly ILogger<AccountController> _logger = logger;
    private readonly IAccountService _accountService = accountService;

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] AccountCreateRequest account)
    {
        try
        {
            var userData = await _accountService.GetUserData(User);
            await _accountService.CreateAccountAsync(userData, account);
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
            var userData = await _accountService.GetUserData(User);
            return Ok(_accountService.ReadAccountsAsync(userData));
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
            var userData = await _accountService.GetUserData(User);
            return Ok(await _accountService.ReadAccountsAsync(userData, guid));
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpPut]
    [Authorize]
    public async Task<IActionResult> Update([FromBody] AccountUpdateRequest editedAccount)
    {
        try
        {
            var userData = await _accountService.GetUserData(User);
            await _accountService.UpdateAccountAsync(userData, editedAccount);
            return Ok();
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpDelete]
    [Authorize]
    public async Task<IActionResult> Delete(Guid guid, bool deleteTransactions = false)
    {
        try
        {
            var userData = await _accountService.GetUserData(User);
            await _accountService.DeleteAccountAsync(userData, guid, deleteTransactions);
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
            var userData = await _accountService.GetUserData(User);
            await _accountService.RestoreAccountAsync(userData, guid);
            return Ok();
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpPut]
    [Authorize]
    [Route("[action]")]
    public async Task<IActionResult> Order([FromBody] List<AccountIndexRequest> accounts)
    {
        try
        {
            var userData = await _accountService.GetUserData(User);
            await _accountService.OrderAccountsAsync(userData, accounts);
            return Ok();
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }
}
