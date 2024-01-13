import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, getTransactions } from "@/lib/transactions";
import { useQuery } from "@tanstack/react-query";
import AddTransaction from "./add-transaction";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type Transaction = {
  id: string,
  date: string,
  merchantName: string,
  category: string,
  amount: string
}

const Transactions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await getTransactions();
      return response;
    }
  });

  if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  const toggle = () => {
    setIsOpen((isOpen) => !isOpen);
  }

  return (
    <Card className="">
      <CardHeader className="grid w-screen grid-cols-2">
        <CardTitle className="justify-self-start">
          Transactions
        </CardTitle>
        <div className="justify-self-end">
          <Button onClick={toggle}>
            Add Transaction
          </Button>
        </div>
      </CardHeader>
      {isOpen && <AddTransaction />}
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Merchant</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.map((transaction: Transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{formatDate(transaction.date)}</TableCell>
                <TableCell>{transaction.merchantName}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default Transactions;