/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import AccountCard from './accounts/account-card';
import WelcomeCard from './welcome-card';
import EmailVerified from '../../../../components/email-verified';

const Dashboard = (): JSX.Element => {
  return (
    <div>
      <EmailVerified />
      <div className="flex flex-col gap-2 lg:grid lg:grid-flow-col lg:grid-cols-10 lg:grid-rows-5">
        <div className="lg:col-span-4 lg:row-span-full xl:col-span-3">
          <AccountCard />
        </div>
        <div className="lg:col-span-6 xl:col-span-8">
          <WelcomeCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
