using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;

namespace BudgetBoard.Utils;
public class UserHandler
{
    UserHandler() { }

    public static void UpdateLastSync(ApplicationUser userData, UserDataContext userDataContext)
    {
        userData.LastSync = DateTime.Now.ToUniversalTime();
        userDataContext.SaveChanges();
    }
}
