import SkeletonCard from '@/app/dashboard/skeleton-account-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getAccounts } from '@/lib/accounts';
import { type Account } from '@/types/account';
import { useQuery } from '@tanstack/react-query';

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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Subtype</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.map((account: Account) => (
              <TableRow key={account.id}>
                <TableCell>{account.name}</TableCell>
                <TableCell>{account.type}</TableCell>
                <TableCell>{account.subtype}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button onClick={toggleAddAccount}>Add Account</Button>
      </CardContent>
    </Card>
  );
};

export default AccountCard;
