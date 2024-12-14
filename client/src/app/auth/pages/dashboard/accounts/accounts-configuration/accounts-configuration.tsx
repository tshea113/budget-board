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
import DeletedAccountsCards from './delete/deleted-accounts-cards';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import React from 'react';
import AccountsConfigurationGroups from './accounts-configuration-groups';
import { Institution } from '@/types/institution';

interface AccountsConfigurationProps {
  institutions: Institution[];
}

const AccountsConfiguration = (props: AccountsConfigurationProps): JSX.Element => {
  const [sortedInstitutions, setSortedInstitutions] = React.useState<Institution[]>(
    props.institutions.sort((a, b) => a.index - b.index)
  );
  const [isReorder, setIsReorder] = React.useState(false);

  const onReorderClick = () => {
    if (isReorder) {
      // TODO: Save the new order in the backend
      console.log('Save the new order');
      console.log(sortedInstitutions);
    }
    setIsReorder(!isReorder);
  };

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
                  onClick={onReorderClick}
                >
                  {isReorder ? 'Save' : 'Reorder'}
                </Button>
              </div>
              <AccountsConfigurationGroups
                sortedInstitutions={sortedInstitutions}
                setSortedInstitutions={setSortedInstitutions}
                isReorder={isReorder}
              />
              <DeletedAccountsCards
                deletedAccounts={props.institutions
                  .flatMap((i) => i.accounts)
                  .filter((a: Account) => a.deleted !== null)}
              />
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AccountsConfiguration;
