import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { type Transaction } from '@/types/transaction';
import DeletedTransactionCard from './deleted-transaction-card';

interface DeletedTransactionsAccordionProps {
  deletedTransactions: Transaction[];
}

const DeletedTransactionsAccordion = (
  props: DeletedTransactionsAccordionProps
): JSX.Element => {
  return (
    <div className="px-3">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="deleted-account"
      >
        <AccordionItem value="deleted-account">
          <AccordionTrigger>
            <span>Deleted Transactions</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-2">
            {props.deletedTransactions.length !== 0 ? (
              props.deletedTransactions.map((deletedTransaction: Transaction) => (
                <DeletedTransactionCard
                  key={deletedTransaction.id}
                  deletedTransaction={deletedTransaction}
                />
              ))
            ) : (
              <span>No deleted transactions.</span>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default DeletedTransactionsAccordion;
