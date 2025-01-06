import { Input } from '@/components/ui/input';
import ResponsiveButton from '@/components/responsive-button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { translateAxiosError } from '@/lib/requests';
import { AxiosError } from 'axios';
import { AuthContext } from '@/components/auth-provider';
import React from 'react';
import { ICategory } from '@/types/category';
import { toast } from 'sonner';
import CategoryInput from '@/components/category-input';
import { transactionCategories } from '@/types/transaction';
import { Card } from '@/components/ui/card';
import { SendIcon } from 'lucide-react';

const AddCategory = (): JSX.Element => {
  const [newCategoryName, setNewCategoryName] = React.useState('');
  const [newCategoryParent, setNewCategoryParent] = React.useState('');

  const { request } = React.useContext<any>(AuthContext);

  const queryClient = useQueryClient();
  const doAddCategory = useMutation({
    mutationFn: async (category: ICategory) =>
      await request({
        url: '/api/transactionCategory',
        method: 'POST',
        data: category,
      }),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category added!');
    },
    onError: (error: AxiosError) => toast.error(translateAxiosError(error)),
  });

  const submitBudget = (): any => {
    const newCategory: ICategory = {
      value: newCategoryName,
      parent: newCategoryParent,
    };
    doAddCategory.mutate(newCategory);
  };

  return (
    <div className="w-full @container">
      <Card className="flex flex-col gap-4 p-2 @md:flex-grow @md:flex-row @md:items-center">
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
          <CategoryInput
            selectedCategory={newCategoryParent}
            setSelectedCategory={setNewCategoryParent}
            categories={transactionCategories}
            parentsOnly={true}
          />
        </div>
        <ResponsiveButton
          className="w-full p-0 @md:h-[68px] @md:w-8"
          loading={doAddCategory.isPending}
          onClick={submitBudget}
        >
          <SendIcon className="h-4 w-4" />
        </ResponsiveButton>
      </Card>
    </div>
  );
};

export default AddCategory;
