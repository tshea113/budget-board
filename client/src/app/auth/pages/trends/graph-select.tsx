import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { GraphType } from '@/types/trends';

import type { JSX } from "react";

interface GraphSelectProps {
  graphType: GraphType;
  setGraphType: (graphType: GraphType) => void;
}

const GraphSelect = (props: GraphSelectProps): JSX.Element => {
  return (
    <div className="flex flex-row @container">
      <div className="@lg:hidden">
        <Select value={props.graphType} onValueChange={props.setGraphType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a graph..." />
          </SelectTrigger>
          <SelectContent>
            {Object.values(GraphType).map((graphType) => (
              <SelectItem key={graphType} value={graphType}>
                {graphType}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="hidden flex-row gap-2 @lg:flex">
        {Object.values(GraphType).map((graphType) => (
          <Button
            key={graphType}
            variant="outline"
            size="sm"
            onClick={() => props.setGraphType(graphType)}
            className={cn(
              props.graphType === graphType
                ? 'border-primary text-primary hover:text-primary'
                : ''
            )}
          >
            {graphType}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GraphSelect;
