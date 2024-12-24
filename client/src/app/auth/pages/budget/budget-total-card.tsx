import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import BudgetTotal from './budget-total';
import { type BudgetResponse } from '@/types/budget';
import { BudgetGroup, getBudgetsForGroup, sumBudgetAmounts } from '@/lib/budgets';
import { type Transaction } from '@/types/transaction';
import { areStringsEqual } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { sumTransactionAmounts } from '@/lib/transactions';

interface BudgetTotalCardProps {
  budgetData: BudgetResponse[];
  transactionData: Transaction[];
  isPending: boolean;
}

const BudgetTotalCard = (props: BudgetTotalCardProps): JSX.Element => {
  if (props.isPending) {
    return (
      <Card>
        <div className="m-3 flex flex-col space-y-3">
          <Skeleton className="h-10 max-w-[125px]" />
          <Skeleton className="h-[150px] rounded-xl" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="space-y-2 p-2">
      <div className="text-xl font-semibold tracking-tight">Your Budget</div>
      <Separator className="my-2" />
      <BudgetTotal
        label={'Income'}
        amount={sumTransactionAmounts(
          props.transactionData.filter((t) => areStringsEqual(t.category ?? '', 'Income'))
        )}
        total={sumBudgetAmounts(getBudgetsForGroup(props.budgetData, BudgetGroup.Income))}
        isIncome={true}
      />
      <BudgetTotal
        label={'Spending'}
        amount={sumTransactionAmounts(
          props.transactionData.filter(
            (t) => !areStringsEqual(t.category ?? '', 'Income')
          )
        )}
        total={sumBudgetAmounts(
          getBudgetsForGroup(props.budgetData, BudgetGroup.Spending)
        )}
        isIncome={false}
      />
      <Separator className="my-2" />
      <BudgetTotal
        label={'Remaining'}
        amount={sumTransactionAmounts(props.transactionData)}
        isIncome={true}
      />
    </Card>
  );
};

export default BudgetTotalCard;
