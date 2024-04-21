import { type Account } from '@/types/account';
import AccountGroup from './account-group';

interface AccountItemsProps {
  accounts: Account[];
}

interface GroupedAccounts {
  institution: string;
  accounts: Account[];
}

const getGroupedAccounts = (accounts: Account[]): GroupedAccounts[] => {
  return accounts.reduce((result: GroupedAccounts[], item: Account) => {
    const groupIndex: number = result.findIndex((r) => r.institution === item.institution);

    if (groupIndex === -1) {
      const newGroup: GroupedAccounts = {
        institution: item.institution,
        accounts: [item],
      };
      result.push(newGroup);
    } else {
      const foundGroup: GroupedAccounts = result[groupIndex];
      foundGroup.accounts.push(item);
      result[groupIndex] = foundGroup;
    }
    return result;
  }, []);
};

const AccountItems = (props: AccountItemsProps): JSX.Element => {
  return (
    <div className="space-y-4">
      {getGroupedAccounts(props.accounts).map((a) => (
        <AccountGroup key={a.institution} institution={a.institution} accounts={a.accounts} />
      ))}
    </div>
  );
};

export default AccountItems;
