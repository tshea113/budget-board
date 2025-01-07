import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { BudgetResponse } from '@/types/budget';
import { Transaction } from '@/types/transaction';
import UnbudgetCard from './unbudget-card';
import { Skeleton } from '@/components/ui/skeleton';
import { convertNumberToCurrency } from '@/lib/utils';
import { getUnbudgetedTransactions, Unbudget } from '@/lib/budgets';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '@/components/auth-provider';
import React from 'react';
import { ICategoryResponse } from '@/types/category';

interface UnbudgetProps {
  transactions: Transaction[];
  budgets: BudgetResponse[];
  selectedDates: Date[];
  isPending: boolean;
}

const Unbudgets = (props: UnbudgetProps): JSX.Element => {
  const { request } = React.useContext<any>(AuthContext);
  const transactionCategoriesQuery = useQuery({
    queryKey: ['transactionCategories'],
    queryFn: async () => {
      const res = await request({
        url: '/api/transactionCategory',
        method: 'GET',
      });

      if (res.status === 200) {
        return res.data as ICategoryResponse[];
      }

      return undefined;
    },
  });

  if (props.isPending || transactionCategoriesQuery.isPending) {
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
                  getUnbudgetedTransactions(
                    props.budgets,
                    props.transactions,
                    transactionCategoriesQuery.data ?? []
                  ).reduce((a: number, b: Unbudget) => {
                    return a + b.amount;
                  }, 0)
                )}
              </span>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-1">
          {getUnbudgetedTransactions(
            props.budgets,
            props.transactions,
            transactionCategoriesQuery.data ?? []
          ).map((unbudget: Unbudget) => (
            <UnbudgetCard
              key={unbudget.category}
              name={unbudget.category}
              amount={unbudget.amount}
              selectedDates={props.selectedDates}
            />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default Unbudgets;
