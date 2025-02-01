import { Card } from '@/components/ui/card';
import AccountsConfiguration from './accounts-configuration/accounts-configuration';
import InstitutionItems from './institution-items';
import { Separator } from '@/components/ui/separator';
import React from 'react';
import { AuthContext } from '@/components/auth-provider';
import { useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { Skeleton } from '@/components/ui/skeleton';
import { translateAxiosError } from '@/lib/requests';
import { toast } from 'sonner';
import { IInstitution } from '@/types/institution';
import { IAccount } from '@/types/account';

const AccountCard = (): JSX.Element => {
  const { request } = React.useContext<any>(AuthContext);
  const institutionQuery = useQuery({
    queryKey: ['institutions'],
    queryFn: async (): Promise<IInstitution[]> => {
      const res: AxiosResponse = await request({
        url: '/api/institution',
        method: 'GET',
      });

      if (res.status === 200) {
        return res.data as IInstitution[];
      }

      return [];
    },
  });

  const accountsQuery = useQuery({
    queryKey: ['accounts'],
    queryFn: async (): Promise<IAccount[]> => {
      const res: AxiosResponse = await request({
        url: '/api/account',
        method: 'GET',
      });

      if (res.status === 200) {
        return res.data as IAccount[];
      }

      return [];
    },
  });

  React.useEffect(() => {
    if (institutionQuery.error) {
      toast.error(translateAxiosError(institutionQuery.error as AxiosError));
    }
  }, [institutionQuery.error]);

  React.useEffect(() => {
    if (accountsQuery.error) {
      toast.error(translateAxiosError(accountsQuery.error as AxiosError));
    }
  }, [accountsQuery.error]);

  if (institutionQuery.isPending || accountsQuery.isPending) {
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
    <Card className="flex flex-col">
      <div className="flex flex-row items-center p-2">
        <span className="w-full grow text-2xl font-semibold tracking-tight">
          Accounts
        </span>
        <AccountsConfiguration
          institutions={institutionQuery.data ?? []}
          accounts={accountsQuery.data ?? []}
        />
      </div>
      <Separator />
      <div className="p-2">
        <InstitutionItems
          institutions={institutionQuery.data ?? []}
          accounts={accountsQuery.data ?? []}
        />
      </div>
    </Card>
  );
};

export default AccountCard;
