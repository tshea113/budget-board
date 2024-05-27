import AddGoal from './add-goal/add-goal';
import AddButtonSheet from '@/components/add-button-sheet';
import GoalCards from './goal-cards';

const Goals = (): JSX.Element => {
  return (
    <div className="flex w-full max-w-screen-2xl flex-col space-y-2">
      <div className="grid grid-cols-2">
        <span className="justify-self-start text-xl font-semibold tracking-tight">Goals</span>
        <div className="justify-self-end">
          <AddButtonSheet>
            <AddGoal />
          </AddButtonSheet>
        </div>
      </div>
      <GoalCards />
    </div>
  );
};

export default Goals;
