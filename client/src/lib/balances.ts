import { IBalance } from '@/types/balance';
import { getStandardDate } from './utils';

/**
 * Builds a map of accountIDs to their respecitive balances sorted in chronological order.
 * @param balances List of balances
 * @returns A map of accountIDs to their respective balances
 */
export const getAccountBalanceMap = (balances: IBalance[]): Map<string, IBalance[]> => {
  const sortedBalances = balances.sort(
    (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
  );

  const accountBalanceMap = Map.groupBy(
    sortedBalances,
    (balance: IBalance) => balance.accountID
  );

  return accountBalanceMap;
};

/**
 * Returns the average balance for each date in the list of balances.
 * @param balances List of balances
 * @returns A list of balances representing the average balance for each date
 */
export const getAverageBalanceForDates = (balances: IBalance[]): IBalance[] => {
  const dateGroupedBalances = Map.groupBy(balances, (balance: IBalance) =>
    new Date(
      new Date(balance.dateTime).getFullYear(),
      new Date(balance.dateTime).getMonth(),
      new Date(balance.dateTime).getDate()
    ).getTime()
  );

  const averageBalances: IBalance[] = [];

  dateGroupedBalances.forEach((balances) => {
    const balance: IBalance = balances[0];

    balance.amount = balances.reduce((acc, b) => acc + b.amount, 0) / balances.length;

    averageBalances.push(balance);
  });

  return averageBalances;
};

/**
 * Returns a list of sorted balance dates.
 * @param balances List of balances
 * @returns A list of sorted balance dates
 */
export const getSortedBalanceDates = (balances: IBalance[]): Date[] =>
  balances
    .map((balance) =>
      getStandardDate(
        new Date(
          new Date(balance.dateTime).getFullYear(),
          new Date(balance.dateTime).getMonth(),
          new Date(balance.dateTime).getDate()
        )
      )
    )
    .sort((a, b) => a.getTime() - b.getTime());
