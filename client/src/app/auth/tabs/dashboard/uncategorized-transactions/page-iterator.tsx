import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface PageIteratorProps {
  className?: string;
  page: number;
  maxPages: number;
  setPage: (page: number) => void;
}

const PageIterator = (props: PageIteratorProps): JSX.Element => {
  const changePage = (newPage: number) => {
    if (newPage < 1) {
      props.setPage(props.maxPages);
    } else if (newPage > props.maxPages) {
      props.setPage(1);
    } else {
      props.setPage(newPage);
    }
  };
  return (
    <div
      className={cn(
        'flex flex-row items-center justify-center space-x-1',
        props.className
      )}
    >
      <Button className="p-2" variant="ghost" onClick={() => changePage(props.page - 1)}>
        <ChevronLeftIcon />
      </Button>
      <div className="text-lg font-semibold">
        Page {props.page} of {props.maxPages}
      </div>
      <Button className="p-2" variant="ghost" onClick={() => changePage(props.page + 1)}>
        <ChevronRightIcon />
      </Button>
    </div>
  );
};

export default PageIterator;
