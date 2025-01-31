using System.Security.Claims;

namespace BudgetBoard.Service.Interfaces;

public interface ISimpleFinService
{
    Task<IEnumerable<string>> SyncAsync(ClaimsPrincipal user);
    Task UpdateTokenAsync(ClaimsPrincipal user, string accessToken);
}
