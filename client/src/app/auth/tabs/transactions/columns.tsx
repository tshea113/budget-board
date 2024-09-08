import { type ColumnDef } from '@tanstack/react-table';
import { type Transaction } from '@/types/transaction';
import DataTableHeader from '@/components/data-table-header';
import LoadingCell from './cells/loading-cell';
import EditableDateCell from './cells/editable-date-cell';
import EditableCategoryCell from './cells/editable-category-cell';
import EditableMerchantCell from './cells/editable-text-cell';
import EditableCurrencyCell from './cells/editable-currency-cell';
import TransactionsConfiguration from './transactions-configuration/transactions-configuration';

const columns: Array<ColumnDef<Transaction>> = [
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return <DataTableHeader column={column} label={'Date'} />;
    },
    cell: (props) => (
      <EditableDateCell
        isSelected={props.row.getIsSelected()}
        isError={props.table.options.meta?.isError ?? false}
        transaction={props.row.original}
        editCell={props.table.options.meta?.updateTransaction ?? (() => {})}
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
        isSelected={props.row.getIsSelected()}
        isError={props.table.options.meta?.isError ?? false}
        editCell={props.table.options.meta?.updateTransaction ?? (() => {})}
        transaction={props.row.original}
      />
    ),
  },
  {
    id: 'category',
    accessorFn: (row: Transaction) => {
      if (row?.category === null && row?.subcategory === null) {
        return '';
      } else if (row.subcategory && row.subcategory.length > 0) {
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
        isSelected={props.row.getIsSelected()}
        isError={props.table.options.meta?.isError ?? false}
        editCell={props.table.options.meta?.updateTransaction ?? (() => {})}
        transaction={props.row.original}
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
        isSelected={props.row.getIsSelected()}
        isError={props.table.options.meta?.isError ?? false}
        editCell={props.table.options.meta?.updateTransaction ?? (() => {})}
        transaction={props.row.original}
      />
    ),
  },
  {
    id: 'loading',
    header: (props) => {
      return (
        <TransactionsConfiguration
          transactions={props.table.options.meta?.deletedTransactions ?? []}
        />
      );
    },
    cell: (props) => (
      <LoadingCell
        isPending={props.row.original.id === props.table.options.meta?.isPendingRow}
        isSelected={props.row.getIsSelected()}
        transactionId={props.row.original.id}
        deleteTransaction={props.table.options.meta?.deleteTransaction}
      />
    ),
  },
];

export { columns };
