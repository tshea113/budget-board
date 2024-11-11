import { sumAccountsTotalBalance } from '@/lib/accounts';
import { cn, convertNumberToCurrency } from '@/lib/utils';
import { Account } from '@/types/account';
import React from 'react';

interface NetWorthItemProps {
  accounts: Account[];
  types?: string[];
  title: string;
}

const NetWorthItem = (props: NetWorthItemProps): JSX.Element => {
  const filteredAccounts = React.useMemo(() => {
    if (props.types != null) {
      return props.accounts.filter(
        (a) => props.types?.includes(a.type) || props.types?.includes(a.subtype)
      );
    } else {
      return props.accounts;
    }
  }, [props.accounts, props.types]);

  const summedAccountsTotalBalance = React.useMemo(
    () => sumAccountsTotalBalance(filteredAccounts),
    [filteredAccounts]
  );

  return (
    <div className="grid grid-cols-10 px-1">
      <div className="col-span-6 text-left">
        <span className="text-base tracking-tight">{props.title}</span>
      </div>
      <div className="col-span-4 text-right">
        <span
          className={cn(
            'font-semibold',
            summedAccountsTotalBalance < 0 ? 'text-destructive' : 'text-success'
          )}
        >
          {convertNumberToCurrency(summedAccountsTotalBalance, true)}
        </span>
      </div>
    </div>
  );
};

export default NetWorthItem;
