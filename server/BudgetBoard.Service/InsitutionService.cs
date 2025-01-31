using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using BudgetBoard.Service.Interfaces;
using BudgetBoard.Service.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
namespace BudgetBoard.Service;

public class InstitutionService(ILogger<IInstitutionService> logger, UserDataContext userDataContext, UserManager<ApplicationUser> userManager) : IInstitutionService
{
    private readonly ILogger<IInstitutionService> _logger = logger;
    private readonly UserDataContext _userDataContext = userDataContext;
    private readonly UserManager<ApplicationUser> _userManager = userManager;

    public async Task CreateInstitutionAsync(ClaimsPrincipal user, IInstitutionCreateRequest request)
    {
        var userData = await GetCurrentUserAsync(_userManager.GetUserId(user) ?? string.Empty);
        if (userData == null)
        {
            _logger.LogError("Attempt to access authorized content by unauthorized user.");
            throw new Exception("You are not authorized to access this content.");
        }

        var institution = new Institution
        {
            Name = request.Name,
            Index = request.Index,
            UserID = request.UserID
        };

        userData.Institutions.Add(institution);
        await _userDataContext.SaveChangesAsync();
    }

    public async Task<IEnumerable<IInstitutionResponse>> ReadInstitutionsAsync(ClaimsPrincipal user, Guid guid = default)
    {
        var userData = await GetCurrentUserAsync(_userManager.GetUserId(user) ?? string.Empty);
        if (userData == null)
        {
            _logger.LogError("Attempt to access authorized content by unauthorized user.");
            throw new Exception("You are not authorized to access this content.");
        }

        if (guid != default)
        {
            return [new InstitutionResponse(userData.Institutions.Single(i => i.ID == guid))];
        }

        return userData.Institutions.Select(i => new InstitutionResponse(i));
    }

    public async Task UpdateInstitutionAsync(ClaimsPrincipal user, IInstitutionUpdateRequest request)
    {
        var userData = await GetCurrentUserAsync(_userManager.GetUserId(user) ?? string.Empty);
        if (userData == null)
        {
            _logger.LogError("Attempt to access authorized content by unauthorized user.");
            throw new Exception("You are not authorized to access this content.");
        }

        var institution = userData.Institutions.Single(i => i.ID == request.ID);
        if (institution == null)
        {
            _logger.LogError("Attempt to update non-existent institution.");
            throw new Exception("The institution you are trying to update does not exist.");
        }

        institution.Name = request.Name;
        institution.Index = request.Index;
        institution.UserID = request.UserID;

        await _userDataContext.SaveChangesAsync();
    }

    public async Task DeleteInstitutionAsync(ClaimsPrincipal user, Guid id, bool deleteTransactions)
    {
        var userData = await GetCurrentUserAsync(_userManager.GetUserId(user) ?? string.Empty);
        if (userData == null)
        {
            _logger.LogError("Attempt to access authorized content by unauthorized user.");
            throw new Exception("You are not authorized to access this content.");
        }

        var institution = userData.Institutions.Single(i => i.ID == id);
        if (institution == null)
        {
            _logger.LogError("Attempt to delete non-existent institution.");
            throw new Exception("The institution you are trying to delete does not exist.");
        }

        if (deleteTransactions)
        {
            foreach (var transaction in institution.Accounts.SelectMany(a => a.Transactions))
            {
                transaction.Deleted = DateTime.Now.ToUniversalTime();
            }
        }

        userData.Institutions.Remove(institution);
        await _userDataContext.SaveChangesAsync();
    }

    public async Task OrderInstitutionsAsync(ClaimsPrincipal user, IEnumerable<IInstitutionIndexRequest> orderedInstitutions)
    {
        var userData = await GetCurrentUserAsync(_userManager.GetUserId(user) ?? string.Empty);
        if (userData == null)
        {
            _logger.LogError("Attempt to access authorized content by unauthorized user.");
            throw new Exception("You are not authorized to access this content.");
        }

        foreach (var institution in orderedInstitutions)
        {
            var inst = userData.Institutions.Single(i => i.ID == institution.ID);
            if (inst == null)
            {
                _logger.LogError("Attempt to order non-existent institution.");
                throw new Exception("The institution you are trying to order does not exist.");
            }

            inst.Index = institution.Index;
        }

        await _userDataContext.SaveChangesAsync();
    }

    private async Task<ApplicationUser?> GetCurrentUserAsync(string id)
    {
        try
        {
            var users = await _userDataContext.Users
                .Include(u => u.Institutions)
                .ToListAsync();
            return users.Single(u => u.Id == new Guid(id));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            return null;
        }
    }
}
