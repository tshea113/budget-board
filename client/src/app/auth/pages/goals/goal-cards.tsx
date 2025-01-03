import { IGoalResponse } from '@/types/goal';
import GoalCard from './goal-card';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { AuthContext } from '@/components/auth-provider';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

const GoalCards = (): JSX.Element => {
  const { request } = React.useContext<any>(AuthContext);

  const goalsQuery = useQuery({
    queryKey: ['goals'],
    queryFn: async (): Promise<IGoalResponse[]> => {
      const res: AxiosResponse = await request({
        url: '/api/goal',
        method: 'GET',
      });

      if (res.status == 200) {
        return res.data;
      }

      return [];
    },
  });

  if (goalsQuery.isPending) {
    return (
      <div className="flex items-center justify-center">
        <Skeleton className="h-[100px] w-full rounded-xl" />
      </div>
    );
  }

  if (goalsQuery.data?.length === 0) {
    return (
      <div className="flex flex-col justify-center space-y-2">
        <div className="flex items-center justify-center">No goals</div>
      </div>
    );
  }

  return (
    <>
      {(goalsQuery.data ?? []).map((goal: IGoalResponse) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </>
  );
};

export default GoalCards;
