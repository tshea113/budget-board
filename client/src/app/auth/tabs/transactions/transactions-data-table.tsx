/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import * as React from 'react';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type SortingState,
  getSortedRowModel,
  getPaginationRowModel,
  type RowSelectionState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import DataTablePagination from '@/components/data-table-pagination';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type Transaction } from '@/types/transaction';
import { translateAxiosError } from '@/lib/request';
import {
  deleteTransaction,
  editTransaction,
  filterInvisibleTransactions,
  filterVisibleTransactions,
} from '@/lib/transactions';
import { type AxiosError } from 'axios';
import { useToast } from '@/components/ui/use-toast';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface TableMeta<TData> {
    updateTransaction: (newTransaction: Transaction) => void;
    deleteTransaction: (id: string) => void;
    isPending: boolean;
    isPendingRow: string;
    isError: boolean;
    deletedTransactions: Transaction[];
  }
}

interface DataTableProps {
  columns: Array<ColumnDef<Transaction>>;
  data: Transaction[];
}

const TransactionsDataTable = (props: DataTableProps): JSX.Element => {
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: 'date',
      desc: true,
    },
  ]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [isPendingRow, setIsPendingRow] = React.useState('');

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const doEditTransaction = useMutation({
    mutationFn: async (newTransaction: Transaction) => {
      setIsPendingRow(table.getSelectedRowModel().rows.at(0)?.id ?? '');
      return await editTransaction(newTransaction);
    },
    onSuccess: async () => {
      setIsPendingRow('');
      await queryClient.refetchQueries({ queryKey: ['transactions'] });
    },
    onError: (error: AxiosError) => {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: translateAxiosError(error),
      });
    },
  });
  const doDeleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      setIsPendingRow(table.getSelectedRowModel().rows.at(0)?.id ?? '');
      return await deleteTransaction(id);
    },
    onSuccess: async () => {
      setIsPendingRow('');
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

  const table = useReactTable({
    data: filterVisibleTransactions(props.data),
    columns: props.columns,
    getRowId: (row: Transaction) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    autoResetPageIndex: false,
    onSortingChange: setSorting,
    enableRowSelection: true,
    enableMultiRowSelection: false,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: 25,
      },
    },
    state: {
      sorting,
      rowSelection,
    },
    meta: {
      isPending: doEditTransaction.isPending,
      isPendingRow,
      isError: doEditTransaction.isError,
      updateTransaction: (newTransaction: Transaction) => {
        doEditTransaction.mutate(newTransaction);
      },
      deleteTransaction: (id: string) => {
        doDeleteTransaction.mutate(id);
      },
      deletedTransactions: filterInvisibleTransactions(props.data),
    },
  });

  return (
    <div>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="selected">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => {
                    row.toggleSelected(!row.getIsSelected());
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={props.columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
};

export default TransactionsDataTable;
