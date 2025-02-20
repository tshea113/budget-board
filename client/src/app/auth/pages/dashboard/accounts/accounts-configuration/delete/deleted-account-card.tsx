import { AuthContext } from '@/components/auth-provider';
import ResponsiveButton from '@/components/responsive-button';
import { Card } from '@/components/ui/card';
import { translateAxiosError } from '@/lib/requests';
import { getDaysSinceDate } from '@/lib/utils';
import { IAccount } from '@/types/account';
import { ResetIcon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type AxiosError } from 'axios';
import React, { type JSX } from 'react';
import { toast } from 'sonner';

interface DeletedAccountCardProps {
  deletedAccount: IAccount;
}

const DeletedAccountCard = (props: DeletedAccountCardProps): JSX.Element => {
  const { request } = React.useContext<any>(AuthContext);

  const queryClient = useQueryClient();
  const doRestoreAccount = useMutation({
    mutationFn: async (id: string) =>
      await request({
        url: '/api/account/restore',
        method: 'POST',
        params: { guid: id },
      }),
    onSuccess: async () => {
      // Refetch the accounts and institutions queries immediatly after the account is restored
      await queryClient.refetchQueries({ queryKey: ['institutions'] });
      await queryClient.refetchQueries({ queryKey: ['accounts'] });
    },
    onError: (error: AxiosError) => {
      toast.error(translateAxiosError(error));
    },
  });

  return (
    <Card key={props.deletedAccount.id} className="grid grid-cols-3 items-center p-2">
      <span>{props.deletedAccount.name}</span>
      <span className="justify-self-center">
        {getDaysSinceDate(props.deletedAccount.deleted) + ' days since deleted'}
      </span>
      <div className="justify-self-center">
        <ResponsiveButton
          loading={doRestoreAccount.isPending}
          className="h-8 w-8 p-1"
          onClick={() => {
            doRestoreAccount.mutate(props.deletedAccount.id);
          }}
        >
          <ResetIcon className="h-4 w-4" />
        </ResponsiveButton>
      </div>
    </Card>
  );
};

export default DeletedAccountCard;
