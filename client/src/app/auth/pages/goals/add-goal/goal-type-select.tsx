import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GoalType } from '@/types/goal';

import type { JSX } from "react";

interface GoalTypeSelectProps {
  defaultValue?: GoalType;
  onValueChange: (value: GoalType) => void;
}

const GoalTypeSelect = (props: GoalTypeSelectProps): JSX.Element => {
  return (
    <div className="flex flex-row gap-2">
      <Select defaultValue={props.defaultValue} onValueChange={props.onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="I want to set a goal to..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={GoalType.SaveGoal}>Grow my funds</SelectItem>
          <SelectItem value={GoalType.PayGoal}>Pay off a loan</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default GoalTypeSelect;
