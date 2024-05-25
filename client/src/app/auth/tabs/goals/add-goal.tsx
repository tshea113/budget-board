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
import { GoalType, NewGoal } from '@/types/goal';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import GoalSelect from './goal-select';
import React from 'react';
import DatePicker from '@/components/date-picker';

const formSchema = z.object({
  name: z.string().min(1).max(50),
  amount: z.coerce.number().min(0),
  accountIds: z.array(z.string()).min(1),
  completeDate: z.date(),
  monthlyContribution: z.coerce.number().min(0),
});

const AddGoal = (): JSX.Element => {
  const [goalSelectValue, setGoalSelectValue] = React.useState<GoalType>(GoalType.TimedGoal);
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

  const queryClient = useQueryClient();
  const doAddGoal = useMutation({
    mutationFn: async (newGoal: NewGoal) => {
      return addGoal(newGoal);
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

  const submitGoal: SubmitHandler<FormValues> = (values: z.infer<typeof formSchema>): any => {
    let newGoal: NewGoal = {
      name: values.name,
      amount: values.amount,
      accountIds: values.accountIds,
    };
    if (goalSelectValue === GoalType.TimedGoal) {
      newGoal.completeDate = values.completeDate;
      newGoal.monthlyContribution = 0;
    } else if (goalSelectValue === GoalType.MonthlyGoal) {
      newGoal.completeDate = new Date(0);
      newGoal.monthlyContribution = values.monthlyContribution;
    }

    doAddGoal.mutate(newGoal);
  };

  return (
    <div className="w-full p-1">
      <Form {...form}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit(submitGoal)(event);
          }}
          className="space-y-8"
        >
          <div className="max-w- grid grid-cols-2 items-center justify-center gap-4">
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
                      <AccountInput initialValues={field.value} onSelectChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Target Amount</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4">
              <GoalSelect defaultValue={goalSelectValue} onValueChange={setGoalSelectValue} />
              {goalSelectValue === 'timedGoal' && (
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
              {goalSelectValue === 'monthlyGoal' && (
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
        </form>
      </Form>
    </div>
  );
};

export default AddGoal;
