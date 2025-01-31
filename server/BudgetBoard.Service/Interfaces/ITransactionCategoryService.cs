using BudgetBoard.Database.Models;
using BudgetBoard.Service.Models;
using System.Security.Claims;

namespace BudgetBoard.Service.Interfaces;

public interface ITransactionCategoryService
{
    Task<IApplicationUser> GetUserData(ClaimsPrincipal user);
    Task CreateTransactionCategoryAsync(IApplicationUser userData, ICategoryCreateRequest request);
    IEnumerable<ICategoryResponse> ReadTransactionCategoriesAsync(IApplicationUser userData, Guid guid = default);
    Task UpdateTransactionCategoryAsync(IApplicationUser userData, ICategoryUpdateRequest request);
    Task DeleteTransactionCategoryAsync(IApplicationUser userData, Guid guid);
}
