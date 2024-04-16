import MonthIterator from './month-iterator';
import React from 'react';
import AddButton from '@/components/add-button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BudgetGroup, getBudgets, getBudgetsForMonth, getBudgetsForGroup } from '@/lib/budgets';
import BudgetCards from './budget-cards';
import AddBudget from './add-budget';
import { getTransactions, getTransactionsForMonth } from '@/lib/transactions';
import BudgetHeader from './budget-header';
import { type Budget } from '@/types/budget';
import BudgetTotalCard from './budget-total-card';
import { initMonth } from '@/lib/utils';
import { type Transaction } from '@/types/transaction';
import request from '@/lib/request';
import { type AxiosResponse } from 'axios';
import { defaultGuid } from '@/types/user';
import ResponsiveButton from '@/components/responsive-button';
import AlertBanner from '@/components/alert-banner';
import Unbudgets from './unbudgets';

const Budgets = (): JSX.Element => {
  const [date, setDate] = React.useState<Date>(initMonth());
  const [alert, setAlert] = React.useState('');

  const budgetsQuery = useQuery({
    queryKey: ['budgets', { date }],
    queryFn: async () => {
      const response = await getBudgets(date);
      return response;
    },
  });

  const transactionsQuery = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await getTransactions();
      return response;
    },
  });

  const queryClient = useQueryClient();
  const doCopyBudget = useMutation({
    mutationFn: async (newBudgets: Budget[]) => {
      return await request({
        url: '/api/budget/addmultiple',
        method: 'POST',
        data: newBudgets,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });

  return (
    <div className="flex w-screen max-w-screen-2xl flex-row justify-center space-x-2">
      <div className="w-3/4 flex-grow space-y-2">
        <AlertBanner alert={alert} setAlert={setAlert} />
        <div className="grid w-full grid-cols-3">
          <div />
          <div className="justify-self-center">
            <MonthIterator date={date} setDate={setDate} />
          </div>
          <div className="flex flex-row space-x-2 justify-self-end">
            {((budgetsQuery.data?.data as Budget[]) ?? null)?.length === 0 && (
              <ResponsiveButton
                variant="default"
                loading={doCopyBudget.isPending}
                onClick={() => {
                  const lastMonth = new Date(date);
                  lastMonth.setMonth(lastMonth.getMonth() - 1);

                  getBudgets(lastMonth)
                    .then((res: AxiosResponse<any, any>) => {
                      const budgets: Budget[] = res.data;
                      if (budgets.length !== 0) {
                        budgets.forEach((budget) => {
                          budget.id = defaultGuid;
                          budget.date = date;
                          budget.userId = defaultGuid;
                        });
                        doCopyBudget.mutate(res.data as Budget[]);
                      } else {
                        setAlert('Last month has no budget!');
                      }
                    })
                    .catch(() => {
                      setAlert("There was an error copying last month's budget.");
                    });
                }}
              >
                Copy last month
              </ResponsiveButton>
            )}
            <AddButton>
              <AddBudget date={date} />
            </AddButton>
          </div>
        </div>
        <div className="space-y-10">
          <div className="items-center align-middle">
            <BudgetHeader>Income</BudgetHeader>
            <BudgetCards
              budgetData={getBudgetsForGroup(
                budgetsQuery.data?.data as Budget[],
                BudgetGroup.Income
              )}
              transactionsData={getTransactionsForMonth(
                (transactionsQuery.data?.data as Transaction[]) ?? [],
                date
              )}
              isPending={budgetsQuery.isPending || transactionsQuery.isPending}
            />
          </div>
          <div className="items-center align-middle">
            <BudgetHeader>Spending</BudgetHeader>
            <BudgetCards
              budgetData={getBudgetsForGroup(
                budgetsQuery.data?.data as Budget[],
                BudgetGroup.Spending
              )}
              transactionsData={getTransactionsForMonth(
                (transactionsQuery.data?.data as Transaction[]) ?? [],
                date
              )}
              isPending={budgetsQuery.isPending || transactionsQuery.isPending}
            />
          </div>
        </div>
        <Unbudgets
          transactions={getTransactionsForMonth(
            (transactionsQuery.data?.data as Transaction[]) ?? [],
            date
          )}
          budgets={(budgetsQuery.data?.data as Budget[]) ?? []}
        />
      </div>
      <div className="flex h-96 w-1/4 flex-col justify-center">
        {/* TODO: Figure out a better way to horizontally position this */}
        <div />
        <BudgetTotalCard
          budgetData={getBudgetsForMonth((budgetsQuery.data?.data as Budget[]) ?? [], date)}
          transactionData={getTransactionsForMonth(
            (transactionsQuery.data?.data as Transaction[]) ?? [],
            date
          )}
        />
      </div>
    </div>
  );
};

export default Budgets;
