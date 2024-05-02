import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { GearIcon } from '@radix-ui/react-icons';
import AccountsConfigurationCard from './accounts-configuration-card';
import { type Account } from '@/types/account';
import { useAccountsQuery } from '@/lib/query';

const AccountsConfiguration = (): JSX.Element => {
  const accountsQuery = useAccountsQuery(true);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <GearIcon className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>Accounts Configuration</SheetHeader>
        <div className="flex w-full flex-row items-center">
          <span className="w-1/4 px-8 py-2 text-center">Account</span>
          <span className="w-1/4 px-8 py-2 text-center">Hide Account?</span>
          <span className="w-1/4 px-8 py-2 text-center">Hide Transactions?</span>
        </div>
        {(accountsQuery.data?.data ?? []).map((account: Account) => (
          <AccountsConfigurationCard key={account.id} account={account} />
        ))}
      </SheetContent>
    </Sheet>
  );
};

export default AccountsConfiguration;
