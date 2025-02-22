using Bogus;
using BudgetBoard.Database.Models;

namespace BudgetBoard.IntegrationTests.Fakers;

class TransactionCategoryFaker : Faker<Category>
{
    public TransactionCategoryFaker()
    {
        RuleFor(c => c.ID, f => f.Random.Guid())
            .RuleFor(c => c.Value, f => f.Lorem.Word())
            .RuleFor(c => c.Parent, f => f.Lorem.Word());
    }
}
