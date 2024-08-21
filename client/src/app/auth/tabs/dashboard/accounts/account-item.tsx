import { type Account } from '@/types/account';

interface AccountItemProps {
  account: Account;
}

const AccountItem = (props: AccountItemProps): JSX.Element => {
  return (
    <div className="grid grid-rows-2 p-1">
      <div className="row-span-1 grid grid-cols-10">
        <div className="col-span-6 text-left">
          <span className="text-base tracking-tight">{props.account.name}</span>
        </div>
        <span className="col-span-4 text-right">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(props.account.currentBalance)}
        </span>
      </div>
      <span className="row-span-1 text-right text-sm text-muted-foreground">
        Last updated: {new Date(props.account.balanceDate).toLocaleString()}
      </span>
    </div>
  );
};

export default AccountItem;
