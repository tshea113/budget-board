import { AuthContext } from '@/components/auth-provider';
import ResponsiveButton from '@/components/responsive-button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { deleteBudget, editBudget, getSignForBudget } from '@/lib/budgets';
import { getCategoryLabel } from '@/lib/transactions';
import { cn, getProgress } from '@/lib/utils';
import { type Budget } from '@/types/budget';
import { defaultGuid } from '@/types/user';
import { CheckIcon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';

interface BudgetCardProps {
  budget: Budget;
  amount: number;
}

const BudgetCard = (props: BudgetCardProps): JSX.Element => {
  const [isEdit, setIsEdit] = React.useState(false);
  const [limit, setLimit] = React.useState(props.budget.limit);

  const { accessToken } = React.useContext<any>(AuthContext);

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
      return await editBudget(accessToken, newBudget);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['budgets'] });
      setIsEdit(false);
    },
  });

  const doDeleteBudget = useMutation({
    mutationFn: async (id: string) => {
      return await deleteBudget(accessToken, id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['budgets'] });
      setIsEdit(false);
    },
  });

  const getAmountLeft = (total: number, amount: number): string => {
    return '$' + (total - amount).toFixed();
  };

  const toggleIsEdit = (): void => {
    setIsEdit(!isEdit);
  };

  return (
    <Card
      className={cn(
        'space-y-1 px-3 py-1 shadow-md hover:bg-card-select',
        isEdit ? 'bg-card-select' : 'bg-card'
      )}
      onClick={() => {
        toggleIsEdit();
        setLimit(props.budget.limit);
      }}
    >
      <div className="grid h-10 grid-cols-2 items-center">
        <div className="flex flex-row items-center space-x-2">
          <div className="scroll-m-20 justify-self-start text-xl font-semibold tracking-tight">
            {getCategoryLabel(props.budget.category) ?? ''}
          </div>
          {isEdit && (
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
        <div className="grid h-8 grid-cols-3 justify-items-center text-lg font-semibold">
          <div>${(props.amount * getSignForBudget(props.budget.category)).toFixed()}</div>
          <div>
            {!isEdit ? (
              <div>${limit}</div>
            ) : (
              <div className="flex flex-row items-baseline space-x-1">
                <Input
                  className="text-md h-8 w-20 px-2"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  value={limit}
                  onChange={(e) => {
                    setLimit(parseInt(e.target.value === '' ? '0' : e.target.value));
                  }}
                />
                <ResponsiveButton
                  className="h-9 w-9 p-0"
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
          <div>{getAmountLeft(props.budget.limit, Math.abs(props.amount))}</div>
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
