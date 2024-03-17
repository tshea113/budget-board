import ResponsiveButton from '@/components/responsive-button';
import request from '@/lib/request';
import React from 'react';

const SyncAccountButton = (): JSX.Element => {
  const [loading, setLoading] = React.useState<boolean>(false);

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
