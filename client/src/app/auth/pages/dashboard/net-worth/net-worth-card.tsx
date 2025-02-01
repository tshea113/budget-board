import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AxiosError, AxiosResponse } from 'axios';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '@/components/auth-provider';
import { IAccount } from '@/types/account';
import NetWorthItem from './net-worth-item';
import { Skeleton } from '@/components/ui/skeleton';
import { translateAxiosError } from '@/lib/requests';
import { toast } from 'sonner';
import { filterVisibleAccounts } from '@/lib/accounts';

const NetWorthCard = (): JSX.Element => {
  const { request } = React.useContext<any>(AuthContext);
  const accountsQuery = useQuery({
    queryKey: ['accounts'],
    queryFn: async (): Promise<IAccount[]> => {
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

  React.useEffect(() => {
    if (accountsQuery.error) {
      toast.error(translateAxiosError(accountsQuery.error as AxiosError));
    }
  }, [accountsQuery.error]);

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

  const validAccounts = filterVisibleAccounts(accountsQuery.data ?? []);

  return (
    <Card className="flex flex-col">
      <span className="p-2 text-2xl font-semibold tracking-tight">Net Worth</span>
      <Separator />
      <div className="flex flex-col gap-2 p-2">
        <div className="flex flex-col gap-1">
          <NetWorthItem
            accounts={validAccounts}
            types={['Checking', 'Credit Card']}
            title={'Spending'}
          />
          <NetWorthItem accounts={validAccounts} types={['Loan']} title={'Loans'} />
          <NetWorthItem accounts={validAccounts} types={['Savings']} title={'Savings'} />
        </div>
        <Separator />
        <div className="flex flex-col gap-1">
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
        </div>
        <Separator />
        <NetWorthItem accounts={validAccounts} title={'Total'} />
      </div>
    </Card>
  );
};

export default NetWorthCard;
