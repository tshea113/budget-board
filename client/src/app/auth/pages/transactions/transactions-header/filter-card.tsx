import { Card } from '@/components/ui/card';

interface FilterCardProps {
  isOpen: boolean;
}

const FilterCard = (props: FilterCardProps): JSX.Element => {
  if (!props.isOpen) {
    return <></>;
  }

  return <Card>test</Card>;
};

export default FilterCard;
