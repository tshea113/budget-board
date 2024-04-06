import MonthIterator from './month-iterator';
import React from 'react';
import AddButton from '@/components/add-button';
import { useQuery } from '@tanstack/react-query';
import { getBudgets } from '@/lib/budgets';
import BudgetCards from './budget-cards';
import AddBudget from './add-budget';
import { getTransactions } from '@/lib/transactions';
import BudgetHeader from './budget-header';
import { type Budget } from '@/types/budget';
import { Button } from '@/components/ui/button';

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

  enum BudgetGroup {
    Income,
    Spending,
  }

  const parseBudgetGroups = (
    budgetData: Budget[] | undefined,
    budgetGroup: BudgetGroup
  ): Budget[] => {
    if (budgetData == null) return [];

    if (budgetGroup === BudgetGroup.Income) {
      return budgetData.filter((b) => b.category === 'income') ?? [];
    } else if (budgetGroup === BudgetGroup.Spending) {
      return budgetData.filter((b) => b.category !== 'income') ?? [];
    } else {
      return budgetData;
    }
  };

  return (
    <div className="flex w-screen flex-col items-center">
      <div className="w-full space-y-2 2xl:max-w-screen-2xl">
        <div className="grid grid-cols-3">
          <div />
          <div className="justify-self-center">
            <MonthIterator date={date} setDate={setDate} />
          </div>
          <div className="flex flex-row space-x-2 justify-self-end">
            {(((budgetsQuery.data?.data as Budget[]) ?? null)?.length === 0 ?? false) && (
              <Button variant="default">Carry over from last month</Button>
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
    </div>
  );
};

export default Budgets;
