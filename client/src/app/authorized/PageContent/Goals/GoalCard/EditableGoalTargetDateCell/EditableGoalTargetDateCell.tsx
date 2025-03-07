import classes from "./EditableGoalTargetDateCell.module.css";

import { Flex, Text } from "@mantine/core";
import { DatePickerInput, DateValue } from "@mantine/dates";
import { IGoalResponse, IGoalUpdateRequest } from "@models/goal";
import React from "react";

interface EditableGoalTargetDateCellProps {
  goal: IGoalResponse;
  isSelected: boolean;
  editCell: (newGoal: IGoalUpdateRequest) => void;
}

const EditableGoalTargetDateCell = (
  props: EditableGoalTargetDateCellProps
): React.ReactNode => {
  const [goalTargetDateValue, setGoalTargetDateValue] = React.useState<Date>(
    new Date(props.goal.completeDate)
  );

  const onDatePick = (date: DateValue): void => {
    if (date === null) {
      return;
    }
    setGoalTargetDateValue(date);
    const newGoal: IGoalUpdateRequest = {
      ...props.goal,
      completeDate: date,
    };
    if (props.editCell != null) {
      props.editCell(newGoal);
    }
  };

  return (
    <Flex className={classes.container}>
      <Text>Projected: </Text>
      {props.isSelected && props.goal.isCompleteDateEditable ? (
        <Flex
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <DatePickerInput
            className="h-8"
            onChange={onDatePick}
            value={goalTargetDateValue}
          />
        </Flex>
      ) : (
        <Text>
          {new Date(props.goal.completeDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
          })}
        </Text>
      )}
    </Flex>
  );
};

export default EditableGoalTargetDateCell;
