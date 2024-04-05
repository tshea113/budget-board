import ResponsiveButton from '@/components/responsive-button';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import request from '@/lib/request';
import { getCategoryLabel } from '@/lib/transactions';
import { type Budget, type NewBudget } from '@/types/budget';
import { CheckIcon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';

interface BudgetCardProps {
  budget: Budget;
  amount: number;
}

const BudgetCard = ({ budget, amount }: BudgetCardProps): JSX.Element => {
  const [isEdit, setIsEdit] = React.useState(false);
  const [limit, setLimit] = React.useState(budget.limit);
  const [newLimit, setNewLimit] = React.useState(budget.limit);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (newTotal: number) => {
      const updateBudget: NewBudget = {
        id: budget.id,
        date: budget.date,
        category: budget.category,
        limit: newTotal,
        userId: '00000000-0000-0000-0000-000000000000',
      };
      return await request({
        url: '/api/budget',
        method: 'PUT',
        data: updateBudget,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['budgets'] });
      setLimit(newLimit);
    },
  });

  const getProgress = (): number => {
    const percentage = (amount / limit) * 100;
    if (percentage > 100) return 100;
    else return percentage;
  };

  const getAmountLeft = (total: number, amount: number): string => {
    return '$' + (total - amount).toFixed();
  };

  const toggleIsEdit = (): void => {
    setIsEdit(!isEdit);
    if (isEdit) {
      setNewLimit(limit);
    }
  };

  const submitLimitUpdate = (): void => {
    mutation.mutate(newLimit);
  };

  return (
    <Card className="space-y-1 px-3 py-1 shadow-md" onClick={toggleIsEdit}>
      <div className="my-2 grid grid-cols-2 items-center">
        <div className="flex flex-row items-center space-x-2">
          <h3 className="scroll-m-20 justify-self-start text-xl font-semibold tracking-tight">
            {getCategoryLabel(budget.category)}
          </h3>
          {isEdit && (
            <Button variant="destructive" className="h-7">
              Delete
            </Button>
          )}
        </div>
        <div className="grid h-6 grid-cols-2 justify-items-end">
          <div className="flex flex-row items-center space-x-1 justify-self-end">
            <div className="text-md font-bold">${amount.toFixed()}</div>
            <div className="text-md">of</div>
            {!isEdit ? (
              <div className="text-md">${limit}</div>
            ) : (
              <>
                <Input
                  className="text-md h-8 w-12 justify-self-end px-2"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  value={newLimit}
                  onChange={(e) => {
                    setNewLimit(parseInt(e.target.value === '' ? '0' : e.target.value));
                  }}
                />
                <ResponsiveButton
                  className="h-8 w-8 p-0"
                  loading={mutation.isPending}
                  onClick={(e) => {
                    e.stopPropagation();
                    submitLimitUpdate();
                  }}
                >
                  <CheckIcon />
                </ResponsiveButton>
              </>
            )}
          </div>
          <div className="flex flex-row space-x-1 justify-self-end">
            <div className="text-md font-bold">{getAmountLeft(limit, amount)}</div>
            <div className="text-md">left</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 items-center"></div>
      <Progress className="h-2" value={getProgress()} />
    </Card>
  );
};

export default BudgetCard;
