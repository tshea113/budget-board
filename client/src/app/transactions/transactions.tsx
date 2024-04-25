import EmailVerified from '../dashboard/email-verified';
import DataTable from './data-table';
import { columns } from './columns';
import { type Transaction } from '@/types/transaction';
import { Skeleton } from '@/components/ui/skeleton';
import { useTransactionsQuery } from '@/lib/query';

const Transactions = (): JSX.Element => {
  const transactionsQuery = useTransactionsQuery();

  if (transactionsQuery.isPending) {
    return <Skeleton className="h-[550px] w-screen rounded-xl" />;
  }

  return (
    <div className="flex w-screen flex-col items-center">
      <EmailVerified />
      <div className="w-full 2xl:max-w-screen-2xl">
        <DataTable
          columns={columns}
          data={transactionsQuery.data?.data.sort((a: Transaction, b: Transaction) => {
            // Sort the data by date in decending order
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          })}
        />
      </div>
    </div>
  );
};

export default Transactions;
