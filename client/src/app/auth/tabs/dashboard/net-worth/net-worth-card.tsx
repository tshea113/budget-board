import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AxiosResponse } from 'axios';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '@/components/auth-provider';
import { Account } from '@/types/account';
import NetWorthItem from './net-worth-item';
import { Skeleton } from '@/components/ui/skeleton';

const NetWorthCard = (): JSX.Element => {
  const { request } = React.useContext<any>(AuthContext);
  const accountsQuery = useQuery({
    queryKey: ['accounts'],
    queryFn: async (): Promise<Account[]> => {
      const res: AxiosResponse = await request({
        url: '/api/account',
        method: 'GET',
      });

      if (res.status == 200) {
        return res.data;
      }

      return [];
    },
  });

  const validAccounts = React.useMemo(() => {
    return (accountsQuery.data ?? []).filter((a) => !a.hideAccount);
  }, [accountsQuery]);

  if (accountsQuery.isPending) {
    return (
      <Card>
        <div className="m-3 flex flex-col space-y-3">
          <Skeleton className="h-10 max-w-[125px]" />
          <Skeleton className="h-[250px] rounded-xl" />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-2">
        <span className="w-1/2 text-2xl font-semibold tracking-tight">Net Worth</span>
      </div>
      <Separator />
      <div className="flex flex-col space-y-2 p-2">
        <NetWorthItem
          accounts={validAccounts}
          types={['Checking', 'Credit Card']}
          title={'Spending'}
        />
        <NetWorthItem accounts={validAccounts} types={['Loan']} title={'Loans'} />
        <NetWorthItem accounts={validAccounts} types={['Savings']} title={'Savings'} />
        <Separator />
        <NetWorthItem
          accounts={validAccounts}
          types={['Checking', 'Credit Card', 'Loan', 'Savings']}
          title={'Liquid'}
        />
        <NetWorthItem
          accounts={validAccounts}
          types={['Investment']}
          title={'Investments'}
        />
        <Separator />
        <NetWorthItem accounts={validAccounts} title={'Total'} />
      </div>
    </Card>
  );
};

export default NetWorthCard;
