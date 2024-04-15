import { Card } from '@/components/ui/card';
import { getCategoryLabel } from '@/lib/transactions';

interface UnbudgetCardProps {
  name: string;
  amount: string;
}

const UnbudgetCard = (props: UnbudgetCardProps): JSX.Element => {
  return (
    <Card className="w-2/3">
      <div className="text-l scroll-m-20 justify-self-start font-semibold tracking-tight">
        {props.name === 'null' ? 'Uncategorized' : getCategoryLabel(props.name) ?? props.name}
      </div>
      {props.amount}
    </Card>
  );
};

export default UnbudgetCard;
