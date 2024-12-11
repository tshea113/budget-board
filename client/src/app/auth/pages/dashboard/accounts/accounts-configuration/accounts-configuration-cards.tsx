import { Account } from '@/types/account';
import AccountsConfigurationCard from './accounts-configuration-card';
import { Sortable, SortableItem } from '@/components/sortable';

interface AccountsConfigurationCardsProps {
  accounts: Account[];
  isReorder: boolean;
}

const AccountsConfigurationCards = (
  props: AccountsConfigurationCardsProps
): JSX.Element => {
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
      <Sortable value={props.accounts}>
        <div className="flex flex-col space-y-2">
          {(props.accounts.filter((a: Account) => a.deleted === null) ?? []).map(
            (account: Account) => (
              <SortableItem value={account.id}>
                <AccountsConfigurationCard
                  key={account.id}
                  account={account}
                  isReorder={props.isReorder}
                />
              </SortableItem>
            )
          )}
        </div>
      </Sortable>
    </div>
  );
};

export default AccountsConfigurationCards;
