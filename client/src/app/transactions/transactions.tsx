import EmailVerified from '../dashboard/email-verified';
import TransactionsDataTable from './transactions-data-table';
import { columns } from './columns';
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
        <TransactionsDataTable columns={columns} data={transactionsQuery.data?.data} />
      </div>
    </div>
  );
};

export default Transactions;
