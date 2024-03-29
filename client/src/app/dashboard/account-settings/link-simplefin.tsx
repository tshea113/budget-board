/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import ResponsiveButton from '@/components/responsive-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import request from '@/lib/request';
import { getUser } from '@/lib/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';

const LinkSimpleFin = (): JSX.Element => {
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
    mutationFn: async (newToken: string) => {
      return await request({
        url: '/api/simplefin/updatetoken',
        method: 'POST',
        params: { newToken },
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const toggleForm = (): void => {
    setFormVisible((addFormVisible) => !addFormVisible);
  };

  interface FormValues {
    accessToken: string;
  }

  return (
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
              onSubmit={form.handleSubmit(async (data: FormValues, event) => {
                event?.preventDefault();
                if (user?.data) {
                  mutation.mutate(data.accessToken);
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
  );
};

export default LinkSimpleFin;
