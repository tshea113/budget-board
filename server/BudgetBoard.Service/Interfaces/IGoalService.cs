using BudgetBoard.Service.Models;
using System.Security.Claims;

namespace BudgetBoard.Service.Interfaces;

public interface IGoalService
{
    Task CreateGoalAsync(ClaimsPrincipal user, IGoalCreateRequest request);
    Task<IEnumerable<IGoalResponse>> ReadGoalsAsync(ClaimsPrincipal user, bool includeInterest);
    Task UpdateGoalAsync(ClaimsPrincipal user, IGoalUpdateRequest request);
    Task DeleteGoalAsync(ClaimsPrincipal user, Guid guid);
}
