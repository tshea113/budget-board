import { AuthContext } from '@/Misc/AuthProvider';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useContext } from 'react';

const WelcomeCard = (): JSX.Element => {
  const { user } = useContext<any>(AuthContext);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Hello, {user?.email}.</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default WelcomeCard;
