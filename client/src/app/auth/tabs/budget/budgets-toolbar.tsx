import { Budget } from '@/types/budget';
import MonthIterator from './month-iterator';
import ResponsiveButton from '@/components/responsive-button';
import { AxiosError, AxiosResponse } from 'axios';
import { translateAxiosError } from '@/lib/request';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { AddMultipleBudgets, getBudgets } from '@/lib/budgets';
import { defaultGuid } from '@/types/user';
import AddButton from '@/components/add-button';
import AddBudget from './add-budget';

interface BudgetsToolbarProps {
  budgets: Budget[];
  date: Date;
  setDate: (date: Date) => void;
}

const BudgetsToolbar = (props: BudgetsToolbarProps): JSX.Element => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const doCopyBudget = useMutation({
    mutationFn: async (newBudgets: Budget[]) => {
      return await AddMultipleBudgets(newBudgets);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
    onError: (error: AxiosError) => {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: translateAxiosError(error),
      });
    },
  });

  return (
    <div className="grid w-full grid-cols-3">
      <div />
      <div className="justify-self-center">
        <MonthIterator date={props.date} setDate={props.setDate} />
      </div>
      <div className="flex flex-row space-x-2 justify-self-end">
        {((props.budgets as Budget[]) ?? null)?.length === 0 && (
          <ResponsiveButton
            variant="default"
            loading={doCopyBudget.isPending}
            onClick={() => {
              const lastMonth = new Date(props.date);
              lastMonth.setMonth(lastMonth.getMonth() - 1);

              getBudgets(lastMonth)
                .then((res: AxiosResponse<any, any>) => {
                  const budgets: Budget[] = res.data;
                  if (budgets.length !== 0) {
                    budgets.forEach((budget) => {
                      budget.id = defaultGuid;
                      budget.date = props.date;
                      budget.userId = defaultGuid;
                    });
                    doCopyBudget.mutate(res.data as Budget[]);
                  } else {
                    toast({
                      variant: 'destructive',
                      title: 'Error',
                      description: 'Last month has no budget!',
                    });
                  }
                })
                .catch(() => {
                  toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: "There was an error copying last month's budget.",
                  });
                });
            }}
          >
            Copy last month
          </ResponsiveButton>
        )}
        <AddButton>
          <AddBudget date={props.date} />
        </AddButton>
      </div>
    </div>
  );
};

export default BudgetsToolbar;
