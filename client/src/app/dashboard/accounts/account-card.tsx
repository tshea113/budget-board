import SkeletonCard from '@/app/dashboard/skeleton-account-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAccounts } from '@/lib/accounts';
import { useQuery } from '@tanstack/react-query';
import AccountTable from './account-table';
import { columns } from './account-columns';
import AddButton from '../../../components/add-button';

const AccountCard = (): JSX.Element => {
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
      <CardHeader className="flex flex-row items-center">
        <CardTitle>Accounts</CardTitle>
        <div className="flex-grow" />
        {/* TODO: Create a better add account interface */}
        <AddButton>
          <div />
        </AddButton>
      </CardHeader>
      <CardContent>
        <AccountTable columns={columns} data={data.data} />
      </CardContent>
    </Card>
  );
};

export default AccountCard;
