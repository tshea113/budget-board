using BudgetBoard.Database.Models;
using BudgetBoard.Service.Models;
using System.Security.Claims;

namespace BudgetBoard.Service.Interfaces;

public interface IApplicationUserService
{
    Task<IApplicationUser> GetUserData(ClaimsPrincipal user);
    Task<IApplicationUserResponse> ReadApplicationUserAsync(ClaimsPrincipal user);
    Task UpdateApplicationUserAsync(IApplicationUser userData, IApplicationUserUpdateRequest user);
}
