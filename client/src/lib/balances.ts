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

/**
 * Gets the date of the first recorded balance on or before the start date.
 * @param balances A list of balances
 * @param startDate The date of the requested first balance
 * @returns The date of the first recorded balance on or before the start date. If the date does not exist, the start date is returned.
 */
export const getInitialBalanceDate = (balances: IBalance[], startDate: Date): Date =>
  // If an account is missing data for the specified startDate, we should try to find the closest date before the startDate.
  // This value will be undefined if there is no balance at or before the startDate. In that case we do not have any balances
  // before the start date and the balance will be zero until the first balance is found.
  getStandardDate(
    balances
      .slice()
      .reverse()
      .find((b) => new Date(b.dateTime).getTime() <= startDate.getTime())?.dateTime ??
      startDate
  );
