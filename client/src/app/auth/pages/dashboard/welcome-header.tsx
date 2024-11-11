import SyncAccountButton from './sync-account-button';
import React from 'react';
import { AuthContext } from '@/components/auth-provider';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { InfoResponse } from '@/types/user';
import { Skeleton } from '@/components/ui/skeleton';

const WelcomeHeader = (): JSX.Element => {
  const { request } = React.useContext<any>(AuthContext);

  const userInfoQuery = useQuery({
    queryKey: ['info'],
    queryFn: async (): Promise<InfoResponse | undefined> => {
      const res: AxiosResponse = await request({
        url: '/api/manage/info',
        method: 'GET',
      });

      if (res.status == 200) {
        return res.data;
      }

      return undefined;
    },
  });

  if (userInfoQuery.isPending) {
    return (
      <div className="flex flex-row">
        <Skeleton className="h-10 w-[30%]" />
        <div className="grow" />
        <Skeleton className="h-10 w-[100px]" />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-row flex-wrap gap-2 p-2">
      <span className="grow self-center text-2xl font-semibold tracking-tight">
        Hello, {userInfoQuery.data?.email ?? 'not available'}.
      </span>
      <SyncAccountButton />
    </div>
  );
};

export default WelcomeHeader;
