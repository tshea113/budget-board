import { type Budget } from '@/types/budget';
import { transactionCategories, type Transaction } from '@/types/transaction';
import { Skeleton } from '@/components/ui/skeleton';
import BudgetCard from './budget-card';
import { sumTransactionAmountsByCategory } from '@/lib/transactions';
import { getParentCategory } from '@/lib/category';
import { areStringsEqual } from '@/lib/utils';
import React from 'react';

interface BudgetCardsProps {
  budgetData: Budget[] | null;
  transactionsData: Transaction[] | null;
  isPending: boolean;
}

const BudgetCards = (props: BudgetCardsProps): JSX.Element => {
  const sortedBudgetData = React.useMemo(
    () =>
      (props.budgetData ?? []).sort((a: Budget, b: Budget) =>
        a.category.toLowerCase().localeCompare(b.category.toLowerCase())
      ),
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
        {sortedBudgetData.map((budget: Budget) => (
          <BudgetCard
            key={budget.id}
            budget={budget}
            amount={sumTransactionAmountsByCategory(
              props.transactionsData ?? [],
              budget.category
            )}
            isIncome={areStringsEqual(
              getParentCategory(budget.category, transactionCategories),
              'income'
            )}
          />
        ))}
      </div>
    );
  }
};

export default BudgetCards;
