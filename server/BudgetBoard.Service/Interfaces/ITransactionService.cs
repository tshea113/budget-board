using BudgetBoard.Service.Models;
using System.Security.Claims;

namespace BudgetBoard.Service.Interfaces;

public interface ITransactionService
{
    Task CreateTransactionAsync(ClaimsPrincipal user, ITransactionCreateRequest transaction);
    Task<IEnumerable<ITransactionResponse>> ReadTransactionsAsync(ClaimsPrincipal user, int? year, int? month, bool getHidden, Guid guid = default);
    Task UpdateTransactionAsync(ClaimsPrincipal user, ITransactionUpdateRequest editedTransaction);
    Task DeleteTransactionAsync(ClaimsPrincipal user, Guid transactionID);
    Task RestoreTransactionAsync(ClaimsPrincipal user, Guid transactionID);
}
