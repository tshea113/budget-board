import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SyncAccountButton from './sync-account-button';
import { useUserInfoQuery } from '@/lib/query';
import React from 'react';
import { AuthContext } from '@/components/auth-provider';

const WelcomeCard = (): JSX.Element => {
  const { accessToken } = React.useContext<any>(AuthContext);

  const userInfoQuery = useUserInfoQuery(accessToken);

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
