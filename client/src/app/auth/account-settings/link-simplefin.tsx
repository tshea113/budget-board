/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { AuthContext } from '@/components/auth-provider';
import ResponsiveButton from '@/components/responsive-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { translateAxiosError } from '@/lib/requests';
import { User } from '@/types/user';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosResponse, type AxiosError } from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';

const LinkSimpleFin = (): JSX.Element => {
  const [formVisible, setFormVisible] = React.useState<boolean>(false);

  const { request } = React.useContext<any>(AuthContext);

  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: async (): Promise<User | undefined> => {
      const res: AxiosResponse = await request({
        url: '/api/user',
        method: 'GET',
      });

      if (res.status == 200) {
        return res.data;
      }

      return undefined;
    },
  });

  const { toast } = useToast();
  const doSetAccessToken = useMutation({
    mutationFn: async (newToken: string) =>
      await request({
        url: '/api/simplefin/updatetoken',
        method: 'POST',
        params: { newToken },
      }),
    onError: (error: AxiosError) => {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: translateAxiosError(error),
      });
    },
  });

  const toggleForm = (): void => {
    setFormVisible((addFormVisible) => !addFormVisible);
  };

  const form = useForm({
    defaultValues: {
      accessToken: '',
    },
  });

  interface FormValues {
    accessToken: string;
  }

  return (
    <Card className="mt-5">
      <CardHeader>Link an Account</CardHeader>
      <CardContent className="space-y-2">
        <Button variant="outline" onClick={toggleForm}>
          {userQuery.data?.accessToken
            ? 'Your SimpleFin account is linked!'
            : 'Link your SimpleFin account.'}
        </Button>
        {formVisible && (
          <Form {...form}>
            <form
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onSubmit={form.handleSubmit(async (data: FormValues, event) => {
                event?.preventDefault();
                if (userQuery.data) {
                  doSetAccessToken.mutate(data.accessToken);
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
              <ResponsiveButton loading={doSetAccessToken.isPending}>
                Save Changes
              </ResponsiveButton>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default LinkSimpleFin;
