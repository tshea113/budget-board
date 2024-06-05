import TransactionsDataTable from './transactions-data-table';
import { columns } from './columns';
import { Skeleton } from '@/components/ui/skeleton';
import EmailVerified from '../../../../components/email-verified';
import { AuthContext } from '@/components/auth-provider';
import React from 'react';
import { useQuery } from '@tanstack/react-query';

const Transactions = (): JSX.Element => {
  const { request } = React.useContext<any>(AuthContext);

  const transactionsQuery = useQuery({
    queryKey: ['transactions'],
    queryFn: async () =>
      await request({
        url: '/api/transaction',
        method: 'GET',
      }),
  });

  if (transactionsQuery.isPending) {
    return <Skeleton className="h-[550px] w-screen rounded-xl" />;
  }

  return (
    <div className="flex w-screen flex-col items-center">
      <EmailVerified />
      <div className="max-w-screen w-full px-4 2xl:max-w-screen-2xl">
        <TransactionsDataTable
          columns={columns}
          data={transactionsQuery.data?.data ?? []}
        />
      </div>
    </div>
  );
};

export default Transactions;
