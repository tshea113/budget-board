import type { AxiosResponse } from 'axios';
import request from './request';
import { type Account } from '@/types/account';

export const getAccounts = async (accessToken: string): Promise<AxiosResponse> =>
  await request(
    {
      url: '/api/account',
      method: 'GET',
    },
    accessToken
  );

export const getAccount = async (
  accessToken: string,
  guid: string
): Promise<AxiosResponse> =>
  await request(
    {
      url: '/api/account',
      method: 'GET',
      params: { guid },
    },
    accessToken
  );

export const updateAccount = async (
  accessToken: string,
  newAccount: Account
): Promise<AxiosResponse> =>
  await request(
    {
      url: '/api/account',
      method: 'PUT',
      data: newAccount,
    },
    accessToken
  );

export const deleteAccount = async (
  accessToken: string,
  guid: string,
  deleteTransactions: boolean
): Promise<AxiosResponse> =>
  await request(
    {
      url: '/api/account',
      method: 'DELETE',
      params: { guid, deleteTransactions },
    },
    accessToken
  );

export const restoreAccount = async (
  accessToken: string,
  guid: string
): Promise<AxiosResponse> =>
  await request(
    {
      url: '/api/account/restore',
      method: 'POST',
      params: { guid },
    },
    accessToken
  );

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
