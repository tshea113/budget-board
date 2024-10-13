import ResponsiveButton from '@/components/responsive-button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { sumAccountsTotalBalance } from '@/lib/accounts';
import {
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
import { AxiosError, AxiosResponse } from 'axios';
import { toast } from '@/components/ui/use-toast';
import { translateAxiosError } from '@/lib/requests';
import EditableGoalNameCell from './cells/editable-goal-name-cell';
import EditableGoalTargetAmountCell from './cells/editable-goal-target-amount-cell';
import EditableGoalTargetDateCell from './cells/editable-goal-target-date-cell';
import EditableGoalMonthlyAmountCell from './cells/editable-goal-monthly-amount-cell';
import LoadingIcon from '@/components/loading-icon';

interface GoalCardProps {
  goal: Goal;
}

const GoalCard = (props: GoalCardProps): JSX.Element => {
  const [isSelected, setIsSelected] = React.useState(false);
  const [selectEffect, setSelectEffect] = React.useState(false);

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

  const doEditGoal = useMutation({
    mutationFn: async (newGoal: Goal) =>
      await request({
        url: '/api/goal',
        method: 'PUT',
        data: newGoal,
      }),
    onMutate: async (variables: Goal) => {
      await queryClient.cancelQueries({ queryKey: ['goals'] });

      const previousGoals: Goal[] = queryClient.getQueryData(['goals']) ?? [];

      queryClient.setQueryData(['goals'], (oldGoals: Goal[]) =>
        oldGoals.map((oldGoal) => (oldGoal.id === variables.id ? variables : oldGoal))
      );

      return { previousGoals };
    },
    onError: (error: AxiosError, _variables: Goal, context) => {
      queryClient.setQueryData(['goals'], context?.previousGoals ?? []);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: translateAxiosError(error),
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });

  const goalMonthlyContributionAmount = sumTransactionsForGoalForMonth(
    props.goal,
    transactionsForMonthQuery.data ?? []
  );

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
        <div className="flex w-full flex-row flex-wrap">
          <span className="flex grow flex-row items-center justify-start gap-2 text-xl font-semibold tracking-tight">
            <EditableGoalNameCell
              goal={props.goal}
              isSelected={isSelected}
              editCell={doEditGoal.mutate}
            />
            {(doEditGoal.isPending || doDeleteGoal.isPending) && <LoadingIcon />}
          </span>
          <div className="flex grow flex-row items-center justify-end gap-1 text-lg">
            <span className="font-semibold">
              {convertNumberToCurrency(
                sumAccountsTotalBalance(props.goal.accounts) - props.goal.initialAmount
              )}
            </span>
            <span>of</span>
            <EditableGoalTargetAmountCell
              goal={props.goal}
              isSelected={isSelected}
              editCell={doEditGoal.mutate}
            />
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
        <div className="flex w-full flex-row flex-wrap gap-2">
          <div className="flex flex-row gap-1 text-base">
            <span>Projected:</span>
            <EditableGoalTargetDateCell
              goal={props.goal}
              isSelected={isSelected}
              editCell={doEditGoal.mutate}
            />
          </div>
          <div className="grow justify-start">
            <GoalDetails goal={props.goal} />
          </div>

          <div className="flex grow flex-row items-center justify-end gap-1 text-base">
            <span
              className={cn(
                'font-semibold',
                getMonthlyContributionTotal(props.goal) - goalMonthlyContributionAmount >
                  0
                  ? 'text-accent-bad'
                  : 'text-accent-good'
              )}
            >
              {convertNumberToCurrency(goalMonthlyContributionAmount)}
            </span>
            <span>of</span>
            <EditableGoalMonthlyAmountCell
              goal={props.goal}
              isSelected={isSelected}
              editCell={doEditGoal.mutate}
            />
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
