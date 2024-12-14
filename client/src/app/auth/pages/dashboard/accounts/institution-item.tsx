import AccountItem from './account-item';
import { Card } from '@/components/ui/card';
import { filterVisibleAccounts } from '@/lib/accounts';
import { Account } from '@/types/account';
import { Institution } from '@/types/institution';

interface InstitutionItemProps {
  institution: Institution;
}

const InstitutionItem = (props: InstitutionItemProps): JSX.Element => {
  return (
    <div className="flex flex-col gap-2">
      <Card className="bg-card-accent px-1">
        <span className="text-lg font-semibold tracking-tight text-card-accent-foreground">
          {props.institution.name}
        </span>
      </Card>
      <div className="flex flex-col gap-1">
        {filterVisibleAccounts(props.institution.accounts).map((account: Account) => (
          <AccountItem key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
};

export default InstitutionItem;
