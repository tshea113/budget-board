import { Input } from '@/components/ui/input';
import { convertNumberToCurrency } from '@/lib/utils';
import { IGoalResponse } from '@/types/goal';
import React from 'react';

interface EditableGoalMonthlyAmountCellProps {
  goal: IGoalResponse;
  isSelected: boolean;
  editCell: (newGoal: IGoalResponse) => void;
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
        const newGoal: IGoalResponse = {
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
      {props.isSelected ? (
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
          {convertNumberToCurrency(props.goal.monthlyContribution)}
        </span>
      )}
    </>
  );
};

export default EditableGoalMonthlyAmountCell;
