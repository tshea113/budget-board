import { Sorts } from "@app/authorized/PageContent/Transactions/TransactionsHeader/SortMenu/SortMenuHelpers";
import { SortDirection } from "@components/SortButton";
import { ITransaction } from "@models/transaction";

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
