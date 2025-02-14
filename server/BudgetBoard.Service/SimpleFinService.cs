using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using BudgetBoard.Service.Interfaces;
using BudgetBoard.Service.Models;
using BudgetBoard.Service.Types;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Globalization;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization.Metadata;

namespace BudgetBoard.Service;

public class SimpleFinService(
    IHttpClientFactory clientFactory,
    ILogger<ISimpleFinService> logger,
    UserDataContext userDataContext,
    UserManager<ApplicationUser> userManager,
    IAccountService accountService,
    IInstitutionService institutionService,
    ITransactionService transactionService,
    IBalanceService balanceService,
    IApplicationUserService applicationUserService) : ISimpleFinService
{
    public const long UNIX_MONTH = 2629743;
    public const long UNIX_WEEK = 604800;

    private static readonly JsonSerializerOptions s_readOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        TypeInfoResolver = new DefaultJsonTypeInfoResolver
        {
            Modifiers =
           {
                 static typeInfo =>
                 {
                       if (typeInfo.Type == typeof(ISimpleFinAccountData))
                       {
                             typeInfo.CreateObject = () => new SimpleFinAccountData();
                       }
                       else if (typeInfo.Type == typeof(ISimpleFinAccount))
                       {
                             typeInfo.CreateObject = () => new SimpleFinAccount();
                       }
                       else if (typeInfo.Type == typeof(ISimpleFinTransaction))
                       {
                         typeInfo.CreateObject = () => new SimpleFinTransaction();
                       }
                       else if (typeInfo.Type == typeof(ISimpleFinOrganization))
                       {
                         typeInfo.CreateObject = () => new SimpleFinOrganization();
                       }
                 }
           }
        }
    };

    private readonly IHttpClientFactory _clientFactory = clientFactory;
    private readonly ILogger<ISimpleFinService> _logger = logger;
    private readonly UserDataContext _userDataContext = userDataContext;
    private readonly UserManager<ApplicationUser> _userManager = userManager;

    private readonly IAccountService _accountService = accountService;
    private readonly IInstitutionService _institutionService = institutionService;
    private readonly ITransactionService _transactionService = transactionService;
    private readonly IBalanceService _balanceService = balanceService;
    private readonly IApplicationUserService _applicationUserService = applicationUserService;

    public async Task<IApplicationUser> GetUserData(ClaimsPrincipal user)
    {
        var userData = await GetCurrentUserAsync(_userManager.GetUserId(user) ?? string.Empty);
        if (userData == null)
        {
            _logger.LogError("Attempt to access authorized content by unauthorized user.");
            throw new Exception("You are not authorized to access this content.");
        }

        return userData;
    }

    public async Task<IEnumerable<string>> SyncAsync(IApplicationUser userData)
    {
        long startDate;
        if (userData.LastSync == DateTime.MinValue)
        {
            // If we haven't synced before, sync the full 90 days of history
            startDate = ((DateTimeOffset)DateTime.UtcNow).ToUnixTimeSeconds() - (UNIX_MONTH * 3);
        }
        else
        {
            var oneMonthAgo = ((DateTimeOffset)DateTime.UtcNow).ToUnixTimeSeconds() - UNIX_MONTH;
            var lastSyncWithBuffer = ((DateTimeOffset)userData.LastSync).ToUnixTimeSeconds() - UNIX_WEEK;

            startDate = Math.Min(oneMonthAgo, lastSyncWithBuffer);
        }

        var simpleFinData = await GetAccountData(userData.AccessToken, startDate);
        if (simpleFinData == null)
        {
            _logger.LogError("SimpleFin data not found.");
            throw new Exception("SimpleFin data not found.");
        }

        await SyncInstitutionsAsync(userData, simpleFinData.Accounts);
        await SyncAccountsAsync(userData, simpleFinData.Accounts);

        await _applicationUserService.UpdateApplicationUserAsync(userData, new ApplicationUserUpdateRequest
        {
            AccessToken = userData.AccessToken,
            LastSync = DateTime.Now.ToUniversalTime(),
        });

        return simpleFinData.Errors;
    }

    private async Task<ApplicationUser?> GetCurrentUserAsync(string id)
    {
        try
        {
            var users = await _userDataContext.ApplicationUsers
                .Include(u => u.Accounts)
                    .ThenInclude(a => a.Transactions)
                .Include(u => u.Accounts)
                    .ThenInclude(a => a.Balances)
                .Include(u => u.Institutions)
                .AsSplitQuery()
                .ToListAsync();
            return users.Single(u => u.Id == new Guid(id));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            return null;
        }
    }

    private static SimpleFinData GetUrlCredentials(string accessToken)
    {
        string[] url = accessToken.Split("//");
        string[] data = url.Last().Split("@");
        var auth = data.First();
        var baseUrl = url.First() + "//" + data.Last();

        return new SimpleFinData(auth, baseUrl);
    }

    private async Task<ISimpleFinAccountData> GetAccountData(string accessToken, long startDate)
    {
        SimpleFinData data = GetUrlCredentials(accessToken);

        var startArg = "?start-date=" + startDate.ToString();

        var request = new HttpRequestMessage(
            HttpMethod.Get,
            data.BaseUrl + "/accounts" + startArg);
        var client = _clientFactory.CreateClient();
        var byteArray = Encoding.ASCII.GetBytes(data.Auth);
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));

        var response = await client.SendAsync(request);
        var jsonString = await response.Content.ReadAsStringAsync();

        return JsonSerializer.Deserialize<ISimpleFinAccountData>(jsonString, s_readOptions) ?? new SimpleFinAccountData();
    }

    private async Task SyncInstitutionsAsync(IApplicationUser userData, IEnumerable<ISimpleFinAccount> accountsData)
    {
        var institutions = accountsData.Select(a => a.Org).Distinct();
        foreach (var institution in institutions)
        {
            if (institution == null) continue;
            if (userData.Institutions.Any(i => i.Name == institution.Name)) continue;

            var newInstitution = new InstitutionCreateRequest
            {
                Name = institution.Name ?? string.Empty,
                UserID = userData.Id,
            };

            await _institutionService.CreateInstitutionAsync(userData, newInstitution);
        }
    }

    private async Task SyncAccountsAsync(IApplicationUser userData, IEnumerable<ISimpleFinAccount> accountsData)
    {
        foreach (var accountData in accountsData)
        {
            var institutionId = userData.Institutions.FirstOrDefault(institution => institution.Name == accountData.Org.Name)?.ID;

            var foundAccount = userData.Accounts.SingleOrDefault(a => a.SyncID == accountData.Id);
            if (foundAccount != null)
            {
                foundAccount.InstitutionID = institutionId;
                _userDataContext.SaveChanges();
            }
            else
            {
                var newAccount = new AccountCreateRequest
                {
                    SyncID = accountData.Id,
                    Name = accountData.Name,
                    InstitutionID = institutionId,
                };

                await _accountService.CreateAccountAsync(userData, newAccount);
            }

            await SyncTransactionsAsync(userData, accountData.Id, accountData.Transactions);
            await SyncBalancesAsync(userData, accountData.Id, accountData);
        }
    }

    private async Task SyncTransactionsAsync(IApplicationUser userData, string syncId, IEnumerable<ISimpleFinTransaction> transactionsData)
    {
        if (!transactionsData.Any()) return;

        var userAccount = userData.Accounts.FirstOrDefault(a => (a.SyncID ?? string.Empty).Equals(syncId));
        var userTransactions = userAccount?.Transactions.OrderByDescending(t => t.Date).ToList();

        // User account should never be null here, but let's not make a bad problem worse.
        if (userAccount != null)
        {
            foreach (var transactionData in transactionsData)
            {
                if ((userTransactions ?? []).Any(t => (t.SyncID ?? string.Empty).Equals(transactionData.Id)))
                {
                    // Transaction already exists.
                    continue;
                }
                else
                {
                    var newTransaction = new TransactionCreateRequest
                    {
                        SyncID = transactionData.Id,
                        Amount = decimal.Parse(transactionData.Amount),
                        Date = transactionData.Pending ? DateTime.UnixEpoch.AddSeconds(transactionData.TransactedAt) : DateTime.UnixEpoch.AddSeconds(transactionData.Posted),
                        MerchantName = transactionData.Description,
                        Source = TransactionSource.SimpleFin.Value,
                        AccountID = userAccount.ID,
                    };

                    await _transactionService.CreateTransactionAsync(userData, newTransaction);
                }
            }
        }
    }

    private async Task SyncBalancesAsync(IApplicationUser userData, string syncId, ISimpleFinAccount accountData)
    {
        var foundAccount = userData.Accounts.SingleOrDefault(a => a.SyncID == syncId);

        // User account should never be null here, but let's not make a bad problem worse.
        if (foundAccount != null)
        {
            var balanceDates = foundAccount.Balances.Select(b => b.DateTime);
            /**
             * We should only update the balance if account has no balances or the
             * last balance is older than the last balance in the SimpleFin data.
             */
            if (!balanceDates.Any() ||
                balanceDates.Max() < DateTime.UnixEpoch.AddSeconds(accountData.BalanceDate))
            {
                var newBalance = new BalanceCreateRequest
                {
                    Amount = decimal.Parse(accountData.Balance, CultureInfo.InvariantCulture.NumberFormat),
                    DateTime = DateTime.UnixEpoch.AddSeconds(accountData.BalanceDate),
                    AccountID = foundAccount.ID,
                };

                await _balanceService.CreateBalancesAsync(userData, newBalance);
            }
        }
    }

    public async Task<HttpResponseMessage> ReadAccessToken(string setupToken)
    {
        // SimpleFin tokens are Base64-encoded URLs on which a POST request will
        // return the access URL for getting bank data.

        byte[] data = Convert.FromBase64String(setupToken);
        string decodedString = Encoding.UTF8.GetString(data);

        var request = new HttpRequestMessage(
            HttpMethod.Post,
            decodedString);
        var client = _clientFactory.CreateClient();
        var response = await client.SendAsync(request);

        return response;
    }
}
