import type { AxiosResponse } from 'axios';
import request from './request';

export const getAccounts = async (): Promise<AxiosResponse> =>
  await request({
    url: '/api/account',
  });
