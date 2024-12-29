import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GraphType } from '@/types/trends';

interface GraphSelectProps {
  graphType: GraphType;
  setGraphType: (graphType: GraphType) => void;
}

const GraphSelect = (props: GraphSelectProps): JSX.Element => {
  return (
    <div>
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
  );
};

export default GraphSelect;
