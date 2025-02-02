import { IBudget } from '@/types/budget';
import { defaultTransactionCategories, ITransaction } from '@/types/transaction';
import { Skeleton } from '@/components/ui/skeleton';
import BudgetCard from './budget-card';
import { sumTransactionAmountsByCategory } from '@/lib/transactions';
import { getParentCategory } from '@/lib/category';
import { areStringsEqual } from '@/lib/utils';
import React from 'react';
import { groupBudgetsByCategory } from '@/lib/budgets';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '@/components/auth-provider';
import { ICategoryResponse } from '@/types/category';

interface BudgetCardsProps {
  budgetData: IBudget[];
  transactionsData: ITransaction[];
  isPending: boolean;
}

const BudgetCards = (props: BudgetCardsProps): JSX.Element => {
  const categoryToBudgetsMap = React.useMemo(
    () => groupBudgetsByCategory(props.budgetData),
    [props.budgetData]
  );

  const { request } = React.useContext<any>(AuthContext);
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

  const getCardsForMap = (
    categoryToBudgetsMap: Map<string, IBudget[]>
  ): JSX.Element[] => {
    const comps: JSX.Element[] = [];
    categoryToBudgetsMap.forEach((value, key) =>
      comps.push(
        <BudgetCard
          key={key}
          budgets={value}
          amount={sumTransactionAmountsByCategory(
            props.transactionsData ?? [],
            key,
            transactionCategoriesWithCustom
          )}
          isIncome={areStringsEqual(
            getParentCategory(key, transactionCategoriesWithCustom),
            'income'
          )}
        />
      )
    );
    return comps;
  };

  if (props.isPending || transactionCategoriesQuery.isPending) {
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
