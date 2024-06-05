import { Budget } from '@/types/budget';
import MonthIterator from './month-iterator';
import ResponsiveButton from '@/components/responsive-button';
import { AxiosError, AxiosResponse } from 'axios';
import { translateAxiosError } from '@/lib/requests';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { defaultGuid } from '@/types/user';
import AddBudget from './add-budget';
import AddButtonPopover from '@/components/add-button-popover';
import React from 'react';
import { AuthContext } from '@/components/auth-provider';

interface BudgetsToolbarProps {
  budgets: Budget[];
  date: Date;
  isPending: boolean;
  setDate: (date: Date) => void;
}

const BudgetsToolbar = (props: BudgetsToolbarProps): JSX.Element => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const doCopyBudget = useMutation({
    mutationFn: async (newBudgets: Budget[]) =>
      await request({
        url: '/api/budget/addmultiple',
        method: 'POST',
        data: newBudgets,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
    onError: (error: AxiosError) => {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: translateAxiosError(error),
      });
    },
  });

  const { request } = React.useContext<any>(AuthContext);

  const onCopyBudgets = (): void => {
    const lastMonth = new Date(props.date);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    request({
      url: '/api/budget' + lastMonth,
      method: 'GET',
    })
      .then((res: AxiosResponse<any, any>) => {
        const budgets: Budget[] = res.data;
        if (budgets.length !== 0) {
          budgets.forEach((budget) => {
            budget.id = defaultGuid;
            budget.date = props.date;
            budget.userId = defaultGuid;
          });
          doCopyBudget.mutate(res.data as Budget[]);
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Last month has no budget!',
          });
        }
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: "There was an error copying last month's budget.",
        });
      });
  };

  return (
    <div className="grid w-full grid-cols-3">
      <div />
      <div className="justify-self-center">
        <MonthIterator date={props.date} setDate={props.setDate} />
      </div>
      <div className="flex flex-row space-x-2 justify-self-end">
        {((props.budgets as Budget[]) ?? null)?.length === 0 && !props.isPending && (
          <ResponsiveButton
            variant="default"
            loading={doCopyBudget.isPending}
            onClick={() => onCopyBudgets}
          >
            Copy last month
          </ResponsiveButton>
        )}
        <AddButtonPopover>
          <AddBudget date={props.date} />
        </AddButtonPopover>
      </div>
    </div>
  );
};

export default BudgetsToolbar;
