import AccountInput from '@/components/account-input';
import ResponsiveButton from '@/components/responsive-button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { addGoal } from '@/lib/goals';
import { GoalCondition, GoalType, NewGoal } from '@/types/goal';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import GoalConditionSelect from './goal-condition-select';
import React from 'react';
import DatePicker from '@/components/date-picker';
import GoalApplyAccountSelect from './goal-apply-amount-select';
import GoalTypeSelect from './goal-type-select';
import { cn } from '@/lib/utils';
import { AuthContext } from '@/components/auth-provider';

const formSchema = z.object({
  name: z.string().min(1).max(50),
  amount: z.coerce.number().min(0),
  accountIds: z.array(z.string()).min(1),
  completeDate: z.date(),
  monthlyContribution: z.coerce.number().min(0),
});

const AddGoal = (): JSX.Element => {
  const [goalTypeValue, setgoalTypeValue] = React.useState<GoalType>(GoalType.None);
  const [goalConditionValue, setGoalConditionValue] = React.useState<GoalCondition>(
    GoalCondition.TimedGoal
  );
  const [goalApplyAccountAmount, setGoalApplyAccountAmount] = React.useState(true);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      amount: 0,
      accountIds: [],
      completeDate: new Date(),
      monthlyContribution: 0,
    },
  });

  const { accessToken } = React.useContext<any>(AuthContext);

  const queryClient = useQueryClient();
  const doAddGoal = useMutation({
    mutationFn: async (newGoal: NewGoal) => {
      return addGoal(accessToken, newGoal);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });

  interface FormValues {
    name: string;
    amount: number;
    accountIds: string[];
    completeDate: Date;
    monthlyContribution: number;
  }

  const submitGoal: SubmitHandler<FormValues> = (
    values: z.infer<typeof formSchema>
  ): any => {
    let newGoal: NewGoal = {
      name: values.name,
      accountIds: values.accountIds,
    };

    if (goalTypeValue === GoalType.SaveGoal) {
      newGoal.amount = values.amount;
      // The backend will calculate the initial amount if it isn't already set.
      if (goalApplyAccountAmount) {
        newGoal.initialAmount = 0;
      }
    } else {
      // Naturally, paying off a loan has a target of 0.
      newGoal.amount = 0;
    }

    if (goalConditionValue === GoalCondition.TimedGoal) {
      newGoal.completeDate = values.completeDate;
    } else if (goalConditionValue === GoalCondition.MonthlyGoal) {
      newGoal.monthlyContribution = values.monthlyContribution;
    }

    doAddGoal.mutate(newGoal);
  };

  return (
    <div className="w-full max-w-screen-2xl p-1">
      <Form {...form}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit(submitGoal)(event);
          }}
          className="space-y-8"
        >
          <GoalTypeSelect defaultValue={goalTypeValue} onValueChange={setgoalTypeValue} />
          {goalTypeValue.length > 0 && (
            <>
              <div
                className={cn(
                  'grid items-center justify-center gap-4',
                  goalTypeValue === GoalType.SaveGoal ? 'grid-cols-3' : 'grid-cols-2'
                )}
              >
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="accountIds"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Associated Accounts</FormLabel>
                        <FormControl>
                          <AccountInput
                            initialValues={field.value}
                            onSelectChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {goalTypeValue === GoalType.SaveGoal && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <GoalApplyAccountSelect
                      defaultValue={goalApplyAccountAmount}
                      onValueChange={setGoalApplyAccountAmount}
                    />
                  </div>
                )}
                <div className="space-y-4">
                  <GoalConditionSelect
                    defaultValue={goalConditionValue}
                    onValueChange={setGoalConditionValue}
                  />
                  {goalConditionValue === 'timedGoal' && (
                    <FormField
                      control={form.control}
                      name="completeDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Target Date</FormLabel>
                          <FormControl>
                            <DatePicker value={field.value} onDayClick={field.onChange} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {goalConditionValue === 'monthlyGoal' && (
                    <FormField
                      control={form.control}
                      name="monthlyContribution"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Monthly Contribution</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
              <ResponsiveButton loading={doAddGoal.isPending}>Add Goal</ResponsiveButton>
            </>
          )}
        </form>
      </Form>
    </div>
  );
};

export default AddGoal;
