using BudgetBoard.Service.Models;

namespace BudgetBoard.Service.Interfaces;

public interface IGoalService
{
    Task CreateGoalAsync(Guid userGuid, IGoalCreateRequest request);
    Task<IEnumerable<IGoalResponse>> ReadGoalsAsync(Guid userGuid, bool includeInterest);
    Task UpdateGoalAsync(Guid userGuid, IGoalUpdateRequest request);
    Task DeleteGoalAsync(Guid userGuid, Guid guid);
    Task CompleteGoalAsync(Guid userGuid, Guid goalID, DateTime completedDate);
}
