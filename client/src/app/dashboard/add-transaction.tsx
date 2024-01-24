import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import ResponsiveButton from '@/components/responsive-button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Category, SubCategory, type NewTransaction } from '@/types/transaction';
import request from '@/lib/request';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAccounts } from '@/lib/accounts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type Account } from '@/types/account';

const formSchema = z.object({
  date: z.date({
    required_error: 'A transaction date is required.',
  }),
  merchant: z.string().min(1).max(50),
  amount: z.coerce.number().nonnegative(),
  category: z.string().min(1).max(50),
  subcategory: z.string().min(1).max(50),
  accountId: z.string().min(1).max(50),
});

const AddTransaction = (): JSX.Element => {
  const { data } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await getAccounts();
      return response;
    },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (newTransaction: NewTransaction) => {
      return await request({
        url: '/api/transaction',
        method: 'POST',
        data: newTransaction,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      merchant: '',
      amount: 0,
      category: 'None',
      subcategory: 'None',
      accountId: '',
    },
  });

  const watchCategory: string = useWatch({
    control: form.control,
    name: 'category',
  });

  const getSubCategories = (category: string): string[] => {
    return SubCategory[Category.indexOf(category)] ?? [];
  };

  interface FormValues {
    date: Date;
    merchant: string;
    amount: number;
    category: string;
    subcategory: string;
    accountId: string;
  }

  const submitTransaction: SubmitHandler<FormValues> = (
    values: z.infer<typeof formSchema>
  ): any => {
    const newTransaction: NewTransaction = {
      amount: values.amount,
      date: values.date,
      category: values.category,
      subcategory: values.subcategory,
      merchantName: values.merchant,
      pending: false,
      source: 'manual',
      accountId: values.accountId,
    };
    mutation.mutate(newTransaction);
  };

  return (
    <Card className="w-screen p-2">
      <Form {...form}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit(submitTransaction)(event);
          }}
          className="space-y-8"
        >
          <div className="flex flex-row flex-wrap gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-[240px] pl-3 text-left font-normal',
                            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {
                            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                            field.value ? format(field.value, 'PPP') : <span>Pick a date</span>
                          }
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onDayClick={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="merchant"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Merchant</FormLabel>
                  <FormControl>
                    <Input className="w-[240px]" placeholder="Enter a merchant" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-[240px]"
                      placeholder="Enter an amount"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(e) => {
                        field.onChange(e);
                        form.resetField('subcategory', { keepDirty: false });
                      }}
                    >
                      <SelectTrigger className="min-w-min">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Category.map((value: string, index: number) => (
                          <SelectItem key={index} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            {getSubCategories(watchCategory).length !== 0 && (
              <FormField
                control={form.control}
                name="subcategory"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>SubCategory</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue="None">
                        <SelectTrigger className="min-w-min">
                          <SelectValue asChild>
                            <p>{field.value}</p>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {getSubCategories(watchCategory).map((value: string, index: number) => (
                            <SelectItem key={index} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="accountId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Account</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-[240px]">
                        <SelectValue placeholder="Select an account" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {data?.data.map((account: Account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="Cash">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          <ResponsiveButton loading={mutation.isPending} />
        </form>
      </Form>
    </Card>
  );
};

export default AddTransaction;
