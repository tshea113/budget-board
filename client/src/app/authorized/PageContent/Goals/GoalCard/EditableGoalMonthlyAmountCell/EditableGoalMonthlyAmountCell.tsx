import { sumTransactionsForGoalForMonth } from "$helpers/goals";
import classes from "./EditableGoalMonthlyAmountCell.module.css";

import { convertNumberToCurrency } from "$helpers/currency";
import { Flex, NumberInput, Text } from "@mantine/core";
import { IGoalResponse, IGoalUpdateRequest } from "$models/goal";
import React from "react";
import { getVisibleTransactions } from "$helpers/transactions";
import { useQuery } from "@tanstack/react-query";
import { ITransaction } from "$models/transaction";
import { AxiosResponse } from "axios";
import { AuthContext } from "$components/Auth/AuthProvider";

interface EditableGoalMonthlyAmountCellProps {
  goal: IGoalResponse;
  isSelected: boolean;
  editCell: (newGoal: IGoalUpdateRequest) => void;
}

const EditableGoalMonthlyAmountCell = (
  props: EditableGoalMonthlyAmountCellProps
): React.ReactNode => {
  const [goalAmountValue, setGoalAmountValue] = React.useState<number | string>(
    (props.goal.monthlyContribution ?? 0).toFixed(0)
  );

  const { request } = React.useContext<any>(AuthContext);

  const transactionsForMonthQuery = useQuery({
    queryKey: [
      "transactions",
      {
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        includeHidden: true,
      },
    ],
    queryFn: async (): Promise<ITransaction[]> => {
      const res: AxiosResponse = await request({
        url: "/api/transaction",
        method: "GET",
        params: {
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          getHidden: true,
        },
      });

      if (res.status === 200) {
        return res.data as ITransaction[];
      }

      return [];
    },
  });

  const onInputBlur = (): void => {
    if (props.goal.monthlyContribution) {
      if (goalAmountValue && goalAmountValue.toString().length > 0) {
        const newGoal: IGoalUpdateRequest = {
          ...props.goal,
          monthlyContribution: goalAmountValue as number,
        };
        if (props.editCell != null) {
          props.editCell(newGoal);
        }
      } else {
        setGoalAmountValue(props.goal.monthlyContribution.toFixed(0));
      }
    }
  };

  const goalMonthlyContributionAmount = sumTransactionsForGoalForMonth(
    props.goal,
    getVisibleTransactions(transactionsForMonthQuery.data ?? [])
  );

  return (
    <Flex className={classes.container}>
      <Text
        style={{
          color:
            goalMonthlyContributionAmount < props.goal.monthlyContribution
              ? "var(--mantine-color-red-6)"
              : "var(--mantine-color-green-6)",
          fontWeight: 600,
        }}
      >
        {convertNumberToCurrency(goalMonthlyContributionAmount)}
      </Text>
      <Text>of</Text>
      {props.isSelected && props.goal.isMonthlyContributionEditable ? (
        <Flex onClick={(e) => e.stopPropagation()}>
          <NumberInput
            maw={100}
            min={0}
            prefix="$"
            thousandSeparator=","
            onChange={setGoalAmountValue}
            onBlur={onInputBlur}
            value={goalAmountValue}
          />
        </Flex>
      ) : (
        <Text fw={600}>
          {convertNumberToCurrency(props.goal.monthlyContribution)}
        </Text>
      )}
      <Text>this month</Text>
    </Flex>
  );
};

export default EditableGoalMonthlyAmountCell;
