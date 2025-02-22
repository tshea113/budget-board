using BudgetBoard.Database.Data;
using BudgetBoard.Service.Interfaces;
using BudgetBoard.Service.Models;
using BudgetBoard.WebAPI.Utils;
using Microsoft.EntityFrameworkCore;
using Quartz;

namespace BudgetBoard.WebAPI.Jobs;

[DisallowConcurrentExecution]
public class SyncBackgroundJob(ILogger<SyncBackgroundJob> logger, UserDataContext userDataContext, ISimpleFinService simpleFinService, IApplicationUserService applicationUserService) : IJob
{
    private readonly ILogger _logger = logger;
    private readonly UserDataContext _userDataContext = userDataContext;
    private readonly ISimpleFinService _simpleFinService = simpleFinService;
    private readonly IApplicationUserService _applicationUserService = applicationUserService;

    public async Task Execute(IJobExecutionContext context)
    {
        var users = _userDataContext.ApplicationUsers
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

                await _simpleFinService.SyncAsync(user);

                await _applicationUserService.UpdateApplicationUserAsync(user.Id, new ApplicationUserUpdateRequest
                {
                    AccessToken = user.AccessToken,
                    LastSync = DateTime.Now.ToUniversalTime()
                });

                _logger.LogInformation("Sync successful for {user}", user.Email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error syncing SimpleFin data for {user}", user.Email);
            }
        }
    }
}
