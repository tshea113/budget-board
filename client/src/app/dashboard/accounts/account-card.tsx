import SkeletonCard from '@/app/dashboard/skeleton-account-card';
import { Card } from '@/components/ui/card';
import AccountsConfiguration from './accounts-configuration';
import AccountItems from './account-items';
import { Separator } from '@/components/ui/separator';
import { useAccountsQuery } from '@/lib/query';
import { type Account } from '@/types/account';

const AccountCard = (): JSX.Element => {
  const accountsQuery = useAccountsQuery();

  if (accountsQuery.isPending) {
    return <SkeletonCard />;
  }

  return (
    <Card className="w-full">
      <div className="flex flex-row items-center p-2">
        <span className="w-1/2 text-2xl font-semibold tracking-tight">Accounts</span>
        <div className="flex w-1/2 flex-row justify-end">
          <AccountsConfiguration />
        </div>
      </div>
      <Separator />
      <div className="p-2">
        <AccountItems
          accounts={accountsQuery.data?.data.filter((a: Account) => !a.hideAccount) ?? []}
        />
      </div>
    </Card>
  );
};

export default AccountCard;
