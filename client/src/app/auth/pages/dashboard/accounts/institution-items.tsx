import { IAccount } from '@/types/account';
import InstitutionItem from './institution-item';
import { IInstitution } from '@/types/institution';

interface InstitutionItemsProps {
  institutions: IInstitution[];
  accounts: IAccount[];
}

const InstitutionItems = (props: InstitutionItemsProps): JSX.Element => {
  return (
    <div className="flex flex-col gap-4">
      {props.institutions.map((institution: IInstitution) => (
        <InstitutionItem
          key={institution.id}
          institution={institution}
          accounts={props.accounts.filter((a) => a.institutionID === institution.id)}
        />
      ))}
    </div>
  );
};

export default InstitutionItems;
