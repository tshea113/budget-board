using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using BudgetBoard.WebAPI.Models.SimpleFinDetails;
using System.Globalization;
using System.Text;
using System.Text.Json;

namespace BudgetBoard.WebAPI.Utils;

public class SimpleFinHandler
{
    private readonly IHttpClientFactory _clientFactory;
    private readonly UserDataContext _userDataContext;

    public SimpleFinHandler(UserDataContext context, IHttpClientFactory clientFactory)
    {
        _userDataContext = context;
        _clientFactory = clientFactory;
    }

    public async Task<AccountSet?> GetAccountData(string accessToken, long startDate)
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
        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };
        AccountSet? accountData = JsonSerializer.Deserialize<AccountSet>(jsonString, options);

        return accountData;
    }

    public async Task<HttpResponseMessage> GetAccessToken(string setupToken)
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

    public async Task SyncAccountsAsync(ApplicationUser user, List<Models.SimpleFinDetails.Account> accountsData)
    {
        foreach (var accountData in accountsData)
        {
            var foundAccount = AccountHandler.GetAccount(user, accountData.Id);
            if (foundAccount != null)
            {
                foundAccount.InstitutionID = await AccountHandler.SyncInstitution(user, _userDataContext, accountData.Org);
            }
            else
            {
                var newAccount = new Database.Models.Account
                {
                    SyncID = accountData.Id,
                    Name = accountData.Name,
                    InstitutionID = await AccountHandler.SyncInstitution(user, _userDataContext, accountData.Org),
                    UserID = user.Id
                };

                await AccountHandler.AddAccountAsync(user, _userDataContext, newAccount);
            }
        }
    }

    public async Task SyncTransactionsAsync(ApplicationUser user, List<Models.SimpleFinDetails.Account> accounts)
    {
        var userTransactions = TransactionHandler.GetTransactions(user);
        foreach (var account in accounts)
        {
            var userAccount = user.Accounts.FirstOrDefault(t => t.SyncID == account.Id);
            if (userAccount != null)
            {
                foreach (var transaction in account.Transactions)
                {
                    if (userTransactions.Any(t => t.SyncID == transaction.Id))
                    {
                        // Transaction already exists.
                        continue;
                    }
                    else
                    {
                        var newTransaction = new Database.Models.Transaction
                        {
                            SyncID = transaction.Id,
                            Amount = decimal.Parse(transaction.Amount),
                            Date = transaction.Pending ? DateTime.UnixEpoch.AddSeconds(transaction.TransactedAt) : DateTime.UnixEpoch.AddSeconds(transaction.Posted),
                            MerchantName = transaction.Description,
                            Pending = transaction.Pending,
                            Source = "SimpleFin",
                            AccountID = userAccount.ID,
                        };

                        await TransactionHandler.AddTransactionAsync(user, _userDataContext, newTransaction);
                    }
                }
            }
        }
    }

    public async Task SyncBalancesAsync(ApplicationUser user, List<Models.SimpleFinDetails.Account> accountsData)
    {
        foreach (var accountData in accountsData)
        {
            var foundAccount = AccountHandler.GetAccount(user, accountData.Id);
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
                    var newBalance = new Balance
                    {
                        Amount = decimal.Parse(accountData.Balance, CultureInfo.InvariantCulture.NumberFormat),
                        DateTime = DateTime.UnixEpoch.AddSeconds(accountData.BalanceDate),
                        AccountID = foundAccount.ID,
                    };

                    await BalanceHandler.AddBalanceAsync(user, _userDataContext, newBalance);
                }
            }
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

    private class SimpleFinData
    {
        public string Auth { get; }
        public string BaseUrl { get; }

        public SimpleFinData(string auth, string baseUrl)
        {
            Auth = auth;
            BaseUrl = baseUrl;
        }
    }
}
