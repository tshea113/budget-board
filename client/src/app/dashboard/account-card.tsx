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
import { groupOptions } from '@/lib/accounts';
import { Type, type Account, SubType } from '@/types/account';
import { useQuery } from '@tanstack/react-query';

const AccountCard = ({ toggleAddAccount }: { toggleAddAccount: () => void }): JSX.Element => {
  const { isPending, isError, data, error } = useQuery(groupOptions());

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <Card className="w-[350px]">
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
                <TableCell>{Type[account.type]}</TableCell>
                <TableCell>{SubType[account.subtype]}</TableCell>
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
