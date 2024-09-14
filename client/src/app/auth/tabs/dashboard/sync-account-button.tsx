import { AuthContext } from '@/components/auth-provider';
import ResponsiveButton from '@/components/responsive-button';
import { useToast } from '@/components/ui/use-toast';
import { translateAxiosError } from '@/lib/requests';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse, type AxiosError } from 'axios';
import React from 'react';

const SyncAccountButton = (): JSX.Element => {
  const { request } = React.useContext<any>(AuthContext);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const doSyncMutation = useMutation({
    mutationFn: async () => await request({ url: '/api/simplefin/sync', method: 'GET' }),
    onSuccess: async (data: AxiosResponse) => {
      await queryClient.invalidateQueries({ queryKey: ['transactions'] });
      await queryClient.invalidateQueries({ queryKey: ['accounts'] });
      if ((data.data?.length ?? 0) > 0) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: (
            <ul className="list-disc">
              {data.data.map((error: string) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          ),
        });
      }
    },
    onError: (error: AxiosError) => {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: translateAxiosError(error),
      });
    },
  });

  return (
    <ResponsiveButton onClick={doSyncMutation.mutate} loading={doSyncMutation.isPending}>
      Sync Accounts
    </ResponsiveButton>
  );
};

export default SyncAccountButton;
