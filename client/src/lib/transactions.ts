import { transactionCategories, type Transaction } from '@/types/transaction';
import { getIsParentCategory } from './category';
import { areStringsEqual } from './utils';

export const filterVisibleTransactions = (transactions: Transaction[]): Transaction[] =>
  transactions.filter((t: Transaction) => t.deleted === null);

export const filterInvisibleTransactions = (transactions: Transaction[]): Transaction[] =>
  transactions.filter((t: Transaction) => t.deleted !== null);

export const filterTransactionsByCategory = (
  transactions: Transaction[],
  categoryValue: string
) =>
  transactions.filter((t: Transaction) =>
    areStringsEqual(t.category ?? '', categoryValue)
  );

export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(date).toLocaleDateString([], options);
};

/**
 * Returns all transactions within a given month and year.
 * @param transactionData An array of transactions.
 * @param date The date containing the month and year that we will filter all transactions.
 * @returns An array of transactions filtered to the given month and year.
 */
export const getTransactionsForMonth = (
  transactionData: Transaction[],
  date: Date
): Transaction[] =>
  transactionData.filter(
    (t: Transaction) =>
      new Date(t.date).getMonth() === new Date(date).getMonth() &&
      new Date(t.date).getUTCFullYear() === new Date(date).getUTCFullYear()
  );

/**
 * Sums the provided transactions for the given transaction category
 * @param transactionData The array of transactions to sum
 * @param category The category of transactions to sum
 * @returns The sum of all transactions for the given category
 */
export const sumTransactionAmountsByCategory = (
  transactionData: Transaction[],
  categoryToSum: string
): number => {
  const transactionsForCategory = transactionData.filter((t: Transaction) => {
    // We need to figure out whether the category we are comparing on is a category or subcategory
    // to know which field to look at on the transaction.
    const transactionCategory = getIsParentCategory(categoryToSum, transactionCategories)
      ? t.category ?? ''
      : t.subcategory ?? '';

    return areStringsEqual(transactionCategory, categoryToSum);
  });

  return transactionsForCategory.reduce((n, { amount }) => n + amount, 0);
};

export interface RollingTotalSpendingPerDay {
  day: number;
  amount: number;
}

/**
 * Creates an array of the rolling total spending for each day of the month
 * @param transactionsForMonth The transactions for a given month
 * @returns An array of dates with the corresponding cumulative total spending up to that date
 */
export const getRollingTotalSpendingForMonth = (
  transactionsForMonth: Transaction[],
  endDate: number
): RollingTotalSpendingPerDay[] => {
  let rollingTotalSpendingPerDay: RollingTotalSpendingPerDay[] = [];

  // This chart only needs to display transactions that aren't income
  const sortedSpending = transactionsForMonth
    .filter((t) => !areStringsEqual(t.category ?? '', 'Income'))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let total = 0;
  const summedTransactionsPerMonth = sortedSpending.reduce(
    (result: RollingTotalSpendingPerDay[], transaction: Transaction) => {
      const foundDay = result.find((t) => t.day === new Date(transaction.date).getDate());

      // Transactions are negative and we want spending to be positive,
      // so instead of multiplying by a negative, just subtract from total.
      total -= transaction.amount;

      if (foundDay == null) {
        const newDay: RollingTotalSpendingPerDay = {
          day: new Date(transaction.date).getDate(),
          amount: total,
        };
        result.push(newDay);
      } else {
        foundDay.amount = total;
      }
      return result;
    },
    []
  );

  // If it is the current month, we need to continue the rolling total
  for (let dayItr = 1; dayItr <= endDate; dayItr++) {
    const amount = summedTransactionsPerMonth.find((t) => t.day === dayItr);

    let dayAmount: RollingTotalSpendingPerDay = {
      day: dayItr,
      amount: 0,
    };

    if (!amount) {
      if (dayItr > 1) {
        // If there are no transactions for a day, we should just roll over the previous day.
        dayAmount.amount = rollingTotalSpendingPerDay[dayItr - 2].amount;
      }
      rollingTotalSpendingPerDay.push(dayAmount);
    } else {
      rollingTotalSpendingPerDay.push(amount);
    }
  }

  return rollingTotalSpendingPerDay;
};

/**
 * Sums the amounts of all transactions in the provided array
 * @param transactionData Array of transactions
 * @returns The sum of all transaction amounts
 */
export const sumTransactionAmounts = (transactionData: Transaction[]): number => {
  return transactionData.reduce((n, { amount }) => n + amount, 0);
};
