import classes from "./EditableGoalNameCell.module.css";

import { Flex, TextInput, Text } from "@mantine/core";
import { IGoalResponse, IGoalUpdateRequest } from "@models/goal";
import React from "react";

interface EditableGoalNameCellProps {
  goal: IGoalResponse;
  isSelected: boolean;
  editCell: (newGoal: IGoalUpdateRequest) => void;
}

const EditableGoalNameCell = (
  props: EditableGoalNameCellProps
): React.ReactNode => {
  const [goalNameValue, setGoalNameValue] = React.useState<string>(
    props.goal.name
  );

  const onGoalNameBlur = (): void => {
    if (goalNameValue && goalNameValue.length > 0) {
      const newGoal: IGoalUpdateRequest = {
        ...props.goal,
        name: goalNameValue,
      };
      if (props.editCell != null) {
        props.editCell(newGoal);
      }
    } else {
      setGoalNameValue(props.goal.name);
    }
  };

  return (
    <Flex className={classes.container}>
      {props.isSelected ? (
        <TextInput
          value={goalNameValue}
          onChange={(e) => setGoalNameValue(e.currentTarget.value)}
          onBlur={onGoalNameBlur}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <Text size="lg" fw={600} style={{ textWrap: "nowrap" }}>
          {props.goal.name}
        </Text>
      )}
    </Flex>
  );
};

export default EditableGoalNameCell;
