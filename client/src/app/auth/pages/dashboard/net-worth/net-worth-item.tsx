import { getAccountsOfTypes, sumAccountsTotalBalance } from '@/lib/accounts';
import { cn, convertNumberToCurrency } from '@/lib/utils';
import { IAccount } from '@/types/account';

import type { JSX } from "react";

interface NetWorthItemProps {
  accounts: IAccount[];
  types?: string[];
  title: string;
}

const NetWorthItem = (props: NetWorthItemProps): JSX.Element => {
  const summedAccountsTotalBalance = sumAccountsTotalBalance(
    props.types ? getAccountsOfTypes(props.accounts, props.types) : props.accounts
  );

  return (
    <div className="flex flex-row">
      <span className="text-left text-base font-medium tracking-tight">
        {props.title}
      </span>
      <span className="grow" />
      <span
        className={cn(
          'text-right font-semibold',
          summedAccountsTotalBalance < 0 ? 'text-destructive' : 'text-success'
        )}
      >
        {convertNumberToCurrency(summedAccountsTotalBalance, true)}
      </span>
    </div>
  );
};

export default NetWorthItem;
