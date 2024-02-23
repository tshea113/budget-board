/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import ResponsiveButton from '@/components/responsive-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import request from '@/lib/request';
import { getUser } from '@/lib/user';
import { type NewUser } from '@/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';

const AccountSettings = (): JSX.Element => {
  const [formVisible, setFormVisible] = React.useState<boolean>(false);
  const form = useForm({
    defaultValues: {
      accessToken: '',
    },
  });

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await getUser();
      return response;
    },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (newUser: NewUser) => {
      return await request({
        url: '/api/user',
        method: 'PUT',
        data: newUser,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const toggleForm = (): void => {
    setFormVisible((addFormVisible) => !addFormVisible);
  };

  return (
    <div>
      <SheetHeader>
        <SheetTitle>Account</SheetTitle>
        <SheetDescription>Make changes to your account here.</SheetDescription>
      </SheetHeader>
      <Card className="mt-5">
        <CardHeader>Link an Account</CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" onClick={toggleForm}>
            {user?.data.accessToken
              ? 'Your SimpleFin account is linked!'
              : 'Link your SimpleFin account.'}
          </Button>
          {formVisible && (
            <Form {...form}>
              <form
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onSubmit={form.handleSubmit(async (data: NewUser, event) => {
                  event?.preventDefault();
                  if (user?.data) {
                    const newUser: NewUser = {
                      uid: user.data.uid,
                      accessToken: data.accessToken,
                    };
                    mutation.mutate(newUser);
                  }
                })}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="accessToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SimpleFin Key</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <ResponsiveButton loading={mutation.isPending}>Save Changes</ResponsiveButton>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;
