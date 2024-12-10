import { Account } from '@/types/account';
import AccountsConfigurationCard from './accounts-configuration-card';
import { Sortable, SortableItem } from '@/components/sortable';

interface AccountsConfigurationCardsProps {
  accounts: Account[];
}

const AccountsConfigurationCards = (
  props: AccountsConfigurationCardsProps
): JSX.Element => {
  return (
    <>
      <div className="hidden w-full items-center p-2 text-center md:flex md:flex-row">
        <span className="md:w-1/2">Account</span>
        <div className="flex w-1/2 flex-row justify-between">
          <span className="w-1/4">Category</span>
          <span className="w-[105px]">Hide Account?</span>
          <span className="w-[135px]">Hide Transactions?</span>
          <span className="w-[64px]">Delete</span>
        </div>
      </div>
      <Sortable value={props.accounts}>
        <div className="flex flex-col space-y-2">
          {(props.accounts.filter((a: Account) => a.deleted === null) ?? []).map(
            (account: Account) => (
              <SortableItem value={account.id}>
                <AccountsConfigurationCard key={account.id} account={account} />
              </SortableItem>
            )
          )}
        </div>
      </Sortable>
    </>
  );
};

export default AccountsConfigurationCards;
