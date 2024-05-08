import type { AxiosResponse } from 'axios';
import request from './request';
import { type Account } from '@/types/account';

export const deletePeriod: number = 120;

export const getAccounts = async (): Promise<AxiosResponse> =>
  await request({
    url: '/api/account',
    method: 'GET',
  });

export const updateAccount = async (newAccount: Account): Promise<AxiosResponse> => {
  return await request({
    url: '/api/account',
    method: 'PUT',
    data: newAccount,
  });
};

export const deleteAccount = async (
  guid: string,
  deleteTransactions: boolean
): Promise<AxiosResponse> => {
  return await request({
    url: '/api/account',
    method: 'DELETE',
    params: { guid, deleteTransactions },
  });
};

export const restoreAccount = async (guid: string): Promise<AxiosResponse> => {
  return await request({
    url: '/api/account/restore',
    method: 'POST',
    params: { guid },
  });
};

export const filterVisibleAccounts = (accounts: Account[]): Account[] => {
  return accounts.filter((a: Account) => !(a.hideAccount || a.deleted !== null));
};
