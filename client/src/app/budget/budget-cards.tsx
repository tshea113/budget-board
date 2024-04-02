import { type Budget } from '@/types/budget';
import BudgetCard from './budget-card';
import { TailSpin } from 'react-loader-spinner';
import { Button } from '@/components/ui/button';

interface BudgetCardsProps {
  budgetData: Budget[] | null;
  isPending: boolean;
}

const BudgetCards = ({ budgetData, isPending }: BudgetCardsProps): JSX.Element => {
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
      <div>
        {budgetData.map((budget: Budget) => (
          <BudgetCard key={budget.id} category={budget.category} amount={32} total={budget.limit} />
        ))}
      </div>
    );
  }
};

export default BudgetCards;
