using BudgetBoard.Database.Models;
using BudgetBoard.Service.Models;
using System.Security.Claims;

namespace BudgetBoard.Service.Interfaces;

public interface IGoalService
{
    Task<IApplicationUser> GetUserData(ClaimsPrincipal user);
    Task CreateGoalAsync(IApplicationUser userData, IGoalCreateRequest request);
    IEnumerable<IGoalResponse> ReadGoalsAsync(IApplicationUser userData, bool includeInterest);
    Task UpdateGoalAsync(IApplicationUser userData, IGoalUpdateRequest request);
    Task DeleteGoalAsync(IApplicationUser userData, Guid guid);
}
