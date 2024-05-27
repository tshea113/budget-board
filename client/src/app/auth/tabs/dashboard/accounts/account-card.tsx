import { Card } from '@/components/ui/card';
import AccountsConfiguration from './accounts-configuration';
import AccountItems from './account-items';
import { Separator } from '@/components/ui/separator';
import { useAccountsQuery } from '@/lib/query';
import SkeletonAccountCard from './skeleton-account-card';

const AccountCard = (): JSX.Element => {
  const accountsQuery = useAccountsQuery();

  if (accountsQuery.isPending) {
    return <SkeletonAccountCard />;
  }

  return (
    <Card className="w-full">
      <div className="flex flex-row items-center p-2">
        <span className="w-1/2 text-2xl font-semibold tracking-tight">Accounts</span>
        <div className="flex w-1/2 flex-row justify-end">
          <AccountsConfiguration accounts={accountsQuery.data?.data ?? []} />
        </div>
      </div>
      <Separator />
      <div className="p-2">
        <AccountItems accounts={accountsQuery.data?.data ?? []} />
      </div>
    </Card>
  );
};

export default AccountCard;
