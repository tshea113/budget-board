import GoalCards from './goal-cards';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import React from 'react';
import AddGoal from './add-goal/add-goal';
import { cn } from '@/lib/utils';

const Goals = (): JSX.Element => {
  const [isAddGoalOpen, setIsAddGoalOpen] = React.useState<boolean>(false);
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-row justify-end">
        <Button
          variant="outline"
          className={cn(isAddGoalOpen ? 'border-success' : '')}
          onClick={() => setIsAddGoalOpen(!isAddGoalOpen)}
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
      {isAddGoalOpen && (
        <div className="flex w-full flex-row justify-center">
          <AddGoal />
        </div>
      )}
      <GoalCards />
    </div>
  );
};

export default Goals;
