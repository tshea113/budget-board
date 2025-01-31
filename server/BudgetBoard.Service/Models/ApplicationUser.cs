using BudgetBoard.Database.Models;
using BudgetBoard.Service.Types;
using System.Text.Json.Serialization;

namespace BudgetBoard.Service.Models;

public interface IApplicationUserUpdateRequest
{
    string AccessToken { get; set; }
    DateTime LastSync { get; set; }
}
public class ApplicationUserUpdateRequest : IApplicationUserUpdateRequest
{
    public string AccessToken { get; set; }
    public DateTime LastSync { get; set; }

    [JsonConstructor]
    public ApplicationUserUpdateRequest()
    {
        AccessToken = string.Empty;
        LastSync = DateTime.MinValue;
    }
}

public interface IApplicationUserResponse
{
    Guid ID { get; set; }
    bool AccessToken { get; set; }
    DateTime LastSync { get; set; }
    IEnumerable<IAccountResponse> Accounts { get; set; }
    IEnumerable<IBudgetResponse> Budgets { get; set; }
    IEnumerable<IGoalResponse> Goals { get; set; }
}
public class ApplicationUserResponse : IApplicationUserResponse
{
    public Guid ID { get; set; }
    public bool AccessToken { get; set; }
    public DateTime LastSync { get; set; }
    public IEnumerable<IAccountResponse> Accounts { get; set; }
    public IEnumerable<IBudgetResponse> Budgets { get; set; }
    public IEnumerable<IGoalResponse> Goals { get; set; }

    [JsonConstructor]
    public ApplicationUserResponse()
    {
        ID = new Guid();
        AccessToken = false;
        LastSync = DateTime.MinValue;
        Accounts = [];
        Budgets = [];
        Goals = [];
    }

    public ApplicationUserResponse(ApplicationUser user)
    {
        ID = user.Id;
        AccessToken = (user.AccessToken != string.Empty);
        LastSync = user.LastSync;
        Accounts = user.Accounts.Select(a => new AccountResponse(a));
        Budgets = user.Budgets.Select(b => new BudgetResponse(b));
        Goals = user.Goals.Select(g => new GoalResponse(g));
    }
}
