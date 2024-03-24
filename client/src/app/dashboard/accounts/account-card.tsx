import SkeletonCard from '@/app/dashboard/skeleton-account-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAccounts } from '@/lib/accounts';
import { useQuery } from '@tanstack/react-query';
import AccountTable from './account-table';
import { columns } from './account-columns';

const AccountCard = ({ toggleAddAccount }: { toggleAddAccount: () => void }): JSX.Element => {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await getAccounts();
      return response;
    },
  });

  if (isPending) {
    return <SkeletonCard />;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Accounts</CardTitle>
      </CardHeader>
      <CardContent>
        <AccountTable columns={columns} data={data.data} />
        <Button onClick={toggleAddAccount}>Add Account</Button>
      </CardContent>
    </Card>
  );
};

export default AccountCard;
