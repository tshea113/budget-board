import AccountInput from '@/components/account-input';
import { AuthContext } from '@/components/auth-provider';
import DatePicker from '@/components/date-picker';
import { Button } from '@/components/ui/button';
import { getStandardDate } from '@/lib/utils';
import { Account } from '@/types/account';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import React from 'react';

interface AccountsGraphHeaderProps {
  selectedAccountIds: string[];
  setSelectedAccountIds: (accountIds: string[]) => void;
  startDate: Date;
  setStartDate: (date: Date) => void;
  endDate: Date;
  setEndDate: (date: Date) => void;
}

const AccountsGraphHeader = (props: AccountsGraphHeaderProps): JSX.Element => {
  const { request } = React.useContext<any>(AuthContext);
  const accountsQuery = useQuery({
    queryKey: ['accounts'],
    queryFn: async (): Promise<Account[]> => {
      const res: AxiosResponse = await request({
        url: '/api/account',
        method: 'GET',
      });

      if (res.status == 200) {
        return res.data;
      }

      return [];
    },
  });

  return (
    <div className="flex w-full flex-row flex-wrap items-end gap-6">
      <div className="flex grow flex-row flex-wrap gap-2">
        <span className="w-full max-w-[300px]">
          <AccountInput
            selectedAccountIds={props.selectedAccountIds}
            setSelectedAccountIds={props.setSelectedAccountIds}
            hideHidden={true}
            filterTypes={['Checking', 'Savings', 'Investment', 'Cash', 'Other']}
          />
        </span>
        <Button
          onClick={() => {
            console.log(
              accountsQuery.data
                ?.filter((account: Account) => !account.hideAccount)
                ?.map((account) => account) ?? []
            );
            props.setSelectedAccountIds(
              accountsQuery.data
                ?.filter((account: Account) => !account.hideAccount)
                ?.map((account) => account.id) ?? []
            );
          }}
        >
          Select All
        </Button>
        <Button onClick={() => props.setSelectedAccountIds([])}>Clear</Button>
      </div>
      <div className="flex grow flex-row flex-wrap gap-2">
        <div className="flex flex-col gap-1">
          <span>Start Date</span>
          <DatePicker
            value={props.startDate}
            onDayClick={(date: Date) => {
              props.setStartDate(getStandardDate(date));
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span>End Date</span>
          <DatePicker
            value={props.endDate}
            onDayClick={(date: Date) => {
              if (date.getTime() > props.startDate.getTime()) {
                props.setEndDate(getStandardDate(date));
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AccountsGraphHeader;
