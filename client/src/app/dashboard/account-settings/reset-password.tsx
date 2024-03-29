/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import AlertBanner from '@/components/alert-banner';
import ResponsiveButton from '@/components/responsive-button';
import SuccessBanner from '@/components/success-banner';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { firebaseAuth, getMessageForErrorCode } from '@/lib/firebase';
import { zodResolver } from '@hookform/resolvers/zod';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const ResetPassword = (): JSX.Element => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [alert, setAlert] = React.useState<string>('');
  const [message, setMessage] = React.useState<string>('');

  const formSchema = z
    .object({
      oldPassword: z.string().min(7, { message: 'Password must be at least 7 characters' }),
      newPassword: z.string().min(7, { message: 'Password must be at least 7 characters' }),
      confirm: z.string().min(7, { message: 'Password must be at least 7 characters' }),
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

  const submitPasswordUpdate = async (
    values: z.infer<typeof formSchema>,
    e: any
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setAlert('');
    setMessage('');

    if (firebaseAuth.currentUser?.email) {
      const credential = EmailAuthProvider.credential(
        firebaseAuth.currentUser.email,
        values.oldPassword
      );

      try {
        await reauthenticateWithCredential(firebaseAuth.currentUser, credential);
        await updatePassword(firebaseAuth.currentUser, values.newPassword);
        setMessage('Password successfully updated!');
      } catch (err: any) {
        setAlert(getMessageForErrorCode(err.code as string));
      }

      setLoading(false);
    }
  };

  return (
    <Card className="mt-5">
      <CardHeader>Reset your Password</CardHeader>
      <CardContent className="space-y-2">
        <Form {...form}>
          <form
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={form.handleSubmit(async (data, event) => {
              await submitPasswordUpdate(data, event);
            })}
            className="space-y-4"
          >
            <AlertBanner alert={alert} />
            <SuccessBanner message={message} />
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
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
                <FormItem>
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
                <FormItem>
                  <FormLabel>Old Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ResponsiveButton loading={loading}>Save Changes</ResponsiveButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ResetPassword;
