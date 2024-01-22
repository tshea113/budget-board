import AccountCard from './account-card';
import WelcomeCard from './welcome-card';
import { useState } from 'react';
import AddAccount from './add-account';

const Dashboard = (): JSX.Element => {
  const [addAccountIsOpen, setAddAccountIsOpen] = useState(false);

  const toggleAddAccount = (): void => {
    setAddAccountIsOpen((addAccountIsOpen) => !addAccountIsOpen);
  };
  return (
    <div>
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
