import { useQuery } from '@tanstack/react-query';
import SpendingGraph from './spending-graph';
import { Transaction } from '@/types/transaction';
import { AxiosResponse } from 'axios';
import { AuthContext } from '@/components/auth-provider';
import React from 'react';
import { getDateFromMonthsAgo } from '@/lib/utils';
import { filterHiddenTransactions } from '@/lib/transactions';
import MonthToolCards from '@/components/month-toolcards';
import { buildTimeToMonthlyTotalsMap } from '@/lib/budgets';

const SpendingCardContent = (): JSX.Element => {
  const [selectedMonths, setSelectedMonths] = React.useState<Date[]>([
    new Date(),
    getDateFromMonthsAgo(1),
  ]);

  // TODO: Query only selected dates transactions
  const { request } = React.useContext<any>(AuthContext);
  const transactionsQuery = useQuery({
    queryKey: ['transactions'],
    queryFn: async (): Promise<Transaction[]> => {
      const res: AxiosResponse = await request({
        url: '/api/transaction',
        method: 'GET',
      });

      if (res.status == 200) {
        return res.data;
      }

      return [];
    },
  });

  // We need to filter out the transactions labelled with 'Hide From Budgets'
  const transactionsWithoutHidden = filterHiddenTransactions(
    transactionsQuery.data ?? []
  );

  return (
    <div className="flex flex-col gap-4">
      <MonthToolCards
        selectedDates={selectedMonths}
        setSelectedDates={setSelectedMonths}
        timeToMonthlyTotalsMap={buildTimeToMonthlyTotalsMap(
          selectedMonths,
          transactionsWithoutHidden
        )}
        showCopy={false}
        isPending={false}
        allowSelectMultiple={true}
      />
      <SpendingGraph
        transactions={transactionsWithoutHidden}
        months={selectedMonths}
        includeGrid={true}
        includeYAxis={true}
      />
    </div>
  );
};

export default SpendingCardContent;
