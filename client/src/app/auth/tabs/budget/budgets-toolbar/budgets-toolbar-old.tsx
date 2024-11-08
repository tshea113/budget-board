import { Budget } from '@/types/budget';
import MonthIterator from '../month-iterator';
import ResponsiveButton from '@/components/responsive-button';
import { AxiosError, AxiosResponse } from 'axios';
import { translateAxiosError } from '@/lib/requests';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { defaultGuid } from '@/types/user';
import AddBudget from '../add-budget';
import AddButtonPopover from '@/components/add-button-popover';
import React from 'react';
import { AuthContext } from '@/components/auth-provider';
import { toast } from 'sonner';

interface BudgetsToolbarProps {
  budgets: Budget[];
  date: Date;
  isPending: boolean;
  setDate: (date: Date) => void;
}

const BudgetsToolbarOld = (props: BudgetsToolbarProps): JSX.Element => {
  const queryClient = useQueryClient();
  const doCopyBudget = useMutation({
    mutationFn: async (newBudgets: Budget[]) =>
      await request({
        url: '/api/budget/addmultiple',
        method: 'POST',
        data: newBudgets,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['budgets', props.date] });
    },
    onError: (error: AxiosError) => {
      toast.error(translateAxiosError(error));
    },
  });

  const { request } = React.useContext<any>(AuthContext);

  const onCopyBudgets = (): void => {
    const lastMonth = new Date(props.date);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    request({
      url: '/api/budget',
      method: 'GET',
      params: { date: lastMonth },
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
          toast.error('Last month has no budget!');
        }
      })
      .catch(() => {
        toast.error("There was an error copying last month's budget.");
      });
  };

  return (
    <div className="@container">
      <div className="grid w-full grid-cols-6 grid-rows-2 items-center @xl:grid-rows-1">
        <div className="hidden @xl:col-span-1 @xl:block" />
        <div className="col-span-6 justify-self-center @xl:col-span-4">
          <MonthIterator date={props.date} setDate={props.setDate} />
        </div>
        <div className="col-span-6 flex flex-row space-x-2 justify-self-end @xl:col-span-1">
          {((props.budgets as Budget[]) ?? null)?.length === 0 && !props.isPending && (
            <ResponsiveButton
              className="p-2"
              variant="default"
              loading={doCopyBudget.isPending}
              onClick={onCopyBudgets}
            >
              Copy last month
            </ResponsiveButton>
          )}
          <AddButtonPopover>
            <AddBudget date={props.date} />
          </AddButtonPopover>
        </div>
      </div>
    </div>
  );
};

export default BudgetsToolbarOld;
