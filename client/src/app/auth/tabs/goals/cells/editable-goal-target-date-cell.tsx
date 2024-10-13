import DatePicker from '@/components/date-picker';
import { calculateCompleteDate } from '@/lib/goals';
import { Goal } from '@/types/goal';
import React from 'react';

interface EditableGoalTargetDateCellProps {
  goal: Goal;
  isSelected: boolean;
  isError: boolean;
  editCell: (newGoal: Goal) => void;
}

const EditableGoalTargetDateCell = (
  props: EditableGoalTargetDateCellProps
): JSX.Element => {
  const [goalTargetDateValue, setGoalTargetDateValue] = React.useState<Date | null>(
    props.goal.completeDate
  );

  React.useEffect(() => {
    if (props.isError) {
      setGoalTargetDateValue(props.goal.completeDate);
    }
  }, [props.isError]);

  const onDatePick = (date: Date): void => {
    setGoalTargetDateValue(date);
    const newGoal: Goal = {
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
        calculateCompleteDate(props.goal)
      )}
    </>
  );
};

export default EditableGoalTargetDateCell;
