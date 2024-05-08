import ResponsiveButton from '@/components/responsive-button';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { translateAxiosError } from '@/lib/request';
import { editTransaction } from '@/lib/transactions';
import { type Transaction } from '@/types/transaction';
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type Table, type Row } from '@tanstack/react-table';
import { type AxiosError } from 'axios';

interface SubmitCellProps<TData> {
  row: Row<TData>;
  table: Table<TData>;
}

const SubmitCell = <TData,>({ row, table }: SubmitCellProps<TData>): JSX.Element => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (newTransaction: Transaction) => {
      return await editTransaction(newTransaction);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['transactions'] });
      row.toggleSelected(false);
    },
    onError: (error: AxiosError) => {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: translateAxiosError(error),
      });
    },
  });

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
        <ResponsiveButton loading={mutation.isPending}>
          <CheckIcon className="h-5 w-5" />
        </ResponsiveButton>
      </div>
    );
  } else {
    return <></>;
  }
};

export default SubmitCell;
