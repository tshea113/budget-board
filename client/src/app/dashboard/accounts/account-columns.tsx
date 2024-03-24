import { type Account } from '@/types/account';
import { type ColumnDef } from '@tanstack/react-table';

export const columns: Array<ColumnDef<Account>> = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'currentBalance',
    header: 'Current Balance',
    cell: ({ row }) => {
      const currentBalance = parseFloat(row.getValue('currentBalance'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD', // TODO: SimpleFin provides the currency. Eventually should read from there.
      }).format(currentBalance);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
];
