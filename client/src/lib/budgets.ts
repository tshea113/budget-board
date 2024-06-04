import { type AxiosResponse } from 'axios';
import request from './request';
import { NewBudget, type Budget } from '@/types/budget';
import { getParentCategory } from './transactions';

export enum BudgetGroup {
  Income,
  Spending,
}

export const getBudgets = async (
  accessToken: string,
  date: Date
): Promise<AxiosResponse> => {
  const dateString = '?date=' + date.toISOString();
  return await request(
    {
      url: '/api/budget' + dateString,
      method: 'GET',
    },
    accessToken
  );
};

export const addBudget = async (
  accessToken: string,
  newBudget: NewBudget
): Promise<AxiosResponse> =>
  await request(
    {
      url: '/api/budget',
      method: 'POST',
      data: newBudget,
    },
    accessToken
  );

export const addMultipleBudgets = async (
  accessToken: string,
  newBudgets: Budget[]
): Promise<AxiosResponse> =>
  await request(
    {
      url: '/api/budget/addmultiple',
      method: 'POST',
      data: newBudgets,
    },
    accessToken
  );

export const editBudget = async (
  accessToken: string,
  budget: Budget
): Promise<AxiosResponse> =>
  await request(
    {
      url: '/api/budget',
      method: 'PUT',
      data: budget,
    },
    accessToken
  );

export const deleteBudget = async (
  accessToken: string,
  id: string
): Promise<AxiosResponse> =>
  await request(
    {
      url: '/api/budget',
      method: 'DELETE',
      params: { id },
    },
    accessToken
  );

export const getBudgetsForMonth = (budgetData: Budget[], date: Date): Budget[] =>
  budgetData.filter(
    (b: Budget) =>
      new Date(b.date).getMonth() === new Date(date).getMonth() &&
      new Date(b.date).getUTCFullYear() === new Date(date).getUTCFullYear()
  ) ?? [];

export const getBudgetsForGroup = (
  budgetData: Budget[] | undefined,
  budgetGroup: BudgetGroup
): Budget[] => {
  if (budgetData == null) return [];

  if (budgetGroup === BudgetGroup.Income) {
    return budgetData.filter((b) => getParentCategory(b.category) === 'income') ?? [];
  } else if (budgetGroup === BudgetGroup.Spending) {
    return budgetData.filter((b) => getParentCategory(b.category) !== 'income') ?? [];
  } else {
    return budgetData;
  }
};

export const getBudgetGroupForCategory = (category: string): BudgetGroup => {
  if (category === 'income') {
    return BudgetGroup.Income;
  } else {
    return BudgetGroup.Spending;
  }
};

export const getSignForBudget = (category: string): number => {
  switch (getBudgetGroupForCategory(getParentCategory(category))) {
    case BudgetGroup.Spending:
      return -1;
    case BudgetGroup.Income:
    default:
      return 1;
  }
};
