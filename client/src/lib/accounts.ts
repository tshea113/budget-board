import type { AxiosResponse } from 'axios';
import request from './request';
import { type Account } from '@/types/account';

export const getAccounts = async (getHiddenAccounts: boolean): Promise<AxiosResponse> =>
  await request({
    url: '/api/account',
    method: 'GET',
    params: { getHidden: getHiddenAccounts },
  });

export const updateAccount = async (newAccount: Account): Promise<AxiosResponse> => {
  return await request({
    url: '/api/account',
    method: 'PUT',
    data: newAccount,
  });
};
