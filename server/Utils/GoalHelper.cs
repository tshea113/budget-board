using BudgetBoard.Database.Models;

namespace BudgetBoard.Utils;

public static class GoalHelper
{
    public static DateTime EstimateGoalCompleteDate(Goal goal)
    {
        if (goal.CompleteDate.HasValue)
        {
            // The user has set a target date, so we'll use that.
            return goal.CompleteDate.Value;
        }
        else
        {
            decimal totalBalance = goal.Accounts.Sum(a => a.Balances.OrderByDescending(b => b.DateTime).FirstOrDefault()?.Amount ?? 0);
            decimal amountLeft;
            if (goal.InitialAmount < 0)
            {
                // The amount for a debt is just the value of the debt.
                amountLeft = Math.Abs(totalBalance);
            }
            else
            {
                // The initial amount is the account balance at the time the goal was created.
                // If a user wishes to include the starting balance in the goal,
                // the initial amount will be set to zero.
                amountLeft = goal.Amount - (goal.InitialAmount ?? 0) - totalBalance;
            }

            // If a complete date has not been set, then a monthly contribution is required.
            var numberOfMonthsLeft = Math.Ceiling(amountLeft / (goal.MonthlyContribution ?? 0));
            return new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1).AddMonths((int)numberOfMonthsLeft);

        }
    }

    public static decimal EstimateGoalMonthlyContribution(Goal goal)
    {
        if (goal.MonthlyContribution.HasValue)
        {
            return goal.MonthlyContribution.Value;
        }
        else
        {
            decimal totalBalance = goal.Accounts.Sum(a => a.Balances.OrderByDescending(b => b.DateTime).FirstOrDefault()?.Amount ?? 0);
            decimal amountLeft;
            if (goal.InitialAmount < 0)
            {
                // The amount for a debt is just the value of the debt.
                amountLeft = Math.Abs(totalBalance);
            }
            else
            {
                // The initial amount is the account balance at the time the goal was created.
                // If a user wishes to include the starting balance in the goal,
                // the initial amount will be set to zero.
                amountLeft = goal.Amount - (goal.InitialAmount ?? 0) - totalBalance;
            }

            // If a monthly contribution has not been set, then a complete date is required.
            if (!goal.CompleteDate.HasValue)
            {
                throw new ArgumentException("A monthly contribution cannot be estimated without a target date.");
            }

            var numberOfMonthsLeft = ((goal.CompleteDate.Value.Year - DateTime.Now.Year) * 12) + (goal.CompleteDate.Value.Month - DateTime.Now.Month);
            return amountLeft / numberOfMonthsLeft;
        }
    }
}
