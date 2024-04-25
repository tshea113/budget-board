import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { getAccounts } from './accounts';
import { type AxiosResponse } from 'axios';

export const useAccountsQuery = (): UseQueryResult<AxiosResponse<any, any>, Error> => {
  const accountsQuery = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await getAccounts();

      return response;
    },
  });

  return accountsQuery;
};
