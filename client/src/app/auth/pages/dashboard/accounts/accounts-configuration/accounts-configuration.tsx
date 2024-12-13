import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { GearIcon } from '@radix-ui/react-icons';
import { type Account } from '@/types/account';
import DeletedAccountsCards from './deleted-accounts-cards';
import AccountsConfigurationCards from './accounts-configuration-cards';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import React from 'react';
import AccountsConfigurationGroups from '../groups/accounts-configuration-groups';

interface AccountsConfigurationProps {
  accounts: Account[];
}

const AccountsConfiguration = (props: AccountsConfigurationProps): JSX.Element => {
  const [isReorder, setIsReorder] = React.useState(false);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <GearIcon className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetTitle hidden />
      <SheetContent side="top" className="flex h-full w-full flex-row justify-center">
        <div className="w-full gap-3 pt-2 2xl:max-w-screen-2xl">
          <ScrollArea className="h-full pr-4" type="auto">
            <div className="flex flex-col gap-3">
              <div className="flex flex-row items-center justify-between">
                <SheetHeader className="text-lg font-semibold">
                  Accounts Configuration
                </SheetHeader>
                <Button
                  className={cn(
                    isReorder ? 'border-success text-success hover:text-success' : ''
                  )}
                  variant="outline"
                  onClick={() => setIsReorder(!isReorder)}
                >
                  Reorder
                </Button>
              </div>
              <AccountsConfigurationGroups
                accounts={props.accounts.filter((a: Account) => a.deleted === null)}
                isReorder={isReorder}
              />
              <AccountsConfigurationCards
                accounts={props.accounts.filter((a: Account) => a.deleted === null)}
                isReorder={isReorder}
              />
              <DeletedAccountsCards
                deletedAccounts={props.accounts.filter(
                  (a: Account) => a.deleted !== null
                )}
              />
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AccountsConfiguration;
