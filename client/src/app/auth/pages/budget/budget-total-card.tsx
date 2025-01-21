import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import BudgetTotal from './budget-total';
import { type BudgetResponse } from '@/types/budget';
import { BudgetGroup, getBudgetsForGroup, sumBudgetAmounts } from '@/lib/budgets';
import { defaultTransactionCategories, type Transaction } from '@/types/transaction';
import { areStringsEqual } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { sumTransactionAmounts } from '@/lib/transactions';
import React from 'react';
import { AuthContext } from '@/components/auth-provider';
import { useQuery } from '@tanstack/react-query';
import { ICategoryResponse } from '@/types/category';

interface BudgetTotalCardProps {
  budgetData: BudgetResponse[];
  transactionData: Transaction[];
  isPending: boolean;
}

const BudgetTotalCard = (props: BudgetTotalCardProps): JSX.Element => {
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

  if (props.isPending || transactionCategoriesQuery.isPending) {
    return (
      <Card>
        <div className="m-3 flex flex-col space-y-3">
          <Skeleton className="h-10 max-w-[125px]" />
          <Skeleton className="h-[150px] rounded-xl" />
        </div>
      </Card>
    );
  }

  const incomeBudgetsTotal = sumBudgetAmounts(
    getBudgetsForGroup(
      props.budgetData,
      BudgetGroup.Income,
      transactionCategoriesWithCustom
    )
  );

  const spendingBudgetsTotal = sumBudgetAmounts(
    getBudgetsForGroup(
      props.budgetData,
      BudgetGroup.Spending,
      transactionCategoriesWithCustom
    )
  );

  return (
    <Card className="space-y-2 p-2">
      <div className="text-xl font-semibold tracking-tight">Your Budget</div>
      <Separator className="my-2" />
      <BudgetTotal
        label={'Income'}
        amount={sumTransactionAmounts(
          props.transactionData.filter((t) => areStringsEqual(t.category ?? '', 'Income'))
        )}
        total={incomeBudgetsTotal}
        isIncome={true}
      />
      <BudgetTotal
        label={'Spending'}
        amount={sumTransactionAmounts(
          props.transactionData.filter(
            (t) => !areStringsEqual(t.category ?? '', 'Income')
          )
        )}
        total={spendingBudgetsTotal}
        isIncome={false}
      />
      <Separator className="my-2" />
      <BudgetTotal
        label={'Remaining'}
        amount={sumTransactionAmounts(props.transactionData)}
        total={incomeBudgetsTotal - spendingBudgetsTotal}
        isIncome={true}
      />
    </Card>
  );
};

export default BudgetTotalCard;
