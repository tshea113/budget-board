import { Button } from '@/components/ui/button';
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react';

import type { JSX } from 'react';

export enum SortDirection {
  None,
  Ascending,
  Decending,
}

interface SortButtonProps {
  label: string;
  sortDirection: SortDirection;
  onClick: () => void;
}

const SortButton = (props: SortButtonProps): JSX.Element => {
  let sortedIcon = <ArrowUpDownIcon className="ml-2 h-4 w-4" />;
  switch (props.sortDirection) {
    case SortDirection.Ascending:
      sortedIcon = <ArrowUpIcon className="ml-2 h-4 w-4" />;
      break;
    case SortDirection.Decending:
      sortedIcon = <ArrowDownIcon className="ml-2 h-4 w-4" />;
      break;
    default:
      break;
  }

  return (
    <Button
      className="hover:border-primary hover:bg-background"
      variant="outline"
      onClick={props.onClick}
    >
      {props.label}
      {sortedIcon}
    </Button>
  );
};

export default SortButton;
