using BudgetBoard.Service.Models;
using System.Security.Claims;

namespace BudgetBoard.Service.Interfaces;

public interface IBalanceService
{
    Task CreateBalancesAsync(ClaimsPrincipal user, IBalanceCreateRequest balance);
    Task<IEnumerable<IBalanceResponse>> ReadBalancesAsync(ClaimsPrincipal user, Guid accountId);
    Task UpdateBalanceAsync(ClaimsPrincipal user, IBalanceUpdateRequest updatedBalance);
    Task DeleteBalanceAsync(ClaimsPrincipal user, Guid guid);
}
