import { ArrowDownIcon, ArrowUpIcon } from '@radix-ui/react-icons';
import { Button } from './ui/button';
import { ArrowUpDownIcon } from 'lucide-react';

const DataTableHeader = ({ column, label }: { column: any; label: string }): JSX.Element => {
  let sortedIcon = <ArrowUpDownIcon className="ml-2 h-4 w-4" />;
  switch (column.getIsSorted()) {
    case 'asc':
      sortedIcon = <ArrowUpIcon className="ml-2 h-4 w-4" />;
      break;
    case 'desc':
      sortedIcon = <ArrowDownIcon className="ml-2 h-4 w-4" />;
      break;
    default:
      break;
  }

  return (
    <Button
      variant="ghost"
      onClick={() => {
        column.toggleSorting(column.getIsSorted() === 'asc');
      }}
    >
      {label}
      {sortedIcon}
    </Button>
  );
};

export default DataTableHeader;
