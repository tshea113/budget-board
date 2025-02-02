import { useQueries } from '@tanstack/react-query';
import SpendingGraph from './spending-graph';
import { ITransaction } from '@/types/transaction';
import { AxiosResponse } from 'axios';
import { AuthContext } from '@/components/auth-provider';
import React from 'react';
import { getDateFromMonthsAgo, getUniqueYears, initCurrentMonth } from '@/lib/utils';
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

  // Querying by year is the best balance of covering probable dates a user will select,
  // while also not potentially querying for a large amount of data.
  const { request } = React.useContext<any>(AuthContext);
  const transactionsQuery = useQueries({
    queries: getUniqueYears(selectedMonths).map((year: number) => ({
      queryKey: ['transactions', { year }],
      queryFn: async (): Promise<ITransaction[]> => {
        const res: AxiosResponse = await request({
          url: '/api/transaction',
          method: 'GET',
          params: { year },
        });

        if (res.status === 200) {
          return res.data as ITransaction[];
        }

        return [];
      },
    })),
    combine: (results) => {
      return {
        data: results.map((result) => result.data ?? []).flat(1),
        isPending: results.some((result) => result.isPending),
      };
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
      <div className="flex w-full flex-row justify-end">
        <Button size="sm" onClick={() => setSelectedMonths([])}>
          Clear
        </Button>
      </div>
      {selectedMonths.length === 0 ? (
        <div className="flex aspect-video max-h-[400px] w-full items-center justify-center">
          <span className="text-center">Select a month to display the chart.</span>
        </div>
      ) : transactionsQuery.isPending ? (
        <Skeleton className="aspect-video max-h-[400px] w-full" />
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
