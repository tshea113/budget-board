import { Budget } from '@/types/budget';
import BudgetCards from './budget-cards';
import BudgetHeader from './budget-header';
import { Transaction } from '@/types/transaction';

interface BudgetCardsGroupProps {
  header: string;
  budgetData: Budget[];
  transactionsData: Transaction[];
  isPending: boolean;
}

const BudgetCardsGroup = (props: BudgetCardsGroupProps): JSX.Element => {
  return (
    <div className="items-center align-middle">
      <BudgetHeader>{props.header}</BudgetHeader>
      <BudgetCards
        budgetData={props.budgetData}
        transactionsData={props.transactionsData}
        isPending={props.isPending}
      />
    </div>
  );
};

export default BudgetCardsGroup;
