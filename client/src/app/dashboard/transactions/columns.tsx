import { type RowData, type ColumnDef } from '@tanstack/react-table';
import { Category, SubCategory, type Transaction } from '@/types/transaction';
import DataTableHeader from '@/components/data-table-header';
import EditableCell from './editable-cell';
import LoadingCell from './loading-cell';
import AddTransactionButton from './add-transaction-button';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface ColumnMeta<TData extends RowData, TValue> {
    type?: string;
    options?: string[] | string[][] | undefined;
    currency?: string;
  }
}

const columns: Array<ColumnDef<Transaction>> = [
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return <DataTableHeader column={column} label={'Date'} />;
    },
    cell: EditableCell,
    meta: {
      type: 'date',
    },
  },
  {
    accessorKey: 'merchantName',
    header: ({ column }) => {
      return <DataTableHeader column={column} label={'Merchant'} />;
    },
    cell: EditableCell,
    meta: {
      type: 'text',
    },
  },
  {
    accessorKey: 'category',
    header: ({ column }) => {
      return <DataTableHeader column={column} label={'Category'} />;
    },
    cell: EditableCell,
    meta: {
      type: 'select',
      options: Category,
    },
  },
  {
    accessorKey: 'subcategory',
    header: ({ column }) => {
      return <DataTableHeader column={column} label={'Subcategory'} />;
    },
    cell: EditableCell,
    meta: {
      type: 'select',
      options: SubCategory,
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      return <DataTableHeader column={column} label={'Amount'} />;
    },
    cell: EditableCell,
    meta: {
      type: 'number',
      currency: 'USD',
    },
  },
  {
    id: 'loading',
    header: AddTransactionButton,
    cell: LoadingCell,
  },
];

export { columns };
