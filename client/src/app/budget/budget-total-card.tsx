import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import BudgetTotal from './budget-total';
import { type Budget } from '@/types/budget';
import { BudgetGroup, parseBudgetGroups } from '@/lib/budgets';
import { type Transaction } from '@/types/transaction';

interface BudgetTotalCardProps {
  budgetData: Budget[];
  transactionData: Transaction[];
}

const BudgetTotalCard = (props: BudgetTotalCardProps): JSX.Element => {
  const getBudgetTotal = (budgetData: Budget[]): number => {
    return budgetData.reduce((n, { limit }) => n + limit, 0);
  };

  const getTransactionTotal = (transactionData: Transaction[]): number => {
    return transactionData.reduce((n, { amount }) => n + amount, 0);
  };

  return (
    <Card className="space-y-2 p-2">
      <div className="text-xl font-semibold tracking-tight">Your Budget</div>
      <Separator className="my-2" />
      <BudgetTotal
        label={'Income'}
        amount={getTransactionTotal(props.transactionData)}
        total={getBudgetTotal(parseBudgetGroups(props.budgetData, BudgetGroup.Income))}
      />
      <BudgetTotal
        label={'Spending'}
        amount={getTransactionTotal(props.transactionData)}
        total={getBudgetTotal(parseBudgetGroups(props.budgetData, BudgetGroup.Spending))}
      />
      <Separator className="my-2" />
      <BudgetTotal label={'Left Over'} amount={456} total={2000} />
    </Card>
  );
};

export default BudgetTotalCard;
