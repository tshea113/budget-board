import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { Button } from './ui/button';

interface PageSelectProps {
  pageNumber: number;
  setPageNumber: (newPageNumber: number) => void;
  totalPages: number;
}

const PageSelect = (props: PageSelectProps): JSX.Element => {
  return (
    <div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="flex h-8 w-8 p-0"
          onClick={() => props.setPageNumber(1)}
          disabled={props.pageNumber === 1}
        >
          <span className="sr-only">Go to first page</span>
          <DoubleArrowLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => props.setPageNumber(props.pageNumber - 1)}
          disabled={props.pageNumber === 1}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">
          Page {props.pageNumber} of {props.totalPages}
        </span>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => props.setPageNumber(props.pageNumber + 1)}
          disabled={props.pageNumber === props.totalPages}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="flex h-8 w-8 p-0"
          onClick={() => props.setPageNumber(props.totalPages)}
          disabled={props.pageNumber === props.totalPages}
        >
          <span className="sr-only">Go to last page</span>
          <DoubleArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PageSelect;
