import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface GoalSelectProps {
  defaultValue: string;
  onValueChange: (value: string) => void;
}

const GoalSelect = (props: GoalSelectProps): JSX.Element => {
  return (
    <div className="space-y-2">
      <span className="text-sm">I want to set a goal with...</span>
      <RadioGroup defaultValue={props.defaultValue} onValueChange={props.onValueChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="timedGoal" id="timedGoal" />
          <Label htmlFor="timedGoal">a specific end date</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="monthlyGoal" id="monthlyGoal" />
          <Label htmlFor="monthlyGoal">a specific amount contributed each month</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default GoalSelect;
