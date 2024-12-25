import { AuthContext } from '@/components/auth-provider';
import EditableCurrencyCell from '@/components/cells/editable-currency-cell';
import LoadingIcon from '@/components/loading-icon';
import ResponsiveButton from '@/components/responsive-button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getSignForBudget } from '@/lib/budgets';
import { getFormattedCategoryValue } from '@/lib/category';
import { translateAxiosError } from '@/lib/requests';
import { cn, convertNumberToCurrency, getProgress } from '@/lib/utils';
import { type BudgetResponse } from '@/types/budget';
import { transactionCategories } from '@/types/transaction';
import { TrashIcon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React from 'react';
import { toast } from 'sonner';

interface BudgetCardProps {
  budgets: BudgetResponse[];
  amount: number;
  isIncome: boolean;
}

const BudgetCard = (props: BudgetCardProps): JSX.Element => {
  const [isSelected, setIsSelected] = React.useState(false);
  const [selectEffect, setSelectEffect] = React.useState(false);

  const limit = React.useMemo(
    () => props.budgets.reduce((n: number, b: BudgetResponse) => n + b.limit, 0),
    [props.budgets]
  );

  const { request } = React.useContext<any>(AuthContext);

  const queryClient = useQueryClient();
  const doEditBudget = useMutation({
    mutationFn: async (newBudget: BudgetResponse) =>
      await request({
        url: '/api/budget',
        method: 'PUT',
        data: newBudget,
      }),
    onMutate: async (variables: BudgetResponse) => {
      await queryClient.cancelQueries({ queryKey: ['budgets'] });

      const previousBudgets: BudgetResponse[] =
        queryClient.getQueryData(['budgets']) ?? [];

      queryClient.setQueryData(['budgets'], (oldBudgets: BudgetResponse[]) =>
        oldBudgets?.map((oldBudget) =>
          oldBudget.id === variables.id ? variables : oldBudget
        )
      );

      return { previousBudgets };
    },
    onError: (error: AxiosError, _variables: BudgetResponse, context) => {
      queryClient.setQueryData(['budgets'], context?.previousBudgets ?? []);
      toast.error(translateAxiosError(error));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['budgets'] }),
  });

  const doDeleteBudget = useMutation({
    mutationFn: async (id: string) =>
      await request({
        url: '/api/budget',
        method: 'DELETE',
        params: { id },
      }),
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: ['budgets'] }),
  });

  const toggleIsSelected = (): void => {
    if (props.budgets.length === 1) {
      setIsSelected(!isSelected);
      setSelectEffect(true);
    }
  };

  React.useEffect(() => {
    if (props.budgets.length > 1) setIsSelected(false);
  }, [props.budgets]);

  return (
    <Card
      className={cn(
        'flex flex-row shadow-md hover:border-primary',
        isSelected ? 'bg-muted' : 'bg-card',
        selectEffect && 'animate-pop'
      )}
      onClick={toggleIsSelected}
      onAnimationEnd={() => setSelectEffect(false)}
    >
      <div className="flex w-full flex-col px-3 py-1">
        <div className="flex min-h-10 flex-row items-center @container">
          <div className="flex min-h-8 w-2/5 flex-row items-center justify-start gap-2 md:w-1/2">
            <span className="select-none text-lg font-semibold tracking-tight @sm:text-xl">
              {getFormattedCategoryValue(
                props.budgets[0].category,
                transactionCategories
              )}
            </span>
            {(doEditBudget.isPending || doDeleteBudget.isPending) && <LoadingIcon />}
          </div>
          <div className="flex min-h-8 w-3/5 flex-row items-center justify-items-center text-base font-semibold @sm:text-lg md:w-1/2">
            <span className="w-1/3 select-none text-center">
              {convertNumberToCurrency(
                props.amount * getSignForBudget(props.budgets[0].category),
                false
              )}
            </span>
            <EditableCurrencyCell
              className="w-1/3 text-center"
              inputClassName="h-7 px-1 @sm:h-8 @sm:text-lg text-base p-0 md:text-lg"
              textClassName="select-none"
              value={limit}
              isSelected={isSelected}
              editCell={(newValue: number) =>
                doEditBudget.mutate({ ...props.budgets[0], limit: newValue })
              }
              hideCents={true}
              disableColor={true}
            />
            <span
              className={cn(
                'w-1/3 select-none text-center font-semibold',
                // Income behaves opposite of spending, since being above the limit is a good thing :)
                (limit - props.amount * (props.isIncome ? 1 : -1)) *
                  (props.isIncome ? -1 : 1) >
                  0
                  ? 'text-success'
                  : 'text-destructive'
              )}
            >
              {convertNumberToCurrency(
                limit - props.amount * (props.isIncome ? 1 : -1),
                false
              )}
            </span>
          </div>
        </div>
        <Progress
          className="h-2 w-full"
          value={getProgress(
            props.amount * getSignForBudget(props.budgets[0].category),
            limit
          )}
          max={100}
        />
      </div>

      {isSelected && (
        <div className="place-items-center">
          <ResponsiveButton
            variant="destructive"
            className="h-full w-9 p-1"
            onClick={() => {
              doDeleteBudget.mutate(props.budgets[0].id);
            }}
            loading={doDeleteBudget.isPending}
          >
            <TrashIcon />
          </ResponsiveButton>
        </div>
      )}
    </Card>
  );
};

export default BudgetCard;
