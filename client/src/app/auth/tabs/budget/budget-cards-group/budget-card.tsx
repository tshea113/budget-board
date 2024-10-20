import { AuthContext } from '@/components/auth-provider';
import ResponsiveButton from '@/components/responsive-button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { getSignForBudget } from '@/lib/budgets';
import { getFormattedCategoryValue } from '@/lib/category';
import { cn, getProgress } from '@/lib/utils';
import { type Budget } from '@/types/budget';
import { transactionCategories } from '@/types/transaction';
import { defaultGuid } from '@/types/user';
import { CheckIcon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';

interface BudgetCardProps {
  budget: Budget;
  amount: number;
  isIncome: boolean;
}

const BudgetCard = (props: BudgetCardProps): JSX.Element => {
  const [isSelected, setIsSelected] = React.useState(false);
  const [selectEffect, setSelectEffect] = React.useState(false);
  const [limit, setLimit] = React.useState(props.budget.limit);

  const { request } = React.useContext<any>(AuthContext);

  const queryClient = useQueryClient();
  const doEditBudget = useMutation({
    mutationFn: async (newTotal: number) => {
      const newBudget: Budget = {
        id: props.budget.id,
        date: props.budget.date,
        category: props.budget.category,
        limit: newTotal,
        userId: defaultGuid,
      };
      return await request({
        url: '/api/budget',
        method: 'PUT',
        data: newBudget,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['budgets'] });
      setIsSelected(false);
    },
  });

  const doDeleteBudget = useMutation({
    mutationFn: async (id: string) =>
      await request({
        url: '/api/budget',
        method: 'DELETE',
        params: { id },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['budgets'] });
      setIsSelected(false);
    },
  });

  const getAmountLeft = (total: number, amount: number): string => {
    return '$' + (total - amount).toFixed();
  };

  const toggleIsSelected = (): void => {
    setIsSelected(!isSelected);
    setSelectEffect(true);
  };

  return (
    <Card
      className={cn(
        'space-y-1 px-3 py-1 shadow-md hover:bg-muted',
        isSelected ? 'bg-muted' : 'bg-card',
        selectEffect && 'animate-pop'
      )}
      onClick={() => {
        toggleIsSelected();
        setLimit(props.budget.limit);
      }}
      onAnimationEnd={() => setSelectEffect(false)}
    >
      <div className="flex min-h-10 flex-row items-center @container">
        <div className="flex w-1/2 flex-row flex-wrap items-center space-x-2">
          <div className="scroll-m-20 justify-self-start text-lg font-semibold tracking-tight @sm:text-xl">
            {getFormattedCategoryValue(props.budget.category, transactionCategories)}
          </div>
          {isSelected && (
            <ResponsiveButton
              variant="destructive"
              className="h-7"
              onClick={() => {
                doDeleteBudget.mutate(props.budget.id);
              }}
              loading={doDeleteBudget.isPending}
            >
              Delete
            </ResponsiveButton>
          )}
        </div>
        <div className="flex w-1/2 flex-row justify-items-center text-base font-semibold @sm:text-lg">
          <div className="w-1/3 text-center">
            ${(props.amount * getSignForBudget(props.budget.category)).toFixed()}
          </div>
          <div className="w-1/3 grow text-center">
            {!isSelected ? (
              <div>${limit}</div>
            ) : (
              <div className="flex flex-row flex-wrap items-center justify-center gap-1">
                <Input
                  className="h-6 max-w-[80px] px-1 text-base @sm:h-8"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  value={limit}
                  onChange={(e) => {
                    setLimit(parseInt(e.target.value === '' ? '0' : e.target.value));
                  }}
                />
                <ResponsiveButton
                  className="h-7 w-7 p-0"
                  loading={doEditBudget.isPending}
                  onClick={(e) => {
                    e.stopPropagation();
                    doEditBudget.mutate(limit);
                  }}
                >
                  <CheckIcon />
                </ResponsiveButton>
              </div>
            )}
          </div>
          <span
            className={cn(
              'w-1/3 text-center font-semibold',
              // Income behaves opposite of spending, since being above the limit is a good thing :)
              (props.budget.limit - props.amount * (props.isIncome ? 1 : -1)) *
                (props.isIncome ? -1 : 1) >
                0
                ? 'text-accent-good'
                : 'text-destructive'
            )}
          >
            {getAmountLeft(props.budget.limit, props.amount * (props.isIncome ? 1 : -1))}
          </span>
        </div>
      </div>
      <Progress
        className="h-2 w-full"
        value={getProgress(
          props.amount * getSignForBudget(props.budget.category),
          props.budget.limit
        )}
        max={100}
      />
    </Card>
  );
};

export default BudgetCard;
