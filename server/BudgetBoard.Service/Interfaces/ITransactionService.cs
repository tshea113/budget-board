using BudgetBoard.Database.Models;
using BudgetBoard.Service.Models;
using System.Security.Claims;

namespace BudgetBoard.Service.Interfaces;

public interface ITransactionService
{
    Task<IApplicationUser> GetUserData(ClaimsPrincipal user);
    Task CreateTransactionAsync(IApplicationUser userData, ITransactionCreateRequest transaction);
    IEnumerable<ITransactionResponse> ReadTransactionsAsync(IApplicationUser userData, int? year, int? month, bool getHidden, Guid guid = default);
    Task UpdateTransactionAsync(IApplicationUser userData, ITransactionUpdateRequest editedTransaction);
    Task DeleteTransactionAsync(IApplicationUser userData, Guid transactionID);
    Task RestoreTransactionAsync(IApplicationUser userData, Guid transactionID);
}
