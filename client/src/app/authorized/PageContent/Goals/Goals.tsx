import classes from "./Goals.module.css";

import { AuthContext } from "$components/Auth/AuthProvider";
import { Skeleton, Stack } from "@mantine/core";
import { useDidUpdate, useDisclosure } from "@mantine/hooks";
import { IGoalResponse } from "$models/goal";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import React from "react";
import GoalCard from "./GoalCard/GoalCard";
import GoalsHeader from "./GoalsHeader/GoalsHeader";

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

  useDidUpdate(() => {
    goalsQuery.refetch();
  }, [includeInterest]);

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
          (goalsQuery.data ?? []).map((goal: IGoalResponse) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              includeInterest={includeInterest}
            />
          ))
        )}
      </Stack>
    </Stack>
  );
};

export default Goals;
