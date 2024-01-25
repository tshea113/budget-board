import { AuthContext } from '@/components/auth-provider';
import ResponsiveButton from '@/components/responsive-button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { type UserCredential } from 'firebase/auth';
import { useContext } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import * as z from 'zod';

const Signup = (): JSX.Element => {
  const { createUser } = useContext<any>(AuthContext);

  const formSchema = z
    .object({
      email: z
        .string()
        .min(1, { message: 'This field must be filled.' })
        .email('This is not a valid email'),
      password: z.string().min(7, { message: 'Password must be at least 7 characters' }),
      confirm: z.string().min(7, { message: 'Password must be at least 7 characters' }),
    })
    .superRefine(({ confirm, password }, ctx) => {
      if (confirm !== password) {
        ctx.addIssue({
          code: 'custom',
          message: 'The passwords did not match',
          path: ['confirm'],
        });
      }
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  interface FormValues {
    email: string;
    password: string;
  }

  const onSubmit = (values: z.infer<typeof formSchema>): SubmitHandler<FormValues> => {
    return createUser(values.email, values.password).then((result: UserCredential) => {
      console.log(result);
    });
  };

  return (
    <Form {...form}>
      <h1 className="text-xl font-bold">Sign Up</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit(onSubmit)(event);
        }}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Confirm your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ResponsiveButton loading={false} />
      </form>
    </Form>
  );
};

export default Signup;
