import ResponsiveButton from '@/components/responsive-button';
import request from '@/lib/request';
import { type AxiosResponse } from 'axios';
import React from 'react';

const SyncAccountButton = (): JSX.Element => {
  const [loading, setLoading] = React.useState<boolean>(false);

  const syncAccounts = (): void => {
    setLoading(true);
    request({
      url: '/api/simplefin/sync',
      method: 'GET',
    })
      .then((res: AxiosResponse<any, any>) => {
        console.log(res.data);
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
