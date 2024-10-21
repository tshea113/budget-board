import { Skeleton } from '@/components/ui/skeleton';
import EmailVerified from '../../../../components/email-verified';
import { AuthContext } from '@/components/auth-provider';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { Transaction } from '@/types/transaction';
import TransactionCards from './transaction-cards';

const Transactions = (): JSX.Element => {
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

  if (transactionsQuery.isPending) {
    return <Skeleton className="h-[550px] w-full rounded-xl" />;
  }

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <EmailVerified />
      <TransactionCards transactions={transactionsQuery.data ?? []} />
    </div>
  );
};

export default Transactions;
