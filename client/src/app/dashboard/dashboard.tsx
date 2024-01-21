import { Button } from '@/components/ui/button';
import { firebaseAuth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import AccountCard from './account-card';
import WelcomeCard from './welcome-card';
import { useState } from 'react';
import AddAccount from './add-account';

const Dashboard = (): JSX.Element => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [addAccountIsOpen, setAddAccountIsOpen] = useState(false);

  const toggleAddAccount = (): void => {
    setAddAccountIsOpen((addAccountIsOpen) => !addAccountIsOpen);
  };

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
    <div>
      <Button onClick={Logout}>Logout</Button>
      <div className="flex flex-col gap-2 lg:grid lg:grid-flow-col lg:grid-cols-3 lg:grid-rows-5">
        <div className="lg:row-span-full">
          <AccountCard toggleAddAccount={toggleAddAccount} />
        </div>
        <div className="lg:col-span-2">
          {addAccountIsOpen && <AddAccount />}
          <WelcomeCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
