import { AuthContext } from '@/components/auth-provider';
import ResponsiveButton from '@/components/responsive-button';
import { Card } from '@/components/ui/card';
import { translateAxiosError } from '@/lib/requests';
import { getDaysSinceDate } from '@/lib/utils';
import { ITransaction } from '@/types/transaction';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type AxiosError } from 'axios';
import { Undo2Icon } from 'lucide-react';
import React, { type JSX } from 'react';
import { toast } from 'sonner';

interface DeletedTransactionCardProps {
  deletedTransaction: ITransaction;
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
    <Card key={props.deletedTransaction.id} className="flex flex-row">
      <div className="flex grow flex-col gap-2 p-1">
        <span className="text-sm">{props.deletedTransaction.merchantName}</span>
        <span className="text-muted-foreground text-xs">
          {getDaysSinceDate(props.deletedTransaction.deleted!) + ' days since deleted'}
        </span>
      </div>
      <div className="">
        <ResponsiveButton
          loading={doRestoreTransaction.isPending}
          className="h-full w-8 p-0"
          onClick={() => {
            doRestoreTransaction.mutate(props.deletedTransaction.id);
          }}
        >
          <Undo2Icon className="h-4 w-4" />
        </ResponsiveButton>
      </div>
    </Card>
  );
};

export default DeletedTransactionCard;
