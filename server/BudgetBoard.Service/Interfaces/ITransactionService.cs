using BudgetBoard.Service.Models;
using System.Security.Claims;

namespace BudgetBoard.Service.Interfaces;

public interface ITransactionService
{
    public Task CreateTransactionAsync(ClaimsPrincipal user, ITransactionCreateRequest transaction);
    public Task<IEnumerable<ITransactionResponse>> ReadTransactionsAsync(ClaimsPrincipal user, int? year, int? month, bool getHidden, Guid guid = default);
    public Task UpdateTransactionAsync(ClaimsPrincipal user, ITransactionUpdateRequest editedTransaction);
    public Task DeleteTransactionAsync(ClaimsPrincipal user, Guid transactionID);
    public Task RestoreTransactionAsync(ClaimsPrincipal user, Guid transactionID);
}
