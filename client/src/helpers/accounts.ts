import { IAccount } from "@models/account";

/**
 * Filters out accounts that are either hidden or marked as deleted.
 *
 * This function iterates through the provided array of accounts and excludes any account
 * that satisfies either of the following conditions:
 * - The account is marked as hidden (hideAccount is truthy).
 * - The account has a non-null deleted field.
 *
 * @param {IAccount[]} accounts - An array of account objects to filter.
 * @returns {IAccount[]} An array containing only the visible accounts.
 */
export const filterVisibleAccounts = (accounts: IAccount[]): IAccount[] =>
  accounts.filter((a: IAccount) => !(a.hideAccount || a.deleted !== null));

/**
 * Calculates and returns the total current balance from an array of account objects.
 *
 * @param accounts - An array of objects implementing the IAccount interface.
 * @returns The sum of the currentBalance properties of all accounts. If the accounts array is empty, the function returns 0.
 */
export const sumAccountsTotalBalance = (accounts: IAccount[]) => {
  if (accounts.length > 0) {
    return accounts.reduce((n, { currentBalance }) => n + currentBalance, 0);
  }

  return 0;
};

/**
 * Returns accounts matching any of the given types.
 *
 * @param {IAccount[]} accounts - List of account objects.
 * @param {string[]} types - List of types or subtypes to match.
 * @returns {IAccount[]} Filtered list of matching accounts.
 */
export const getAccountsOfTypes = (
  accounts: IAccount[],
  types: string[]
): IAccount[] =>
  accounts.filter((a) => types?.includes(a.type) || types?.includes(a.subtype));
