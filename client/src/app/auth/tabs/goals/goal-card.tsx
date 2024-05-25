import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { sumAccountsTotalBalance } from '@/lib/accounts';
import {
  getGoalTargetAmount,
  getMonthlyContributionTotal,
  sumTransactionsForGoalForMonth,
} from '@/lib/goals';
import { ConvertNumberToCurrency, getProgress } from '@/lib/utils';
import { Goal } from '@/types/goal';

interface GoalCardProps {
  goal: Goal;
}

const GoalCard = (props: GoalCardProps): JSX.Element => {
  return (
    <Card>
      <div className="grid grid-rows-3 px-3 py-2">
        <div className="grid grid-cols-2">
          <span className="justify-self-start text-xl font-semibold tracking-tight">
            {props.goal.name}
          </span>
          <div className="justify-self-end text-lg">
            <span className="font-semibold">
              {ConvertNumberToCurrency(
                sumAccountsTotalBalance(props.goal.accounts) - props.goal.initialAmount
              )}
            </span>
            <span> of </span>
            <span className="font-semibold">
              {ConvertNumberToCurrency(
                getGoalTargetAmount(props.goal.amount, props.goal.initialAmount)
              )}
            </span>
          </div>
        </div>
        <div>
          <Progress
            value={getProgress(
              sumAccountsTotalBalance(props.goal.accounts) - props.goal.initialAmount,
              getGoalTargetAmount(props.goal.amount, props.goal.initialAmount)
            )}
            className="mt-3"
          />
        </div>
        <div className="grid grid-cols-2">
          <div></div>
          <div className="text-med justify-self-end">
            <span className="font-semibold">
              {ConvertNumberToCurrency(sumTransactionsForGoalForMonth(props.goal))}
            </span>
            <span> of </span>
            <span className="font-semibold">
              {ConvertNumberToCurrency(getMonthlyContributionTotal(props.goal))}
            </span>
            <span> this month</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GoalCard;
