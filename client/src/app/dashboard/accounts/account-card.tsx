import SkeletonCard from '@/app/dashboard/skeleton-account-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAccounts } from '@/lib/accounts';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import AccountsConfiguration from './accounts-configuration';
import AccountItems from './account-items';
import { Separator } from '@/components/ui/separator';

const AccountCard = (): JSX.Element => {
  const [alert] = React.useState<string>('');

  const accountsQuery = useQuery({
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

  if (accountsQuery.isPending) {
    return <SkeletonCard />;
  }

  if (accountsQuery.isError) {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center">
          <CardTitle>Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{translateError(accountsQuery.error.message)}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <div className="flex flex-row items-center p-2">
        <span className="w-1/2 text-2xl font-semibold tracking-tight">Accounts</span>
        <div className="flex w-1/2 flex-row justify-end">
          <AccountsConfiguration />
          {/* TODO: Create a better add account interface, then re-enable button */}
          {/* <AddButton>
          <div />
        </AddButton> */}
        </div>
      </div>
      <Separator />
      <div className="p-2">
        {alert.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{translateError(alert)}</AlertDescription>
          </Alert>
        )}
        <AccountItems accounts={accountsQuery.data.data} />
      </div>
    </Card>
  );
};

export default AccountCard;
