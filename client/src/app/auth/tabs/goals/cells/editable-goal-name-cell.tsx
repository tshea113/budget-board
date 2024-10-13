import { Input } from '@/components/ui/input';
import { Goal } from '@/types/goal';
import React from 'react';

interface EditableGoalNameCellProps {
  goal: Goal;
  isSelected: boolean;
  editCell: (newGoal: Goal) => void;
}

const EditableGoalNameCell = (props: EditableGoalNameCellProps): JSX.Element => {
  const [goalNameValue, setGoalNameValue] = React.useState<string>(props.goal.name);

  const onGoalNameBlur = (): void => {
    if (goalNameValue && goalNameValue.length > 0) {
      const newGoal: Goal = {
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
    <>
      {props.isSelected ? (
        <Input
          className="h-8 max-w-[400px] text-left text-lg"
          onClick={(e) => {
            e.stopPropagation();
          }}
          onChange={(e) => setGoalNameValue(e.target.value)}
          onBlur={onGoalNameBlur}
          value={goalNameValue}
        />
      ) : (
        <span className="select-none">{props.goal.name}</span>
      )}
    </>
  );
};

export default EditableGoalNameCell;
