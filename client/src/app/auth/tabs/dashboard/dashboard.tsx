/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import AccountCard from './accounts/account-card';
import WelcomeCard from './welcome-card';
import EmailVerified from '../../../../components/email-verified';
import UncategorizedTransactionsCard from './uncategorized-transactions/uncategorized-transactions-card';

const Dashboard = (): JSX.Element => {
  return (
    <div className="flex flex-col items-center">
      <EmailVerified />
      <div className="flex flex-col gap-2 lg:grid lg:grid-flow-col lg:grid-cols-10 lg:grid-rows-5 2xl:max-w-screen-2xl">
        <div className="col-span-3 row-span-full">
          <AccountCard />
        </div>
        <div className="col-span-7 space-y-2">
          <WelcomeCard />
          <UncategorizedTransactionsCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
