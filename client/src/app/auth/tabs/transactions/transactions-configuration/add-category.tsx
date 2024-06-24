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
import CategoryInput from '@/components/category-input';
import { useToast } from '@/components/ui/use-toast';
import { AxiosError } from 'axios';
import { AuthContext } from '@/components/auth-provider';
import React from 'react';
import { Category } from '@/types/category';

const formSchema = z.object({
  category: z.string().min(1).max(50),
  parent: z.string(),
});

interface AddCategoryProps {}

const AddCategory = (props: AddCategoryProps): JSX.Element => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      parent: '',
    },
  });

  const { request } = React.useContext<any>(AuthContext);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (category: Category) =>
      await request({
        url: '/api/category',
        method: 'POST',
        data: category,
      }),
    onSuccess: async () => {
      console.log('bingus');
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
    parent: string;
  }

  const submitBudget: SubmitHandler<FormValues> = (
    values: z.infer<typeof formSchema>
  ): any => {
    const newCategory: Category = {
      label: values.category,
      value: values.category.toLowerCase(),
      subCategories: [],
      parent: values.parent,
    };
    mutation.mutate(newCategory);
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
          <div className="flex w-full flex-grow flex-row items-center gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="flex max-w-[400px] grow flex-col">
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parent"
              render={({ field }) => (
                <FormItem className="flex max-w-[400px] grow flex-col">
                  <FormLabel>Parent</FormLabel>
                  <FormControl>
                    <CategoryInput
                      initialValue={field.value}
                      onSelectChange={field.onChange}
                      parentsOnly={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ResponsiveButton loading={mutation.isPending} className="self-end">
              Add Category
            </ResponsiveButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddCategory;
