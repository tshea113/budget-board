import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { type Account } from '@/types/account';
import DeletedAccountCard from './deleted-account-card';

interface DeletedAccountsCardsProps {
  deletedAccounts: Account[];
}

const DeletedAccountsCards = (props: DeletedAccountsCardsProps): JSX.Element => {
  return (
    <div className="mx-2 px-3">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="deleted-account">
          <AccordionTrigger>
            <span>Deleted Accounts</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-2">
            <span>Deleted accounts will not sync transactions</span>
            {props.deletedAccounts.map((deletedAccount) => (
              <DeletedAccountCard key={deletedAccount.id} deletedAccount={deletedAccount} />
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default DeletedAccountsCards;
