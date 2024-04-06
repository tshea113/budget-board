import ResponsiveButton from '@/components/responsive-button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import request from '@/lib/request';
import { getCategoryLabel, getParentCategory } from '@/lib/transactions';
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

  const queryClient = useQueryClient();
  const doEditBudget = useMutation({
    mutationFn: async (newTotal: number) => {
      const newBudget: NewBudget = {
        id: budget.id,
        date: budget.date,
        category: budget.category,
        limit: newTotal,
        userId: '00000000-0000-0000-0000-000000000000',
      };
      return await request({
        url: '/api/budget',
        method: 'PUT',
        data: newBudget,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['budgets'] });
      setIsEdit(false);
    },
  });

  const doDeleteBudget = useMutation({
    mutationFn: async (id: string) => {
      return await request({
        url: '/api/budget',
        method: 'DELETE',
        params: { id },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['budgets'] });
      setIsEdit(false);
    },
  });

  const getProgress = (amount: number, limit: number): number => {
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
      setLimit(budget.limit);
    }
  };

  const submitLimitUpdate = (): void => {
    doEditBudget.mutate(limit);
  };

  const getAmountSign = (amount: number): number => {
    return getParentCategory(budget.category) === 'income' ? amount : amount * -1;
  };

  return (
    <Card className="hover:bg-card-select space-y-1 px-3 py-1 shadow-md" onClick={toggleIsEdit}>
      <div className="grid h-10 grid-cols-2 items-center">
        <div className="flex flex-row items-center space-x-2">
          <div className="scroll-m-20 justify-self-start text-xl font-semibold tracking-tight">
            {getCategoryLabel(budget.category)}
          </div>
          {isEdit && (
            <ResponsiveButton
              variant="destructive"
              className="h-7"
              onClick={() => {
                doDeleteBudget.mutate(budget.id);
              }}
              loading={doDeleteBudget.isPending}
            >
              Delete
            </ResponsiveButton>
          )}
        </div>
        <div className="grid h-8 grid-cols-3 justify-items-center text-lg font-semibold">
          <div>${getAmountSign(amount).toFixed()}</div>
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
                    submitLimitUpdate();
                  }}
                >
                  <CheckIcon />
                </ResponsiveButton>
              </div>
            )}
          </div>
          <div>{getAmountLeft(budget.limit, getAmountSign(amount))}</div>
        </div>
      </div>
      <Progress className="h-2" value={getProgress(getAmountSign(amount), budget.limit)} />
    </Card>
  );
};

export default BudgetCard;
