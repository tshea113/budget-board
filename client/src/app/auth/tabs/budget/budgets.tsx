import React from 'react';
import { BudgetGroup, getBudgetsForMonth, getBudgetsForGroup } from '@/lib/budgets';
import { getTransactionsForMonth } from '@/lib/transactions';
import { type Budget } from '@/types/budget';
import BudgetTotalCard from './budget-total-card';
import { initCurrentMonth } from '@/lib/utils';
import { type Transaction } from '@/types/transaction';
import Unbudgets from './unbudgets';
import BudgetsToolbar from './budgets-toolbar';
import { AuthContext } from '@/components/auth-provider';
import { useQuery } from '@tanstack/react-query';
import BudgetCardsGroup from './budget-cards-group/budget-cards-group';
import { AxiosResponse } from 'axios';

const Budgets = (): JSX.Element => {
  const [date, setDate] = React.useState<Date>(initCurrentMonth());

  const { request } = React.useContext<any>(AuthContext);

  const budgetsQuery = useQuery({
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
  });

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

  return (
    <div className="flex w-full max-w-screen-2xl flex-col justify-center gap-2 lg:grid lg:grid-flow-col lg:grid-cols-12">
      <div className="space-y-2 lg:col-span-9">
        <BudgetsToolbar
          budgets={budgetsQuery.data ?? []}
          date={date}
          isPending={budgetsQuery.isPending}
          setDate={setDate}
        />
        <div className="space-y-10">
          <BudgetCardsGroup
            header={'Income'}
            budgetData={getBudgetsForGroup(budgetsQuery.data, BudgetGroup.Income)}
            transactionsData={getTransactionsForMonth(transactionsQuery.data ?? [], date)}
            isPending={budgetsQuery.isPending || transactionsQuery.isPending}
          />
          <BudgetCardsGroup
            header={'Spending'}
            budgetData={getBudgetsForGroup(budgetsQuery.data, BudgetGroup.Spending)}
            transactionsData={getTransactionsForMonth(
              (transactionsQuery.data as Transaction[]) ?? [],
              date
            )}
            isPending={budgetsQuery.isPending || transactionsQuery.isPending}
          />
        </div>
        <Unbudgets
          transactions={getTransactionsForMonth(
            (transactionsQuery.data as Transaction[]) ?? [],
            date
          )}
          budgets={budgetsQuery.data ?? []}
          isPending={budgetsQuery.isPending || transactionsQuery.isPending}
        />
      </div>
      <div className="h-96 lg:col-span-3">
        <BudgetTotalCard
          budgetData={getBudgetsForMonth(budgetsQuery.data ?? [], date)}
          transactionData={getTransactionsForMonth(
            (transactionsQuery.data as Transaction[]) ?? [],
            date
          )}
        />
      </div>
    </div>
  );
};

export default Budgets;
