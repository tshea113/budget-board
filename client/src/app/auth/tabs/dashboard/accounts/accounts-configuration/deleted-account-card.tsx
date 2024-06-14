import { AuthContext } from '@/components/auth-provider';
import ResponsiveButton from '@/components/responsive-button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { translateAxiosError } from '@/lib/requests';
import { getDaysSinceDeleted } from '@/lib/utils';
import { type Account } from '@/types/account';
import { ResetIcon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type AxiosError } from 'axios';
import React from 'react';

interface DeletedAccountCardProps {
  deletedAccount: Account;
}

const DeletedAccountCard = (props: DeletedAccountCardProps): JSX.Element => {
  const { request } = React.useContext<any>(AuthContext);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const doRestoreAccount = useMutation({
    mutationFn: async (id: string) =>
      await request({
        url: '/api/account/restore',
        method: 'POST',
        params: { guid: id },
      }),
    onSuccess: async () => {
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
    <Card key={props.deletedAccount.id} className="grid grid-cols-3 items-center p-2">
      <span>{props.deletedAccount.name}</span>
      <span className="justify-self-center">
        {getDaysSinceDeleted(props.deletedAccount.deleted) + ' days since deleted'}
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
