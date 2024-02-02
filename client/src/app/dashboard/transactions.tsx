import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTransactions } from '@/lib/transactions';
import { useQuery } from '@tanstack/react-query';
import AddTransaction from './add-transaction';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import EmailVerified from './email-verified';
import DataTable from './transactions/data-table';
import { columns } from './transactions/columns';
import { type Transaction } from '@/types/transaction';

const Transactions = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await getTransactions();
      return response;
    },
  });

  // TODO: Make this not ugly
  if (isPending) {
    return <span>Loading...</span>;
  }

  // TODO: This should probably just be an error alert
  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const toggle = (): void => {
    setIsOpen((isOpen) => !isOpen);
  };

  return (
    <div>
      <EmailVerified />
      <Card className="">
        <CardHeader className="grid w-screen grid-cols-2">
          <CardTitle className="justify-self-start">Transactions</CardTitle>
          <div className="justify-self-end">
            <Button onClick={toggle}>Add Transaction</Button>
          </div>
        </CardHeader>
        {isOpen && <AddTransaction />}
        <CardContent>
          <DataTable
            columns={columns}
            data={data.data.sort((a: Transaction, b: Transaction) => {
              // Sort the data by date in decending order
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            })}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
