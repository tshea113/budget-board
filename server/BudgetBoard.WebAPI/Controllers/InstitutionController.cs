using BudgetBoard.Service.Interfaces;
using BudgetBoard.Service.Models;
using BudgetBoard.WebAPI.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BudgetBoard.WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class InstitutionController(ILogger<InstitutionController> logger, IInstitutionService institutionService) : ControllerBase
{
    private readonly ILogger<InstitutionController> _logger = logger;
    private readonly IInstitutionService _institutionService = institutionService;

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] IInstitutionCreateRequest createdInstitution)
    {
        try
        {
            await _institutionService.CreateInstitutionAsync(User, createdInstitution);
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
            return Ok(await _institutionService.ReadInstitutionsAsync(User));
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
            return Ok(await _institutionService.ReadInstitutionsAsync(User, guid));
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpPut]
    [Authorize]
    public async Task<IActionResult> Update([FromBody] IInstitutionUpdateRequest updatedInstitution)
    {
        try
        {
            await _institutionService.UpdateInstitutionAsync(User, updatedInstitution);
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
            await _institutionService.DeleteInstitutionAsync(User, guid, deleteTransactions);
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
    public async Task<IActionResult> SetIndices([FromBody] List<InstitutionIndexRequest> institutions)
    {
        try
        {
            await _institutionService.OrderInstitutionsAsync(User, institutions);
            return Ok();
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }
}
