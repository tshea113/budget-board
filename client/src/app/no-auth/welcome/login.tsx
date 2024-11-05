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
import { AxiosError, AxiosResponse } from 'axios';
import { translateAxiosError } from '@/lib/requests';
import React from 'react';
import { AuthContext } from '@/components/auth-provider';
import { LoginCardState } from './welcome';
import { toast } from 'sonner';

interface LoginProps {
  setLoginCardState: (loginCardState: LoginCardState) => void;
  setEmail: (email: string) => void;
}

const Login = (props: LoginProps): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);

  const { request, setAccessToken } = React.useContext<any>(AuthContext);

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

    const email = values.email;
    const password = values.password;

    request({
      url: '/api/login',
      method: 'POST',
      data: {
        email,
        password,
      },
    })
      .then((res: AxiosResponse) => {
        setAccessToken(res.data.accessToken);
        localStorage.setItem('refresh-token', res.data.refreshToken);
      })
      .catch((error: AxiosError) => {
        // These error response values are specific to ASP.NET Identity,
        // so will do the error translation here.
        if ((error.response?.data as any)?.detail === 'NotAllowed') {
          toast.error(
            'Please check your email for a validation email before logging in.'
          );
        } else if ((error.response?.data as any)?.detail === 'Failed') {
          toast.error('Login failed, check your credentials and try again.');
        } else {
          toast.error(translateAxiosError(error));
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const resetPassword = (email: string): void => {
    if (email) {
      request({
        url: '/api/forgotPassword',
        method: 'POST',
        data: {
          email,
        },
      }).then(() => {
        props.setLoginCardState(LoginCardState.ResetPassword);
        props.setEmail(email);
        toast.success('An email has been set with a reset code.');
      });
    } else {
      toast.error('Please enter your email to reset your password.');
    }
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
