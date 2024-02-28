import ResponsiveButton from '@/components/responsive-button';
import request from '@/lib/request';
import { type Transaction } from '@/types/transaction';
import { TrashIcon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type Table, type Row } from '@tanstack/react-table';

interface DeleteTransactionButtonProps<TData> {
  row: Row<TData>;
  table: Table<TData>;
}

const DeleteTransactionButton = <TData,>({
  row,
  table,
}: DeleteTransactionButtonProps<TData>): JSX.Element => {
  const tableMeta = table.options.meta;

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async (transactionGuid: string) => {
      return await request({
        url: `/api/transaction/${transactionGuid}`,
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['transactions'] });
      tableMeta?.deleteRow(row.index);
    },
    onError: (error: Error) => {
      tableMeta?.setErrorInner(error.message);
    },
  });
  const deleteTransaction = (): void => {
    const rowId: string = (row.original as Transaction).id;
    mutate(rowId);
  };
  return (
    <ResponsiveButton loading={isPending} onClick={deleteTransaction}>
      <TrashIcon />
    </ResponsiveButton>
  );
};

export default DeleteTransactionButton;
