import { useGoalsQuery } from '@/lib/query';
import { Goal } from '@/types/goal';
import GoalCard from './goal-card';
import { Skeleton } from '@/components/ui/skeleton';

const GoalCards = (): JSX.Element => {
  const goalsQuery = useGoalsQuery();

  if (goalsQuery.isPending) {
    return (
      <div className="flex items-center justify-center">
        <Skeleton className="h-[100px] w-full rounded-xl" />
      </div>
    );
  }

  if (goalsQuery.data?.data?.length === 0) {
    return (
      <div className="flex flex-col justify-center space-y-2">
        <div className="flex items-center justify-center">No goals</div>
      </div>
    );
  }

  return (goalsQuery.data?.data ?? []).map((goal: Goal) => <GoalCard key={goal.id} goal={goal} />);
};

export default GoalCards;
