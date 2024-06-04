import { AuthContext } from '@/components/auth-provider';
import ResponsiveButton from '@/components/responsive-button';
import { useToast } from '@/components/ui/use-toast';
import { translateAxiosError } from '@/lib/request';
import { doSync } from '@/lib/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type AxiosError } from 'axios';
import React from 'react';

const SyncAccountButton = (): JSX.Element => {
  const { accessToken } = React.useContext<any>(AuthContext);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const doSyncMutation = useMutation({
    mutationFn: async () => {
      return await doSync(accessToken);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['transactions'] });
      await queryClient.invalidateQueries({ queryKey: ['accounts'] });
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
