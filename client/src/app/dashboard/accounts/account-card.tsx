import SkeletonCard from '@/app/dashboard/skeleton-account-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAccounts } from '@/lib/accounts';
import { useQuery } from '@tanstack/react-query';
import AccountTable from './account-table';
import { columns } from './account-columns';
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const AccountCard = (): JSX.Element => {
  const [accountError, setAccountError] = React.useState<string>('');
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await getAccounts();
      return response;
    },
  });

  const translateError = (error: string): string => {
    if (error === 'Network Error') {
      return 'There was an error connecting to the server. Please try again later.';
    } else {
      return 'An unknown error occurred. Please try again later.';
    }
  };

  if (isPending) {
    return <SkeletonCard />;
  }

  if (isError) {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center">
          <CardTitle>Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{translateError(error.message)}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center">
        <CardTitle>Accounts</CardTitle>
        <div className="flex-grow" />
        {/* TODO: Create a better add account interface, then re-enable button */}
        {/* <AddButton>
          <div />
        </AddButton> */}
      </CardHeader>
      <CardContent>
        {accountError.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{translateError(accountError)}</AlertDescription>
          </Alert>
        )}
        <AccountTable columns={columns} data={data.data} setError={setAccountError} />
      </CardContent>
    </Card>
  );
};

export default AccountCard;
