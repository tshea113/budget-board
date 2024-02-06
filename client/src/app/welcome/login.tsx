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
import { useContext, useState } from 'react';
import ResponsiveButton from '@/components/responsive-button';
import { AuthContext } from '@/components/auth-provider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { getMessageForErrorCode } from '@/lib/firebase';
import request from '@/lib/request';

const Login = (): JSX.Element => {
  const { currentUserState, loginUser } = useContext<any>(AuthContext);
  const [alert, setAlert] = useState<string>('');
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
    const error: string = await loginUser(values.email, values.password);
    if (currentUserState == null) {
      setAlert(getMessageForErrorCode(error));
    } else {
      // Need to make sure a user exists before proceeding
      await request({ url: '/api/user', method: 'GET' });
    }
    setLoading(false);
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
        {alert.length !== 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{alert}</AlertDescription>
          </Alert>
        )}
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
        <ResponsiveButton {...{ loading }} onClick={() => {}}>
          Submit
        </ResponsiveButton>
      </form>
    </Form>
  );
};

export default Login;
