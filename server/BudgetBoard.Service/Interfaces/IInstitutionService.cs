using BudgetBoard.Database.Models;
using BudgetBoard.Service.Models;
using System.Security.Claims;

namespace BudgetBoard.Service.Interfaces;

public interface IInstitutionService
{
    Task<IApplicationUser> GetUserData(ClaimsPrincipal user);
    Task CreateInstitutionAsync(IApplicationUser userData, IInstitutionCreateRequest request);
    IEnumerable<IInstitutionResponse> ReadInstitutionsAsync(IApplicationUser userData, Guid guid = default);
    Task UpdateInstitutionAsync(IApplicationUser userData, IInstitutionUpdateRequest request);
    Task DeleteInstitutionAsync(IApplicationUser userData, Guid id, bool deleteTransactions);
    Task OrderInstitutionsAsync(IApplicationUser userData, IEnumerable<IInstitutionIndexRequest> orderedInstitutions);
}
