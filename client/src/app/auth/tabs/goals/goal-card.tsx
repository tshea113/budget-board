import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAccountsQuery } from '@/lib/query';
import { getProgress } from '@/lib/utils';
import { Account } from '@/types/account';
import { Goal } from '@/types/goal';

interface GoalCardProps {
  goal: Goal;
}

const ConvertNumberToCurrency = (number: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(number);
};

const GoalCard = (props: GoalCardProps): JSX.Element => {
  const accountsQuery = useAccountsQuery();

  const getAccountsBalance = (accounts: Account[]) => {
    if (accounts.length > 0) {
      return accounts.reduce((n, { currentBalance }) => n + currentBalance, 0);
    } else {
      return 0;
    }
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
              {ConvertNumberToCurrency(getAccountsBalance(props.goal.accounts))}
            </span>
            <span> of </span>
            <span className="font-semibold">{ConvertNumberToCurrency(props.goal.amount)}</span>
          </div>
        </div>
        <div>
          <Progress
            value={getProgress(
              getAccountsBalance(props.goal.accounts),
              props.goal.amount - props.goal.initialAmount
            )}
            className="mt-3"
          />
        </div>
        <div className="grid grid-cols-2">
          <div>
            <span className="text-med">{props.goal.completeDate.toString()}</span>
          </div>
          <div className="text-med justify-self-end">
            <span className="font-semibold">{ConvertNumberToCurrency(100)}</span>
            <span> of </span>
            <span className="font-semibold">{ConvertNumberToCurrency(800)}</span>
            <span> this month</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GoalCard;
