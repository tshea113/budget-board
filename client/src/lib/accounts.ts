import { type Account } from '@/types/account';

/**
 * Creates a map of accounts to their institutions.
 * @param accounts Acounts you wish to group by institution.
 * @returns A map of accounts to institutions.
 */
export const groupAccountsByInstitution = (accounts: Account[]): Map<string, Account[]> =>
  accounts.reduce(
    (accountMap: Map<string, Account[]>, item: Account) =>
      accountMap.set(item.institutionID, [
        ...(accountMap.get(item.institutionID) || []),
        item,
      ]),
    new Map<string, Account[]>()
  );

/**
 * Returns a list of accounts that match the given types.
 * @param accounts A list of accounts
 * @param types A list of types to match against
 * @returns A list of accounts that match the given types
 */
export const getAccountsOfTypes = (accounts: Account[], types: string[]): Account[] =>
  accounts.filter((a) => types?.includes(a.type) || types?.includes(a.subtype));

export const filterVisibleAccounts = (accounts: Account[]): Account[] =>
  accounts.filter((a: Account) => !(a.hideAccount || a.deleted !== null));

export const getAccountsById = (accountIds: string[], accounts: Account[]): Account[] => {
  let selectedAccounts: Account[] = [];
  accountIds.forEach((accountId) => {
    const foundAccount = accounts.find((account) => account.id === accountId);
    if (foundAccount) selectedAccounts.push(foundAccount);
  });

  return selectedAccounts;
};

export const sumAccountsTotalBalance = (accounts: Account[]) => {
  if (accounts.length > 0) {
    return accounts.reduce((n, { currentBalance }) => n + currentBalance, 0);
  } else {
    return 0;
  }
};
