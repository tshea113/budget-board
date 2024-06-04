import React from 'react';
import { BudgetGroup, getBudgetsForMonth, getBudgetsForGroup } from '@/lib/budgets';
import BudgetCards from './budget-cards';
import { getTransactionsForMonth } from '@/lib/transactions';
import BudgetHeader from './budget-header';
import { type Budget } from '@/types/budget';
import BudgetTotalCard from './budget-total-card';
import { initMonth } from '@/lib/utils';
import { type Transaction } from '@/types/transaction';
import Unbudgets from './unbudgets';
import { useBudgetsQuery, useTransactionsQuery } from '@/lib/query';
import BudgetsToolbar from './budgets-toolbar';
import { AuthContext } from '@/components/auth-provider';

const Budgets = (): JSX.Element => {
  const [date, setDate] = React.useState<Date>(initMonth());

  const { accessToken } = React.useContext<any>(AuthContext);

  const budgetsQuery = useBudgetsQuery(accessToken, date);
  const transactionsQuery = useTransactionsQuery(accessToken);

  return (
    <div className="flex w-full max-w-screen-2xl flex-row justify-center space-x-2">
      <div className="w-3/4 flex-grow space-y-2">
        <BudgetsToolbar
          budgets={budgetsQuery.data?.data ?? []}
          date={date}
          isPending={budgetsQuery.isPending}
          setDate={setDate}
        />
        <div className="space-y-10">
          <div className="items-center align-middle">
            <BudgetHeader>Income</BudgetHeader>
            <BudgetCards
              budgetData={getBudgetsForGroup(
                budgetsQuery.data?.data as Budget[],
                BudgetGroup.Income
              )}
              transactionsData={getTransactionsForMonth(
                (transactionsQuery.data?.data as Transaction[]) ?? [],
                date
              )}
              isPending={budgetsQuery.isPending || transactionsQuery.isPending}
            />
          </div>
          <div className="items-center align-middle">
            <BudgetHeader>Spending</BudgetHeader>
            <BudgetCards
              budgetData={getBudgetsForGroup(
                budgetsQuery.data?.data as Budget[],
                BudgetGroup.Spending
              )}
              transactionsData={getTransactionsForMonth(
                (transactionsQuery.data?.data as Transaction[]) ?? [],
                date
              )}
              isPending={budgetsQuery.isPending || transactionsQuery.isPending}
            />
          </div>
        </div>
        <Unbudgets
          transactions={getTransactionsForMonth(
            (transactionsQuery.data?.data as Transaction[]) ?? [],
            date
          )}
          budgets={(budgetsQuery.data?.data as Budget[]) ?? []}
          isPending={budgetsQuery.isPending || transactionsQuery.isPending}
        />
      </div>
      <div className="flex h-96 w-1/4 flex-col justify-center">
        {/* TODO: Figure out a better way to horizontally position this */}
        <div />
        <BudgetTotalCard
          budgetData={getBudgetsForMonth(
            (budgetsQuery.data?.data as Budget[]) ?? [],
            date
          )}
          transactionData={getTransactionsForMonth(
            (transactionsQuery.data?.data as Transaction[]) ?? [],
            date
          )}
        />
      </div>
    </div>
  );
};

export default Budgets;
