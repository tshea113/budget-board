import React from 'react';
import {
  BudgetGroup,
  buildTimeToMonthlyTotalsMap,
  getBudgetsForGroup,
} from '@/lib/budgets';
import { IBudget } from '@/types/budget';
import BudgetTotalCard from './budget-total-card';
import { initCurrentMonth } from '@/lib/utils';
import { defaultTransactionCategories, type Transaction } from '@/types/transaction';
import Unbudgets from './unbudgets';
import { AuthContext } from '@/components/auth-provider';
import { useQueries, useQuery } from '@tanstack/react-query';
import BudgetCardsGroup from './budget-cards-group/budget-cards-group';
import { AxiosResponse } from 'axios';
import { filterHiddenTransactions } from '@/lib/transactions';
import BudgetsToolbar from './budgets-toolbar/budgets-toolbar';
import { ICategoryResponse } from '@/types/category';

const Budgets = (): JSX.Element => {
  const [selectedDates, setSelectedDates] = React.useState<Date[]>([initCurrentMonth()]);

  const { request } = React.useContext<any>(AuthContext);

  const budgetsQuery = useQueries({
    queries: selectedDates.map((date: Date) => ({
      queryKey: ['budgets', date],
      queryFn: async (): Promise<IBudget[]> => {
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
          params: { month: date.getMonth() + 1, year: date.getFullYear() },
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

  const transactionCategoriesQuery = useQuery({
    queryKey: ['transactionCategories'],
    queryFn: async () => {
      const res = await request({
        url: '/api/transactionCategory',
        method: 'GET',
      });

      if (res.status === 200) {
        return res.data as ICategoryResponse[];
      }

      return undefined;
    },
  });

  const transactionCategoriesWithCustom = defaultTransactionCategories.concat(
    transactionCategoriesQuery.data ?? []
  );

  // We need to filter out the transactions labelled with 'Hide From Budgets'
  const transactionsWithoutHidden = filterHiddenTransactions(
    transactionsForMonthsQuery.data ?? []
  );

  const timeToMonthlyTotalsMap: Map<number, number> = buildTimeToMonthlyTotalsMap(
    selectedDates,
    transactionsWithoutHidden
  );

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
            budgetData={getBudgetsForGroup(
              budgetsQuery.data,
              BudgetGroup.Income,
              transactionCategoriesWithCustom
            )}
            transactionsData={transactionsWithoutHidden}
            isPending={
              budgetsQuery.isPending ||
              transactionsForMonthsQuery.isPending ||
              transactionCategoriesQuery.isPending
            }
          />
          <BudgetCardsGroup
            header={'Spending'}
            budgetData={getBudgetsForGroup(
              budgetsQuery.data,
              BudgetGroup.Spending,
              transactionCategoriesWithCustom
            )}
            transactionsData={transactionsWithoutHidden}
            isPending={
              budgetsQuery.isPending ||
              transactionsForMonthsQuery.isPending ||
              transactionCategoriesQuery.isPending
            }
          />
        </div>
        <Unbudgets
          transactions={transactionsWithoutHidden}
          budgets={budgetsQuery.data ?? []}
          selectedDates={selectedDates}
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
