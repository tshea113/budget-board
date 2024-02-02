import { type ColumnDef } from '@tanstack/react-table';
import { type Transaction } from '@/types/transaction';
import { formatDate } from '@/lib/transactions';
import DataTableHeader from '@/components/data-table-header';

const columns: Array<ColumnDef<Transaction>> = [
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return <DataTableHeader column={column} label={'Date'} />;
    },
    cell: ({ row }) => {
      const date: Date = row.getValue('date');
      const formatted = formatDate(date);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'merchantName',
    header: ({ column }) => {
      return <DataTableHeader column={column} label={'Merchant'} />;
    },
  },
  {
    accessorKey: 'category',
    header: ({ column }) => {
      return <DataTableHeader column={column} label={'Category'} />;
    },
  },
  {
    accessorKey: 'subcategory',
    header: ({ column }) => {
      return <DataTableHeader column={column} label={'Subcategory'} />;
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      return <DataTableHeader column={column} label={'Amount'} />;
    },
    cell: ({ row }) => {
      const amount: number = row.getValue('amount');
      // TODO: Maybe one day I'll want this to be able to be other currencies
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return <div>{formatted}</div>;
    },
  },
];

export { columns };
