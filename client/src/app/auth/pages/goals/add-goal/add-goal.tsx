import AccountInput from '@/components/account-input';
import ResponsiveButton from '@/components/responsive-button';
import { Input } from '@/components/ui/input';
import { GoalCondition, GoalType, INewGoalRequest, NewGoalRequest } from '@/types/goal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import GoalConditionSelect from './goal-condition-select';
import React from 'react';
import DatePicker from '@/components/date-picker';
import GoalApplyAccountSelect from './goal-apply-amount-select';
import GoalTypeSelect from './goal-type-select';
import { cn } from '@/lib/utils';
import { AuthContext } from '@/components/auth-provider';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { translateAxiosError } from '@/lib/requests';

const AddGoal = (): JSX.Element => {
  const [goalTypeValue, setgoalTypeValue] = React.useState<GoalType>(GoalType.None);
  const [goalConditionValue, setGoalConditionValue] = React.useState<GoalCondition>(
    GoalCondition.TimedGoal
  );
  const [goalApplyAccountAmount, setGoalApplyAccountAmount] = React.useState(true);

  const [newGoalName, setNewGoalName] = React.useState('');
  const [newGoalAccounts, setNewGoalAccounts] = React.useState<string[]>([]);
  const [newGoalAmount, setNewGoalAmount] = React.useState('');
  const [newGoalCompleteDate, setNewGoalCompleteDate] = React.useState<Date | null>(null);
  const [newGoalMonthlyContribution, setNewGoalMonthlyContribution] = React.useState('');

  const { request } = React.useContext<any>(AuthContext);

  const queryClient = useQueryClient();
  const doAddGoal = useMutation({
    mutationFn: async (newGoal: INewGoalRequest) =>
      await request({
        url: '/api/goal',
        method: 'POST',
        data: newGoal,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
    onError: (error: any) => {
      toast.error(translateAxiosError(error));
    },
  });

  const submitGoal = (): any => {
    if (newGoalName.length === 0) {
      toast.error('Please fill out the name.');
      return;
    } else if (newGoalAccounts.length === 0) {
      toast.error('Please select at least one account.');
      return;
    }
    const newGoal = new NewGoalRequest(newGoalName, newGoalAccounts);

    if (goalTypeValue === GoalType.SaveGoal) {
      if (newGoalAmount.length === 0) {
        toast.error('Please fill out the amount.');
        return;
      }
      newGoal.amount = parseFloat(newGoalAmount);

      // The backend will calculate the initial amount if it isn't already set.
      if (goalApplyAccountAmount) {
        newGoal.initialAmount = 0;
      }
    } else {
      newGoal.amount = 0;
    }

    if (goalConditionValue === GoalCondition.TimedGoal) {
      if (newGoalCompleteDate === null) {
        toast.error('Please fill out the end date.');
        return;
      }

      newGoal.completeDate = newGoalCompleteDate;
    } else if (goalConditionValue === GoalCondition.MonthlyGoal) {
      if (newGoalMonthlyContribution.length === 0) {
        toast.error('Please fill out the monthly contribution.');
        return;
      }

      newGoal.monthlyContribution = parseFloat(newGoalMonthlyContribution);
    }

    doAddGoal.mutate(newGoal);
  };

  return (
    <Card className="flex w-full max-w-5xl flex-col gap-3 p-2 @container">
      <GoalTypeSelect defaultValue={goalTypeValue} onValueChange={setgoalTypeValue} />
      <div className={cn(goalTypeValue.length > 0 ? 'flex flex-col gap-3' : 'hidden')}>
        <div className="flex flex-col justify-evenly gap-3 @3xl:flex-row">
          <div className="flex w-full flex-col place-content-center gap-2 @3xl:w-1/3">
            <Input
              type="text"
              value={newGoalName}
              onChange={(e) => setNewGoalName(e.target.value)}
              placeholder="Name"
            />
            <AccountInput
              selectedAccountIds={newGoalAccounts}
              setSelectedAccountIds={setNewGoalAccounts}
            />
          </div>
          {goalTypeValue === GoalType.SaveGoal && (
            <div className="flex w-full flex-col place-content-center gap-2 @3xl:w-1/3">
              <Input
                className="h-8 @sm:h-8"
                value={newGoalAmount}
                onChange={(e) => {
                  const result = parseInt(e.target.value, 10);
                  if (isNaN(result)) {
                    setNewGoalAmount('');
                  } else {
                    setNewGoalAmount(result.toString());
                  }
                }}
                type="text"
                placeholder="Amount"
              />
              <GoalApplyAccountSelect
                defaultValue={goalApplyAccountAmount}
                onValueChange={setGoalApplyAccountAmount}
              />
            </div>
          )}
          <div className="flex w-full flex-col place-content-center gap-2 @3xl:w-1/3">
            <GoalConditionSelect
              defaultValue={goalConditionValue}
              onValueChange={setGoalConditionValue}
            />
            {goalConditionValue === 'timedGoal' && (
              <DatePicker
                value={newGoalCompleteDate ?? undefined}
                onDayClick={setNewGoalCompleteDate}
              />
            )}
            {goalConditionValue === 'monthlyGoal' && (
              <Input
                className="h-8 @sm:h-8"
                value={newGoalMonthlyContribution}
                onChange={(e) => {
                  const result = parseInt(e.target.value, 10);
                  if (isNaN(result)) {
                    setNewGoalMonthlyContribution('');
                  } else {
                    setNewGoalMonthlyContribution(result.toString());
                  }
                }}
                type="text"
                placeholder="Monthly Contribution"
              />
            )}
          </div>
        </div>
        <ResponsiveButton loading={doAddGoal.isPending} onClick={submitGoal}>
          Add Goal
        </ResponsiveButton>
      </div>
    </Card>
  );
};

export default AddGoal;
