import { type Budget } from '@/types/budget';
import { type Transaction } from '@/types/transaction';
import { getCategories, getIsCategory } from '@/lib/category';
import { Skeleton } from '@/components/ui/skeleton';
import BudgetCard from './budget-card';
import React from 'react';
import { AuthContext } from '@/components/auth-provider';
import { useQuery } from '@tanstack/react-query';

interface BudgetCardsProps {
  budgetData: Budget[] | null;
  transactionsData: Transaction[] | null;
  isPending: boolean;
}

const BudgetCards = (props: BudgetCardsProps): JSX.Element => {
  const { request } = React.useContext<any>(AuthContext);
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () =>
      await request({
        url: '/api/category',
        method: 'GET',
      }),
  });

  const allCategories = getCategories(categoriesQuery.data?.data ?? []);

  const sumTransactionAmountsByCategory = (
    transactionData: Transaction[],
    category: string
  ): number => {
    const data = transactionData.filter((t: Transaction) => {
      return (
        (getIsCategory(allCategories, category) ? t.category : t.subcategory) === category
      );
    });

    return data.reduce((n, { amount }) => n + amount, 0);
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
        {props.budgetData
          .sort(function (a, b) {
            return a.category.toLowerCase().localeCompare(b.category.toLowerCase());
          })
          .map((budget: Budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              amount={sumTransactionAmountsByCategory(
                props.transactionsData ?? [],
                budget.category
              )}
            />
          ))}
      </div>
    );
  }
};

export default BudgetCards;
