import { Input } from '@/components/ui/input';
import ResponsiveButton from '@/components/responsive-button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { translateAxiosError } from '@/lib/requests';
import { AxiosError } from 'axios';
import { AuthContext } from '@/components/auth-provider';
import React from 'react';
import { ICategoryCreateRequest, ICategoryResponse } from '@/types/category';
import { toast } from 'sonner';
import CategoryInput from '@/components/category-input';
import { defaultTransactionCategories } from '@/types/transaction';
import { Card } from '@/components/ui/card';
import { SendIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const AddCategory = (): JSX.Element => {
  const [newCategoryName, setNewCategoryName] = React.useState('');
  const [newCategoryParent, setNewCategoryParent] = React.useState('');

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
  const doAddCategory = useMutation({
    mutationFn: async (category: ICategoryCreateRequest) =>
      await request({
        url: '/api/transactionCategory',
        method: 'POST',
        data: category,
      }),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['transactionCategories'] });
      toast.success('Category added!');
    },
    onError: (error: AxiosError) => toast.error(translateAxiosError(error)),
  });

  const submitBudget = (): any => {
    const newCategory: ICategoryCreateRequest = {
      value: newCategoryName,
      parent: newCategoryParent,
    };
    doAddCategory.mutate(newCategory);
  };

  const transactionCategoriesWithCustom = defaultTransactionCategories.concat(
    transactionCategoriesQuery.data ?? []
  );

  return (
    <Card className="flex w-full flex-col gap-4 p-2">
      <div className="flex grow flex-col gap-2">
        <span className="text-sm">Category Name</span>
        <Input
          type="text"
          value={newCategoryName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewCategoryName(e.target.value)
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm">Parent Category</span>
        {transactionCategoriesQuery.isPending ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <CategoryInput
            selectedCategory={newCategoryParent}
            setSelectedCategory={setNewCategoryParent}
            categories={transactionCategoriesWithCustom}
            parentsOnly={true}
          />
        )}
      </div>
      <ResponsiveButton
        className="w-full p-0"
        loading={doAddCategory.isPending}
        onClick={submitBudget}
      >
        <SendIcon className="h-4 w-4" />
      </ResponsiveButton>
    </Card>
  );
};

export default AddCategory;
