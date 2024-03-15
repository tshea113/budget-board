using BudgetBoard.Models.SimpleFinDetails;
using System.Text;
using System.Text.Json;

namespace BudgetBoard.Utils;

public class SimpleFinHandler
{
    private readonly IHttpClientFactory _clientFactory;

    public SimpleFinHandler(IHttpClientFactory clientFactory)
    {
        _clientFactory = clientFactory;
    }

    public async Task<AccountSet?> GetAccountData(string accessToken)
    {
        SimpleFinData data = GetUrlCredentials(accessToken);

        var request = new HttpRequestMessage(
            HttpMethod.Get,
            data.BaseUrl + "/accounts");
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
        string decodedString = System.Text.Encoding.UTF8.GetString(data);

        var request = new HttpRequestMessage(
            HttpMethod.Post,
            decodedString);
        var client = _clientFactory.CreateClient();
        var response = await client.SendAsync(request);

        return response;
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
