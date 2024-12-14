using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using BudgetBoard.Models;
using BudgetBoard.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BudgetBoard.Controllers;

[Route("api/[controller]")]
[ApiController]
public class InstitutionController : ControllerBase
{
    private readonly ILogger<InstitutionController> _logger;

    private readonly UserDataContext _userDataContext;
    private UserManager<ApplicationUser> _userManager;

    public InstitutionController(UserDataContext context, UserManager<ApplicationUser> userManager, ILogger<InstitutionController> logger)
    {
        _userDataContext = context;
        _userManager = userManager;
        _logger = logger;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Get()
    {
        try
        {
            var user = await GetCurrentUser(_userManager.GetUserId(User) ?? string.Empty);
            if (user == null) return Unauthorized("You are not authorized to access this content.");

            return Ok(user.Institutions.Select(i => new InstitutionResponse(i)));
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
            var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
            if (user == null) return Unauthorized("You are not authorized to access this content.");

            var institution = user.Institutions.First(a => a.ID == guid);
            if (institution == null) return NotFound();

            return Ok(new InstitutionResponse(institution));
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Add([FromBody] Institution institution)
    {
        try
        {
            var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
            if (user == null) return Unauthorized("You are not authorized to access this content.");

            user.Institutions.Add(institution);
            await _userDataContext.SaveChangesAsync();

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
            var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
            if (user == null) return Unauthorized("You are not authorized to access this content.");

            var institution = user.Institutions.Single(i => i.ID == guid);
            if (institution == null) return Unauthorized("You are not authorized to access this content.");

            _userDataContext.Entry(institution).State = EntityState.Deleted;
            await _userDataContext.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    [HttpPut]
    [Authorize]
    public async Task<IActionResult> Edit([FromBody] Institution newInstitution)
    {
        try
        {
            var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
            if (user == null) return Unauthorized("You are not authorized to access this content.");

            Institution? institution = user.Institutions.Single(i => i.ID == newInstitution.ID);
            if (institution == null) return Unauthorized("You are not authorized to access this content.");

            institution.Index = newInstitution.Index;
            await _userDataContext.SaveChangesAsync();

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
            var user = await GetCurrentUser(User.Claims.Single(c => c.Type == UserConstants.UserType).Value);
            if (user == null) return Unauthorized("You are not authorized to access this content.");

            foreach (var institution in institutions)
            {
                var inst = user.Institutions.Single(i => i.ID == institution.ID);
                if (inst == null) return Unauthorized("You are not authorized to access this content.");

                inst.Index = institution.Index;
            }

            await _userDataContext.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            return Helpers.BuildErrorResponse(_logger, ex.Message);
        }
    }

    private async Task<ApplicationUser?> GetCurrentUser(string id)
    {
        try
        {
            var users = await _userDataContext.Users
                .Include(u => u.Institutions)
                .ThenInclude(a => a.Accounts)
                .AsSplitQuery()
                .ToListAsync();
            var user = users.Single(u => u.Id == new Guid(id));

            return user;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            return null;
        }
    }
}
