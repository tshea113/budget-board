import { Input } from '@/components/ui/input';
import { getMonthlyContributionTotal } from '@/lib/goals';
import { convertNumberToCurrency } from '@/lib/utils';
import { Goal } from '@/types/goal';
import React from 'react';

interface EditableGoalMonthlyAmountCellProps {
  goal: Goal;
  isSelected: boolean;
  editCell: (newGoal: Goal) => void;
}

const EditableGoalMonthlyAmountCell = (
  props: EditableGoalMonthlyAmountCellProps
): JSX.Element => {
  const [goalAmountValue, setGoalAmountValue] = React.useState<string>(
    (props.goal.monthlyContribution ?? 0).toFixed(0)
  );

  const onInputBlur = (): void => {
    if (props.goal.monthlyContribution) {
      if (!isNaN(parseFloat(goalAmountValue))) {
        const newGoal: Goal = {
          ...props.goal,
          monthlyContribution: parseFloat(goalAmountValue),
        };
        if (props.editCell != null) {
          props.editCell(newGoal);
        }
      } else {
        setGoalAmountValue(props.goal.monthlyContribution.toFixed(0));
      }
    }
  };

  return (
    <>
      {props.isSelected && props.goal.monthlyContribution ? (
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
        <span className="font-semibold">
          {convertNumberToCurrency(getMonthlyContributionTotal(props.goal))}
        </span>
      )}
    </>
  );
};

export default EditableGoalMonthlyAmountCell;
