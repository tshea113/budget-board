using BudgetBoard.Service.Models;

namespace BudgetBoard.Service.Interfaces;

public interface ITransactionCategoryService
{
    Task CreateTransactionCategoryAsync(Guid userGuid, ICategoryCreateRequest request);
    Task<IEnumerable<ICategoryResponse>> ReadTransactionCategoriesAsync(Guid userGuid, Guid categoryGuid = default);
    Task UpdateTransactionCategoryAsync(Guid userGuid, ICategoryUpdateRequest request);
    Task DeleteTransactionCategoryAsync(Guid userGuid, Guid guid);
}
