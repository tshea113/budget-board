using BudgetBoard.Service.Types;
using System.Security.Claims;

namespace BudgetBoard.Service.Interfaces;

public interface IAccountService
{
    public Task CreateAccountAsync(ClaimsPrincipal user, IAccountCreateRequest account);
    public Task<IEnumerable<IAccountResponse>> ReadAccountsAsync(ClaimsPrincipal user, Guid guid = default);
    public Task UpdateAccountAsync(ClaimsPrincipal user, IAccountUpdateRequest editedAccount);
    public Task DeleteAccountAsync(ClaimsPrincipal user, Guid guid, bool deleteTransactions = false);
    public Task RestoreAccountAsync(ClaimsPrincipal user, Guid guid);
    public Task OrderAccountsAsync(ClaimsPrincipal user, IEnumerable<IAccountIndexRequest> orderedAccounts);
}
