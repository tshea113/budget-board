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
