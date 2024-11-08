using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;

namespace BudgetBoard.Utils;
public static class UserHandler
{
    public static async Task UpdateLastSyncAsync(ApplicationUser userData, UserDataContext userDataContext)
    {
        userData.LastSync = DateTime.Now.ToUniversalTime();
        await userDataContext.SaveChangesAsync();
    }
}
