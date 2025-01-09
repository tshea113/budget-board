import DatePicker from '@/components/date-picker';
import { IGoalResponse } from '@/types/goal';
import React from 'react';

interface EditableGoalTargetDateCellProps {
  goal: IGoalResponse;
  isSelected: boolean;
  editCell: (newGoal: IGoalResponse) => void;
}

const EditableGoalTargetDateCell = (
  props: EditableGoalTargetDateCellProps
): JSX.Element => {
  const [goalTargetDateValue, setGoalTargetDateValue] = React.useState<Date | null>(
    props.goal.completeDate
  );

  const onDatePick = (date: Date): void => {
    setGoalTargetDateValue(date);
    const newGoal: IGoalResponse = {
      ...props.goal,
      completeDate: date,
    };
    if (props.editCell != null) {
      props.editCell(newGoal);
    }
  };

  return (
    <>
      {props.isSelected && goalTargetDateValue ? (
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
