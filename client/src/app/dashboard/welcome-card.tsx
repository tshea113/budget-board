import { AuthContext } from '@/components/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useContext } from 'react';
import SyncAccountButton from './sync-account-button';

const WelcomeCard = (): JSX.Element => {
  const { currentUserState } = useContext<any>(AuthContext);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Hello, {currentUserState?.email}.</CardTitle>
      </CardHeader>
      <CardContent>
        <SyncAccountButton />
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
