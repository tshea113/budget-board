using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using BudgetBoard.Service.Interfaces;
using BudgetBoard.Service.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace BudgetBoard.Service;

public class GoalService(ILogger<IGoalService> logger, UserDataContext userDataContext, UserManager<ApplicationUser> userManager) : IGoalService
{
    private readonly ILogger<IGoalService> _logger = logger;
    private readonly UserDataContext _userDataContext = userDataContext;
    private readonly UserManager<ApplicationUser> _userManager = userManager;

    public async Task<IApplicationUser> GetUserData(ClaimsPrincipal user)
    {
        var userData = await GetCurrentUserAsync(_userManager.GetUserId(user) ?? string.Empty);
        if (userData == null)
        {
            _logger.LogError("Attempt to access authorized content by unauthorized user.");
            throw new Exception("You are not authorized to access this content.");
        }

        return userData;
    }
    public async Task CreateGoalAsync(IApplicationUser userData, IGoalCreateRequest createdGoal)
    {
        decimal runningBalance = 0.0M;
        var accounts = new List<Account>();
        foreach (var accountId in createdGoal.AccountIds)
        {
            var account = userData.Accounts.FirstOrDefault((a) => a.ID == accountId);
            if (account != null)
            {
                runningBalance += account.Balances.OrderByDescending(b => b.DateTime).FirstOrDefault()?.Amount ?? 0;
                accounts.Add(account);
            }
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

    public IEnumerable<IGoalResponse> ReadGoalsAsync(IApplicationUser userData, bool includeInterest)
    {
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

    public async Task UpdateGoalAsync(IApplicationUser userData, IGoalUpdateRequest updatedGoal)
    {
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

    public async Task DeleteGoalAsync(IApplicationUser userData, Guid guid)
    {
        var goal = userData.Goals.FirstOrDefault(g => g.ID == guid);
        if (goal == null)
        {
            _logger.LogError("Attempt to delete goal that does not exist.");
            throw new Exception("The goal you are trying to delete does not exist.");
        }

        _userDataContext.Goals.Remove(goal);
        await _userDataContext.SaveChangesAsync();
    }

    private async Task<ApplicationUser?> GetCurrentUserAsync(string id)
    {
        try
        {
            var users = await _userDataContext.ApplicationUsers
                .Include(u => u.Goals)
                .ThenInclude((g) => g.Accounts)
                .ThenInclude((a) => a.Transactions)
                .Include(u => u.Accounts)
                .ThenInclude(a => a.Balances)
                .AsSplitQuery()
                .ToListAsync();
            return users.Single(u => u.Id == new Guid(id));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            return null;
        }
    }

    private static DateTime EstimateGoalCompleteDate(Goal goal, bool includeInterest = false)
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
            // For now, we will just apply this to loans.
            if (includeInterest && goal.Amount == 0)
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

    private static decimal EstimateGoalMonthlyContribution(Goal goal, bool includeInterest = false)
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

            var numberOfMonthsLeft = (goal.CompleteDate.Value.Year - DateTime.Now.Year) * 12 +
                (goal.CompleteDate.Value.Month - DateTime.Now.Month);

            var monthlyPaymentsWithoutInterest = amountLeft / numberOfMonthsLeft;

            var interestRate = EstimateInterestRate(goal);
            var monthlyPaymentsWithInterest = amountLeft *
                (interestRate * (decimal)Math.Pow(1 + (double)interestRate, numberOfMonthsLeft) /
                (((decimal)Math.Pow(1 + (double)interestRate, numberOfMonthsLeft)) - 1));

            // For now, we will just apply this to loans.
            if (includeInterest && goal.Amount == 0)
            {
                return monthlyPaymentsWithInterest;
            }

            return monthlyPaymentsWithoutInterest;
        }
    }

    private static decimal EstimateInterestRate(Goal goal)
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
