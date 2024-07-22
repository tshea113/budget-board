import CategoryInput from '@/components/category-input';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/lib/transactions';
import { Transaction } from '@/types/transaction';

interface TransactionCardProps {
  transaction: Transaction;
}

const TransactionCard = (props: TransactionCardProps): JSX.Element => {
  return (
    <Card className="my-2">
      <div className="my-1 flex flex-col space-y-2 px-2 sm:grid sm:grid-cols-10 sm:grid-rows-1 sm:items-center sm:space-y-0">
        <span className="col-span-2 sm:col-span-1">
          {formatDate(props.transaction.date)}
        </span>
        <span className="sm:col-span-5">{props.transaction.merchantName}</span>
        <span className="sm:col-span-3">
          <CategoryInput
            initialValue={props.transaction.category ?? ''}
            onSelectChange={function (): void {
              throw new Error('Function not implemented.');
            }}
          />
        </span>
        <span className="sm:col-span-1">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(props.transaction.amount)}
        </span>
      </div>
    </Card>
  );
};

export default TransactionCard;
