using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using BudgetBoard.WebAPI.Models.SimpleFinDetails;

namespace BudgetBoard.WebAPI.Utils;

public static class AccountHandler
{
    public static Database.Models.Account? GetAccount(ApplicationUser userData, string simpleFinId) =>
        userData.Accounts.FirstOrDefault(a => a.SyncID == simpleFinId);

    public static async Task AddAccountAsync(ApplicationUser userData, UserDataContext userDataContext, BudgetBoard.Database.Models.Account account)
    {
        userData.Accounts.Add(account);
        await userDataContext.SaveChangesAsync();
    }

    public static async Task<bool> UpdateAccountAsync(ApplicationUser userData, UserDataContext userDataContext, BudgetBoard.Database.Models.Account newAccount)
    {
        Database.Models.Account? account = userData.Accounts.Single(a => a.ID == newAccount.ID);
        if (account == null) return false;

        account.Name = newAccount.Name;
        account.Type = newAccount.Type;
        account.Subtype = newAccount.Subtype;

        await userDataContext.SaveChangesAsync();
        return true;
    }

    public static async Task<Guid> SyncInstitution(ApplicationUser userData, UserDataContext userDataContext, Organization org)
    {
        var institution = userData.Institutions.FirstOrDefault(i => i.Name.Equals(org.Name));

        if (institution == null)
        {
            institution = new Institution
            {
                Name = org.Name ?? string.Empty,
                UserID = userData.Id,
            };

            userData.Institutions.Add(institution);
            await userDataContext.SaveChangesAsync();

            return userData.Institutions.First(institution => institution.Name == org.Name).ID;
        }

        return institution.ID;
    }
}
