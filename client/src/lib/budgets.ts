import { type BudgetResponse } from '@/types/budget';
import { transactionCategories } from '@/types/transaction';
import { getParentCategory } from './category';
import { areStringsEqual } from './utils';

export enum BudgetGroup {
  Income,
  Spending,
}

/**
 * Sums the total amount budgeted for all of the provided budgets
 * @param budgetData Array of budgets
 * @returns Summed total of budget amounts
 */
export const sumBudgetAmounts = (budgetData: BudgetResponse[]): number => {
  return budgetData.reduce((n, { limit }) => n + limit, 0);
};

/**
 * Builds a sorted map of the budget categories to the corresponding budgets
 * @param budgets Budgets to be grouped
 * @returns A map of categories to budgets
 */
export const groupBudgetsByCategory = (
  budgets: BudgetResponse[]
): Map<string, BudgetResponse[]> =>
  budgets
    .sort((a: BudgetResponse, b: BudgetResponse) => {
      if (a.category.toUpperCase() < b.category.toUpperCase()) {
        return -1;
      } else if (a.category.toUpperCase() > b.category.toUpperCase()) {
        return 1;
      } else {
        return 0;
      }
    })
    .reduce(
      (budgetMap: any, item: BudgetResponse) =>
        budgetMap.set(item.category.toLowerCase(), [
          ...(budgetMap.get(item.category.toLowerCase()) || []),
          item,
        ]),
      new Map()
    );

export const getBudgetsForMonth = (
  budgetData: BudgetResponse[],
  date: Date
): BudgetResponse[] =>
  budgetData.filter(
    (b: BudgetResponse) =>
      new Date(b.date).getMonth() === new Date(date).getMonth() &&
      new Date(b.date).getUTCFullYear() === new Date(date).getUTCFullYear()
  ) ?? [];

export const getBudgetsForGroup = (
  budgetData: BudgetResponse[] | undefined,
  budgetGroup: BudgetGroup
): BudgetResponse[] => {
  if (budgetData == null) return [];

  if (budgetGroup === BudgetGroup.Income) {
    return (
      budgetData.filter((b) =>
        areStringsEqual(getParentCategory(b.category, transactionCategories), 'income')
      ) ?? []
    );
  } else if (budgetGroup === BudgetGroup.Spending) {
    return (
      budgetData.filter(
        (b) =>
          !areStringsEqual(getParentCategory(b.category, transactionCategories), 'income')
      ) ?? []
    );
  } else {
    return budgetData;
  }
};

export const getBudgetGroupForCategory = (category: string): BudgetGroup => {
  if (areStringsEqual(category, 'Income')) {
    return BudgetGroup.Income;
  } else {
    return BudgetGroup.Spending;
  }
};

export const getSignForBudget = (category: string): number => {
  switch (getBudgetGroupForCategory(getParentCategory(category, transactionCategories))) {
    case BudgetGroup.Spending:
      return -1;
    case BudgetGroup.Income:
    default:
      return 1;
  }
};
