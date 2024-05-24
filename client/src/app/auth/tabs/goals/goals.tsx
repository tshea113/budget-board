import GoalCard from './goal-card';
import { useGoalsQuery } from '@/lib/query';
import { Goal } from '@/types/goal';
import AddGoal from './add-goal';
import AddButtonSheet from '@/components/add-button-sheet';

const Goals = (): JSX.Element => {
  const goalsQuery = useGoalsQuery();

  if (goalsQuery.isPending) {
    return <span>Loading...</span>;
  }

  return (
    <div className="flex w-full max-w-screen-2xl flex-col space-y-2">
      <div className="grid grid-cols-2">
        <h3 className="justify-self-start text-xl font-semibold tracking-tight">Goals</h3>
        <div className="justify-self-end">
          <AddButtonSheet>
            <AddGoal />
          </AddButtonSheet>
        </div>
      </div>
      {(goalsQuery.data?.data ?? []).map((goal: Goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
};

export default Goals;
