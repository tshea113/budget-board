import GoalCards from './goal-cards';
import { Button } from '@/components/ui/button';
import { PlusIcon, TriangleAlertIcon } from 'lucide-react';
import React, { type JSX } from 'react';
import AddGoal from './add-goal/add-goal';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

const Goals = (): JSX.Element => {
  const [isAddGoalOpen, setIsAddGoalOpen] = React.useState<boolean>(false);
  const [isInterestIncluded, setIsInterestIncluded] = React.useState<boolean>(false);
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-row justify-end gap-2">
        <Button
          variant="outline"
          className={cn(
            isInterestIncluded ? 'border-success text-success hover:text-success' : ''
          )}
          onClick={() => setIsInterestIncluded(!isInterestIncluded)}
        >
          Include Interest
        </Button>
        <Button
          variant="outline"
          className={cn(
            isAddGoalOpen ? 'border-primary text-primary hover:text-primary' : ''
          )}
          onClick={() => setIsAddGoalOpen(!isAddGoalOpen)}
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
      {isInterestIncluded && (
        <Card className="flex flex-col gap-2 border-warning bg-background p-4">
          <div className="flex flex-row gap-1 text-sm font-semibold text-warning">
            <TriangleAlertIcon />
            <span>
              Including interest rate calculations is experimental and may produce
              inaccurate values.
            </span>
          </div>
          <span className="text-wrap text-sm">
            Including interest will calculate the projected payoff date or monthly payment
            of a loan based on the estimated APR of the goal. The estimated APR should be
            close, but it may not be accurate.
          </span>
          <span className="text-wrap text-sm font-semibold">
            You can check the APR under goal details. Use this feature at your own risk.
          </span>
        </Card>
      )}
      {isAddGoalOpen && (
        <div className="flex w-full flex-row justify-center">
          <AddGoal />
        </div>
      )}
      <GoalCards includeInterest={isInterestIncluded} />
    </div>
  );
};

export default Goals;
