using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using BudgetBoard.Service.Interfaces;
using BudgetBoard.Service.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BudgetBoard.Service;

public class ApplicationUserService(ILogger<IApplicationUserService> logger, UserDataContext userDataContext) : IApplicationUserService
{
    private readonly ILogger<IApplicationUserService> _logger = logger;
    private readonly UserDataContext _userDataContext = userDataContext;

    public async Task<IApplicationUserResponse> ReadApplicationUserAsync(Guid userGuid)
    {
        var userData = await GetCurrentUserAsync(userGuid.ToString());
        if (userData == null)
        {
            _logger.LogError("Attempt to access authorized content by unauthorized user.");
            throw new Exception("You are not authorized to access this content.");
        }

        return new ApplicationUserResponse(userData);
    }

    public async Task UpdateApplicationUserAsync(Guid userGuid, IApplicationUserUpdateRequest user)
    {
        var userData = await GetCurrentUserAsync(userGuid.ToString());
        if (userData == null)
        {
            _logger.LogError("Attempt to update user by unauthorized user.");
            throw new Exception("You are not authorized to update this user.");
        }

        // TODO: Need to refactor SimpleFinService to not require this service to avoid circular dependency.
        // But would be nice to have a check here to ensure the token is valid.

        //if (!await _simpleFinService.IsAccessTokenValid(user.AccessToken))
        //{
        //    _logger.LogError("Attempt to update user with invalid access token.");
        //    throw new Exception("Invalid access token.");
        //}

        userData.AccessToken = user.AccessToken;
        userData.LastSync = user.LastSync ?? userData.LastSync;

        await _userDataContext.SaveChangesAsync();
    }

    private async Task<ApplicationUser> GetCurrentUserAsync(string id)
    {
        List<ApplicationUser> users;
        ApplicationUser? foundUser;
        try
        {
            users = await _userDataContext.ApplicationUsers.ToListAsync();
            foundUser = users.FirstOrDefault(u => u.Id == new Guid(id));
        }
        catch (Exception ex)
        {
            _logger.LogError("An error occurred while retrieving the user data: {ExceptionMessage}", ex.Message);
            throw new Exception("An error occurred while retrieving the user data.");
        }

        if (foundUser == null)
        {
            _logger.LogError("Attempt to create an account for an invalid user.");
            throw new Exception("Provided user not found.");
        }

        return foundUser;
    }
}
