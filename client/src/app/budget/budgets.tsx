import MonthIterator from './month-iterator';
import React from 'react';
import AddButton from '@/components/add-button';
import { useQuery } from '@tanstack/react-query';
import { getBudgets } from '@/lib/budgets';
import BudgetCards from './budget-cards';
import AddBudget from './add-budget';
import { getTransactions } from '@/lib/transactions';

const Budgets = (): JSX.Element => {
  const initDate = (): Date => {
    const date = new Date();
    date.setDate(1);
    return date;
  };

  const [date, setDate] = React.useState<Date>(initDate());

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
    <div className="flex w-screen flex-col items-center">
      <div className="w-full space-y-2 2xl:max-w-screen-2xl">
        <div className="grid grid-cols-3">
          <div />
          <div className="justify-self-center">
            <MonthIterator date={date} setDate={setDate} />
          </div>
          <div className="justify-self-end">
            <AddButton>
              <AddBudget date={date} />
            </AddButton>
          </div>
        </div>
        <div className="items-center align-middle">
          <BudgetCards
            budgetData={budgetsQuery.data?.data}
            transactionsData={transactionsQuery.data?.data}
            isPending={budgetsQuery.isPending || transactionsQuery.isPending}
          />
        </div>
      </div>
    </div>
  );
};

export default Budgets;
