import React from 'react';
import { BudgetGroup, getBudgetsForGroup } from '@/lib/budgets';
import { type Budget } from '@/types/budget';
import BudgetTotalCard from './budget-total-card';
import { initCurrentMonth } from '@/lib/utils';
import { type Transaction } from '@/types/transaction';
import Unbudgets from './unbudgets';
import { AuthContext } from '@/components/auth-provider';
import { useQueries } from '@tanstack/react-query';
import BudgetCardsGroup from './budget-cards-group/budget-cards-group';
import { AxiosResponse } from 'axios';
import {
  filterHiddenTransactions,
  getTransactionsForMonth,
  sumTransactionAmounts,
} from '@/lib/transactions';
import BudgetsToolbar from './budgets-toolbar/budgets-toolbar';

const Budgets = (): JSX.Element => {
  const [selectedDates, setSelectedDates] = React.useState<Date[]>([initCurrentMonth()]);

  const { request } = React.useContext<any>(AuthContext);

  const budgetsQuery = useQueries({
    queries: selectedDates.map((date: Date) => ({
      queryKey: ['budgets', date],
      queryFn: async (): Promise<Budget[]> => {
        const res: AxiosResponse = await request({
          url: '/api/budget',
          method: 'GET',
          params: { date },
        });

        if (res.status == 200) {
          return res.data;
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

  const transactionsForMonthsQuery = useQueries({
    queries: selectedDates.map((date: Date) => ({
      queryKey: ['transactions', { month: date.getMonth(), year: date.getUTCFullYear() }],
      queryFn: async (): Promise<Transaction[]> => {
        const res: AxiosResponse = await request({
          url: '/api/transaction',
          method: 'GET',
          params: { date: date },
        });

        if (res.status == 200) {
          return res.data;
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
  const transactionsWithoutHidden = React.useMemo(
    () => filterHiddenTransactions(transactionsForMonthsQuery.data ?? []),
    [transactionsForMonthsQuery]
  );

  const timeToMonthlyTotalsMap: Map<number, number> = React.useMemo(() => {
    const map = new Map();
    selectedDates.forEach((selectedDate: Date) => {
      map.set(
        selectedDate.getTime(),
        sumTransactionAmounts(
          getTransactionsForMonth(transactionsForMonthsQuery.data, selectedDate)
        )
      );
    });
    return map;
  }, [transactionsWithoutHidden, transactionsForMonthsQuery]);

  return (
    <div className="flex w-full flex-col justify-center gap-2 lg:flex-row">
      <div className="flex w-full flex-col gap-2">
        <BudgetsToolbar
          selectedDates={selectedDates}
          setSelectedDates={setSelectedDates}
          timeToMonthlyTotalsMap={timeToMonthlyTotalsMap}
          showCopy={budgetsQuery.data.length === 0}
          isPending={budgetsQuery.isPending || transactionsForMonthsQuery.isPending}
        />
        <div className="space-y-10">
          <BudgetCardsGroup
            header={'Income'}
            budgetData={getBudgetsForGroup(budgetsQuery.data, BudgetGroup.Income)}
            transactionsData={transactionsWithoutHidden}
            isPending={budgetsQuery.isPending || transactionsForMonthsQuery.isPending}
          />
          <BudgetCardsGroup
            header={'Spending'}
            budgetData={getBudgetsForGroup(budgetsQuery.data, BudgetGroup.Spending)}
            transactionsData={transactionsWithoutHidden}
            isPending={budgetsQuery.isPending || transactionsForMonthsQuery.isPending}
          />
        </div>
        <Unbudgets
          transactions={transactionsWithoutHidden}
          budgets={budgetsQuery.data ?? []}
          isPending={budgetsQuery.isPending || transactionsForMonthsQuery.isPending}
        />
      </div>
      <div className="w-full lg:w-2/5 lg:max-w-[325px]">
        <BudgetTotalCard
          budgetData={budgetsQuery.data ?? []}
          transactionData={transactionsWithoutHidden}
          isPending={budgetsQuery.isPending || transactionsForMonthsQuery.isPending}
        />
      </div>
    </div>
  );
};

export default Budgets;
