using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using BudgetBoard.Models.SimpleFinDetails;
using System.Globalization;
using System.Text;
using System.Text.Json;

namespace BudgetBoard.Utils;

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
                // TODO: Currently only syncing the account balance and the date for that balance. Should we also
                // sync the other info? Do we expect that to change?
                foundAccount.CurrentBalance = float.Parse(accountData.Balance, CultureInfo.InvariantCulture.NumberFormat);
                foundAccount.BalanceDate = DateTime.UnixEpoch.AddSeconds(accountData.BalanceDate);
            }
            else
            {
                var newAccount = new Database.Models.Account
                {
                    SyncID = accountData.Id,
                    Name = accountData.Name,
                    Institution = accountData.Org.Name ?? string.Empty,
                    CurrentBalance = float.Parse(accountData.Balance, CultureInfo.InvariantCulture.NumberFormat),
                    BalanceDate = DateTime.UnixEpoch.AddSeconds(accountData.BalanceDate),
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
                // TODO: Maybe this should be 24 hours? I think it could be 24 if we auto sync.//
                if (balanceDates.Count() == 0 || balanceDates.Max().AddHours(12) < DateTime.UnixEpoch.AddSeconds(accountData.BalanceDate))
                {
                    var newBalance = new Database.Models.Balance
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
