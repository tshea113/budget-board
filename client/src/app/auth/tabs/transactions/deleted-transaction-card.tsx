import { AuthContext } from '@/components/auth-provider';
import ResponsiveButton from '@/components/responsive-button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { translateAxiosError } from '@/lib/request';
import { restoreTransaction } from '@/lib/transactions';
import { getDaysSinceDeleted } from '@/lib/utils';
import { type Transaction } from '@/types/transaction';
import { ResetIcon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type AxiosError } from 'axios';
import React from 'react';

interface DeletedTransactionCardProps {
  deletedTransaction: Transaction;
}

const DeletedTransactionCard = (props: DeletedTransactionCardProps): JSX.Element => {
  const { accessToken } = React.useContext<any>(AuthContext);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const doRestoreTransaction = useMutation({
    mutationFn: async (id: string) => {
      return await restoreTransaction(accessToken, id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['transactions'] });
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
    <Card key={props.deletedTransaction.id} className="flex flex-row items-center p-2">
      <span className="w-1/3">{props.deletedTransaction.merchantName}</span>
      <span className="w-1/3">
        {getDaysSinceDeleted(props.deletedTransaction.deleted) + ' days since deleted'}
      </span>
      <div className="w-1/3">
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
