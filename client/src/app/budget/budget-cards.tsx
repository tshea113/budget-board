import { type Budget } from '@/types/budget';
import BudgetCard from './budget-card';
import { TailSpin } from 'react-loader-spinner';
import { Button } from '@/components/ui/button';
import { type Transaction } from '@/types/transaction';
import { getIsCategory } from '@/lib/transactions';
import request from '@/lib/request';
import { useQueryClient } from '@tanstack/react-query';

interface BudgetCardsProps {
  budgetData: Budget[] | null;
  transactionsData: Transaction[] | null;
  isPending: boolean;
}

const BudgetCards = ({
  budgetData,
  transactionsData,
  isPending,
}: BudgetCardsProps): JSX.Element => {
  const queryClient = useQueryClient();

  const getTransactionAmountForBudget = (budget: Budget): number => {
    let data: Transaction[] =
      transactionsData?.filter(
        (t: Transaction) =>
          new Date(t.date).getMonth() === new Date(budget.date).getMonth() &&
          new Date(t.date).getUTCFullYear() === new Date(budget.date).getUTCFullYear()
      ) ?? [];

    data = data.filter((t: Transaction) => {
      return (getIsCategory(budget.category) ? t.category : t.subcategory) === budget.category;
    });

    return data.reduce((n, { amount }) => n + amount, 0) * -1;
  };

  const deleteBudget = (id: string): void => {
    request({
      url: '/api/budget',
      method: 'DELETE',
      params: { id },
    })
      .then(async () => {
        await queryClient.invalidateQueries({ queryKey: ['budgets'] });
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center">
        <TailSpin height="100" width="100" color="gray" />
      </div>
    );
  }
  if (budgetData == null || budgetData.length === 0) {
    return (
      <div className="flex flex-col justify-center space-y-2">
        <div className="flex items-center justify-center">No data</div>
        <Button variant="outline">Carry over from last month</Button>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col space-y-1">
        {budgetData
          .sort(function (a, b) {
            return a.category.toLowerCase().localeCompare(b.category.toLowerCase());
          })
          .map((budget: Budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              amount={getTransactionAmountForBudget(budget)}
              deleteBudget={deleteBudget}
            />
          ))}
      </div>
    );
  }
};

export default BudgetCards;
