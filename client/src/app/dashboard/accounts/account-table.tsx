import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import request from '@/lib/request';
import { type Account } from '@/types/account';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  type ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
  type RowSelectionState,
} from '@tanstack/react-table';
import React from 'react';

interface AccountTableProps {
  columns: Array<ColumnDef<Account, unknown>>;
  data: Account[];
  setError: (error: string) => void;
}

const AccountTable = ({ data, columns, setError }: AccountTableProps): JSX.Element => {
  const [tableData, setTableData] = React.useState<Account[]>(data);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async (newAccount: Account) => {
      return await request({
        url: '/api/account',
        method: 'PUT',
        data: newAccount,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    enableMultiRowSelection: false,
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
    meta: {
      isPending,
      updateData: (rowIndex: number, columnId: string, value: string) => {
        let editRow: Account | undefined;
        setTableData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              editRow = {
                ...old[rowIndex],
                [columnId]: value,
              };
              return editRow;
            }
            return row;
          })
        );
        if (editRow != null) {
          const editAccount: Account = {
            id: editRow.id,
            name: editRow.name,
            institution: editRow.institution,
            type: editRow.type,
            subtype: editRow.subtype,
            currentBalance: editRow.currentBalance,
            source: editRow.source,
            userId: editRow.id,
            accountId: editRow.accountId,
          };
          mutate(editAccount);
        }
      },
      updateCategory: (_rowIndex, _columnId, _value) => {},
      revertData: () => {},
      setErrorInner: (newError: string) => {
        setError(newError);
      },
    },
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
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
          {table.getRowModel().rows?.length !== 0 ? (
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
  );
};

export default AccountTable;
