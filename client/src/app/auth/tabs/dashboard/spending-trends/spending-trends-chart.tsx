import { AuthContext } from '@/components/auth-provider';
import { getTransactionsForMonth } from '@/lib/transactions';
import { Transaction } from '@/types/transaction';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import React from 'react';

interface SpendingChartData {
  date: string;
  amount: number;
}

const SpendingTrendsChart = (): JSX.Element => {
  const { request } = React.useContext<any>(AuthContext);
  const transactionsQuery = useQuery({
    queryKey: ['transactions'],
    queryFn: async (): Promise<Transaction[]> => {
      const res: AxiosResponse = await request({
        url: '/api/transaction',
        method: 'GET',
      });

      if (res.status == 200) {
        return res.data;
      }

      return [];
    },
  });

  const transactionsForMonth = React.useMemo(() => {
    return getTransactionsForMonth(transactionsQuery.data ?? [], new Date());
  }, [transactionsQuery]);

  return <div></div>;
};

export default SpendingTrendsChart;
