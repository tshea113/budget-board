import AccountItem from './account-item';
import { Card } from '@/components/ui/card';
import { filterVisibleAccounts } from '@/lib/accounts';
import { Account } from '@/types/account';
import { Institution } from '@/types/institution';

interface InstitutionItemProps {
  institution: Institution;
  accounts: Account[];
}

const InstitutionItem = (props: InstitutionItemProps): JSX.Element => {
  const sortedFilteredAccounts = filterVisibleAccounts(props.accounts).sort(
    (a, b) => a.index - b.index
  );

  return (
    <div className="flex flex-col gap-2">
      <Card className="rounded-none bg-muted px-1">
        <span className="text-lg font-semibold tracking-tight">
          {props.institution.name}
        </span>
      </Card>
      <div className="flex flex-col gap-1">
        {sortedFilteredAccounts.map((account: Account) => (
          <AccountItem key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
};

export default InstitutionItem;
