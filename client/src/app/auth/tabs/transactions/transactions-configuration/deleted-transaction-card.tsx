import { AuthContext } from '@/components/auth-provider';
import ResponsiveButton from '@/components/responsive-button';
import { Card } from '@/components/ui/card';
import { translateAxiosError } from '@/lib/requests';
import { getDaysSinceDate } from '@/lib/utils';
import { type Transaction } from '@/types/transaction';
import { ResetIcon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type AxiosError } from 'axios';
import React from 'react';
import { toast } from 'sonner';

interface DeletedTransactionCardProps {
  deletedTransaction: Transaction;
}

const DeletedTransactionCard = (props: DeletedTransactionCardProps): JSX.Element => {
  const { request } = React.useContext<any>(AuthContext);

  const queryClient = useQueryClient();
  const doRestoreTransaction = useMutation({
    mutationFn: async (id: string) => {
      return await request({
        url: '/api/transaction/restore',
        method: 'POST',
        params: { guid: id },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error: AxiosError) => {
      toast.error(translateAxiosError(error));
    },
  });

  return (
    <Card
      key={props.deletedTransaction.id}
      className="grid grid-cols-2 grid-rows-2 place-items-center p-2 md:grid-cols-3 md:grid-rows-1"
    >
      <span className="col-span-2 justify-self-start md:col-span-1">
        {props.deletedTransaction.merchantName}
      </span>
      <span className="col-span-1">
        {getDaysSinceDate(props.deletedTransaction.deleted) + ' days since deleted'}
      </span>
      <div className="col-span-1 justify-self-end md:place-self-center">
        <ResponsiveButton
          loading={doRestoreTransaction.isPending}
          className="h-8 w-8 p-0"
          onClick={() => {
            doRestoreTransaction.mutate(props.deletedTransaction.id);
          }}
        >
          <ResetIcon className="h-4 w-4" />
        </ResponsiveButton>
      </div>
    </Card>
  );
};

export default DeletedTransactionCard;
