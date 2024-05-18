import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { type Transaction } from '@/types/transaction';
import { GearIcon } from '@radix-ui/react-icons';
import DeletedTransactionsAccordion from './deleted-transactions-accordion';

interface TransactionsConfigurationProps {
  transactions: Transaction[];
}

const TransactionsConfiguration = (props: TransactionsConfigurationProps): JSX.Element => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <GearIcon className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>Transactions Configuration</SheetHeader>
        <DeletedTransactionsAccordion deletedTransactions={props.transactions} />
      </SheetContent>
    </Sheet>
  );
};

export default TransactionsConfiguration;
