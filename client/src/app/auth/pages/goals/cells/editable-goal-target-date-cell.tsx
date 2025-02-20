import DatePicker from '@/components/date-picker';
import { IGoalResponse, IGoalUpdateRequest } from '@/types/goal';
import React, { type JSX } from 'react';

interface EditableGoalTargetDateCellProps {
  goal: IGoalResponse;
  isSelected: boolean;
  editCell: (newGoal: IGoalUpdateRequest) => void;
}

const EditableGoalTargetDateCell = (
  props: EditableGoalTargetDateCellProps
): JSX.Element => {
  const [goalTargetDateValue, setGoalTargetDateValue] = React.useState<Date>(
    props.goal.completeDate
  );

  const onDatePick = (date: Date): void => {
    setGoalTargetDateValue(date);
    const newGoal: IGoalUpdateRequest = {
      ...props.goal,
      completeDate: date,
      accountIds: props.goal.accounts.map((account) => account.id),
    };
    if (props.editCell != null) {
      props.editCell(newGoal);
    }
  };

  return (
    <>
      {props.isSelected && props.goal.isCompleteDateEditable ? (
        <DatePicker className="h-8" onDayClick={onDatePick} value={goalTargetDateValue} />
      ) : (
        <span className="font-medium tracking-tight">
          {new Date(props.goal.completeDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
          })}
        </span>
      )}
    </>
  );
};

export default EditableGoalTargetDateCell;
