using BudgetBoard.Database.Models;
using BudgetBoard.Service.Models;
using System.Security.Claims;

namespace BudgetBoard.Service.Interfaces;

public interface IBalanceService
{
    Task<IApplicationUser> GetUserData(ClaimsPrincipal user);
    Task CreateBalancesAsync(IApplicationUser userData, IBalanceCreateRequest balance);
    IEnumerable<IBalanceResponse> ReadBalancesAsync(IApplicationUser userData, Guid accountId);
    Task UpdateBalanceAsync(IApplicationUser userData, IBalanceUpdateRequest updatedBalance);
    Task DeleteBalanceAsync(IApplicationUser userData, Guid guid);
}
