import { Card } from '@/components/ui/card';
import AccountsConfiguration from './accounts-configuration/accounts-configuration';
import AccountItems from './account-items';
import { Separator } from '@/components/ui/separator';
import SkeletonAccountCard from './skeleton-account-card';
import React from 'react';
import { AuthContext } from '@/components/auth-provider';
import { useQuery } from '@tanstack/react-query';

const AccountCard = (): JSX.Element => {
  const { request } = React.useContext<any>(AuthContext);
  const accountsQuery = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      return await request({
        url: '/api/account',
        method: 'GET',
      });
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
          <AccountsConfiguration accounts={accountsQuery.data?.data ?? []} />
        </div>
      </div>
      <Separator />
      <div className="p-2">
        <AccountItems accounts={accountsQuery.data?.data ?? []} />
      </div>
    </Card>
  );
};

export default AccountCard;
