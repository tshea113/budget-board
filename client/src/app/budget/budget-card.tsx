import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getCategoryLabel } from '@/lib/transactions';

interface BudgetCardProps {
  category: string;
  amount: number;
  total: number;
}

const BudgetCard = ({ category, amount, total }: BudgetCardProps): JSX.Element => {
  const getProgress = (): number => {
    const percentage = (amount / total) * 100;
    if (percentage > 100) return 100;
    else return percentage;
  };

  return (
    <Card>
      <CardContent>
        <div className="my-2 flex flex-row items-baseline">
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            {getCategoryLabel(category)}
          </h3>
          <div className="flex-grow" />
          <div className="flex flex-row space-x-1">
            <div className="text-md font-bold">${total - amount}</div>
            <div className="text-md">left</div>
          </div>
        </div>
        <Progress value={getProgress()} />
        <div className="flex flex-row">
          <div className="flex flex-row space-x-1">
            <div className="text-md font-bold">${amount}</div>
            <div className="text-md">of</div>
            <div className="text-md">${total}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetCard;
