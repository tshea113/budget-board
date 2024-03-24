import { type Account } from '@/types/account';
import { type ColumnDef } from '@tanstack/react-table';
import AccountNameCell from './account-name-cell';
import LoadingCell from '../../../components/loading-cell';

export const columns: Array<ColumnDef<Account>> = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: AccountNameCell,
  },
  {
    id: 'loading',
    // header: AddTransactionButton,
    cell: LoadingCell,
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
