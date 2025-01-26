using BudgetBoard.Database.Data;
using BudgetBoard.WebAPI.Utils;
using Microsoft.EntityFrameworkCore;
using Quartz;

namespace BudgetBoard.WebAPI.Jobs;

[DisallowConcurrentExecution]
public class SyncBackgroundJob : IJob
{
    private readonly ILogger _logger;
    private readonly UserDataContext _userDataContext;
    private readonly SimpleFinHandler _simpleFinHandler;

    public SyncBackgroundJob(ILogger<SyncBackgroundJob> logger, UserDataContext userDataContext, IHttpClientFactory clientFactory)
    {
        _logger = logger;
        _userDataContext = userDataContext;
        _simpleFinHandler = new SimpleFinHandler(_userDataContext, clientFactory);
    }

    public async Task Execute(IJobExecutionContext context)
    {
        var users = _userDataContext.Users
            .Include(user => user.Accounts)
                .ThenInclude(a => a.Transactions)
            .Include(user => user.Accounts)
                .ThenInclude(a => a.Balances)
            .Include(user => user.Institutions)
            .AsSplitQuery()
                .ToList();

        foreach (var user in users)
        {
            try
            {
                if (user.AccessToken == string.Empty)
                {
                    continue;
                }

                _logger.LogInformation("Syncing SimpleFin data for {user}...", user.Email);

                long startDate;
                if (user.LastSync == DateTime.MinValue)
                {
                    // If we haven't synced before, sync the full 90 days of history
                    startDate = ((DateTimeOffset)DateTime.UtcNow).ToUnixTimeSeconds() - (Helpers.UNIX_MONTH * 3);
                }
                else
                {
                    var oneMonthAgo = ((DateTimeOffset)DateTime.UtcNow).ToUnixTimeSeconds() - Helpers.UNIX_MONTH;
                    var lastSyncWithBuffer = ((DateTimeOffset)user.LastSync).ToUnixTimeSeconds() - Helpers.UNIX_WEEK;

                    startDate = Math.Min(oneMonthAgo, lastSyncWithBuffer);
                }

                var simpleFinData = await _simpleFinHandler.GetAccountData(user.AccessToken, startDate);
                if (simpleFinData == null)
                {
                    continue;
                }

                await _simpleFinHandler.SyncAccountsAsync(user, simpleFinData.Accounts);
                await _simpleFinHandler.SyncTransactionsAsync(user, simpleFinData.Accounts);
                await _simpleFinHandler.SyncBalancesAsync(user, simpleFinData.Accounts);

                await UserHandler.UpdateLastSyncAsync(user, _userDataContext);

                _logger.LogInformation("Sync successful for {user}", user.Email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error syncing SimpleFin data for {user}", user.Email);
            }
        }
    }
}
