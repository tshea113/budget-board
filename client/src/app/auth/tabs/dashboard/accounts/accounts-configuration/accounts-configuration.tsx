import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { GearIcon } from '@radix-ui/react-icons';
import { type Account } from '@/types/account';
import DeletedAccountsCards from './deleted-accounts-cards';
import AccountsConfigurationCards from './accounts-configuration-cards';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AccountsConfigurationProps {
  accounts: Account[];
}

const AccountsConfiguration = (props: AccountsConfigurationProps): JSX.Element => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <GearIcon className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="h-full">
        <div className="flex h-full w-full flex-row justify-center">
          <div className="w-full space-y-3 2xl:max-w-screen-2xl">
            <ScrollArea className="h-full">
              <SheetHeader className="pb-2">Accounts Configuration</SheetHeader>
              <AccountsConfigurationCards accounts={props.accounts} />
              <DeletedAccountsCards
                deletedAccounts={props.accounts.filter(
                  (a: Account) => a.deleted !== null
                )}
              />
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AccountsConfiguration;
