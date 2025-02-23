using BudgetBoard.Service.Models;

namespace BudgetBoard.Service.Interfaces;

public interface IInstitutionService
{
    Task CreateInstitutionAsync(Guid userGuid, IInstitutionCreateRequest request);
    Task<IEnumerable<IInstitutionResponse>> ReadInstitutionsAsync(Guid userGuid, Guid guid = default);
    Task UpdateInstitutionAsync(Guid userGuid, IInstitutionUpdateRequest request);
    Task DeleteInstitutionAsync(Guid userGuid, Guid id, bool deleteTransactions);
    Task OrderInstitutionsAsync(Guid userGuid, IEnumerable<IInstitutionIndexRequest> orderedInstitutions);
}
