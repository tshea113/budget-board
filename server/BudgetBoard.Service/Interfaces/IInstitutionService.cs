using BudgetBoard.Service.Models;
using System.Security.Claims;

namespace BudgetBoard.Service.Interfaces;

public interface IInstitutionService
{
    Task CreateInstitution(ClaimsPrincipal user, IInstitutionCreateRequest request);
    Task<IEnumerable<IInstitutionResponse>> ReadInstitutions(ClaimsPrincipal user, Guid guid = default);
    Task UpdateInstitution(ClaimsPrincipal user, IInstitutionUpdateRequest request);
    Task DeleteInstitution(ClaimsPrincipal user, Guid id, bool deleteTransactions);
    Task OrderInstitutions(ClaimsPrincipal user, IEnumerable<IInstitutionIndexRequest> orderedInstitutions);
}
