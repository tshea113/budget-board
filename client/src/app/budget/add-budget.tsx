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
import CategoryInput from '../transactions/category-input';
import { Input } from '@/components/ui/input';
import ResponsiveButton from '@/components/responsive-button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import request from '@/lib/request';
import { type NewBudget } from '@/types/budget';

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

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (newBudget: NewBudget) => {
      return await request({
        url: '/api/budget',
        method: 'POST',
        data: newBudget,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });

  interface FormValues {
    category: string;
    limit: number;
  }

  const submitBudget: SubmitHandler<FormValues> = (values: z.infer<typeof formSchema>): any => {
    const newBudget: NewBudget = {
      date,
      category: values.category,
      limit: values.limit,
      userId: '00000000-0000-0000-0000-000000000000',
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
                    <CategoryInput initialValue={field.value} onSelectChange={field.onChange} />
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
