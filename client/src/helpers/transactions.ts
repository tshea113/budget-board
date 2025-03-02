import { Sorts } from "@app/authorized/PageContent/Transactions/TransactionsHeader/SortMenu/SortMenuHelpers";
import { SortDirection } from "@components/SortButton";
import { Filters, ITransaction } from "@models/transaction";
import { areStringsEqual } from "./utils";
import { getIsParentCategory } from "./category";
import { getStandardDate } from "./datetime";
import { ICategory } from "@models/category";

/**
 * Sorts an array of transactions using the specified field and direction.
 *
 * This function modifies the provided transactions array in place based on a switch statement
 * handling different sort criteria: Date, Merchant, Category, or Amount.
 *
 * @param {ITransaction[]} transactions - Array of transaction objects.
 * @param {Sorts} sortValue - The transaction field on which to sort.
 * @param {SortDirection} sortDirection - Indicates ascending or descending sort.
 * @returns {ITransaction[]} The sorted array of transaction objects.
 */
export const sortTransactions = (
  transactions: ITransaction[],
  sortValue: Sorts,
  sortDirection: SortDirection
): ITransaction[] => {
  switch (sortValue) {
    case Sorts.Date:
      return sortDirection === SortDirection.Decending
        ? transactions.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        : transactions.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
    case Sorts.Merchant:
      return sortDirection === SortDirection.Decending
        ? transactions.sort((a, b) =>
            (b.merchantName ?? "")
              .toLocaleLowerCase()
              .localeCompare((a.merchantName ?? "").toLocaleLowerCase())
          )
        : transactions.sort((a, b) =>
            (a.merchantName ?? "")
              .toLocaleLowerCase()
              .localeCompare((b.merchantName ?? "").toLocaleLowerCase())
          );
    case Sorts.Category:
      return sortDirection === SortDirection.Decending
        ? transactions.sort((a, b) =>
            (b.subcategory === null || b.subcategory === ""
              ? b.category ?? "Uncategorized"
              : b.subcategory ?? "Uncategorized"
            )
              .toLocaleLowerCase()
              .localeCompare(
                (a.subcategory === null || a.subcategory === ""
                  ? a.category ?? "Uncategorized"
                  : a.subcategory ?? "Uncategorized"
                ).toLocaleLowerCase()
              )
          )
        : transactions.sort((a, b) =>
            (a.subcategory === null || a.subcategory === ""
              ? a.category ?? "Uncategorized"
              : a.subcategory ?? "Uncategorized"
            )
              .toLocaleLowerCase()
              .localeCompare(
                (b.subcategory === null || b.subcategory === ""
                  ? b.category ?? "Uncategorized"
                  : b.subcategory ?? "Uncategorized"
                ).toLocaleLowerCase()
              )
          );
    case Sorts.Amount:
      return sortDirection === SortDirection.Decending
        ? transactions.sort((a, b) => (a.amount < b.amount ? 1 : -1))
        : transactions.sort((a, b) => (a.amount > b.amount ? 1 : -1));
    default:
      return transactions;
  }
};

export const getTransactionCategory = (
  category: string,
  subcategory: string
): string => (subcategory && subcategory.length > 0 ? subcategory : category);

export const getVisibleTransactions = (
  transactions: ITransaction[]
): ITransaction[] =>
  transactions.filter((t: ITransaction) => t.deleted === null);

/**
 * Filters transactions based on accounts, categories, and date range.
 *
 * The function starts by excluding deleted transactions. It then applies:
 * - Account filters (if any are selected).
 * - Category filters (checks if the category is a parent or subcategory).
 * - Date range filters (if dates are specified).
 *
 * @param {ITransaction[]} transactions - Array of transaction objects.
 * @param {Filters} filters - Object containing account, category, and date range filters.
 * @param {ICategory[]} transactionCategories - Array of all categories, used to check for parent categories.
 * @returns {ITransaction[]} The filtered array of transactions.
 */
export const getFilteredTransactions = (
  transactions: ITransaction[],
  filters: Filters,
  transactionCategories: ICategory[]
): ITransaction[] => {
  // We don't want to include deleted transactions.
  let filteredTransactions = getVisibleTransactions(transactions);
  if (filters.accounts.length > 0) {
    filteredTransactions = filteredTransactions.filter((t) =>
      filters.accounts.some((f) => areStringsEqual(f, t.accountID))
    );
  }
  if (filters.category && filters.category.length > 0) {
    filteredTransactions = filteredTransactions.filter((t) =>
      getIsParentCategory(filters.category, transactionCategories)
        ? areStringsEqual(t.category ?? "", filters.category)
        : areStringsEqual(t.subcategory ?? "", filters.category)
    );
  }
  if (filters.dateRange?.at(0)) {
    filteredTransactions = filteredTransactions.filter(
      (t) =>
        getStandardDate(t.date).getTime() >=
        getStandardDate(filters.dateRange.at(0)!).getTime()
    );
  }
  if (filters.dateRange?.at(1)) {
    filteredTransactions = filteredTransactions.filter(
      (t) =>
        getStandardDate(t.date).getTime() <=
        getStandardDate(filters.dateRange.at(1)!).getTime()
    );
  }
  return filteredTransactions;
};
