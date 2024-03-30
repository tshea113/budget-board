import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SyncAccountButton from './sync-account-button';
import { firebaseAuth } from '@/lib/firebase';

const WelcomeCard = (): JSX.Element => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Hello, {firebaseAuth.currentUser?.email ?? 'not available'}.</CardTitle>
      </CardHeader>
      <CardContent>
        <SyncAccountButton />
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
