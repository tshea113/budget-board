using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using BudgetBoard.Service.Interfaces;
using BudgetBoard.Service.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace BudgetBoard.Service;

public class ApplicationUserService(ILogger<IApplicationUserService> logger, UserDataContext userDataContext, UserManager<ApplicationUser> userManager) : IApplicationUserService
{
    private readonly ILogger<IApplicationUserService> _logger = logger;
    private readonly UserDataContext _userDataContext = userDataContext;
    private readonly UserManager<ApplicationUser> _userManager = userManager;

    public async Task<IApplicationUser> GetUserData(ClaimsPrincipal user)
    {
        var userData = await GetCurrentUserAsync(_userManager.GetUserId(user) ?? string.Empty);
        if (userData == null)
        {
            _logger.LogError("Attempt to access authorized content by unauthorized user.");
            throw new Exception("You are not authorized to access this content.");
        }

        return userData;
    }
    public async Task<IApplicationUserResponse> ReadApplicationUserAsync(ClaimsPrincipal user)
    {
        var userData = await GetCurrentUserAsync(_userManager.GetUserId(user) ?? string.Empty);
        if (userData == null)
        {
            _logger.LogError("Attempt to access authorized content by unauthorized user.");
            throw new Exception("You are not authorized to access this content.");
        }

        return new ApplicationUserResponse(userData);
    }

    public async Task UpdateApplicationUserAsync(IApplicationUser userData, IApplicationUserUpdateRequest user)
    {
        var currentUser = await GetCurrentUserAsync(userData.Id.ToString());
        if (currentUser == null)
        {
            _logger.LogError("Attempt to update user by unauthorized user.");
            throw new Exception("You are not authorized to update this user.");
        }

        // We are assuming that the access token is valid.
        currentUser.AccessToken = user.AccessToken;
        if (user.LastSync != null)
        {
            // This won't be negative, but VS still complains.
            // Just cast it to DateTime to make it happy.
            currentUser.LastSync = (DateTime)user.LastSync;
        }

        await _userDataContext.SaveChangesAsync();
    }

    private async Task<ApplicationUser?> GetCurrentUserAsync(string id)
    {
        try
        {
            var users = await _userDataContext.Users.ToListAsync();
            return users.Single(u => u.Id == new Guid(id));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            return null;
        }
    }
}
