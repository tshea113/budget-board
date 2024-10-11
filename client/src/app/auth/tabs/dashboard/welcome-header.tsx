import SyncAccountButton from './sync-account-button';
import React from 'react';
import { AuthContext } from '@/components/auth-provider';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { InfoResponse } from '@/types/user';

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

  return (
    <div className="flex w-full flex-row p-2">
      <span className="w-1/2 self-center text-2xl font-semibold tracking-tight">
        Hello, {userInfoQuery.data?.email ?? 'not available'}.
      </span>
      <div className="flex w-1/2 flex-row-reverse">
        <SyncAccountButton />
      </div>
    </div>
  );
};

export default WelcomeHeader;
