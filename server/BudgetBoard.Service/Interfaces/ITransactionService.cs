using BudgetBoard.Service.Models;
using System.Security.Claims;

namespace BudgetBoard.Service.Interfaces;

public interface ITransactionService
{
    public Task<IEnumerable<ITransactionResponse>> GetTransactionsAsync(ClaimsPrincipal user, int? year, int? month, bool getHidden, Guid guid = default);
    public Task AddTransactionAsync(ClaimsPrincipal user, ITransactionAddRequest transaction);
    public Task DeleteTransactionAsync(ClaimsPrincipal user, Guid transactionID);
    public Task RestoreTransactionAsync(ClaimsPrincipal user, Guid transactionID);
    public Task EditTransactionAsync(ClaimsPrincipal user, ITransactionEditRequest editedTransaction);
}
