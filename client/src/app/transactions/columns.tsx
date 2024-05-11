import { type ColumnDef } from '@tanstack/react-table';
import { type Transaction } from '@/types/transaction';
import DataTableHeader from '@/components/data-table-header';
import LoadingCell from '../../components/loading-cell';
import EditableDateCell from './cells/editable-date-cell';
import EditableCategoryCell from './cells/editable-category-cell';
import EditableMerchantCell from './cells/editable-text-cell';
import EditableCurrencyCell from './cells/editable-currency-cell';

const columns: Array<ColumnDef<Transaction>> = [
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return <DataTableHeader column={column} label={'Date'} />;
    },
    cell: (props) => (
      <EditableDateCell
        date={new Date(props.getValue() as Date)}
        isSelected={props.row.getIsSelected()}
        isError={props.table.options.meta?.isError ?? false}
        rowTransaction={props.row.original}
        editCell={props.table.options.meta?.updateTransaction}
      />
    ),
  },
  {
    accessorKey: 'merchantName',
    header: ({ column }) => {
      return <DataTableHeader column={column} label={'Merchant'} />;
    },
    cell: (props) => (
      <EditableMerchantCell
        merchant={props.getValue() as string}
        isSelected={props.row.getIsSelected()}
        isError={props.table.options.meta?.isError ?? false}
        editCell={props.table.options.meta?.updateTransaction}
        rowTransaction={props.row.original}
      />
    ),
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
    cell: (props) => (
      <EditableCategoryCell
        category={props.getValue() as string}
        isSelected={props.row.getIsSelected()}
        isError={props.table.options.meta?.isError ?? false}
        editCell={props.table.options.meta?.updateTransaction}
        rowTransaction={props.row.original}
      />
    ),
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      return <DataTableHeader column={column} label={'Amount'} />;
    },
    cell: (props) => (
      <EditableCurrencyCell
        currency={props.getValue() as number}
        isSelected={props.row.getIsSelected()}
        isError={props.table.options.meta?.isError ?? false}
        editCell={props.table.options.meta?.updateTransaction}
        rowTransaction={props.row.original}
      />
    ),
  },
  {
    id: 'loading',
    size: 10,
    cell: (props) => (
      <LoadingCell
        isPending={props.table.options.meta?.isPending ?? false}
        isSelected={props.row.original.id === props.table.options.meta?.isPendingRow}
      />
    ),
  },
];

export { columns };
