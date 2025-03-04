import classes from "./Goals.module.css";

import { AuthContext } from "@components/Auth/AuthProvider";
import { Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IGoalResponse } from "@models/goal";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import React from "react";
import GoalCard from "./GoalCard/GoalCard";

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
  return (
    <Stack className={classes.root}>
      {(goalsQuery.data ?? []).map((goal: IGoalResponse) => (
        <GoalCard key={goal.id} goal={goal} includeInterest={includeInterest} />
      ))}
    </Stack>
  );
};

export default Goals;
