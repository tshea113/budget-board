import type { AxiosResponse } from 'axios';
import request from './request';
import { queryOptions } from '@tanstack/react-query';

export const getAccounts = async (): Promise<AxiosResponse> =>
  await request({
    url: '/api/account',
  });

export const groupOptions = (): unknown => {
  return queryOptions({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await getAccounts();
      return response;
    },
  });
};
