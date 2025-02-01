import { Input } from '@/components/ui/input';
import ResponsiveButton from '@/components/responsive-button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { translateAxiosError } from '@/lib/requests';
import { IBudgetCreateRequest } from '@/types/budget';
import CategoryInput from '@/components/category-input';
import { AxiosError } from 'axios';
import { AuthContext } from '@/components/auth-provider';
import React from 'react';
import { defaultTransactionCategories } from '@/types/transaction';
import { toast } from 'sonner';
import { SendIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ICategoryResponse } from '@/types/category';

interface AddBudgetProps {
  date: Date;
}

const AddBudget = (props: AddBudgetProps): JSX.Element => {
  const [newCategory, setNewCategory] = React.useState<string>('');
  const [newLimit, setNewLimit] = React.useState<string>('');

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
    mutationFn: async (newBudget: IBudgetCreateRequest) =>
      await request({
        url: '/api/budget',
        method: 'POST',
        data: newBudget,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success('Budget added successfully.');
    },
    onError: (error: AxiosError) => {
      toast.error(translateAxiosError(error));
    },
  });

  const transactionCategoriesWithCustom = defaultTransactionCategories.concat(
    transactionCategoriesQuery.data ?? []
  );

  return (
    <div className="flex w-full flex-row gap-2">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="w-full">
          {transactionCategoriesQuery.isPending ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <CategoryInput
              selectedCategory={newCategory}
              setSelectedCategory={setNewCategory}
              categories={transactionCategoriesWithCustom}
            />
          )}
        </div>
        <Input
          className="h-8 @sm:h-8"
          value={newLimit}
          onChange={(e) => {
            const result = parseInt(e.target.value, 10);
            if (isNaN(result)) {
              setNewLimit('');
            } else {
              setNewLimit(result.toString());
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
          type="text"
          placeholder="Limit"
        />
      </div>
      <ResponsiveButton
        className="h-[80px] w-8 shrink-0 p-0"
        loading={doAddBudget.isPending}
        onClick={() => {
          if (newCategory.length > 0 && newLimit.length > 0) {
            doAddBudget.mutate({
              date: props.date,
              category: newCategory,
              limit: parseInt(newLimit, 10),
            });
          } else {
            toast.error('Please fill in all fields.');
          }
        }}
      >
        <SendIcon className="h-4 w-4" />
      </ResponsiveButton>
    </div>
  );
};

export default AddBudget;
