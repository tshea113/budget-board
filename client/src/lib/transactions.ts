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

export const getTransactionsForMonth = (
  transactionData: Transaction[],
  date: Date
): Transaction[] =>
  transactionData.filter(
    (t: Transaction) =>
      new Date(t.date).getMonth() === new Date(date).getMonth() &&
      new Date(t.date).getUTCFullYear() === new Date(date).getUTCFullYear()
  ) ?? [];

export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(date).toLocaleDateString([], options);
};

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

export interface RollingTotalTransactionsPerDay {
  day: number;
  amount: number;
}

/**
 * Creates an array of the rolling total spending for each day of the month
 * @param transactionsForMonth The transactions for a given month
 * @returns An array of dates with the corresponding cumulative total spending up to that date
 */
export const getRollingTotalTransactionsForMonth = (
  transactionsForMonth: Transaction[]
): RollingTotalTransactionsPerDay[] => {
  let rollingTotalTransactionsPerDay: RollingTotalTransactionsPerDay[] = [];

  // This chart only needs to display transactions that aren't income
  const sortedSpending = transactionsForMonth
    .filter((t) => !areStringsEqual(t.category ?? '', 'Income'))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let total = 0;
  const summedTransactionsPerMonth = sortedSpending.reduce(
    (result: RollingTotalTransactionsPerDay[], transaction: Transaction) => {
      const foundDay = result.find((t) => t.day === new Date(transaction.date).getDate());

      total -= transaction.amount;

      if (foundDay == null) {
        const newDay: RollingTotalTransactionsPerDay = {
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

  for (let index = 0; index < 31; index++) {
    const amount = summedTransactionsPerMonth.find((t) => t.day === index);

    let dayAmount: RollingTotalTransactionsPerDay = {
      day: index,
      amount: 0,
    };

    if (amount == null) {
      if (index !== 0)
        dayAmount.amount = rollingTotalTransactionsPerDay[index - 1].amount;

      rollingTotalTransactionsPerDay.push(dayAmount);
    } else {
      rollingTotalTransactionsPerDay.push(amount);
    }
  }

  return rollingTotalTransactionsPerDay;
};
