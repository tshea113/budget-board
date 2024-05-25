import { AxiosResponse } from 'axios';
import request from './request';
import { Goal, NewGoal } from '@/types/goal';
import { getTransactionsForMonth } from './transactions';
import { getMonthsUntilDate } from './utils';
import { sumAccountsTotalBalance } from './accounts';

export const getGoals = async (): Promise<AxiosResponse> =>
  await request({
    url: '/api/goal',
    method: 'GET',
  });

export const addGoal = async (newGoal: NewGoal): Promise<AxiosResponse> =>
  await request({
    url: '/api/goal',
    method: 'POST',
    data: newGoal,
  });

export const deleteGoal = async (guid: string): Promise<AxiosResponse> =>
  await request({
    url: '/api/goal',
    method: 'DELETE',
    params: { guid },
  });

export const getGoalTargetAmount = (amount: number, initialAmount: number): number => {
  if (initialAmount < 0) {
    // An initial amount less than 0 indicates this is a debt. Since the goal of a debt
    // is to pay it off to 0, the absolute value of the initial amount is the target
    // amount of the goal.
    return Math.abs(initialAmount);
  } else {
    return amount;
  }
};

export const sumTransactionsForGoalForMonth = (goal: Goal): number => {
  return getTransactionsForMonth(
    goal.accounts.flatMap((a) => a.transactions),
    new Date()
  ).reduce((n, { amount }) => n + amount, 0);
};

export const getMonthlyContributionTotal = (goal: Goal): number => {
  if (goal.monthlyContribution == null && goal.completeDate !== null) {
    const monthsUntilComplete = getMonthsUntilDate(goal.completeDate);
    if (goal.initialAmount < 0) {
      // The monthly payment for a loan is just that amount of the loan over X
      // number of months.
      return Math.abs(sumAccountsTotalBalance(goal.accounts)) / monthsUntilComplete;
    } else {
      // Initial amount is used as an offset when the user doesn't want to include
      // an existing account balance when setting up a goal.
      return (
        (goal.amount - (sumAccountsTotalBalance(goal.accounts) - goal.initialAmount)) /
        monthsUntilComplete
      );
    }
  } else {
    return goal.monthlyContribution ?? 0;
  }
};
