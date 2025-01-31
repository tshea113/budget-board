using BudgetBoard.Database.Models;
using BudgetBoard.Service.Models;
using System.Security.Claims;

namespace BudgetBoard.Service.Interfaces;

public interface IBudgetService
{
    Task<IApplicationUser> GetUserData(ClaimsPrincipal user);
    Task CreateBudgetsAsync(IApplicationUser userData, IEnumerable<IBudgetCreateRequest> budget);
    IEnumerable<IBudgetResponse> ReadBudgetsAsync(IApplicationUser userData, DateTime date);
    Task UpdateBudgetAsync(IApplicationUser userData, IBudgetUpdateRequest updatedBudget);
    Task DeleteBudgetAsync(IApplicationUser userData, Guid guid);
}
