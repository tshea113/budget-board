import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { type SubmitHandler, useForm } from 'react-hook-form';
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
import { type NewTransaction } from '@/types/transaction';
import request from '@/lib/request';
import { type AxiosResponse } from 'axios';
import { useState } from 'react';

const formSchema = z.object({
  date: z.date({
    required_error: 'A transaction date is required.',
  }),
  merchant: z.string().min(1).max(50),
  amount: z.coerce.number().nonnegative(),
  category: z.string().min(1).max(50),
  accountId: z.string().min(1).max(50),
});

const AddTransaction = (): JSX.Element => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      merchant: '',
      amount: 0,
      category: '',
      accountId: '',
    },
  });

  const [loading, setLoading] = useState(false);

  interface FormValues {
    date: Date;
    merchant: string;
    amount: number;
    category: string;
    accountId: string;
  }

  const submitTransaction: SubmitHandler<FormValues> = (
    values: z.infer<typeof formSchema>
  ): any => {
    setLoading(true);
    const newTransaction: NewTransaction = {
      amount: values.amount,
      date: values.date,
      category: values.category,
      merchantName: values.merchant,
      pending: false,
      source: 'manual',
      accountId: values.accountId,
    };

    request({
      url: '/api/transaction',
      method: 'POST',
      data: newTransaction,
    })
      .then((res: AxiosResponse) => {
        console.log(res);
      })
      .catch((err: Error) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
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
          <div className="flex gap-4">
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
                    <Input className="w-[240px]" placeholder="Enter an amount" {...field} />
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
                    <Input className="w-[240px]" placeholder="Enter a category" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Account Id</FormLabel>
                  <FormControl>
                    <Input className="w-[240px]" placeholder="Enter an account" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <ResponsiveButton loading={loading} />
        </form>
      </Form>
    </Card>
  );
};

export default AddTransaction;
