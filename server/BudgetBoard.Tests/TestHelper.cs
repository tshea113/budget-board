using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using BudgetBoard.IntegrationTests.Fakers;
using Microsoft.EntityFrameworkCore;

namespace BudgetBoard.IntegrationTests;

internal class TestHelper
{
    public readonly UserDataContext UserDataContext;
    public readonly ApplicationUser demoUser = _applicationUserFaker.Generate();

    private static readonly ApplicationUserFaker _applicationUserFaker = new();

    public TestHelper()
    {
        var builder = new DbContextOptionsBuilder<UserDataContext>();
        builder.UseInMemoryDatabase(new Guid().ToString());

        var dbContextOptions = builder.Options;
        UserDataContext = new UserDataContext(dbContextOptions);
        // Delete existing db before creating a new one
        UserDataContext.Database.EnsureDeleted();
        UserDataContext.Database.EnsureCreated();

        // Seed a demo user
        UserDataContext.Users.Add(demoUser);
        UserDataContext.SaveChanges();
    }
}
