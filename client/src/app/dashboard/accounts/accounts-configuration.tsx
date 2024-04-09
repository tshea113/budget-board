import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { GearIcon } from '@radix-ui/react-icons';
import AccountsConfigurationCard from './accounts-configuration-card';
import { useQuery } from '@tanstack/react-query';
import { getAccounts } from '@/lib/accounts';
import { type Account } from '@/types/account';

const AccountsConfiguration = (): JSX.Element => {
  const accountsQuery = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await getAccounts();
      return response;
    },
  });

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
          <div className="w-1/4 px-8 py-2 text-center">Account</div>
          <div className="w-1/4 px-8 py-2 text-center">Hide Transactions?</div>
        </div>
        {(accountsQuery.data?.data ?? []).map((account: Account) => (
          <AccountsConfigurationCard key={account.id} account={account} />
        ))}
      </SheetContent>
    </Sheet>
  );
};

export default AccountsConfiguration;
