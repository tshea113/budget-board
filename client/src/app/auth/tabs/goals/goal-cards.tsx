import { Goal } from '@/types/goal';
import GoalCard from './goal-card';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { AuthContext } from '@/components/auth-provider';
import { useQuery } from '@tanstack/react-query';

const GoalCards = (): JSX.Element => {
  const { request } = React.useContext<any>(AuthContext);

  const goalsQuery = useQuery({
    queryKey: ['goals'],
    queryFn: async () =>
      await request({
        url: '/api/goal',
        method: 'GET',
      }),
  });

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

  return (goalsQuery.data?.data ?? []).map((goal: Goal) => (
    <GoalCard key={goal.id} goal={goal} />
  ));
};

export default GoalCards;
