using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using BudgetBoard.Service.Interfaces;
using BudgetBoard.Service.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BudgetBoard.Service;

public class GoalService(ILogger<IGoalService> logger, UserDataContext userDataContext) : IGoalService
{
    private readonly ILogger<IGoalService> _logger = logger;
    private readonly UserDataContext _userDataContext = userDataContext;

    public async Task CreateGoalAsync(Guid userGuid, IGoalCreateRequest createdGoal)
    {
        var userData = await GetCurrentUserAsync(userGuid.ToString());
        decimal runningBalance = 0.0M;
        var accounts = new List<Account>();
        foreach (var accountId in createdGoal.AccountIds)
        {
            var account = userData.Accounts.FirstOrDefault((a) => a.ID == accountId);
            if (account == null)
            {
                _logger.LogError("Attempt to create goal with invalid account.");
                throw new Exception("The account you are trying to use does not exist.");
            }

            runningBalance += account.Balances.OrderByDescending(b => b.DateTime).FirstOrDefault()?.Amount ?? 0;
            accounts.Add(account);
        }

        var newGoal = new Goal
        {
            Name = createdGoal.Name,
            CompleteDate = createdGoal.CompleteDate,
            Amount = createdGoal.Amount,
            MonthlyContribution = createdGoal.MonthlyContribution,
            Accounts = accounts,
            UserID = userData.Id
        };

        if (!createdGoal.InitialAmount.HasValue)
        {
            // The frontend will set the initial balance if we don't want to include existing balances
            // in the goal.
            newGoal.InitialAmount = runningBalance;
        }
        else
        {
            newGoal.InitialAmount = createdGoal.InitialAmount.Value;
        }

        userData.Goals.Add(newGoal);
        await _userDataContext.SaveChangesAsync();
    }

    public async Task<IEnumerable<IGoalResponse>> ReadGoalsAsync(Guid userGuid, bool includeInterest)
    {
        var userData = await GetCurrentUserAsync(userGuid.ToString());
        var goalsResponse = new List<IGoalResponse>();
        var goals = userData.Goals.ToList();
        foreach (var goal in goals)
        {
            goalsResponse.Add(
                new GoalResponse(goal)
                {
                    CompleteDate = EstimateGoalCompleteDate(goal, includeInterest),
                    // Have to manually set this, since we override the CompleteDate in the constructor.
                    IsCompleteDateEditable = goal.CompleteDate != null,
                    MonthlyContribution = EstimateGoalMonthlyContribution(goal, includeInterest),
                    // Have to manually set this, since we override the MonthlyContribution in the constructor.
                    IsMonthlyContributionEditable = goal.MonthlyContribution != null,
                    // This is a very shakey calculation, so only include it if requested.
                    // For now, we will just apply this to loans.
                    // The interest rate is estimated by month, so need to calculate the APR.
                    EstimatedInterestRate = (includeInterest && goal.Amount == 0) ? EstimateInterestRate(goal) * 12 : null
                }
            );
        }

        return goalsResponse;
    }

    public async Task UpdateGoalAsync(Guid userGuid, IGoalUpdateRequest updatedGoal)
    {
        var userData = await GetCurrentUserAsync(userGuid.ToString());
        var goal = userData.Goals.FirstOrDefault(g => g.ID == updatedGoal.ID);
        if (goal == null)
        {
            _logger.LogError("Attempt to update goal that does not exist.");
            throw new Exception("The goal you are trying to update does not exist.");
        }

        goal.Name = updatedGoal.Name;
        goal.Amount = updatedGoal.Amount;
        goal.CompleteDate = updatedGoal.IsCompleteDateEditable ? updatedGoal.CompleteDate : goal.CompleteDate;
        goal.MonthlyContribution = updatedGoal.IsMonthlyContributionEditable ? updatedGoal.MonthlyContribution : goal.MonthlyContribution;

        await _userDataContext.SaveChangesAsync();
    }

    public async Task DeleteGoalAsync(Guid userGuid, Guid guid)
    {
        var userData = await GetCurrentUserAsync(userGuid.ToString());
        var goal = userData.Goals.FirstOrDefault(g => g.ID == guid);
        if (goal == null)
        {
            _logger.LogError("Attempt to delete goal that does not exist.");
            throw new Exception("The goal you are trying to delete does not exist.");
        }

        _userDataContext.Goals.Remove(goal);
        await _userDataContext.SaveChangesAsync();
    }

    private async Task<ApplicationUser> GetCurrentUserAsync(string id)
    {
        List<ApplicationUser> users;
        ApplicationUser? foundUser;
        try
        {
            users = await _userDataContext.ApplicationUsers
                .Include(u => u.Goals)
                .ThenInclude((g) => g.Accounts)
                .ThenInclude((a) => a.Transactions)
                .Include(u => u.Accounts)
                .ThenInclude(a => a.Balances)
                .AsSplitQuery()
                .ToListAsync();
            foundUser = users.FirstOrDefault(u => u.Id == new Guid(id));
        }
        catch (Exception ex)
        {
            _logger.LogError("An error occurred while retrieving the user data: {ExceptionMessage}", ex.Message);
            throw new Exception("An error occurred while retrieving the user data.");
        }

        if (foundUser == null)
        {
            _logger.LogError("Attempt to create an account for an invalid user.");
            throw new Exception("Provided user not found.");
        }

        return foundUser;
    }

    private static DateTime EstimateGoalCompleteDate(Goal goal, bool includeInterest = false)
    {
        if (goal.CompleteDate.HasValue) return goal.CompleteDate.Value;

        if (goal.MonthlyContribution == null || goal.MonthlyContribution == 0)
        {
            // If a complete date has not been set, then a monthly contribution is required.
            throw new ArgumentException("A target date cannot be estimated without a monthly contribution.");
        }

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

        var numberOfMonthsLeftWithoutInterest = Math.Ceiling(amountLeft / (goal.MonthlyContribution ?? 0));

        // This include interest calculation is very shakey, so only enable it if requested.
        // For now, we will just apply this to loans.
        if (includeInterest && goal.Amount == 0)
        {
            var interestRate = EstimateInterestRate(goal);
            var numberOfMonthsLeftWithInterest = Math.Ceiling(-1 * Math.Log((double)(1 - (amountLeft * interestRate / goal.MonthlyContribution ?? 0))) / Math.Log((double)(1 + interestRate)));

            // If the interest rate calculation fails, return the value without the calculation.
            return new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1)
                .AddMonths(
                    (Double.IsNaN(numberOfMonthsLeftWithInterest) ?
                        (int)numberOfMonthsLeftWithoutInterest :
                        (int)numberOfMonthsLeftWithInterest));
        }

        return new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1)
            .AddMonths((int)numberOfMonthsLeftWithoutInterest);
    }

    private static decimal EstimateGoalMonthlyContribution(Goal goal, bool includeInterest = false)
    {
        if (goal.MonthlyContribution.HasValue) return goal.MonthlyContribution.Value;

        // If a monthly contribution has not been set, then a complete date is required.
        if (!goal.CompleteDate.HasValue)
        {
            throw new ArgumentException("A monthly contribution cannot be estimated without a target date.");
        }

        decimal totalBalance = goal.Accounts.Sum(a => a.Balances.OrderByDescending(b => b.DateTime).FirstOrDefault()?.Amount ?? 0);
        decimal amountLeft;
        if (goal.Amount == 0)
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

        var numberOfMonthsLeft = (goal.CompleteDate.Value.Year - DateTime.Now.Year) * 12 +
            (goal.CompleteDate.Value.Month - DateTime.Now.Month);

        var monthlyPaymentsWithoutInterest = amountLeft / numberOfMonthsLeft;

        // For now, we will just apply this to loans.
        if (includeInterest && goal.Amount == 0)
        {
            var interestRate = EstimateInterestRate(goal);

            // Interest rate calculation failed, so return the value without the calculation.
            if (interestRate == 0) return monthlyPaymentsWithoutInterest;

            var monthlyPaymentsWithInterest = amountLeft *
                (interestRate * (decimal)Math.Pow(1 + (double)interestRate, numberOfMonthsLeft) /
                (((decimal)Math.Pow(1 + (double)interestRate, numberOfMonthsLeft)) - 1));

            return monthlyPaymentsWithInterest;
        }

        return monthlyPaymentsWithoutInterest;
    }

    private static decimal EstimateInterestRate(Goal goal)
    {
        decimal currentBalance = 0;
        decimal formerBalance = 0;
        decimal totalTransactions = 0;

        foreach (var account in goal.Accounts)
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
                return 0;
            }

            // We use balances from 1 and 2 months from the most recent balances to ensure that
            var balances = orderedBalances.Where(b =>
                b.DateTime <= mostRecentBalance.DateTime.AddMonths(-1));

            // Find two balances that are one month apart.
            var groupedBalancesByDay = balances.GroupBy(b => b.DateTime.Date.Day);
            var balancesFromSameDate = groupedBalancesByDay.FirstOrDefault(g => g.Count() >= 2);

            if (balancesFromSameDate == null)
            {
                // We need at least two balances to estimate an interest rate.
                return 0;
            }

            currentBalance += balancesFromSameDate.ElementAt(0).Amount;
            formerBalance += balancesFromSameDate.ElementAt(1).Amount;

            totalTransactions += Math.Abs(account.Transactions
                .Where(t =>
                    !t.Deleted.HasValue &&
                    !(t.Subcategory ?? string.Empty).Equals("Interest Income") &&
                    t.Date.Date >= balancesFromSameDate.Last().DateTime.Date &&
                    t.Date.Date <= balancesFromSameDate.First().DateTime.Date)
                .Sum(t => t.Amount));
        }

        var balanceDifference = Math.Abs(formerBalance - currentBalance);

        return Math.Abs((totalTransactions - balanceDifference) / formerBalance);
    }
}
