using BudgetBoard.Service.Models;
using System.Security.Claims;

namespace BudgetBoard.Service.Interfaces;

public interface ITransactionCategoryService
{
    Task CreateTransactionCategoryAsync(ClaimsPrincipal user, ICategoryCreateRequest request);
    Task<IEnumerable<ICategoryResponse>> ReadTransactionCategoriesAsync(ClaimsPrincipal user, Guid guid = default);
    Task UpdateTransactionCategoryAsync(ClaimsPrincipal user, ICategoryUpdateRequest request);
    Task DeleteTransactionCategoryAsync(ClaimsPrincipal user, Guid guid);
}
