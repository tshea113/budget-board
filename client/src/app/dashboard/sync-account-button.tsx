import ResponsiveButton from '@/components/responsive-button';
import request from '@/lib/request';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

const SyncAccountButton = (): JSX.Element => {
  const [loading, setLoading] = React.useState<boolean>(false);

  const queryClient = useQueryClient();

  const syncAccounts = (): void => {
    setLoading(true);
    request({
      url: '/api/simplefin/sync',
      method: 'GET',
    })
      .catch((err: Error) => {
        console.log(err.message);
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
