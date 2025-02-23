using Bogus;
using BudgetBoard.Database.Models;

namespace BudgetBoard.IntegrationTests.Fakers;

public class BalanceFaker : Faker<Balance>
{
    public ICollection<Guid> AccountIds { get; set; }
    public BalanceFaker()
    {
        AccountIds = [];

        RuleFor(b => b.ID, f => Guid.NewGuid())
            .RuleFor(b => b.Amount, f => f.Finance.Amount())
            .RuleFor(b => b.DateTime, f => f.Date.Past());
    }
}
