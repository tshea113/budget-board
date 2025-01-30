using BudgetBoard.Service.Models;
using System.Security.Claims;

namespace BudgetBoard.Service.Interfaces;

public interface IInstitutionService
{
    Task CreateInstitutionAsync(ClaimsPrincipal user, IInstitutionCreateRequest request);
    Task<IEnumerable<IInstitutionResponse>> ReadInstitutionsAsync(ClaimsPrincipal user, Guid guid = default);
    Task UpdateInstitutionAsync(ClaimsPrincipal user, IInstitutionUpdateRequest request);
    Task DeleteInstitutionAsync(ClaimsPrincipal user, Guid id, bool deleteTransactions);
    Task OrderInstitutionsAsync(ClaimsPrincipal user, IEnumerable<IInstitutionIndexRequest> orderedInstitutions);
}
