import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import request from '@/lib/request';
import { getCategoryLabel } from '@/lib/transactions';
import { type Budget, type NewBudget } from '@/types/budget';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';

interface BudgetCardProps {
  budget: Budget;
  amount: number;
}

const BudgetCard = ({ budget, amount }: BudgetCardProps): JSX.Element => {
  const [isEdit, setIsEdit] = React.useState(false);
  const [limit, setLimit] = React.useState(budget.limit);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (newTotal: number) => {
      const updateBudget: NewBudget = {
        date: budget.date,
        category: budget.category,
        limit: newTotal,
      };
      return await request({
        url: '/api/budget',
        method: 'PUT',
        data: updateBudget,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['budgets'] });
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
  };

  return (
    <Card className="space-y-1 px-3 py-2 shadow-md" onClick={toggleIsEdit}>
      <div className="grid grid-cols-2 items-baseline">
        <h3 className="scroll-m-20 justify-self-start text-xl font-semibold tracking-tight">
          {getCategoryLabel(budget.category)}
        </h3>
        <div className="grid grid-cols-2 justify-items-end">
          <div className="flex flex-row space-x-1 justify-self-end">
            <div className="text-md font-bold">${amount.toFixed()}</div>
            <div className="text-md">of</div>
            {!isEdit ? (
              <div className="text-md">${limit}</div>
            ) : (
              <Input
                className="text-md h-6 w-12 justify-self-end px-2"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                value={limit}
                onChange={(e) => {
                  setLimit(parseInt(e.target.value));
                }}
                onBlur={() => {
                  mutation.mutate(limit);
                }}
              />
            )}
          </div>
          <div className="flex flex-row space-x-1 justify-self-end">
            <div className="text-md font-bold">{getAmountLeft(limit, amount)}</div>
            <div className="text-md">left</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 items-center"></div>
      <Progress value={getProgress()} />
    </Card>
  );
};

export default BudgetCard;
