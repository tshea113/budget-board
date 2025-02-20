import AccountInput from '@/components/account-input';
import { AuthContext } from '@/components/auth-provider';
import { DateRange } from 'react-day-picker';
import DatePickerWithRange from '@/components/date-range-picker';
import { Button } from '@/components/ui/button';
import { IAccount } from '@/types/account';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import React, { type JSX } from 'react';

interface AccountsGraphHeaderProps {
  selectedAccountIds: string[];
  setSelectedAccountIds: (accountIds: string[]) => void;
  dateRange: DateRange;
  setDateRange: (dateRange: DateRange) => void;
  filters?: string[];
}

const AccountsGraphHeader = (props: AccountsGraphHeaderProps): JSX.Element => {
  const { request } = React.useContext<any>(AuthContext);
  const accountsQuery = useQuery({
    queryKey: ['accounts'],
    queryFn: async (): Promise<IAccount[]> => {
      const res: AxiosResponse = await request({
        url: '/api/account',
        method: 'GET',
      });

      if (res.status === 200) {
        return res.data as IAccount[];
      }

      return [];
    },
  });

  return (
    <div className="flex w-full flex-row flex-wrap items-center gap-2">
      <DatePickerWithRange value={props.dateRange} onSelect={props.setDateRange} />
      <span className="w-full max-w-[300px]">
        <AccountInput
          selectedAccountIds={props.selectedAccountIds}
          setSelectedAccountIds={props.setSelectedAccountIds}
          hideHidden={true}
          filterTypes={props.filters}
        />
      </span>
      <Button
        size="sm"
        onClick={() => {
          props.setSelectedAccountIds(
            accountsQuery.data
              ?.filter(
                (account: IAccount) =>
                  !account.hideAccount &&
                  (props.filters ? props.filters?.includes(account.type) : true)
              )
              ?.map((account) => account.id) ?? []
          );
        }}
      >
        Select All
      </Button>
      <Button size="sm" onClick={() => props.setSelectedAccountIds([])}>
        Clear
      </Button>
    </div>
  );
};

export default AccountsGraphHeader;
