import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTransactions } from '@/lib/transactions';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import EmailVerified from '../email-verified';
import DataTable from './data-table';
import { columns } from './columns';
import { type Transaction } from '@/types/transaction';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import SkeletonTranasctionTable from './skeleton-transaction-table';

const Transactions = (): JSX.Element => {
  const [transactionError, setTransactionError] = useState<string>('');
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await getTransactions();
      return response;
    },
  });

  if (isPending) {
    return <SkeletonTranasctionTable />;
  }

  // TODO: This should probably just be an error alert
  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const translateError = (error: string): string => {
    if (error === 'Network Error') {
      return 'There was an error connecting to the server. Your data was not updated.';
    } else {
      return 'An unknown error occurred. Please try again later.';
    }
  };

  return (
    <div>
      <EmailVerified />
      <Card className="">
        <CardHeader className="grid w-screen grid-cols-2">
          <CardTitle className="justify-self-start">Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactionError.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{translateError(transactionError)}</AlertDescription>
            </Alert>
          )}
          <DataTable
            columns={columns}
            data={data.data.sort((a: Transaction, b: Transaction) => {
              // Sort the data by date in decending order
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            })}
            setError={setTransactionError}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
