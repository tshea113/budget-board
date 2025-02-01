import { IGoalResponse } from '@/types/goal';
import GoalCard from './goal-card';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { AuthContext } from '@/components/auth-provider';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

interface GoalCardsProps {
  includeInterest: boolean;
}

const GoalCards = (props: GoalCardsProps): JSX.Element => {
  const { request } = React.useContext<any>(AuthContext);

  const goalsQuery = useQuery({
    queryKey: ['goals', { includeInterest: props.includeInterest }],
    queryFn: async (): Promise<IGoalResponse[]> => {
      const res: AxiosResponse = await request({
        url: '/api/goal',
        method: 'GET',
        params: {
          includeInterest: props.includeInterest,
        },
      });

      if (res.status === 200) {
        return res.data as IGoalResponse[];
      }

      return [];
    },
  });

  React.useEffect(() => {
    goalsQuery.refetch();
  }, [props.includeInterest]);

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
        <GoalCard key={goal.id} goal={goal} includeInterest={props.includeInterest} />
      ))}
    </>
  );
};

export default GoalCards;
