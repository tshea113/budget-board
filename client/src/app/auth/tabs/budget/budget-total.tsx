import { Progress } from '@/components/ui/progress';
import { cn, getProgress } from '@/lib/utils';

interface BudgetTotalProps {
  label: string;
  amount: number;
  total?: number;
  isIncome: boolean;
}

const BudgetTotal = (props: BudgetTotalProps): JSX.Element => {
  return (
    <>
      <div className="grid grid-cols-2">
        <div className="text-lg font-medium">{props.label}</div>
        <div className="justify-self-end text-base font-medium">
          <span
            className={cn(
              'font-semibold',
              // Income behaves opposite of spending, since being above the limit is a good thing :)
              ((props.total ?? 0) - props.amount * (props.isIncome ? 1 : -1)) *
                (props.isIncome ? 1 : -1) <
                0
                ? 'text-success'
                : 'text-destructive'
            )}
          >
            {'$' + (props.amount * (props.isIncome ? 1 : -1)).toFixed()}
          </span>
          <span>{props.total != null && ' of $' + props.total.toFixed()}</span>
        </div>
      </div>
      {props.total != null && (
        <Progress
          className="h-2"
          value={getProgress(props.amount * (props.isIncome ? 1 : -1), props.total)}
        />
      )}
    </>
  );
};

export default BudgetTotal;
