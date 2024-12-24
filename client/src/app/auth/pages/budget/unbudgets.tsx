import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Budget } from '@/types/budget';
import { Transaction, transactionCategories } from '@/types/transaction';
import UnbudgetCard from './unbudget-card';
import { Skeleton } from '@/components/ui/skeleton';
import { getParentCategory } from '@/lib/category';
import { areStringsEqual, convertNumberToCurrency } from '@/lib/utils';

interface Unbudget {
  category: string;
  amount: number;
}

const getUnbudgetedTransactions = (
  budgets: Budget[],
  transactions: Transaction[]
): Unbudget[] => {
  if (budgets == null || transactions == null) return [];

  // This creates an object that maps category/subcategory => array of amounts
  const groupedTransactions: [string, number[]][] = Object.entries(
    transactions.reduce((result: any, item: Transaction) => {
      (result[
        item.subcategory?.length !== 0
          ? (item.subcategory?.toLocaleLowerCase() ?? '')
          : (item.category?.toLocaleLowerCase() ?? '')
      ] =
        result[
          item.subcategory?.length !== 0
            ? (item.subcategory?.toLocaleLowerCase() ?? '')
            : (item.category?.toLocaleLowerCase() ?? '')
        ] || []).push(item.amount);
      return result;
    }, {})
  );

  const filteredGroupedTransactions = groupedTransactions.filter((t) => {
    return !budgets.some(({ category }) => {
      if (areStringsEqual(category, getParentCategory(category, transactionCategories))) {
        // The budget is for a parent category, so check if it is the transaction's parent category
        return areStringsEqual(category, getParentCategory(t[0], transactionCategories));
      } else {
        // The budget is a subcategory, so just check that it matches the transaction
        return areStringsEqual(category, t[0]);
      }
    });
  });

  const unbudgetedTransactions: Unbudget[] = [];
  filteredGroupedTransactions.forEach((element) => {
    unbudgetedTransactions.push({
      category: element[0],
      amount: element[1].reduce((a, b) => {
        return a + b;
      }),
    });
  });

  // Transfers can have two transactions that cancel each other out and result in
  // zero net cash flow. For this reason, filter out any net 0 transactions categories.
  // Also filtering very small transactions categories (less than $1) to reduce clutter.
  return unbudgetedTransactions.filter((u) => Math.abs(u.amount) > 1);
};

interface UnbudgetProps {
  transactions: Transaction[];
  budgets: Budget[];
  selectedDates: Date[];
  isPending: boolean;
}

const Unbudgets = (props: UnbudgetProps): JSX.Element => {
  if (props.isPending) {
    return (
      <div className="flex items-center justify-center">
        <Skeleton className="h-[62px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <div className="flex w-full flex-row pl-3 @container">
            <span className="w-2/5 text-left text-lg font-semibold tracking-tight md:w-1/2">
              Other
            </span>
            <div className="flex w-3/5 flex-row md:w-1/2">
              <span className="w-1/3 text-center text-lg font-semibold tracking-tight">
                {convertNumberToCurrency(
                  getUnbudgetedTransactions(props.budgets, props.transactions).reduce(
                    (a: number, b: Unbudget) => {
                      return a + b.amount;
                    },
                    0
                  )
                )}
              </span>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-1">
          {getUnbudgetedTransactions(props.budgets, props.transactions).map(
            (unbudget: Unbudget) => (
              <UnbudgetCard
                key={unbudget.category}
                name={unbudget.category}
                amount={unbudget.amount}
                selectedDates={props.selectedDates}
              />
            )
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default Unbudgets;
