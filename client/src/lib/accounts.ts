import type { AxiosResponse } from 'axios';
import request from './request';
import { type Account } from '@/types/account';

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
