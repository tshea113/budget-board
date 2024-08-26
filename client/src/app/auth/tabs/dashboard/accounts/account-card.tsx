import { Card } from '@/components/ui/card';
import AccountsConfiguration from './accounts-configuration/accounts-configuration';
import AccountItems from './account-items';
import { Separator } from '@/components/ui/separator';
import SkeletonAccountCard from './skeleton-account-card';
import React from 'react';
import { AuthContext } from '@/components/auth-provider';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { Account } from '@/types/account';

const AccountCard = (): JSX.Element => {
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

  if (accountsQuery.isPending) {
    return <SkeletonAccountCard />;
  }

  return (
    <Card className="w-full">
      <div className="flex flex-row items-center p-2">
        <span className="w-1/2 text-2xl font-semibold tracking-tight">Accounts</span>
        <div className="flex w-1/2 flex-row justify-end">
          <AccountsConfiguration accounts={accountsQuery.data ?? []} />
        </div>
      </div>
      <Separator />
      <div className="p-2">
        <AccountItems accounts={accountsQuery.data ?? []} />
      </div>
    </Card>
  );
};

export default AccountCard;
