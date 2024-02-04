import { type AxiosResponse } from 'axios';
import request from './request';
import { Category, SubCategory } from '@/types/transaction';

export const getTransactions = async (): Promise<AxiosResponse> =>
  await request({
    url: '/api/transaction',
  });

export const getSubCategories = (category: string): string[] => {
  return SubCategory[Category.indexOf(category)] ?? [];
};

export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString([], options);
};
