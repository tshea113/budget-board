using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;

namespace BudgetBoard.Utils;
public class UserHandler
{
    UserHandler() { }

    public static void UpdateLastSync(User userData, UserDataContext userDataContext)
    {
        userData.LastSync = DateTime.Now.ToUniversalTime();
        userDataContext.SaveChanges();
    }
}
