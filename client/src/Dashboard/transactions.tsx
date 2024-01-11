import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHead, TableHeader } from "@/components/ui/table";

const Transactions = () => {

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
        </Table>
      </CardContent>
    </Card>
  )
}

export default Transactions;