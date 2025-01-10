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
import { IGoalResponse } from '@/types/goal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import GoalDetails from './goal-details';
import { AuthContext } from '@/components/auth-provider';
import { Transaction } from '@/types/transaction';
import { AxiosError, AxiosResponse } from 'axios';
import { translateAxiosError } from '@/lib/requests';
import EditableGoalNameCell from './cells/editable-goal-name-cell';
import EditableGoalTargetAmountCell from './cells/editable-goal-target-amount-cell';
import EditableGoalTargetDateCell from './cells/editable-goal-target-date-cell';
import EditableGoalMonthlyAmountCell from './cells/editable-goal-monthly-amount-cell';
import LoadingIcon from '@/components/loading-icon';
import { toast } from 'sonner';
import { TrashIcon } from 'lucide-react';

interface GoalCardProps {
  goal: IGoalResponse;
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
        year: new Date().getFullYear(),
        includeHidden: true,
      },
    ],
    queryFn: async (): Promise<Transaction[]> => {
      const res: AxiosResponse = await request({
        url: '/api/transaction',
        method: 'GET',
        params: {
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          getHidden: true,
        },
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
    mutationFn: async (newGoal: IGoalResponse) =>
      await request({
        url: '/api/goal',
        method: 'PUT',
        data: newGoal,
      }),
    onMutate: async (variables: IGoalResponse) => {
      await queryClient.cancelQueries({ queryKey: ['goals'] });

      const previousGoals: IGoalResponse[] = queryClient.getQueryData(['goals']) ?? [];

      queryClient.setQueryData(['goals'], (oldGoals: IGoalResponse[]) =>
        oldGoals.map((oldGoal) => (oldGoal.id === variables.id ? variables : oldGoal))
      );

      return { previousGoals };
    },
    onError: (error: AxiosError, _variables: IGoalResponse, context) => {
      queryClient.setQueryData(['goals'], context?.previousGoals ?? []);
      toast.error(translateAxiosError(error));
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
        'flex flex-row hover:border-primary',
        isSelected ? 'bg-muted' : 'bg-card',
        selectEffect && 'animate-pop'
      )}
      onClick={ToggleIsSelected}
      onAnimationEnd={() => setSelectEffect(false)}
    >
      <div className="flex w-full flex-col px-3 py-2">
        <div className="flex w-full flex-row flex-wrap">
          <span className="flex grow flex-row items-center justify-start gap-2">
            <EditableGoalNameCell
              goal={props.goal}
              isSelected={isSelected}
              editCell={doEditGoal.mutate}
            />
            {(doEditGoal.isPending || doDeleteGoal.isPending) && <LoadingIcon />}
          </span>
          <div className="flex grow select-none flex-row items-center justify-end gap-1 text-lg">
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
            <span className="font-medium tracking-tight">Projected:</span>
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
                  ? 'text-destructive'
                  : 'text-success'
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
        <div>
          <ResponsiveButton
            variant="destructive"
            className="h-full w-11 p-0"
            onClick={(e: any) => {
              e.preventDefault();
              e.stopPropagation();
              doDeleteGoal.mutate(props.goal.id);
            }}
            loading={doDeleteGoal.isPending}
          >
            <TrashIcon className="h-4 w-4" />
          </ResponsiveButton>
        </div>
      )}
    </Card>
  );
};

export default GoalCard;
