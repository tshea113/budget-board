import ResponsiveButton from '@/components/responsive-button';
import { Button } from '@/components/ui/button';
import request from '@/lib/request';
import { type Transaction } from '@/types/transaction';
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type Table, type Row } from '@tanstack/react-table';

interface SubmitCellProps<TData> {
  row: Row<TData>;
  table: Table<TData>;
}

const SubmitCell = <TData,>({ row, table }: SubmitCellProps<TData>): JSX.Element => {
  const queryClient = useQueryClient();

  const tableMeta = table.options.meta;

  const mutation = useMutation({
    mutationFn: async (newTransaction: Transaction) => {
      return await request({
        url: '/api/transaction',
        method: 'PUT',
        data: newTransaction,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['transactions'] });
      row.toggleSelected(false);
    },
    onError: (error: Error) => {
      tableMeta?.setErrorInner(error.message);
    },
  });

  const submitChanges = (): void => {
    mutation.mutate(row.original as Transaction);
  };

  const cancelChanges = (): void => {
    table.options.meta?.revertData(row.index, true);
    row.toggleSelected(false);
  };

  if (row.getIsSelected()) {
    return (
      <div className="flex space-x-1">
        <Button onClick={cancelChanges}>
          <Cross2Icon className="h-5 w-5" />
        </Button>
        <ResponsiveButton loading={mutation.isPending} onClick={submitChanges}>
          <CheckIcon className="h-5 w-5" />
        </ResponsiveButton>
      </div>
    );
  } else {
    return <></>;
  }
};

export default SubmitCell;
