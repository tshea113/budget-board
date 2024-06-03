/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import * as z from 'zod';
import { useState } from 'react';
import ResponsiveButton from '@/components/responsive-button';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { login } from '@/lib/auth';
import { AxiosError } from 'axios';
import { translateAxiosError } from '@/lib/request';
import React from 'react';
import { AuthContext } from '@/components/auth-provider';

const Login = (): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const { setIsLoggedIn } = React.useContext<any>(AuthContext);

  const formSchema = z.object({
    email: z
      .string()
      .min(1, { message: 'This field must be filled.' })
      .email('This is not a valid email'),
    password: z.string().min(7, { message: 'Password must be at least 7 characters' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const submitUserLogin = async (
    values: z.infer<typeof formSchema>,
    e: any
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    login(values.email, values.password)
      .then((res) => {
        console.log(res);
        setIsLoggedIn(true);
      })
      .catch((error: AxiosError) => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: translateAxiosError(error),
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const resetPassword = (email: string): void => {
    // TODO: Implement
    console.log(email);
  };

  return (
    <Form {...form}>
      <h1 className="text-xl font-bold">Login</h1>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={form.handleSubmit(async (data, event) => {
          await submitUserLogin(data, event);
        })}
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
        <div className="flex items-center space-x-5">
          <ResponsiveButton {...{ loading }}>Submit</ResponsiveButton>
          <Button
            variant="link"
            type="button"
            onClick={() => {
              resetPassword(form.getValues('email'));
            }}
          >
            Forgot Password?
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Login;
