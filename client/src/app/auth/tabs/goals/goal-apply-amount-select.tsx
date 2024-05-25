import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface GoalSelectProps {
  defaultValue: boolean;
  onValueChange: (value: boolean) => void;
}

const GoalApplyAccountSelect = (props: GoalSelectProps): JSX.Element => {
  const RadioStringToBoolean = (radioString: string): boolean => {
    if (radioString === 'yes') {
      return true;
    } else {
      return false;
    }
  };

  const onRadioChange = (radioValue: string): void => {
    props.onValueChange(RadioStringToBoolean(radioValue));
  };

  return (
    <div className="space-y-2">
      <span className="text-sm">Should the existing account balance be applied to the goal?</span>
      <RadioGroup defaultValue={props.defaultValue ? 'yes' : 'no'} onValueChange={onRadioChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="yes" id="yes" />
          <Label htmlFor="yes">Yes</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="no" id="monthlyGoal" />
          <Label htmlFor="monthlyGoal">No</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default GoalApplyAccountSelect;
