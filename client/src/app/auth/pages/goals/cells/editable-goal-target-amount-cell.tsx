import { Input } from '@/components/ui/input';
import { getGoalTargetAmount } from '@/lib/goals';
import { convertNumberToCurrency } from '@/lib/utils';
import { IGoalResponse, IGoalUpdateRequest } from '@/types/goal';
import React, { type JSX } from 'react';

interface EditableGoalTargetAmountCellProps {
  goal: IGoalResponse;
  isSelected: boolean;
  editCell: (newGoal: IGoalUpdateRequest) => void;
}

const EditableGoalTargetAmountCell = (
  props: EditableGoalTargetAmountCellProps
): JSX.Element => {
  const [goalAmountValue, setGoalAmountValue] = React.useState<string>(
    props.goal.amount.toFixed(0)
  );

  const onInputBlur = (): void => {
    if (!isNaN(parseFloat(goalAmountValue))) {
      const newGoal: IGoalUpdateRequest = {
        ...props.goal,
        amount: parseFloat(goalAmountValue),
        accountIds: props.goal.accounts.map((account) => account.id),
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
