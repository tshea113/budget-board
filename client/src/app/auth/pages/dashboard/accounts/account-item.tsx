import { cn, convertNumberToCurrency } from '@/lib/utils';
import { type IAccount } from '@/types/account';

import type { JSX } from "react";

interface AccountItemProps {
  account: IAccount;
}

const AccountItem = (props: AccountItemProps): JSX.Element => {
  return (
    <div className="flex flex-col px-1">
      <div className="flex flex-row justify-between">
        <span className="text-base font-medium tracking-tight">{props.account.name}</span>
        <span
          className={cn(
            'font-semibold',
            props.account.currentBalance < 0 ? 'text-destructive' : 'text-success'
          )}
        >
          {convertNumberToCurrency(props.account.currentBalance, true)}
        </span>
      </div>
      <span className="text-sm tracking-tight text-muted-foreground">
        {'Last updated: '}
        {props.account.balanceDate
          ? new Date(props.account.balanceDate).toLocaleString()
          : 'Never!'}
      </span>
    </div>
  );
};

export default AccountItem;
