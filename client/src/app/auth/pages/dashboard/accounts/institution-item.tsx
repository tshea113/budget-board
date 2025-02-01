import AccountItem from './account-item';
import { Card } from '@/components/ui/card';
import { filterVisibleAccounts } from '@/lib/accounts';
import { IAccount } from '@/types/account';
import { IInstitution } from '@/types/institution';

interface InstitutionItemProps {
  institution: IInstitution;
  accounts: IAccount[];
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
        {sortedFilteredAccounts.map((account: IAccount) => (
          <AccountItem key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
};

export default InstitutionItem;
