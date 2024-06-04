import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { getAccounts } from './accounts';
import { type AxiosResponse } from 'axios';
import { getUser } from './user';
import { getTransactions } from './transactions';
import { getBudgets } from './budgets';
import { getGoals } from './goals';
import { getUserInfo } from './auth';

export const useAccountsQuery = (
  accessToken: string
): UseQueryResult<AxiosResponse<any, any>, Error> =>
  useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await getAccounts(accessToken);
      return response;
    },
  });

export const useUserQuery = (
  accessToken: string
): UseQueryResult<AxiosResponse<any, any>, Error> =>
  useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await getUser(accessToken);
      return response;
    },
  });

export const useTransactionsQuery = (
  accessToken: string
): UseQueryResult<AxiosResponse<any, any>, Error> =>
  useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await getTransactions(accessToken);
      return response;
    },
  });

export const useBudgetsQuery = (
  accessToken: string,
  date: Date
): UseQueryResult<AxiosResponse<any, any>, Error> =>
  useQuery({
    queryKey: ['budgets', { date }],
    queryFn: async () => {
      const response = await getBudgets(accessToken, date);
      return response;
    },
  });

export const useGoalsQuery = (
  accessToken: string
): UseQueryResult<AxiosResponse<any, any>, Error> =>
  useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const response = await getGoals(accessToken);
      return response;
    },
  });

export const useUserInfoQuery = (
  accessToken: string
): UseQueryResult<AxiosResponse<any, any>, Error> =>
  useQuery({
    queryKey: ['info'],
    queryFn: async () => {
      const response = await getUserInfo(accessToken);
      return response;
    },
  });
