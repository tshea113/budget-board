import { AuthContext } from '@/components/auth-provider';
import ResponsiveButton from '@/components/responsive-button';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { getFormattedCategoryValue } from '@/lib/category';
import { translateAxiosError } from '@/lib/requests';
import { convertNumberToCurrency } from '@/lib/utils';
import { IBudgetCreateRequest } from '@/types/budget';
import { ICategoryResponse } from '@/types/category';
import { defaultTransactionCategories } from '@/types/transaction';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PlusIcon, SendIcon } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

interface UnbudgetCardProps {
  name: string;
  amount: number;
  selectedDates: Date[];
}

const UnbudgetCard = (props: UnbudgetCardProps): JSX.Element => {
  const [newBudgetLimit, setNewBudgetLimit] = React.useState<string>('');

  const { request } = React.useContext<any>(AuthContext);

  const transactionCategoriesQuery = useQuery({
    queryKey: ['transactionCategories'],
    queryFn: async () => {
      const res = await request({
        url: '/api/transactionCategory',
        method: 'GET',
      });

      if (res.status === 200) {
        return res.data as ICategoryResponse[];
      }

      return undefined;
    },
  });

  const queryClient = useQueryClient();
  const doAddBudget = useMutation({
    mutationFn: async (newBudget: IBudgetCreateRequest[]) =>
      await request({
        url: '/api/budget',
        method: 'POST',
        data: newBudget,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
    onError: (error: AxiosError) => {
      toast.error(translateAxiosError(error));
    },
  });

  const transactionCategoriesWithCustom = defaultTransactionCategories.concat(
    transactionCategoriesQuery.data ?? []
  );

  return (
    <Card className="flex w-full flex-row justify-between px-3 py-1 @container">
      <span className="w-2/5 text-lg font-semibold tracking-tight md:w-1/2">
        {transactionCategoriesQuery.isPending ? (
          <Skeleton className="h-8 w-full" />
        ) : (
          getFormattedCategoryValue(props.name, transactionCategoriesWithCustom)
        )}
      </span>
      <div className="flex w-3/5 flex-row items-center justify-between md:w-1/2">
        <span className="w-1/3 text-center text-base font-semibold tracking-tight @sm:text-lg">
          {convertNumberToCurrency(props.amount)}
        </span>
        {props.selectedDates.length === 1 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-7 w-7 p-0 md:h-8 md:w-8">
                <PlusIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="flex w-[150px] flex-row gap-2 p-2">
              <div className="flex flex-col gap-1">
                <Input
                  className="h-8 @sm:h-8"
                  value={newBudgetLimit}
                  onChange={(e) => {
                    const result = parseInt(e.target.value, 10);
                    if (isNaN(result)) {
                      setNewBudgetLimit('');
                    } else {
                      setNewBudgetLimit(result.toString());
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  type="text"
                  placeholder="Limit"
                />
              </div>
              {transactionCategoriesQuery.isPending ? (
                <Skeleton className="h-8 w-8 shrink-0" />
              ) : (
                <ResponsiveButton
                  className="h-8 w-8 shrink-0 p-0"
                  loading={doAddBudget.isPending}
                  onClick={() =>
                    doAddBudget.mutate([
                      {
                        date: props.selectedDates[0],
                        category: getFormattedCategoryValue(
                          props.name,
                          transactionCategoriesWithCustom
                        ),
                        limit: parseInt(newBudgetLimit, 10),
                      },
                    ])
                  }
                >
                  <SendIcon className="h-4 w-4" />
                </ResponsiveButton>
              )}
            </PopoverContent>
          </Popover>
        )}
      </div>
    </Card>
  );
};

export default UnbudgetCard;
