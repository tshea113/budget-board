import { CashFlowValue, IBudget } from "~/models/budget";
import { ICategory } from "~/models/category";
import { areStringsEqual } from "./utils";
import {
  getIsParentCategory,
  getParentCategory,
  getSubCategories,
} from "./category";

export enum BudgetGroup {
  Income,
  Spending,
}

/**
 * Determines the cash flow value for a given date based on a monthly totals map.
 *
 * The function retrieves the monthly total (if any) for the specified date from
 * the provided map, then decides whether the result is positive, negative, or
 * neutral, returning the corresponding CashFlowValue enum.
 *
 * @param {Map<number, number>} timeToMonthlyTotalsMap - Map of timestamp to monthly totals.
 * @param {Date} date - The date used to look up the monthly total.
 * @returns {CashFlowValue} Indicates if the cash flow is Positive, Negative, or Neutral.
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
 * Determines the budget group for a given category.
 *
 * If the category name is "Income", returns BudgetGroup.Income.
 * Otherwise, returns BudgetGroup.Spending.
 *
 * @param {string} category - The category's name.
 * @returns {BudgetGroup} - The budget group (Income or Spending).
 */
export const getBudgetGroupForCategory = (category: string): BudgetGroup => {
  if (areStringsEqual(category, "Income")) {
    return BudgetGroup.Income;
  }
  return BudgetGroup.Spending;
};

/**
 * Determines the sign for a given category based on its budget group.
 *
 * If the category is in the Spending group, it returns -1. Otherwise, it returns 1.
 *
 * @param {string} category - The category's name.
 * @param {ICategory[]} transactionCategories - List of all categories for lookups.
 * @returns {number} - The sign for the category.
 */
export const getSignForBudget = (
  category: string,
  transactionCategories: ICategory[]
): number => {
  switch (
    getBudgetGroupForCategory(
      getParentCategory(category, transactionCategories)
    )
  ) {
    case BudgetGroup.Spending:
      return -1;
    case BudgetGroup.Income:
    default:
      return 1;
  }
};

/**
 * Filters a list of budgets by the specified budget group (income or spending).
 *
 * @param {IBudget[] | undefined} budgetData - The list of budgets to filter.
 * @param {BudgetGroup} budgetGroup - The target budget group (Income or Spending).
 * @param {ICategory[]} transactionCategories - All available categories for lookups.
 * @returns {IBudget[]} The filtered list of budgets.
 */
export const getBudgetsForGroup = (
  budgetData: IBudget[] | undefined,
  budgetGroup: BudgetGroup,
  transactionCategories: ICategory[]
): IBudget[] => {
  if (budgetData == null) {
    return [];
  }

  if (budgetGroup === BudgetGroup.Income) {
    return (
      budgetData.filter((b) =>
        areStringsEqual(
          getParentCategory(b.category, transactionCategories),
          "income"
        )
      ) ?? []
    );
  } else if (budgetGroup === BudgetGroup.Spending) {
    return (
      budgetData.filter(
        (b) =>
          !areStringsEqual(
            getParentCategory(b.category, transactionCategories),
            "income"
          )
      ) ?? []
    );
  }
  return budgetData;
};

/**
 * Calculates the total limit from the provided budget data.
 *
 * @param {IBudget[]} budgetData - Array of budgets.
 * @returns {number} The sum of all budget limits.
 */
export const sumBudgetAmounts = (budgetData: IBudget[]): number => {
  return budgetData.reduce((n, { limit }) => n + limit, 0);
};

/**
 * Determines the color for a budget value based on the completion percentage
 * and whether it represents income.
 *
 * @param {number} percentComplete - The completion percentage of the budget.
 * @param {boolean} isIncome - Indicates if the budget is for income (true) or spending (false).
 * @returns {string} - The color ("red" or "green") to visually represent the budget status.
 */
export const getBudgetValueColor = (
  percentComplete: number,
  isIncome: boolean
) => {
  if (isIncome) {
    if (percentComplete < 100) {
      return "red";
    }
    return "green";
  }
  if (percentComplete <= 100) {
    return "green";
  }
  return "red";
};

/**
 * Retrieves the total amount for the specified budget category by summing the category's own total
 * with any child categories' totals (if the category is a parent).
 *
 * @param {string} budgetCategory - The category name to retrieve total for.
 * @param {Map<string, number>} categoryToTransactionsTotalMap - A map from category name to transaction totals.
 * @param {ICategory[]} categories - An array of all categories for lookups.
 * @returns {number} The total amount for the given category (including child categories if applicable).
 */
export const getBudgetAmount = (
  budgetCategory: string,
  categoryToTransactionsTotalMap: Map<string, number>,
  categories: ICategory[]
): number => {
  if (getIsParentCategory(budgetCategory, categories)) {
    const children = getSubCategories(budgetCategory, categories);

    const childrenTotal = children.reduce(
      (acc, category) =>
        acc +
        (categoryToTransactionsTotalMap.get(
          category.value.toLocaleLowerCase()
        ) ?? 0),
      0
    );

    return (
      childrenTotal + (categoryToTransactionsTotalMap.get(budgetCategory) ?? 0)
    );
  }

  return categoryToTransactionsTotalMap.get(budgetCategory) ?? 0;
};

/**
 * Groups a list of budgets by their category (case-insensitive).
 *
 * The function first sorts the budgets alphabetically by category,
 * then reduces them into a Map keyed by the lowercase category name,
 * storing an array of budgets for each category.
 *
 * @param {IBudget[]} budgets - An array of budget objects.
 * @returns {Map<string, IBudget[]>} - A map from category to list of budgets.
 */
export const groupBudgetsByCategory = (
  budgets: IBudget[]
): Map<string, IBudget[]> =>
  budgets
    .sort((a: IBudget, b: IBudget) => {
      if (a.category.toUpperCase() < b.category.toUpperCase()) {
        return -1;
      } else if (a.category.toUpperCase() > b.category.toUpperCase()) {
        return 1;
      }
      return 0;
    })
    .reduce(
      (budgetMap: any, item: IBudget) =>
        budgetMap.set(item.category.toLowerCase(), [
          ...(budgetMap.get(item.category.toLowerCase()) || []),
          item,
        ]),
      new Map()
    );
