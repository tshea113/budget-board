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

export const getBudgetsForMonth = (budgetData: Budget[], date: Date): Budget[] => {
  return (
    budgetData.filter(
      (b: Budget) =>
        new Date(b.date).getMonth() === new Date(date).getMonth() &&
        new Date(b.date).getUTCFullYear() === new Date(date).getUTCFullYear()
    ) ?? []
  );
};

export const getBudgetsForGroup = (
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
