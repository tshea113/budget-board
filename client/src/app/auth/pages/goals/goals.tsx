import AddGoal from './add-goal/add-goal';
import AddButtonSheet from '@/components/add-button-sheet';
import GoalCards from './goal-cards';

const Goals = (): JSX.Element => {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex flex-row">
        <span className="grow text-xl font-semibold tracking-tight">Goals</span>
        <AddButtonSheet>
          <AddGoal />
        </AddButtonSheet>
      </div>
      <GoalCards />
    </div>
  );
};

export default Goals;
