import ResponsiveButton from '@/components/responsive-button';
import { useToast } from '@/components/ui/use-toast';
import { translateAxiosError } from '@/lib/request';
import { doSync } from '@/lib/user';
import { useQueryClient } from '@tanstack/react-query';
import { type AxiosError } from 'axios';
import React from 'react';

const SyncAccountButton = (): JSX.Element => {
  const [loading, setLoading] = React.useState<boolean>(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const syncAccounts = (): void => {
    setLoading(true);

    doSync()
      .catch((error: AxiosError) => {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: translateAxiosError(error),
        });
      })
      .finally(() => {
        void queryClient.invalidateQueries({ queryKey: ['transactions', 'accounts'] });
        setLoading(false);
      });
  };
  return (
    <ResponsiveButton onClick={syncAccounts} loading={loading}>
      Sync Accounts
    </ResponsiveButton>
  );
};

export default SyncAccountButton;
