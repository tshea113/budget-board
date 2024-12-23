/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { AuthContext } from '@/components/auth-provider';
import ResponsiveButton from '@/components/responsive-button';
import { Card } from '@/components/ui/card';
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
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const ResetPassword = (): JSX.Element => {
  const [loading, setLoading] = React.useState<boolean>(false);

  const formSchema = z
    .object({
      oldPassword: z
        .string()
        .min(3, { message: 'Password must be at least 3 characters' }),
      newPassword: z
        .string()
        .min(3, { message: 'Password must be at least 3 characters' }),
      confirm: z.string().min(3, { message: 'Password must be at least 3 characters' }),
    })
    .superRefine(({ confirm, newPassword }, ctx) => {
      if (confirm !== newPassword) {
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
      oldPassword: '',
      newPassword: '',
      confirm: '',
    },
  });

  const { request } = React.useContext<any>(AuthContext);

  const submitPasswordUpdate = async (
    values: z.infer<typeof formSchema>,
    e: any
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    request({
      url: '/api/manage/info',
      method: 'POST',
      data: {
        newPassword: values.newPassword,
        oldPassword: values.oldPassword,
      },
    })
      .then(() => {
        toast.success('Password successfully updated.');
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
    <Card className="flex flex-col gap-2 p-3">
      <span className="text-xl font-bold">Reset Password</span>
      <Form {...form}>
        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={form.handleSubmit(async (data, event) => {
            await submitPasswordUpdate(data, event);
          })}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Old Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <ResponsiveButton loading={loading}>Submit</ResponsiveButton>
        </form>
      </Form>
    </Card>
  );
};

export default ResetPassword;
