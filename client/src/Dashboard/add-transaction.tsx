import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { type SubmitHandler, useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import ResponsiveButton from '@/components/responsive-button';

const formSchema = z.object({
  amount: z.number(),
});

const AddTransaction = (): JSX.Element => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
    },
  });

  interface FormValues {
    amount: number;
  }

  const submitTransaction: SubmitHandler<FormValues> = (
    values: z.infer<typeof formSchema>
  ): any => {
    console.log(values);
  };

  return (
    <Card className="w-screen">
      <Form {...form}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit(submitTransaction)(event);
          }}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input placeholder="0" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <ResponsiveButton />
        </form>
      </Form>
    </Card>
  );
};

export default AddTransaction;
