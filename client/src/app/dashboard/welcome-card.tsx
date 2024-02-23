import { AuthContext } from '@/components/auth-provider';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useContext } from 'react';

const WelcomeCard = (): JSX.Element => {
  const { currentUserState } = useContext<any>(AuthContext);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Hello, {currentUserState?.email}.</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default WelcomeCard;
