import { IBalance } from '@/types/balance';

/**
 * Builds a map of accountIDs to their respecitive balances.
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
