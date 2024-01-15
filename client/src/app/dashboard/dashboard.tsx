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
        console.log(err);
      });
  };
  return (
    <div>
      <Button onClick={Logout}>Logout</Button>
      <div className="grid grid-flow-col grid-cols-3 grid-rows-3 gap-2">
        <div className="row-span-full">
          <AccountCard toggleAddAccount={toggleAddAccount} />
        </div>
        <div className="col-span-2">
          {addAccountIsOpen && <AddAccount />}
          <WelcomeCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
