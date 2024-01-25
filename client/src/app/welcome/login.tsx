import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
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
import { useContext } from 'react';
import ResponsiveButton from '@/components/responsive-button';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/components/auth-provider';
import axios from 'axios';
import { type UserCredential } from 'firebase/auth';
import { firebaseAuth } from '@/lib/firebase';

const GetUser = (token: string): void => {
  const headers = { authorization: 'Bearer ' + token };
  axios({
    url: import.meta.env.VITE_API_URL + '/api/user',
    method: 'GET',
    headers,
  })
    .then((res) => {
      console.log(res);
    })
    .catch((err: Error) => {
      console.error(err.message);
    });
};

const Login = (): JSX.Element => {
  const navigate = useNavigate();
  const { loginUser, loading } = useContext<any>(AuthContext);

  interface FormValues {
    email: string;
    password: string;
  }

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

  const submitUserLogin: SubmitHandler<FormValues> = (values: z.infer<typeof formSchema>) => {
    return loginUser(values.email, values.password)
      .then(async (userCredential: UserCredential) => {
        if (userCredential !== null) {
          console.log(userCredential.user);
          const token = (await firebaseAuth.currentUser?.getIdToken()) ?? '';
          if (token.length !== 0) {
            GetUser(token);
            navigate('/dashboard');
          } else {
            console.error('Token not found!');
          }
        } else {
          console.error('User not found!');
        }
      })
      .catch((err: Error) => {
        console.error(err);
      });
  };

  return (
    <Form {...form}>
      <h1 className="text-xl font-bold">Login</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit(submitUserLogin)(event);
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
        <ResponsiveButton {...loading} />
      </form>
    </Form>
  );
};

export default Login;
