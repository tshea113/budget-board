import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { type Transaction } from '@/types/transaction';
import { ScrollArea } from '@/components/ui/scroll-area';
import DeletedTransactionsAccordion from './deleted-transactions-accordion';
import AddCategoryAccordion from './custom-categories/custom-category-accordion';
import { SettingsIcon } from 'lucide-react';
import { getDeletedTransactions } from '@/lib/transactions';

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
          <Button variant="outline" className="h-9 w-9 p-0">
            <SettingsIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetTitle hidden />
        <SheetContent className="w-[400px] sm:max-w-[400px]" side="right">
          <ScrollArea className="h-full" type="auto">
            <SheetHeader>Transactions Configuration</SheetHeader>
            <AddCategoryAccordion />
            <DeletedTransactionsAccordion
              deletedTransactions={getDeletedTransactions(props.transactions)}
            />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TransactionsConfiguration;
