import { type Account } from '@/types/account';

interface AccountItemProps {
  account: Account;
}

const AccountItem = (props: AccountItemProps): JSX.Element => {
  return (
    <div className="grid grid-cols-10 p-1">
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
  );
};

export default AccountItem;
