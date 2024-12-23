import ResponsiveButton from '@/components/responsive-button';
import { Card } from '@/components/ui/card';
import { getFormattedCategoryValue } from '@/lib/category';
import { convertNumberToCurrency } from '@/lib/utils';
import { transactionCategories } from '@/types/transaction';
import { PlusIcon } from 'lucide-react';

interface UnbudgetCardProps {
  name: string;
  amount: number;
}

const UnbudgetCard = (props: UnbudgetCardProps): JSX.Element => {
  return (
    <Card className="flex w-full flex-row justify-between px-3 py-1 @container">
      <span className="w-2/5 text-lg font-semibold tracking-tight md:w-1/2">
        {getFormattedCategoryValue(props.name, transactionCategories)}
      </span>
      <div className="flex w-3/5 flex-row items-center justify-between md:w-1/2">
        <span className="w-1/3 text-center text-base font-semibold tracking-tight @sm:text-lg">
          {convertNumberToCurrency(props.amount)}
        </span>
        <ResponsiveButton className="h-7 w-7 p-0" variant="outline" loading={false}>
          <PlusIcon className="h-4 w-4" />
        </ResponsiveButton>
      </div>
    </Card>
  );
};

export default UnbudgetCard;
