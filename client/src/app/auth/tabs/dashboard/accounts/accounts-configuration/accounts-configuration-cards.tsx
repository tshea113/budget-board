import { Account } from '@/types/account';
import AccountsConfigurationCard from './accounts-configuration-card';

interface AccountsConfigurationCardsProps {
  accounts: Account[];
}

const AccountsConfigurationCards = (
  props: AccountsConfigurationCardsProps
): JSX.Element => {
  return (
    <>
      <div className="hidden w-full grid-cols-11 items-center py-2 md:grid md:grid-cols-4">
        <span className="col-span-4 text-center md:col-span-1">Account</span>
        <span className="col-span-2 text-center md:col-span-1">Hide Account?</span>
        <span className="col-span-2 text-center md:col-span-1">Hide Transactions?</span>
        <span className="col-span-3 text-center md:col-span-1">Delete</span>
      </div>
      <div className="flex flex-col space-y-2">
        {(props.accounts.filter((a: Account) => a.deleted === null) ?? []).map(
          (account: Account) => (
            <AccountsConfigurationCard key={account.id} account={account} />
          )
        )}
      </div>
    </>
  );
};

export default AccountsConfigurationCards;
