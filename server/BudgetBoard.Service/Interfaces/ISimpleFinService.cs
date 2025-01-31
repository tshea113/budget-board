using BudgetBoard.Database.Models;
using System.Security.Claims;

namespace BudgetBoard.Service.Interfaces;

public interface ISimpleFinService
{
    Task<IApplicationUser> GetUserData(ClaimsPrincipal user);
    Task<IEnumerable<string>> SyncAsync(IApplicationUser userData);
    Task UpdateTokenAsync(IApplicationUser userData, string accessToken);
    Task<HttpResponseMessage> ReadAccessToken(string setupToken);
}
