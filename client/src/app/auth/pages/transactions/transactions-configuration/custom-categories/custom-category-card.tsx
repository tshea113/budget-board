import { AuthContext } from '@/components/auth-provider';
import ResponsiveButton from '@/components/responsive-button';
import { Card } from '@/components/ui/card';
import { translateAxiosError } from '@/lib/requests';
import { ICategoryResponse } from '@/types/category';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Trash2Icon } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

interface CustomCategoryCardProps {
  category: ICategoryResponse;
}

const CustomCategoryCard = (props: CustomCategoryCardProps): JSX.Element => {
  const { request } = React.useContext<any>(AuthContext);
  const queryClient = useQueryClient();
  const doDeleteCategory = useMutation({
    mutationFn: async (guid: string) =>
      await request({
        url: '/api/transactionCategory',
        method: 'DELETE',
        params: { guid },
      }),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted!');
    },
    onError: (error: AxiosError) => toast.error(translateAxiosError(error)),
  });

  return (
    <Card className="flex w-full flex-grow flex-row items-center justify-between p-2">
      <span className="w-1/2 grow">{props.category.value}</span>
      <span className="w-1/2 grow">{props.category.parent}</span>
      <ResponsiveButton
        className="h-6 w-6 p-0"
        variant="destructive"
        onClick={() => doDeleteCategory.mutate(props.category.id)}
        loading={doDeleteCategory.isPending}
      >
        <Trash2Icon className="h-4 w-4" />
      </ResponsiveButton>
    </Card>
  );
};

export default CustomCategoryCard;
