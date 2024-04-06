import { type Budget } from '@/types/budget';
import BudgetCard from './budget-card';
import { TailSpin } from 'react-loader-spinner';
import { type Transaction } from '@/types/transaction';
import { getIsCategory } from '@/lib/transactions';

interface BudgetCardsProps {
  budgetData: Budget[] | null;
  transactionsData: Transaction[] | null;
  isPending: boolean;
}

const BudgetCards = (props: BudgetCardsProps): JSX.Element => {
  const getTransactionAmountForBudget = (budget: Budget): number => {
    let data: Transaction[] =
      props.transactionsData?.filter(
        (t: Transaction) =>
          new Date(t.date).getMonth() === new Date(budget.date).getMonth() &&
          new Date(t.date).getUTCFullYear() === new Date(budget.date).getUTCFullYear()
      ) ?? [];

    data = data.filter((t: Transaction) => {
      return (getIsCategory(budget.category) ? t.category : t.subcategory) === budget.category;
    });

    return data.reduce((n, { amount }) => n + amount, 0);
  };

  if (props.isPending) {
    return (
      <div className="flex items-center justify-center">
        <TailSpin height="100" width="100" color="gray" />
      </div>
    );
  }
  if (props.budgetData == null || props.budgetData.length === 0) {
    return (
      <div className="flex flex-col justify-center space-y-2">
        <div className="flex items-center justify-center">No data</div>
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
              amount={getTransactionAmountForBudget(budget)}
            />
          ))}
      </div>
    );
  }
};

export default BudgetCards;
