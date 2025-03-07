import classes from "./GoalCard.module.css";

import {
  ActionIcon,
  Card,
  Flex,
  Group,
  LoadingOverlay,
  Progress,
  Stack,
} from "@mantine/core";
import React from "react";
import EditableGoalNameCell from "./EditableGoalNameCell/EditableGoalNameCell";
import { IGoalResponse, IGoalUpdateRequest } from "@models/goal";
import { AuthContext } from "@components/Auth/AuthProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { translateAxiosError } from "@helpers/requests";
import EditableGoalTargetAmountCell from "./EditableGoalTargetAmountCell/EditableGoalTargetAmountCell";
import { sumAccountsTotalBalance } from "@helpers/accounts";
import { getGoalTargetAmount } from "@helpers/goals";
import { getProgress } from "@helpers/utils";
import EditableGoalTargetDateCell from "./EditableGoalTargetDateCell/EditableGoalTargetDateCell";
import EditableGoalMonthlyAmountCell from "./EditableGoalMonthlyAmountCell/EditableGoalMonthlyAmountCell";
import { useDisclosure } from "@mantine/hooks";
import { TrashIcon } from "lucide-react";

interface GoalCardProps {
  goal: IGoalResponse;
  includeInterest: boolean;
}

const GoalCard = (props: GoalCardProps): React.ReactNode => {
  const [isSelected, { toggle }] = useDisclosure();
  const { request } = React.useContext<any>(AuthContext);

  const queryClient = useQueryClient();
  const doEditGoal = useMutation({
    mutationFn: async (newGoal: IGoalUpdateRequest) =>
      await request({
        url: "/api/goal",
        method: "PUT",
        data: newGoal,
      }),
    onMutate: async (variables: IGoalUpdateRequest) => {
      await queryClient.cancelQueries({
        queryKey: ["goals", { includeInterest: props.includeInterest }],
      });

      const previousGoals: IGoalResponse[] =
        queryClient.getQueryData([
          "goals",
          { includeInterest: props.includeInterest },
        ]) ?? [];

      queryClient.setQueryData(
        ["goals", { includeInterest: props.includeInterest }],
        (oldGoals: IGoalResponse[]) =>
          oldGoals?.map((oldGoal: IGoalResponse) =>
            oldGoal.id === variables.id
              ? {
                  ...oldGoal,
                  name: variables.name,
                  completeDate: variables.completeDate,
                  amount: variables.amount,
                  monthlyContribution: variables.monthlyContribution,
                }
              : oldGoal
          )
      );

      return { previousGoals };
    },
    onError: (error: AxiosError, _variables: IGoalUpdateRequest, context) => {
      queryClient.setQueryData(
        ["goals", { includeInterest: props.includeInterest }],
        context?.previousGoals ?? []
      );
      notifications.show({ color: "red", message: translateAxiosError(error) });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["goals", { includeInterest: props.includeInterest }],
      });
    },
  });

  const doDeleteGoal = useMutation({
    mutationFn: async (id: string) =>
      await request({
        url: "/api/goal",
        method: "DELETE",
        params: { guid: id },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["goals", { includeInterest: props.includeInterest }],
      });
    },
    onError: (error: AxiosError) => {
      notifications.show({
        color: "red",
        message: translateAxiosError(error),
      });
    },
  });

  const percentComplete = getProgress(
    sumAccountsTotalBalance(props.goal.accounts) - props.goal.initialAmount,
    getGoalTargetAmount(props.goal.amount, props.goal.initialAmount)
  );

  return (
    <Card
      className={classes.card}
      radius="sm"
      withBorder
      shadow="sm"
      onClick={toggle}
      bg={isSelected ? "var(--mantine-primary-color-light)" : ""}
    >
      <LoadingOverlay
        visible={doEditGoal.isPending || doDeleteGoal.isPending}
      />
      <Group wrap="nowrap">
        <Stack className={classes.stack}>
          <Flex className={classes.topFlex}>
            <EditableGoalNameCell
              goal={props.goal}
              isSelected={isSelected}
              editCell={doEditGoal.mutate}
            />
            <EditableGoalTargetAmountCell
              goal={props.goal}
              isSelected={isSelected}
              editCell={doEditGoal.mutate}
            />
          </Flex>
          <Progress.Root size={18} radius="xl">
            <Progress.Section value={percentComplete}>
              <Progress.Label>{percentComplete.toFixed(0)}%</Progress.Label>
            </Progress.Section>
          </Progress.Root>
          <Flex className={classes.bottomFlex}>
            <EditableGoalTargetDateCell
              goal={props.goal}
              isSelected={isSelected}
              editCell={doEditGoal.mutate}
            />
            <EditableGoalMonthlyAmountCell
              goal={props.goal}
              isSelected={isSelected}
              editCell={doEditGoal.mutate}
            />
          </Flex>
        </Stack>
        {isSelected && (
          <Group style={{ alignSelf: "stretch" }}>
            <ActionIcon
              color="red"
              onClick={(e) => {
                e.stopPropagation();
                doDeleteGoal.mutate(props.goal.id);
              }}
              h="100%"
            >
              <TrashIcon size="1rem" />
            </ActionIcon>
          </Group>
        )}
      </Group>
    </Card>
  );
};

export default GoalCard;
