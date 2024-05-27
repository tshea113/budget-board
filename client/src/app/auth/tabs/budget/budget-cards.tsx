import { type Budget } from '@/types/budget';
import BudgetCard from './budget-card';
import { type Transaction } from '@/types/transaction';
import { getIsCategory } from '@/lib/transactions';
import { Skeleton } from '@/components/ui/skeleton';

interface BudgetCardsProps {
  budgetData: Budget[] | null;
  transactionsData: Transaction[] | null;
  isPending: boolean;
}

const BudgetCards = (props: BudgetCardsProps): JSX.Element => {
  const sumTransactionAmountsByCategory = (
    transactionData: Transaction[],
    category: string
  ): number => {
    const data = transactionData.filter((t: Transaction) => {
      return (getIsCategory(category) ? t.category : t.subcategory) === category;
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
