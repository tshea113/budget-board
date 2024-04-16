import { Card } from '@/components/ui/card';
import { getCategoryLabel } from '@/lib/transactions';

interface UnbudgetCardProps {
  name: string;
  amount: string;
}

const UnbudgetCard = (props: UnbudgetCardProps): JSX.Element => {
  return (
    <Card className="flex w-full flex-row px-3 py-1">
      <div className="w-1/2 scroll-m-20 justify-self-start text-lg font-semibold tracking-tight">
        {props.name === 'null' ? 'Uncategorized' : getCategoryLabel(props.name) ?? props.name}
      </div>
      <div className="w-1/2">
        <div className="w-1/3 scroll-m-20 justify-self-start text-center text-lg font-semibold tracking-tight">
          ${props.amount}
        </div>
      </div>
    </Card>
  );
};

export default UnbudgetCard;
