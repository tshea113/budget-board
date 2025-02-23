import { AuthContext } from '@/components/auth-provider';
import ResponsiveButton from '@/components/responsive-button';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { translateAxiosError } from '@/lib/requests';
import { cn } from '@/lib/utils';
import { IApplicationUser } from '@/types/applicationUser';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse, type AxiosError } from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const LinkSimpleFin = (): JSX.Element => {
  const [formVisible, setFormVisible] = React.useState<boolean>(false);

  const { request } = React.useContext<any>(AuthContext);

  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: async (): Promise<IApplicationUser | undefined> => {
      const res: AxiosResponse = await request({
        url: '/api/applicationUser',
        method: 'GET',
      });

      if (res.status === 200) {
        return res.data as IApplicationUser;
      }

      return undefined;
    },
  });

  const queryClient = useQueryClient();
  const doSetAccessToken = useMutation({
    mutationFn: async (setupToken: string) =>
      await request({
        url: '/api/simplefin/updateAccessToken',
        method: 'PUT',
        params: { setupToken },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('SimpleFin account linked!');
    },
    onError: (error: AxiosError) => {
      toast.error(translateAxiosError(error));
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

  React.useEffect(() => {
    if (userQuery.error) {
      toast.error(translateAxiosError(userQuery.error as AxiosError));
    }
  }, [userQuery.error]);

  return (
    <Card className="flex flex-col gap-2 p-3">
      <span className="text-lg font-semibold tracking-tight">Link SimpleFIN</span>
      <div className="flex flex-col gap-4">
        <Button
          className={cn(userQuery.data?.accessToken ? 'border-success' : '')}
          variant="outline"
          onClick={toggleForm}
        >
          {userQuery.data?.accessToken
            ? 'Your SimpleFin account is linked!'
            : 'Link your SimpleFin account.'}
        </Button>
        {formVisible && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async (data: FormValues, event) => {
                event?.preventDefault();
                if (userQuery.data) {
                  doSetAccessToken.mutate(data.accessToken);
                }
              })}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="accessToken"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
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
      </div>
    </Card>
  );
};

export default LinkSimpleFin;
