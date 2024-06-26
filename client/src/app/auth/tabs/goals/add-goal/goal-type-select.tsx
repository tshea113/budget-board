import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GoalType } from '@/types/goal';

interface GoalTypeSelectProps {
  defaultValue?: GoalType;
  onValueChange: (value: GoalType) => void;
}

const GoalTypeSelect = (props: GoalTypeSelectProps): JSX.Element => {
  return (
    <div className="m-2 flex flex-row space-x-2">
      <Select defaultValue={props.defaultValue} onValueChange={props.onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="I want to set a goal to..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={GoalType.SaveGoal}>Build my savings</SelectItem>
          <SelectItem value={GoalType.PayGoal}>Pay off a loan</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default GoalTypeSelect;
