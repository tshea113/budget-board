import { type AxiosResponse } from 'axios';
import request from './request';

export const getTransactions = async (): Promise<AxiosResponse> =>
  await request({
    url: '/api/transaction',
  });

export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString([], options);
};
