using BudgetBoard.Database.Models;

namespace BudgetBoard.Utils;

public static class GoalHelper
{
    public static DateTime EstimateGoalCompleteDate(Goal goal, bool includeInterest = false)
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
                amountLeft = goal.Amount - goal.InitialAmount - totalBalance;
            }

            // If a complete date has not been set, then a monthly contribution is required.
            var numberOfMonthsLeftWithoutInterest = Math.Ceiling(amountLeft / (goal.MonthlyContribution ?? 0));

            var interestRate = EstimateInterestRate(goal);
            var numberOfMonthsLeftWithInterest = Math.Ceiling(-1 * Math.Log((double)(1 - (amountLeft * interestRate / goal.MonthlyContribution ?? 0))) / Math.Log((double)(1 + interestRate)));

            // This include interest calculation is very shakey, so only enable it if requested.
            if (includeInterest)
            {
                return new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1)
                    .AddMonths(
                        (Double.IsNaN(numberOfMonthsLeftWithInterest) ?
                            (int)numberOfMonthsLeftWithoutInterest :
                            (int)numberOfMonthsLeftWithInterest));
            }

            return new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1)
                .AddMonths((int)numberOfMonthsLeftWithoutInterest);
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
                amountLeft = goal.Amount - goal.InitialAmount - totalBalance;
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

    public static decimal EstimateInterestRate(Goal goal)
    {
        decimal currentBalance = 0;
        decimal formerBalance = 0;
        decimal totalTransactions = 0;

        var accounts = goal.Accounts;
        foreach (var account in accounts)
        {
            // Order balances by date in descending order and average any duplicate dates.
            var orderedBalances = account.Balances.OrderByDescending(b => b.DateTime)
                .GroupBy(b => b.DateTime.Date)
                .Select(g => new Balance
                {
                    ID = g.First().ID,
                    Amount = g.Average(b => b.Amount),
                    DateTime = g.Key,
                    AccountID = g.First().AccountID,

                });
            var mostRecentBalance = orderedBalances.FirstOrDefault();
            if (mostRecentBalance == null)
            {
                // The account has no balances, so we can't estimate an interest rate.
                continue;
            }

            // Get balances from last month and the month before it.
            var balances = orderedBalances.Where(b =>
                b.DateTime.Month == mostRecentBalance.DateTime.AddMonths(-1).Month ||
                b.DateTime.Month == mostRecentBalance.DateTime.AddMonths(-2).Month);

            // Find two balances that are one month apart.
            var groupedBalancesByDay = balances.GroupBy(b => b.DateTime.Date.Day);
            var balancesFromSameDate = groupedBalancesByDay.FirstOrDefault(g => g.Count() == 2);

            if (balancesFromSameDate == null)
            {
                // We need at least two balances to estimate an interest rate.
                continue;
            }

            currentBalance += balancesFromSameDate.First().Amount;
            formerBalance += balancesFromSameDate.Last().Amount;

            totalTransactions += Math.Abs(account.Transactions
                .Where(t =>
                    !t.Deleted.HasValue &&
                    !(t.Subcategory ?? string.Empty).Equals("Interest Income") &&
                    t.Date.Date >= balancesFromSameDate.Last().DateTime.Date &&
                    t.Date.Date <= balancesFromSameDate.First().DateTime.Date)
                .Sum(t => t.Amount));
        }

        var balanceDifference = Math.Abs(formerBalance - currentBalance);

        return Math.Abs((totalTransactions - balanceDifference) / formerBalance); ;
    }
}
