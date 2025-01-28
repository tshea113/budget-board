using BudgetBoard.Service.Types;
using System.Security.Claims;

namespace BudgetBoard.Service.Interfaces;

public interface IAccountService
{
    Task CreateAccountAsync(ClaimsPrincipal user, IAccountCreateRequest account);
    Task<IEnumerable<IAccountResponse>> ReadAccountsAsync(ClaimsPrincipal user, Guid guid = default);
    Task UpdateAccountAsync(ClaimsPrincipal user, IAccountUpdateRequest editedAccount);
    Task DeleteAccountAsync(ClaimsPrincipal user, Guid guid, bool deleteTransactions = false);
    Task RestoreAccountAsync(ClaimsPrincipal user, Guid guid);
    Task OrderAccountsAsync(ClaimsPrincipal user, IEnumerable<IAccountIndexRequest> orderedAccounts);
}
