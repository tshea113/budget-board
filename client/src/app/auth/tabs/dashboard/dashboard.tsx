/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import AccountCard from './accounts/account-card';
import WelcomeHeader from './welcome-header';
import EmailVerified from '../../../../components/email-verified';
import UncategorizedTransactionsCard from './uncategorized-transactions/uncategorized-transactions-card';
import NetWorthCard from './net-worth/net-worth-card';
import SpendingTrendsCard from './spending-trends/spending-trends-card';

const Dashboard = (): JSX.Element => {
  return (
    <div>
      <EmailVerified />
      <div className="flex flex-col gap-2 lg:grid lg:grid-flow-col lg:grid-cols-10">
        <div className="col-span-3 row-span-full space-y-2 2xl:col-span-2">
          <AccountCard />
          <NetWorthCard />
        </div>
        <div className="col-span-7 space-y-2 2xl:col-span-8">
          <WelcomeHeader />
          <UncategorizedTransactionsCard />
          <SpendingTrendsCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
