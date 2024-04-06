import { type AxiosResponse } from 'axios';
import request from './request';
import { type Budget } from '@/types/budget';

export enum BudgetGroup {
  Income,
  Spending,
}

export const getBudgets = async (date: Date): Promise<AxiosResponse> => {
  const dateString = '?date=' + date.toISOString();
  return await request({
    url: '/api/budget' + dateString,
    method: 'GET',
  });
};

export const parseBudgetGroups = (
  budgetData: Budget[] | undefined,
  budgetGroup: BudgetGroup
): Budget[] => {
  if (budgetData == null) return [];

  if (budgetGroup === BudgetGroup.Income) {
    return budgetData.filter((b) => b.category === 'income') ?? [];
  } else if (budgetGroup === BudgetGroup.Spending) {
    return budgetData.filter((b) => b.category !== 'income') ?? [];
  } else {
    return budgetData;
  }
};
