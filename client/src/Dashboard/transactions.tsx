import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Transactions = () => {

  const transactions = [
    {
      id: "1",
      date: "9-11-2001",
      merchant: "osamart",
      category: "hobby",
      amount: "$69.69"
    },
    {
      id: "2",
      date: "9-11-2001",
      merchant: "osamart",
      category: "hobby",
      amount: "$69.69"
    },
    {
      id: "3",
      date: "9-11-2001",
      merchant: "osamart",
      category: "hobby",
      amount: "$69.69"
    },
    {
      id: "4",
      date: "9-11-2001",
      merchant: "osamart",
      category: "hobby",
      amount: "$69.69"
    },
    {
      id: "5",
      date: "9-11-2001",
      merchant: "osamart",
      category: "hobby",
      amount: "$69.69"
    }
  ]

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>
          Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableHead>Date</TableHead>
            <TableHead>Merchant</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction: any) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.merchant}</TableCell>
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