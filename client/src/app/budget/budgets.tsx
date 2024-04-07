import MonthIterator from './month-iterator';
import React from 'react';
import AddButton from '@/components/add-button';
import { useQuery } from '@tanstack/react-query';
import { BudgetGroup, getBudgets, parseBudgetGroups } from '@/lib/budgets';
import BudgetCards from './budget-cards';
import AddBudget from './add-budget';
import { getTransactions } from '@/lib/transactions';
import BudgetHeader from './budget-header';
import { type Budget } from '@/types/budget';
import { Button } from '@/components/ui/button';
import BudgetTotalCard from './budget-total-card';
import { initMonth } from '@/lib/utils';

const Budgets = (): JSX.Element => {
  const [date, setDate] = React.useState<Date>(initMonth());

  const budgetsQuery = useQuery({
    queryKey: ['budgets', { date }],
    queryFn: async () => {
      const response = await getBudgets(date);
      return response;
    },
  });

  const transactionsQuery = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await getTransactions();
      return response;
    },
  });

  return (
    <div className="flex w-screen max-w-screen-2xl flex-row justify-center space-x-2">
      <div className="w-3/4 flex-grow">
        <div className="grid w-full grid-cols-3">
          <div />
          <div className="justify-self-center">
            <MonthIterator date={date} setDate={setDate} />
          </div>
          <div className="flex flex-row space-x-2 justify-self-end">
            {((budgetsQuery.data?.data as Budget[]) ?? null)?.length === 0 && (
              <Button variant="default">Copy last month</Button>
            )}
            <AddButton>
              <AddBudget date={date} />
            </AddButton>
          </div>
        </div>
        <div className="space-y-10">
          <div className="items-center align-middle">
            <BudgetHeader>Income</BudgetHeader>
            <BudgetCards
              budgetData={parseBudgetGroups(
                budgetsQuery.data?.data as Budget[],
                BudgetGroup.Income
              )}
              transactionsData={transactionsQuery.data?.data}
              isPending={budgetsQuery.isPending || transactionsQuery.isPending}
            />
          </div>
          <div className="items-center align-middle">
            <BudgetHeader>Spending</BudgetHeader>
            <BudgetCards
              budgetData={parseBudgetGroups(
                budgetsQuery.data?.data as Budget[],
                BudgetGroup.Spending
              )}
              transactionsData={transactionsQuery.data?.data}
              isPending={budgetsQuery.isPending || transactionsQuery.isPending}
            />
          </div>
        </div>
      </div>
      <div className="flex h-96 w-1/4 flex-col justify-center">
        {/* TODO: Figure out a better way to horizontally position this */}
        <div />
        <BudgetTotalCard
          budgetData={budgetsQuery.data?.data ?? []}
          transactionData={transactionsQuery.data?.data ?? []}
        />
      </div>
    </div>
  );
};

export default Budgets;
