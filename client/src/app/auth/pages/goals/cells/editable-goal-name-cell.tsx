import { Input } from '@/components/ui/input';
import { IGoalResponse, IGoalUpdateRequest } from '@/types/goal';
import React, { type JSX } from 'react';

interface EditableGoalNameCellProps {
  goal: IGoalResponse;
  isSelected: boolean;
  editCell: (newGoal: IGoalUpdateRequest) => void;
}

const EditableGoalNameCell = (props: EditableGoalNameCellProps): JSX.Element => {
  const [goalNameValue, setGoalNameValue] = React.useState<string>(props.goal.name);

  const onGoalNameBlur = (): void => {
    if (goalNameValue && goalNameValue.length > 0) {
      const newGoal: IGoalUpdateRequest = {
        ...props.goal,
        name: goalNameValue,
        accountIds: props.goal.accounts.map((account) => account.id),
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
        <span className="select-none text-xl font-semibold tracking-tight">
          {props.goal.name}
        </span>
      )}
    </>
  );
};

export default EditableGoalNameCell;
