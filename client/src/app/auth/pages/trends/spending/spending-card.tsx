import { useQuery } from '@tanstack/react-query';
import SpendingGraph from './spending-graph';
import { Transaction } from '@/types/transaction';
import { AxiosResponse } from 'axios';
import { AuthContext } from '@/components/auth-provider';
import React from 'react';
import { getDateFromMonthsAgo, initCurrentMonth } from '@/lib/utils';
import { filterHiddenTransactions } from '@/lib/transactions';
import MonthToolCards from '@/components/month-toolcards';
import { buildTimeToMonthlyTotalsMap } from '@/lib/budgets';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

const SpendingCardContent = (): JSX.Element => {
  const [selectedMonths, setSelectedMonths] = React.useState<Date[]>([
    getDateFromMonthsAgo(1),
    initCurrentMonth(),
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

  if (transactionsQuery.isPending) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-[62px] w-full" />
        <Skeleton className="aspect-video max-h-[400px] w-full" />
      </div>
    );
  }

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
      <div className="flex w-full flex-row justify-end">
        <Button size="sm" onClick={() => setSelectedMonths([])}>
          Clear
        </Button>
      </div>
      {selectedMonths.length === 0 ? (
        <div className="flex aspect-video max-h-[400px] w-full items-center justify-center">
          <span className="text-center">Select a month to display the chart.</span>
        </div>
      ) : (
        <SpendingGraph
          transactions={transactionsWithoutHidden}
          months={selectedMonths}
          includeGrid={true}
          includeYAxis={true}
        />
      )}
    </div>
  );
};

export default SpendingCardContent;
