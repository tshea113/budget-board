import { type Transaction } from '@/types/transaction';

export const filterVisibleTransactions = (transactions: Transaction[]): Transaction[] =>
  transactions.filter((t: Transaction) => t.deleted === null);

export const filterInvisibleTransactions = (transactions: Transaction[]): Transaction[] =>
  transactions.filter((t: Transaction) => t.deleted !== null);

export const filterTransactionsByCategory = (
  transactions: Transaction[],
  categoryValue: string
) =>
  transactions.filter(
    (t: Transaction) =>
      (t.category ?? '').localeCompare(categoryValue, undefined, {
        sensitivity: 'base',
      }) === 0
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
