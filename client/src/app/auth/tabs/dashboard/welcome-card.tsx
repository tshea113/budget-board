import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SyncAccountButton from './sync-account-button';
import { useUserInfoQuery } from '@/lib/query';

const WelcomeCard = (): JSX.Element => {
  const userInfoQuery = useUserInfoQuery();

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
