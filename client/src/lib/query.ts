import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { getAccounts } from './accounts';
import { type AxiosResponse } from 'axios';
import { getUser } from './user';
import { getTransactions } from './transactions';
import { getBudgets } from './budgets';

export const useAccountsQuery = (): UseQueryResult<AxiosResponse<any, any>, Error> => {
  const queryName = 'accounts';
  const accountsQuery = useQuery({
    queryKey: [queryName],
    queryFn: async () => {
      const response = await getAccounts();
      return response;
    },
  });

  return accountsQuery;
};

export const useUserQuery = (): UseQueryResult<AxiosResponse<any, any>, Error> => {
  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await getUser();
      return response;
    },
  });

  return userQuery;
};

export const useTransactionsQuery = (): UseQueryResult<AxiosResponse<any, any>, Error> => {
  const transactionsQuery = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await getTransactions();
      return response;
    },
  });

  return transactionsQuery;
};

export const useBudgetsQuery = (date: Date): UseQueryResult<AxiosResponse<any, any>, Error> => {
  const budgetsQuery = useQuery({
    queryKey: ['budgets', { date }],
    queryFn: async () => {
      const response = await getBudgets(date);
      return response;
    },
  });

  return budgetsQuery;
};
