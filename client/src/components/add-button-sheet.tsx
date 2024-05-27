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
      <SheetContent side="top" className="flex flex-col justify-center">
        <div className="flex w-full flex-row justify-center">{children}</div>
      </SheetContent>
    </Sheet>
  );
};

export default AddButtonSheet;
