import { AuthContext } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { translateAxiosError } from '@/lib/requests';
import { cn } from '@/lib/utils';
import { UpdateIcon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse, type AxiosError } from 'axios';
import React, { type JSX } from 'react';
import { toast } from 'sonner';

interface SyncAccountButtonProps {
  variant?: 'default' | 'outline';
}

const SyncAccountButton = (props: SyncAccountButtonProps): JSX.Element => {
  const { request } = React.useContext<any>(AuthContext);

  const queryClient = useQueryClient();
  const doSyncMutation = useMutation({
    mutationFn: async () => await request({ url: '/api/simplefin/sync', method: 'GET' }),
    onSuccess: async (data: AxiosResponse) => {
      await queryClient.invalidateQueries({ queryKey: ['transactions'] });
      await queryClient.invalidateQueries({ queryKey: ['institutions'] });
      await queryClient.invalidateQueries({ queryKey: ['accounts'] });
      if ((data.data?.length ?? 0) > 0) {
        toast.error(
          <ul className="list-disc">
            {data.data.map((error: string) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        );
      }
    },
    onError: (error: AxiosError) => {
      toast.error(translateAxiosError(error));
    },
  });

  return (
    <Button
      variant={props.variant ?? 'default'}
      onClick={(e) => {
        e.preventDefault();
        doSyncMutation.mutate();
      }}
    >
      <div className="flex flex-row items-center gap-1">
        <span>{doSyncMutation.isPending ? 'Syncing' : 'Sync'}</span>
        <UpdateIcon className={cn(doSyncMutation.isPending ? 'animate-spin' : '')} />
      </div>
    </Button>
  );
};

export default SyncAccountButton;
