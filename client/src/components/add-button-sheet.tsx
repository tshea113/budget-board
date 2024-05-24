/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

interface AddButtonProps {
  children: JSX.Element;
}

const AddButtonSheet = ({ children }: AddButtonProps): JSX.Element => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <PlusIcon></PlusIcon>
        </Button>
      </SheetTrigger>
      <SheetContent side="top">{children}</SheetContent>
    </Sheet>
  );
};

export default AddButtonSheet;
