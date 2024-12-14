import { cn, convertNumberToCurrency } from '@/lib/utils';
import { type Account } from '@/types/account';

interface AccountItemProps {
  account: Account;
}

const AccountItem = (props: AccountItemProps): JSX.Element => {
  return (
    <div className="flex flex-col px-1">
      <div className="flex flex-row justify-between">
        <span className="text-base tracking-tight">{props.account.name}</span>
        <span
          className={cn(
            'font-semibold',
            props.account.currentBalance < 0 ? 'text-destructive' : 'text-success'
          )}
        >
          {convertNumberToCurrency(props.account.currentBalance, true)}
        </span>
      </div>
      <span className="text-sm text-muted-foreground">
        {'Last updated: '}
        {props.account.balanceDate
          ? new Date(props.account.balanceDate).toLocaleString()
          : 'Never!'}
      </span>
    </div>
  );
};

export default AccountItem;
