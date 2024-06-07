import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SyncAccountButton from './sync-account-button';
import React from 'react';
import { AuthContext } from '@/components/auth-provider';
import { useQuery } from '@tanstack/react-query';

const WelcomeCard = (): JSX.Element => {
  const { request } = React.useContext<any>(AuthContext);

  const userInfoQuery = useQuery({
    queryKey: ['info'],
    queryFn: async () =>
      await request({
        url: '/api/manage/info',
        method: 'GET',
      }),
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Hello, {userInfoQuery.data?.data.email ?? 'not available'}.</CardTitle>
      </CardHeader>
      <CardContent>
        <SyncAccountButton />
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
