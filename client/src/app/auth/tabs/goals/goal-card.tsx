import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { sumAccountsTotalBalance } from '@/lib/accounts';
import { useAccountsQuery } from '@/lib/query';
import { getMonthsUntilDate, getProgress } from '@/lib/utils';
import { Goal } from '@/types/goal';

interface GoalCardProps {
  goal: Goal;
}

const GoalCard = (props: GoalCardProps): JSX.Element => {
  const accountsQuery = useAccountsQuery();

  const getMonthlyContributionTotal = (goal: Goal): number => {
    if (goal.monthlyContribution == null && goal.completeDate !== null) {
      const monthsUntilComplete = getMonthsUntilDate(goal.completeDate);
      return (
        Math.abs(
          props.goal.amount -
            (sumAccountsTotalBalance(props.goal.accounts) - props.goal.initialAmount)
        ) / monthsUntilComplete
      );
    } else {
      return goal.monthlyContribution ?? 0;
    }
  };

  const ConvertNumberToCurrency = (number: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(number);
  };

  if (accountsQuery.isPending) {
    return <span>Loading...</span>;
  }

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
                props.goal.initialAmount < 0
                  ? props.goal.amount - props.goal.initialAmount
                  : props.goal.amount
              )}
            </span>
          </div>
        </div>
        <div>
          <Progress
            value={getProgress(
              sumAccountsTotalBalance(props.goal.accounts) - props.goal.initialAmount,
              props.goal.initialAmount < 0
                ? props.goal.amount - props.goal.initialAmount
                : props.goal.amount
            )}
            className="mt-3"
          />
        </div>
        <div className="grid grid-cols-2">
          <div></div>
          <div className="text-med justify-self-end">
            <span className="font-semibold">{ConvertNumberToCurrency(12)}</span>
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
