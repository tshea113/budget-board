import { AuthContext } from '@/components/auth-provider';
import ResponsiveButton from '@/components/responsive-button';
import { Card } from '@/components/ui/card';
import { translateAxiosError } from '@/lib/requests';
import { ICategoryResponse } from '@/types/category';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Trash2Icon, Undo2Icon } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

interface CustomCategoryCardProps {
  category: ICategoryResponse;
  restore?: boolean;
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
      queryClient.invalidateQueries({ queryKey: ['transactionCategories'] });
      toast.success('Category deleted!');
    },
    onError: (error: AxiosError) => toast.error(translateAxiosError(error)),
  });

  const doRestoreCategory = useMutation({
    mutationFn: async (guid: string) =>
      await request({
        url: '/api/transactionCategory/restore',
        method: 'POST',
        params: { guid },
      }),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['transactionCategories'] });
      toast.success('Category restored!');
    },
    onError: (error: AxiosError) => toast.error(translateAxiosError(error)),
  });

  return (
    <Card className="flex w-full flex-grow flex-row items-center justify-between gap-2 p-2">
      <span className="w-1/2 grow">{props.category.value}</span>
      <span className="w-1/2 grow">{props.category.parent}</span>
      <ResponsiveButton
        className="h-6 w-6 p-0"
        variant={props.restore ? 'default' : 'destructive'}
        onClick={() => {
          if (props.restore) {
            doRestoreCategory.mutate(props.category.id);
          } else {
            doDeleteCategory.mutate(props.category.id);
          }
        }}
        loading={doDeleteCategory.isPending || doRestoreCategory.isPending}
      >
        {props.restore ? (
          <Undo2Icon className="h-4 w-4" />
        ) : (
          <Trash2Icon className="h-4 w-4" />
        )}
      </ResponsiveButton>
    </Card>
  );
};

export default CustomCategoryCard;
