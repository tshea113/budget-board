/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import AccountCard from './account-card';
import WelcomeCard from './welcome-card';
import { useContext, useState } from 'react';
import AddAccount from './add-account';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { AuthContext } from '@/components/auth-provider';

const Dashboard = (): JSX.Element => {
  const [addAccountIsOpen, setAddAccountIsOpen] = useState(false);
  const { emailVerified } = useContext<any>(AuthContext);

  const toggleAddAccount = (): void => {
    setAddAccountIsOpen((addAccountIsOpen) => !addAccountIsOpen);
  };
  return (
    <div>
      {!emailVerified && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Before you can get started you will need to check your email for a validation link.
          </AlertDescription>
        </Alert>
      )}
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
