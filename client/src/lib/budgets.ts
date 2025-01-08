import { CashFlowValue, type BudgetResponse } from '@/types/budget';
import { Transaction } from '@/types/transaction';
import { getIsParentCategory, getParentCategory } from './category';
import { areStringsEqual } from './utils';
import { ICategory } from '@/types/category';

export enum BudgetGroup {
  Income,
  Spending,
}

export interface Unbudget {
  category: string;
  amount: number;
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

/**
 * Returns the cash flow sign for the provided month.
 * @param timeToMonthlyTotalsMap A map of months to total transactions for that month
 * @param date The month to get the cash flow sign for
 * @returns The sign of the cash flow for the month
 */
export const getCashFlowValue = (
  timeToMonthlyTotalsMap: Map<number, number>,
  date: Date
): CashFlowValue => {
  const cashFlow = timeToMonthlyTotalsMap.get(date.getTime()) ?? 0;
  if (cashFlow > 0) {
    return CashFlowValue.Positive;
  } else if (cashFlow < 0) {
    return CashFlowValue.Negative;
  }
  return CashFlowValue.Neutral;
};

/**
 * Builds a map of months to the total transaction amounts for that month
 * @param months Months to calculate transaction totals for
 * @param transactions List of transactions to calculate totals from
 * @returns A map of months to total transaction amounts
 */
export const buildTimeToMonthlyTotalsMap = (
  months: Date[],
  transactions: Transaction[]
): Map<number, number> => {
  const map = new Map();
  months.forEach((month: Date) => {
    const total = transactions
      .filter((t) => new Date(t.date).getMonth() === month.getMonth())
      .reduce((n, { amount }) => n + amount, 0);
    map.set(month.getTime(), total);
  });
  return map;
};

/**
 * Returns a list of transactions that do not have a corresponding budget.
 * @param budgets A list of budgets
 * @param transactions A list of transactions
 * @param transactionCategories A list of transaction categories including any custom user categories
 * @returns A list of transactions that do not have a corresponding budget
 */
export const getUnbudgetedTransactions = (
  budgets: BudgetResponse[],
  transactions: Transaction[],
  transactionCategories: ICategory[]
): Unbudget[] => {
  if (budgets == null || transactions == null) return [];

  // This creates an object that maps category/subcategory => array of amounts
  const groupedTransactions: [string, number[]][] = Object.entries(
    transactions.reduce((result: any, item: Transaction) => {
      (result[
        item.subcategory?.length !== 0
          ? (item.subcategory?.toLocaleLowerCase() ?? '')
          : (item.category?.toLocaleLowerCase() ?? '')
      ] =
        result[
          item.subcategory?.length !== 0
            ? (item.subcategory?.toLocaleLowerCase() ?? '')
            : (item.category?.toLocaleLowerCase() ?? '')
        ] || []).push(item.amount);
      return result;
    }, {})
  );

  const filteredGroupedTransactions = groupedTransactions.filter((t) => {
    return !budgets.some(({ category }) => {
      if (getIsParentCategory(category, transactionCategories)) {
        // The budget is for a parent category, so check if it is the transaction's parent category
        return areStringsEqual(category, getParentCategory(t[0], transactionCategories));
      } else {
        // The budget is a subcategory, so just check that it matches the transaction
        return areStringsEqual(category, t[0]);
      }
    });
  });

  const unbudgetedTransactions: Unbudget[] = [];
  filteredGroupedTransactions.forEach((element) => {
    unbudgetedTransactions.push({
      category: element[0],
      amount: element[1].reduce((a, b) => {
        return a + b;
      }),
    });
  });

  // Transfers can have two transactions that cancel each other out and result in
  // zero net cash flow. For this reason, filter out any net 0 transactions categories.
  // Also filtering very small transactions categories (less than $1) to reduce clutter.
  return unbudgetedTransactions.filter((u) => Math.abs(u.amount) > 1);
};

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
  budgetGroup: BudgetGroup,
  transactionCategories: ICategory[]
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

export const getSignForBudget = (
  category: string,
  transactionCategories: ICategory[]
): number => {
  switch (getBudgetGroupForCategory(getParentCategory(category, transactionCategories))) {
    case BudgetGroup.Spending:
      return -1;
    case BudgetGroup.Income:
    default:
      return 1;
  }
};
