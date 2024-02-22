/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import AddTransaction from './add-transaction';

const AddTransactionButton = (): JSX.Element => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="outline">
          <PlusIcon></PlusIcon>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <AddTransaction />
      </PopoverContent>
    </Popover>
  );
};

export default AddTransactionButton;
