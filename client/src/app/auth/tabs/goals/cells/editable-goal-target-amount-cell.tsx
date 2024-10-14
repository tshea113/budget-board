import { Input } from '@/components/ui/input';
import { getGoalTargetAmount } from '@/lib/goals';
import { convertNumberToCurrency } from '@/lib/utils';
import { Goal } from '@/types/goal';
import React from 'react';

interface EditableGoalTargetAmountCellProps {
  goal: Goal;
  isSelected: boolean;
  editCell: (newGoal: Goal) => void;
}

const EditableGoalTargetAmountCell = (
  props: EditableGoalTargetAmountCellProps
): JSX.Element => {
  const [goalAmountValue, setGoalAmountValue] = React.useState<string>(
    props.goal.amount.toFixed(0)
  );

  const onInputBlur = (): void => {
    if (!isNaN(parseFloat(goalAmountValue))) {
      const newGoal: Goal = {
        ...props.goal,
        amount: parseFloat(goalAmountValue),
      };
      if (props.editCell != null) {
        props.editCell(newGoal);
      }
    } else {
      setGoalAmountValue(props.goal.amount.toFixed(0));
    }
  };

  return (
    <>
      {props.isSelected && props.goal.amount !== 0 ? (
        <Input
          className="ml-1 h-7 w-[85px] text-center text-lg"
          onClick={(e) => {
            e.stopPropagation();
          }}
          onChange={(e) => setGoalAmountValue(e.target.value)}
          onBlur={onInputBlur}
          value={goalAmountValue}
        />
      ) : (
        <span className="select-none font-semibold">
          {convertNumberToCurrency(
            getGoalTargetAmount(props.goal.amount, props.goal.initialAmount)
          )}
        </span>
      )}
    </>
  );
};

export default EditableGoalTargetAmountCell;
