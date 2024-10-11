/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import AccountCard from './accounts/account-card';
import WelcomeHeader from './welcome-header';
import EmailVerified from '../../../../components/email-verified';
import UncategorizedTransactionsCard from './uncategorized-transactions/uncategorized-transactions-card';
import NetWorthCard from './net-worth/net-worth-card';
import SpendingTrendsCard from './spending-trends/spending-trends-card';

const Dashboard = (): JSX.Element => {
  return (
    <div className="flex w-full flex-col items-center">
      <EmailVerified />
      <div className="flex w-full flex-col gap-2 lg:flex-row 2xl:max-w-screen-2xl">
        <div className="space-y-2 lg:w-2/5 lg:max-w-[425px]">
          <AccountCard />
          <NetWorthCard />
        </div>
        <div className="w-full space-y-2">
          <WelcomeHeader />
          <UncategorizedTransactionsCard />
          <SpendingTrendsCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
