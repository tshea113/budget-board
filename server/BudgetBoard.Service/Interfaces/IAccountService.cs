using BudgetBoard.Database.Models;
using BudgetBoard.Service.Types;
using System.Security.Claims;

namespace BudgetBoard.Service.Interfaces;

public interface IAccountService
{
    Task<IApplicationUser> GetUserData(ClaimsPrincipal user);
    Task CreateAccountAsync(IApplicationUser userData, IAccountCreateRequest account);
    IEnumerable<IAccountResponse> ReadAccountsAsync(IApplicationUser userData, Guid guid = default);
    Task UpdateAccountAsync(IApplicationUser userData, IAccountUpdateRequest editedAccount);
    Task DeleteAccountAsync(IApplicationUser userData, Guid guid, bool deleteTransactions = false);
    Task RestoreAccountAsync(IApplicationUser userData, Guid guid);
    Task OrderAccountsAsync(IApplicationUser userData, IEnumerable<IAccountIndexRequest> orderedAccounts);
}
