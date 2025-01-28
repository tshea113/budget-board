using BudgetBoard.Service.Models;
using System.Security.Claims;

namespace BudgetBoard.Service.Interfaces;

public interface IBalanceService
{
    public Task CreateBalancesAsync(ClaimsPrincipal user, Guid accountId, IBalanceCreateRequest balance);
    public Task<IEnumerable<IBalanceResponse>> ReadBalancesAsync(ClaimsPrincipal user, Guid accountId);
    public Task UpdateBalanceAsync(ClaimsPrincipal user, IBalanceUpdateRequest updatedBalance);
    public Task DeleteBalanceAsync(ClaimsPrincipal user, Guid guid);
}
