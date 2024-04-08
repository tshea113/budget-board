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
import { firebaseAuth, getMessageForErrorCode, loginUser } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { sendPasswordResetEmail } from 'firebase/auth';
import SuccessBanner from '@/components/success-banner';
import AlertBanner from '@/components/alert-banner';
import { getUser } from '@/lib/user';

const Login = (): JSX.Element => {
  const [alert, setAlert] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

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

  const submitUserLogin = async (values: z.infer<typeof formSchema>, e: any): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setAlert('');
    setMessage('');

    const error: string = await loginUser(values.email, values.password);
    if (error.length !== 0) {
      setAlert(getMessageForErrorCode(error));
    } else {
      // Need to make sure a user exists before proceeding
      await getUser();
    }
    setLoading(false);
  };

  const resetPassword = (email: string): void => {
    sendPasswordResetEmail(firebaseAuth, email)
      .then(() => {
        setMessage(
          'A reset email has been sent to the provided address, if an associated account exists.'
        );
      })
      .catch((err: any) => {
        setAlert(getMessageForErrorCode(err.code as string));
      });
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
        <AlertBanner alert={alert} setAlert={setAlert} />
        <SuccessBanner message={message} />
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
