import { Progress } from '@/components/ui/progress';
import { getProgress } from '@/lib/utils';

interface BudgetTotalProps {
  label: string;
  amount: number;
  total?: number;
}

const BudgetTotal = (props: BudgetTotalProps): JSX.Element => {
  const getBudgetTotalString = (amount: number, total: number | undefined): string => {
    if (total != null) {
      return '$' + amount.toFixed() + ' of $' + total.toFixed();
    } else {
      return '$' + amount.toFixed();
    }
  };

  return (
    <>
      <div className="grid grid-cols-2">
        <div className="text-lg font-medium">{props.label}</div>
        <div className="justify-self-end text-base font-medium">
          {getBudgetTotalString(props.amount, props.total)}
        </div>
      </div>
      {props.total != null && (
        <Progress
          className="h-2"
          value={getProgress(Math.abs(props.amount), props.total)}
        />
      )}
    </>
  );
};

export default BudgetTotal;
