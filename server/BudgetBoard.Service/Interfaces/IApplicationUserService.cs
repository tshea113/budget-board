using BudgetBoard.Database.Models;
using BudgetBoard.Service.Models;
using System.Security.Claims;

namespace BudgetBoard.Service.Interfaces;

public interface IApplicationUserService
{
    Task<IApplicationUser> ReadUserAsync(ClaimsPrincipal user);
    Task UpdateApplicationUserAsync(IApplicationUser userData, IApplicationUserUpdateRequest user);
}
