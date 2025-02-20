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
import { translateAxiosError, ValidationError } from '@/lib/requests';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import React, { type JSX } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { LoginCardState } from './welcome';
import { Button } from '@/components/ui/button';

interface RegisterProps {
  setLoginCardState: (loginCardState: LoginCardState) => void;
}

const Register = (props: RegisterProps): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);

  const formSchema = z
    .object({
      email: z
        .string()
        .min(1, { message: 'This field must be filled.' })
        .email('This is not a valid email'),
      password: z.string().min(3, { message: 'Password must be at least 3 characters' }),
      confirm: z.string().min(3, { message: 'Password must be at least 3 characters' }),
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
      confirm: '',
    },
  });

  const { request } = React.useContext<any>(AuthContext);

  const submitUserRegister = async (
    values: z.infer<typeof formSchema>,
    e: any
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    const email = values.email;
    const password = values.password;

    request({
      url: '/api/register',
      method: 'POST',
      data: {
        email,
        password,
      },
    })
      .then(() => {
        toast.success('Account created! Check your email for confirmation.');
        props.setLoginCardState(LoginCardState.Login);
      })
      .catch((error: AxiosError) => {
        if (error?.response?.data) {
          const errorData = error.response.data as ValidationError;
          if (
            error.status === 400 &&
            errorData.title === 'One or more validation errors occurred.'
          ) {
            toast.error(Object.values(errorData.errors).join('\n'));
          }
        } else {
          toast.error(translateAxiosError(error));
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Form {...form}>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={form.handleSubmit(async (data, event) => {
          await submitUserRegister(data, event);
        })}
        className="flex flex-col gap-4"
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
        <ResponsiveButton className="w-full" {...{ loading }}>
          Register
        </ResponsiveButton>
        <Button
          className="w-full"
          variant="outline"
          onClick={() => props.setLoginCardState(LoginCardState.Login)}
        >
          Return to Login
        </Button>
      </form>
    </Form>
  );
};

export default Register;
