import { AuthContext } from '@/Misc/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { firebaseAuth } from '@/lib/firebase';
import { useQueryClient } from '@tanstack/react-query';
import { signOut } from 'firebase/auth';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomeCard = (): JSX.Element => {
  const { user } = useContext<any>(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const Logout = (): void => {
    signOut(firebaseAuth)
      .then(() => {
        queryClient.removeQueries();
        navigate('/');
      })
      .catch((err) => {
        // TODO: Make this an alert dialog
        console.log(err);
      });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Hello, {user?.email}.</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={Logout}>Logout</Button>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
