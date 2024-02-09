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
import request from '@/lib/request';

interface DataTableProps<TData, TValue> {
  columns: Array<ColumnDef<TData, TValue>>;
  data: TData[];
  setError: (error: string) => void;
}

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface TableMeta<TData> {
    updateData: (rowIndex: number, columnId: string, value: string) => void;
    revertData: (rowIndex: number, revert: boolean) => void;
    setErrorInner: (newError: string) => void;
  }
}

// TODO: Rows sort when data is edited. Need to pause sorting while edit is active.

const DataTable = <TData, TValue>({
  columns,
  data,
  setError,
}: DataTableProps<TData, TValue>): JSX.Element => {
  const [tableData, setTableData] = React.useState<TData[]>(data);
  const [originalData, setOriginalData] = React.useState<TData[]>(data);
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: 'date',
      desc: true,
    },
  ]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const queryClient = useQueryClient();
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
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    autoResetPageIndex: false,
    onSortingChange: setSorting,
    enableRowSelection: true,
    enableMultiRowSelection: false,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
    meta: {
      updateData: (rowIndex: number, columnId: string, value: string) => {
        let newRow: TData | undefined;
        setTableData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              newRow = {
                ...old[rowIndex],
                [columnId]: value,
              };
              return newRow;
            }
            return row;
          })
        );
        if (newRow) {
          mutation.mutate(newRow as unknown as Transaction);
        }
      },
      revertData: (rowIndex: number, revert: boolean) => {
        if (revert) {
          setTableData((old) =>
            old.map((row, index) => (index === rowIndex ? originalData[rowIndex] : row))
          );
        } else {
          setOriginalData((old) =>
            old.map((row, index) => (index === rowIndex ? data[rowIndex] : row))
          );
        }
      },
      setErrorInner: (newError: string) => {
        setError(newError);
      },
    },
  });

  return (
    <div>
      <div className="rounded-md border">
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
                    row.toggleSelected(true);
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
                <TableCell colSpan={columns.length} className="h-24 text-center">
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

export default DataTable;
