import ResponsiveButton from '@/components/responsive-button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { sumAccountsTotalBalance } from '@/lib/accounts';
import {
  calculateCompleteDate,
  getGoalTargetAmount,
  getMonthlyContributionTotal,
  sumTransactionsForGoalForMonth,
} from '@/lib/goals';
import { convertNumberToCurrency, cn, getProgress } from '@/lib/utils';
import { Goal } from '@/types/goal';
import { TrashIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import GoalDetails from './goal-details';
import { AuthContext } from '@/components/auth-provider';
import { Transaction } from '@/types/transaction';
import { AxiosResponse } from 'axios';

interface GoalCardProps {
  goal: Goal;
}

const GoalCard = (props: GoalCardProps): JSX.Element => {
  const [isSelected, setIsSelected] = React.useState(false);

  const ToggleIsSelected = (): void => {
    setIsSelected(!isSelected);
    setSelectEffect(true);
  };

  const transactionsForMonthQuery = useQuery({
    queryKey: [
      'transactions',
      {
        month: new Date().getMonth(),
        year: new Date().getUTCFullYear(),
        includeHidden: true,
      },
    ],
    queryFn: async (): Promise<Transaction[]> => {
      const res: AxiosResponse = await request({
        url: '/api/transaction',
        method: 'GET',
        params: { getHidden: true, date: new Date() },
      });

      if (res.status == 200) {
        return res.data;
      }

      return [];
    },
  });

  const { request } = React.useContext<any>(AuthContext);

  const queryClient = useQueryClient();
  const doDeleteGoal = useMutation({
    mutationFn: async (id: string) =>
      await request({
        url: '/api/goal',
        method: 'DELETE',
        params: { guid: id },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });

  const goalMonthlyContributionAmount = sumTransactionsForGoalForMonth(
    props.goal,
    transactionsForMonthQuery.data ?? []
  );

  const goalMonthlyTargetAmount = getMonthlyContributionTotal(props.goal);

  return (
    <Card
      className={cn(
        'flex flex-row hover:bg-card-select',
        isSelected ? 'bg-card-select' : 'bg-card',
        selectEffect && 'animate-pop'
      )}
      onClick={ToggleIsSelected}
      onAnimationEnd={() => setSelectEffect(false)}
    >
      <div className="flex w-full flex-col px-3 py-2">
        <div className="grid grid-cols-1 grid-rows-2 sm:grid-cols-2 sm:grid-rows-1">
          <span className="justify-self-start text-xl font-semibold tracking-tight">
            {props.goal.name}
          </span>
          <div className="justify-self-end text-lg">
            <span className="font-semibold">
              {convertNumberToCurrency(
                sumAccountsTotalBalance(props.goal.accounts) - props.goal.initialAmount
              )}
            </span>
            <span> of </span>
            <span className="font-semibold">
              {convertNumberToCurrency(
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
        <div className="grid grid-cols-1 grid-rows-2 pt-1 sm:grid-cols-2 sm:grid-rows-1">
          <div className="col-span-2 flex flex-row space-x-2 sm:col-span-1">
            <div className="text-base">
              <span>{'Projected: '}</span>
              <span className="font-semibold">{calculateCompleteDate(props.goal)}</span>
            </div>
            <GoalDetails goal={props.goal} />
          </div>
          <div className="justify-self-end text-base">
            <span
              className={cn(
                'font-semibold',
                goalMonthlyTargetAmount - goalMonthlyContributionAmount > 0
                  ? 'text-accent-bad'
                  : 'text-accent-good'
              )}
            >
              {convertNumberToCurrency(goalMonthlyContributionAmount)}
            </span>
            <span> of </span>
            <span className="font-semibold">
              {convertNumberToCurrency(goalMonthlyTargetAmount)}
            </span>
            <span> this month</span>
          </div>
        </div>
      </div>
      {isSelected && (
        <div className="items-center justify-center">
          <ResponsiveButton
            variant="destructive"
            className="h-full"
            onClick={(e: any) => {
              e.preventDefault();
              e.stopPropagation();
              doDeleteGoal.mutate(props.goal.id);
            }}
            loading={doDeleteGoal.isPending}
          >
            <TrashIcon />
          </ResponsiveButton>
        </div>
      )}
    </Card>
  );
};

export default GoalCard;
