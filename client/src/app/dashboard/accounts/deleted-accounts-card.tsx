import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { type Account } from '@/types/account';

interface DeletedAccountsCardProps {
  deletedAccounts: Account[];
}

const DeletedAccountsCard = (props: DeletedAccountsCardProps): JSX.Element => {
  const getDaysUntilDeleted = (date: Date): string => {
    const differenceInMs = new Date().getTime() - new Date(date).getTime();

    const differenceInDays = Math.round(differenceInMs / (1000 * 3600 * 24));

    return (60 - differenceInDays).toString();
  };

  return (
    <div className="mx-2 px-3">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="deleted-account">
          <AccordionTrigger>
            <span>Deleted Accounts</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-2">
            <span>These accounts will be deleted after 60 days</span>
            {props.deletedAccounts.map((deletedAccount) => (
              <Card key={deletedAccount.id} className="flex flex-row space-x-4 p-2">
                <span>{deletedAccount.name}</span>
                <span>{getDaysUntilDeleted(deletedAccount.deleted) + ' days until deleted'}</span>
              </Card>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default DeletedAccountsCard;
