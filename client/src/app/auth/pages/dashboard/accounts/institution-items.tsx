import InstitutionItem from './institution-item';
import { Institution } from '@/types/institution';

interface InstitutionItemsProps {
  institutions: Institution[];
}

const InstitutionItems = (props: InstitutionItemsProps): JSX.Element => {
  return (
    <div className="flex flex-col gap-4">
      {props.institutions.map((institution: Institution) => (
        <InstitutionItem key={institution.id} institution={institution} />
      ))}
    </div>
  );
};

export default InstitutionItems;
