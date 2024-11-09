import { type Budget } from '@/types/budget';
import { transactionCategories, type Transaction } from '@/types/transaction';
import { Skeleton } from '@/components/ui/skeleton';
import BudgetCard from './budget-card';
import { sumTransactionAmountsByCategory } from '@/lib/transactions';
import { getParentCategory } from '@/lib/category';
import { areStringsEqual } from '@/lib/utils';
import React from 'react';
import { Dictionary } from '@/types/misc';

interface BudgetCardsProps {
  budgetData: Budget[];
  transactionsData: Transaction[];
  isPending: boolean;
}

const aggregateBudgets = (budgets: Budget[]): Dictionary<Budget[]> => {
  if (budgets.length === 0) return {};

  const sortedBudgets = budgets.sort((a: Budget, b: Budget) =>
    a.category.toLowerCase().localeCompare(b.category.toLowerCase())
  );
  const groupedBudgets = sortedBudgets.reduce(
    (result: Dictionary<Budget[]>, budget: Budget) => {
      result[budget.category] = result[budget.category] || [];
      result[budget.category].push(budget);
      return result;
    },
    {}
  );

  return groupedBudgets;
};

const BudgetCards = (props: BudgetCardsProps): JSX.Element => {
  const sortedGroupedBudgetData = React.useMemo(
    () => aggregateBudgets(props.budgetData),
    [props.budgetData]
  );
  if (props.isPending) {
    return (
      <div className="flex items-center justify-center">
        <Skeleton className="h-[62px] w-full rounded-xl" />
      </div>
    );
  }
  if (props.budgetData == null || props.budgetData.length === 0) {
    return (
      <div className="flex flex-col justify-center space-y-2">
        <div className="flex items-center justify-center">No budgets</div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col space-y-1">
        {Object.entries(sortedGroupedBudgetData).map(([key, value]) => (
          <BudgetCard
            key={value[0].id}
            budgets={value}
            amount={sumTransactionAmountsByCategory(
              props.transactionsData ?? [],
              value[0].category
            )}
            isIncome={areStringsEqual(
              getParentCategory(key, transactionCategories),
              'income'
            )}
          />
        ))}
      </div>
    );
  }
};

export default BudgetCards;
