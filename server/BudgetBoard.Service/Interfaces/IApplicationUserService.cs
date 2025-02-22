using BudgetBoard.Service.Models;

namespace BudgetBoard.Service.Interfaces;

public interface IApplicationUserService
{
    Task<IApplicationUserResponse> ReadApplicationUserAsync(Guid userGuid);
    Task UpdateApplicationUserAsync(Guid userGuid, IApplicationUserUpdateRequest user);
}
