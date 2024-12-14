using BudgetBoard.Database.Models;

namespace BudgetBoard.Models;

public class InstitutionIndexRequest
{
    public Guid ID { get; set; }
    public int Index { get; set; }
}

public class InstitutionResponse
{
    public Guid ID { get; set; }
    public string Name { get; set; }
    public int Index { get; set; }
    public Guid UserID { get; set; }
    public ICollection<AccountResponse> Accounts { get; set; }

    public InstitutionResponse(Institution institution)
    {
        ID = institution.ID;
        Name = institution.Name;
        Index = institution.Index;
        UserID = institution.UserID;
        Accounts = institution.Accounts.Select(a => new AccountResponse(a)).ToList();
    }
}
