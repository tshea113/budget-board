using BudgetBoard.Service.Types;
using System.Security.Claims;

namespace BudgetBoard.Service.Interfaces;

public interface IAccountService
{
    public Task<IEnumerable<AccountResponse>> GetAccountsAsync(ClaimsPrincipal user, Guid guid = default);
    public Task AddAccountAsync(ClaimsPrincipal user, IAccountAddRequest account);
    public Task DeleteAccountAsync(ClaimsPrincipal user, Guid guid, bool deleteTransactions = false);
    public Task RestoreAccountAsync(ClaimsPrincipal user, Guid guid);
    public Task EditAccountAsync(ClaimsPrincipal user, IAccountEditRequest editedAccount);
    public Task SetIndicesAsync(ClaimsPrincipal user, IEnumerable<IAccountIndexRequest> orderedAccounts);
}
