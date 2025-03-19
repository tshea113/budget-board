import { convertNumberToCurrency } from "@helpers/currency";
import classes from "./EditableGoalTargetAmountCell.module.css";

import { Flex, NumberInput, Text } from "@mantine/core";
import { IGoalResponse, IGoalUpdateRequest } from "@models/goal";
import React from "react";
import { getGoalTargetAmount } from "@helpers/goals";
import { sumAccountsTotalBalance } from "@helpers/accounts";

interface EditableGoalTargetAmountCellProps {
  goal: IGoalResponse;
  isSelected: boolean;
  editCell: (newGoal: IGoalUpdateRequest) => void;
}

const EditableGoalTargetAmountCell = (
  props: EditableGoalTargetAmountCellProps
): React.ReactNode => {
  const [goalAmountValue, setGoalAmountValue] = React.useState<number | string>(
    props.goal.amount
  );

  const onInputBlur = (): void => {
    if (goalAmountValue && goalAmountValue.toString().length > 0) {
      const newGoal: IGoalUpdateRequest = {
        ...props.goal,
        amount: goalAmountValue as number,
      };
      if (props.editCell != null) {
        props.editCell(newGoal);
      }
    } else {
      setGoalAmountValue(props.goal.amount.toFixed(0));
    }
  };

  return (
    <Flex className={classes.container}>
      <Text size="lg" fw={600}>
        {convertNumberToCurrency(
          sumAccountsTotalBalance(props.goal.accounts) -
            props.goal.initialAmount
        )}
      </Text>
      <Text size="lg">of</Text>
      {props.isSelected && props.goal.amount !== 0 ? (
        <Flex
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
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
        <Text size="lg" fw={600}>
          {convertNumberToCurrency(
            getGoalTargetAmount(props.goal.amount, props.goal.initialAmount)
          )}
        </Text>
      )}
    </Flex>
  );
};

export default EditableGoalTargetAmountCell;
