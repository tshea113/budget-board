import { type Budget } from '@/types/budget';
import { transactionCategories, type Transaction } from '@/types/transaction';
import { Skeleton } from '@/components/ui/skeleton';
import BudgetCard from './budget-card';
import { sumTransactionAmountsByCategory } from '@/lib/transactions';
import { getParentCategory } from '@/lib/category';
import { areStringsEqual } from '@/lib/utils';
import React from 'react';
import { groupBudgetsByCategory } from '@/lib/budgets';

interface BudgetCardsProps {
  budgetData: Budget[];
  transactionsData: Transaction[];
  isPending: boolean;
}

const BudgetCards = (props: BudgetCardsProps): JSX.Element => {
  const categoryToBudgetsMap = React.useMemo(
    () => groupBudgetsByCategory(props.budgetData),
    [props.budgetData]
  );

  const getCardsForMap = (map: Map<string, Budget[]>): JSX.Element[] => {
    const comps: JSX.Element[] = [];
    map.forEach((value, key) =>
      comps.push(
        <BudgetCard
          key={key}
          budgets={value}
          amount={sumTransactionAmountsByCategory(props.transactionsData ?? [], key)}
          isIncome={areStringsEqual(
            getParentCategory(key, transactionCategories),
            'income'
          )}
        />
      )
    );
    return comps;
  };

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
        {getCardsForMap(categoryToBudgetsMap)}
      </div>
    );
  }
};

export default BudgetCards;
