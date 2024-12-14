import { Account } from '@/types/account';
import AccountsConfigurationCard from './accounts-configuration-card';
import { Sortable, SortableItem } from '@/components/sortable';
import React from 'react';

interface AccountsConfigurationCardsProps {
  accounts: Account[];
  isReorder: boolean;
}

const AccountsConfigurationCards = (
  props: AccountsConfigurationCardsProps
): JSX.Element => {
  const [sortedAccounts, setSortedAccounts] = React.useState<Account[]>(
    props.accounts?.filter((a: Account) => a.deleted === null) ?? []
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="hidden w-full items-center text-center md:flex md:flex-row">
        <span className="md:w-1/3">Account</span>
        <div className="flex w-2/3 flex-row justify-between">
          <span className="w-1/4 min-w-[185px]">Category</span>
          <span className="w-1/4">Hide Account?</span>
          <span className="w-1/4">Hide Transactions?</span>
          <span className="w-1/4 min-w-[64px]">Delete</span>
        </div>
      </div>
      <Sortable
        value={sortedAccounts}
        onMove={({ activeIndex: from, overIndex: to }) => {
          const newAccounts = [...sortedAccounts];
          const [movedAccount] = newAccounts.splice(from, 1);
          newAccounts.splice(to, 0, movedAccount);
          setSortedAccounts(newAccounts);
        }}
      >
        <div className="flex flex-col space-y-2">
          {sortedAccounts.map((account: Account) => (
            <SortableItem value={account.id} key={account.id}>
              <AccountsConfigurationCard
                key={account.id}
                account={account}
                isReorder={props.isReorder}
              />
            </SortableItem>
          ))}
        </div>
      </Sortable>
    </div>
  );
};

export default AccountsConfigurationCards;
