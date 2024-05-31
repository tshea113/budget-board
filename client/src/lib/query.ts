import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { getAccounts } from './accounts';
import { type AxiosResponse } from 'axios';
import { getUser } from './user';
import { getTransactions } from './transactions';
import { getBudgets } from './budgets';
import { getGoals } from './goals';

export const useAccountsQuery = (): UseQueryResult<AxiosResponse<any, any>, Error> =>
  useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await getAccounts();
      return response;
    },
  });

export const useUserQuery = (): UseQueryResult<AxiosResponse<any, any>, Error> =>
  useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await getUser();
      return response;
    },
  });

export const useTransactionsQuery = (): UseQueryResult<AxiosResponse<any, any>, Error> =>
  useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await getTransactions();
      return response;
    },
  });

export const useBudgetsQuery = (
  date: Date
): UseQueryResult<AxiosResponse<any, any>, Error> =>
  useQuery({
    queryKey: ['budgets', { date }],
    queryFn: async () => {
      const response = await getBudgets(date);
      return response;
    },
  });

export const useGoalsQuery = (): UseQueryResult<AxiosResponse<any, any>, Error> =>
  useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const response = await getGoals();
      return response;
    },
  });
