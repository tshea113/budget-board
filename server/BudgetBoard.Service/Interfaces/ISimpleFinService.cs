namespace BudgetBoard.Service.Interfaces;

public interface ISimpleFinService
{
    Task<IEnumerable<string>> SyncAsync(Guid userGuid);
    Task UpdateAccessTokenFromSetupToken(Guid userGuid, string setupToken);
}
