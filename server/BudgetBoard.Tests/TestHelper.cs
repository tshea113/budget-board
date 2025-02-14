using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace BudgetBoard.IntegrationTests;

internal class TestHelper
{
    public readonly ApplicationUser demoUser = new()
    {
        Id = new Guid(),
        Accounts = []
    };


    public readonly UserDataContext userDataContext;
    public TestHelper()
    {
        var builder = new DbContextOptionsBuilder<UserDataContext>();
        builder.UseInMemoryDatabase(databaseName: "UserDbInMemory");

        var dbContextOptions = builder.Options;
        userDataContext = new UserDataContext(dbContextOptions);
        // Delete existing db before creating a new one
        userDataContext.Database.EnsureDeleted();
        userDataContext.Database.EnsureCreated();

        // Seed a demo user
        userDataContext.Users.Add(demoUser);
        userDataContext.SaveChanges();
    }
}
