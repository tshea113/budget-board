import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface PageSizeSelectProps {
  pageSize: number;
  setPageSize: (newPageSize: number) => void;
  pageSizeOptions: number[];
}

const PageSizeSelect = (props: PageSizeSelectProps): JSX.Element => {
  return (
    <div className="flex items-center space-x-2">
      <p className="text-sm font-medium">Items per page</p>
      <Select
        value={`${props.pageSize}`}
        onValueChange={(value) => props.setPageSize(parseInt(value))}
      >
        <SelectTrigger className="h-8 w-[70px]">
          <SelectValue placeholder={props.pageSize} />
        </SelectTrigger>
        <SelectContent side="bottom">
          {props.pageSizeOptions.map((pageSize) => (
            <SelectItem key={pageSize} value={`${pageSize}`}>
              {pageSize}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PageSizeSelect;
