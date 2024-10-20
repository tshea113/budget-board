import { type Account } from '@/types/account';
import AccountItem from './account-item';
import { Card } from '@/components/ui/card';

interface AccountGroupProps {
  institution: string;
  accounts: Account[];
}

const AccountGroup = (props: AccountGroupProps): JSX.Element => {
  return (
    <div className="space-y-2">
      <Card className="bg-card-accent text-card-accent-foreground px-1">
        <span className="text-lg font-semibold tracking-tight">{props.institution}</span>
      </Card>
      <div className="space-y-1">
        {props.accounts.map((a) => (
          <AccountItem key={a.id} account={a} />
        ))}
      </div>
    </div>
  );
};

export default AccountGroup;
