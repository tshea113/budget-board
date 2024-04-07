import { Progress } from '@/components/ui/progress';
import { getProgress } from '@/lib/utils';

interface BudgetTotalProps {
  label: string;
  amount: number;
  total: number;
}

const BudgetTotal = (props: BudgetTotalProps): JSX.Element => {
  return (
    <>
      <div className="grid grid-cols-2">
        <div className="text-lg font-medium">{props.label}</div>
        <div className="text-md justify-self-end font-medium">
          ${props.amount.toFixed()} of ${props.total.toFixed()}
        </div>
      </div>
      <Progress className="h-2" value={getProgress(Math.abs(props.amount), props.total)} />
    </>
  );
};

export default BudgetTotal;
