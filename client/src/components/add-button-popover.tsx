/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { PlusIcon } from 'lucide-react';
import { JSX } from 'react';

interface AddButtonProps {
  children: JSX.Element;
}

const AddButtonPopover = ({ children }: AddButtonProps): JSX.Element => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <PlusIcon className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={5} alignOffset={15} className="p-2">
        {children}
      </PopoverContent>
    </Popover>
  );
};

export default AddButtonPopover;
