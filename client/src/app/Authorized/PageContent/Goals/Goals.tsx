import classes from "./Goals.module.css";

import { AuthContext } from "~/components/AuthProvider/AuthProvider";
import { Skeleton, Stack } from "@mantine/core";
import { useDidUpdate, useDisclosure } from "@mantine/hooks";
import { IGoalResponse } from "~/models/goal";
import { useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import React from "react";
import GoalCard from "./GoalCard/GoalCard";
import GoalsHeader from "./GoalsHeader/GoalsHeader";
import { notifications } from "@mantine/notifications";
import { translateAxiosError } from "~/helpers/requests";
import CompletedGoalsAccordion from "./CompletedGoalsAccordion/CompletedGoalsAccordion";

const Goals = (): React.ReactNode => {
  const [includeInterest, { toggle }] = useDisclosure();
  const { request } = React.useContext<any>(AuthContext);

  const goalsQuery = useQuery({
    queryKey: ["goals", { includeInterest }],
    queryFn: async (): Promise<IGoalResponse[]> => {
      const res: AxiosResponse = await request({
        url: "/api/goal",
        method: "GET",
        params: { includeInterest },
      });

      if (res.status === 200) {
        return res.data as IGoalResponse[];
      }

      return [];
    },
  });

  React.useEffect(() => {
    if (goalsQuery.isError) {
      notifications.show({
        color: "red",
        message: translateAxiosError(goalsQuery.error as AxiosError),
      });
    }
  }, [goalsQuery.isError]);

  useDidUpdate(() => {
    goalsQuery.refetch();
  }, [includeInterest]);

  const activeGoals = React.useMemo(
    () => (goalsQuery.data ?? []).filter((goal) => goal.completed == null),
    [goalsQuery.data]
  );

  const completedGoals = React.useMemo(
    () => (goalsQuery.data ?? []).filter((goal) => goal.completed != null),
    [goalsQuery.data]
  );

  return (
    <Stack className={classes.root}>
      <GoalsHeader
        includeInterest={includeInterest}
        toggleIncludeInterest={toggle}
      />
      <Stack className={classes.goals}>
        {goalsQuery.isPending ? (
          <Skeleton h={100} w="100%" radius="lg" />
        ) : (
          activeGoals.map((goal: IGoalResponse) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              includeInterest={includeInterest}
            />
          ))
        )}
      </Stack>
      {completedGoals.length > 0 && (
        <CompletedGoalsAccordion compeltedGoals={completedGoals} />
      )}
    </Stack>
  );
};

export default Goals;
