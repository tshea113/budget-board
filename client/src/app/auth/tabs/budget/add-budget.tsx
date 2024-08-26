import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import ResponsiveButton from '@/components/responsive-button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { translateAxiosError } from '@/lib/requests';
import { type NewBudget } from '@/types/budget';
import CategoryInput from '@/components/category-input';
import { defaultGuid } from '@/types/user';
import { useToast } from '@/components/ui/use-toast';
import { AxiosError } from 'axios';
import { AuthContext } from '@/components/auth-provider';
import React from 'react';
import { transactionCategories } from '@/types/transaction';
import { buildCategoriesTree } from '@/lib/category';

const formSchema = z.object({
  category: z.string().min(1).max(50),
  limit: z.coerce.number().min(0),
});

interface AddBudgetProps {
  date: Date;
}

const AddBudget = ({ date }: AddBudgetProps): JSX.Element => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      limit: 0,
    },
  });

  const { request } = React.useContext<any>(AuthContext);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (newBudget: NewBudget) =>
      await request({
        url: '/api/budget',
        method: 'POST',
        data: newBudget,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
    onError: (error: AxiosError) => {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: translateAxiosError(error),
      });
    },
  });

  interface FormValues {
    category: string;
    limit: number;
  }

  const submitBudget: SubmitHandler<FormValues> = (
    values: z.infer<typeof formSchema>
  ): any => {
    const newBudget: NewBudget = {
      date,
      category: values.category,
      limit: values.limit,
      userId: defaultGuid,
    };
    mutation.mutate(newBudget);
  };

  return (
    <div className="w-full p-1">
      <Form {...form}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit(submitBudget)(event);
          }}
          className="space-y-8"
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <CategoryInput
                      initialValue={field.value}
                      onSelectChange={field.onChange}
                      categoriesTree={buildCategoriesTree(transactionCategories)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="limit"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Limit</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ResponsiveButton loading={mutation.isPending}>Add Budget</ResponsiveButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddBudget;
