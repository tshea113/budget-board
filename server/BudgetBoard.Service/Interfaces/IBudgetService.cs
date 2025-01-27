using BudgetBoard.Service.Models;
using System.Security.Claims;

namespace BudgetBoard.Service.Interfaces;

public interface IBudgetService
{
    public Task CreateBudgetAsync(ClaimsPrincipal user, IEnumerable<IBudgetCreateRequest> budget);
    public Task<IEnumerable<IBudgetResponse>> ReadBudgetsAsync(ClaimsPrincipal user, DateTime date);
    public Task UpdateBudgetAsync(ClaimsPrincipal user, IBudgetUpdateRequest updatedBudget);
    public Task DeleteBudgetAsync(ClaimsPrincipal user, Guid guid);
}
