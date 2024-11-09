import { Button } from '@/components/ui/button';
import BudgetsToolcard from './budgets-toolcard';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { cn, getDateFromMonthsAgo, isInArray } from '@/lib/utils';
import React from 'react';
import ResponsiveButton from '@/components/responsive-button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Budget } from '@/types/budget';
import { AuthContext } from '@/components/auth-provider';
import { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'sonner';
import { translateAxiosError } from '@/lib/requests';
import { defaultGuid } from '@/types/user';
import AddButtonPopover from '@/components/add-button-popover';
import AddBudget from '../add-budget';

interface BudgetsToolbarProps {
  selectedDates: Date[];
  addSelectedDate: (date: Date) => void;
  removeSelectedDate: (date: Date) => void;
  showCopy: boolean;
}

const BudgetsToolbar = (props: BudgetsToolbarProps): JSX.Element => {
  const [index, setIndex] = React.useState(0);

  // TODO: This value should be responsive based upon element width.
  const dates = Array.from({ length: 14 }, (_, i) => getDateFromMonthsAgo(i + index));

  const { request } = React.useContext<any>(AuthContext);

  const queryClient = useQueryClient();
  const doCopyBudget = useMutation({
    mutationFn: async (newBudgets: Budget[]) =>
      await request({
        url: '/api/budget/addmultiple',
        method: 'POST',
        data: newBudgets,
      }),
    onSuccess: async (variables: Budget[]) =>
      await queryClient.invalidateQueries({
        queryKey: ['budgets', variables[0].date],
      }),
    onError: (error: AxiosError) => toast.error(translateAxiosError(error)),
  });

  const onCopyBudgets = (): void => {
    const lastMonth = new Date(props.selectedDates[0]);
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
            budget.date = props.selectedDates[0];
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

  const handleClick = (date: Date) => {
    if (isInArray(date, props.selectedDates)) {
      props.removeSelectedDate(date);
    } else {
      props.addSelectedDate(date);
    }
  };

  // TODO: Style the toolbar correctly.
  // TODO: A button to increment and decrement the month would be nice.
  // TODO: Pipe in the correct underBudget values
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row-reverse justify-center gap-1">
        <Button
          className="m-1 h-8 w-6 p-1"
          variant="ghost"
          onClick={() => {
            setIndex(index - 1);
          }}
        >
          <ChevronRightIcon />
        </Button>
        {dates.map((date: Date, i: number) => (
          <BudgetsToolcard
            key={i}
            date={date}
            isSelected={isInArray(date, props.selectedDates)}
            isNetCashflowPositive={date.getMonth() % 2 === 0}
            handleClick={handleClick}
          />
        ))}
        <Button
          className="m-1 h-8 w-6 p-1"
          variant="ghost"
          onClick={() => {
            setIndex(index + 1);
          }}
        >
          <ChevronLeftIcon />
        </Button>
      </div>
      <div className={cn('flex flex-row', props.selectedDates.length !== 1 && 'hidden')}>
        {props.showCopy && (
          <ResponsiveButton
            className="p-2"
            variant="default"
            loading={doCopyBudget.isPending}
            onClick={onCopyBudgets}
          >
            Copy last month
          </ResponsiveButton>
        )}
        <span className="grow" />
        <AddButtonPopover>
          <AddBudget date={props.selectedDates[0]} />
        </AddButtonPopover>
      </div>
    </div>
  );
};

export default BudgetsToolbar;
