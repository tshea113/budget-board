/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import ResponsiveButton from '@/components/responsive-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useUserQuery } from '@/lib/query';
import { translateAxiosError } from '@/lib/request';
import { setAccessToken } from '@/lib/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type AxiosError } from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';

const LinkSimpleFin = (): JSX.Element => {
  const [formVisible, setFormVisible] = React.useState<boolean>(false);

  const userQuery = useUserQuery();

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const doSetAccessToken = useMutation({
    mutationFn: async (newToken: string) => {
      return await setAccessToken(newToken);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['accounts', 'accountsWithHidden'] });
    },
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
          {userQuery.data?.data.accessToken
            ? 'Your SimpleFin account is linked!'
            : 'Link your SimpleFin account.'}
        </Button>
        {formVisible && (
          <Form {...form}>
            <form
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onSubmit={form.handleSubmit(async (data: FormValues, event) => {
                event?.preventDefault();
                if (userQuery.data?.data) {
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
              <ResponsiveButton loading={doSetAccessToken.isPending}>Save Changes</ResponsiveButton>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default LinkSimpleFin;
