using BudgetBoard.Service.Models;
using System.Security.Claims;

namespace BudgetBoard.Service.Interfaces;

public interface IBudgetService
{
    Task CreateBudgetsAsync(ClaimsPrincipal user, IEnumerable<IBudgetCreateRequest> budget);
    Task<IEnumerable<IBudgetResponse>> ReadBudgetsAsync(ClaimsPrincipal user, DateTime date);
    Task UpdateBudgetAsync(ClaimsPrincipal user, IBudgetUpdateRequest updatedBudget);
    Task DeleteBudgetAsync(ClaimsPrincipal user, Guid guid);
}
