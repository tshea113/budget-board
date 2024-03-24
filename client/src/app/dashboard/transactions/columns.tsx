import { type RowData, type ColumnDef } from '@tanstack/react-table';
import { type Transaction } from '@/types/transaction';
import DataTableHeader from '@/components/data-table-header';
import EditableCell from './editable-cell';
import LoadingCell from '../../../components/loading-cell';
// import AddTransactionButton from './add-transaction-button';

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
    id: 'category',
    accessorFn: (row: Transaction) => {
      if (row?.category === null && row?.subcategory === null) {
        return '';
      } else if (row.subcategory.length !== 0) {
        return row.subcategory;
      } else {
        return row.category;
      }
    },
    header: ({ column }) => {
      return <DataTableHeader column={column} label={'Category'} />;
    },
    cell: EditableCell,
    meta: {
      type: 'category',
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
    // header: AddTransactionButton,
    cell: LoadingCell,
  },
];

export { columns };
