import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { GoalCondition } from '@/types/goal';

interface GoalSelectProps {
  defaultValue: string;
  onValueChange: (goalType: GoalCondition) => void;
}

const GoalConditionSelect = (props: GoalSelectProps): JSX.Element => {
  return (
    <div className="space-y-2">
      <span className="text-sm">I want to set a goal with a specified...</span>
      <RadioGroup defaultValue={props.defaultValue} onValueChange={props.onValueChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value={GoalCondition.TimedGoal} id="0" />
          <Label htmlFor="0">end date</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value={GoalCondition.MonthlyGoal} id="1" />
          <Label htmlFor="1">monthly contribution</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default GoalConditionSelect;
