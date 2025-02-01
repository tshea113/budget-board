import { Button } from '@/components/ui/button';
import { cn, initCurrentMonth } from '@/lib/utils';
import React from 'react';
import ResponsiveButton from '@/components/responsive-button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IBudget, IBudgetCreateRequest } from '@/types/budget';
import { AuthContext } from '@/components/auth-provider';
import { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'sonner';
import { translateAxiosError } from '@/lib/requests';
import AddButtonPopover from '@/components/add-button-popover';
import AddBudget from '../add-budget';
import MonthToolCards from '../../../../../components/month-toolcards';

interface BudgetsToolbarProps {
  selectedDates: Date[];
  setSelectedDates: (newDates: Date[]) => void;
  timeToMonthlyTotalsMap: Map<number, number>;
  showCopy: boolean;
  isPending: boolean;
}

const BudgetsToolbar = (props: BudgetsToolbarProps): JSX.Element => {
  const [selectMultiple, setSelectMultiple] = React.useState(false);

  const { request } = React.useContext<any>(AuthContext);

  const queryClient = useQueryClient();
  const doCopyBudget = useMutation({
    mutationFn: async (newBudgets: IBudgetCreateRequest[]) =>
      await request({
        url: '/api/budget/addmultiple',
        method: 'POST',
        data: newBudgets,
      }),
    onSuccess: async (_, variables: IBudgetCreateRequest[]) =>
      await queryClient.invalidateQueries({
        queryKey: ['budgets', variables[0]?.date],
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
        const budgets: IBudget[] = res.data;
        if (budgets.length !== 0) {
          const newBudgets: IBudgetCreateRequest[] = budgets.map((budget) => {
            return {
              date: props.selectedDates[0],
              category: budget.category,
              limit: budget.limit,
            };
          });
          doCopyBudget.mutate(newBudgets);
        } else {
          toast.error('Previous month has no budget!');
        }
      })
      .catch(() => {
        toast.error("There was an error copying the previous month's budget.");
      });
  };

  const toggleSelectMultiple = () => {
    if (selectMultiple) {
      // Need to pick the date used for our single date.
      if (props.selectedDates.length === 0) {
        // When nothing is selected, revert back to today.
        props.setSelectedDates([initCurrentMonth()]);
      } else {
        // Otherwise select the most recent selected date.
        props.setSelectedDates([
          new Date(Math.max(...props.selectedDates.map((d) => d.getTime()))),
        ]);
      }
    }

    setSelectMultiple(!selectMultiple);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row">
        <span className="grow" />
        <Button
          className={cn(
            'w-[125px]',
            selectMultiple ? 'border-success text-success hover:text-success' : ''
          )}
          variant="outline"
          onClick={toggleSelectMultiple}
        >
          Select Multiple
        </Button>
      </div>
      <MonthToolCards
        selectedDates={props.selectedDates}
        setSelectedDates={props.setSelectedDates}
        timeToMonthlyTotalsMap={props.timeToMonthlyTotalsMap}
        showCopy={props.showCopy}
        isPending={props.isPending}
        allowSelectMultiple={selectMultiple}
      />
      <div
        className={cn('flex flex-row', (selectMultiple || props.isPending) && 'hidden')}
      >
        {props.showCopy && (
          <ResponsiveButton
            className="p-2"
            variant="default"
            loading={doCopyBudget.isPending}
            onClick={onCopyBudgets}
          >
            Copy previous month
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
