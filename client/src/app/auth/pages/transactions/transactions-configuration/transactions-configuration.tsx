import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { type Transaction } from '@/types/transaction';
import { GearIcon } from '@radix-ui/react-icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import DeletedTransactionsAccordion from './deleted-transactions-accordion';

interface TransactionsConfigurationProps {
  className?: string;
  transactions: Transaction[];
}

const TransactionsConfiguration = (
  props: TransactionsConfigurationProps
): JSX.Element => {
  return (
    <div className={props.className ?? ''}>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <GearIcon className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetTitle hidden />
        <SheetContent side="top" className="h-full">
          <div className="flex h-full w-full flex-row justify-center">
            <div className="w-full space-y-3 2xl:max-w-screen-2xl">
              <ScrollArea className="h-full" type="auto">
                <SheetHeader>Transactions Configuration</SheetHeader>
                <DeletedTransactionsAccordion deletedTransactions={props.transactions} />
              </ScrollArea>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TransactionsConfiguration;
