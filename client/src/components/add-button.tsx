/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface AddButtonProps {
  children: JSX.Element;
}

const AddButton = ({ children }: AddButtonProps): JSX.Element => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <PlusIcon></PlusIcon>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={5} alignOffset={15}>
        {children}
      </PopoverContent>
    </Popover>
  );
};

export default AddButton;
