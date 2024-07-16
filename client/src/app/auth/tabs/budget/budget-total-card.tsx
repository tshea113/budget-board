import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import BudgetTotal from './budget-total';
import { type Budget } from '@/types/budget';
import { BudgetGroup, getBudgetsForGroup } from '@/lib/budgets';
import { type Transaction } from '@/types/transaction';
import React from 'react';
import { AuthContext } from '@/components/auth-provider';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/lib/category';

interface BudgetTotalCardProps {
  budgetData: Budget[];
  transactionData: Transaction[];
}

const BudgetTotalCard = (props: BudgetTotalCardProps): JSX.Element => {
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

  const getBudgetTotal = (budgetData: Budget[]): number => {
    return budgetData.reduce((n, { limit }) => n + limit, 0);
  };

  const getTransactionTotal = (transactionData: Transaction[]): number => {
    return transactionData.reduce((n, { amount }) => n + amount, 0);
  };

  return (
    <Card className="space-y-2 p-2">
      <div className="text-xl font-semibold tracking-tight">Your Budget</div>
      <Separator className="my-2" />
      <BudgetTotal
        label={'Income'}
        amount={Math.abs(
          getTransactionTotal(
            props.transactionData.filter((t) => t.category === 'income')
          )
        )}
        total={getBudgetTotal(
          getBudgetsForGroup(allCategories, props.budgetData, BudgetGroup.Income)
        )}
      />
      <BudgetTotal
        label={'Spending'}
        amount={Math.abs(
          getTransactionTotal(
            props.transactionData.filter((t) => t.category !== 'income')
          )
        )}
        total={getBudgetTotal(
          getBudgetsForGroup(allCategories, props.budgetData, BudgetGroup.Spending)
        )}
      />
      <Separator className="my-2" />
      <BudgetTotal
        label={'Remaining'}
        amount={getTransactionTotal(props.transactionData)}
      />
    </Card>
  );
};

export default BudgetTotalCard;
